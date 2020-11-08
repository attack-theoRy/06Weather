
// Variable Declarations

// get the city from input
var citySearched = $("#searchBox").val();

// set my api Key
var apiKey = "&appid=afaa8eea1769b4359fd8e07b2efcefbd";

// declare variable for eventual looong query
var myQueryURL = ''

var savedCities = ''

var date = new Date();

searchHistory()


// event listener function for the search button
// what happens when you hit search!
$("#searchBtn").on("click", function() {

// get the value from the form
citySearched = $("#searchBox").val();

// the full query 
myQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearched + apiKey;

// ajax api call
$.ajax({
  url: myQueryURL,
  method: "GET"
})
.then(function (response){


// show the current weather
showCurrentWeather(response)
showUVIndex(response)

 makeForecast(response)
 searchHistory();

  })


})

$(".btn-primary").on("click", function(event) {

  // get the value from the form

  var selection = event.target

  savedCity= $(".btn-primary").val();

  console.log(savedCity)
  
  // the full query 
  myQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + savedCity + apiKey;
  
  // ajax api call
  $.ajax({
    url: myQueryURL,
    method: "GET"
  })
  .then(function (response){
  
    console.log(response)
  
  // show the current weather
  showCurrentWeather(response)
  showUVIndex(response)
  
   makeForecast(response)
   searchHistory();
  
    })
  
  
  })

  // get saved cities from localStorage and also save the current cities searched for
function searchHistory() {

  savedCities = JSON.parse(localStorage.getItem('savedCities'))

  

  if(savedCities != null)
  {
  for(var i=0; i< savedCities.length; i++)
  {
    var listItem = $("<li>").addClass("list-group-item").text(savedCities[i]);
    listItem.addClass('btn-primary')
    $(".list").append(listItem);

  }
}

if(citySearched != '')
{
  var listItem = $("<li>").addClass("list-group-item").text(citySearched);

  listItem.addClass('btn-primary')
  $(".list").append(listItem);
  savedCities.push(citySearched)
  localStorage.setItem('savedCities', savedCities)
}


  //savedCities.push(citySearched)

 

 //savedCities = JSON.parse(localStorage.getItem('savedCities'))
}


function showCurrentWeather(response)
{

  // clear out what is currently displaying if anything
  $('#currentCity').empty();

    // get temperature from response and convert it fahrenheit
    var tempFahren = (response.main.temp - 273.15) * 1.80 + 32;

    // get the date
    //var todayDate = Date()


    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body");
    var city = $("<h4>").addClass("card-title").text(response.name);
    const cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
    var temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempFahren + " °F");
    var humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    var wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

    // add to page
    city.append(cityDate, image)
    cardBody.append(city, temperature, humidity, wind);
    card.append(cardBody);

    // get the UV Index

    $("#currentCity").append(card)

}

function makeForecast(response)
{

  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearched + apiKey,
    method: "GET"
  }).then(function (response){


  // variable to hold response.list
  var results = response.list;
  
  // debug the list
  console.log(response)
  
  // 
  $('#forecast').empty();


  for (var i = 0; i < results.length; i++) {


    if(results[i].dt_txt.indexOf("12:00:00") !== -1){
    
      // get the image for the forecast
    var cardImage = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")
  
      // get the temperature and convert to fahrenheit 
      //var tempFahren =  Math.floor((results[i].main.temp - 273.15) * 1.80 + 32);

    var temp = (results[i].main.temp - 273.15) * 1.80 + 32;
    var tempFahren = Math.round(temp);


      var card = $("<div>").addClass("card col-2 bg-primary text-white currentCard");

      var cardBody = $("<div>").addClass("card-body p-3 ")
     
      var temperature = $("<p>").addClass("card-text forecastTemp").text("Temp: " + tempFahren + " °F");
      var humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

      const cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));

      
      cardBody.append(cityDate, cardImage, temperature, humidity);
      card.append(cardBody);
      $("#forecast").append(card);
    }

  }
})
}

function showUVIndex(response){


  // used for debugging
  console.log(response)

  // get the longitude from the API response
  var longitude = response.coord.lon

  // get the latitude from the API response
  var latitude = response.coord.lat

  // get UV url query
  var UVurl = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + latitude + '&lon=' + longitude + apiKey

  $.ajax({
    url: UVurl,
    method: "GET"
  }).then(function (response){

    if(response.value)


    var UVindex = $("<p>").addClass("card-text current-UV").text("UV Index: " + response.value);

   // $('currentCard').append(UVindex)
    $("#currentCity").append(UVindex)
  })




}