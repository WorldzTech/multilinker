"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { MultiLinkFormData } from "@/lib/schema";

interface SortableLinkItemProps {
  id: string;
  index: number;
  register: UseFormRegister<MultiLinkFormData>;
  errors: FieldErrors<MultiLinkFormData>;
  onRemove: () => void;
  canRemove: boolean;
}

export default function SortableLinkItem({
  id,
  index,
  register,
  errors,
  onRemove,
  canRemove,
}: SortableLinkItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const titleError = errors.items?.[index]?.title?.message;
  const urlError = errors.items?.[index]?.url?.message;
  const commentError = errors.items?.[index]?.comment?.message;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3"
    >
      <button
        type="button"
        aria-label="Изменить порядок"
        className="mt-1 flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded text-gray-400 hover:bg-primary-light hover:text-primary active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="4" cy="3" r="1.3" />
          <circle cx="4" cy="8" r="1.3" />
          <circle cx="4" cy="13" r="1.3" />
          <circle cx="12" cy="3" r="1.3" />
          <circle cx="12" cy="8" r="1.3" />
          <circle cx="12" cy="13" r="1.3" />
        </svg>
      </button>

      <div className="flex-1 space-y-2">
        <div>
          <input
            type="text"
            placeholder="Название ссылки"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register(`items.${index}.title`)}
          />
          {titleError && (
            <p className="mt-1 text-xs text-accent">{titleError}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="https://example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register(`items.${index}.url`)}
          />
          {urlError && <p className="mt-1 text-xs text-accent">{urlError}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Подсказка"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register(`items.${index}.comment`)}
          />
          {commentError && <p className="mt-1 text-xs text-accent">{commentError}</p>}
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label="Удалить ссылку"
        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded text-gray-400 hover:bg-accent-light hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M14 6l-8 8" />
        </svg>
      </button>
    </div>
  );
}
