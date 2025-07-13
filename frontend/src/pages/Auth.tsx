import { createSignal } from "solid-js";
import { AuthInput } from "@components/AuthInput";
export function Auth() {
  const [nickname, setNickname] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [passwordRepeat, setPasswordRepeat] = createSignal("");

  async function AuthApi() {
    const response = await fetch("api/auth", {
      method: "POST",
    });
  }
  return (
    <section class="m-auto flex h-[500px] w-[400px] flex-col items-center gap-6 rounded-xl bg-zinc-800 p-4 pt-12 text-white drop-shadow-2xl">
      <h1 class="font-header text-2xl uppercase">Вход</h1>
      <div class="flex w-full flex-col items-center justify-center gap-5">
        <AuthInput
          type="text"
          value={nickname()}
          onInput={setNickname}
          label="Никнейм"
        />

        <AuthInput
          type="password"
          value={password()}
          onInput={setPassword}
          label="Пароль"
        />

        <AuthInput
          type="password"
          value={passwordRepeat()}
          onInput={setPasswordRepeat}
          label="Повторите пароль"
        />
      </div>

      <button
        type="submit"
        class="mt-2 self-center rounded-md bg-amber-500 px-6 py-2 text-lg font-bold uppercase text-black transition-colors hover:bg-amber-400"
      >
        Войти
      </button>
    </section>
  );
}
