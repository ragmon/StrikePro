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

});
