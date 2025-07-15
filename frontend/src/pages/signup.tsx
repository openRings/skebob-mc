import { createSignal, JSX, createEffect, Show } from "solid-js";
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { Button } from "@components/uikit/Button";
import { Input } from "@components/uikit/Input";
import { HStack, VStack } from "@components/uikit/Stack";
import { signin, signup } from "src/helpers/auth";
import { error } from "@components/NotificationContainer";

export function Signup(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const [nickname, setNickname] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [passwordRepeat, setPasswordRepeat] = createSignal<string>("");
  const [inviteCode, setInviteCode] = createSignal<string>("");
  const [hasInitialCode, setHasInitialCode] = createSignal<boolean>(false);
  const [hasReferralCode, setHasReferralCode] = createSignal<boolean>(false);

  const [passwordInputError, setPasswordInputError] = createSignal<string>("");
  const [repeatPasswordInputError, setRepeatPasswordInputError] =
    createSignal<string>("");

  const [loading, setLoading] = createSignal<boolean>(false);

  const code = Array.isArray(searchParams.code)
    ? searchParams.code[0]
    : searchParams.code;
  if (code) {
    setInviteCode(code);
    setHasReferralCode(true);
    setHasInitialCode(true);
  }

  const codeFromUrl = () => {
    const code = searchParams.code;
    return Array.isArray(code) ? code[0] : code;
  };
  const hasCodeInUrl = () => !!codeFromUrl();

  createEffect(() => {
    if (hasCodeInUrl()) {
      setInviteCode(codeFromUrl() || "");
    }
  });

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
            <Show when={hasReferralCode()}>
              <Input
                placeholder="Код приглашения"
                value={inviteCode()}
                disabled={hasInitialCode()}
                onInput={(e) => setInviteCode(e.currentTarget.value)}
              />
            </Show>
            <HStack class="mx-auto gap-2">
              <input
                type="checkbox"
                checked={hasReferralCode()}
                onChange={(e) => setHasReferralCode(e.currentTarget.checked)}
                disabled={hasInitialCode()}
                class="material-symbols-outlined bg-dark/10 checked:bg-dark/80 disabled:bg-dark/40 hover:bg-dark/60 size-5 appearance-none rounded-md transition-colors duration-200 checked:before:block checked:before:text-center checked:before:text-base checked:before:leading-5 checked:before:text-white checked:before:content-['check'] disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p class="text-dark/70 flex items-center gap-2 text-sm">
                У меня есть реферальный код
              </p>
            </HStack>
          </VStack>
          <Button
            onClick={handleSignUp}
            variant="solid"
            class="text-center"
            disabled={
              loading() ||
              !password() ||
              !passwordInputError() ||
              !repeatPasswordInputError() ||
              !nickname()
            }
          >
            {loading() ? "Загрузка..." : "Создать"}
          </Button>

          <p class="text-dark/70 text-center text-sm">
            Уже есть аккаунт? <br />
            <A
              class="hover:text-dark/70 text-dark/60 text-xs underline transition-colors"
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
