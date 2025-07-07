import { Button } from "@components/uikit/Button";
import { Block } from "@components/uikit/Block";
import { HStack, VStack } from "@components/uikit/Stack";
import { A } from "@solidjs/router";
import { Input } from "@components/uikit/Input";

export function Index() {
  return (
    <VStack class="items-center gap-12">
      <h1 class="text-dark/50 mt-16 w-full text-center text-5xl">SkebobMC</h1>
      <Block title="Профиль">
        <HStack class="justify-between">
          <HStack class="w-full items-center gap-4 py-4">
            <img
              class="size-20"
              src="src/assets/images/villager.png"
              alt="villager"
            />
            <VStack class="gap-2">
              <p class="text-2xl">magwoo</p>
              <p class="text-dark/50 text-xs">
                Доступ: <span class="text-success">с 26 апр. 2025</span>
              </p>
              <p class="text-dark/50 text-xs">
                Регистрация: <span class="text-dark">24 апр. 2025</span>
              </p>
            </VStack>
          </HStack>
          <Button class="w-max self-start">Выйти</Button>
        </HStack>
      </Block>
      <Block title="Приглашения 3/5">
        <VStack class="gap-4">
          <HStack class="gap-2">
            <Input class="w-full" placeholder="Для лехи" />
            <Button variant="solid">Создать</Button>
          </HStack>
          <HStack class="border-dark/40 justify-between border-l-2 pl-4">
            <VStack class="gap-2">
              <p>Для лехи</p>
              <span class="text-success text-xs">Принято</span>
            </VStack>
            <VStack class="gap-2">
              <p class="text-dark/50 text-right">
                Код: <span class="text-dark">scJjPpsg17g</span>
              </p>
              <Button class="text-right">Скопировать ссылку</Button>
            </VStack>
          </HStack>
          <HStack class="border-dark/40 justify-between border-l-2 pl-4">
            <VStack class="gap-2">
              <p>Игорь лох</p>
              <span class="text-warn text-xs">Ожидает принятия</span>
            </VStack>
            <VStack class="gap-2">
              <p class="text-dark/50 text-right">
                Код: <span class="text-dark">scJjPpsg17g</span>
              </p>
              <Button class="text-right">Скопировать ссылку</Button>
            </VStack>
          </HStack>
          <HStack class="border-dark/40 justify-between border-l-2 pl-4">
            <VStack class="gap-2">
              <p>Никита соси</p>
              <span class="text-warn text-xs">Ожидает принятия</span>
            </VStack>
            <VStack class="gap-2">
              <p class="text-dark/50 text-right">
                Код: <span class="text-dark">scJjPpsg17g</span>
              </p>
              <Button class="text-right">Скопировать ссылку</Button>
            </VStack>
          </HStack>
        </VStack>
      </Block>
    </VStack>
  );
}
