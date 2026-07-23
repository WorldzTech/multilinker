"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { multiLinkSchema, type MultiLinkFormData } from "@/lib/schema";
import { api } from "@/lib/api";
import type { MultiLinkData } from "@/lib/types";
import SortableLinkItem from "./SortableLinkItem";
import CreateResult from "./CreateResult";

const emptyItem = { title: "", url: "", comment: "" };

export default function MultiLinkForm() {
  const [result, setResult] = useState<MultiLinkData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MultiLinkFormData>({
    resolver: zodResolver(multiLinkSchema),
    defaultValues: {
      title: "",
      description: "",
      items: [{ ...emptyItem }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "items",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((field) => field.id === active.id);
    const newIndex = fields.findIndex((field) => field.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      move(oldIndex, newIndex);
    }
  };

  const onSubmit = async (data: MultiLinkFormData) => {
    setSubmitError(null);
    try {
      const payload = {
        title: data.title,
        description: data.description || "",
        items: data.items.map((item, index) => ({
          title: item.title,
          url: item.url,
          order: index,
          comment: item.comment ?? "",
        })),
      };
      const response = await api.post<MultiLinkData>("/multilinks/", payload);
      setResult(response.data);
    } catch {
      setSubmitError("Не удалось создать мультиссылку. Попробуйте ещё раз.");
    }
  };

  const handleReset = () => {
    setResult(null);
    setSubmitError(null);
    reset({ title: "", description: "", items: [{ ...emptyItem }] });
  };

  if (result) {
    return <CreateResult result={result} onReset={handleReset} />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-black/10 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-black">
          Название мультиссылки
        </label>
        <input
          id="title"
          type="text"
          placeholder="Например: Мои соцсети"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          {...register("title")}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-accent">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-black">
          Описание
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Необязательное описание страницы"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-accent">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-black">Ссылки</label>

        {errors.items?.root && (
          <p className="mb-2 text-xs text-accent">{errors.items.root.message}</p>
        )}
        {errors.items && !errors.items.root && typeof errors.items.message === "string" && (
          <p className="mb-2 text-xs text-accent">{errors.items.message}</p>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {fields.map((field, index) => (
                <SortableLinkItem
                  key={field.id}
                  id={field.id}
                  index={index}
                  register={register}
                  errors={errors}
                  onRemove={() => remove(index)}
                  canRemove={fields.length > 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          type="button"
          onClick={() => append({ ...emptyItem })}
          className="mt-3 w-full rounded-md border border-dashed border-primary/40 px-3 py-2 text-sm font-medium text-primary hover:border-primary hover:bg-primary-light"
        >
          + Добавить ссылку
        </button>
      </div>

      {submitError && <p className="text-sm text-accent">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Создание..." : "Создать"}
      </button>
    </form>
  );
}
