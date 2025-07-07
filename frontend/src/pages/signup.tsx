import { Button } from "@components/uikit/Button";
import { Input } from "@components/uikit/Input";
import { HStack, VStack } from "@components/uikit/Stack";

export function Signup() {
  return (
    <div class="flex h-screen w-full items-center justify-center">
      <VStack class="w-max items-center gap-12">
        <h1 class="text-dark/50 w-full text-center text-4xl">Регистрация</h1>
        <VStack class="gap-2">
          <Input placeholder="Никнейм" />
          <Input placeholder="Пароль" />
          <Input placeholder="Код приглашения" />
          <Input placeholder="Повторите пароль" />
          <Button variant="solid" class="text-center">
            Создать
          </Button>
        </VStack>
      </VStack>
    </div>
  );
}
