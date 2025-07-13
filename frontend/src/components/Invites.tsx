export function Invites() {
  return (
    <div class="col-span-2 row-span-2 row-start-3 rounded-md bg-zinc-900/70 p-6">
      <h3 class="mb-4 text-xl font-bold">Ваши коды приглашений</h3>
      <ul class="space-y-3">
        <li class="italic text-zinc-500">Нет активных кодов</li>

        <li class="group relative cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800/70 p-4 transition-colors hover:border-amber-500">
          <div class="font-mono text-lg text-amber-300"></div>
          <div class="mt-1 text-sm">
            <span class="text-green-400">Использован:</span>

            <span class="text-red-400">Не использован</span>
          </div>
          <div class="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100">
            <button class="text-xs text-amber-400 transition hover:text-amber-200">
              Копировать
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}
