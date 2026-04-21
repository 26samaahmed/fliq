<script lang="ts">
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import SuccessPopup from '$lib/components/popup/Success.svelte';

	import { user } from '$lib/stores/user';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

	let showPassword = false;
	let name = '';
	let email = '';
	let password = '';
	let error = '';
	let showSuccess = false;
	let popupTitle = '';
	let popupMessage = '';
	let popupHeader = '';

	async function handleSignup() {
		error = '';

		const { error: err, data } = await supabase.auth.signUp({
			email,
			password,
			options: { data: { full_name: name } }
		});

		if (err) {
			error = err.message;
		} else {
			if (data.user) {
				user.set(data.user);
			}

			popupHeader = 'Account Created!';
			popupTitle = 'Signup Successful';
			popupMessage = "Your account is ready. Let's get you started.";
			showSuccess = true;
		}
	}

	function goToStep1() {
		showSuccess = false;
		goto('/step1');
	}
</script>

<div class="bg-[#333745] min-h-screen flex flex-col p-6 font-aldrich">
	<Header />

	<div class="flex-1 flex flex-col items-center justify-start pt-10 sm:justify-center sm:pt-0 text-center">

		<!-- Title -->
		<h1 class="text-3xl sm:text-4xl text-white font-semibold">
			Sign up for Fliq
		</h1>

		<p class="text-white/70 text-base sm:text-lg mt-3 max-w-md">
			Create a free account or
			<a href="/login" class="underline text-[#DCDFF5]">
				log in
			</a>.
		</p>

		<!-- Card -->
		<form
			class="mt-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-lg flex flex-col gap-5 text-white"
			on:submit|preventDefault={handleSignup}
		>

			<!-- Name -->
			<input
				type="text"
				required
				name="full-name"
				autocomplete="name"
				placeholder="Full Name"
				bind:value={name}
				class="w-full px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/50 ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
			/>

			<!-- Email -->
			<input
				type="email"
				required
				name="email"
				autocomplete="email"
				placeholder="Email"
				bind:value={email}
				class="w-full px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/50 ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
			/>

			<!-- Password -->
			<div class="relative w-full">
				<input
					type={showPassword ? 'text' : 'password'}
					required
					name="password"
					autocomplete="new-password"
					placeholder="Password"
					bind:value={password}
					class="w-full px-4 py-2 pr-12 rounded-md bg-white/10 text-white placeholder-white/50 ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
				/>

				<button
					type="button"
					on:click={() => (showPassword = !showPassword)}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60 hover:text-white"
					aria-label="Toggle password visibility"
				>
					{showPassword ? 'Hide' : 'Show'}
				</button>
			</div>

			<!-- Error -->
			{#if error}
				<p class="text-red-400 text-sm">{error}</p>
			{/if}

			<!-- Submit Button -->
			<button
				type="submit"
				class="mt-2 self-center w-fit min-w-[180px] inline-flex items-center justify-center bg-[#D38A8A] text-white px-6 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300"
			>
				Sign Up
			</button>

		</form>

		<SuccessPopup
			open={showSuccess}
			onContinue={goToStep1}
			header={popupHeader}
			title={popupTitle}
			message={popupMessage}
		/>
	</div>

	<Footer />
</div>