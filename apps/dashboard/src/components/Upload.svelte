<script lang="ts">
	import { Upload } from 'tus-js-client';

	let fileinput: HTMLInputElement;

	async function onSubmit(e: Event) {
		e.preventDefault();

		if (!fileinput) {
			return;
		}

		if (!fileinput.files?.length) {
			return;
		}

		const file = fileinput.files[0];
		const upload = new Upload(file, {
			endpoint: 'http://localhost:8000/uploads/',
			metadata: {
				filename: file.name,
				filetype: file.type
			},
			// Callback for errors which cannot be fixed using retries
			onError: function (error) {
				console.log('Failed because: ' + error);
			},
			// Callback for reporting upload progress
			onProgress: function (bytesUploaded, bytesTotal) {
				var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
				console.log(bytesUploaded, bytesTotal, percentage + '%');
			},
			// Callback for once the upload is completed
			onSuccess: function () {
				console.log('Download %s from %s', file.name, upload.url);
			}
		});

		// upload.findPreviousUploads().then(function (previousUploads) {
		// 	// Found previous uploads so we select the first one.
		// 	if (previousUploads.length) {
		// 		upload.resumeFromPreviousUpload(previousUploads[0]);
		// 	}

		// 	// Start the upload
		// 	upload.start();
		// });

		upload.start();
	}

	// async function onSubmit(e: Event) {
	// 	e.preventDefault();

	// 	if (!fileinput) {
	// 		return;
	// 	}

	// 	const files = fileinput.files || [];

	// 	for (const file of files) {
	// 		const res = await fetch('http://localhost:8000/uploads', {
	// 			method: 'POST',
	// 			headers: {
	// 				Accept: 'application/json',
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: JSON.stringify({
	// 				name: file.name,
	// 				size: file.size,
	// 				mime: file.type
	// 			})
	// 		});
	// 		const { id } = await res.json();

	// 		let start = 0;
	// 		let end = file.size;

	// 		while (start < end) {
	// 			const offset = start + CHUNK_SIZE;

	// 			await fetch(`http://localhost:8000/uploads/${id}`, {
	// 				method: 'PATCH',
	// 				headers: {
	// 					'Content-Type': 'application/octet-stream',
	// 					Accept: 'application/json'
	// 				},
	// 				body: file.slice(start, offset)
	// 			});

	// 			start = offset;
	// 		}
	// 	}
	// }
</script>

<form on:submit={onSubmit}>
	<input type="file" bind:this={fileinput} />
	<input type="submit" value="Upload" />
</form>
