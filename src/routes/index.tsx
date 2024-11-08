import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

import Main from "../pages/Main.tsx";

function RouteComponent() {
  return <Main />;
}
