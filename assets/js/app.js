async function loadPlaces() {
    const placeList = document.getElementById('place-list');
    placeList.innerHTML = "Loading places...";

    try {
        // Fetch a list of JSON files from the "places" folder
        const response = await fetch('./places/index.json');
        const files = await response.json();

        const places = await Promise.all(
            files.map(async (file) => {
                const res = await fetch(`./places/${file}`);
                return res.json();
            })
        );

        placeList.innerHTML = ""; // Clear loading text

        // Populate the list with places
        places.forEach((place) => {
            const placeDiv = document.createElement('div');
            placeDiv.classList.add('place-item');
            placeDiv.innerHTML = `
                <h3>${place.name}</h3>
                <p>Price Range: ${place.price}</p>
                <p>Location: ${place.location}</p>
                <p>Description: ${place.description}</p>
            `;
            placeList.appendChild(placeDiv);
        });
    } catch (error) {
        console.error("Error loading places:", error);
        placeList.innerHTML = "Failed to load places.";
    }
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', loadPlaces);

