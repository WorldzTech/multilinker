import MultiLinkForm from "@/components/MultiLinkForm";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Route{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Links
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Соберите все свои ссылки на одной странице и поделитесь короткой ссылкой
          </p>
        </div>
        <MultiLinkForm />
      </div>
    </main>
  );
}
