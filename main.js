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
  recupDonnees();
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
    console.log(ville);
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
          console.log(response);
          recupDonnees();
          return userlat, userlon;
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
}

function recupDonnees() {
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
    "&appid=b59107cebd701651b8b2c44483acf61d";
  fetch(url)
    .then(function (result) {
      return result.json();
    })
    .then((result) => {
      if (result != "") {
        var current_time =
          weekday[date.getDay()] + ", " + date.getHours() + ":" + timeMinutes;
        console.log(result);
        document.getElementById("weather-icon").src =
          "./weather_icons/" + result["weather"][0]["icon"] + ".png";
        document.getElementById("temp").innerHTML =
          Math.trunc(result["main"]["temp"] - 273, 15) + "<span>°C</span>";
        document.getElementById("feels-like").innerHTML =
          "Ressenti : " +
          Math.trunc(result["main"]["feels_like"] - 273, 15) +
          "°C";
        document.getElementById("description").innerHTML =
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
        document.getElementById("wind-icon").src =
          "./weather_icons/wind-day.png";
        document.getElementById("wind-value").innerHTML =
          "<h2>" + result["wind"]["speed"] + " m/s</h2>";
        document.getElementById("pressure").innerHTML = "Pression";
        document.getElementById("pressure-icon").src =
          "./weather_icons/pressure.png";
        document.getElementById("pressure-value").innerHTML =
          "<h2>" + result["main"]["pressure"] + " hPa</h2>";
        document.getElementById("cloud").innerHTML = "Cloud";
        document.getElementById("clouds-icon").src =
          "./weather_icons/clouds.png";
        // document.getElementById("cloud-value").innerHTML =
        //   result["coulds"]["all"];
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
      }
    })
    .catch((error) => {
      alert(error);
    });
}
