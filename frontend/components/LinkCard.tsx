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
      className="block w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-center font-medium text-black shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md hover:shadow-primary/10"
    >
      {item.title}
    </a>
  );
}
