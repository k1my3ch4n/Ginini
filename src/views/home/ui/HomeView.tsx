import { ConverterWidget } from "@widgets/converter";

export function HomeView() {
  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <header className="text-center py-10 px-4">
        <div className="text-5xl mb-3">🐹</div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Ginini
        </h1>
        <p className="mt-2 text-gray-500 text-base max-w-xs mx-auto">
          내 사진을 귀여운 기니피그 캐릭터로 변환해 드려요
        </p>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">
          <ConverterWidget />
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400">
        © 2025 Ginini · 사진은 서버에 저장되지 않습니다
      </footer>
    </div>
  );
}
