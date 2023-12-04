const apiKey = "YOUR_API_KEY";

const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button"),
  amountInput = document.querySelector("form input"),
  exchangeRateTxt = document.querySelector("form .exchange-rate"),
  exchangeIcon = document.querySelector("form .icon");

function populateDropdowns() {
  for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_list) {
      let selected =
        i === 0
          ? currency_code === "INR"
            ? "selected"
            : ""
          : currency_code === "USD"
          ? "selected"
          : "";

      let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
      dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", (e) => {
      loadFlag(e.target);
    });
  }
}

function loadFlag(element) {
  for (let code in country_list) {
    if (code === element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/48x36/${country_list[
        code
      ].toLowerCase()}.png`;
    }
  }
}

function swapCurrencies() {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
}

function getExchangeRate() {
  let amountVal = amountInput.value;
  if (amountVal === "" || amountVal === "0") {
    amountInput.value = "1";
    amountVal = 1;
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";

  let baseCurrency = fromCurrency.value;
  let targetCurrency = toCurrency.value;
  let url = `https://open.er-api.com/v6/latest/${baseCurrency}?apikey=${apiKey}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      if (result.error) {
        throw new Error(result.error);
      }
      let exchangeRate = result.rates[targetCurrency];
      if (!exchangeRate) {
        throw new Error("Exchange rate not available for selected currencies");
      }
      let totalExRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${baseCurrency} = ${totalExRate} ${targetCurrency}`;
    })
    .catch((error) => {
      console.error("Error:", error);
      exchangeRateTxt.innerText = `Error fetching data: ${error.message}`;
    });
}

// Event listeners
window.addEventListener("load", () => {
  populateDropdowns();
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

exchangeIcon.addEventListener("click", () => {
  swapCurrencies();
});
