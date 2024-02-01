//DEFINE THE SEARCH FUNCTION AND DECLARE THE VARIABLES

function searchRestaurants() {
    const location = $("#location").val();
    const cuisine = $("#cuisine").val();
    const price = $("#dollar_signs").val();

    
    // Make a request to the SPOONACULAR API

    const apiKey = "255a8a9c8426434fbef6d2926b18e54a";
    const apiUrl = `https://api.spoonacular.com/food/restaurants/search?cuisine=${cuisine}&location=${location}&price=${price}&apiKey=${apiKey}`;

    // Make the API request
    $.get(apiUrl, function (data) {
        displayResults(data.restaurants);
    });
}

function displayResults(restaurants) {
    // DECLARE resultsContainer THEN EMPTY BEFORE APPENDING NEW CARDS
    const resultsContainer = $("#results");
    resultsContainer.empty();


    // CONSTRAIN THIS TO 10 (OR MORE, TBC....)
    for (let index = 0; index < Math.min(10, restaurants.length); index++) {
        const restaurant = restaurants[index];
            console.log(restaurant); // Log the entire restaurant object to the console

        //SELECT ONLY REQUIRED ADDRESS FIELDS FROM ADDRESS OBJECT
        const address = restaurant.address;
        const displayAddress = `${address.street_addr}<br> ${address.city}<br> ${address.state} ${address.zipcode}`;
        
        
        //PARSE OPENING HOURS FROM local_hours.dine_in OBJECT
        const openingHours = JSON.stringify(restaurant.local_hours.dine_in);


        //LAYOUT OF OUTPUT WHICH WILL DISPLAY ON HTML PAGE
            const card = `
                <div class="card mt-3">
                    <div class="card-body">
                        <h5 class="card-title">${restaurant.name}</h5>
                        <p class="card-text">${displayAddress}</p>
                        <p class="card-text">Phone Number:${restaurant.phone_number}</p>
                        <p class="card-text">Cuisines: ${restaurant.cuisines}</p>
                        <p class="card-text">Price Bracket: ${restaurant.dollar_signs}</p>
                        <p class="card-text">Opening hours: ${openingHours}</p>

                    </div>
                </div>
        `;
        resultsContainer.append(card);
    };
}

