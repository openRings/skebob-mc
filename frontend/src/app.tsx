/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { Index } from "@pages/index";
import "./tailwind.css";
import { Signin } from "@pages/signin";
import { Signup } from "@pages/signup";
import { Invite } from "@pages/invite";
import { NotificationContainer } from "@components/NotificationContainer";

render(
  () => (
    <div class="min-h-screen">
      <Router>
        <Route path="/" component={Index} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
        <Route path="/invite/:code" component={Invite} />
      </Router>
      <NotificationContainer />
    </div>
  ),
  document.body,
);
