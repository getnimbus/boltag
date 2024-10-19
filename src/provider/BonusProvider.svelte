<script lang="ts">
  import { openScreenBonusScore, bonusScore } from "~/store";
  import Diamond from "~/assets/Diamond.png";
  import TooltipNumber from "~/components/TooltipNumber.svelte";
</script>

<slot />

{#if $openScreenBonusScore}
  <div
    class="fixed h-screen w-screen top-0 left-0 flex items-center justify-center bg-[#000000cc]"
    style="z-index: 2147483648;"
    on:click={() => {
      setTimeout(() => {
        openScreenBonusScore.update((n) => (n = false));
      }, 500);
    }}
  >
    <div class="flex flex-col items-center justify-center gap-10">
      <div class="text-2xl text-white font-medium">Congratulation!!!</div>
      <img src={Diamond} alt="" class="w-40 h-40 block" />
      <div class="text-2xl text-white font-medium text-center">
        You have received <TooltipNumber number={$bonusScore} type="amount" /> Bonus
        GM Points
      </div>
    </div>
  </div>
{/if}
