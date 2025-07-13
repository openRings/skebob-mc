/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { Index } from "@pages/index";
import { Auth } from "@pages/Auth";
import "./tailwind.css";

render(
  () => (
    <Router>
      <Route path="/" component={Index} />
      <Route path="/auth" component={Auth} />
    </Router>
  ),
  document.body,
);
