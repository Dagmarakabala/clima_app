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
    const $searchInput = this.$app.find('.search__input');
    const city = $searchInput[0].value;
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
    const $temperature = this.$app.find('.temperature__number');
    const $minTemperature = this.$app.find('.temperature__min');
    const $maxTemperature = this.$app.find('.temperature__max');
    this.number = this.getState('currentTemperature');
    const minTemp = this.getState('minTemperature');
    const maxTemp = this.getState('maxTemperature');
    $temperature.text(this.number);
    $minTemperature.text(minTemp + "ºC ");
    $maxTemperature.text(maxTemp  + "ºC ");
  },
  setWeatherType(cityWeatherEmoji) {
    this.setState('weatherType', cityWeatherEmoji);
    this.renderWeatherType();
},
  renderWeatherType() {
    switch(this.state.weatherType) {
      case 'Snow': {
        this.setState('weatherEmoji', "❄️");
        break;
      }
      case 'Rain': {
        this.setState('weatherEmoji', "☔️");
        break;
      }
      case 'Clear': {
        this.setState('weatherEmoji', "☀️");
        break;
      }
      case 'Thunderstorm': {
        this.setState('weatherEmoji', "⚡️");
        break;
      }
      case 'Drizzle': {
        this.setState('weatherEmoji', "🌦");
        break;
      }
      default : {
        this.setState('weatherEmoji', "☁️");
      }
    }

    const $emojiDiv = this.$app.find('.emoji__item');
    const emoji = this.getState('weatherEmoji');
    $emojiDiv.text(emoji);
  },
  updateWeatherBackground() {
    const $emojiBackground = this.$app.find('.emoji');
    const $ringColor = this.$app.find('.ring');
    const numberColor = this.number > 25 ? '#ffa600' : 
                        this.number > 15 ? '#009500' : 
                                            '#00aced';

    $emojiBackground.css('background-color', numberColor ); 
    $ringColor.css({ 
      'border-bottom':`1px solid ${numberColor}`,
      'border-left':`1px solid ${numberColor}`, 
      'border-right':`1px solid ${numberColor}`} );
  },
  setWeatherBasicInfo(humidity, pressure, sunRise, sunSet) {
    this.setState('humidity', humidity);
    this.setState('pressure', pressure);
    this.setState('sunRise', sunRise);
    this.setState('sunSet', sunSet);
    this.renderWeatherBasicInfo()
  },
  renderWeatherBasicInfo() {
    const $weatherInfoHumidity = this.$app.find('.infoItem__title').first();
    const $weatherInfoHumidityEmoji = this.$app.find('.infoItem__icon').first();
    const $weatherInfoPressure = this.$app.find('.infoItem__title').eq(1);
    const $weatherInfoPressureEmoji = this.$app.find('.infoItem__icon').eq(1);
    const $weatherInfoSunRise = this.$app.find('.infoItem__title').eq(2);
    const $weatherInfoSunRiseEmoji = this.$app.find('.infoItem__icon').eq(2);
    const $weatherInfoSunSet = this.$app.find('.infoItem__title').eq(3);
    const $weatherInfoSunSetEmoji = this.$app.find('.infoItem__icon').eq(3);
    $weatherInfoHumidityEmoji.text('💦');
    $weatherInfoHumidity.text(`Humidity is ${this.state.humidity}%`);
    $weatherInfoPressureEmoji.text('⏲');
    $weatherInfoPressure.text(`Pressure is ${this.state.pressure}hPa`);
    $weatherInfoSunRiseEmoji.text('🌞');
    $weatherInfoSunRise.text(`Sunrise at ${this.state.sunRise}`);
    $weatherInfoSunSetEmoji.text('🌚');
    $weatherInfoSunSet.text(`Sunset at ${this.state.sunSet}`);
  },
  setCurrentCity(city) {
    this.setState('city', city);
    this.renderCurrentCity();
  },
  renderCurrentCity() {
    const $city = this.$app.find('.title__cityname');
    const cityName = this.getState('city');
    $city.text(cityName);
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
        this.setCityPosition(cityData.results[0].geometry.lat, cityData.results[0].geometry.lng);
        this.requestWeatherAPIData(this.state.lat, this.state.lon);
      }
    })
  },
  renderHourList() {
    let hourItemTime = this.hourItemTime;
    for( let i = 0 ; i < 48; i++) {
      const $hourItemHour = this.$app.find('.hourItem__hour').eq(i);
      const $hourEmojiDiv = this.$app.find('.hourItem__icon').eq(i);
      const $hourItemTemp = this.$app.find('.hourItem__temp').eq(i);
      hourItemTime = hourItemTime.toString()
      if (hourItemTime.length == 1) {
        $hourItemHour.text("0" + hourItemTime);
      }
      else {
        $hourItemHour.text(hourItemTime);
      }
      hourItemTime++;
      if (hourItemTime > 24) {
        hourItemTime -= 24;
      }
      $hourItemTemp.text(this.hourTemperatureList[i] + "ºC");
      let hourIcon;
      switch(this.hourEmojiList[i]) {
        case "Snow": {
          hourIcon = "🌨";
          break;
        }
        case "Rain": {
          hourIcon = "🌧";
          break;
        }
        case "Clear": {
          if(hourItemTime <= parseInt(this.state.sunRise) || hourItemTime > parseInt(this.state.sunSet)){
            hourIcon = "🌙";
          }
          else {
            hourIcon = "☀️";
          }
          break;
        }
        case "Thunderstorm": {
          hourIcon = "🌨";
          break;
        }
        case "Drizzle": {
          hourIcon = "🌦";
          break;
        }
        default : {
          hourIcon = "☁️";
        }
      }
    $hourEmojiDiv.text(hourIcon);
    }

  },
  addIdea() {
    let goodWeather = [
      'Rozmowy o pogodzie są okrasą naszej codzienności.', 
      'Czy może być źle, kiedy słońce świeci?',
      'Życiem - tak jak pogodą - rządzą nieustanne zmiany.',
      'Nie ma lepszej pogody niż pogoda ducha.',
      'Kto ma słońce w sercu, temu pogoda za oknem nie jest do niczego potrzebna.',
      'Chociaż Bóg jest wszechmogący, nie może zesłać deszczu, gdy niebo jest błękitne.',
      'Wszystko, co możesz sobie wyobrazić, natura już to stworzyła.',
      'Na każdym spacerze w naturze człowiek otrzymuje znacznie więcej niż szuka.',
      'W naturze światło tworzy kolor. W malarstwie kolor tworzy światło.',
      'Miłość jest jedynym kwiatem, który może kwitnąć bez pomocy pór roku.',
      'Kwiaty wiosny to marzenia o zimie opowiadane rano przy stole aniołów.',
      'Lato to czas, kiedy jest zbyt gorąco, aby robić rzeczy, dla których było zbyt zimno w zimie.',
      'Zimą nie możesz się doczekać lata. Latem boisz się, że zima powróci. Właśnie dlatego nigdy nie męczysz się w pogoni za miejscem, w którym nie jesteś: gdzie zawsze jest lato. ',
    ];
    let ordinaryWeather = [
      'Rozmowy o pogodzie są okrasą naszej codzienności.', 
      'Kiedy tylko zaistnieje niebezpieczeństwo że pogoda się zepsuje Anglicy porzucają domowe zacisze i wyruszają na pieszą wycieczkę.',
      'Życiem - tak jak pogodą - rządzą nieustanne zmiany.',
      'Pogoda ducha najbardziej przydaje się w beznadziejnych sytuacjach.',
      'Nie ma lepszej pogody niż pogoda ducha.',
      'Kto ma słońce w sercu, temu pogoda za oknem nie jest do niczego potrzebna.',
      'Ci, którzy mówią, że słońce przynosi szczęście, nigdy nie tańczyli w deszczu.',
      'Wiatr jest przyjacielem plotek, deszcz przyjacielem uczuć, mgła przyjacielem fabuł.',
      'Chociaż Bóg jest wszechmogący, nie może zesłać deszczu, gdy niebo jest błękitne.',
      'Zima jest martwa, wiosna jest szalona, lato jest szczęśliwe, a jesień mądra! ',
      'Wiosenne kwiaty to bajki, a jesienne liście to tragiczne dramaty.',
      'Życie bez miłości jest jak rok bez lata.',
      'Staraj się zawsze trzymać trochę nieba nad swoim życiem.',
      'Wszyscy żyjemy pod tym samym niebem, ale nie wszyscy mamy ten sam horyzont.',
      'Niebo może być dotknięte tylko sercem. ',
      'Nie w gwiazdach leży nasze przeznaczenie, ale w nas samych.',
      'Kocham gwiazdy. Ponieważ nic nie mogą powiedzieć. Kocham gwiazdy. Ponieważ nikogo nie oceniają.',
      'Popatrz na gwiazdy. Zobacz ich piękno. I w tym pięknie zobacz siebie.',
      'Nie byłoby nieba pełnego gwiazd, gdybyśmy wszyscy marzyli o tym samym.',
      'Tylko w ciemnościach widać gwiazdy.',
      'A może po prostu jak zegary słoneczne "działajmy" tylko w słoneczne dni...',
    ];
    let badWeather = [
      '... nie ma złej pogody. Można się tylko nieodpowiednio ubrać.', 
      'Rozmowy o pogodzie są okrasą naszej codzienności.',
      'Życiem - tak jak pogodą - rządzą nieustanne zmiany.',
      'W taką pogodę dobrze jest się powiesić.',
      'Nie ma lepszej pogody niż pogoda ducha.',
      'Kto ma słońce w sercu, temu pogoda za oknem nie jest do niczego potrzebna.',
      'Ci, którzy mówią, że słońce przynosi szczęście, nigdy nie tańczyli w deszczu.',
      'W długie deszczowe dni nawet chwile wydają się zmęczone, płyną powoli, jakby szeptały światu swój smutek.',
      'Słońce po deszczu jest o wiele piękniejsze niż słońce przed deszczem!',
      'Nie może padać wiecznie!',
      'Wiatr jest przyjacielem plotek, deszcz przyjacielem uczuć, mgła przyjacielem fabuł.',
      'Chociaż Bóg jest wszechmogący, nie może zesłać deszczu, gdy niebo jest błękitne.',
    ];
    let actualWeather;
    let img;
    if (this.hourEmojiList[0] === "Snow" || this.hourEmojiList[0] === "Rain" || this.hourEmojiList[0] === "Thunderstorm") {
      actualWeather = badWeather;
      img = './assets/images/Idea/img1.png';
    }
    else if (this.hourEmojiList[0] === "Clear") {
      actualWeather = goodWeather;
      img = './assets/images/Idea/img2.png';
      }
    else {
      actualWeather = ordinaryWeather;
      img = './assets/images/Idea/img3.png';
      }
    let number = Math.floor((Math.random() * actualWeather.length ));
    const $ideaText = this.$app.find('.idea__text');
    $ideaText.text(actualWeather[number]);
    const $ideaImg = this.$app.find('.idea__img');
    $ideaImg[0].src = img;
  },
  requestWeatherAPIData(lat, lon) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=bcbc67cd866137b29869139239475e8e`, 
        method: "GET",
        success: (weatherData) => {
          this.hourTemperatureList = [];
          this.hourEmojiList = [];
          this.hourItemTime = moment.unix(weatherData.hourly[0].dt).format('HH');
          this.setWeatherTemperature(Math.round(weatherData.current.temp - 273.15), Math.round(weatherData.daily[0].temp.min - 273.15), Math.round(weatherData.daily[0].temp.max - 273.15))
          this.setWeatherType(weatherData.current.weather[0].main);
          this.setWeatherBasicInfo(weatherData.current.humidity, weatherData.current.pressure, moment.unix(weatherData.current.sunrise).format('HH:mm'), moment.unix(weatherData.current.sunset).format('HH:mm'));
          this.updateWeatherBackground();
          for (let i = 0; i < 48; i++) {
            this.hourTemperatureList[i] = Math.round(weatherData.hourly[i].temp - 273.15);
            this.hourEmojiList[i] = weatherData.hourly[i].weather[0].main;
          }
          this.renderHourList();
          this.addIdea();
          this.removeLoader();
        }
    })
  }
};
window.app = WeatherApp;

export default WeatherApp;