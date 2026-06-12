import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LinkCard from "@/components/LinkCard";
import type { MultiLinkData } from "@/lib/types";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

interface PageProps {
  params: { slug: string };
}

async function getMultiLink(slug: string): Promise<MultiLinkData | null> {
  const res = await fetch(`${API_URL}/s/${slug}/`, { cache: "no-store" });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to load multilink: ${res.status}`);
  }

  return res.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getMultiLink(params.slug);

  if (!data) {
    return { title: "Страница не найдена — Route Links" };
  }

  return {
    title: `${data.title} — Route Links`,
    description: data.description || undefined,
    openGraph: {
      title: data.title,
      description: data.description || undefined,
    },
  };
}

export default async function PublicMultiLinkPage({ params }: PageProps) {
  const data = await getMultiLink(params.slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-black">{data.title}</h1>
          {data.description && (
            <p className="mt-2 text-sm text-gray-500">{data.description}</p>
          )}
        </div>

        <div className="space-y-3">
          {data.items.map((item) => (
            <LinkCard key={item.id} slug={data.slug} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
