async function getCountriesInfo() {
    const url = "https://restcountries.eu/rest/v2/all";
    try {
        let response = await fetch(url);
        let countriesData = await response.json();
        CreateLayout(countriesData);

        console.log(countriesData);
    } catch (err) {
        console.error(err);
    }
}
getCountriesInfo();

async function getWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6a2dc5c88ac66187359b866cf4e1cea8`;
    try {
        const response = await fetch(url);
        let data = await response.json();
        // console.log(data);
        return data;
    } catch (err) {
        console.error(err);
    }
}
// getWeatherData(lat,lon);

async function displayWeatherData(lat, lon) {
    try {
        let data = await getWeatherData(lat, lon);
        console.log(data);
        createModal(data);
    } catch(error){
        console.error(error);
    }
}
// displayWeatherData(33,65);


function createCustomElement(elemName, elemClass = "", elemId = "") {
    var element = document.createElement(elemName);
    element.setAttribute("class", elemClass);
    element.setAttribute("id", elemId);
    return element;
}

function CreateLayout(data) {
    const divmodal = createCustomElement("div", "divModal");
    const total = createCustomElement("div", "container-fluid", "total");
    const row = createCustomElement("div", "row");
    const column = createCustomElement("div", "col-12 eachcol", "");
    row.append(column);
    total.append(row);
    document.body.append(divmodal, total);
    data.forEach(element => {
        const card = createCard(element);
        column.append(card);
    });
}

function createCard(country) {
    let card = createCustomElement("div", "card");
    let heading = createCustomElement("div", "card-header", "heading");
    let title = createCustomElement("h5", "card-title", "title");
    title.innerHTML = country.name;
    heading.append(title);

    let cardBody = createCustomElement("div", "card-body", "cardBody");

    let imageBlock = createCustomElement("div", "imageClass", "imageBlock");
    let image = createCustomElement("img", "card-img-top");
    image.setAttribute("src", country.flag);
    image.setAttribute("alt", country.name + " country flag");
    imageBlock.append(image);

    let cardContents = createCustomElement("div", "card-contents", "cardContents");
    cardBody.append(imageBlock, cardContents);

    let capital = createCustomElement("div", "capital content-line");
    let capitalKey = createCustomElement("span", "key");
    capitalKey.innerHTML = "Capital : ";
    let capitalvalue = createCustomElement("span", "value", "capitalvalue");
    let capitalVal = "NA"
    if (country.capital) {
        capitalVal = country.capital;
    }
    capitalvalue.innerHTML = capitalVal;
    capital.append(capitalKey, capitalvalue);

    let countryCode = createCustomElement("div", "countryCode content-line");
    let countryCodeKey = createCustomElement("span", "key");
    countryCodeKey.innerHTML = "Country Code : ";
    let countryCodevalue = createCustomElement("span", "value");
    countryCodevalue.innerHTML = `${country.alpha2Code}, ${country.alpha3Code}`;
    countryCode.append(countryCodeKey, countryCodevalue);

    let region = createCustomElement("div", "region content-line");
    let regionKey = createCustomElement("span", "key");
    regionKey.innerHTML = "Region : ";
    let regionvalue = createCustomElement("span", "value");
    regionvalue.innerHTML = country.region;
    region.append(regionKey, regionvalue);

    let latLong = createCustomElement("div", "latLong content-line");
    let latLongKey = createCustomElement("span", "key");
    latLongKey.innerHTML = "Lat,Long : ";
    let latLongvalue = createCustomElement("span", "value");
    latLongvalue.innerHTML = `${Math.round(country.latlng[0])} , ${Math.round(country.latlng[1])}`
    latLong.append(latLongKey, latLongvalue);

    let weatherBlock = createCustomElement("div", "weatherDiv", "weatherBlock");
    let weatherButton = createCustomElement("button", "btn btn-default weatherButton");
    weatherButton.setAttribute("data-toggle", "modal");
    weatherButton.setAttribute("data-target", "#weatherModal");
    weatherButton.innerHTML = "Click for Weather";
    weatherButton.onclick = function () { displayWeatherData(country.latlng[0], country.latlng[1]); }
    weatherBlock.append(weatherButton);

    cardContents.append(capital, countryCode, region, latLong, weatherBlock);
    card.append(heading, cardBody);
    return card;
}

function createModal(data) {
    let modalDiv = createCustomElement("div", "modal", "weatherModal");
    modalDiv.setAttribute("tabindex", "-1");
    modalDiv.setAttribute("role", "dialog");
    modalDiv.setAttribute("aria-labelledby", "modalLabel");
    modalDiv.setAttribute("aria-hidden", "true");
    document.body.append(modalDiv);

    let modalDialog = createCustomElement("div", "modal-dialog", "modalDialog");
    modalDialog.setAttribute("role", "document");
    modalDiv.append(modalDialog);

    let modalContent = createCustomElement("div", "modal-content", "modalContent");
    modalContent.style.backgroundColor="#dcedff";
    modalContent.style.fontWeight="bold";
    modalContent.style.paddingLeft="20px";

    modalDialog.append(modalContent);

    let modalHeader = createCustomElement("div", "modal-header", "modalHeader");

    let modalTitle = createCustomElement("h5", "modal-title", "modalLabel");
    modalTitle.innerHTML = "Weather Report : "
    let crossButton = createCustomElement("button", "close", "crossButton");
    crossButton.style.width="25px";
    crossButton.style.backgroundColor="gray";
    crossButton.style.color="white";
    crossButton.setAttribute("type", "button");
    crossButton.setAttribute("data-dismiss", "modal");
    crossButton.setAttribute("aria-label", "Close");
    let cross = createCustomElement("span", "cross");
    cross.setAttribute("aria-hidden", "true");
    cross.innerHTML = "&times;"
    crossButton.append(cross);
    modalHeader.append(modalTitle, crossButton);

    let modalBody = createCustomElement("div", "modal-body", "modalBody");
    let temperature =createCustomElement("div","temperature");
    temperature.innerHTML=`Temperature : ${data.main.temp}`
    let weatherDescription =createCustomElement("div","weatherDescription");
    weatherDescription.innerHTML=`Weather : ${data.weather[0].description}.`
    let humidity =createCustomElement("div","humidity");
    humidity.innerHTML=`Humidity : ${data.main.humidity}`
    let pressure =createCustomElement("div","pressure");
    pressure.innerHTML=`Pressure : ${data.main.pressure}`
    let windspeed =createCustomElement("div","windspeed");
    windspeed.innerHTML=`Wind Speed : ${data.wind.speed}`
    modalBody.append(temperature,weatherDescription,humidity,pressure,windspeed);

    let modalFooter = createCustomElement("div", "modal-footer", "modalFooter");
    let closeButton = createCustomElement("button", "btn btn-secondary", "closeButton")
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.innerHTML = "Close";
    modalFooter.append(closeButton);
    modalContent.append(modalHeader, modalBody, modalFooter);
}
