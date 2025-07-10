import { createSignal, JSX, Show } from "solid-js";
import { Button } from "@components/uikit/Button";
import { VStack } from "@components/uikit/Stack";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: JSX.Element;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function Modal(props: ModalProps): JSX.Element {
  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="w-xs rounded-lg bg-white p-6 shadow-lg">
          <VStack class="gap-6">
            <h2 class="text-dark text-2xl">{props.title}</h2>
            {props.children}
            <div class="flex justify-end gap-4">
              <Button variant="solid" onClick={props.onClose}>
                {props.cancelText || "Отмена"}
              </Button>
              <Show when={props.onConfirm}>
                <Button variant="solid" onClick={props.onConfirm}>
                  {props.confirmText || "Подтвердить"}
                </Button>
              </Show>
            </div>
          </VStack>
        </div>
      </div>
    </Show>
  );
}
