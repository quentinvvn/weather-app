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
  document.getElementById("infoposition").innerHTML = info;
}

function chercher() {
  var ville = document.getElementById("ville").value;
  if (ville != "") {
    console.log(ville);
    $.ajax({
      url: "https://nominatim.openstreetmap.org/search",
      // URL de Nominatim
      type: "get",
      // Requête de type GET
      data:
        "q=" + ville + "&format=json&addressdetails=1&limit=1&polygon_svg=1",
      // Données envoyées (q -> adresse complète, format -> format attendu pour la réponse, limit -> nombre de réponses attendu, polygon_svg -> fournit les données de polygone de la réponse en svg)
    })
      .done(function (response) {
        if (response != "") {
          userlat = response[0]["lat"];
          userlon = response[0]["lon"];
          console.log(response);
          recupDonnees();
          return userlat, userlon;
        }
      })
      .fail(function (error) {
        alert(error);
      });
  }
}

function recupDonnees() {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather",
    type: "get",
    data:
      "lat=" +
      userlat +
      "&lon=" +
      userlon +
      "&appid=b59107cebd701651b8b2c44483acf61d",
  })
    .done(function (result) {
      if (result != "") {
        console.log(result);
        document.getElementById("temp").innerHTML =
          Math.trunc(
            ((((result["main"]["temp"] * 9) / 5 + 32) / 10 - 32) * 5) / 9
          ) + "°C";
        document.getElementById("feels-like").innerHTML =
          "Ressenti = " +
          Math.trunc(
            ((((result["main"]["feels_like"] * 9) / 5 + 32) / 10 - 32) * 5) / 9
          ) +
          "°C";
        document.getElementById("description").innerHTML =
          result["weather"][0]["description"];
        document.getElementById("city").innerHTML =
          result["name"] + ", " + result["sys"]["country"];
      }
    })
    .fail(function (error) {
      alert(error);
    });
}
