$(document).ready(function () {
    var body = $("body");
    var defaultImage = 'http://cdn.strikepro.ru/default_group.png';
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

    /** @desc рендер списка вариантов артикла, принимает на вход массив */
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


    /** @desc рендер списка характеристик, принимает на вход массив */
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

    /** @desc рендер списка артиклей в слайдере */
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

    /** @desc рендер списка вариантов артикла, принимает на вход массив */
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

    /** @desc движение слайдера влево  */
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

    /** @desc движение слайдера вправо   */
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


    /** @desc инициализация галереи    */
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

    /** @desc инициализация слайдера */
    function initSlider(event) {
        sliderItem = [];
        (slideContainer).empty();
        $(galleryPhotoList).empty();
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].logo) {
                sliderItem.push(sliderItemRender(articles[i].logo.thumb_url, articles[i].id, articles[i]))
            } else {
                sliderItem.push(sliderItemRender(defaultImage, articles[i].id, articles[i]))
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


    /** @desc активация элемента списка по id артикла */
    function onActivePhoto(id) {
        initDescription(id);
        initPhotos(id);
        $(".slider__item").removeClass('active');
        $('[id = ' + id + ']').addClass('active');

        $(galleryMainPhoto).css({
            'transform': 'none'
        })
    }

    /** @desc инициализация списка харктеристик по id артикла */
    function initDescription(id) {
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                descriptionRender(articles[i].features);
            }
        }
    }

    /** @desc смена главного изображения по id артикла*/
    function initPhotos(id) {
        $(galleryPhotoList).empty();
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                initGalleryMainPhoto(articles[i].id);
                gelleryPhotoRender(articles[i].head_images);
            }
        }
    }

    /** @desc смена главного изображения по id артикла */
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
                console.log('articles[i]: ', articles[i]);
                if (articles[i].logo) {

                    $(galleryMainPhoto).append('<img src="' + articles[i].logo.original_url + '" alt="">');

                } else {
                    $(galleryMainPhoto).append('<img src="' + defaultImage + '" alt="">');

                }

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
                    colorTableItem.push(colorTableItemRender(articles[i].id, articles[i].logo.thumb_url ? articles[i].logo.thumb_url : defaultImage, articles[i]));
                } else {
                    colorTableItem.push(colorTableItemRender(articles[i].id, defaultImage, articles[i]));
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


    /** @desc ШАПКА СТРАНИЦЫ ПРОДУКТА */
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
    try {
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
    } catch (err) {
        throw new Error(err);

    }

});


var articles = [{
    "id": 1253518,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#RSO",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
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
    "created_at": "2017-10-07 20:24:16",
    "updated_at": "2017-12-11 15:24:42",
    "logo": {
        "id": 4567,
        "original": "1253518_0_headimage.jpg",
        "thumb": "1253518_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253518",
        "order": "0",
        "created_at": "2017-10-08 17:20:36",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253518_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253518_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4567,
        "original": "1253518_0_headimage.jpg",
        "thumb": "1253518_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253518",
        "order": "0",
        "created_at": "2017-10-08 17:20:36",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253518_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253518_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1253518", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253518", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253518", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253518", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253518", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253518", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253518", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253518", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253518", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253518", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253518", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253518", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253518", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253518", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253518", "feature_id": "58", "value": "RSO"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1253518", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253518", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253518", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1253519,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A43E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "9",
    "created_at": "2017-10-07 20:24:16",
    "updated_at": "2017-12-11 15:24:42",
    "logo": {
        "id": 4568,
        "original": "1253519_0_headimage.jpg",
        "thumb": "1253519_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253519",
        "order": "0",
        "created_at": "2017-10-08 17:20:37",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253519_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253519_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4568,
        "original": "1253519_0_headimage.jpg",
        "thumb": "1253519_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253519",
        "order": "0",
        "created_at": "2017-10-08 17:20:37",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253519_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253519_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1253519", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253519", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253519", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253519", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253519", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253519", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253519", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253519", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253519", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253519", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253519", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253519", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253519", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253519", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253519", "feature_id": "58", "value": "A43E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1253519", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253519", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253519", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1253520,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A010",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:42",
    "logo": {
        "id": 4569,
        "original": "1253520_0_headimage.jpg",
        "thumb": "1253520_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253520",
        "order": "0",
        "created_at": "2017-10-08 17:20:37",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253520_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253520_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4569,
        "original": "1253520_0_headimage.jpg",
        "thumb": "1253520_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253520",
        "order": "0",
        "created_at": "2017-10-08 17:20:37",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253520_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253520_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1253520", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253520", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253520", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253520", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253520", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253520", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253520", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253520", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253520", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253520", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253520", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253520", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253520", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253520", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253520", "feature_id": "58", "value": "A010"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1253520", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253520", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253520", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1253521,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A17",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4570,
        "original": "1253521_0_headimage.jpg",
        "thumb": "1253521_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253521",
        "order": "0",
        "created_at": "2017-10-08 17:20:38",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253521_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253521_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4570,
        "original": "1253521_0_headimage.jpg",
        "thumb": "1253521_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253521",
        "order": "0",
        "created_at": "2017-10-08 17:20:38",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253521_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253521_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1253521", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253521", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253521", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253521", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253521", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253521", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253521", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253521", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253521", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253521", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253521", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253521", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253521", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253521", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253521", "feature_id": "58", "value": "A17"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1253521", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253521", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253521", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1253522,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#R112",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "90",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4571,
        "original": "1253522_0_headimage.jpg",
        "thumb": "1253522_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253522",
        "order": "0",
        "created_at": "2017-10-08 17:20:38",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253522_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253522_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4571,
        "original": "1253522_0_headimage.jpg",
        "thumb": "1253522_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253522",
        "order": "0",
        "created_at": "2017-10-08 17:20:38",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253522_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253522_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1253522", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253522", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253522", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253522", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253522", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253522", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253522", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253522", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253522", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253522", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253522", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253522", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253522", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253522", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253522", "feature_id": "58", "value": "R112"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1253522", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253522", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253522", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1253526,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#177E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "79",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4572,
        "original": "1253526_0_headimage.jpg",
        "thumb": "1253526_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253526",
        "order": "0",
        "created_at": "2017-10-08 17:20:39",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253526_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253526_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4572,
        "original": "1253526_0_headimage.jpg",
        "thumb": "1253526_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253526",
        "order": "0",
        "created_at": "2017-10-08 17:20:39",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253526_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253526_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1253526", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253526", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253526", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253526", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253526", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253526", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253526", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253526", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253526", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253526", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253526", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253526", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253526", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253526", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253526", "feature_id": "58", "value": "177E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1253526", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253526", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253526", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1253528,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A45E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "112",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4573,
        "original": "1253528_0_headimage.jpg",
        "thumb": "1253528_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253528",
        "order": "0",
        "created_at": "2017-10-08 17:20:39",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253528_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253528_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4573,
        "original": "1253528_0_headimage.jpg",
        "thumb": "1253528_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253528",
        "order": "0",
        "created_at": "2017-10-08 17:20:39",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253528_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253528_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1253528", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253528", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253528", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253528", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253528", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253528", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253528", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253528", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253528", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253528", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253528", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253528", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253528", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253528", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253528", "feature_id": "58", "value": "A45E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1253528", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253528", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253528", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1253530,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A752E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": null,
    "head_images": [],
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
        "pivot": {"group_article_id": "1253530", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253530", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253530", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253530", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253530", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253530", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253530", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253530", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253530", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253530", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253530", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253530", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253530", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253530", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253530", "feature_id": "58", "value": "A752E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1253530", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253530", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253530", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1253531,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#746",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": null,
    "head_images": [],
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
        "pivot": {"group_article_id": "1253531", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253531", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253531", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253531", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253531", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253531", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253531", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253531", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253531", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253531", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253531", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253531", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253531", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253531", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253531", "feature_id": "58", "value": "746"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1253531", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253531", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253531", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1253532,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A44E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4574,
        "original": "1253532_0_headimage.jpg",
        "thumb": "1253532_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253532",
        "order": "0",
        "created_at": "2017-10-08 17:20:40",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253532_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253532_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4574,
        "original": "1253532_0_headimage.jpg",
        "thumb": "1253532_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253532",
        "order": "0",
        "created_at": "2017-10-08 17:20:40",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253532_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253532_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1253532", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253532", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253532", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253532", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253532", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253532", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253532", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253532", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253532", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253532", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253532", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253532", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253532", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253532", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253532", "feature_id": "58", "value": "A44E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1253532", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253532", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253532", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1253533,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A47FL",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. светящийся",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. светящийся",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:44",
    "logo": {
        "id": 4575,
        "original": "1253533_0_headimage.jpg",
        "thumb": "1253533_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253533",
        "order": "0",
        "created_at": "2017-10-08 17:20:40",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253533_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253533_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4575,
        "original": "1253533_0_headimage.jpg",
        "thumb": "1253533_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1253533",
        "order": "0",
        "created_at": "2017-10-08 17:20:40",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1253533_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1253533_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1253533", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253533", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253533", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253533", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253533", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253533", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253533", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1253533", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253533", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253533", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1253533", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253533", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253533", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253533", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1253533", "feature_id": "58", "value": "A47FL"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1253533", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253533", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1253533", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1254234,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#022PE",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4576,
        "original": "1254234_0_headimage.jpg",
        "thumb": "1254234_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1254234",
        "order": "0",
        "created_at": "2017-10-08 17:20:42",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1254234_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1254234_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4576,
        "original": "1254234_0_headimage.jpg",
        "thumb": "1254234_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1254234",
        "order": "0",
        "created_at": "2017-10-08 17:20:42",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1254234_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1254234_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1254234", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1254234", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1254234", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1254234", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1254234", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1254234", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1254234", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1254234", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1254234", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1254234", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1254234", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1254234", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1254234", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1254234", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1254234", "feature_id": "58", "value": "022PE"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1254234", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1254234", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1254234", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1255532,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A116L",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. светящийся",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. светящийся",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:44",
    "logo": {
        "id": 4577,
        "original": "1255532_0_headimage.jpg",
        "thumb": "1255532_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1255532",
        "order": "0",
        "created_at": "2017-10-08 17:20:42",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1255532_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1255532_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4577,
        "original": "1255532_0_headimage.jpg",
        "thumb": "1255532_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1255532",
        "order": "0",
        "created_at": "2017-10-08 17:20:42",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1255532_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1255532_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1255532", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1255532", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1255532", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1255532", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1255532", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1255532", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1255532", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1255532", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1255532", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1255532", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1255532", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1255532", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1255532", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1255532", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1255532", "feature_id": "58", "value": "A116L"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1255532", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1255532", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1255532", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1256187,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#496",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "9",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4578,
        "original": "1256187_0_headimage.jpg",
        "thumb": "1256187_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256187",
        "order": "0",
        "created_at": "2017-10-08 17:20:43",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256187_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256187_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4578,
        "original": "1256187_0_headimage.jpg",
        "thumb": "1256187_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256187",
        "order": "0",
        "created_at": "2017-10-08 17:20:43",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256187_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256187_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1256187", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256187", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256187", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256187", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256187", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256187", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256187", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256187", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256187", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256187", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256187", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256187", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256187", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256187", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256187", "feature_id": "58", "value": "496"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1256187", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256187", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256187", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1256188,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#531E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4579,
        "original": "1256188_0_headimage.jpg",
        "thumb": "1256188_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256188",
        "order": "0",
        "created_at": "2017-10-08 17:20:44",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256188_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256188_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4579,
        "original": "1256188_0_headimage.jpg",
        "thumb": "1256188_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256188",
        "order": "0",
        "created_at": "2017-10-08 17:20:44",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256188_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256188_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1256188", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256188", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256188", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256188", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256188", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256188", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256188", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256188", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256188", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256188", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256188", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256188", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256188", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256188", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256188", "feature_id": "58", "value": "531E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1256188", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256188", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256188", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1256189,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#613E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "229",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:44",
    "logo": {
        "id": 4580,
        "original": "1256189_0_headimage.jpg",
        "thumb": "1256189_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256189",
        "order": "0",
        "created_at": "2017-10-08 17:20:44",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256189_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256189_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4580,
        "original": "1256189_0_headimage.jpg",
        "thumb": "1256189_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256189",
        "order": "0",
        "created_at": "2017-10-08 17:20:44",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256189_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256189_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1256189", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256189", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256189", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256189", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256189", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256189", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256189", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256189", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256189", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256189", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256189", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256189", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256189", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256189", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256189", "feature_id": "58", "value": "613E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1256189", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256189", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256189", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1256190,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#626E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:44",
    "logo": {
        "id": 4581,
        "original": "1256190_0_headimage.jpg",
        "thumb": "1256190_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256190",
        "order": "0",
        "created_at": "2017-10-08 17:20:44",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256190_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256190_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4581,
        "original": "1256190_0_headimage.jpg",
        "thumb": "1256190_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256190",
        "order": "0",
        "created_at": "2017-10-08 17:20:44",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256190_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256190_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1256190", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256190", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256190", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256190", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256190", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256190", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256190", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256190", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256190", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256190", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256190", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256190", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256190", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256190", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256190", "feature_id": "58", "value": "626E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1256190", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256190", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256190", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1256191,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A09",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "106",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:44",
    "logo": {
        "id": 4582,
        "original": "1256191_0_headimage.jpg",
        "thumb": "1256191_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256191",
        "order": "0",
        "created_at": "2017-10-08 17:20:44",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256191_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256191_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4582,
        "original": "1256191_0_headimage.jpg",
        "thumb": "1256191_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256191",
        "order": "0",
        "created_at": "2017-10-08 17:20:44",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256191_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256191_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1256191", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256191", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256191", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256191", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256191", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256191", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256191", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256191", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256191", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256191", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256191", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256191", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256191", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256191", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256191", "feature_id": "58", "value": "A09"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1256191", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256191", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256191", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1256192,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A70E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "56",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:44",
    "logo": {
        "id": 4583,
        "original": "1256192_0_headimage.jpg",
        "thumb": "1256192_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256192",
        "order": "0",
        "created_at": "2017-10-08 17:20:45",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256192_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256192_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4583,
        "original": "1256192_0_headimage.jpg",
        "thumb": "1256192_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256192",
        "order": "0",
        "created_at": "2017-10-08 17:20:45",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256192_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256192_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1256192", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256192", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256192", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256192", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256192", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256192", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256192", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256192", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256192", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256192", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256192", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256192", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256192", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256192", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256192", "feature_id": "58", "value": "A70E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1256192", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256192", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256192", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1256193,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#X10E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "138",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:44",
    "logo": {
        "id": 4584,
        "original": "1256193_0_headimage.jpg",
        "thumb": "1256193_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256193",
        "order": "0",
        "created_at": "2017-10-08 17:20:45",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256193_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256193_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4584,
        "original": "1256193_0_headimage.jpg",
        "thumb": "1256193_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256193",
        "order": "0",
        "created_at": "2017-10-08 17:20:45",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256193_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256193_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1256193", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256193", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256193", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256193", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256193", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256193", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256193", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256193", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256193", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256193", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256193", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256193", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256193", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256193", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256193", "feature_id": "58", "value": "X10E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1256193", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256193", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256193", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1256338,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A139",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "171",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4585,
        "original": "1256338_0_headimage.jpg",
        "thumb": "1256338_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256338",
        "order": "0",
        "created_at": "2017-10-08 17:20:45",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256338_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256338_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4585,
        "original": "1256338_0_headimage.jpg",
        "thumb": "1256338_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256338",
        "order": "0",
        "created_at": "2017-10-08 17:20:45",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1256338_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256338_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1256338", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256338", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256338", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256338", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256338", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256338", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256338", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1256338", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256338", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256338", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1256338", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256338", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256338", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256338", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1256338", "feature_id": "58", "value": "A139"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1256338", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256338", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1256338", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1257515,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#C026F",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр.",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "12",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4586,
        "original": "1257515_0_headimage.jpg",
        "thumb": "1257515_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257515",
        "order": "0",
        "created_at": "2017-10-08 17:20:46",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1257515_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257515_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4586,
        "original": "1257515_0_headimage.jpg",
        "thumb": "1257515_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257515",
        "order": "0",
        "created_at": "2017-10-08 17:20:46",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1257515_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257515_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1257515", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257515", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257515", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257515", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257515", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257515", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257515", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257515", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257515", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257515", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257515", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257515", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257515", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257515", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257515", "feature_id": "58", "value": "C026F"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1257515", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1257515", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1257515", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1257516,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A05",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "59",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:44",
    "logo": {
        "id": 4587,
        "original": "1257516_0_headimage.jpg",
        "thumb": "1257516_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257516",
        "order": "0",
        "created_at": "2017-10-08 17:20:46",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1257516_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257516_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4587,
        "original": "1257516_0_headimage.jpg",
        "thumb": "1257516_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257516",
        "order": "0",
        "created_at": "2017-10-08 17:20:46",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1257516_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257516_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1257516", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257516", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257516", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257516", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257516", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257516", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257516", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257516", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257516", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257516", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257516", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257516", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257516", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257516", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257516", "feature_id": "58", "value": "A05"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1257516", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1257516", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1257516", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1257517,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#513E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с прозрачным хвостом",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:44",
    "logo": {
        "id": 4588,
        "original": "1257517_0_headimage.jpg",
        "thumb": "1257517_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257517",
        "order": "0",
        "created_at": "2017-10-08 17:20:46",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1257517_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257517_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4588,
        "original": "1257517_0_headimage.jpg",
        "thumb": "1257517_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257517",
        "order": "0",
        "created_at": "2017-10-08 17:20:46",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1257517_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257517_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1257517", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257517", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257517", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257517", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257517", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257517", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257517", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257517", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257517", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257517", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257517", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257517", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257517", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257517", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257517", "feature_id": "58", "value": "513E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1257517", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1257517", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1257517", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1257518,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A133E",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с желтым хвостом",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с желтым хвостом",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "14",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4589,
        "original": "1257518_0_headimage.jpg",
        "thumb": "1257518_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257518",
        "order": "0",
        "created_at": "2017-10-08 17:20:47",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1257518_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257518_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4589,
        "original": "1257518_0_headimage.jpg",
        "thumb": "1257518_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257518",
        "order": "0",
        "created_at": "2017-10-08 17:20:47",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1257518_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257518_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1257518", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257518", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257518", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257518", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257518", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257518", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257518", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1257518", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257518", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257518", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1257518", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257518", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257518", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257518", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1257518", "feature_id": "58", "value": "A133E"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1257518", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1257518", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1257518", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1258409,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A172FL",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. светящийся",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. светящийся",
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
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:44",
    "logo": {
        "id": 4590,
        "original": "1258409_0_headimage.jpg",
        "thumb": "1258409_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258409",
        "order": "0",
        "created_at": "2017-10-08 17:20:48",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1258409_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258409_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4590,
        "original": "1258409_0_headimage.jpg",
        "thumb": "1258409_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258409",
        "order": "0",
        "created_at": "2017-10-08 17:20:48",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1258409_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258409_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1258409", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1258409", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1258409", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1258409", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1258409", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1258409", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1258409", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1258409", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1258409", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1258409", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1258409", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1258409", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1258409", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1258409", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1258409", "feature_id": "58", "value": "A172FL"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1258409", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1258409", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1258409", "feature_id": "69", "value": "Да"}
    }]
}, {
    "id": 1259041,
    "group_id": "1051",
    "new": "0",
    "sale": "0",
    "code": "IF-013#A178S",
    "name": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с желтым хвостом",
    "fullname": "Балансир Strike Pro Ice Baby 25  2,5см. 4гр. с желтым хвостом",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "54",
    "created_at": "2017-10-07 20:24:17",
    "updated_at": "2017-12-11 15:24:43",
    "logo": {
        "id": 4591,
        "original": "1259041_0_headimage.jpg",
        "thumb": "1259041_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1259041",
        "order": "0",
        "created_at": "2017-10-08 17:20:49",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1259041_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1259041_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4591,
        "original": "1259041_0_headimage.jpg",
        "thumb": "1259041_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1259041",
        "order": "0",
        "created_at": "2017-10-08 17:20:49",
        "updated_at": "2017-10-11 21:53:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1259041_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1259041_0_headimage.jpg"
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
        "pivot": {"group_article_id": "1259041", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1259041", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1259041", "feature_id": "20", "value": "Зима"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1259041", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 24,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1259041", "feature_id": "24", "value": "Да"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1259041", "feature_id": "27", "value": "IF-013"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "0",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1259041", "feature_id": "28", "value": "Ice Baby 25"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:32",
        "pivot": {"group_article_id": "1259041", "feature_id": "29", "value": "4"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1259041", "feature_id": "37", "value": "3"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "0",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1259041", "feature_id": "43", "value": "3"}
    }, {
        "id": 44,
        "title": "Номер крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "d876e43b-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:33",
        "pivot": {"group_article_id": "1259041", "feature_id": "44", "value": "16"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1259041", "feature_id": "48", "value": "OWNER"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1259041", "feature_id": "49", "value": "25"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1259041", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:34",
        "pivot": {"group_article_id": "1259041", "feature_id": "58", "value": "A178S"}
    }, {
        "id": 67,
        "title": "Размер с хвостом",
        "measurement": "мм",
        "description": "",
        "is_filter": "0",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "bf66bd1c-f1e0-11e6-b592-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-12-11 15:22:35",
        "pivot": {"group_article_id": "1259041", "feature_id": "67", "value": "35"}
    }, {
        "id": 68,
        "title": "Отображать в каталоге",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "8588e450-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1259041", "feature_id": "68", "value": "Да"}
    }, {
        "id": 69,
        "title": "Отображать в личном кабинете",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "ae6945fc-ac4d-11e7-80f9-0cc47adab01d",
        "created_at": "2017-10-29 18:20:49",
        "updated_at": "2017-12-11 15:22:31",
        "pivot": {"group_article_id": "1259041", "feature_id": "69", "value": "Да"}
    }]
}]