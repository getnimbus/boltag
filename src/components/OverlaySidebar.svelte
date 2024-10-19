<script>
  import { Motion } from "svelte-motion";

  export let isOpen;

  // Prevent layout flick
  $: {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }
</script>

<Motion
  initial="hidden"
  animate={isOpen ? "visible" : "hidden"}
  variants={{
    visible: { opacity: 1, display: "block" },
    hidden: { opacity: 0, display: "none" },
  }}
  let:motion
>
  <div
    class="w-screen h-screen fixed top-0 left-0 z-50 bg-[#000000cc] backdrop-filter backdrop-brightness-75 backdrop-blur-sm"
    use:motion
  >
    <Motion
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      variants={{
        visible: { display: "flex", transform: "translateX(0px)" },
        hidden: { display: "none", transform: "translateX(100vw)" },
      }}
      let:motion
    >
      <div
        class="h-full fixed top-0 right-0 2xl:w-[50%] xl:w-[70%] w-[100%] flex-col gap-6 p-6 sidebar sidebar-container"
        id="sidebar-token-detail"
        use:motion
      >
        <slot />
      </div>
    </Motion>
  </div>
</Motion>

<style>
  .sidebar {
    z-index: 9;

    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 250ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

    --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color),
      0 8px 10px -6px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }

  :global(body) .sidebar-container {
    background: #fff;
  }
  :global(body.dark) .sidebar-container {
    background: #0f0f0f;
  }

  #sidebar-token-detail {
    overflow-y: auto !important;
  }
</style>
