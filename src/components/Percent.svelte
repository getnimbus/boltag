<script lang="ts">
  import numeral from "numeral";

  export let percent;
  export let max = 0;
</script>

<div class="flex flex-col gap-1 items-start">
  <div class="flex items-center">
    <div class="text-xs font-normal">
      <span class="text-[#ffb800]">{numeral(percent || 0).format("0,0")}</span>/
    </div>
    <div class="text-xs font-normal">
      {numeral(max || 0).format("0,0")}
    </div>
  </div>

  <div
    class="w-full bg-[#544654] rounded-full overflow-hidden border-[0.5px] border-[#FFFFFF33] px-[4px] pt-[3px] h-3"
  >
    <div
      class="rounded-full transition-all duration-300 ease-in-out h-[5px]"
      style="width: {(Number(percent) / Number(max)) *
        100}%; background: #ffb800"
    ></div>
  </div>
</div>

<style></style>
