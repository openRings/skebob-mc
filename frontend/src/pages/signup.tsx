import { createSignal, createResource, JSX } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { Button } from "@components/uikit/Button";
import { Input } from "@components/uikit/Input";
import { VStack } from "@components/uikit/Stack";

export function Signup(): JSX.Element {
  const [nickname, setNickname] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [passwordRepeat, setPasswordRepeat] = createSignal<string>("");
  const [inviteCode, setInviteCode] = createSignal<string>("");

  const [error, setError] = createSignal<string>("");
  const [loading, setLoading] = createSignal<boolean>(false);

  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: nickname(),
          password: password(),
          password_repeat: passwordRepeat(),
          invite_code: inviteCode(),
        }),
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

      navigate("/signin");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex h-screen w-full items-center justify-center">
      <VStack class="w-xs items-center gap-12">
        <h1 class="text-dark/50 w-full text-center text-4xl">Регистрация</h1>
        <VStack class="w-full gap-6">
          {error() && <p class="text-center text-red-500">{error()}</p>}
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
