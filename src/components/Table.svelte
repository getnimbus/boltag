<script lang="ts">
  import { isDarkMode } from "~/store";
  export let isStyleTable = true;
</script>

<!-- Desktop view -->
<div
  class={`xl:block hidden w-full overflow-hidden ${isStyleTable ? "rounded-[10px] border border_0000000d" : ""} ${
    $isDarkMode ? "bg-[#131313]" : "bg-[#fff]"
  }`}
>
  <slot name="desktop" />
</div>

<!-- Mobile view -->
<div
  class={`xl:hidden block p-2 w-full overflow-hidden ${isStyleTable ? "rounded-[10px] border border_0000000d" : ""} ${
    $isDarkMode ? "bg-[#131313]" : "bg-[#fff]"
  }`}
>
  <slot name="mobile" />
</div>

<style></style>
