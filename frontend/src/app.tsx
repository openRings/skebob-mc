/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { Index } from "@pages/index";
import "./tailwind.css";
import { Signin } from "@pages/signin";
import { Signup } from "@pages/signup";

render(
  () => (
    <Router>
      <Route path="/" component={Index} />
      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
    </Router>
  ),
  document.body,
);
