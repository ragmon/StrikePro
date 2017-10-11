$(document).ready(function () {
    var body = $("body");

    var colorTable = $('.colorTable'),
        characteristicsList = $('.characteristics__list'),
        slideContainer = $(".slider__wrap"),
        galleryWrap = $('.colorTable__gallery--wrapper'),
        gallerySliderWrap = $('.colorTable__gallery--slider'),
        galleryPhotoList = $('.variation__list'),
        galleryMainPhoto = $('.colorTable__gallery--img img'),
        galleryMainTitle = $('.colorTable__gallery--title');

    var colorTableItem = [],
        sliderItem = [],
        currentPhoto = [];

    var currentPosition = 0,
        widthStep,
        maxStep;

    // функции генераторы разметки

    function colorTableItemRender(id, image, title) {
        return ('<div class="colorTable__item" id="' + id + '">' +
        '<img src="' + image + '" alt="">' +
        '<span>' + title + '</span>' +
        '</div>')
    }

    function descriptionRender(array) {
        var features = [];
        $(characteristicsList).empty();
        for (var i = 0; i < array.length; i++) {
            var feature = '<li class="characteristics__item">' +
                '<span class="characteristics__title">' + array[i].title + '</span>' +
                '<span class="characteristics__desc">' + array[i].pivot.value + '</span>' +
                '</li>';
            features.push(feature);
        }
        $(characteristicsList).append(features);
    }

    function sliderItemRender(image, id) {
        return (
            '<li  class="slider__item" id="' + id + '"> <a href="#!"  class="slider__link" ><img src="' + image + '" /></a> </li>'
        )
    }

    function gelleryPhotoRender(array) {
        var photos = [];
        for (var i = 0; i < array.length; i++) {
            var photo = '<li class="variation__item">' +
                '<img id="' + array[i].id + '" src="' + array[i].thumb + '" alt="">' +
                '</li>';
            photos.push(photo);
            if (i === 0) {
                initGalleryMainPhoto(array[i].id);
            }
        }
        $(galleryPhotoList).append(photos);
        $('.colorTable__gallery--variation').addClass('active');

        $('.variation__item img').on('click', function () {
            initGalleryMainPhoto($(this).attr('id'));
            $(galleryMainPhoto).css({
                'transform': 'none'
            })
        })
    }

    // функции движения слайдера

    function leftMove() {
        if (sliderItem.length <= 6) {
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
    }

    function rightMove() {
        if (sliderItem.length <= 6) {
            return
        }
        if (Math.round(parseFloat(currentPosition)) === Math.round(parseFloat(maxStep))) {
            currentPosition = parseFloat(maxStep);
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });
            return;
        }
        currentPosition += parseFloat(widthStep);
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });
    }

    function initGallery() {
        var windowSize = window.innerWidth;
        if (windowSize >= 768) {
            $(galleryWrap).show();
            $(body).css({
                "overflow": "hidden"
            });

            var $panzoom = $(galleryMainPhoto).panzoom();
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


            return initSlider(this);
        }
        return false;
    }

    function initSlider(event) {

        sliderItem = [];
        (slideContainer).empty();
        $(galleryPhotoList).empty();
        for (var i = 0; i < articles.length; i++) {
            sliderItem.push(sliderItemRender(articles[i].logo.thumb, articles[i].id))
        }
        $(slideContainer).append(sliderItem);

        widthStep = (parseFloat($(gallerySliderWrap).outerWidth() / 6)).toFixed(3);
        maxStep = (parseFloat((sliderItem.length * widthStep) - (widthStep * 6))).toFixed(3);

        currentPosition = 0;
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });

        $(".slider__item").each(function (index, element) {
            if (parseInt($(element).attr('id')) === parseInt($(event).attr('id'))) {
                $(element).addClass('active');
                if (index + 1 > 6) {
                    currentPosition = (parseFloat(((index + 1) * widthStep) - (widthStep * 6))).toFixed(3);
                    $(slideContainer).css({
                        "transform": "translateX(-" + currentPosition + "px)"
                    });
                }
            }
        });

        initDescription($(event).attr('id'));
        initPhotos($(event).attr('id'));

        $(".slider__item").on('click', function () {
            initDescription($(this).attr('id'));
            initPhotos($(this).attr('id'));
            $(".slider__item").removeClass('active');
            $(this).addClass('active');

            $(galleryMainPhoto).css({
                'transform': 'none'
            })
        })
    }

    function initDescription(id) {
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                descriptionRender(articles[i].features);
            }
        }
    }

    function initPhotos(id) {
        currentPhoto = [];
        $(galleryPhotoList).empty();
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                currentPhoto = articles[i].photos;
                gelleryPhotoRender(articles[i].photos);
            }
        }
    }

    function initGalleryMainPhoto(id) {
        for (var i = 0; i < currentPhoto.length; i++) {
            if (currentPhoto[i].id === parseInt(id)) {
                $(galleryMainPhoto).attr('src', currentPhoto[i].original);
                $(galleryMainTitle).text(currentPhoto[i].title);
            }
        }
    }

    function init() {
        var windowSize = window.innerWidth;
        $(colorTable).empty();
        $(colorTable).after("<div class='colorTable _mobile'></div>");
        $(".left").on("click", leftMove);
        $(".right").on("click", rightMove);

        for (var i = 0; i < articles.length; i++) {
            if(articles[i].logo) {
                colorTableItem.push(colorTableItemRender(articles[i].id, articles[i].logo.thumb, articles[i].name));
            } else {
                colorTableItem.push(colorTableItemRender(articles[i].id, '/image/no_image.svg', articles[i].name));
            }
        }
        $(colorTable).append(colorTableItem);
        $('.colorTable._mobile').append(colorTableItem);
        $('.colorTable._desctop .colorTable__item').on('click', initGallery);
        if (windowSize >= 768) {

        } else {
            colorTable_item_slider();
        }
    }

    function colorTable_item_slider() {
        var colorTableItemMobile = $('.colorTable._mobile .colorTable__item');
        var colorTableItemMobileLength = colorTableItemMobile.length;
        for (var i = 0; i < colorTableItemMobileLength; i++) {
            var slides = [];
            var classNav = ".custom-navigation-" + i + " a";
            var photos = articles[i].photos,
                photosLength = photos.length;

            if (photosLength === 1) continue;

            var sliderWrap = document.createElement('div'),
                sliderList = document.createElement('ul');
            $(sliderWrap).addClass('slider-' + i);
            $(sliderList).addClass('slides');

            for (var a = 0; a < photosLength; a++) {
                var li = document.createElement('li'),
                    img = document.createElement('img'),
                    span = document.createElement('span');
                $(span).text(photos[a].title);
                $(img).attr('src', photos[a].original);
                $(li).append(img);
                $(li).append(span);
                slides.push(li)
            }

            $(sliderList).append(slides);
            $(sliderWrap).append(sliderList);
            $(sliderWrap).append('<div class="flex-direction-nav ' + "custom-navigation-" + i + '">' +
                '<a href="#" class="flex-prev">' +
                '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg_arrow" class="caret__arrow"></use></svg>' +
                '</a>' +
                '<a href="#" class="flex-next">' +
                '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg_arrow" class="caret__arrow"></use></svg>' +
                '</a>' +
                '</div>');


            $(colorTableItemMobile[i]).empty();
            $(colorTableItemMobile[i]).append(sliderWrap);

            $(sliderWrap).flexslider({
                animation: "slide",
                slideshow: false,
                touch: true,
                directionNav: true,
                controlNav: false,
                customDirectionNav: $(classNav)
            });

        }
    }

    init();

    $(window).resize(function () {
        var windowSize = window.innerWidth;
        if (windowSize >= 768) {
            widthStep = (parseFloat($(gallerySliderWrap).outerWidth() / 6)).toFixed(3);
            maxStep = (parseFloat((sliderItem.length * widthStep) - (widthStep * 6))).toFixed(3);
            currentPosition = 0;
            $(slideContainer).css({
                "transform": "translateX(0px)"
            });
        } else {
            colorTable_item_slider();
        }
    });

});


$(document).ready(function () {
    $(".js-btn3D").on("click", function () {
        $(".product__stand .img_2d").hide();
        $("#image-reel").show()
    });

    $(window).resize(function () {
        var k = 500 / 304;
        var w = screen.width;

        if (w < 500) {
            $('.product__stand').height($('.product__stand').width() / k);
        }
    });

});


