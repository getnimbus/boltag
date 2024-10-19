<script lang="ts">
  import { t } from "~/lib/i18n";
  export let isDisabled;
  export let totalPage: number;
  export let handlePageChange = (page: number) => {};

  $: paginationArr = new Array(totalPage);

  let pagination = 1;

  const handlePreviousPage = () => {
    if (isDisabled || pagination === 1) {
      return;
    }
    if (pagination === 1) {
      pagination = 1;
    } else {
      pagination -= 1;
    }
  };

  const handleNextPage = () => {
    if (isDisabled || pagination === totalPage || totalPage === 0) {
      return;
    }
    if (pagination === totalPage) {
      pagination;
    } else {
      pagination += 1;
    }
  };

  $: {
    if (pagination) {
      handlePageChange(pagination);
    }
  }
</script>

<div class="mx-auto flex justify-center items-center md:gap-4 gap-2">
  <button
    on:click={handlePreviousPage}
    class={`flex gap-2 items-center border px-2 py-1 rounded-[10px] ${isDisabled || pagination === 1 ? "opacity-40" : "opacity-100 hover:bg-[#1e96fc] hover:text-white"}`}
  >
    <svg
      class="w-3.5 h-3.5 me-2 rtl:rotate-180"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 10"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 5H1m0 0 4 4M1 5l4-4"
      />
    </svg>
    {$t("Prev")}
  </button>

  {#if totalPage !== 0}
    {#if isDisabled}
      <div class="text-gray-400">...</div>
    {:else}
      <div class="md:flex hidden items-center gap-1">
        {#if paginationArr.length < 6}
          {#each paginationArr as item, index}
            <button
              on:click={() => (pagination = index + 1)}
              class={`px-3 py-1 rounded-[10px] cursor-pointer hover:bg-[#1e96fc] hover:text-white ${pagination === index + 1 ? "border border-[#1e96fc] text-[#1e96fc]" : ""}`}
            >
              {index + 1}
            </button>
          {/each}
        {:else}
          {#if pagination > 3}
            {#each [{}] as item, index}
              <div
                on:click={() => (pagination = index + 1)}
                class="px-3 py-1 rounded-[10px] cursor-pointer hover:bg-[#1e96fc] hover:text-white"
              >
                {index + 1}
              </div>
            {/each}
            {#if pagination > 4}
              <div class="font-medium px-3 py-2 rounded-[10px] cursor-pointer">
                •••
              </div>
            {/if}
          {/if}
          {#each paginationArr as item, index}
            {#if index + 1 === pagination - 1 || index + 1 === pagination - 2}
              <div
                on:click={() => (pagination = index + 1)}
                class="px-3 py-1 rounded-[10px] cursor-pointer hover:bg-[#1e96fc] hover:text-white"
              >
                {index + 1}
              </div>
            {/if}
          {/each}
          <div
            class="border border-[#1e96fc] text-[#1e96fc] px-3 py-1 rounded-[10px] cursor-pointer"
          >
            {pagination}
          </div>
          {#each paginationArr as item, index}
            {#if index + 1 === pagination + 1 || index + 1 === pagination + 2}
              <div
                on:click={() => (pagination = index + 1)}
                class="px-3 py-1 rounded-[10px] cursor-pointer hover:bg-[#1e96fc] hover:text-white"
              >
                {index + 1}
              </div>
            {/if}
          {/each}
          {#if pagination < paginationArr.length - 2}
            {#if pagination < paginationArr.length - 3}
              <div class="font-medium px-3 py-2 rounded-[10px] cursor-pointer">
                •••
              </div>
            {/if}
            {#each paginationArr as item, index}
              {#if index === paginationArr.length - 1 || pagination === paginationArr.length - 2}
                <div
                  on:click={() => (pagination = index + 1)}
                  class="px-3 py-1 rounded-[10px] cursor-pointer hover:bg-[#1e96fc] hover:text-white"
                >
                  {index + 1}
                </div>
              {/if}
            {/each}
          {/if}
        {/if}
      </div>
    {/if}
  {/if}

  <button
    on:click={handleNextPage}
    class={`flex gap-2 items-center border px-2 py-1 rounded-[10px] ${isDisabled || pagination === totalPage || totalPage === 0 ? "opacity-40" : "opacity-100 hover:bg-[#1e96fc] hover:text-white"}`}
  >
    {$t("Next")}
    <svg
      class="w-3.5 h-3.5 ms-2 rtl:rotate-180"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 10"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M1 5h12m0 0L9 1m4 4L9 9"
      />
    </svg>
  </button>
</div>

<style></style>
