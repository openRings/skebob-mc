import { Button } from "@components/uikit/Button";
import { Block } from "@components/uikit/Block";
import { HStack, VStack } from "@components/uikit/Stack";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { Input } from "@components/uikit/Input";
import { error, success, warn } from "@components/NotificationContainer";
import { createEffect, createResource, createSignal, Show } from "solid-js";
import { Modal } from "@components/Modal";
import {
  acceptInvite,
  createInvite,
  fetchInvites,
  fetchProfile,
  getInviteCodeInfo,
} from "src/helpers/profile";
import { copyToClipboard } from "src/utils/clipboard";

const formatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function Index() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams<{ code?: string }>();

  const [targetNickname, setTargetNickname] = createSignal("");
  const [copied, setCopied] = createSignal<string | null>(null);
  const [inviteInfo, setInviteInfo] = createSignal<{
    createdBy?: string;
    usedBy?: string;
    canAccept?: boolean;
  } | null>(null);

  const [profile, { refetch: refetchProfile }] = createResource(fetchProfile);
  const [invites, { refetch: refetchInvites }] = createResource(fetchInvites);

  const inviteCode =
    typeof searchParams.code === "string" && searchParams.code
      ? searchParams.code
      : "";

  const [isModalOpen, setIsModalOpen] = createSignal(
    !!searchParams.code && !profile()?.invited && inviteCode.length > 0,
  );

  const handleCreateInvite = async () => {
    try {
      await createInvite(targetNickname());
      setTargetNickname("");
      refetchInvites();
    } catch (err) {
      error(err instanceof Error ? err.message : "Ошибка создания приглашения");
    }
  };

  const handleAcceptInvite = async () => {
    try {
      if (!inviteInfo()?.canAccept) {
        throw new Error("Это приглашение нельзя принять");
      }
      await acceptInvite(inviteCode);
      success("Приглашение принято");
      refetchProfile();
    } catch (err) {
      error(err instanceof Error ? err.message : "Ошибка принятия приглашения");
    } finally {
      setIsModalOpen(false);
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    warn("Вы вышли из аккаунта");
    navigate("/signin");
  };

  const copyInviteLink = (code: string) => {
    const link = `${window.location.origin}/invite/${encodeURIComponent(code)}`;
    copyToClipboard(link);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  createEffect(async () => {
    if (profile.loading || !inviteCode) return;

    if (!profile() || profile.error) {
      error("Ошибка загрузки профиля, невозможно проверить приглашение");
      return;
    }

    try {
      const response = await getInviteCodeInfo(inviteCode);
      setInviteInfo({
        createdBy: response.created_by,
        usedBy: response.used_by,
        canAccept: !response.used_by && !profile()?.invited,
      });
    } catch (err) {
      error(
        err instanceof Error
          ? err.message
          : "Ошибка загрузки данных приглашения",
      );
      setIsModalOpen(false);
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
          <HStack class="justify-between py-4">
            <HStack class="w-full items-center gap-4">
              <img src="head.jpg" alt="skin" class="size-24" />
              <VStack class="gap-3">
                <p class="max-w-[200px] truncate text-2xl">
                  {profile()?.nickname}
                </p>
                <VStack class="gap-1">
                  <p class="text-dark/50 text-sm">
                    Создан:{" "}
                    <span class="text-success">
                      {formatter.format(new Date(profile()!.createdAt))}
                    </span>
                  </p>
                  <Show when={profile()?.invited}>
                    <p class="text-dark/50 text-sm">
                      Приглашен:{" "}
                      <span class="text-success">
                        {formatter.format(new Date(profile()!.invited!))}
                      </span>
                    </p>
                  </Show>
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
          <Show
            when={
              profile() &&
              invites() &&
              invites()!.length < profile()!.maxInvites
            }
          >
            <HStack class="gap-1">
              <Input
                class="w-full"
                placeholder="Для кого"
                value={targetNickname()}
                onInput={(e) => setTargetNickname(e.currentTarget.value)}
              />
              <Button
                variant="solid"
                onClick={handleCreateInvite}
                disabled={profile.loading}
              >
                Создать
              </Button>
            </HStack>
          </Show>

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
              when={invites() && invites()!.length > 0}
              fallback={
                <p class="text-dark/50 p-4 text-center">
                  Нет созданных приглашений
                </p>
              }
            >
              <VStack class="gap-4">
                {invites() &&
                  invites()!.map((invite) => (
                    <HStack class="border-dark/40 justify-between border-l-2 py-2 pl-4">
                      <VStack class="w-3/5 gap-1">
                        <p class="w-full truncate">
                          {invite.name ? invite.name : "Приглашение"}
                        </p>
                        <p
                          class={`text-xs ${
                            invite.used_by ? "text-success" : "text-warn"
                          }`}
                        >
                          {invite.used_by
                            ? `Принято игроком: ${invite.used_by}`
                            : "Ожидает принятия"}
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
      <Modal
        isOpen={isModalOpen()}
        onClose={() => {
          setIsModalOpen(false);
          navigate("/");
        }}
        title="Принять приглашение?"
        onConfirm={handleAcceptInvite}
        confirmText="Принять"
        confirmDisabled={!inviteInfo()?.canAccept}
      >
        <VStack class="text-dark/80 gap-2">
          <p>
            Код приглашения: <b>{inviteCode}</b>
          </p>
          <Show when={inviteInfo()?.createdBy}>
            <p>
              Создано: <b>{inviteInfo()?.createdBy}</b>
            </p>
          </Show>
          <Show when={inviteInfo()?.usedBy}>
            <p>
              Использовано: <b>{inviteInfo()?.usedBy}</b>
            </p>
          </Show>
          <Show when={!inviteInfo()?.canAccept && inviteInfo()}>
            <p class="text-error">Вы не можете принять это приглашение</p>
          </Show>
        </VStack>
      </Modal>
    </VStack>
  );
}
