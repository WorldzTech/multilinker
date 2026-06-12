import { z } from "zod";

export const linkItemSchema = z.object({
  title: z
    .string()
    .min(1, "Укажите название ссылки")
    .max(100, "Максимум 100 символов"),
  url: z
    .string()
    .min(1, "Укажите URL")
    .url("Введите корректный URL, например https://example.com"),
});

export const multiLinkSchema = z.object({
  title: z
    .string()
    .min(1, "Укажите название мультиссылки")
    .max(100, "Максимум 100 символов"),
  description: z.string().max(1000, "Максимум 1000 символов").optional(),
  items: z
    .array(linkItemSchema)
    .min(1, "Добавьте хотя бы одну ссылку"),
});

export type MultiLinkFormData = z.infer<typeof multiLinkSchema>;
export type LinkItemFormData = z.infer<typeof linkItemSchema>;
