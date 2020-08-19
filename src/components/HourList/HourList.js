import $ from 'jquery';
import 'slick-carousel';

$(document).ready(function(){
  $('.hourList__slick').slick({
    infinite: true,
    slidesToShow: 8,
    slidesToScroll: 1,
    infinite: false,
    dots: false,
    prevArrow: false,
    nextArrow: false,
    responsive: [
    {
      breakpoint: 969,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      }
      },
      {
      breakpoint: 610,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
      }
  ]
});
});