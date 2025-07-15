import { createSignal, createResource, JSX } from "solid-js";
import { Button } from "@components/uikit/Button";
import { Input } from "@components/uikit/Input";
import { VStack } from "@components/uikit/Stack";
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { signin } from "src/helpers/auth";
import { error } from "@components/NotificationContainer";

export function Signin(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const [nickname, setNickname] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [loading, setLoading] = createSignal<boolean>(false);

  const [inviteCode, setInviteCode] = createSignal<string>(
    (Array.isArray(searchParams.code)
      ? searchParams.code[0]
      : searchParams.code) || "",
  );

  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);

    try {
      await signin(nickname(), password());
      if (inviteCode()) {
        navigate(`/?code=${inviteCode()}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      error(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex h-screen w-full items-center justify-center">
      <VStack class="w-max items-center gap-12">
        <h1 class="text-dark/50 w-full text-center text-4xl">Вход</h1>
        <VStack class="w-xs gap-6">
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
            disabled={loading() || !password() || !nickname()}
          >
            {loading() ? "Загрузка..." : "Войти"}
          </Button>
          <p class="text-dark/70 text-center text-sm">
            Еще нет аккаунта? <br />
            <A
              class="hover:text-dark/70 text-dark/60 text-xs underline transition-colors"
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
