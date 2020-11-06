
// Variable Declarations

// get the city from input
var citySearched = $("#searchBox").val();

// set my api Key
var apiKey = "&appid=afaa8eea1769b4359fd8e07b2efcefbd";

// declare variable for eventual looong query
var myQueryURL = ''


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

  console.log(response)

// show the current weather
showCurrentWeather(response)


 makeForecast(response)
 makeList();

  })


})

function makeList() {
  var listItem = $("<li>").addClass("list-group-item").text(citySearched);
  $(".list").append(listItem);
}

function showCurrentWeather(response)
{

  // clear out what is currently displaying if anything
  $('#currentCity').empty();

    // get temperature from response and convert it fahrenheit
    var tempFahren = (response.main.temp - 273.15) * 1.80 + 32;

    // get the date
  //  var todayDate = Date()

   // console.log(todayDate.getFullYear())
  // 
    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body");
    var city = $("<h4>").addClass("card-title").text(response.name);
    //var cityDate = $("<h4>").addClass("card-title").text(todayDate.getDate());
    var temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempFahren + " °F");
    var humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    var wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

    // add to page
    //city.append(cityDate, image)
    cardBody.append(city, temperature, humidity, wind);
    card.append(cardBody);

    // get the UV Index


    /*$.ajax({
      url: myQueryURL,
      method: "GET"
    })
    .then(function (response){
    
      console.log(response)
*/
    

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

    // get the image for the forecast
    var cardImage = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")
  
      // get the temperature and convert to fahrenheit 
      var tempFahren =  Math.floor((results[i].main.temp - 273.15) * 1.80 + 32);
      
      //var tempF = Math.floor(temp);

      var card = $("<div>").addClass("card col-2 bg-primary text-white");
      var cardBody = $("<div>").addClass("card-body p-3 ")
      //var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
      var temperature = $("<p>").addClass("card-text forecastTemp").text("Temp: " + tempFahren + " °F");
      var humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

      
      cardBody.append(/*cityDate,*/ cardImage, temperature, humidity);
      card.append(cardBody);
      $("#forecast").append(card);

  }
})
}

function showUVIndex(){

}