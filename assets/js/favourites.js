// INITIALISE FAVOURITES ARRAY
let favourites
if (favourites = localStorage.getItem('favourites')) favourites = JSON.parse(favourites)
else favourites = []

// GLOBAL VARIABLES
let index = 0  // Used to track position in favourites array

// AWAIT PAGE LOAD
$(function() {
  // No favourites found
  if (favourites.length < 1) {
    $('#no-results').removeClass('hidden')
    return
  }

  // Grab DOM elements
  const nextBtn = $('#next-btn')
  const prevBtn = $('#prev-btn')

  // Load initial favourites
  loadNext(favourites, index)
  
  // Establish event listener for next button
  nextBtn.on('click', () => {
    loadNext(favourites, index)
  })

  // Establish event listener for previous button
  prevBtn.on('click', () => {
    index = Math.max(0, index - 6)
    loadNext(favourites, index)
  })
})


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
    const imgURLFallback = './images/missing-lunch.png'
    let imgURL = restaurant.logo_photos
    console.log(imgURL.naturalHeight);
    if ((!imgURL.length) || (imgURL.naturalHeight <= 90)) {
      imgURL = imgURLFallback
    }

    // Format data elements
    const cuisines = formatCuisines(restaurant.cuisines)
    const phoneNo = formatPhoneNumber(restaurant.phone_number)
    let price = formatPrice(restaurant.dollar_signs)

    // Grab ID 
    const id = restaurant["_id"]

    // Create DOM element for card
    const card = `
    <div class="col-12 col-md-4 my-2">
      <div class="card p-0 text-center">
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
          <button class="btn remove-restaurant-favourite" data-index="${id}">Remove from Favourites <i class="fa-solid fa-trash"></i></button>
          <button class="btn add-restaurant-favourite hidden" data-index="${id}">Removed <i class="fa-solid fa-check"></i></button>
        </div>
      </div>
    </div>
    `

    // Add to array of DOM elements
    cards.push(card)
  }

  // Render to DOM
  resultsContainer.append(cards)

  // Add event listeners to buttons
  $('.remove-restaurant-favourite').on('click', (e) => {
    removeFromFavourite(e)
  })

  // Replace broken images with placeholder
  $('.card-img-top').on('error', function () {
    $(this).attr("src", "./images/missing-lunch.png");
  })

  // Grab selectors for buttons
  const nextBtn = $('#next-btn')
  const prevBtn = $('#prev-btn')
  const noResultsBtn = $('#no-results-btn')

  // Hide next button if no more restaurants can be found
  if (index >= restaurants.length) {
    nextBtn.addClass('hidden')
    noResultsBtn.removeClass('hidden')
  } else {
    nextBtn.removeClass('hidden')
    noResultsBtn.addClass('hidden')
  }

  // Show previous button if index is higher than 3
  if (index > 3) {
    prevBtn.removeClass('hidden')
  } else {
    prevBtn.addClass('hidden')
  }
}

// Remove from favourites
function removeFromFavourite(e) {
  let addBtn = $(e.target)
  let addedBtn = addBtn.next()
  let restaurantId = addBtn.data('index')

  // Find index of restaurant in array with matching ID
  let selectedIndex = favourites.findIndex(restaurant => {
    return restaurant["_id"] == restaurantId
  })

  // Remove restaurant from local storage
  favourites.splice(selectedIndex, 1)
  
  localStorage.setItem('favourites', JSON.stringify(favourites))

  // Show / Hide buttons
  addBtn.addClass('hidden')
  addedBtn.removeClass('hidden')
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