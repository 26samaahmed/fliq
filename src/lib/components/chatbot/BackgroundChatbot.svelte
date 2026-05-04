<script lang="ts">
  import { tick } from 'svelte';

  type Message =
    | { role: 'user'; text: string }
    | { role: 'bot'; imageBase64: string; mimeType: string }
    | { role: 'bot'; text: string };

  let {
    currentImageBase64 = null,
    currentMimeType = 'image/png',
    onImageUpdate,
    photos = [],
    onPhotosUpdate,
    disabled = false,
    twoUsers = false,
    selfImageBase64 = null,
    remoteImageBase64 = null,
    onNewMessage,
    externalMessages = []
  }: {
    currentImageBase64?: string | null;
    currentMimeType?: string;
    onImageUpdate?: (imageBase64: string, mimeType: string) => void;
    photos?: string[];
    onPhotosUpdate?: (editedPhotos: string[]) => void;
    disabled?: boolean;
    twoUsers?: boolean;
    selfImageBase64?: string | null;
    remoteImageBase64?: string | null;
    onNewMessage?: (msg: Message) => void;
    externalMessages?: Message[];
  } = $props();

  let processedExternal = $state(0);

  $effect(() => {
    const len = externalMessages.length;
    if (len > processedExternal) {
      for (let i = processedExternal; i < len; i++) {
        const msg = externalMessages[i];
        messages.push(msg);
        if ('imageBase64' in msg) onImageUpdate?.(msg.imageBase64, msg.mimeType);
      }
      processedExternal = len;
      tick().then(() => { if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight; });
    }
  });

  let messages = $state<Message[]>([
    { role: 'bot', text: 'Hi! Tell me what background you want and I will edit it for you.' }
  ]);
  let inputText = $state('');
  let isLoading = $state(false);
  let chatContainer: HTMLDivElement;

  async function sendMessage() {
    const prompt = inputText.trim();
    if (!prompt || isLoading) return;

    const hasPhotos = photos.length > 0;

    if (!hasPhotos && !currentImageBase64) {
      messages.push({ role: 'bot', text: 'No image found. Please take photos first.' });
      await tick();
      chatContainer.scrollTop = chatContainer.scrollHeight;
      return;
    }

    const userMsg: Message = { role: 'user', text: prompt };
    messages.push(userMsg);
    onNewMessage?.(userMsg);
    inputText = '';
    isLoading = true;
    await tick();
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
      if (hasPhotos) {
        const results = await Promise.all(
          photos.map(async (photoDataUrl, index) => {
            const [meta, base64] = photoDataUrl.split(',');
            const mimeType = meta.match(/:(.*?);/)?.[1] ?? 'image/png';
            const res = await fetch('/api/background-edit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt, imageBase64: base64, mimeType, photoIndex: index })
            });
            const data = await res.json();
            if (data.error) return { error: data.error, original: photoDataUrl };
            return { dataUrl: `data:${data.mimeType};base64,${data.imageBase64}` };
          })
        );

        const firstError = results.find(r => 'error' in r);
        if (firstError && 'error' in firstError) {
          const errMsg: Message = { role: 'bot', text: firstError.error };
          messages.push(errMsg);
          onNewMessage?.(errMsg);
          isLoading = false;
          await tick();
          chatContainer.scrollTop = chatContainer.scrollHeight;
          return;
        }

        const editedPhotos = results.map((r, i) =>
          'dataUrl' in r ? r.dataUrl : photos[i]
        );
        const [firstMeta, firstBase64] = editedPhotos[0].split(',');
        const firstMime = firstMeta.match(/:(.*?);/)?.[1] ?? 'image/png';
        const botMsg: Message = { role: 'bot', imageBase64: firstBase64, mimeType: firstMime };
        messages.push(botMsg);
        onPhotosUpdate?.(editedPhotos);
      } else {
        const res = await fetch('/api/background-edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, imageBase64: currentImageBase64, mimeType: currentMimeType, selfImageBase64, remoteImageBase64 })
        });
        const data = await res.json();
        if (data.error) {
          const errMsg: Message = { role: 'bot', text: data.error };
          messages.push(errMsg);
          onNewMessage?.(errMsg);
        } else {
          const botMsg: Message = { role: 'bot', imageBase64: data.imageBase64, mimeType: data.mimeType };
          messages.push(botMsg);
          onNewMessage?.(botMsg);
          onImageUpdate?.(data.imageBase64, data.mimeType);
        }
      }
    } catch {
      const errMsg: Message = { role: 'bot', text: 'Something went wrong. Please try again.' };
      messages.push(errMsg);
      onNewMessage?.(errMsg);
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
      placeholder={disabled ? 'Host is customizing the background...' : 'Describe the background...'}
      disabled={isLoading || disabled}
      class="flex-1 px-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#d38a8a] disabled:opacity-50 disabled:cursor-not-allowed"
    />

    <button
      onclick={sendMessage}
      disabled={isLoading || disabled}
      class="px-5 py-2 rounded-full bg-[#d38a8a] text-white text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Send
    </button>
  </div>

</div>