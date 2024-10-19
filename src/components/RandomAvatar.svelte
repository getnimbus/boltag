<script>
  import { userPublicAddress } from "~/store";
  import { onMount, afterUpdate, onDestroy } from "svelte";
  import { render, unmountComponentAtNode } from "react-dom";
  import React from "react";
  import BoringAvatar from "boring-avatars";

  export let size = 40;

  let container;

  function renderReactComponent() {
    if (container) {
      render(
        <BoringAvatar
          size={size}
          name={$userPublicAddress}
          variant="beam"
          colors={["#fb6900", "#f63700", "#004853", "#007e80", "#00b9bd"]}
        />,
        container,
      );
    }
  }

  onMount(() => {
    renderReactComponent();
  });

  afterUpdate(() => {
    renderReactComponent();
  });

  onDestroy(() => {
    if (container) {
      unmountComponentAtNode(container);
    }
  });
</script>

<div bind:this={container}></div>
