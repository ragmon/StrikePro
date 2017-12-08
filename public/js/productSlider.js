$(document).ready(function () {
    var body = $("body");

    var colorTable = $('.colorTable'),
        characteristicsList = $('.characteristics__list'),
        slideContainer = $(".slider__wrap"),
        galleryWrap = $('.colorTable__gallery--wrapper'),
        gallerySliderWrap = $('.colorTable__gallery--slider'),
        galleryPhotoList = $('.variation__list'),
        galleryMainPhoto = $('.colorTable__gallery--img');

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
        var ultraviolet = false;
        var luminous = false;
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].title === 'Код цвета') {
                title = data.features[i].pivot.value
            }
            if (data.features[i].title === "Светящийся") {
                console.log("Светящийся", data.features[i].pivot.value === 'Да');
                luminous = data.features[i].pivot.value === 'Да';
            }
            if (data.features[i].title === "Ультрафиолет") {
                ultraviolet = data.features[i].pivot.value === 'Да';
            }
        }


        return ('<div class="colorTable__item" id="' + id + '">' +
            '<div class="colorTable__img">' +
            '<img src="' + image + '" alt="">' +
            (ultraviolet ? '<div class="colorTable__marker colorTable__marker--ultraviolet"></div>' : '') +
            (luminous ? '<div class="colorTable__marker colorTable__marker--luminous"></div>' : '') +
            '</div>' +
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
        var ultraviolet = false;
        var luminous = false;
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].title === 'Код цвета') {
                title = data.features[i].pivot.value
            }
            if (data.features[i].title === "Светящийся") {
                console.log("Светящийся", data.features[i].pivot.value === 'Да');
                luminous = data.features[i].pivot.value === 'Да';
            }
            if (data.features[i].title === "Ультрафиолет") {
                ultraviolet = data.features[i].pivot.value === 'Да';
            }
        }
        return (
            '<li  class="slider__item" id="' + id + '"> ' +
            '<a href="#!"  class="slider__link" >' +
            '<img src="' + image + '" />' +
            (ultraviolet ? '<div class="colorTable__marker colorTable__marker--ultraviolet"></div>' : '') +
            (luminous ? '<div class="colorTable__marker colorTable__marker--luminous"></div>' : '') +
            '</a>' +
            '<span class="slider__item-title">' + title + '</span> ' +
            '</li>'
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
                initGalleryMainPhoto($(this).attr('id'));

                $(galleryMainPhoto).css({
                    'transform': 'none'
                })
                // for (var i = 0; i < array.length; i++) {
                //     if (array[i].id === parseInt($(this).attr('id'))) {
                //         console.log('--',array)
                //         $(galleryMainPhoto).empty();
                //
                //         $(galleryMainPhoto).attr('src', array[i].original_url);
                //
                //     }
                // }


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

            var $panzoom = $(galleryMainPhoto).find('img').panzoom();
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
        var ultraviolet = false;
        var luminous = false;
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                for (var a = 0; a < articles[i].features.length; a++) {
                    if (articles[i].features[a].title === "Светящийся") {
                        console.log("Светящийся", articles[i].features[a].pivot.value === 'Да');
                        luminous = articles[i].features[a].pivot.value === 'Да';
                    }
                    if (articles[i].features[a].title === "Ультрафиолет") {
                        ultraviolet = articles[i].features[a].pivot.value === 'Да';
                    }
                }
                $(galleryMainPhoto).empty();
                $(galleryMainPhoto).append('<img src="' + articles[i].logo.original_url + '" alt="">');
                if (luminous) {
                    $(galleryMainPhoto).append('<div class="colorTable__gallery__marker colorTable__gallery__marker--luminous"></div>');
                }
                if (ultraviolet) {
                    $(galleryMainPhoto).append('<div class="colorTable__gallery__marker colorTable__gallery__marker--ultraviolet"></div>');
                }
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
                if ($('.slider__item.active').prev().length) {
                    leftMove(event);
                    onActivePhoto($($('.slider__item.active').prev()).attr('id'))
                }
            }
            if (event.which === 39) { // right
                if ($('.slider__item.active').next().length) {

                    rightMove(event);
                    onActivePhoto($($('.slider__item.active').next()).attr('id'))
                }
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

window.articles = [{
    "id": 1104410,
    "group_id": "776",
    "new": "0",
    "sale": "0",
    "code": "EG-039SP#A70-713",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:45",
    "updated_at": "2017-10-07 20:24:45",
    "logo": {
        "id": 1737,
        "original": "1104410_0_headimage.jpg",
        "thumb": "1104410_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104410",
        "order": "0",
        "created_at": "2017-10-08 16:47:30",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104410_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104410_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1737,
        "original": "1104410_0_headimage.jpg",
        "thumb": "1104410_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104410",
        "order": "0",
        "created_at": "2017-10-08 16:47:30",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104410_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104410_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1104410", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104410", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104410", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104410", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104410", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104410", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104410", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104410", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104410", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104410", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104410", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104410", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104410", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104410", "feature_id": "58", "value": "A70-713"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1104410", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1104447,
    "group_id": "776",
    "new": "0",
    "sale": "1",
    "code": "EG-039SP#A164F",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "87",
    "created_at": "2017-10-07 20:24:45",
    "updated_at": "2017-10-07 20:24:45",
    "logo": {
        "id": 1738,
        "original": "1104447_0_headimage.jpg",
        "thumb": "1104447_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104447",
        "order": "0",
        "created_at": "2017-10-08 16:47:30",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104447_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104447_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1738,
        "original": "1104447_0_headimage.jpg",
        "thumb": "1104447_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104447",
        "order": "0",
        "created_at": "2017-10-08 16:47:30",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104447_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104447_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1104447", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104447", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104447", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104447", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104447", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104447", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104447", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104447", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104447", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104447", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104447", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104447", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104447", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104447", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104447", "feature_id": "58", "value": "A164F"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1104447", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1104455,
    "group_id": "776",
    "new": "0",
    "sale": "1",
    "code": "EG-039SP#SM37F",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1739,
        "original": "1104455_0_headimage.jpg",
        "thumb": "1104455_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104455",
        "order": "0",
        "created_at": "2017-10-08 16:47:30",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104455_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104455_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1739,
        "original": "1104455_0_headimage.jpg",
        "thumb": "1104455_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104455",
        "order": "0",
        "created_at": "2017-10-08 16:47:30",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104455_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104455_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1104455", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104455", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104455", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104455", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104455", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104455", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104455", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104455", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104455", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104455", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104455", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104455", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104455", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104455", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104455", "feature_id": "58", "value": "SM37F"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1104455", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1104456,
    "group_id": "776",
    "new": "0",
    "sale": "1",
    "code": "EG-039SP#A174FW",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "25",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1740,
        "original": "1104456_0_headimage.jpg",
        "thumb": "1104456_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104456",
        "order": "0",
        "created_at": "2017-10-08 16:47:31",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104456_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104456_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1740,
        "original": "1104456_0_headimage.jpg",
        "thumb": "1104456_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104456",
        "order": "0",
        "created_at": "2017-10-08 16:47:31",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104456_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104456_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1104456", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104456", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104456", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104456", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104456", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104456", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104456", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104456", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104456", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104456", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104456", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104456", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104456", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104456", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104456", "feature_id": "58", "value": "A174FW"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1104456", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1104488,
    "group_id": "776",
    "new": "0",
    "sale": "0",
    "code": "EG-039SP#A210-SBO-RP",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "75",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1741,
        "original": "1104488_0_headimage.jpg",
        "thumb": "1104488_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104488",
        "order": "0",
        "created_at": "2017-10-08 16:47:31",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104488_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104488_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1741,
        "original": "1104488_0_headimage.jpg",
        "thumb": "1104488_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104488",
        "order": "0",
        "created_at": "2017-10-08 16:47:31",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104488_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104488_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1104488", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104488", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104488", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104488", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104488", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104488", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104488", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104488", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104488", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104488", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104488", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104488", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104488", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104488", "feature_id": "58", "value": "A210-SBO-RP"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1104488", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1104489,
    "group_id": "776",
    "new": "0",
    "sale": "0",
    "code": "EG-039SP#GC01S",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1742,
        "original": "1104489_0_headimage.jpg",
        "thumb": "1104489_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104489",
        "order": "0",
        "created_at": "2017-10-08 16:47:31",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104489_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104489_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1742,
        "original": "1104489_0_headimage.jpg",
        "thumb": "1104489_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1104489",
        "order": "0",
        "created_at": "2017-10-08 16:47:31",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1104489_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1104489_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1104489", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104489", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104489", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1104489", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104489", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104489", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1104489", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104489", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104489", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1104489", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104489", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104489", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104489", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1104489", "feature_id": "58", "value": "GC01S"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1104489", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1251128,
    "group_id": "776",
    "new": "0",
    "sale": "0",
    "code": "EG-039SP#A116L",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м Fluo",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м Fluo",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1743,
        "original": "1251128_0_headimage.jpg",
        "thumb": "1251128_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1251128",
        "order": "0",
        "created_at": "2017-10-08 16:47:31",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1251128_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1251128_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1743,
        "original": "1251128_0_headimage.jpg",
        "thumb": "1251128_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1251128",
        "order": "0",
        "created_at": "2017-10-08 16:47:31",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1251128_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1251128_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1251128", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1251128", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1251128", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1251128", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1251128", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1251128", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1251128", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1251128", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1251128", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1251128", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1251128", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1251128", "feature_id": "49", "value": "130"}
    }, {
        "id": 51,
        "title": "Светящийся",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "979c441c-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1251128", "feature_id": "51", "value": "Да"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1251128", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1251128", "feature_id": "58", "value": "A116L"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1251128", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1252115,
    "group_id": "776",
    "new": "0",
    "sale": "0",
    "code": "EG-039SP#A010-EP",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "2",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1744,
        "original": "1252115_0_headimage.jpg",
        "thumb": "1252115_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1252115",
        "order": "0",
        "created_at": "2017-10-08 16:47:31",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1252115_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1252115_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1744,
        "original": "1252115_0_headimage.jpg",
        "thumb": "1252115_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1252115",
        "order": "0",
        "created_at": "2017-10-08 16:47:31",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1252115_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1252115_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1252115", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1252115", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1252115", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1252115", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1252115", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1252115", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1252115", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1252115", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1252115", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1252115", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1252115", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1252115", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1252115", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1252115", "feature_id": "58", "value": "A010-EP"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1252115", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1252791,
    "group_id": "776",
    "new": "0",
    "sale": "0",
    "code": "EG-039SP#022PPP-713",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "4",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1745,
        "original": "1252791_0_headimage.jpg",
        "thumb": "1252791_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1252791",
        "order": "0",
        "created_at": "2017-10-08 16:47:32",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1252791_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1252791_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1745,
        "original": "1252791_0_headimage.jpg",
        "thumb": "1252791_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1252791",
        "order": "0",
        "created_at": "2017-10-08 16:47:32",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1252791_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1252791_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1252791", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1252791", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1252791", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1252791", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1252791", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1252791", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1252791", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1252791", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1252791", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1252791", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1252791", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1252791", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1252791", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1252791", "feature_id": "58", "value": "022PPP-713"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1252791", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1256357,
    "group_id": "776",
    "new": "0",
    "sale": "0",
    "code": "EG-039SP#X10",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1746,
        "original": "1256357_0_headimage.jpg",
        "thumb": "1256357_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256357",
        "order": "0",
        "created_at": "2017-10-08 16:47:32",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256357_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256357_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1746,
        "original": "1256357_0_headimage.jpg",
        "thumb": "1256357_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256357",
        "order": "0",
        "created_at": "2017-10-08 16:47:32",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256357_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256357_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1256357", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256357", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256357", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256357", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256357", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256357", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256357", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256357", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256357", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256357", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256357", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256357", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256357", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256357", "feature_id": "58", "value": "X10"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1256357", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1256358,
    "group_id": "776",
    "new": "0",
    "sale": "1",
    "code": "EG-039SP#A139",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "69",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1747,
        "original": "1256358_0_headimage.jpg",
        "thumb": "1256358_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256358",
        "order": "0",
        "created_at": "2017-10-08 16:47:32",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256358_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256358_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1747,
        "original": "1256358_0_headimage.jpg",
        "thumb": "1256358_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256358",
        "order": "0",
        "created_at": "2017-10-08 16:47:32",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256358_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256358_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1256358", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256358", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256358", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256358", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256358", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256358", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256358", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256358", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256358", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256358", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256358", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256358", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256358", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256358", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256358", "feature_id": "58", "value": "A139"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1256358", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1256359,
    "group_id": "776",
    "new": "0",
    "sale": "1",
    "code": "EG-039SP#A140E",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1748,
        "original": "1256359_0_headimage.jpg",
        "thumb": "1256359_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256359",
        "order": "0",
        "created_at": "2017-10-08 16:47:33",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256359_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256359_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1748,
        "original": "1256359_0_headimage.jpg",
        "thumb": "1256359_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256359",
        "order": "0",
        "created_at": "2017-10-08 16:47:33",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256359_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256359_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1256359", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256359", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256359", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256359", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256359", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256359", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256359", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256359", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256359", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256359", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256359", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256359", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256359", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256359", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256359", "feature_id": "58", "value": "A140E"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1256359", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1256360,
    "group_id": "776",
    "new": "0",
    "sale": "1",
    "code": "EG-039SP#A141",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "91",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1749,
        "original": "1256360_0_headimage.jpg",
        "thumb": "1256360_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256360",
        "order": "0",
        "created_at": "2017-10-08 16:47:33",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256360_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256360_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1749,
        "original": "1256360_0_headimage.jpg",
        "thumb": "1256360_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256360",
        "order": "0",
        "created_at": "2017-10-08 16:47:33",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256360_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256360_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1256360", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256360", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256360", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256360", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256360", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256360", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256360", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256360", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256360", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256360", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256360", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256360", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256360", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256360", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256360", "feature_id": "58", "value": "A141"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1256360", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1256715,
    "group_id": "776",
    "new": "0",
    "sale": "1",
    "code": "EG-039SP#A47FL",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м Fluo",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м Fluo",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "18",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1750,
        "original": "1256715_0_headimage.jpg",
        "thumb": "1256715_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256715",
        "order": "0",
        "created_at": "2017-10-08 16:47:33",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256715_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256715_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1750,
        "original": "1256715_0_headimage.jpg",
        "thumb": "1256715_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256715",
        "order": "0",
        "created_at": "2017-10-08 16:47:33",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256715_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256715_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1256715", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256715", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256715", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256715", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256715", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256715", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256715", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256715", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256715", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256715", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256715", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256715", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256715", "feature_id": "49", "value": "130"}
    }, {
        "id": 51,
        "title": "Светящийся",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "979c441c-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256715", "feature_id": "51", "value": "Да"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256715", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256715", "feature_id": "58", "value": "A47FL"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1256715", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1256716,
    "group_id": "776",
    "new": "0",
    "sale": "0",
    "code": "EG-039SP#626E",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "16",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1751,
        "original": "1256716_0_headimage.jpg",
        "thumb": "1256716_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256716",
        "order": "0",
        "created_at": "2017-10-08 16:47:33",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256716_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256716_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1751,
        "original": "1256716_0_headimage.jpg",
        "thumb": "1256716_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256716",
        "order": "0",
        "created_at": "2017-10-08 16:47:33",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256716_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256716_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1256716", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256716", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256716", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256716", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256716", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256716", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256716", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256716", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256716", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256716", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256716", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256716", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256716", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256716", "feature_id": "58", "value": "626E"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1256716", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1256717,
    "group_id": "776",
    "new": "0",
    "sale": "0",
    "code": "EG-039SP#A133T",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "26",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1752,
        "original": "1256717_0_headimage.jpg",
        "thumb": "1256717_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256717",
        "order": "0",
        "created_at": "2017-10-08 16:47:34",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256717_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256717_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1752,
        "original": "1256717_0_headimage.jpg",
        "thumb": "1256717_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256717",
        "order": "0",
        "created_at": "2017-10-08 16:47:34",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256717_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256717_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1256717", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256717", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256717", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256717", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256717", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256717", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256717", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256717", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256717", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256717", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256717", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256717", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256717", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256717", "feature_id": "58", "value": "A133T"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1256717", "feature_id": "64", "value": "Минноу"}
    }]
}, {
    "id": 1256718,
    "group_id": "776",
    "new": "0",
    "sale": "0",
    "code": "EG-039SP#630V",
    "name": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "fullname": "Воблер Strike Pro Jer-O Minnow 130 нейтральный 13см 27,8гр Загл. 1,5м - 2,5м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:46",
    "updated_at": "2017-10-07 20:24:46",
    "logo": {
        "id": 1753,
        "original": "1256718_0_headimage.jpg",
        "thumb": "1256718_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256718",
        "order": "0",
        "created_at": "2017-10-08 16:47:34",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256718_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256718_0_headimage.jpg"
    },
    "head_images": [{
        "id": 1753,
        "original": "1256718_0_headimage.jpg",
        "thumb": "1256718_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256718",
        "order": "0",
        "created_at": "2017-10-08 16:47:34",
        "updated_at": "2017-10-11 21:53:17",
        "thumb_url": "http://cdn.strikepro.ru/article/1256718_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256718_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1256718", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256718", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256718", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1256718", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256718", "feature_id": "27", "value": "EG-039SP"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256718", "feature_id": "28", "value": "Jer-O Minnow 130"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1256718", "feature_id": "29", "value": "27,8"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256718", "feature_id": "34", "value": "2,5"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256718", "feature_id": "35", "value": "1,5"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1256718", "feature_id": "37", "value": "3"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256718", "feature_id": "46", "value": "Нейтральный"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256718", "feature_id": "49", "value": "130"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256718", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1256718", "feature_id": "58", "value": "630V"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1256718", "feature_id": "64", "value": "Минноу"}
    }]
}]

//# sourceMappingURL=productSlider.js.map
