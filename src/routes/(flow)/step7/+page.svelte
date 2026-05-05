<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
	import BackButton from '$lib/components/buttons/Back.svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { user } from '$lib/stores/user';
	import { stripStore } from '$lib/stores/strip';
	import { get } from 'svelte/store';

	let stripBase64 = $state<string | null>(null);
	let mimeType = $state('image/png');
	let showDropdown = $state(false);
	let saving = $state(false);
	let saved = $state(false);

	onMount(async () => {
		const stored = get(stripStore);

		if (stored) {
			stripBase64 = stored.base64;
			mimeType = stored.mimeType;
		} else {
			stripBase64 = sessionStorage.getItem('photoStripBase64');
			mimeType = sessionStorage.getItem('photoStripMimeType') ?? 'image/png';
		}

		if (stripBase64) {
			await saveStrip();
		}
	});

	async function saveStrip() {
		const currentUser = get(user);
		if (!currentUser || saved || saving) return;

		saving = true;

		try {
			const ext = mimeType.includes('jpeg') ? 'jpg' : 'png';

			const byteString = atob(stripBase64!);
			const arr = new Uint8Array(byteString.length);
			for (let i = 0; i < byteString.length; i++) arr[i] = byteString.charCodeAt(i);

			const blob = new Blob([arr], { type: mimeType });

			const path = `${currentUser.id}/${Date.now()}.${ext}`;

			const { error: uploadError } = await supabase.storage
				.from('strips')
				.upload(path, blob);

			if (uploadError) throw uploadError;

			const { error: insertError } = await supabase.from('strips').insert({
				user_id: currentUser.id,
				storage_path: path,
				mime_type: mimeType
			});

			if (insertError) throw insertError;

			saved = true;
		} catch (err) {
			console.error('Failed to save strip:', err);
		} finally {
			saving = false;
		}
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function downloadAs(format: 'png' | 'jpg' | 'pdf') {
		showDropdown = false;
		if (!stripBase64) return;

		if (format === 'pdf') {
			const win = window.open('', '_blank', 'width=600,height=900');
			if (!win) return;

			const img = win.document.createElement('img');
			img.src = `data:${mimeType};base64,${stripBase64}`;
			img.style.maxWidth = '100%';
			img.style.height = 'auto';

			const body = win.document.body;
			body.style.margin = '0';
			body.style.display = 'flex';
			body.style.justifyContent = 'center';

			body.appendChild(img);

			img.onload = () => {
				win.print();
				win.close();
			};

			return;
		}

		if (format === 'jpg') {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;

				const ctx = canvas.getContext('2d')!;
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0);

				const a = document.createElement('a');
				a.download = 'fliq-strip.jpg';
				a.href = canvas.toDataURL('image/jpeg', 0.92);
				a.click();
			};

			img.src = `data:${mimeType};base64,${stripBase64}`;
			return;
		}

		const a = document.createElement('a');
		a.download = 'fliq-strip.png';
		a.href = `data:image/png;base64,${stripBase64}`;
		a.click();
	}

	function goToProfile() {
		goto('/profile');
	}
</script>

<!-- MAIN PAGE -->
<main class="font-aldrich min-h-screen flex flex-col p-6 bg-gradient-to-b from-[#2E3140] to-[#3B3F52]">

	<Header />

	<!-- HEADER -->
	<div class="mt-4">
		<div class="flex flex-col sm:flex-row items-center justify-between mb-2">
			<BackButton />

			<h1 class="text-lg sm:text-2xl text-white text-center flex-1">
				Here's your final strip!
			</h1>

			<div class="w-16"></div>
		</div>

		<ProgressBar />

		<p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
			We hope you had fun creating memories with fliq!
		</p>
	</div>

	<div class="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 mt-8">

		<!-- STRIP PREVIEW -->
		<div class="lg:w-[60%] w-full flex justify-center">
	
			<div class="min-h-[60vh] flex items-center justify-center w-full">
	
				{#if stripBase64}
					<img
						src={`data:${mimeType};base64,${stripBase64}`}
						alt="Your photo strip"
						class="max-h-[55vh] w-auto object-contain shadow-lg"
					/>
				{:else}
					<p class="text-white/40 text-sm">
						No strip found — please complete the previous steps first.
					</p>
				{/if}
	
			</div>
	
		</div>
	
		<!-- ACTIONS -->
		<div class="lg:w-[40%] w-full flex flex-col items-center gap-6">
	
			<button
				onclick={goToProfile}
				class="w-full max-w-xs bg-[#D38A8A] text-white px-10 py-3 rounded-xl border-2 border-white hover:bg-[#C07070] transition duration-300 shadow-lg"
			>
				Go to Profile
			</button>
	
			<div class="relative w-full max-w-xs">
				<button
					onclick={toggleDropdown}
					disabled={!stripBase64}
					class="w-full bg-transparent text-white px-6 py-3 rounded-xl border border-white/40 hover:bg-white/10 transition duration-300 flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed"
				>
					<span>Export strip</span>
	
					<svg
						class="w-4 h-4 transition-transform duration-200 {showDropdown ? 'rotate-180' : ''}"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
	
				{#if showDropdown}
					<div class="absolute left-0 right-0 mt-2 bg-[#2A2D3A] border border-white/10 rounded-lg shadow-lg overflow-hidden z-10">
				
						<button
							type="button"
							onclick={() => downloadAs('png')}
							class="w-full text-left px-4 py-2 text-white hover:bg-white/10"
						>
							PNG
						</button>
				
						<button
							type="button"
							onclick={() => downloadAs('jpg')}
							class="w-full text-left px-4 py-2 text-white hover:bg-white/10"
						>
							JPG
						</button>
				
						<button
							type="button"
							onclick={() => downloadAs('pdf')}
							class="w-full text-left px-4 py-2 text-white hover:bg-white/10"
						>
							PDF
						</button>
				
					</div>
			{/if}
			</div>
	
			{#if saving}
				<p class="text-white/40 text-xs text-center">Saving to profile...</p>
			{:else if saved}
				<p class="text-white/40 text-xs text-center">Saved to your profile.</p>
			{/if}
	
		</div>
	
	</div>

	<Footer />

</main>