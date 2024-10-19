<script lang="ts">
  import { createBoundary } from "@crownframework/svelte-error-boundary";
  import Error from "./Error.svelte";
  import { captureException } from "@sentry/svelte";

  const Boundary = createBoundary(Error);

  const handleError = (err: any) => {
    console.error(err);
    captureException(err);
  };
</script>

<Boundary onError={handleError}>
  <slot />
</Boundary>

<style></style>
