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
      breakpoint: 1340,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      }
      },
      {
        breakpoint: 611,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
        }
        },
        {
          breakpoint: 520,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          }
          },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
        }
  ]
});
});