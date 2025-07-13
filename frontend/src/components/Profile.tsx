export function Profile() {
  return (
    <div class="col-span-2 col-start-3 row-span-4 row-start-1 rounded-md bg-zinc-900/70 p-6 shadow-xl">
      <h2 class="mb-4 text-2xl font-bold uppercase">Профиль</h2>
      <div class="flex flex-col items-center gap-6 md:flex-row">
        <img
          src="/assets/avatar.jpg"
          alt="Аватар"
          class="h-24 w-24 border-2 border-amber-400"
        />
        <div class="space-y-2">
          <h3 class="text-2xl font-semibold">rrrrr</h3>
          <p class="text-zinc-400">tttttttt</p>
        </div>
      </div>
    </div>
  );
}
