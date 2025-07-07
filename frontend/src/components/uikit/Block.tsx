import { JSX } from "solid-js";
import { VStack } from "./Stack";

type Props = JSX.IntrinsicElements["div"] & {
  title?: String;
};

export function Block(props: Props) {
  const { ...attrs } = props;
  return (
    <div class={["w-120 rounded-lg bg-white p-4", props.class].join(" ")}>
      <VStack class="gap-2">
        {props.title && <p class="text-dark/50">{props.title}</p>}
        {props.children}
      </VStack>
    </div>
  );
}
