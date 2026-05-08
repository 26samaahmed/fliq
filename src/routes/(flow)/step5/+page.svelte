<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
	import BackButton from '$lib/components/buttons/Back.svelte';
	import { LAYOUT_CONFIG } from '$lib/utils/compositor';

	const SERVER_URL = 'https://fliq-app-dv6z.onrender.com/';
	const frameMap: Record<string, number> = { '1x3': 3, '1x4': 4, '2x2v': 4, '2x2h': 4 };

	function getSlotSize(frame: string) {
		const config = LAYOUT_CONFIG[frame] ?? LAYOUT_CONFIG['1x3'];
		return { w: config.slots[0].w * 4, h: config.slots[0].h * 4 };
	}

	// 2-user mode
	let shots = $state<{ self: string; remote: string }[]>([]);
	// 1-user mode
	let soloPhotos = $state<string[]>([]);

	let selectedIndices = $state<number[]>([]);
	let required = $state(3);
	let canProceed = $derived(selectedIndices.length === required && required > 0);

	let isTwoUsers = $state(false);
	let isHostSession = $state(false);
	let socket: any;

	$effect(() => {
		isTwoUsers = sessionStorage.getItem('userCount') === '2';
		isHostSession = sessionStorage.getItem('isHost') === '1';
		const photos: string[] = JSON.parse(sessionStorage.getItem('capturedPhotos') ?? '[]');
		const frame = sessionStorage.getItem('frame') ?? '1x3';
		required = frameMap[frame] ?? 3;

		if (isTwoUsers) {
			const pairs: { self: string; remote: string }[] = [];
			for (let i = 0; i + 1 < photos.length; i += 2) {
				pairs.push({ self: photos[i], remote: photos[i + 1] });
			}
			shots = pairs;
		} else {
			soloPhotos = photos;
		}
	});

	onMount(async () => {
		const roomID = sessionStorage.getItem('roomID');
		if (!roomID || sessionStorage.getItem('userCount') !== '2') return;

		const { io } = await import('socket.io-client');
		socket = io(SERVER_URL);
		socket.on('connect', () => {
			socket.emit('join-selection-room', roomID);
		});

		if (sessionStorage.getItem('isHost') === '1') {
			socket.on('peer-joined-selection', () => {
				socket.emit('selection-update', roomID, [...selectedIndices], required);
			});

			socket.on('request-state', () => {
				socket.emit('selection-update', roomID, [...selectedIndices], required);
			});
		} else {
			socket.on('peer-joined-selection', () => {
				socket.emit('request-state', roomID);
			});
			socket.on('photos-selected', async (indices: number[]) => {
				const sorted = [...indices].sort((a: number, b: number) => a - b);
				sessionStorage.setItem(
					'selectedPairs',
					JSON.stringify(
						sorted.map((i: number) => ({ self: shots[i].self, remote: shots[i].remote }))
					)
				);
				const { w, h } = getSlotSize(sessionStorage.getItem('frame') ?? '1x3');
				const combined = await Promise.all(
					sorted.map((i: number) => combinePhotos(shots[i].remote, shots[i].self, w, h))
				);
				sessionStorage.setItem('selectedPhotos', JSON.stringify(combined));
				goto('/step6');
			});
			socket.on('selection-update', (indices: number[], reqCount: number) => {
				selectedIndices = indices;
				if (reqCount !== undefined) required = reqCount;
			});
		}
	});

	onDestroy(() => socket?.disconnect());

	function isSelected(i: number) {
		return selectedIndices.includes(i);
	}

	function toggleSelect(i: number) {
		if (isSelected(i)) {
			selectedIndices = selectedIndices.filter((n) => n !== i);
		} else if (selectedIndices.length < required) {
			selectedIndices = [...selectedIndices, i];
		}
		if (isTwoUsers && isHostSession && socket) {
			const roomID = sessionStorage.getItem('roomID');
			if (roomID) socket.emit('selection-update', roomID, [...selectedIndices], required);
		}
	}

	function coverFill(
		ctx: CanvasRenderingContext2D,
		img: HTMLImageElement,
		dx: number, dy: number, dw: number, dh: number
	) {
		const ia = img.naturalWidth / img.naturalHeight;
		const da = dw / dh;
		let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
		if (ia > da) { sw = img.naturalHeight * da; sx = (img.naturalWidth - sw) / 2; }
		else         { sh = img.naturalWidth / da;  sy = (img.naturalHeight - sh) / 2; }
		ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
	}

	function combinePhotos(self: string, remote: string, slotW: number, slotH: number): Promise<string> {
		return new Promise((resolve) => {
			const img1 = new Image();
			const img2 = new Image();
			let loaded = 0;
			const onLoad = () => {
				if (++loaded < 2) return;
				const c = document.createElement('canvas');
				c.width = slotW;
				c.height = slotH;
				const ctx = c.getContext('2d')!;
				const half = slotW / 2;
				coverFill(ctx, img1, 0, 0, half, slotH);
				coverFill(ctx, img2, half, 0, half, slotH);
				resolve(c.toDataURL('image/jpeg', 0.8));
			};
			img1.onload = onLoad;
			img2.onload = onLoad;
			img1.src = self;
			img2.src = remote;
		});
	}

	async function handleNext() {
		const sorted = [...selectedIndices].sort((a, b) => a - b);
		let photosToStore: string[];
		if (isTwoUsers) {
			const { w, h } = getSlotSize(sessionStorage.getItem('frame') ?? '1x3');
			sessionStorage.setItem(
				'selectedPairs',
				JSON.stringify(sorted.map((i) => ({ self: shots[i].self, remote: shots[i].remote })))
			);
			photosToStore = await Promise.all(
				sorted.map((i) =>
					isHostSession
						? combinePhotos(shots[i].self, shots[i].remote, w, h)
						: combinePhotos(shots[i].remote, shots[i].self, w, h)
				)
			);
			if (socket) socket.emit('broadcast-selection', sessionStorage.getItem('roomID'), sorted);
		} else {
			const allPhotos: string[] = JSON.parse(sessionStorage.getItem('capturedPhotos') ?? '[]');
			photosToStore = sorted.map((i) => allPhotos[i]);
		}
		sessionStorage.setItem('selectedPhotos', JSON.stringify(photosToStore));
		goto('/step6');
	}
</script>

<main
	class="font-aldrich min-h-screen flex flex-col p-6 bg-gradient-to-b from-[#2E3140] to-[#3B3F52]"
>
	<Header />

	<div class="mt-4">
		<div class="flex flex-col sm:flex-row items-center justify-between mb-2">
			<BackButton />

			<h1 class="text-lg sm:text-2xl text-white text-center flex-1">Preview Your Shots</h1>

			<div class="w-16"></div>
		</div>

		<ProgressBar />

		<p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
			{#if isTwoUsers && !isHostSession}
				Host is selecting photos —
				<span class="text-white font-bold text-xl">{selectedIndices.length} / {required}</span> chosen
			{:else}
				Select <span class="text-white font-bold">{required}</span> shots for your strip.
				<span class="text-white/60 text-sm ml-1"
					>({selectedIndices.length} / {required} selected)</span
				>
			{/if}
		</p>
	</div>

	<div class="flex-1 flex flex-col items-center gap-6 mt-8">
		{#if isTwoUsers}
			<!-- 2-user mode: each option is a side-by-side pair -->
			{#if shots.length === 0}
				<p class="text-white/50 mt-12">
					No photos found. Go back to step 4 and take your photos first.
				</p>
			{:else}
				<div
					class="grid gap-4 w-full max-w-3xl justify-center"
					style="grid-template-columns: repeat(auto-fill, 240px);"
				>
					{#each shots as shot, i}
						<button
							onclick={() => toggleSelect(i)}
							class="relative rounded-lg overflow-hidden border-4 transition-all duration-150 focus:outline-none
                {isSelected(i)
								? 'border-[#9AFFB0] scale-105'
								: 'border-transparent hover:border-white/30'}
                {!isHostSession ? 'pointer-events-none cursor-default' : ''}"
							style="width: 240px; height: 130px;"
						>
							<div class="flex h-full">
								<img
									src={isHostSession ? shot.self : shot.remote}
									alt="Host"
									class="w-1/2 h-full object-cover"
								/>
								<img
									src={isHostSession ? shot.remote : shot.self}
									alt="Guest"
									class="w-1/2 h-full object-cover border-l-2 border-white/20"
								/>
							</div>
							{#if isSelected(i)}
								<div
									class="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#9AFFB0] flex items-center justify-center"
								>
									<span class="text-[#333745] text-xs font-bold">
										{[...selectedIndices].sort((a, b) => a - b).indexOf(i) + 1}
									</span>
								</div>
							{/if}
						</button>
					{/each}
				</div>

				<button
					onclick={handleNext}
					disabled={!canProceed || !isHostSession}
					class="mt-4 bg-[#D38A8A] hover:bg-[#C07070] text-white px-10 py-3 rounded-lg border-2 border-white
                 transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
				>
					Next →
				</button>
			{/if}
		{:else}
			<!-- 1-user mode: flat photo grid -->
			{#if soloPhotos.length === 0}
				<p class="text-white/50 mt-12">
					No photos found. Go back to step 4 and take your photos first.
				</p>
			{:else}
				<div
					class="grid gap-4 w-full max-w-3xl justify-center"
					style="grid-template-columns: repeat(auto-fill, 160px);"
				>
					{#each soloPhotos as photo, i}
						<button
							onclick={() => toggleSelect(i)}
							class="relative rounded-lg overflow-hidden border-4 transition-all duration-150 focus:outline-none
                {isSelected(i)
								? 'border-[#9AFFB0] scale-105'
								: 'border-transparent hover:border-white/30'}"
							style="width: 160px; height: 160px;"
						>
							<img src={photo} alt="Photo {i + 1}" class="w-full h-full object-cover" />
							{#if isSelected(i)}
								<div
									class="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#9AFFB0] flex items-center justify-center"
								>
									<span class="text-[#333745] text-xs font-bold">
										{[...selectedIndices].sort((a, b) => a - b).indexOf(i) + 1}
									</span>
								</div>
							{/if}
						</button>
					{/each}
				</div>

				<button
					onclick={handleNext}
					disabled={!canProceed}
					class="mt-4 bg-[#D38A8A] hover:bg-[#C07070] text-white px-10 py-3 rounded-lg border-2 border-white
                 transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
				>
					Next →
				</button>
			{/if}
		{/if}
	</div>

	<Footer />
</main>
