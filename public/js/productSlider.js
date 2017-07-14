$(document).ready(function () {
    var elemList = $(".colorTable__item img");
    var slideContainer = $(".slider__wrap");
    var currentPosition = 0;
    var widthStep;
    var maxStep;

    function init() {
        var slider__item_array = [];
        $(slideContainer).empty();
        for (var i = 0; i < elemList.length; i++) {
            var dataImg = JSON.parse($(elemList[i]).attr("data-data-img"));

            var li = $('<li class="slider__item"></li>'),
                link = $('<a href="" class="slider__link" data-data-img=""></a>'),
                img = $('<img src="">');

            $(img).attr('src', dataImg["0"].smallIMG);
            $(img).attr('data-data-img', JSON.stringify(dataImg));
            $(link).append(img);
            $(li).append(link);
            slider__item_array.push(li);
        }
        $(slideContainer).append(slider__item_array);
        console.log(slider__item_array);

        widthStep = $('.colorTable__gallery--slider').outerWidth() / 6;
        maxStep = (elemList.length * widthStep) - (widthStep * 6);

        $(".colorTable__gallery--title__name").text($(".product__title h1").text());

        $(".slider__link img").on("click", function (event) {
            event.preventDefault();
            initVariation(this);
        });

        var $panzoom = $('.colorTable__gallery--img img').panzoom();
        $panzoom.parent().on('mousewheel.focal', function (e) {
            e.preventDefault();
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            $panzoom.panzoom('zoom', zoomOut, {
                increment: 0.1,
                animate: false,
                focal: e
            });
        });
    }

    $(".left").on("click", function () {

        if (elemList.length <= 6) {
            return
        }

        if (currentPosition <= 0) {
            currentPosition = 0;
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });

            return;
        }

        currentPosition -= widthStep;
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });
    });

    $(".right").on("click", function () {
        console.log();
        if (elemList.length <= 6) {
            return
        }
        if (Math.round(currentPosition) == maxStep) {
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
    });


    function initVariation(elem) {
        var imgData = jQuery.parseJSON($(elem).attr("data-data-img"));
        console.log(imgData);
        var wrapperVariation = $('.colorTable__gallery--variation');
        var containerVariation = $('ul.variation__list');
        var liArray = [];
        $(containerVariation).empty();
        if (imgData.length > 1) {
            for (var i = 0; i < imgData.length; i++) {
                var li = $('<li class="variation__item"></li>');
                var img = $('<img src="">');
                $(img).attr('src', imgData[i].smallIMG);
                $(img).attr('data-data-img', JSON.stringify(imgData[i]));
                $(li).append(img);
                liArray.push(li);
            }
            $(containerVariation).append(liArray);
            $(wrapperVariation).addClass('active');
            initCharacteristicsImg(imgData[0]);
            initBigImg(imgData[0]);
            $('li.variation__item img').on('click', function () {
                initCharacteristicsImg(jQuery.parseJSON($(this).attr('data-data-img')));
                initBigImg(jQuery.parseJSON($(this).attr('data-data-img')))
            });

        } else {
            $(wrapperVariation).removeClass('active');
        }
    }

    function initBigImg(obj) {
        $(".colorTable__gallery--img img").attr("src", obj.bigIMG);
    }

    function initCharacteristicsImg(obj) {
        console.log(obj);
        var container = $('.characteristics__list');
        var imgData = obj.data;
        console.log(imgData);
        var charList = [];
        $(container).empty();
        for (var i = 0; i < imgData.length; i++) {
            var char = '<li class="characteristics__item">' +
                '<span class="characteristics__title">' + imgData[i].title + '</span>' +
                '<span class="characteristics__desc">' + imgData[i].data + '</span>' +
                '</li>';
            charList.push(char);
        }
        $(container).append(charList);
    }

    // open popup
    $(elemList).on("click", function (event) {
        var windowSize = window.innerWidth;
        if (windowSize >= 768) {
            console.log(this);
            // $(".colorTable__gallery--img img").attr("src", $(this).attr("src"));

            initVariation(this);
            // createCharacteristicsImg(this);
            // createAltImgList(this);

            $(".colorTable__gallery--wrapper").show();

            $("body").css({
                "overflow": "hidden"
            });

            return init();
            if ($(this).index() >= (elemList.length - 5)) {
                currentPosition = widthStep * ($(this).index() - 5);
            } else {
                currentPosition = widthStep * $(this).index();
            }
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });
        }
    });


    $(".js-btn3D").on("click", function () {
        $(".product__stand .img_2d").hide();
        $("#image-reel").show()
    });

    $(".product__sliderImg ul li a").on('click', function (event) {
        event.preventDefault();
        $("#image-reel").hide();
        $(".product__stand .img_2d").show();
        $(".product__stand .img_2d").attr("src", $(this).attr("href"));
    });

    $(window).resize(function () {
        var k = 500 / 304;
        var w = screen.width;

        if (w < 500) {
            $('.product__stand').height($('.product__stand').width() / k);
        }
    });

    function colorTable_item_slider() {
        var colorTable__item = $('.colorTable__item'),
            colorTable__item_length = colorTable__item.length;

        for (var i = 0; i < colorTable__item_length; i++) {
            var slide__array = [],
                slider__data = JSON.parse($(colorTable__item[i]).find('img').attr('data-data-img')),
                class__nav = ".custom-navigation-"+i+" a";

            if (slider__data.length > 1) {
                var slider__wrap = document.createElement('div'),
                    slider__list = document.createElement('ul');
                $(slider__wrap).addClass('slider-' + i);
                $(slider__list).addClass('slides');
                console.log(slider__data.length);
                for (var a = 0; a < slider__data.length; a++) {
                    var li = document.createElement('li'),
                        img = document.createElement('img'),
                        span = document.createElement('span');

                    $(span).text(slider__data[a].data[0].data);
                    $(img).attr('src', slider__data[a].bigIMG);
                    $(li).append(img);
                    $(li).append(span);
                    slide__array.push(li)
                }

                $(slider__list).append(slide__array);
                $(slider__wrap).append(slider__list);
                $(slider__wrap).append('<div class="flex-direction-nav '+"custom-navigation-"+i+'">' +
                    '<a href="#" class="flex-prev">' +
                    '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg_arrow" class="caret__arrow"></use></svg>'+
                    '</a>' +
                    '<a href="#" class="flex-next">' +
                    '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg_arrow" class="caret__arrow"></use></svg>'+
                    '</a>' +
                    '</div>');
                $(colorTable__item[i]).empty();
                $(colorTable__item[i]).append(slider__wrap);
                $(slider__wrap);

                $(slider__wrap).flexslider({
                    animation: "slide",
                    slideshow: false,
                    touch: true,
                    directionNav: true,
                    controlNav: false,
                    customDirectionNav: $(class__nav)
                });

            }

        }
    }

    var windowSize = window.innerWidth;
    if (windowSize < 768) {

        colorTable_item_slider();
    }

});


// <div class="flexslider">
//     <ul class="slides">
//          <li>
//              <img src="slide1.jpg" />
//          </li>
//          <li>
//              <img src="slide2.jpg" />
//          </li>
//          <li>
//              <img src="slide3.jpg" />
//          </li>
//          <li>
//              <img src="slide4.jpg" />
//          </li>
//          </ul>
//     </div>






//# sourceMappingURL=productSlider.js.map
