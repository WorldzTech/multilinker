"use client";

import { api } from "@/lib/api";
import type { LinkItemData } from "@/lib/types";

interface LinkCardProps {
  slug: string;
  item: LinkItemData;
}

export default function LinkCard({ slug, item }: LinkCardProps) {
  const handleClick = () => {
    api.post(`/s/${slug}/click/${item.id}/`).catch(() => {});
  };

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md hover:shadow-primary/10"
    >
      <span className="font-medium text-black">{item.title}</span>
      {item.comment && (
        <span className="mt-1 block text-xs text-gray-400">{item.comment}</span>
      )}
    </a>
  );
}
