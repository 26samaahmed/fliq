<script lang="ts">
  import { tick } from 'svelte';

  type Message =
    | { role: 'user'; text: string }
    | { role: 'bot'; imageBase64: string; mimeType: string }
    | { role: 'bot'; text: string };

  let {
    currentImageBase64 = null,
    currentMimeType = 'image/png',
    onImageUpdate
  }: {
    currentImageBase64?: string | null;
    currentMimeType?: string;
    onImageUpdate?: (imageBase64: string, mimeType: string) => void;
  } = $props();

  let messages = $state<Message[]>([
    { role: 'bot', text: 'Hi! Tell me what background you want and I will edit it for you.' }
  ]);
  let inputText = $state('');
  let isLoading = $state(false);
  let chatContainer: HTMLDivElement;

  async function sendMessage() {
    const prompt = inputText.trim();
    if (!prompt || isLoading) return;

    if (!currentImageBase64) {
      messages.push({ role: 'bot', text: 'No image found. Please take photos first.' });
      await tick();
      chatContainer.scrollTop = chatContainer.scrollHeight;
      return;
    }

    messages.push({ role: 'user', text: prompt });
    inputText = '';
    isLoading = true;
    await tick();
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
      const res = await fetch('/api/background-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageBase64: currentImageBase64, mimeType: currentMimeType })
      });

      const data = await res.json();

      if (data.error) {
        messages.push({ role: 'bot', text: data.error });
      } else {
        messages.push({ role: 'bot', imageBase64: data.imageBase64, mimeType: data.mimeType });
        onImageUpdate?.(data.imageBase64, data.mimeType);
      }
    } catch {
      messages.push({ role: 'bot', text: 'Something went wrong. Please try again.' });
    }

    isLoading = false;
    await tick();
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  }
</script>

<div class="flex flex-col h-full border border-[#ccc] bg-white rounded">

  <div class="p-4 bg-[#eee] border-b border-[#ccc]">
    <b class="font-aldrich sm:text-xl">Background Chatbot</b>
  </div>

  <div
    bind:this={chatContainer}
    class="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
  >
    {#each messages as msg}
      {#if msg.role === 'user'}
        <div class="flex justify-end">
          <span class="bg-[#d38a8a] text-white py-2 px-4 rounded">
            {msg.text}
          </span>
        </div>
      {:else}
        <div class="flex justify-start">
          {#if 'imageBase64' in msg}
            <img
              src={`data:${msg.mimeType};base64,${msg.imageBase64}`}
              alt="Edited result"
              class="max-w-full border border-[#ccc]"
            />
          {:else}
            <span class="bg-[#f0f0f0] py-2 px-4 rounded">
              {msg.text}
            </span>
          {/if}
        </div>
      {/if}
    {/each}

    {#if isLoading}
      <div class="flex justify-start">
        <span class="bg-[#f0f0f0] py-2 px-4 rounded">
          Loading...
        </span>
      </div>
    {/if}
  </div>

  <div class="p-4 border-t border-[#ccc] flex gap-4">
    <input
      type="text"
      bind:value={inputText}
      onkeydown={handleKeydown}
      placeholder="Describe the background..."
      disabled={isLoading}
      class="flex-1 p-3 border border-[#ccc]"
    />
    <button onclick={sendMessage} disabled={isLoading} class="px-6 py-4">
      Send
    </button>
  </div>

</div>