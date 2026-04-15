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

<div class="flex flex-col h-full max-w-lg mx-auto w-full bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden font-aldrich">

  <!-- Header -->
  <div class="p-4 bg-gray-50 border-b border-gray-200">
    <b class="text-lg">Background Chatbot</b>
  </div>

  <!-- Chat -->
  <div
    bind:this={chatContainer}
    class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50"
  >
    {#each messages as msg}
      {#if msg.role === 'user'}
        <div class="flex justify-end">
          <span class="bg-[#d38a8a] text-white py-2 px-4 rounded-2xl max-w-[75%] text-sm shadow-sm">
            {msg.text}
          </span>
        </div>
      {:else}
        <div class="flex justify-start">
          {#if 'imageBase64' in msg}
            <img
              src={`data:${msg.mimeType};base64,${msg.imageBase64}`}
              alt="Edited result"
              class="max-w-[75%] rounded-xl border border-gray-200 shadow-sm"
            />
          {:else}
            <span class="bg-white py-2 px-4 rounded-2xl max-w-[75%] text-sm shadow-sm border border-gray-200">
              {msg.text}
            </span>
          {/if}
        </div>
      {/if}
    {/each}

    {#if isLoading}
      <div class="flex justify-start">
        <span class="bg-white py-2 px-4 rounded-2xl text-sm shadow-sm border border-gray-200">
          Loading...
        </span>
      </div>
    {/if}
  </div>

  <!-- Input -->
  <div class="p-4 border-t border-gray-200 bg-white flex gap-3 items-center">
    <input
      type="text"
      bind:value={inputText}
      onkeydown={handleKeydown}
      placeholder="Describe the background..."
      disabled={isLoading}
      class="flex-1 px-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#d38a8a]"
    />

    <button
      onclick={sendMessage}
      disabled={isLoading}
      class="px-5 py-2 rounded-full bg-[#d38a8a] text-white text-sm hover:opacity-90 transition"
    >
      Send
    </button>
  </div>

</div>