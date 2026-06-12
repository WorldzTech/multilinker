# Importer

Скрипт для автоматического создания мультиссылки на Route Links из файла с
методическими материалами. Находит в тексте все ссылки (в любом формате —
markdown, HTML, обычные URL и т.д.), с помощью Claude подбирает для каждой
короткое название и создаёт мультиссылку через API.

## Установка

```bash
cd importer
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Заполните `.env`:
- `ANTHROPIC_API_KEY` — ключ Claude API (https://console.anthropic.com/);
- `MULTILINK_API_URL` — адрес backend API (по умолчанию `http://localhost:8000/api/v1`);
- `PUBLIC_BASE_URL` — адрес фронтенда, чтобы вывести готовую ссылку (по умолчанию `http://localhost:3000`).

## Запуск

```bash
python import_links.py путь/к/материалам.txt
```

Или без аргумента — скрипт спросит путь к файлу интерактивно:

```bash
python import_links.py
```

Скрипт спросит название и описание мультиссылки, затем найдёт все ссылки в
файле, покажет список найденных ссылок с названиями и попросит подтверждение
перед созданием мультиссылки.
