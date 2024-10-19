<script lang="ts">
  export let type: "success" | "fail";
  export let title;
</script>

<div class="flex flex-col items-center gap-2">
  {#if type === "success"}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 30 30"
      fill="#22c55e"
    >
      <path
        d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M21.707,12.707l-7.56,7.56 c-0.188,0.188-0.442,0.293-0.707,0.293s-0.52-0.105-0.707-0.293l-3.453-3.453c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0 l2.746,2.746l6.853-6.853c0.391-0.391,1.023-0.391,1.414,0S22.098,12.316,21.707,12.707z"
      ></path>
    </svg>
  {/if}

  {#if type === "fail"}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 16 16"
      fill="#ef4444"
    >
      <path
        d="M 7.5 1 C 3.914063 1 1 3.914063 1 7.5 C 1 11.085938 3.914063 14 7.5 14 C 11.085938 14 14 11.085938 14 7.5 C 14 3.914063 11.085938 1 7.5 1 Z M 10.207031 9.5 L 9.5 10.207031 L 7.5 8.207031 L 5.5 10.207031 L 4.792969 9.5 L 6.792969 7.5 L 4.792969 5.5 L 5.5 4.792969 L 7.5 6.792969 L 9.5 4.792969 L 10.207031 5.5 L 8.207031 7.5 Z"
      ></path>
    </svg>
  {/if}
  <div class="text-2xl font-medium">{title}</div>
  <div class="text-sm text-center">
    <slot name="msg" />
  </div>
</div>

<style></style>
