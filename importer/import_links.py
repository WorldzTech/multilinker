#!/usr/bin/env python3
"""Импорт ссылок из методических материалов в мультиссылку Route Links.

Использование:
    python import_links.py [путь_к_файлу]

Если путь к файлу не передан аргументом, скрипт спросит его интерактивно.
Название и описание мультиссылки запрашиваются всегда.
"""

import os
import sys
from pathlib import Path

import requests
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

API_URL = os.environ.get("MULTILINK_API_URL", "http://localhost:8000/api/v1")
PUBLIC_BASE_URL = os.environ.get("PUBLIC_BASE_URL", "http://localhost:3000")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
ANTHROPIC_MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-4-6")

MAX_TITLE_LENGTH = 100
CHUNK_SIZE = 60_000  # символов на один запрос к Claude

EXTRACTION_TOOL = {
    "name": "save_links",
    "description": "Сохранить список ссылок, найденных в тексте, с их названиями.",
    "input_schema": {
        "type": "object",
        "properties": {
            "links": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "Короткое понятное название ссылки на русском языке",
                        },
                        "url": {
                            "type": "string",
                            "description": "Полный URL ссылки",
                        },
                    },
                    "required": ["title", "url"],
                },
            }
        },
        "required": ["links"],
    },
}

EXTRACTION_PROMPT = """\
Ниже приведён фрагмент методических материалов. В нём могут встречаться ссылки \
в самых разных форматах: markdown-ссылки [Название](URL), HTML-теги <a href="...">, \
обычные URL в тексте, ссылки в списках, ссылки с подписями рядом или перед ними и т.д.

Найди ВСЕ ссылки (URL, начинающиеся на http:// или https://, либо www.) в этом тексте \
и для каждой определи короткое и понятное название на русском языке:
- если рядом со ссылкой есть подпись, заголовок или описание — используй его (сократив при необходимости);
- если явной подписи нет — придумай короткое название по контексту или содержимому URL.

Не придумывай ссылки, которых нет в тексте. Не пропускай повторяющиеся ссылки, если они \
встречаются с разными подписями. Сохраняй порядок, в котором ссылки встречаются в тексте.

Текст:
---
{text}
---

Вызови функцию save_links со списком найденных ссылок."""


def chunk_text(text: str, size: int = CHUNK_SIZE) -> list[str]:
    if len(text) <= size:
        return [text]

    lines = text.splitlines(keepends=True)
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0

    for line in lines:
        if current_len + len(line) > size and current:
            chunks.append("".join(current))
            current = []
            current_len = 0
        current.append(line)
        current_len += len(line)

    if current:
        chunks.append("".join(current))

    return chunks


def extract_links_from_chunk(client: Anthropic, text: str) -> list[dict]:
    message = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=8000,
        tools=[EXTRACTION_TOOL],
        tool_choice={"type": "tool", "name": "save_links"},
        messages=[{"role": "user", "content": EXTRACTION_PROMPT.format(text=text)}],
    )

    for block in message.content:
        if block.type == "tool_use" and block.name == "save_links":
            return block.input.get("links", [])

    return []


def normalize_url(url: str) -> str:
    url = url.strip()
    if url.startswith("www."):
        return f"https://{url}"
    return url


def extract_links(text: str) -> list[dict]:
    client = Anthropic(api_key=ANTHROPIC_API_KEY)

    chunks = chunk_text(text)
    seen_urls: set[str] = set()
    links: list[dict] = []

    for i, chunk in enumerate(chunks, start=1):
        if len(chunks) > 1:
            print(f"  Обрабатываю фрагмент {i}/{len(chunks)}...")

        for link in extract_links_from_chunk(client, chunk):
            url = normalize_url(link.get("url", ""))
            title = (link.get("title") or url).strip()[:MAX_TITLE_LENGTH]

            if not url or url in seen_urls:
                continue

            seen_urls.add(url)
            links.append({"title": title, "url": url})

    return links


def create_multilink(title: str, description: str, links: list[dict]) -> dict:
    payload = {
        "title": title,
        "description": description,
        "items": [
            {"title": link["title"], "url": link["url"], "order": i}
            for i, link in enumerate(links)
        ],
    }

    response = requests.post(f"{API_URL}/multilinks/", json=payload)

    if not response.ok:
        print(f"Ошибка API ({response.status_code}): {response.text}")
        sys.exit(1)

    return response.json()


def main() -> None:
    if not ANTHROPIC_API_KEY:
        print("Ошибка: не задан ANTHROPIC_API_KEY (переменная окружения или .env).")
        sys.exit(1)

    title = input("Название мультиссылки: ").strip()
    if not title:
        print("Название не может быть пустым.")
        sys.exit(1)

    description = input("Описание (необязательно, Enter — пропустить): ").strip()

    file_arg = sys.argv[1] if len(sys.argv) > 1 else None
    file_path = file_arg or input("Путь к файлу с материалами: ").strip()
    path = Path(file_path).expanduser()

    if not path.is_file():
        print(f"Файл не найден: {path}")
        sys.exit(1)

    text = path.read_text(encoding="utf-8", errors="ignore")

    print("\nИщу ссылки с помощью Claude...")
    links = extract_links(text)

    if not links:
        print("Ссылок не найдено.")
        sys.exit(1)

    print(f"\nНайдено {len(links)} ссылок:")
    for i, link in enumerate(links, start=1):
        print(f"  {i}. {link['title']} — {link['url']}")

    confirm = input("\nСоздать мультиссылку с этими ссылками? [Y/n]: ").strip().lower()
    if confirm == "n":
        print("Отменено.")
        return

    result = create_multilink(title, description, links)
    print(f"\nГотово! {PUBLIC_BASE_URL}/s/{result['slug']}")


if __name__ == "__main__":
    main()
