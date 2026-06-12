"use client";

import { useState } from "react";
import type { MultiLinkData } from "@/lib/types";

interface CreateResultProps {
  result: MultiLinkData;
  onReset: () => void;
}

export default function CreateResult({ result, onReset }: CreateResultProps) {
  const [copied, setCopied] = useState(false);

  const shortUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/s/${result.slug}`
      : `/s/${result.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable, ignore
    }
  };

  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#005BFF" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-black">Мультиссылка создана!</h2>
      <p className="mt-1 text-sm text-gray-500">«{result.title}»</p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={shortUrl}
          className="w-full flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
          onFocus={(e) => e.target.select()}
        />
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          {copied ? "Скопировано!" : "Скопировать ссылку"}
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md border border-black/10 px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
        >
          Открыть страницу
        </a>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 rounded-md border border-black/10 px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
        >
          Создать ещё одну
        </button>
      </div>
    </div>
  );
}
