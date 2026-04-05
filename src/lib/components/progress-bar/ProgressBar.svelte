<script lang="ts">
  import { page } from '$app/state';

  const steps = ['/step1', '/step2', '/step3', '/step4', '/step5', '/step6', '/step7'];

  const currentStep = $derived(() => {
    const path = page.url.pathname;
    const index = steps.findIndex(step => path.startsWith(step));
    return index !== -1 ? index + 1 : 0;
  });
</script>

{#if currentStep() > 0}
  <div class="max-w-4xl mx-auto mt-4 sm:mt-6 px-4">

    <!-- Progress Bar -->
    <div class="flex gap-2">
      {#each steps as _, i}
        <div class="flex-1 h-3 bg-[#EAEED6]/40 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full origin-left transition-transform duration-500 ease-out
              {i + 1 < currentStep() ? 'bg-[#9AFFB0]' : ''}
              {i + 1 === currentStep() ? 'bg-[#9AFFB0]' : ''}
            "
            style="transform: scaleX({i + 1 <= currentStep() ? 1 : 0})"
          ></div>
        </div>
      {/each}
    </div>
  </div>
{/if}