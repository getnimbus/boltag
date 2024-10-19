<script lang="ts">
  import { currentLang, isDarkMode } from "~/store";
  import { setLang } from "~/lib/i18n";

  import English from "~/assets/english.svg";
  import Russian from "~/assets/russia.svg";

  const handleChangeLang = () => {
    if ($currentLang === "en") {
      setLang("ru");
    } else {
      setLang("en");
    }
  };
</script>

<div
  class={`xl:font-normal font-medium xl:text-base text-xl cursor-pointer w-max flex items-center gap-2 ${$isDarkMode ? "text-gray-300 xl:text-[#cdcdcd]" : "text-gray-300 xl:text-[#00000099]"} `}
  on:click={handleChangeLang}
>
  {#if $currentLang === "en"}
    <img src={Russian} alt="" class="w-6 h-6" />
    RU
  {:else}
    <img src={English} alt="" class="w-6 h-6" />
    EN
  {/if}
</div>

<style>
</style>
