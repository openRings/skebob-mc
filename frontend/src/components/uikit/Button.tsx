import { JSX, splitProps } from "solid-js";

type Props = JSX.IntrinsicElements["button"] & {
  variant?: "solid" | "transparent";
};

export function Button(props: Props) {
  const [local, attrs] = splitProps(props, ["class", "variant"]);

  const buttonClasses = {
    solid: "text-dark bg-dark/10 px-3 py-2 flex items-center",
    transparent: "text-dark/50",
  };

  const baseClass = buttonClasses[local.variant ?? "transparent"];
  return (
    <button
      class={[
        "hover:text-dark/70 cursor-pointer bg-none text-xs transition-colors",
        baseClass,
        local.class,
      ].join(" ")}
    >
      {attrs.children}
    </button>
  );
}
