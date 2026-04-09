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

<div style="display: flex; flex-direction: column; height: 100%; border: 1px solid #ccc; background: white;">

  <div style="padding: 10px; background: #eee; border-bottom: 1px solid #ccc;">
    <b>Background Chatbot</b>
  </div>

  <div
    bind:this={chatContainer}
    style="flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px;"
  >
    {#each messages as msg}
      {#if msg.role === 'user'}
        <div style="text-align: right;">
          <span style="background: #d38a8a; color: white; padding: 6px 10px; border-radius: 8px; display: inline-block;">
            {msg.text}
          </span>
        </div>
      {:else}
        <div style="text-align: left;">
          {#if 'imageBase64' in msg}
            <img
              src={`data:${msg.mimeType};base64,${msg.imageBase64}`}
              alt="Edited result"
              style="max-width: 100%; border: 1px solid #ccc;"
            />
          {:else}
            <span style="background: #f0f0f0; padding: 6px 10px; border-radius: 8px; display: inline-block;">
              {msg.text}
            </span>
          {/if}
        </div>
      {/if}
    {/each}

    {#if isLoading}
      <div style="text-align: left;">
        <span style="background: #f0f0f0; padding: 6px 10px; border-radius: 8px; display: inline-block;">
          Loading...
        </span>
      </div>
    {/if}
  </div>

  <div style="padding: 10px; border-top: 1px solid #ccc; display: flex; gap: 8px;">
    <input
      type="text"
      bind:value={inputText}
      onkeydown={handleKeydown}
      placeholder="Describe the background..."
      disabled={isLoading}
      style="flex: 1; padding: 6px; border: 1px solid #ccc;"
    />
    <button onclick={sendMessage} disabled={isLoading} style="padding: 6px 12px;">
      Send
    </button>
  </div>

</div>
