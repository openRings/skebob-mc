/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { Index } from "@pages/index";
import "./tailwind.css";

render(
  () => (
    <Router>
      <Route path="/" component={Index} />
    </Router>
  ),
  document.body,
);
