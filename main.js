'use strict';

$(document).ready(init);

function init() {
  $('#submit').on('click', repopulate);
  var str = 'autoip';
  requestData(str); //fill with initial values based on user's location
}

function requestData(str) {
  $.ajax({
    url: 'http://api.wunderground.com/api/1c06984b8bf2cf2c/conditions/q/'+str+'.json',
    method: 'GET',
    dataType: "jsonp",
    success: function(data) {
      displayIt(data);
    },
    error: function(err) {
      console.log('error:', err);
      window.location.reload();
    }
  });
}

function displayIt(data) {
  var $temp = $('#temp');
  var $weather = $('#weather');
  var $humidity = $('#humidity');

  $temp.html('');
  $weather.html('');
  $humidity.html('');

  var weather = data.current_observation.weather;
  var humidity = data.current_observation.relative_humidity;
  var temp = data.current_observation.temp_f;
  var city = data.current_observation.display_location.full;
  var zip = data.current_observation.display_location.zip;
  var observationTime = data.current_observation.observation_time_rfc822;

  console.log(data.current_observation);
  console.log("Current temperature in "+city+" ("+zip+") is: "+temp+". It's "+weather+".");
  console.log("Humidity is at "+humidity+". Last updated on "+ observationTime);

  $('#zipCode').val(zip);

  $temp.append('<p>The current temperature in '+city+ ' is '+temp+' degrees fahrenheit</p>');
  $weather.append('<p>The humidity is at '+humidity+'</p>');
  $humidity.append('<p>Last updated on '+observationTime+'</p>');

  if ((weather == 'Overcast') || (weather.indexOf('Cloud') > -1)) {
    $weather.append('<img src="cloud.png">');
  }
  else if (weather == 'Rain') {
    $weather.append('<img src="rain.png">');
  }
  else if (weather == 'Snow') {
    $weather.append('<img src="snow.png">');
  }
  else if (weather.indexOf('Thunder') > -1) {
    $weather.append('<img src="thunder.png">');
  }
  else {
    $weather.append('<img src="sun.png">');
  }
}

function repopulate() {
  var zipCode = $('#zipCode').val(); //get user input
  var zipRegex = /^\d{5}$/g;
  if (!zipRegex.test(zipCode)) { //if zipcode isn't valid
    return; //do nothing
  }
  requestData(zipCode);
}
