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

    const currentDate = new Date(); // Get current date

    places.forEach((place) => {
        const placeDiv = document.createElement('div');
        placeDiv.classList.add('place-item');

        // Parse the endDate string into a Date object
        const endDate = new Date(place.endDate);

        // Determine the status and ending date message
        let status, endingText;
        if (currentDate <= endDate) {
            status = `<span style="color: green;">OPEN</span>`;
            endingText = `Ends on <b>${endDate.toLocaleDateString()}</b>`;
        } else {
            status = `<span style="color: red;">CLOSED</span>`;
            endingText = `Ended on <b>${endDate.toLocaleDateString()}</b>`;
        }

        // Render the place details
        placeDiv.innerHTML = `
            <h3><a href="${place.socialLink}" target="_blank" style="color: #ffd369; text-decoration: none;">${place.name}</a></h3>
            <p>Status: ${status}</p>
            <p>${endingText}</p>
            <p>Price: ${place.price === 0 ? "Free" : `${place.price} AED`}</p>
            <p>
                Location: 
                <a href="${place.mapLink}" target="_blank" style="color: #00adb5; text-decoration: none;">
                    ${place.location}
                </a>
            </p>
            <p>Description: ${place.description}</p>
        `;
        placeList.appendChild(placeDiv);
    });
}

function applyFilter() {
    const priceRange = document.getElementById('price-range').value;

    let filteredPlaces;

    if (priceRange === "all") {
        filteredPlaces = window.allPlaces; // Show all places
    } else if (priceRange.includes("-")) {
        // Handle range-based filtering (e.g., "0-50", "50-10000")
        const [minPrice, maxPrice] = priceRange.split("-").map(Number);
        filteredPlaces = window.allPlaces.filter(
            (place) => place.price >= minPrice && place.price <= maxPrice
        );
    } else {
        // Handle exact price (e.g., "0" for free)
        const exactPrice = Number(priceRange);
        filteredPlaces = window.allPlaces.filter((place) => place.price === exactPrice);
    }

    renderPlaces(filteredPlaces); // Display the filtered places
}

// Attach the filter function to the dropdown change event
document.getElementById('price-range').addEventListener('change', applyFilter);

// Attach event listener to the dropdown
document.addEventListener('DOMContentLoaded', () => {
    loadPlaces(); // Load places on page load

    const priceFilter = document.getElementById('price-range');
    priceFilter.addEventListener('change', applyFilter); // Apply filter on change
});
