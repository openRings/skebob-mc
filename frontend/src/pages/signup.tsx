import { createSignal, createResource, JSX } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { Button } from "@components/uikit/Button";
import { Input } from "@components/uikit/Input";
import { VStack } from "@components/uikit/Stack";

function useSignUp() {
  const [credentials, setCredentials] = createSignal<SignUpCredentials | null>(
    null,
  );

  const [response, { refetch }] = createResource<
    { success: boolean } | null,
    SignUpCredentials | null
  >(credentials, async (creds: SignUpCredentials | null) => {
    const navigate = useNavigate();
    if (!creds) return null;
    try {
      if (creds.password !== creds.password_repeat) {
        throw new Error("Пароли не совпадают");
      }
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: creds.nickname,
          password: creds.password,
          password_repeat: creds.password_repeat,
        }),
      });

      let data;
      if (res.headers.get("content-length") !== "0") {
        data = await res.json();
      } else {
        data = {};
      }

      if (!res.ok) {
        throw new Error(`Ошибка регистрации: ${data["error"]}`);
      }
      navigate("/signin");
      return { success: true };
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      throw error;
    }
  });

  const signUp = (
    nickname: string,
    password: string,
    password_repeat: string,
  ) => {
    if (!nickname || !password || !password_repeat) {
      return { error: new Error("Все поля обязательны") };
    }
    setCredentials({ nickname, password, password_repeat });
  };

  return {
    response,
    loading: () => response.loading,
    error: () => response.error as Error | undefined,
    signUp,
    refetch,
  };
}

export function Signup(): JSX.Element {
  const [nickname, setNickname] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [passwordRepeat, setPasswordRepeat] = createSignal<string>("");
  const [inviteCode, setInviteCode] = createSignal<string>("");
  const { loading, error, signUp } = useSignUp();

  const handleSignUp = () => {
    signUp(nickname(), password(), passwordRepeat());
  };

  return (
    <div class="flex h-screen w-full items-center justify-center">
      <VStack class="w-max items-center gap-12">
        <h1 class="text-dark/50 w-full text-center text-4xl">Регистрация</h1>
        <VStack class="gap-6">
          {error() && (
            <p class="text-center text-red-500">{error()!.message}</p>
          )}
          <VStack class="gap-2">
            <Input
              placeholder="Никнейм"
              value={nickname()}
              onInput={(e) => setNickname(e.currentTarget.value)}
            />
            <Input
              placeholder="Пароль"
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
            <Input
              placeholder="Код приглашения"
              value={inviteCode()}
              onInput={(e) => setInviteCode(e.currentTarget.value)}
            />
            <Input
              placeholder="Повторите пароль"
              type="password"
              value={passwordRepeat()}
              onInput={(e) => setPasswordRepeat(e.currentTarget.value)}
            />
          </VStack>
          <Button
            onClick={handleSignUp}
            variant="solid"
            class="text-center"
            disabled={loading()}
          >
            {loading() ? "Загрузка..." : "Создать"}
          </Button>
          <p class="text-center text-xs">
            Уже есть аккаунт? <br />
            <A
              class="text-blue-800 underline transition-colors hover:text-blue-700"
              href="/signin"
            >
              Войти
            </A>
          </p>
        </VStack>
      </VStack>
    </div>
  );
}
