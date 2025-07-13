import { Component } from "solid-js";

interface NotificationProps {
  message: string;
  type?: "error" | "success" | "warn";
  onClose: () => void;
}

export const Notification: Component<NotificationProps> = (props) => {
  return (
    <div
      class={`rounded-md p-4 text-white shadow-md ${
        props.type === "error"
          ? "bg-error"
          : props.type === "success"
            ? "bg-success"
            : "bg-warn"
      }`}
    >
      <div class="flex items-center justify-between">
        <p>{props.message}</p>
        <button onClick={props.onClose} class="ml-4 text-white">
          ✕
        </button>
      </div>
    </div>
  );
};
