import { createSignal, createResource, JSX } from "solid-js";
import { Button } from "@components/uikit/Button";
import { Input } from "@components/uikit/Input";
import { VStack } from "@components/uikit/Stack";
import { A, useNavigate } from "@solidjs/router";

function useSignIn() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = createSignal<SignInCredentials | null>(
    null,
  );
  const [response, { refetch }] = createResource<
    { success: boolean; data: SignInResponse } | null,
    SignInCredentials | null
  >(credentials, async (creds: SignInCredentials | null) => {
    if (!creds) return null;
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      if (!res.ok) {
        throw new Error(`Ошибка входа: ${res.statusText}`);
      }
      const data: SignInResponse = await res.json();
      if (data.accessToken) {
        localStorage.setItem("access_token", data.accessToken);
        navigate("/");
        return { success: true, data };
      }
      throw new Error("Токен не получен");
    } catch (error) {
      console.error("Ошибка при входе:", error);
      throw error;
    }
  });

  const signIn = (nickname: string, password: string) => {
    if (!nickname || !password) {
      return { error: new Error("Никнейм и пароль обязательны") };
    }
    setCredentials({ nickname, password });
  };

  return {
    response,
    loading: () => response.loading,
    error: () => response.error as Error | undefined,
    signIn,
    refetch,
  };
}

export function Signin(): JSX.Element {
  const [nickname, setNickname] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const { loading, error, signIn } = useSignIn();

  const handleSignIn = () => {
    signIn(nickname(), password());
  };

  return (
    <div class="flex h-screen w-full items-center justify-center">
      <VStack class="w-max items-center gap-12">
        <h1 class="text-dark/50 w-full text-center text-4xl">Вход</h1>
        <VStack class="gap-2">
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
          </VStack>
          <Button
            onClick={handleSignIn}
            variant="solid"
            class="text-center"
            disabled={loading()}
          >
            {loading() ? "Загрузка..." : "Войти"}
          </Button>
          <p class="text-center text-xs">
            Еще нет аккаунта? <br />
            <A class="text-blue-800 underline" href="/signup">
              Зарегистрироваться
            </A>
          </p>
        </VStack>
      </VStack>
    </div>
  );
}
