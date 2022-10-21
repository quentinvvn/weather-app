function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(maPosition, erreurPosition, {
      maximumAge: 600000,
      enableHighAccuracy: true,
    });
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function maPosition(position) {
  document.getElementById("description").innerHTML = `
  <div class="loader">
      <div class="spinner"></div>
      <div class="loader-text">Chargement...</div>
  </div>`;
  userlat = position.coords.latitude;
  userlon = position.coords.longitude;
  affichageDonnees();
  return userlat, userlon;
}

function erreurPosition(error) {
  var info = "Erreur lors de la géolocalisation : ";
  switch (error.code) {
    case error.TIMEOUT:
      info += "Timeout !";
      break;
    case error.PERMISSION_DENIED:
      info += "Vous n’avez pas donné la permission";
      break;
    case error.POSITION_UNAVAILABLE:
      info += "La position n’a pu être déterminée";
      break;
    case error.UNKNOWN_ERROR:
      info += "Erreur inconnue";
      break;
  }
  alert(info);
}

function chercher() {
  var ville = document.getElementById("ville").value;
  if (ville != "") {
    const url =
      "https://nominatim.openstreetmap.org/search?" +
      "q=" +
      ville +
      "&format=json&addressdetails=1&limit=1&polygon_svg=1";
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        if (response != "") {
          userlat = response[0]["lat"];
          userlon = response[0]["lon"];
          affichageDonnees();
          return userlat, userlon;
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
}

async function recupDonnees() {
  const weekday = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  var date = new Date();
  timeMinutes = date.getMinutes();
  if (timeMinutes < 10) {
    timeMinutes = "0" + timeMinutes;
  }
  const url =
    "https://api.openweathermap.org/data/2.5/weather?" +
    "lat=" +
    userlat +
    "&lon=" +
    userlon +
    "&units=" +
    "metric" +
    "&lang=fr&appid=b59107cebd701651b8b2c44483acf61d";
  const villeRecup = await fetch(url)
    .then(function (result) {
      return result.json();
    })
    .then((result) => {
      if (result != "") {
        var current_time =
          weekday[date.getDay()] + ", " + date.getHours() + ":" + timeMinutes;
        document.getElementById("weather-icon").src =
          "./weather_icons/" + result["weather"][0]["icon"] + ".png";
        document.getElementById("temp").innerHTML =
          Math.trunc(result["main"]["temp"]) + "<span>°C</span>";
        document.getElementById("feels-like").innerHTML =
          "Ressenti : " + Math.trunc(result["main"]["feels_like"]) + "°C";
        document.getElementById("description").innerHTML =
          '<i class="fa-brands fa-cloudversify">&thinsp;</i>' +
          result["weather"][0]["description"];
        document.getElementById("day").innerHTML = current_time;
        document.getElementById("city").innerHTML =
          `<i class="fa-solid fa-location-dot"></i> ` +
          result["name"] +
          ", " +
          result["sys"]["country"];
        document.getElementById("humidity").innerHTML = "Humidité";
        document.getElementById("humidity-icon").src =
          "./weather_icons/humidity.png";
        document.getElementById("humidity-value").innerHTML =
          "<h2>" + result["main"]["humidity"] + " %</h2>";
        document.getElementById("wind-speed").innerHTML = "Vitesse du vent";
        document.getElementById("wind-icon").src = "./weather_icons/wind-day.png";
        document.getElementById("wind-value").innerHTML = "<h2>" + result["wind"]["speed"] + " m/s</h2>";
        document.getElementById("pressure").innerHTML = "Pression";
        document.getElementById("pressure-icon").src =
          "./weather_icons/pressure.png";
        document.getElementById("pressure-value").innerHTML =
          "<h2>" + result["main"]["pressure"] + " hPa</h2>";
        document.getElementById("cloud").innerHTML = "Cloud";
        document.getElementById("clouds-icon").src =
          "./weather_icons/clouds.png";
        document.getElementById("cloud-value").innerHTML =
          "<h2>" + result["clouds"]["all"] + " %</h2>";
        document.getElementById("sunrise").innerHTML = "Sunrise";
        document.getElementById("sunrise-icon").src =
          "./weather_icons/sunrise.png";
        var myDate = new Date(result["sys"]["sunrise"] * 1000);
        const str = myDate.toLocaleString();
        const words = str.split(" ");
        document.getElementById("sunrise-value").innerHTML =
          "<h2>" + words[1] + "</h2>";
        document.getElementById("sunset").innerHTML = "Sunset";
        document.getElementById("sunset-icon").src =
          "./weather_icons/sunset.png";
        var myDate = new Date(result["sys"]["sunset"] * 1000);
        const str2 = myDate.toLocaleString();
        const words2 = str2.split(" ");
        document.getElementById("sunset-value").innerHTML =
          "<h2>" + words2[1] + "</h2>";
        console.log(result);
        var villeRecup = result["name"];
        document.getElementById("scroller").style.borderRadius = "19px 19px 19px 19px";
        document.getElementById("scroller").style.border = "1px solid rgb(25, 32, 45)";
        document.getElementById("scroller").style.overflow = "auto";
        return villeRecup;
      }
    })
    .catch((error) => {
      alert(error);
    });
  return villeRecup;
}

function recupDonneesJour(){
  const url = 
  "https://www.prevision-meteo.ch/services/json/lat=" +
  userlat + "lng=" + userlon;
  fetch(url)
    .then(function (result) {
      return result.json();
    })
    .then(result => {
      console.log(result);
      var date = new Date();
      var current_hours = date.getHours();
      function calcMaxHours(){
        document.getElementsByClassName("highlight-container")[0].innerHTML = "";
        var NbrHours = 24 - current_hours;
        console.log(NbrHours);
        return NbrHours
      }
      calcMaxHours();
      var NbrHoursCalc = calcMaxHours();
      for(let n = 1; n < NbrHoursCalc; n++){
        console.log(n);
        document.getElementsByClassName("highlight-container")[0].innerHTML += `
        <div class="h-cardComplete">
            <h4 class="h-title" id="h+` + n + `"></h4>
            <img id="h+` + n + `Icon" src="" alt="" />
            <div class="h-value" id="h+` + n + `Value"></div>
        </div>`
        document.getElementById("h+" + n).innerHTML = (current_hours + n) + "h00";
        document.getElementById("h+" + n + "Value").innerHTML = "<h2>" + result["fcst_day_0"]["hourly_data"][(current_hours + n) + "H00"]["TMP2m"] + "<span>°C</span></h2>";
        document.getElementById("h+" + n + "Icon").src = result["fcst_day_0"]["hourly_data"][(current_hours + n) + "H00"]["ICON"]
      }
    })
}

function recupDonneesSemaine(){
  const url = 
  "https://www.prevision-meteo.ch/services/json/lat=" +
  userlat + "lng=" + userlon;
  fetch(url)
    .then(function (result) {
      return result.json();
    })
    .then(result => {
      console.log(result);
      
      document.getElementsByClassName("highlight-container")[2].innerHTML = "";
      for(let m = 1; m < 5; m++){
        document.getElementsByClassName("highlight-container")[2].innerHTML += `
        <div class="h-cardComplete">
            <h4 class="h-title" id="d+` + m + `"></h4>
            <img id="d+` + m + `Icon" src="" alt="" />
            <div class="h-value" id="d+` + m + `Value"></div>
        </div>`
        var minTemp, maxTemp, dayTemp;
        for(let o = 0; o < 24; o++){
          dayTemp = result["fcst_day_" + m]["hourly_data"][o + "H00"]["TMP2m"];
          if(o == 1){
            minTemp = dayTemp;
            maxTemp = dayTemp;
          } else {
            if(dayTemp < minTemp){
              minTemp = dayTemp;
            } else if(dayTemp > maxTemp){
              maxTemp = dayTemp;
            } else {
  
            }
          }
        }
        document.getElementById("d+" + m).innerHTML = "<h2>" + result["fcst_day_" + m]["day_long"] +  "</h2>";
        document.getElementById("d+" + m + "Value").innerHTML = "<h2> Température Min: " + minTemp + " °C<br />Température Max: " + maxTemp + " °C</h2>";
        document.getElementById("d+" + m + "Icon").src = result["fcst_day_" + m]["icon"]
      }
    })
    changeBackground();
}


function affichageDonnees(){
  recupDonnees();
  recupDonneesJour();
  recupDonneesSemaine();
}

function changeBackground(){
  var element = document.querySelectorAll('.h-card');
  for(i=0; i < element.length; i++) {
    element[i].style.background = "#19202d";
  }
}
