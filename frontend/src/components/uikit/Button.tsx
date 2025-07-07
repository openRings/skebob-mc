import { JSX, splitProps } from "solid-js";

type Props = JSX.IntrinsicElements["button"] & {
  variant?: "solid" | "transparent";
};

export function Button(props: Props) {
  const [local, attrs] = splitProps(props, ["class", "variant"]);

  const buttonClasses = {
    solid:
      "text-white/80 hover:text-white/70 bg-dark/80 px-4 py-3 text-center rounded-sm",
    transparent: "text-dark/70 hover:text-dark/50",
  };

  const baseClass = buttonClasses[local.variant ?? "transparent"];
  return (
    <button
      {...attrs}
      class={[
        "cursor-pointer bg-none text-sm transition-colors",
        baseClass,
        local.class,
      ].join(" ")}
    >
      {attrs.children}
    </button>
  );
}
