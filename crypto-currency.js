function recupCrypto() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true";
  fetch(url)
    .then(function (result) {
      return result.json();
    })
    .then((result) => {
      console.log(result);
      let selection = document.getElementById("test");
      for (let n = 0; n < 100; n++) {
        var newTrCoin = document.createElement("tr");
        selection.append(newTrCoin);
        let number = document.createElement("td");
        let numberName = document.createTextNode(result[n]["market_cap_rank"]);
        newTrCoin.append(number);
        number.append(numberName);

        let coin = document.createElement("td");
        let coinImg = document.createElement("img");
        coinImg.src = result[n]["image"];
        let coinName = document.createTextNode(result[n]["name"]);
        newTrCoin.append(coin);
        coin.append(coinImg);
        coin.append(coinName);

        let symbol = document.createElement("td");
        let symbolName = document.createTextNode(
          result[n]["symbol"].toUpperCase()
        );
        newTrCoin.append(symbol);
        symbol.append(symbolName);

        let price = document.createElement("td");
        price.dataset.label = "Price";
        let priceName = document.createTextNode(
          result[n]["current_price"] + "€"
        );
        newTrCoin.append(price);
        price.append(priceName);

        let OneHoursPrice = document.createElement("td");
        OneHoursPrice.dataset.label = "1h";
        let OneHoursPriceValue =
          (result[n]["current_price"] /
            result[n]["sparkline_in_7d"]["price"]["167"]) *
            100 -
          100;
        OneHoursPriceValue = OneHoursPriceValue.toFixed(4);
        let OneHoursPriceName = document.createTextNode(
          OneHoursPriceValue + "%"
        );
        if (OneHoursPriceValue > 0) {
          OneHoursPrice.classList.add("green");
        } else {
          OneHoursPrice.classList.add("red");
        }
        newTrCoin.append(OneHoursPrice);
        OneHoursPrice.append(OneHoursPriceName);

        let VingtQuatreHoursPrice = document.createElement("td");
        VingtQuatreHoursPrice.dataset.label = "24h";
        let VingtQuatreHoursPriceValue =
          result[n]["price_change_percentage_24h"];
        VingtQuatreHoursPriceValue = VingtQuatreHoursPriceValue.toFixed(4);
        let VingtQuatreHoursPriceName = document.createTextNode(
          VingtQuatreHoursPriceValue + "%"
        );
        if (VingtQuatreHoursPriceValue > 0) {
          VingtQuatreHoursPrice.classList.add("green");
        } else {
          VingtQuatreHoursPrice.classList.add("red");
        }
        newTrCoin.append(VingtQuatreHoursPrice);
        VingtQuatreHoursPrice.append(VingtQuatreHoursPriceName);

        let SevenDaysPrice = document.createElement("td");
        SevenDaysPrice.dataset.label = "7d";
        let SevenDaysPriceValue =
          (result[n]["current_price"] /
            result[n]["sparkline_in_7d"]["price"]["0"]) *
            100 -
          100;
        SevenDaysPriceValue = SevenDaysPriceValue.toFixed(4);
        let SevenDaysName = document.createTextNode(SevenDaysPriceValue + "%");
        if (SevenDaysPriceValue > 0) {
          SevenDaysPrice.classList.add("green");
        } else {
          SevenDaysPrice.classList.add("red");
        }
        newTrCoin.append(SevenDaysPrice);
        SevenDaysPrice.append(SevenDaysName);

        let mktCap = document.createElement("td");
        mktCap.dataset.label = "Mkt Cap";
        let mktCapName = document.createTextNode(result[n]["market_cap"]);
        newTrCoin.append(mktCap);
        mktCap.append(mktCapName);

        var xmlns = "http://www.w3.org/2000/svg";
        let svgTd = document.createElement("td");
        let svg = document.createElementNS(xmlns, "svg");
        let g = document.createElementNS(xmlns, "g");
        svg.setAttribute("width", "90%");
        g.setAttribute("class", "g");

        newTrCoin.append(svgTd);
        svgTd.append(svg);
        svg.append(g);

        for (let i = 167; i > 0; i--) {
          let x,
            y,
            minY = 0,
            maxY = 0,
            hauteur;

          let str = result[n]["current_price"];

          x = (result[n]["sparkline_in_7d"]["price"][i] / str) * 500;
          y = (result[n]["sparkline_in_7d"]["price"][i - 1] / str) * 500;

          if (minY > y) {
            minY = y;
            console.log("min: " + minY);
          }

          if (maxY < y) {
            maxY = y;
            console.log(maxY);
          }

          hauteur = maxY - minY;

          const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          line.setAttribute(
            "style",
            "fill:none; stroke:red; stroke-width:2; stroke-miterlimit:10; stroke-linecap:round;"
          );
          line.setAttribute("x1", i);
          line.setAttribute("x2", i - 1);
          line.setAttribute("y1", x);
          line.setAttribute("y2", y);
          document.getElementsByClassName("g")[n].appendChild(line);
          svg.setAttribute(
            "viewBox",
            "-1 " + (minY + hauteur / 1.2) + " 164 " + hauteur / 3
          );
        }
      }
    });
}
