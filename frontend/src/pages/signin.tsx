import { createSignal, createResource, JSX } from "solid-js";
import { Button } from "@components/uikit/Button";
import { Input } from "@components/uikit/Input";
import { VStack } from "@components/uikit/Stack";
import { A, useNavigate, useSearchParams } from "@solidjs/router";

export function Signin(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const [nickname, setNickname] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [error, setError] = createSignal<string>("");
  const [loading, setLoading] = createSignal<boolean>(false);

  const [inviteCode, setInviteCode] = createSignal<string>(
    (Array.isArray(searchParams.code)
      ? searchParams.code[0]
      : searchParams.code) || "",
  );

  const navigate = useNavigate();

  const handleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname(), password: password() }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let message;

        try {
          const { error: serverError } = JSON.parse(errorText);
          message = serverError || response.statusText;
        } catch {
          message = errorText || `HTTP error ${response.status}`;
        }
        if (response.status === 401) {
          throw new Error("Авторизуйтесь еще раз!");
        }

        throw new Error(message);
      }

      const { accessToken } = await response.json();
      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
      }
      if (inviteCode()) {
        navigate(`/?code=${inviteCode()}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex h-screen w-full items-center justify-center">
      <VStack class="w-max items-center gap-12">
        <h1 class="text-dark/50 w-full text-center text-4xl">Вход</h1>
        <VStack class="w-xs gap-2">
          {error() && <p class="text-center text-red-500">{error()}</p>}
          <VStack class="w-full gap-2">
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
            <A
              class="text-blue-800 underline transition-colors hover:text-blue-700"
              href={inviteCode() ? `/signup?code=${inviteCode()}` : "/signup"}
            >
              Зарегистрироваться
            </A>
          </p>
        </VStack>
      </VStack>
    </div>
  );
}
