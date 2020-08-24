import 'babel-polyfill';
import $ from 'jquery';
import HourList from './components/HourList/HourList'
import Weather from './components/Weather/Weather'
$(document).ready(() => {
  // PUT LOADERS HERE
  Weather.init()
});
