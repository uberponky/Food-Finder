//DEFINE THE SEARCH FUNCTION AND DECLARE THE VARIABLES

function searchRestaurants() {
    const location = $("#location").val();
    const cuisine = $("#cuisine").val();
    const price = $("#dollar_signs").val();

    
    // Make a request to the SPOONACULAR API

    // MM DAILY ALLOWANCE 150 const apiKey = "255a8a9c8426434fbef6d2926b18e54a";
    const apiKey = "15b46f3111044b70a400bf923800f69e";
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
        
     // Format opening hours
     const openingHours = formatOpeningHours(restaurant.local_hours.dine_in);

     function formatOpeningHours(openingHours) {
        let formattedHours = "<ul>";
       
        for (const day in openingHours) {
            formattedHours += `<li>${day}: ${openingHours[day]}</li>`;
        }
               formattedHours += "</ul>";
        return formattedHours;
       }

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


      // Retrieving the URL for the image
      const imgURL = restaurant.logo_photos;

      // Creating an element to hold the image
      const image = $("<img>").attr("src", imgURL);

 

     resultsContainer.append(card);
     resultsContainer.append(image);
     
     
 }
}
