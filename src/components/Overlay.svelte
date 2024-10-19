<script lang="ts">
  import { onMount, createEventDispatcher, tick } from "svelte";
  import { Motion } from "svelte-motion";
  const dispatch = createEventDispatcher();

  export let isOpen: boolean;
  export let clickOutSideToClose = false;
  export let isTableContent = false;
  export let isShowClose = true;

  let contentDiv: HTMLDivElement | null;

  const handleClose = () => {
    dispatch("close");
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  $: {
    // Auto focus if we have input inside the content
    if (contentDiv && isOpen) {
      setTimeout(() => {
        if (contentDiv) {
          contentDiv.querySelector("input")?.focus();
        }
      }, 500);
    }
  }

  // Prevent layout flick
  $: if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }
</script>

{#if isOpen}
  <div
    class="flex w-screen h-screen fixed inset-0 overflow-y-auto justify-center items-center bg-[#000000CC] backdrop-filter backdrop-brightness-75 backdrop-blur-sm"
    style="z-index: 999;"
    on:click={clickOutSideToClose ? handleClose : null}
  >
    <div
      class={`relative ${
        isTableContent
          ? "xl:min-w-7xl max-w-4xl xl:w-max w-full"
          : "xl:min-w-2xl max-w-4xl xl:w-max w-full"
      }`}
      on:click|stopPropagation
    >
      <div class="rounded-xl modal_container mx-4">
        {#if isShowClose}
          <div
            class="absolute top-3 right-10 text-4xl text-gray-500 cursor-pointer"
            on:click|stopPropagation={handleClose}
          >
            &times;
          </div>
        {/if}
        <div class="px-6 pt-9 pb-7" bind:this={contentDiv}>
          <slot />
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body) .modal_container {
    background: #fff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.1);
  }
  :global(body.dark) .modal_container {
    background: #0f0f0f;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 1);
  }
</style>
