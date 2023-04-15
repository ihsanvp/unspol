<script lang="ts">
	const CHUNK_SIZE = 100 * 1024 * 1024; // 100 MB

	let fileinput: HTMLInputElement;

	async function onSubmit(e: Event) {
		e.preventDefault();

		if (!fileinput) {
			return;
		}

		const files = fileinput.files || [];

		for (const file of files) {
			const res = await fetch('http://localhost:8000/uploads', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: file.name,
					size: file.size,
					mime: file.type
				})
			});
			const { id } = await res.json();

			let start = 0;
			let end = file.size;

			while (start < end) {
				const offset = start + CHUNK_SIZE;

				await fetch(`http://localhost:8000/uploads/${id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/octet-stream',
						Accept: 'application/json'
					},
					body: file.slice(start, offset)
				});

				start = offset;
			}
		}
	}
</script>

<form on:submit={onSubmit}>
	<input type="file" bind:this={fileinput} />
	<input type="submit" value="Upload" />
</form>
