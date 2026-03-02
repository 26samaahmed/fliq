<script lang="ts">
  import { page } from '$app/state';

  const steps = ['/step1', '/step2', '/step3', '/step4'];

  const currentStep = $derived(() => {
    const index = steps.indexOf(page.url.pathname);
    return index === -1 ? 0 : index + 1;
  });
</script>

{#if currentStep() > 0}
  <div class="max-w-3xl mx-auto mt-4 sm:mt-6 px-4">
    <div class="flex gap-3">

      {#each steps as _, i}
        <div class="flex-1 h-3 sm:h-4 bg-[#EAEED6]/70 rounded-full overflow-hidden">

          <div
            class="h-full bg-[#9AFFB0] rounded-full origin-left transition-transform duration-500 ease-out"
            style="transform: scaleX({i + 1 <= currentStep() ? 1 : 0})"
          ></div>

        </div>
      {/each}

    </div>
  </div>
{/if}