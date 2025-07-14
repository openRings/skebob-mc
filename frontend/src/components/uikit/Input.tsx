import { JSX, splitProps, Show } from "solid-js";

type Props = JSX.IntrinsicElements["input"] & {
  error?: string;
  popupMessage?: string;
};

export function Input(props: Props) {
  const [_, attrs] = splitProps(props, ["class"]);
  return (
    <div class="relative w-full">
      <input
        {...attrs}
        class={[
          "bg-dark/10 disabled:text-dark/35 w-full rounded-sm px-4 py-2 outline-0",
          props.class,
        ].join(" ")}
      />
      <Show when={props.error}>
        <div class="group absolute top-1/2 right-8">
          <span class="material-symbols-outlined text-error absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
            error
          </span>
          <div class="bg-dark font-rubik pointer-events-none absolute bottom-full z-10 mb-4 -translate-x-1/2 rounded-md px-4 py-2 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100">
            {props.error ?? "Произошла ошибка"}
          </div>
        </div>
      </Show>
    </div>
  );
}
