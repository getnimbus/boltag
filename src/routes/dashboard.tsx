import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

import Dashboard from "../pages/Dashboard.tsx";

function RouteComponent() {
  return <Dashboard />;
}
