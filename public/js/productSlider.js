$(document).ready(function () {
    var elemList = $(".colorTable__item img");
    var slideContainer = $(".slider__wrap");
    var currentPosition = 0;
    var widthStep;
    var maxStep;

    function init() {

        for (var i = 0; i < elemList.length; i++) {
            var dataImg = "" + $(elemList[i]).attr("data-data-img");
            var imgLink = $(elemList[i]).attr("src");
            var imgBig = $(elemList[i]).attr("data-big-img");



            var li = $('<li class="slider__item"></li>');
            var link = $('<a href="" class="slider__link" data-data-img=""></a>');
            var img = $('<img src="">');
            $(link).attr({'data-data-img' : dataImg, 'href': imgBig});

            if ( $(elemList[i]).attr("data-alt-img") ) {
                $(link).attr({'data-alt-img' : $(elemList[i]).attr("data-alt-img")});
            }

            $(img).attr('src',imgLink);
            $(link).append(img);
            $(li).append(link);
            $(slideContainer).append(li);
        }

        widthStep = $('.colorTable__gallery--slider').outerWidth() / 6;
        maxStep = (elemList.length * widthStep) - (widthStep * 6);

        $(".colorTable__gallery--title__name").text($(".product__title h1").text());

        $(".slider__link").on("click", function (event) {
            event.preventDefault();
            changeActiveImgVariation(this);
            createCharacteristicsImg(this);
            createAltImgList(this);
        });

        var $panzoom = $('.colorTable__gallery--img img').panzoom();
        $panzoom.parent().on('mousewheel.focal', function( e ) {
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
// Добавление характеристик товара над картинкой
    function createCharacteristicsImg(elem) {
        var container = $('.characteristics__list');
        var imgData = jQuery.parseJSON($(elem).attr("data-data-img"));
        $(container).empty();
        for(var i = 0; i < imgData.length; i++){
            var elem = '<li class="characteristics__item"><span class="characteristics__title">'+imgData[i].title+'</span><span class="characteristics__desc">'+imgData[i].data+'</span></li>';
            $(container).append(elem);
        }
    }
// добавление вариаций товара справа, если они есть
    function createAltImgList(elem) {
        var jsonListLink = $(elem).attr("data-alt-img");
        var wrapperVariation = $('.colorTable__gallery--variation');
        var containerVariation = $('ul.variation__list');
        $(containerVariation).empty();

        if(jsonListLink != undefined) {
            var linkArray = jQuery.parseJSON(jsonListLink);
            $(wrapperVariation).addClass('active');

            for(var i = 0; i < linkArray.length; i++){
                var li = $('<li class="variation__item"></li>');
                var img = $('<img src="">');
                $(img).attr('src', linkArray[i]);
                $(li).append(img);
                $(containerVariation).append(li);
            }
            $('li.variation__item').on('click', function () {
                changeActiveImgVariation(this);
            });
            // -2665.67
        } else {
            $(wrapperVariation).removeClass('active');
        }
    }
// изменение активного изображения
    function changeActiveImgVariation(elem) {
        $(".colorTable__gallery--img img").attr("src", $(elem).find("img").attr("src"));
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



        // open popup
    $(elemList).on("click", function (event) {
        var windowSize = window.innerWidth;
        if (windowSize >= 768) {
            $(".colorTable__gallery--img img").attr("src", $(this).attr("src"));


            createCharacteristicsImg(this);
            createAltImgList(this);

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
    })














    $(".js-btn3D").on("click", function () {
        $(".product__stand .img_2d").hide();
        $("#image-reel").show()
    })

    $(".product__sliderImg ul li a").on('click', function (event) {
        event.preventDefault();
        $("#image-reel").hide();
        $(".product__stand .img_2d").show()
        $(".product__stand .img_2d").attr("src", $(this).attr("href"));
    })

    $(window).resize(function () {
        var k = 500 / 304;
        var w = screen.width;

        if (w < 500) {
            $('.product__stand').height($('.product__stand').width() / k);
        }
    });

});

//# sourceMappingURL=productSlider.js.map
