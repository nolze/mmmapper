<style global>
  .page h1 {
    @apply font-bold text-2xl mb-4;
  }
  .page p {
    @apply my-4;
  }
  .page pre {
    @apply my-4 p-4 bg-gray-200 w-full;
  }
  .page a {
    @apply text-blue-800 underline;
  }
</style>

<div class="page">
  <slot />
</div>
