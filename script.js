function searchRestaurants() {
    const location = $("#location").val();
    const cuisine = $("#cuisine").val();
    const price = $("#price").val();

    
    // Make a request to the SPOONACULAR API

    const apiKey = "255a8a9c8426434fbef6d2926b18e54a";
    const apiUrl = `https://api.spoonacular.com/food/restaurants/search?cuisine=${cuisine}&apiKey=${apiKey}`;

    // Make the API request
    $.get(apiUrl, function (data) {
        displayResults(data.restaurants);
    });
}

function displayResults(restaurants) {
    // Display results
    const resultsContainer = $("#results");
    resultsContainer.empty();

    console.log ("Here are the results")
}

function addLike(index) {

}
