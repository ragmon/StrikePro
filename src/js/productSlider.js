$(document).ready(function () {
    var body = $("body");

    var colorTable = $('.colorTable'),
        characteristicsList = $('.characteristics__list'),
        slideContainer = $(".slider__wrap"),
        galleryWrap = $('.colorTable__gallery--wrapper'),
        gallerySliderWrap = $('.colorTable__gallery--slider'),
        galleryPhotoList = $('.variation__list'),
        galleryMainPhoto = $('.colorTable__gallery--img img');

    var colorTableItem = [],
        sliderItem = [],
        currentPhoto = [];

    var currentPosition = 0,
        widthStep,
        maxStep;

    // функции генераторы разметки

    // TODO: рендер списка вариантов артикла, принимает на вход массив
    function colorTableItemRender(id, image, data) {
        var title = '';
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].title === 'Код цвета') {
                title = data.features[i].pivot.value
            }
        }
        return ('<div class="colorTable__item" id="' + id + '">' +
            '<img src="' + image + '" alt="">' +
            '<span>' + title + '</span>' +
            '</div>')
    }

    // TODO: рендер списка характеристик, принимает на вход массив
    function descriptionRender(array) {
        var features = [];
        $(characteristicsList).empty();
        for (var i = 0; i < array.length; i++) {
            if (parseInt(array[i].is_visible) === 1) {
                var feature = '<li class="characteristics__item">' +
                    '<span class="characteristics__title">' + array[i].title + '</span>' +
                    '<span class="characteristics__desc">' + array[i].pivot.value + '</span>' +
                    '</li>';
                features.push(feature);
            }
        }
        $(characteristicsList).append(features);
    }

    // TODO: рендер списка артиклей в слайдере
    function sliderItemRender(image, id, data) {
        var title = '';
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].title === 'Код цвета') {
                title = data.features[i].pivot.value
            }
        }
        return (
            '<li  class="slider__item" id="' + id + '"> <a href="#!"  class="slider__link" ><img src="' + image + '" /></a><span class="slider__item-title">' + title + '</span> </li>'
        )
    }

    // TODO: рендер списка вариантов артикла, принимает на вход массив
    function gelleryPhotoRender(Array) {
        var photos = [];
        var array = Array;

        if (array === undefined) {
            // initGalleryMainPhoto(array[i].id);
            return null;
        }
        if (array.length > 1) {
            for (var i = 0; i < array.length; i++) {
                var photo = '<li class="variation__item">' +
                    '<img id="' + array[i].id + '" src="' + array[i].thumb_url + '" alt="">' +
                    '</li>';
                photos.push(photo);
                // if (i === 0) {
                //     initGalleryMainPhoto(array[i].id);
                // }
            }
            $(galleryPhotoList).append(photos);
            $('.colorTable__gallery--variation').addClass('active');

            $('.variation__item img').on('click', function () {
                // initGalleryMainPhoto($(this).attr('id'));

                for (var i = 0; i < array.length; i++) {
                    if (array[i].id === parseInt($(this).attr('id'))) {

                        $(galleryMainPhoto).attr('src', array[i].original_url);

                    }
                }


                $(galleryMainPhoto).css({
                    'transform': 'none'
                })
            })
        } else {
            return null;
        }
    }

    // функции движения слайдера

    // TODO: движение слайдера влево
    function leftMove(event) {
        var step = event.type === 'click' ? 6 : 1;
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

        currentPosition -= parseFloat(widthStep * step);
        if (currentPosition <= 0) {
            currentPosition = 0;
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });

            return;
        }
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });
    }

    // TODO: движение слайдера вправо
    function rightMove(event) {
        var step = event.type === 'click' ? 6 : 1;
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
        currentPosition += parseFloat(widthStep * step);
        if (Math.round(parseFloat(currentPosition)) >= Math.round(parseFloat(maxStep))) {
            currentPosition = parseFloat(maxStep);
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });
            return;
        }
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });
    }

    // TODO: инициализация галереи
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
                    focal: e,
                    minScale: 1
                });
            });


            return initSlider(this);
        }
        return false;
    }

    // TODO: инициализация слайдера и кучи всякого
    function initSlider(event) {
        sliderItem = [];
        (slideContainer).empty();
        $(galleryPhotoList).empty();
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].logo) {
                sliderItem.push(sliderItemRender(articles[i].logo.thumb_url, articles[i].id, articles[i]))
            } else {
                sliderItem.push(sliderItemRender('http://cdn.strikepro.ru/default_group.png', articles[i].id, articles[i]))
            }
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

        $(".slider__item").on('click', function (e) {
            e.preventDefault();
            onActivePhoto($(this).attr('id'));
        })
    }

    // TODO: активация элемента списка по id артикла
    function onActivePhoto(id) {
        initDescription(id);
        initPhotos(id);
        $(".slider__item").removeClass('active');
        $('[id = ' + id + ']').addClass('active');

        $(galleryMainPhoto).css({
            'transform': 'none'
        })
    }

    // TODO: инициализация списка харктеристик по id артикла
    function initDescription(id) {
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                descriptionRender(articles[i].features);
            }
        }
    }

    // TODO: смена главного изображения по id артикла
    function initPhotos(id) {
        $(galleryPhotoList).empty();
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                initGalleryMainPhoto(articles[i].id);
                gelleryPhotoRender(articles[i].head_images);
            }
        }
    }

    // TODO: смена главного изображения по id артикла
    function initGalleryMainPhoto(id) {
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                $(galleryMainPhoto).attr('src', articles[i].logo.original_url);
            }
        }
    }

    function init() {
        try {
            var windowSize = window.innerWidth;
            $(colorTable).empty();
            $(colorTable).after("<div class='colorTable _mobile'></div>");
            $(".left").on("click", leftMove);
            $(".right").on("click", rightMove);

            for (var i = 0; i < articles.length; i++) {
                if (articles[i].logo) {
                    colorTableItem.push(colorTableItemRender(articles[i].id, articles[i].logo.thumb_url ? articles[i].logo.thumb_url : 'http://cdn.strikepro.ru/default_group.png', articles[i]));
                } else {
                    colorTableItem.push(colorTableItemRender(articles[i].id, 'http://cdn.strikepro.ru/default_group.png', articles[i]));
                }
            }
            $(colorTable).append(colorTableItem);
            $('.colorTable._mobile').append(colorTableItem);
            $('.colorTable._desctop .colorTable__item').on('click', initGallery);
            if (windowSize >= 768) {

            } else {
                colorTable_item_slider();
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    function colorTable_item_slider() {
        var colorTableItemMobile = $('.colorTable._mobile .colorTable__item');
        var colorTableItemMobileLength = colorTableItemMobile.length;
        for (var i = 0; i < colorTableItemMobileLength; i++) {
            var slides = [];
            var classNav = ".custom-navigation-" + i + " a";
            var photos = articles[i].head_images;
            var photosLength = photos ? photos.length : 1;
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
                $(img).attr('src', photos[a].original_url);
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


    addEventListener("keydown", function (event) {
        var active = $('.colorTable__gallery--wrapper').css('display');
        if (active === 'block') {

            if (event.which === 37) { //left
                leftMove(event);
                onActivePhoto($($('.slider__item.active').prev()).attr('id'))
            }
            if (event.which === 39) { // right
                rightMove(event);
                onActivePhoto($($('.slider__item.active').next()).attr('id'))
            }
            if (event.which === 38) { // top
                $('.colorTable__gallery--variation').scrollTop($('.colorTable__gallery--variation').scrollTop() - 10);
            }
            if (event.which === 40) { // bottom
                $('.colorTable__gallery--variation').scrollTop($('.colorTable__gallery--variation').scrollTop() + 10);
            }
        }
    });


    try {
        init();
    } catch (err) {
        console.log(err)
    }

    $(window).resize(function () {
        var windowSize = window.innerWidth;
        if (windowSize >= 992) {
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

// http://webcareer.ru/menyaem-aktivnyj-punkt-menyu-pri-prokrutke-stranicy.html
// http://jsfiddle.net/mekwall/up4nu/

$(document).ready(function () {
    $(".js-btn3D").on("click", function () {
        console.log('click')
        var img3D = $('#reel-image');
        $(img3D).reel({
            loops: true,
            speed: 0.5,
            frames: 6,
            revolution: 100,
            images: "http://test.vostrel.net/jquery.reel/example/object-movie-non-looping-sequence/green/#.png"
        });

        $(".img_2d").hide();
        $('#reel-image-reel').show();
        $(img3D).show()
    });
    $(".product__sliderImg ul li a").on('click', function (event) {
        console.log('click')

        var img2D = $(".img_2d");
        var img3D = $('#reel-image');
        event.preventDefault();
        $(img2D).show();
        $(img2D).attr("src", $(this).attr("href"));
        $(img3D).hide();
        $('#reel-image-reel').hide();
    });
    $(window).resize(function () {
        var k = 500 / 304,
            productStand = $('.product__stand'),
            w = $(document).width();

        if (w < 500) {
            $(productStand).height($(productStand).width() / k);
        } else {
            $(productStand).height('auto');
        }
    });


    //TODO: ШАПКА СТРАНИЦЫ ПРОДУКТА
    var HeaderProductWrapper = $('.header-product'),
        HeaderProductTitle = $('.header-product__title'),
        HeaderProductImage = $('.header-product__image img'),
        HeaderProductNav = $('.header-product__nav'),
        SectionTitleList = $('h4.title__xs'),
        HeaderProductMenuList = [];

    function toggleMenuLink() {
        var lastId,
            topMenu = $('.header-product__nav'),
            topMenuHeight = $(topMenu).outerHeight() + 15,
            // All list items
            menuItems = $(topMenu).find("a"),
            // Anchors corresponding to menu items
            scrollItems = $(menuItems).map(function () {
                var item = $(this.hash);
                if (item.length) {
                    return item;
                }
            });

// Bind click handler to menu items
// so we can get a fancy scroll animation
        $(menuItems).click(function (e) {
            var href = $(this.hash);
            offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
            $('html, body').stop().animate({
                scrollTop: offsetTop
            }, 300);
            e.preventDefault();
        });

// Bind to scroll
        $(window).scroll(function () {
            // Get container scroll position
            var fromTop = $(this).scrollTop() + topMenuHeight;
            // Get id of current scroll item
            var cur = $(scrollItems).map(function () {
                if ($(this).offset().top < fromTop)
                    return this;
            });
            // Get the id of the current element
            cur = cur[cur.length - 1];

            var id = cur && cur.length ? cur[0].id : "";
            if (lastId !== id) {
                lastId = id;
                $(menuItems).parent().removeClass("active");
                $("[href='#" + lastId + "']").parent('.header-product__item').addClass("active");
            }
            HeaderProductToggle();
        });
    }

    function renderMenuItem(link, content) {
        return ('<li class="header-product__item"><a href="#' + link + '" class="header-product__link">' + content + '</a></li>')
    }

    function init() {
        $(HeaderProductNav).empty();
        HeaderProductMenuList.push(renderMenuItem('main-image', 'Изображение'));
        $(SectionTitleList).each(function (index, element) {
            var id = 'product-section-id-' + index,
                content = $(element).text();
            $(element).attr("id", id);
            HeaderProductMenuList.push(renderMenuItem(id, content));
        });
        $(HeaderProductNav).append(HeaderProductMenuList);
        $(HeaderProductImage).attr('src', $('.product__stand--img .img_2d').attr('src'));
        $(HeaderProductTitle).text($('.product__title h1').text());

        //TODO: Инициализация обработчика скрола
        toggleMenuLink()

    }


    init();

    function HeaderProductToggle() {
        if (screen.width > 1023) {
            if ($(".img_2d").offset().top < window.scrollY) {

                $('.header__top').css({top: '-150px'});
                $('.header-product').css({top: '0'});
            } else {
                $('.header__top').css({top: '0'});
                $('.header-product').css({top: '-150px'});

            }
        }
    }

});





//TODO: Gallery
$(document).ready(function () {
    $('.product-gallery_list').magnificPopup({
        delegate: 'li a',
        type: 'image',
        tLoading: 'Loading image #%curr%...',
        mainClass: 'mfp-img-mobile',
        gallery: {
            enabled: true,
            arrowMarkup: '<button title="%title%" type="button" onclick="event.stopPropagation()" class="product-gallery_arrow mfp-arrow mfp-arrow-%dir% mfp-prevent-close product-gallery_arrow-%dir%"><svg ><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg_arrow" class="arrow"></use></svg></button>', // markup of an arrow button
            tCounter: '%curr% из %total%',
            navigateByImgClick: true,
            preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
        },
        image: {
            titleSrc: function (item) {
                return item.el.attr('title');
            }
        },
        zoom: {
            enabled: true,
            duration: 200, // don't foget to change the duration also in CSS
            opener: function (element) {
                return element.find('img');
            }
        }
    });

});
