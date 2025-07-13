import { Profile } from "./Profile";
import { Code } from "./Code";
import { Invites } from "./Invites";

export function UserDashboard() {
  return (
    <section class="grid grid-cols-4 grid-rows-4 gap-6 p-6">
      <Profile />
      <Code />
      <Invites />
    </section>
  );
}
