// https://tech.yandex.ru/maps/jsbox/2.1/clusterer_icon_hover
//https://tech.yandex.ru/maps/doc/jsapi/2.0/dg/concepts/events-docpage/
//https://tech.yandex.ru/maps/jsbox/2.1/event_reverse_geocode
var Location = {
    "Moscow": {
        "id": "1", // City ID
        "name": "Москва",
        "center": {
            "lat": 55.755826, // latitude (широта)
            "lng": 37.6173,
        },
        "stores": [
            {
                "id": "1", // Store   
                "lat": 55.679603, // latitude (широта)
                "lng": 37.312771, // longitude (долгота)
                "address": "Москва, пр. Луначарского, д.15"
            },
            {
                "id": "2", // Store  
                "lat": 55.761849, // latitude (широта)
                "lng": 37.6365888, // longitude (долгота)
                "address": "Москва, Химический пер., 12"
            },
            {
                "id": "3", // Store
                "lat": 55.6800736, // latitude (широта)
                "lng": 37.732702, // longitude (долгота)
                "address": "Москва, Кузнечный тупик 19/21"
            }
        ]
    },
    "Spb": {
        "id": "2", // City ID
        "name": "Санкт-Петербург",
        "center": {
            "lat": 59.9342802, // latitude (широта)
            "lng": 30.3350986,
        },
        "stores": [
            {
                "id": "1", // Store      
                "lat": 59.836173, // latitude (широта)
                "lng": 30.3676546, // longitude (долгота)
                "address": "Санкт-Петербург, Звёздная улица, 22"
            },
            {
                "id": "2", // Store  
                "lat": 59.9860228, // latitude (широта)
                "lng": 30.3213429, // longitude (долгота)
                "address": "Санкт-Петербург, Beloostrovskaya ul., 8"
            }
        ]
    },
    "Novosibirsk": {
        "id": "3", // City ID
        "name": "Новосибирск",
        "center": {
            "lat": 55.0083526, // latitude (широта)
            "lng": 82.9357327,
        },
        "stores": [
            {
                "id": "1", // Store 
                "lat": 55.045832, // latitude (широта)
                "lng": 82.930247, // longitude (долгота)
                "address": "Новосибирск, ул. Некрасова, 54"
            },
            {
                "id": "2", // Store  
                "lat": 54.9494949, // latitude (широта)
                "lng": 82.8374367, // longitude (долгота)
                "address": "Новосибирск, ул. Тульская, 527"
            }
        ]
    },
    "Kazan": {
        "id": "4", // City ID
        "name": "Казань",
        "center": {
            "lat": 55.8304307, // latitude (широта)
            "lng": 49.0660806,
        },
        "stores": [
            {
                "id": "1", // Store  
                "lat": 55.8362801, // latitude (широта)
                "lng": 49.1121332, // longitude (долгота)
                "address": "Казань, ул. Маршала Чуйкова, 11А"
            },
            {
                "id": "2", // Store  
                "lat": 55.8435833, // latitude (широта)
                "lng": 49.094269, // longitude (долгота)
                "address": "Казань, ул. Воровского, 67"
            }
        ]
    },
    "Samara": {
        "id": "5", // City ID
        "name": "Самара",
        "center": {
            "lat": 53.2415041, // latitude (широта)
            "lng": 50.2212463,
        },
        "stores": [
            {
                "id": "1", // Store        
                "lat": 53.240493, // latitude (широта)
                "lng": 50.235174, // longitude (долгота)
                "address": "Самара, пр. Кирова, 180А"
            },
            {
                "id": "2", // Store    
                "lat": 53.2420649, // latitude (широта)
                "lng": 50.239387, // longitude (долгота)
                "address": "Самара, просп. Карла Маркса, 374"
            }
        ]
    }
}


ymaps.ready(init);
var map;
var markers = [];
var marker;



function init() {
    map = new ymaps.Map("GMap", {
        center: [55.76, 37.64],
        zoom: 10
    });
    


    markerInit(Location.Moscow);
}

function markerInit(locationOBJ) {
    clearMarkers();
    var city = locationOBJ
    var store = city.stores;
    map.setCenter([city.center.lat, city.center.lng], 10, {
        checkZoomRange: true
    });

    for (var i = 0; i < store.length; i++) {

        marker = new ymaps.Placemark([store[i].lat, store[i].lng], {
            hintContent: store[i].address
        });
        map.geoObjects.add(marker);
        marker.events.add('click', function (e) {
            //var object = e;
            console.log(e);
            console.log(e.get('coords'));
            
        });
        markers.push(marker);
        
    }
    
        
    
}



$(".location__tabs li a").on("click", function (event) {
    event.preventDefault();

    var $this = $($(this));
    var link = $this.attr("href");

    if ($this.closest("li").hasClass("active")) {
        return
    }
    console.log(markers);
    $(".location__tabs li").removeClass("active");
    $this.closest("li").addClass("active");
    $(".location__list").removeClass("active");
    $(link).addClass("active");

    link = link.substring(1);

    markerInit(Location[link]);

})


function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        map.geoObjects.remove(markers[i]);
    }
    markers.splice(0, markers.length);
}



// google maps api
//function initMap() {    
//    map = new google.maps.Map(document.getElementById('GMap'));    
//    codeAddress(Location.Moscow);
//}
//
//function codeAddress(query) {
//    clearMarkers()
//    var counter = query.stores;
//    
//    map.setZoom(10);
//    map.setCenter({
//        lat: query.center.lat,
//        lng: query.center.lng
//    })    
//    
//    for (var i = 0; i < counter.length; i++) {
//
//        var pos = {
//            lat: counter[i].lat,
//            lng: counter[i].lng
//        };
//        var marker = new google.maps.Marker({
//            position: pos,
//            map: map,
//            label: counter[i].id
//        });
//        markers.push(marker);
//    }
//}
//
//function setMapOnAll(map) {
//    for (var i = 0; i < markers.length; i++) {
//        markers[i].setMap(map);
//    }
//    markers
//    markers.splice(0, markers.length);
//}
//
//function clearMarkers() {
//    setMapOnAll(null);
//}
//







// Slider page product
$(document).ready(function () {
    var elemList = $(".colorTable__item");
    var slideContainer = $(".slider__wrap");
    var currentPosition = 0;
    var widthStep;
    var maxStep;

    function init() {

        for (var i = 0; i < elemList.length; i++) {
            var imgLink = $(elemList[i]).find("img").attr("src");
            var imgAlt = $(elemList[i]).find("span").text();
            var elem = '<li class="slider__item">' + '<a href=' + imgLink + ' class="slider__link">' + '<img src=' + imgLink + '  alt=' + imgAlt + '>' + '</a>' + '</li>';
            $(slideContainer).append(elem);
        }

        widthStep = $('.colorTable__gallery--slider').outerWidth() / 6;
        maxStep = (elemList.length * widthStep) - (widthStep * 6);

        $(".colorTable__gallery--title__name").text($(".product__title h1").text());
    }
    init();

    $(".left").on("click", function () {

        if (elemList.length <= 6) {
            return
        }

        if (currentPosition <= 0) {
            currentPosition = 0;
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });
            console.log(currentPosition);
            return;
        }

        currentPosition -= widthStep;
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });
    })
    $(".right").on("click", function () {
        if (elemList.length <= 6) {
            return
        }
        if (currentPosition == maxStep) {
            currentPosition = maxStep;
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });
            return;
        }
        currentPosition += widthStep;
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });
    })

    $(".slider__item").on("click", function (event) {
            event.preventDefault();


            $(".colorTable__gallery--img img").attr("src", $(this).find("img").attr("src"));
            $(".colorTable__gallery--title__model").text($(this).find("img").attr("alt"));

        })
        // open popup
    $(elemList).on("click", function (event) {
        var windowSize = window.innerWidth;
        if (windowSize >= 768) {
            $(".colorTable__gallery--img img").attr("src", $(this).find("img").attr("src"));
            $(".colorTable__gallery--title__model").text($(this).find("span").text());

            $(".colorTable__gallery--wrapper").show();

            $(".colorTable__gallery--popup").css({
                "top": $(".colorTable__wrapper").offset().top + "px"
            });
            $("body").css({
                "overflow": "hidden"
            });
            var scroll_el = $(".colorTable__wrapper");
            if ($(scroll_el).length != 0) {
                $('html, body').animate({
                    scrollTop: $(scroll_el).offset().top - 80
                }, 500);
            }
            return false;
            if ($(this).index() >= (elemList.length - 5)) {
                currentPosition = widthStep * ($(this).index() - 5);
            } else {
                currentPosition = widthStep * $(this).index();
            }
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });
        }
    })

    $(document).on("click", function (event) {
        if ($(event.target).closest(".js__closePopup").length == 1) {
            $(event.target).closest(".js__popup").hide();
            $("body").css({
                "overflow": "inherit"
            });
            return
        } else if ($(event.target).closest(".js__noPropagation").length == 1) {
            event.stopPropagation();
            return
        } else if ($(event.target).closest(".js__popup").length == 1) {
            event.stopPropagation();
            $(event.target).closest(".js__popup").hide();
            $("body").css({
                "overflow": "inherit"
            });
            $(".popUP__wrapper").detach();
            return
        }
    })

});

$(document).ready(function () {

    $(".product__sliderImg ul li a").on('click', function (event) {
        event.preventDefault();
        $(".product__stand img").attr("src", $(this).attr("href"));
    })

    $(window).resize(function () {
        var k = 500 / 304;
        var w = screen.width;

        if (w < 500) {
            $('.product__stand').height($('.product__stand').width() / k);
        }
    });


})

// VIDEO POPUP
$(document).ready(function () {

    $(".js__videoPopup").on("click", function (event) {
        event.preventDefault();
        var link = $(this).attr('href');
        var popUp_content = '<iframe width="100%" height="100%" src="' + link + '" frameborder="0" allowfullscreen></iframe>';
        var popUp = '<div class="popUP__wrapper js__popup active"><div class="popUP__video js__noPropagation"> <button class="close__popup js__closePopup">&#215;</button>' + popUp_content + '</div></div>';
        $("body").css({
            "overflow": "hidden"
        });
        $("body").append(popUp);
    })



    $(window).resize(function () {
        var k = 700 / 420;
        var w = screen.width;

        if (w < 700) {
            $('.popUP__video').height($('.popUP__video').width() / k);
        }
    });


})


// FLEXSLIDER PAGE INDEX
$(window).load(function () {
    $('.header__slider').flexslider({
        animation: "slide",
        slideshow: true,
        touch: true,
        directionNav: false,
        controlNav: true
    });
});


// Jquery UI range
$(document).ready(function () {
    jQuery("#input_range-1").slider({
        min: 0,
        max: 15,
        step: 1,
        value: '',
        range: true
    });

    jQuery("#input_range-2").slider({
        min: 0,
        max: 11,
        values: '',
        range: true
    });
    jQuery("#input_range-3").slider({
        min: 0,
        max: 61,
        values: "",
        range: true
    });
    addValue()

    function addValue() {
        var btn = $(".ui-slider-handle");
        for (var i = 0; i < btn.length; i++) {
            $(btn[i]).append("<span class='input_range-value'></span>")
        }
    }

    $('#input_range-1').bind('slide', function () {
        var rangList = $('#input_range-1 .input_range-value');
        $(rangList[0]).text($('#input_range-1').slider('values')[0] + " кг");
        $(rangList[1]).text($('#input_range-1').slider('values')[1] + " кг");
        console.log($('#input_range-1').slider('values'))
    });
    $('#input_range-2').bind('slide', function () {
        var rangList = $('#input_range-2 .input_range-value');
        $(rangList[0]).text($('#input_range-2').slider('values')[0] + " cм");
        $(rangList[1]).text($('#input_range-2').slider('values')[1] + " см");
    });
    $('#input_range-3').bind('slide', function () {
        var rangList = $('#input_range-3 .input_range-value');
        $(rangList[0]).text($('#input_range-3').slider('values')[0] + " метров");
        $(rangList[1]).text($('#input_range-3').slider('values')[1] + " метров");
    });

    $(".productList__filtrBlock--reset").on('click', function () {
        $('#input_range-3').slider('values', [0, 15])
        $('#input_range-1 .input_range-value').text($('#input_range-1').slider('values') + " кг");
        $('#input_range-2').slider('values', [0, 11]);
        $('#input_range-2 .input_range-value').text($('#input_range-2').slider('values') + " см");
        $('#input_range-1').slider('values', [0, 6])
        $('#input_range-3 .input_range-value').text($('#input_range-3').slider('values') + " метр");

    })

})







// close product filtr
$(".productList__filtrBlock--close").on("click", function (event) {
    event.preventDefault();
    var filtr = $(".productList__filtrBlock");
    filtr.slideToggle();
    $(".productList__filtrBlock--close").toggleClass("active");
})


// tabs in category header
$("#catalog__tabs").on("click", function (event) {
    event.stopPropagation();
})
$(document).ready(function () {
    $('.accordion-tabs').children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
    $('.accordion-tabs').on('click', 'li > a', function (event) {
        if (!$(this).hasClass('is-active')) {
            event.preventDefault();
            $('.accordion-tabs .is-open').removeClass('is-open').hide();
            $(this).next().toggleClass('is-open').toggle();
            $('.accordion-tabs').find('.is-active').removeClass('is-active');
            $(this).addClass('is-active');
        } else if ($(this).hasClass('is-active')) {
            event.preventDefault();
            $(this).removeClass('is-active');
            $(this).next().toggleClass('is-open').toggle();
        } else {
            event.preventDefault();
        }
    });
});

$(".headerNav__toggle").on("click", function () {
    $(this).toggleClass("active")
    if ($(this).hasClass("active")) {
        $(".header__top").addClass("nav__active");
        $("body").addClass("nav__active")
    } else {
        $(".header__top").removeClass("nav__active");
        $("body").removeClass("nav__active");
    }

})


$(".tab-head-cont section a").on("click", function (event) {
    event.stopPropagation();
})

// mobile search popup
$(".header__search--btn").on("click", function (event) {

    event.preventDefault();
    if (!$("body").hasClass("nav__active")) {
        $(".header__search--mobile").show();
    }

})

$(document).on("click", function (event) {
    if ($(event.target).closest(".form-group").length == 1) {
        event.stopPropagation();
        return
    } else if ($(event.target).closest(".header__search--mobile").length == 1) {
        $(".header__search--mobile").hide();
        return
    }
})




var hoverColor = "#eaeaea";

$(".location__item").on("click", function (event) {
    var itemList = $(".location__item");

    for (var i = 0; i < itemList.length; i++) {
        $(itemList[i]).removeClass("active");
    }
    if ($(this).hasClass("active")) {
        return
    }
    $(this).addClass("active");
})

$(".location__item").hover(
    function () {
        if ($(this).hasClass("active")) {
            return
        }
        $(".location__item.active").css({
            "background-color": "transparent"
        })
        $(this).css({
            "background-color": hoverColor
        })
    },
    function () {
        if ($(this).hasClass("active")) {
            return
        }
        $(".location__item.active").css({
            "background-color": hoverColor
        })
        $(this).css({
            "background-color": "transparent"
        })
    }
);


// JQUERY UI Autocomplete Widget
$(document).ready(function () {
    var flowers = ["Астра", "Нарцисс", "Роза", "Пион", "Примула", "Подснежник", "Мак", "Первоцвет", "Петуния", "Фиалка"];


    $('.js__search').autocomplete({
        source: flowers
    })
});


$(".product__zoom").on("click", function () {
    var link = $(this).closest(".product__stand").find("img").attr("src");

    $("body").css({
        "overflow": "hidden"
    })

    $(".popUP__productImg").css({
        "width": $(this).closest(".product__stand").find("img").width() + "px",
        "height": $(this).closest(".product__stand").find("img").height() + "px"
    })

    $(".popUP__productImg").find("img").attr("src", link);
    $(".popUP__productImg").closest(".popUP__wrapper").show();

})

//--------------------------------------------------------------
//--------------------------------------------------------------
/* 

код ниже нужен для горизонтального скрола на странице списка продуктов  для прокрутки вариация проддуктов

*/
//--------------------------------------------------------------
//--------------------------------------------------------------

$(document).ready(
    function () {
        $(".productVariation__wrap").niceScroll({
            touchbehavior: true,
            cursorcolor: "transparent",
            cursorborder: "0px solid transparent"
        });

        // проверяет есть ли у карточки с товаром ссылки на вариации
        // если есть добавит градиент если общая ширина ссылок больше ширины контейнера
        function addGradientBlock() {

            var blockList = $(".productVariation__wrap");


            for (var i = 0; i < blockList.length; i++) {
                var elements = $(blockList[i]).find("li");
                var itemWidth = $(elements[0]).width() * $(elements).length;

                if ($(elements).length != 0 && $(blockList[i]).width() < itemWidth) {
                    if ($(blockList[i]).find(".gradientBlock").length == 1) continue
                    $(blockList[i]).append("<div class='gradientBlock'></div>");

                } else {
                    $(blockList[i]).find(".gradientBlock").remove()
                }

            }
        };
        addGradientBlock();

        $(window).resize(function () {
            addGradientBlock()
        });

        $(".tile__wrapper--big").on("click", function (event) {
            event.preventDefault();
            var href = $(this).attr('href');
            var video_content = '<iframe width="100%" height="100%" src="' + href + '" frameborder="0" allowfullscreen></iframe>';
            $(this).empty()
            $(this).append(video_content);


        })

    }


);


//
//VK.init({
//    apiId: 5978511, // ID получить тут https://vk.com/dev/Like
//    onlyWidgets: true
//});
//VK.Widgets.Like("vk_like", {
//    type: "mini" // формат кнопки
//});
