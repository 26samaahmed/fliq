<script lang="ts">
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import EditInfo from '$lib/components/popup/EditInfo.svelte';
	import ConfirmDelete from '$lib/components/popup/ConfirmDelete.svelte';
	import UndoToast from '$lib/components/toast/UndoToast.svelte';

	import { supabase } from '$lib/supabase';
	import { user } from '$lib/stores/user';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	type Strip = {
		id: string;
		storage_path: string;
		mime_type: string;
		created_at: string;
		publicUrl: string;
	};

	let strips: Strip[] = [];
	let stripsLoading = true;

	let showEditModal = false;

	// delete state
	let showDeleteModal = false;
	let selectedStrip: Strip | null = null;

	// undo state
	let recentlyDeleted: Strip | null = null;
	let undoTimeout: ReturnType<typeof setTimeout>;

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		const diffMs = Date.now() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;
		return date.toLocaleDateString();
	}

	async function loadStrips() {
		const currentUser = get(user);
		if (!currentUser) {
			stripsLoading = false;
			return;
		}

		const { data } = await supabase
			.from('strips')
			.select('*')
			.eq('user_id', currentUser.id)
			.order('created_at', { ascending: false });

		if (!data) {
			stripsLoading = false;
			return;
		}

		strips = data.map((s: any) => {
			const { data: urlData } = supabase.storage
				.from('strips')
				.getPublicUrl(s.storage_path);

			return { ...s, publicUrl: urlData.publicUrl };
		});

		stripsLoading = false;
	}

	onMount(async () => {
		const { data } = await supabase.auth.getUser();
		if (data?.user) user.set(data.user);
		await loadStrips();
	});

	function openEditModal() {
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
	}

	// DELETE FLOW
	function confirmDelete(strip: Strip) {
		selectedStrip = strip;
		showDeleteModal = true;
	}

	function cancelDelete() {
		selectedStrip = null;
		showDeleteModal = false;
	}

	async function deleteStrip() {
		if (!selectedStrip) return;

		const deleted = selectedStrip;

		// optimistic UI update
		strips = strips.filter((s) => s.id !== deleted.id);

		recentlyDeleted = deleted;
		showDeleteModal = false;
		selectedStrip = null;

		await supabase.from('strips').delete().eq('id', deleted.id);
		await supabase.storage.from('strips').remove([deleted.storage_path]);

		clearTimeout(undoTimeout);
		undoTimeout = setTimeout(() => {
			recentlyDeleted = null;
		}, 5000);
	}

	async function undoDelete() {
		if (!recentlyDeleted) return;

		await supabase.from('strips').insert({
			id: recentlyDeleted.id,
			storage_path: recentlyDeleted.storage_path,
			mime_type: recentlyDeleted.mime_type,
			created_at: recentlyDeleted.created_at,
			user_id: (await supabase.auth.getUser()).data.user?.id
		});

		await loadStrips();
		recentlyDeleted = null;

		clearTimeout(undoTimeout);
	}
</script>

<main class="font-aldrich min-h-screen flex flex-col p-6 bg-gradient-to-b from-[#2E3140] to-[#3B3F52]">

	<Header />

	<div class="flex-1 text-white max-w-7xl mx-auto w-full">

		<h1 class="text-2xl sm:text-4xl pb-8">Your Profile</h1>

		<div class="flex flex-col lg:flex-row gap-6 items-stretch">

			<!-- PERSONAL INFO (RESTORED ORIGINAL STYLE) -->
			<div class="w-full lg:w-1/3">
				<div class="flex flex-col relative rounded border-white border-2 p-6 sm:p-8 bg-[#2c2f3c]">

					<div class="absolute text-xl -top-4 left-4 bg-[#333745] px-3">
						Personal Information
					</div>

					<div class="flex justify-end pb-6">
						<button class="underline text-[#AFADAD] hover:text-white" onclick={openEditModal}>
							Edit
						</button>
					</div>

					<div class="flex flex-col text-sm sm:text-base w-full">

						<div class="flex justify-between">
							<p>Full Name</p>
							<p class="text-[#DCDFF5]">{$user?.user_metadata?.full_name ?? "Loading..."}</p>
						</div>

						<div class="h-px bg-white/30 my-4"></div>

						<div class="flex justify-between">
							<p>Email</p>
							<p class="text-[#DCDFF5]">{$user?.email ?? "Loading..."}</p>
						</div>

						<div class="h-px bg-white/30 my-4"></div>

						<div class="flex justify-between">
							<p>Password</p>
							<p class="text-[#DCDFF5]">••••••••</p>
						</div>

					</div>

				</div>
			</div>

			<!-- STRIPS -->
			<div class="w-full lg:w-2/3">
				<div class="relative bg-[#2c2f3c] border-2 border-white p-6 rounded">

					<div class="absolute text-xl -top-4 left-4 bg-[#333745] px-3">
						Recently taken strips
					</div>

					{#if stripsLoading}
						<p class="text-white/50">Loading...</p>

					{:else if strips.length === 0}
						<p class="text-white/50">No strips yet</p>

					{:else}
						<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">

							{#each strips as strip}
								<div
									class="relative group bg-white p-3 shadow-lg
										   transition duration-300
										   hover:scale-105 hover:-rotate-1 hover:shadow-2xl"
								>

									<!-- delete -->
									<button
										class="absolute top-2 right-2 bg-black/60 text-white w-6 h-6 rounded-full
											   opacity-0 group-hover:opacity-100"
										onclick={() => confirmDelete(strip)}
									>
										×
									</button>

									<img src={strip.publicUrl} class="w-full object-contain" />

									<p class="text-center text-[#333745] text-xs mt-2">
										{formatDate(strip.created_at)}
									</p>

								</div>
							{/each}

						</div>
					{/if}

				</div>
			</div>

		</div>
	</div>

	<!-- MODALS -->
	<ConfirmDelete
		open={showDeleteModal}
		onCancel={cancelDelete}
		onConfirm={deleteStrip}
	/>

	<EditInfo open={showEditModal} SaveChanges={closeEditModal} Cancel={closeEditModal} />

	<!-- UNDO TOAST -->
	<UndoToast
		show={!!recentlyDeleted}
		message="Strip deleted"
		actionLabel="Undo"
		onAction={undoDelete}
	/>

	<Footer />

</main>