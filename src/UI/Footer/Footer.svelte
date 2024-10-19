<script lang="ts">
  import { isDarkMode } from "~/store";

  import DarkModeFooter from "./DarkModeFooter.svelte";

  import Logo from "~/assets/logo-1.svg";
  import LogoWhite from "~/assets/logo-white.svg";
</script>

<div
  class="flex justify-between md:items-center items-start max-w-[1600px] m-auto xl:w-[88%] w-[90%] md:py-2 pt-6 md:flex-row flex-col"
>
  <div class="flex items-center gap-1 md:order-1 order-2">
    <div class="text-sm">Powered by</div>
    <img
      src={$isDarkMode ? LogoWhite : Logo}
      alt="logo"
      loading="lazy"
      decoding="async"
      class="xl:w-[167px] w-[127px] xl:h-[50px] h-[80px] xl:-ml-8"
    />
  </div>
  <div class="md:order-2 order-1">
    <DarkModeFooter />
  </div>
</div>

<style>
</style>
