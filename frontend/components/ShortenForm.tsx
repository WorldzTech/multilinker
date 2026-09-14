"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { shortLinkSchema, type ShortLinkData, type ShortLinkFormData } from "@/lib/short";

export default function ShortenForm() {
  const [slug, setSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShortLinkFormData>({
    resolver: zodResolver(shortLinkSchema),
    defaultValues: { url: "" },
  });

  const shortUrl =
    slug && typeof window !== "undefined"
      ? `${window.location.origin}/r/${slug}`
      : slug
        ? `/r/${slug}`
        : "";

  const onSubmit = async (data: ShortLinkFormData) => {
    setSubmitError(null);
    try {
      const response = await api.post<ShortLinkData>("/shorten/", { url: data.url });
      setSlug(response.data.slug);
      reset({ url: "" });
    } catch {
      setSubmitError("Не удалось сократить ссылку. Попробуйте ещё раз.");
    }
  };

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 rounded-xl border border-black/10 bg-white p-6 shadow-sm"
    >
      <label htmlFor="short-url" className="block text-sm font-medium text-black">
        Сократить одну ссылку
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="short-url"
          type="text"
          placeholder="https://example.com/очень/длинная/ссылка"
          className="w-full flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          {...register("url")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "..." : "Сократить"}
        </button>
      </div>
      {errors.url && <p className="text-xs text-accent">{errors.url.message}</p>}
      {submitError && <p className="text-xs text-accent">{submitError}</p>}

      {slug && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={shortUrl}
            className="w-full flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
            onFocus={(e) => e.target.select()}
          />
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-md border border-black/10 px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
          >
            {copied ? "Скопировано!" : "Скопировать"}
          </button>
        </div>
      )}
    </form>
  );
}
