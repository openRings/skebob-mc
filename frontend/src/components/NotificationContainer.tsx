import { createSignal, For, JSX } from "solid-js";
import { Notification } from "./Notification";

interface NotificationData {
  id: number;
  message: string;
  type: "error" | "success" | "warn";
}

const [notifications, setNotifications] = createSignal<NotificationData[]>([]);

export function addNotification(
  message: string,
  type: "error" | "success" | "warn",
) {
  const id = Date.now();
  setNotifications((prev) => [...prev, { id, message, type }]);

  setTimeout(() => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, 3000);
}

export function error(message: string) {
  addNotification(message, "error");
}

export function success(message: string) {
  addNotification(message, "success");
}

export function warn(message: string) {
  addNotification(message, "warn");
}

type Props = JSX.IntrinsicElements["div"];

export function NotificationContainer(props: Props): JSX.Element {
  const { ...attrs } = props;
  return (
    <div {...attrs} class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <For each={notifications()}>
        {(notification) => (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => {
              setNotifications((prev) =>
                prev.filter((n) => n.id !== notification.id),
              );
            }}
          />
        )}
      </For>
    </div>
  );
}
