import { JSX, splitProps } from "solid-js";

type Props = JSX.IntrinsicElements["input"];

export function Input(props: Props) {
  const [_, attrs] = splitProps(props, ["class"]);
  return (
    <input
      {...attrs}
      class={["bg-dark/10 px-2 focus:outline-0", props.class].join(" ")}
    />
  );
}
