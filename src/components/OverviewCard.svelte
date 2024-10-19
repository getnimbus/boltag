<script lang="ts">
  import { isDarkMode } from "~/store";

  export let title;
  export let tooltipText = "";
  export let link = "";
  export let isTooltip = false;
  export let isDetail = true;

  import TooltipTitle from "~/components/TooltipTitle.svelte";
</script>

<div
  class={`flex-1 rounded-[20px] border border_0000001a ${
    $isDarkMode ? "xl:bg-[#222222]" : "bg-[#fff]"
  }`}
>
  <div
    class={`flex flex-col items-start justify-center gap-1 w-full h-full xl:py-4 py-3 ${isDetail ? "px-3" : "xl:px-6 px-3"}`}
  >
    {#if isTooltip}
      <TooltipTitle {tooltipText} {link} isBigIcon>
        <div
          class="text_00000099 xl:text-base md:text-lg text-base font-medium"
        >
          {title}
        </div>
      </TooltipTitle>
    {:else}
      <div class="text_00000099 xl:text-base md:text-lg text-base font-medium">
        {title}
      </div>
    {/if}

    <div class="xl:text-3xl text-2xl">
      <slot name="number" />
    </div>

    <slot name="sub-number" />
  </div>
</div>

<style>
</style>
