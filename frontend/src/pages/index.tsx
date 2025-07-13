import { Title } from "@components/Title";
import { UserDashboard } from "@components/UserDashboard";

export function Index() {
  return (
    <div class="">
      <Title />
      <section class="mx-auto h-[500px] w-[1200px] rounded-b-xl bg-zinc-800 drop-shadow-2xl">
        <UserDashboard />
      </section>
    </div>
  );
}
