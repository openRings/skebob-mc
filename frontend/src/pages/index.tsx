import { Button } from "@components/uikit/Button";
import { Block } from "@components/uikit/Block";
import { HStack, VStack } from "@components/uikit/Stack";
import { useNavigate } from "@solidjs/router";
import { Input } from "@components/uikit/Input";
import { createResource, createSignal, onCleanup, Show } from "solid-js";

interface ProfileData {
  nickname: string;
  maxInvites: number;
  createdAt: Date;
  invited: string | null;
}

interface Invite {
  code: string;
  created_at: Date;
  used_by: string | null;
}

const formatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const apiFetcher = async (endpoint: string, options: RequestInit = {}) => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    throw new Error("Отсутствует токен авторизации");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      throw new Error("Авторизуйтесь еще раз!");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export function Index() {
  const navigate = useNavigate();
  const [targetNickname, setTargetNickname] = createSignal("");
  const [copied, setCopied] = createSignal<string | null>(null);
  const [creationError, setCreationError] = createSignal("");

  const profileFetcher = () => apiFetcher("/api/profile");
  const invitesFetcher = () => apiFetcher("/api/invites");

  const [profile, { refetch: refetchProfile }] = createResource(profileFetcher);
  const [invites, { refetch: refetchInvites }] = createResource(invitesFetcher);

  const createInvite = async () => {
    if (!targetNickname().trim()) {
      setCreationError("Введите никнейм");
      return;
    }

    try {
      setCreationError("");
      await apiFetcher("/api/invites", {
        method: "POST",
        body: JSON.stringify({ target: targetNickname().trim() }),
      });
      setTargetNickname("");
      refetchInvites();
    } catch (error) {
      if (error instanceof Error) {
        setCreationError(error.message);
      } else {
        setCreationError("Ошибка создания инвайта");
      }
    }
  };

  const copyInviteLink = (code: string) => {
    const link = `${window.location.origin}/signup?code=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(link);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/signin");
  };

  onCleanup(() => {
    if (profile.error?.message.includes("Авторизуйтесь")) {
      handleLogout();
    }
  });

  return (
    <VStack class="items-center gap-12">
      <h1 class="text-dark/50 mt-16 w-full text-center text-4xl">SkebobMC</h1>

      <Block title="Профиль">
        <Show
          when={!profile.loading && !profile.error}
          fallback={
            profile.error ? (
              <div class="p-4 text-red-500">
                {profile.error.message || "Ошибка загрузки профиля"}
              </div>
            ) : (
              <p>Загрузка профиля...</p>
            )
          }
        >
          <HStack class="justify-between">
            <HStack class="w-full items-center gap-4 py-4">
              <img
                src="src/assets/images/steve-head.png"
                alt="Аватар"
                class="size-24"
              />
              <VStack class="gap-3">
                <p class="max-w-[200px] truncate text-2xl">
                  {profile().nickname}
                </p>
                <VStack class="gap-1">
                  <p class="text-dark/50 text-sm">
                    Доступ:{" "}
                    <span class="text-success">
                      {formatter.format(new Date(profile().createdAt))}
                    </span>
                  </p>
                  <p class="text-dark/50 text-sm">
                    Регистрация:{" "}
                    <span class="text-dark">
                      {formatter.format(new Date(profile().createdAt))}
                    </span>
                  </p>
                </VStack>
              </VStack>
            </HStack>
            <Button class="w-max self-start" onClick={handleLogout}>
              Выйти
            </Button>
          </HStack>
        </Show>
      </Block>

      <Block
        title={`Приглашения ${invites()?.length || 0}/${profile()?.maxInvites || 0}`}
      >
        <VStack class="gap-4">
          <HStack class="gap-1">
            <Input
              class="w-full"
              placeholder="Для кого"
              value={targetNickname()}
              onInput={(e) => setTargetNickname(e.currentTarget.value)}
            />
            <Button
              variant="solid"
              onClick={createInvite}
              disabled={profile.loading}
            >
              Создать
            </Button>
          </HStack>

          <Show
            when={!invites.loading && !invites.error}
            fallback={
              invites.error ? (
                <div class="p-4 text-red-500">
                  {invites.error.message || "Ошибка загрузки инвайтов"}
                </div>
              ) : (
                <p>Загрузка приглашений...</p>
              )
            }
          >
            <Show
              when={invites() && invites().length > 0}
              fallback={
                <p class="text-dark/50 p-4">Нет созданных приглашений</p>
              }
            >
              <VStack class="gap-4">
                {invites().map((invite: Invite) => (
                  <HStack class="border-dark/40 justify-between border-l-2 py-2 pl-4">
                    <VStack class="w-3/5 gap-1">
                      <p class="w-full truncate">
                        {invite.used_by || "Не использовано"}
                      </p>
                      <p
                        class={`text-xs ${
                          invite.used_by ? "text-success" : "text-warn"
                        }`}
                      >
                        {invite.used_by ? "Принято" : "Ожидает принятия"}
                      </p>
                    </VStack>
                    <VStack class="w-max gap-1">
                      <p class="text-dark/50 w-full text-right text-nowrap">
                        Код: <span class="text-dark">{invite.code}</span>
                      </p>
                      <Button
                        class="min-w-[180px] text-right"
                        onClick={() => copyInviteLink(invite.code)}
                      >
                        {copied() === invite.code
                          ? "Скопировано!"
                          : "Скопировать ссылку"}
                      </Button>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </Show>
          </Show>
        </VStack>
      </Block>
    </VStack>
  );
}
