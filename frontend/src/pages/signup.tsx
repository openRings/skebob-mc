import { createSignal, JSX, createEffect } from "solid-js";
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { Button } from "@components/uikit/Button";
import { Input } from "@components/uikit/Input";
import { VStack } from "@components/uikit/Stack";
import { signin, signup } from "src/helpers/auth";
import { error } from "@components/NotificationContainer";

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

  const [passwordInputError, setPasswordInputError] = createSignal<string>("");
  const [repeatPasswordInputError, setRepeatPasswordInputError] =
    createSignal<string>("");
  const [nicknameInputError, setNicknameInputError] = createSignal<string>("");

  const [loading, setLoading] = createSignal<boolean>(false);

  createEffect(() => {
    const newParams = { ...searchParams };

    if (inviteCode()) {
      newParams.code = inviteCode() ?? undefined;
    } else {
      delete newParams.code;
    }

    setSearchParams(newParams, { replace: true });
  });

  createEffect(() => {
    const pwd = password();

    if (pwd.length > 0) {
      if (pwd.length < 8) {
        setPasswordInputError("Пароль должен быть минимум 8 символов");
        return;
      }
      if (!/(?=.*[a-z])/.test(pwd)) {
        setPasswordInputError("Пароль должен содержать строчную букву");
        return;
      }
      if (!/(?=.*[A-Z])/.test(pwd)) {
        setPasswordInputError("Пароль должен содержать заглавную букву");
        return;
      }
      if (!/(?=.*\d)/.test(pwd)) {
        setPasswordInputError("Пароль должен содержать цифру");
        return;
      }
      setPasswordInputError("");
    } else {
      setPasswordInputError("");
    }
  });

  createEffect(() => {
    const pwd = password();
    const pwdRepeat = passwordRepeat();

    if (pwdRepeat.length > 0) {
      if (pwdRepeat !== pwd) {
        setRepeatPasswordInputError("Пароли не совпадают");
      } else {
        setRepeatPasswordInputError("");
      }
    } else {
      setRepeatPasswordInputError("");
    }
  });

  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);

    try {
      await signup(nickname(), password(), passwordRepeat());
      await signin(nickname(), password());

      if (inviteCode()) {
        navigate(`/?code=${inviteCode()}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      error(err instanceof Error ? err.message : (err as string));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex h-screen w-full items-center justify-center">
      <VStack class="w-xs items-center gap-12">
        <h1 class="text-dark/50 w-full text-center text-4xl">Регистрация</h1>
        <VStack class="w-full gap-6">
          <VStack class="gap-2">
            <Input
              error={nicknameInputError()}
              placeholder="Никнейм"
              value={nickname()}
              onInput={(e) => setNickname(e.currentTarget.value)}
            />
            <Input
              error={passwordInputError()}
              placeholder="Пароль"
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />

            <Input
              error={repeatPasswordInputError()}
              placeholder="Повторите пароль"
              type="password"
              value={passwordRepeat()}
              onInput={(e) => setPasswordRepeat(e.currentTarget.value)}
            />
            <Input
              placeholder="Код приглашения (необязательно)"
              value={inviteCode()}
              disabled={inviteCode().length > 0}
            />
          </VStack>
          <Button
            onClick={handleSignUp}
            variant="solid"
            class="text-center"
            disabled={
              loading() ||
              !password() ||
              !passwordInputError ||
              !repeatPasswordInputError ||
              !nickname()
            }
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
