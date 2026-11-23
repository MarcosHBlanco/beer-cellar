import { useState } from "react";
import BreweryList from "./components/BreweryList";
import BreweryDetail from "./components/BreweryDetail";
import BrewerySearch from "./components/BrewerySearch";

function App() {
	const [selectedBreweryId, setSelectedBreweryId] = useState(null);
	const [listRefreshKey, setListRefreshKey] = useState(0);

	return (
		<main>
			<h1>Beer Cellar</h1>
			{selectedBreweryId === null ? (
				<>
					<BrewerySearch
						onBrewerySaved={() => setListRefreshKey(listRefreshKey + 1)}
					/>
					<BreweryList
						onSelect={setSelectedBreweryId}
						refreshKey={listRefreshKey}
					/>
				</>
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
