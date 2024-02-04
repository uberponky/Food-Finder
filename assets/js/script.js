// INITIALISE HISTORY ARRAY
let history
if (history = localStorage.getItem('history')) history = JSON.parse(history)
else history = []

// GLOBAL VARIABLES
let index           // Used to track position in restaurants array
let restaurants     // Used to store current restaurants object

// AWAIT PAGE LOAD
$(function() {
  // Get search button
  const searchBtn = $('#search-button')
  const input = $('#location')
  const nextBtn = $('#next-btn')

  // Add event listener that passes current input value into searchResaurants function
  searchBtn.on('click', () => {
    searchRestaurants($("#location").val())
  })

  // Load in initial search history results
  displaySearchHistory($('#search-history-items'))

  // Establish listener to display search results
  displaySearch(input)

  // Establish listener to autocomplete
  input.on('input propertychange', () => {
    // When user enters 3 characters into input, call function
    if (input.val().length > 2) displayAutocomplete(input.val())
    else ($('#autocomplete-results').empty())
  })

  // Establish event listener for next button
  nextBtn.on('click', () => {
    loadNext(restaurants, index)
  })
})


// DEFINE THE SEARCH FUNCTION AND DECLARE THE VARIABLES

function searchRestaurants(location) {
  // If user entered nothing, do nothing
  if (location.length < 1) {
    return
  }

  // Store location in history and display in search results
  storeSearchHistory(location)
  displaySearchHistory()

  // const location = $("#location").val(); // location SEEMS to not error, but doesn't return accurate geo. tried to replace with address.city but is 'undefined' . I'm sure it's something stupid MM #raise ticket
  const cuisine = $("#cuisine").val()
  const price = $("#dollar_signs").val()

  // Make a request to the SPOONACULAR API
  // MM DAILY ALLOWANCE 150 const apiKey = "255a8a9c8426434fbef6d2926b18e54a"; key for mandy@cullenmiller.com, 
  const apiKey = "15b46f3111044b70a400bf923800f69e"; //key for bootcamp@cullenmiller.com, 
  const apiUrl = `https://api.spoonacular.com/food/restaurants/search?cuisine=${cuisine}&location=${location}&price=${price}&apiKey=${apiKey}`;

  // Make the API request
  $.get(apiUrl, function (data) {
    displayResults(data.restaurants)
  })

  // Loading logic
  const searchBtn = $('#search-button')
  const waitBtn = $('#search-button-waiting')
  searchBtn.addClass('hidden')
  waitBtn.removeClass("hidden")
}

function displayResults(restaurantsObj) {
  // NO RESTURANTS ARE RETURNED - RETURN
  const resLength = restaurantsObj.length
  if (resLength == 0) {
    // Empty existing results
    const resultsContainer = $("#results")
    resultsContainer.empty()
    
    // Show no results container
    $('#no-results').removeClass('hidden')

    // Remove waiting button
    const searchBtn = $('#search-button')
    const waitBtn = $('#search-button-waiting')
    searchBtn.removeClass('hidden')
    waitBtn.addClass("hidden")
    return
  }

  // RESTAURANTS ARE RETURNED - CONTINUE
  // Remove all but first 9 results of returned array
  if (resLength > 9) restaurants = restaurantsObj.slice(0, 9)  
  
  // Ensure no results div is hidden
  $('#no-results').addClass('hidden')

  // Unhide next button
  $('#next-btn').removeClass('hidden')
  $('#no-results-btn').addClass('hidden')

  // Reset index and load next restaurants to DOM
  index = 0
  loadNext(restaurants, index)

  // Remove waiting button
  const searchBtn = $('#search-button')
  const waitBtn = $('#search-button-waiting')
  searchBtn.removeClass('hidden')
  waitBtn.addClass("hidden")
}

// Sanitise array of cuisines
function formatCuisines(cuisines) {
  cuisines = cuisines.join(", ")                   // Convert array intro string
  cuisines = cuisines.split(', ')                  // Convert back to remove badly formatted array elements
  cuisines = cuisines.map(string => string.trim()) // Trim whitespace
  cuisines = [...new Set(cuisines)];               // Remove duplicates
  cuisines = cuisines.slice(0, 7)                  // Keep first 7 elements
  return cuisines.join(", ")                       // Return as string
}

// Create list elements and append to history search results
function displaySearchHistory() {
  const resultsEl = $('#search-history-items')
  resultsEl.empty()
  if (history.length > 0) {
    let results = history.map(item => `
      <li data-location="${item}">
        <i class="fa-solid fa-location-dot"></i>
        ${item}
      </li>
    `)
    resultsEl.html(results.join(""))

    // Add event listener to list items
    $('#search-history-items li').on('click', (e) => {
      // Grab data result of clicked item
      let location = $(e.target).data('location')
      // Load clicked element into search
      loadVal(location)
    })
  }
}

// Stringify history array and store in local storage
function storeSearchHistory(location) {
  const index = history.indexOf(location)
  if (index != -1) history.splice(index, 1)
  history.unshift(location)
  localStorage.setItem('history', JSON.stringify(history))
}

// Set up event listeners to display and hide search results
function displaySearch(input) {
  // Display search results
  const results = $('#search-history-results')
  input.focus(() => {
    results.removeClass('hidden')
  })

  // Add event listener to rest of document 
  $(document).click((e) => {
    let currID = $(e.target).attr('id')
    // Check if we have clicked in the field
    if((currID != 'search-history-results') && (currID != 'location')) {
      results.addClass('hidden')
    }
  })

  // If event bubbles up to results, don't hide
  results.click(() => results.removeClass('hidden'))
}

function displayAutocomplete(input) {
  let requestOptions = {
    method: 'GET',
  };
  let autocompleteURL = `https://api.geoapify.com/v1/geocode/autocomplete?filter=countrycode:ca&type=city&text=${input}&apiKey=3987842fa30942e9a1effc3d6bcd5a9a`
  let autocompleteResults = $('#autocomplete-results')

  fetch(autocompleteURL, requestOptions)
    .then(response => response.json())
    .then(data => {
      let results = []

      // Loop through results and display in search box
      data.features.forEach(feature => {
        let suburb = feature.properties.suburb ? ", "+feature.properties.suburb: ""
        let city = feature.properties.city
        let lat = feature.properties.lat
        let lon = feature.properties.lon
        results.push(`
          <li data-location="${city}${suburb}" data-lat="${lat}" data-lon="${lon}">
            ${city}${suburb}
          </li>
        `)  
      })

      // Add to DOM
      autocompleteResults.empty()
      autocompleteResults.append(results.join(""))
      $('#autocomplete-results li').on('click', (e) => {
        // Grab data result of clicked item
        let location = $(e.target).data('location')
        loadVal(location)
      })

      // Set current search result
      $('#placename').text(location)
    })
    .catch(error => console.log('error', error))
}

// Load clicked element into search
function loadVal(location) {
  $('#location').val(location)
}

// Format phone number
function formatPhoneNumber(num) {
  num = "0" + num.toString()  // Convert into string, from number
  num = num.split("")         // Convert into array
  num.splice(4, 0, " ")       // Add space
  num.splice(9, 0, " ")       // Add space
  num.pop()
  num = num.join("")          // Convert to string
  return num
}

// Format Price
function formatPrice(price) {
  let formattedPrice = ''
  if (price) {
    for (let i = 0; i < price; i++) {
      formattedPrice += '£'
    }
  } else {
    formattedPrice = '£'
  }
  return formattedPrice
  }

// Load next three restaurants, given a resturant object and starting index
function loadNext(restaurants, currentIndex) {
  // Empty existing results
  const resultsContainer = $("#results")
  resultsContainer.empty()

  // Array to store card DOM elements
  const cards= []

  // Skip declaration, use gloval index variable
  for (; index < Math.min((currentIndex + 3), restaurants.length); index++) {
    const restaurant = restaurants[index]

    //SELECT ONLY REQUIRED ADDRESS FIELDS FROM ADDRESS OBJECT
    const address = restaurant.address
    const displayAddress = `${address.street_addr}<br> ${address.city}<br> ${address.state} ${address.zipcode}`

    // Retrieving the URL for the image
    const imgURL = restaurant.logo_photos
    const imgURLFallback = '/images/restaurant-placeholder-1.jpg'

    // Format data elements
    const cuisines = formatCuisines(restaurant.cuisines)
    const phoneNo = formatPhoneNumber(restaurant.phone_number)
    let price = formatPrice(restaurant.dollar_signs)

    // Create DOM element for card
    const card = `
    <div class="card col-4 p-0 text-center">
      <img src="${imgURL}" class="card-img-top" alt="..." style="object-fit: cover; height: 10rem">
      <div class="card-body">
        <h5 class="card-title">${restaurant.name}</h5>
        <p class="address">${displayAddress}</p>
        <hr>
        <h6 class="m-0"><b>Phone</b></h6>
        <p class="card-text">${phoneNo}</p>
        <h6 class="m-0"><b>Price</b></h6>
        <p class="card-text">${price}</p>
        <h6 class="m-0"><b>Cuisines</b></h6>
        <p class="card-text">${cuisines}</p>
        <button class="btn" id="restaurant-favourite" data-index="${index}">Add to Favourites <i class="fa-regular fa-heart"></i></button>
        <button class="btn hidden" id="restaurant-favourite-added" data-index="${index}">Added <i class="fa-solid fa-heart"></i></button>
      </div>
    </div>
    `

    // Add to array of DOM elements
    cards.push(card)

    // Add event listeners to buttons
    $('#restaurant-favourite').on('click', () => {
      addtoFavourites(e)
    })
  }

  // Render to DOM
  resultsContainer.append(cards)

  // Hide next button if no more restaurants can be found
  if (index == restaurants.length) {
    $('#next-btn').addClass('hidden')
    $('#no-results-btn').removeClass('hidden')
  }
}

function addToFavourites(e) {
  e.preventDefault()
  console.log(e.target);
}