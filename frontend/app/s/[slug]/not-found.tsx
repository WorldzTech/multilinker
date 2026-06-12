export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="bg-gradient-to-r from-primary to-accent bg-clip-text text-7xl font-bold text-transparent">
        404
      </p>
      <h1 className="mt-4 text-xl font-semibold text-black">
        Мультиссылка не найдена
      </h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        Эта страница не существует или была удалена. Проверьте ссылку или
        создайте свою собственную.
      </p>
    </main>
  );
}
