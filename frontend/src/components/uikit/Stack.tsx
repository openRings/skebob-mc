import { JSX } from "solid-js";

type Props = JSX.IntrinsicElements["div"];

export function HStack(props: Props) {
  const { ...attrs } = props;
  return (
    <div {...attrs} class={["flex flex-row", props.class].join(" ")}>
      {props.children}
    </div>
  );
}

export function VStack(props: Props) {
  const { ...attrs } = props;
  return (
    <div
      {...attrs}
      class={["flex flex-col", props.class].filter(Boolean).join(" ")}
    >
      {props.children}
    </div>
  );
}
