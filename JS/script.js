const form = document.querySelector('form');
const divWithInfoOnCity = document.querySelector('#container');
const errorMessageH1 = document.querySelector('#errorMessage');
const inputCity = document.querySelector('#city');
const inputHour = document.querySelector('#hour');
const weatherWithHoursDiv = document.querySelector('#weatherWithHours');
const firstIconToShowImg = document.querySelector('#firstIconToShow');

//These variables are outside of the functions because they get declared in more than one function.
let inputValueForCityName;
let inputValueOfHour;
let lat;
let lon;


form.addEventListener('submit', searchCity);


function searchCity(event) {
    event.preventDefault();

    errorMessageH1.innerText = '';
    divWithInfoOnCity.innerText = '';
    weatherWithHoursDiv.innerText = '';


    inputValueForCityName = inputCity.value;
    inputValueOfHour = inputHour.value;

    const infoOnCityWeatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${inputValueForCityName}&appid=6a438382df5439f99640edd7dc723eb6`;


    fetch(infoOnCityWeatherUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw "Something went wrong, please try again.";
            }
        })
        .then(displayWeatherInfoForCity)
        .catch(handleError);

}

function displayWeatherInfoForCity(whatCityWithLatAndLon) {


    if (whatCityWithLatAndLon.length === 0) {
        errorMessageH1.innerText = "This is not a city!"
        firstIconToShowImg.src = '';
    }
    else {
        lat = whatCityWithLatAndLon[0].lat;
        lon = whatCityWithLatAndLon[0].lon;

        const latAndLonUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6a438382df5439f99640edd7dc723eb6&units=metric`;


        fetch(latAndLonUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw "Something went wrong, please try again.";
                }
            })
            .then(displayWeatherInfo)
            .catch(handleError);



        const cityName = document.createElement('h2');
        const latAndLonPara = document.createElement('p');

        cityName.innerText = whatCityWithLatAndLon[0].name;
        latAndLonPara.innerText = `Lat: ${Math.round(whatCityWithLatAndLon[0].lat)} Lon: ${Math.round(whatCityWithLatAndLon[0].lon)}`;

        divWithInfoOnCity.append(cityName, latAndLonPara);
    }
}



function displayWeatherInfo(cityWeatherInfo) {
    const weatherInfo = document.createElement('p');
    const windInfo = document.createElement('p');
    const tempInfo = document.createElement('p');


    const weatherIcon = `https://openweathermap.org/img/wn/${cityWeatherInfo.weather[0].icon}@2x.png`;


    weatherInfo.innerText = cityWeatherInfo.weather[0].description;
    tempInfo.innerText = ` The degree is: ${Math.round(cityWeatherInfo.main.temp)}C`; // Kan jag avrunda talet, är detta ok??
    windInfo.innerText = `${cityWeatherInfo.wind.speed} m/s`; //KOLLA OM DETTA ÄR RÄTT!!
    firstIconToShowImg.src = weatherIcon;

    divWithInfoOnCity.append(weatherInfo, windInfo, tempInfo);

    //In this part we also vant to get "at what Hour" a function, so when we insert a number, we will se the output further down on the page.
    const chooseHourUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=6a438382df5439f99640edd7dc723eb6`;



    fetch(chooseHourUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw "Something went wrong, please try again.";
            }
        })
        .then((hoursAndIcons) => {


            for (let i = 0; i < inputValueOfHour; i++) {


                const hoursWeatherIcons = `https://openweathermap.org/img/wn/${hoursAndIcons.list[i].weather[0].icon}@2x.png`;

                const weatherFromHoursP = document.createElement('p');
                const weatherFromHoursIcon = document.createElement('img');


                weatherFromHoursP.innerText = `${hoursAndIcons.list[i].dt_txt} 
                ${Math.round(hoursAndIcons.list[i].main.temp)}C `;
                weatherFromHoursIcon.src = `${hoursWeatherIcons}`;


                weatherWithHoursDiv.append(weatherFromHoursP, weatherFromHoursIcon)

            }

        })
        .catch(handleError);

    form.reset();
}


function handleError(error) {

    errorMessageH1.innerText = "Something went wrong, please try again.", error;

    weatherWithHoursDiv.innerText = '';
    firstIconToShowImg.src = '';

}

