document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection = document.querySelector('.weather-info')
const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityTxt = document.querySelector('.humidity-value-txt')
const windTxt = document.querySelector('.wind-value-txt')
const weatherSummuryImg = document.querySelector('.weather-summury-img')
const currentDateTxt = document.querySelector('.current-date-txt')
const forecastItemContainer = document.querySelector('.forecast-item-container')




const apiKey = `ebaecede37ca746775e77351daf1b759`

searchBtn.addEventListener('click', ()=>{
    if(cityInput.value.trim() != '' ){
        

        updateWeatherInfo(cityInput.value)
        cityInput.value=''
    
    }
    else{
        alert("please enter city first")
        return
    }
})

cityInput.addEventListener('keydown',(event)=>{
    if(event.key == 'Enter' &&
        cityInput.value.trim() !=''
    ){
        updateWeatherInfo(cityInput.value)
         cityInput.value=''
    }

})

async function getFectchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    return response.json()

}   
function getWeatherIcon(id){
    if( id<= 232) return 'thunderstorm.svg'
    if( id<= 321) return 'drizzle.svg'
    if( id<= 531) return 'rain.svg'
    if( id<= 622) return 'snow.svg'
    if( id<= 781) return 'atmosphere.svg'
    if( id<= 800) return 'clear.svg'
    else return 'clouds.svg'

}
function getCurrentDate(){
    const currentDate = new Date()
    
    const options ={ 
        weekday: 'short',
        day:`2-digit`,
        month: 'short'

    }
    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city){
    const weatherData = await getFectchData('weather', city)
    if(weatherData.cod != 200){
        alert("city not found☹️ try again...😇")
        return;
    }

    const {
        name:country, 
        main: {temp, humidity},
        weather: [{id,main}],
        wind:{speed},


    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityTxt.textContent = humidity +'%'
    windTxt.textContent = speed + 'M/s'

    currentDateTxt.textContent = getCurrentDate()
    weatherSummuryImg.src = `assets/weather/${getWeatherIcon(id)}`

    await updateWeatherForecasteInfo(city)

    async function updateWeatherForecasteInfo(city) {
        const forecastsData = await getFectchData('forecast',city)
        const timeTaken =  '12:00:00'
        const todayDate = new Date().toDateString().split('T')[0]

        forecastItemContainer.innerHTML = ''
        forecastsData.list.forEach(forecasteWeather =>{
           if(forecasteWeather.dt_txt.includes(timeTaken)&& !forecasteWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forecasteWeather)
           }
        })
    }   

    function updateForecastItems(weatherData){
        const {
            dt_txt: date,
            weather: [{id}],
            main:{temp}

        }= weatherData
        
        const dateTaken = new Date(date)
        const dateOption = {
            day: '2-digit',
            month: 'short'
        }
        const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)

        const forecastItem = `
                <div class="forecast-item">
                    <h5 class="forecast-item-date regural-txt">${dateResult}</h5>
                    <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.round(temp)}</h5>
                </div>
        `
        forecastItemContainer.insertAdjacentHTML('beforeend',forecastItem)
    }


}
    
showDisplaysection(weatherInfoSection)
function showDisplaysection(section){
    section.style.display = 'block'
}

});


