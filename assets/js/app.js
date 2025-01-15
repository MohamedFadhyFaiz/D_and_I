async function loadPlaces() {
    const placeList = document.getElementById('place-list');
    placeList.innerHTML = "Loading places...";

    try {
        // Fetch a list of JSON files from the "places" folder
        const response = await fetch('./places/index.json');
        const files = await response.json();

        // Fetch place details and store them
        const places = await Promise.all(
            files.map(async (file) => {
                const res = await fetch(`./places/${file}`);
                return res.json();
            })
        );

        // Save all places globally for filtering
        window.allPlaces = places;

        placeList.innerHTML = ""; // Clear loading text

        renderPlaces(places); // Render all places initially
    } catch (error) {
        console.error("Error loading places:", error);
        placeList.innerHTML = "Failed to load places.";
    }
}

function renderPlaces(places) {
    const placeList = document.getElementById('place-list');
    placeList.innerHTML = ""; // Clear previous entries

    places.forEach((place) => {
        const placeDiv = document.createElement('div');
        placeDiv.classList.add('place-item');
        placeDiv.innerHTML = `
            <h3>${place.name}</h3>
            <p>Price: ${place.price === 0 ? "Free" : `${place.price} AED`}</p>
            <p>Location: ${place.location}</p>
            <p>Description: ${place.description}</p>
        `;
        placeList.appendChild(placeDiv);
    });
}

function applyFilter() {
    const priceRange = document.getElementById('price-range').value;

    if (priceRange === "all") {
        renderPlaces(window.allPlaces); // Show all places if "All" is selected
    } else {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);

        const filteredPlaces = window.allPlaces.filter((place) => {
            return place.price >= minPrice && place.price <= maxPrice;
        });

        renderPlaces(filteredPlaces); // Show only filtered places
    }
}

// Attach the filter function to the dropdown change event
document.getElementById('price-range').addEventListener('change', applyFilter);

// Attach event listener to the dropdown
document.addEventListener('DOMContentLoaded', () => {
    loadPlaces(); // Load places on page load

    const priceFilter = document.getElementById('price-range');
    priceFilter.addEventListener('change', applyFilter); // Apply filter on change
});
