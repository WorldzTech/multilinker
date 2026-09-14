import { z } from "zod";

export const shortLinkSchema = z.object({
  url: z
    .string()
    .min(1, "Укажите URL")
    .url("Введите корректный URL, например https://example.com"),
});

export type ShortLinkFormData = z.infer<typeof shortLinkSchema>;

export interface ShortLinkData {
  id: string;
  slug: string;
  url: string;
  click_count: number;
  created_at: string;
}
