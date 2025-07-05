/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { Index } from "@pages/index";
import { Counter } from "@pages/counter";
import "./tailwind.css";

render(
  () => (
    <Router>
      <Route path="/" component={Index} />
      <Route path="/counter" component={Counter} />
    </Router>
  ),
  document.body,
);
