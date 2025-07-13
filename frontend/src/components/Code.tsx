export function Code() {
  return (
    <div class="col-span-2 col-start-1 row-span-2 row-start-1 rounded-md bg-zinc-900/70 p-6">
      <h3 class="mb-4 text-xl font-bold">Создайте код приглашения</h3>
      <button class="group relative inline-flex transform items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-bold text-black transition duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700">
        <span class="relative z-10">Создать код</span>
        <span class="absolute inset-0 h-full w-full -translate-x-full transform bg-gradient-to-r from-amber-300 to-amber-600 transition duration-300 group-hover:translate-x-0"></span>
      </button>
      <div class="mt-3 inline-block rounded-md bg-zinc-800 p-3 font-mono text-sm text-green-400">
        Новый код:
        <button class="ml-2 text-xs text-amber-400 underline">
          Скопировать
        </button>
      </div>
    </div>
  );
}
