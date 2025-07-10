import { createSignal, JSX, createEffect } from "solid-js";
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { Button } from "@components/uikit/Button";
import { Input } from "@components/uikit/Input";
import { VStack } from "@components/uikit/Stack";
import { signin, signup } from "src/helpers/auth";
import { handleApiError } from "src/helpers/api";

export function Signup(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const [nickname, setNickname] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [passwordRepeat, setPasswordRepeat] = createSignal<string>("");
  const [inviteCode, setInviteCode] = createSignal<string>(
    (Array.isArray(searchParams.code)
      ? searchParams.code[0]
      : searchParams.code) || "",
  );

  const [error, setError] = createSignal<string>("");
  const [loading, setLoading] = createSignal<boolean>(false);

  createEffect(() => {
    const newParams = { ...searchParams };

    console.log(inviteCode());

    if (inviteCode()) {
      newParams.code = inviteCode() ?? undefined;
    } else {
      delete newParams.code;
    }

    setSearchParams(newParams, { replace: true });
  });

  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError("");
    setLoading(true);

    try {
      const signupResponse = await signup(
        nickname(),
        password(),
        passwordRepeat(),
      );
      await handleApiError(signupResponse);

      const signinResponse = await signin(nickname(), password());
      await handleApiError(signinResponse);
      const data = await signinResponse.json();

      if (data.accessToken) {
        localStorage.setItem("access_token", data.accessToken);
      }

      if (inviteCode()) {
        navigate(`/?code=${inviteCode()}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Что-то пошло не так";
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
              href={inviteCode() ? `/signin?code=${inviteCode()}` : "/signin"}
            >
              Войти
            </A>
          </p>
        </VStack>
      </VStack>
    </div>
  );
}
