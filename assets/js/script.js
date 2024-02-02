//DEFINE THE SEARCH FUNCTION AND DECLARE THE VARIABLES

function searchRestaurants() {
  const location = $("#location").val(); // location SEEMS to not error, but doesn't return accurate geo. tried to replace with address.city but is 'undefined' . I'm sure it's something stupid MM #raise ticket
  const cuisine = $("#cuisine").val();
  const price = $("#dollar_signs").val();

  // Make a request to the SPOONACULAR API

  // MM DAILY ALLOWANCE 150 const apiKey = "255a8a9c8426434fbef6d2926b18e54a"; key for mandy@cullenmiller.com, 
  const apiKey = "15b46f3111044b70a400bf923800f69e"; //key for bootcamp@cullenmiller.com, 
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

  const cardsAndImages = []; // Array to store card and image elements - have changed this to improve performance
//   const cards = []; //Would like these to be seprate objects to allow layout manipulation. Discuss
//   const images = []; //Would like these to be seprate objects to allow layout manipulation. Discuss

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
    const image = $("<img>").attr("src", imgURL); // need to constrain image size  MM #raise ticket

    // Add card and image elements to the array - this should improve performance by taking the append out of the forLoop
    cardsAndImages.push(card);
    cardsAndImages.push(image);
    // cards.push(card); //if we separate the objects
    // images.push(image);
  }

  // Now add the card and image to the container
  resultsContainer.append(cardsAndImages);
  //  resultsContainer.append(cards); //if we separate the objects
  //  resultsContainer.append(images)
}
