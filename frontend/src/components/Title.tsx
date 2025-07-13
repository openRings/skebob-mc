export function Title() {
  return (
    <header class="mt-8 flex w-[1200px] items-center justify-between rounded-t-xl bg-lime-900 px-8 py-4 drop-shadow-2xl">
      <div class="flex items-center gap-4">
        <img
          src="assets/temp_logo.jpg"
          alt="SkebobMC Logo"
          class="brounded-md h-16 w-16 border-2 border-amber-400"
        />
        <h2 class="font-header bg-gradient-to-r from-amber-100 to-amber-400 bg-clip-text text-2xl font-bold uppercase text-transparent">
          SkebobMC
        </h2>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-4 rounded-md bg-zinc-800 px-4 py-2 text-lg font-semibold uppercase">
          <a
            href="/rules"
            class="after:ml-4 after:text-white after:content-['|']"
          >
            Правила
          </a>
          <a
            href="/tutorial"
            class="after:ml-4 after:text-white after:content-['|']"
          >
            Как зайти
          </a>
          <a href="/mods">Подборка модов</a>
        </div>
        <a
          class="rounded-md bg-amber-400 px-4 py-2 text-lg font-bold uppercase text-black transition-colors duration-300 hover:bg-amber-500"
          href="/auth"
        >
          Войти
        </a>
      </div>
    </header>
  );
}
