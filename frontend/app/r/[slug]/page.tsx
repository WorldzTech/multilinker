import { notFound, redirect } from "next/navigation";
import type { ShortLinkData } from "@/lib/short";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

interface PageProps {
  params: { slug: string };
}

export default async function ShortLinkRedirectPage({ params }: PageProps) {
  const res = await fetch(`${API_URL}/r/${params.slug}/`, { cache: "no-store" });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error(`Failed to resolve short link: ${res.status}`);
  }

  const data: ShortLinkData = await res.json();
  redirect(data.url);
}
