import { A } from "@solidjs/router";

export function Index() {
  return (
    <section class="mt-64 flex flex-col gap-4">
      <h1 class="text-3xl">This is index page</h1>
      <A href="/counter">go to counter.tsx page</A>
    </section>
  );
}
