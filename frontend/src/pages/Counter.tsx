import { Button } from "@components/Button";
import { A } from "@solidjs/router";
import { createSignal } from "solid-js";

export function Counter() {
  const [counter, setCounter] = createSignal<number>(0);

  const increment = () => setCounter(counter() + 1);

  return (
    <section class="mt-64 flex flex-col items-center gap-6 rounded-lg bg-white px-6 py-4">
      <span class="text-2xl">{counter()}</span>
      <Button onclick={increment}>add</Button>
      <A href="/">go back</A>
    </section>
  );
}
