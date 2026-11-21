import { useState } from "react";

const EMPTY_FORM = {
	name: "",
	style: "",
	abv: "",
	release_type: "",
};

function AddBeerForm({ breweryId, onBeerAdded }) {
	const [form, setForm] = useState(EMPTY_FORM);
	const [submitting, setSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errors, setErrors] = useState([]);

	function handleChange(event) {
		const field = event.target.name;
		const value = event.target.value;
		setForm({ ...form, [field]: value });
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setSubmitting(true);
		setSuccessMessage("");
		setErrors([]);

		const body = {
			brewery_id: breweryId,
			name: form.name,
			style: form.style.trim() === "" ? null : form.style.trim(),
			abv: form.abv === "" ? null : Number(form.abv),
			release_type: form.release_type === "" ? null : form.release_type,
		};

		try {
			const response = await fetch("/api/v1/beers", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const data = await response.json();

			if (response.ok) {
				setSuccessMessage(`"${data.beer.name}" was added!`);
				setForm(EMPTY_FORM);
				onBeerAdded();
			} else if (data.errors) {
				setErrors(data.errors);
			} else {
				setErrors([{ field: "", message: data.message }]);
			}
			// eslint-disable-next-line no-unused-vars
		} catch (err) {
			setErrors([
				{ field: "", message: "Could not reach the server. Please try again." },
			]);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<h3>Add a beer</h3>

			<label>
				{" "}
				Name *
				<input name="name" value={form.name} onChange={handleChange} />
			</label>
			<label>
				Style
				<input name="style" value={form.style} onChange={handleChange} />
			</label>

			<label>
				ABV (%)
				<input
					name="abv"
					type="number"
					step="0.1"
					value={form.abv}
					onChange={handleChange}
				/>
			</label>

			<label>
				Release type
				<select
					name="release_type"
					value={form.release_type}
					onChange={handleChange}
				>
					<option value="">Not specified</option>
					<option value="core">Core</option>
					<option value="seasonal">Seasonal</option>
					<option value="limited">Limited</option>
					<option value="one-off">One-off</option>
				</select>
			</label>

			<button type="submit" disabled={submitting}>
				{submitting ? "Saving…" : "Add beer"}
			</button>

			{successMessage && <p className="success">{successMessage}</p>}

			{errors.length > 0 && (
				<ul className="error">
					{errors.map((error, index) => (
						<li key={index}>{error.message}</li>
					))}
				</ul>
			)}
		</form>
	);
}

export default AddBeerForm;
