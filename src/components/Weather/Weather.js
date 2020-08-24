import $ from 'jquery';
import moment from 'moment';

const WeatherApp = {
  state: {
    city: "Olsztyn",
    currentTemperature: 0,
    humidity: "",
    minTemperature: 0,
    maxTemperature: 0,
    lat: 0,
    lon: 0,
    pressure: "",
    sunRise: "",
    sunSet: "",
    weatherType: "",
    weatherEmoji: "",
  
  },
  init() {
    this.catchDOM();
    this.requestWeatherAPIData(53.77995 , 20.49416);
    this.bindEvents();
  },
  catchDOM() {
    this.$app = $('.weather');
    this.$loader = $('.weather__loading');
    this.hourTemperatureList = [];
    this.hourEmojiList = [];
    this.hourItemTime = moment().format('HH');
  },
  removeLoader() {
    this.$loader.addClass('-loaded');
  },
  addLoader() {
    this.$loader.removeClass('-loaded');
    
  },
  bindEvents() {
    this.$app.find('.search__icon').on("click", this.handleClickSearchButton.bind(this));
  },
  handleClickSearchButton() {
    this.addLoader();
    this.$searchInput = this.$app.find('.search__input');
    const city = this.$searchInput[0].value;
    this.setCurrentCity(city);
    this.requestCityPosition(this.state.city, 'Poland');
    
  },
  getApp() {
    return this.$app;
  },
  clearStates() {
    this.state = {};
  },
  getStates() {
    return this.state;
  },
  setState(name, value) {
    this.state[name] = value;
  },
  getState(name) {
    return this.state[name];
  },
  setWeatherTemperature(currentTemperature, minTemperature, maxTemperature) {
    this.setState('currentTemperature', currentTemperature);
    this.setState('minTemperature', minTemperature);
    this.setState('maxTemperature', maxTemperature);
    this.renderWeatherTemperature();
  },
  renderWeatherTemperature() {
    this.$temperature = this.$app.find('.temperature__number');
    this.$minTemperature = this.$app.find('.temperature__min');
    this.$maxTemperature = this.$app.find('.temperature__max');
    this.$number = this.getState('currentTemperature');
    this.$minTemp = this.getState('minTemperature');
    this.$maxTemp = this.getState('maxTemperature');
    this.$temperature.text(this.$number);
    this.$minTemperature.text(this.$minTemp + "ºC ");
    this.$maxTemperature.text(this.$maxTemp  + "ºC ");
  },
  setWeatherType(cityWeatherEmoji) {
    this.setState('weatherType', cityWeatherEmoji);
    this.renderWeatherType();
},
  renderWeatherType() {
    if (this.state.weatherType === "Snow") {
      this.setState('weatherEmoji', "❄️");
    }
    else {
      if (this.state.weatherType === "Rain") {
        this.setState('weatherEmoji', "☔️");
    }
    else {
      if (this.state.weatherType === "Clear") {
        this.setState('weatherEmoji', "☀️");
    }
    else {
      if (this.state.weatherType === "Storm") {
        this.setState('weatherEmoji', "⚡️");
    }
    else {
      this.setState('weatherEmoji', "☁️");
    }}}}
      this.$emojiDiv = this.$app.find('.emoji__item');
      const emoji = this.getState('weatherEmoji');
      this.$emojiDiv.text(emoji);
  },
  updateWeatherBackground() {
    this.$emojiBackground = this.$app.find('.emoji');
    this.$ringColor = this.$app.find('.ring');
    if (this.$number < 15) {
      this.$emojiBackground.css('background-color', '#00aced' );
      this.$ringColor.css('border-bottom', '1px solid #00aced' );
      this.$ringColor.css('border-left', '1px solid #00aced' );
      this.$ringColor.css('border-right', '1px solid #00aced' );
    }
    else {
      if (this.$number > 25) {
        this.$emojiBackground.css('background-color', '#ffa600' );
        this.$ringColor.css('border-bottom', '1px solid #ffa600' );
        this.$ringColor.css('border-left', '1px solid #ffa600' );
        this.$ringColor.css('border-right', '1px solid #ffa600' );
    }
    else {
      this.$emojiBackground.css('background-color', '#009500' );
      this.$ringColor.css('border-bottom', '1px solid #009500' );
      this.$ringColor.css('border-left', '1px solid #009500' );
      this.$ringColor.css('border-right', '1px solid #009500' );
    }
  }

  },
  setWeatherBasicInfo(humidity, pressure, sunRise, sunSet) {
    this.setState('humidity', humidity);
    this.setState('pressure', pressure);
    this.setState('sunRise', sunRise);
    this.setState('sunSet', sunSet);
    this.renderWeatherBasicInfo()
  },
  renderWeatherBasicInfo() {
    this.$weatherInfoHumidity = this.$app.find('.infoItem__title').first();
    this.$weatherInfoHumidityEmoji = this.$app.find('.infoItem__icon').first();
    this.$weatherInfoPressure = this.$app.find('.infoItem__title').eq(1);
    this.$weatherInfoPressureEmoji = this.$app.find('.infoItem__icon').eq(1);
    this.$weatherInfoSunRise = this.$app.find('.infoItem__title').eq(2);
    this.$weatherInfoSunRiseEmoji = this.$app.find('.infoItem__icon').eq(2);
    this.$weatherInfoSunSet = this.$app.find('.infoItem__title').eq(3);
    this.$weatherInfoSunSetEmoji = this.$app.find('.infoItem__icon').eq(3);
    const humidity = this.getState('humidity');
    const pressure = this.getState('pressure');
    const sunRise = this.getState('sunRise');
    const sunSet = this.getState('sunSet');
    this.$weatherInfoHumidityEmoji.text('💦');
    this.$weatherInfoHumidity.text('Humidity is ' + humidity + '%');
    this.$weatherInfoPressureEmoji.text('⏲');
    this.$weatherInfoPressure.text('Pressure is ' + pressure + 'hPa');
    this.$weatherInfoSunRiseEmoji.text('🌞');
    this.$weatherInfoSunRise.text('Sunrise at ' + sunRise);
    this.$weatherInfoSunSetEmoji.text('🌚');
    this.$weatherInfoSunSet.text('Sunset at ' + sunSet);
  },
  setCurrentCity(city) {
    this.setState('city', city);
    this.renderCurrentCity();
  },
  renderCurrentCity() {
    this.$city = this.$app.find('.title__cityname');
    const cityName = this.getState('city');
    this.$city.text(cityName);
  },
  setCityPosition(lat, lon) {
    this.setState('lat', lat);
    this.setState('lon', lon);
    
  },
  requestCityPosition(cityName, country) {
    $.ajax({
      url: `https://api.opencagedata.com/geocode/v1/json?q=${cityName}%2C%20${country}&limit=1&key=d51e5514406c464a8780be5469962932&pretty=1`, 
      method: "GET",
      success: (cityData) => {
        let cityLat = cityData.results[0].geometry.lat;
        let cityLon = cityData.results[0].geometry.lng;
        this.setCityPosition(cityLat, cityLon);
        this.requestWeatherAPIData(this.state.lat , this.state.lon);
      }
    })
  },
  renderHourList() {
    for( let i = 0 ; i < 48; i++) {
      this.$hourItemHour = this.$app.find('.hourItem__hour').eq(i);
      this.$hourItemTemp = this.$app.find('.hourItem__temp').eq(i);
      this.$hourItemHour.text(this.hourItemTime);
      this.hourItemTime++;
      console.log(this.hourEmojiList[i])
      if (this.hourItemTime > 24) {
        this.hourItemTime -= 24;
      }
      this.$hourItemTemp.text(this.hourTemperatureList[i] + "ºC");
      let hourIcon;
      if (this.hourEmojiList[i] === "Snow") {
        hourIcon = "🌨";
      }
      else {
        if (this.hourEmojiList[i] === "Rain") {
          hourIcon = "🌧";
      }
      else {
        if (this.hourEmojiList[i] === "Clear") {
          hourIcon = "☀️";
      }
      else {
        if (this.hourEmojiList[i] === "Storm") {
          hourIcon = "🌩";
      }
      else {
        hourIcon = "☁️";
      }}}}
        this.$hourEmojiDiv = this.$app.find('.hourItem__icon').eq(i);
        this.$hourEmojiDiv.text(hourIcon);
    }

  },
  requestWeatherAPIData(lat, lon) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=bcbc67cd866137b29869139239475e8e`, 
        method: "GET",
        success: (weatherData) => {
          console.log(weatherData)
          let cityTemperature = weatherData.current.temp;
          cityTemperature = cityTemperature-273.15;
          cityTemperature = Math.round(cityTemperature);
          let cityTemperatureMin = weatherData.daily[0].temp.min;
          cityTemperatureMin = cityTemperatureMin-273.15;
          cityTemperatureMin = Math.round(cityTemperatureMin);
          let cityTemperatureMax = weatherData.daily[0].temp.max;
          cityTemperatureMax = cityTemperatureMax-273.15;
          cityTemperatureMax = Math.round(cityTemperatureMax);
          this.setWeatherTemperature(cityTemperature, cityTemperatureMin, cityTemperatureMax)
          let cityWeatherEmoji = weatherData.current.weather[0].main;
          this.setWeatherType(cityWeatherEmoji);
          let sunRise = weatherData.current.sunrise;
          let sunSet = weatherData.current.sunset;
          let sunRiseTime = moment.unix(sunRise).format('hh:mm')
          let sunSetTime = moment.unix(sunSet).format('HH:mm')
          let pressure = weatherData.current.pressure;
          let humidity = weatherData.current.humidity;
          this.setWeatherBasicInfo(humidity, pressure, sunRiseTime, sunSetTime);
          this.updateWeatherBackground();
          for (let i = 0; i < 48; i++) {
            let hourTemperature = weatherData.hourly[i].temp;
            hourTemperature = hourTemperature-273.15;
            hourTemperature = Math.round(hourTemperature);
            this.hourTemperatureList[i] = hourTemperature;
            let hourEmoji = weatherData.hourly[i].weather[0].main;
            this.hourEmojiList[i] = hourEmoji;
          }
          this.renderHourList();
          this.removeLoader();
        }
      
    })
  }

};
window.app = WeatherApp;

export default WeatherApp;