<script lang="ts">
  import { page } from '$app/state';

  const steps = ['/step1', '/step2', '/step3', '/step4'];

  const currentStep = $derived(() => {
    return steps.indexOf(page.url.pathname) + 1;
  });
</script>

{#if currentStep() > 0}
  <div class="max-w-3xl mx-auto mt-6">
    <div class="flex gap-2">
      {#each steps as _, i}
        <div
          class="flex-1 h-4 transition-colors duration-300"
          class:bg-[#9AFFB0]={i + 1 <= currentStep()}
          class:bg-[#EAEED6]={i + 1 > currentStep()}
          class:rounded-l-full={i === 0}
          class:rounded-r-full={i === steps.length - 1}
        ></div>
      {/each}
    </div>
  </div>
{/if}
