import { Button } from "@components/uikit/Button";
import { Block } from "@components/uikit/Block";
import { HStack, VStack } from "@components/uikit/Stack";
import { A } from "@solidjs/router";
import { Input } from "@components/uikit/Input";

export function Index() {
  return (
    <VStack class="items-center gap-12">
      <h1 class="text-dark/50 mt-16 w-full text-center text-4xl">SkebobMC</h1>
      <Block title="Профиль">
        <HStack class="justify-between">
          <HStack class="w-full items-center gap-4 py-4">
            <img
              class="size-20"
              src="src/assets/images/villager.png"
              alt="villager"
            />
            <VStack class="gap-3">
              <p class="text-2xl">magwoo</p>
              <VStack class="gap-1">
                <p class="text-dark/50 text-sm">
                  Доступ: <span class="text-success">с 26 апр. 2025</span>
                </p>
                <p class="text-dark/50 text-sm">
                  Регистрация: <span class="text-dark">24 апр. 2025</span>
                </p>
              </VStack>
            </VStack>
          </HStack>
          <Button class="w-max self-start">Выйти</Button>
        </HStack>
      </Block>
      <Block title="Приглашения 3/5">
        <VStack class="gap-4">
          <HStack class="gap-1">
            <Input class="w-full" placeholder="Для лехи" />
            <Button variant="solid">Создать</Button>
          </HStack>
          <HStack class="border-dark/40 justify-between border-l-2 pl-4">
            <VStack class="w-3/5 gap-1">
              <p class="w-full truncate">Для лехи лехи лехи лехи лехи лехи</p>
              <p class="text-success text-xs">Принято</p>
            </VStack>
            <VStack class="w-2/5 gap-1">
              <p class="text-dark/50 w-full truncate text-right">
                Код: <span class="text-dark">scJjPpsg17g</span>
              </p>
              <Button class="text-right">Скопировать ссылку</Button>
            </VStack>
          </HStack>

          <HStack class="border-dark/40 justify-between border-l-2 pl-4">
            <VStack class="w-3/5 gap-1">
              <p class="w-full truncate">dasdasх</p>
              <p class="text-warn text-xs">Ожидает принятия</p>
            </VStack>

            <VStack class="w-2/5 gap-1">
              <p class="text-dark/50 w-full truncate text-right">
                Код: <span class="text-dark">scJjPpsg17g</span>
              </p>
              <Button class="text-right">Скопировать ссылку</Button>
            </VStack>
          </HStack>
          <HStack class="border-dark/40 justify-between border-l-2 pl-4">
            <VStack class="w-3/5 gap-1">
              <p class="w-full truncate">Игорь лох</p>
              <p class="text-warn text-xs">Ожидает принятия</p>
            </VStack>

            <VStack class="w-2/5 gap-1">
              <p class="text-dark/50 w-full truncate text-right">
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
