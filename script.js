function searchRestaurants() {
    const location = $("#location").val();
    const cuisine = $("#cuisine").val();
    const price = $("#dollar_signs").val();

    
    // Make a request to the SPOONACULAR API

    const apiKey = "255a8a9c8426434fbef6d2926b18e54a";
    const apiUrl = `https://api.spoonacular.com/food/restaurants/search?cuisine=${cuisine}&location=${location}&apiKey=${apiKey}`;

    // Make the API request
    $.get(apiUrl, function (data) {
        displayResults(data.restaurants);
    });
}

function displayResults(restaurants) {
    // Empty out Results then Display results
    const resultsContainer = $("#results");
    resultsContainer.empty();


// NEED TO CONSTRAIN THIS TO 10
    restaurants.forEach((restaurant, index) => {
        console.log(restaurant); // Log the entire restaurant object to the console

        const card = `
            <div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">${restaurant.name}</h5>
                    <p class="card-text">${restaurant.address}</p>
                    <p class="card-text">Phone Number:${restaurant.phone_number}</p>
                    <p class="card-text">Cuisines: ${restaurant.cuisines}</p>
                    <p class="card-text">Drscription: ${restaurant.description}</p>
                    <p class="card-text">Price Bracket: ${restaurant.dollar_signs}</p>
                    <p class="card-text">Opening hours: ${restaurant.local_hours.dine_in}</p>

                </div>
            </div>
        `;
        resultsContainer.append(card);
    });
}

