import { useState } from "react";
import BreweryList from "./components/BreweryList";
import BreweryDetail from "./components/BreweryDetail";

function App() {
	const [selectedBreweryId, setSelectedBreweryId] = useState(null);

	return (
		<main>
			<h1>Beer Cellar</h1>
			{selectedBreweryId === null ? (
				<BreweryList onSelect={setSelectedBreweryId} />
			) : (
				<BreweryDetail
					breweryId={selectedBreweryId}
					onBack={() => setSelectedBreweryId(null)}
				/>
			)}
		</main>
	);
}

export default App;
