"use client";

import { api } from "@/lib/api";
import type { LinkItemData } from "@/lib/types";

interface LinkCardProps {
  slug: string;
  item: LinkItemData;
}

export default function LinkCard({ slug, item }: LinkCardProps) {
  const handleClick = async () => {
    try {
      await api.post(`/s/${slug}/click/${item.id}/`);
    } catch {
      // ignore tracking errors, still open the link
    } finally {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="block w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-center font-medium text-black shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md hover:shadow-primary/10"
    >
      {item.title}
    </button>
  );
}
