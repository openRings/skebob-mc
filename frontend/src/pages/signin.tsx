import { Button } from "@components/uikit/Button";
import { Input } from "@components/uikit/Input";
import { HStack, VStack } from "@components/uikit/Stack";

export function Signin() {
  return (
    <div class="flex h-screen w-full items-center justify-center">
      <VStack class="w-max items-center gap-12">
        <h1 class="text-dark/50 w-full text-center text-4xl">Вход</h1>
        <VStack class="gap-2">
          <Input placeholder="Никнейм" />
          <Input placeholder="Пароль" />
          <Button variant="solid" class="text-center">
            Войти
          </Button>
        </VStack>
      </VStack>
    </div>
  );
}
