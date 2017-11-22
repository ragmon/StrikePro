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
            w = screen.width;

        if (w < 500) {
            $(productStand).height($(productStand).width() / k);
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
            arrowMarkup: '<button title="%title%" type="button" class="product-gallery_arrow product-gallery_arrow-%dir%"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg_arrow" class="arrow"></use></svg></button>', // markup of an arrow button
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
    "id": 1250116,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#A53",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:17:11",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4742,
        "original": "1250116_0_headimage.jpg",
        "thumb": "1250116_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1250116",
        "order": "0",
        "created_at": "2017-10-30 02:09:27",
        "updated_at": "2017-10-30 02:09:27",
        "thumb_url": "http://cdn.strikepro.ru/article/1250116_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1250116_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4742,
        "original": "1250116_0_headimage.jpg",
        "thumb": "1250116_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1250116",
        "order": "0",
        "created_at": "2017-10-30 02:09:27",
        "updated_at": "2017-10-30 02:09:27",
        "thumb_url": "http://cdn.strikepro.ru/article/1250116_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1250116_0_headimage.jpg"
    }, {
        "id": 7331,
        "original": "1250116_1_headimage.jpg",
        "thumb": "1250116_1_headimage_thumbnail.jpg",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1250116",
        "order": "1",
        "created_at": "2017-11-04 14:18:31",
        "updated_at": "2017-11-04 14:18:31",
        "thumb_url": "http://cdn.strikepro.ru/article/1250116_1_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1250116_1_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1250116", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1250116", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1250116", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1250116", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1250116", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1250116", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1250116", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1250116", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1250116", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1250116", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1250116", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1250116", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1250116", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1250116", "feature_id": "60", "value": "A53"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1250116", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1251694,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#A010",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:17:26",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4743,
        "original": "1251694_0_headimage.jpg",
        "thumb": "1251694_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1251694",
        "order": "0",
        "created_at": "2017-10-30 02:09:28",
        "updated_at": "2017-10-30 02:09:28",
        "thumb_url": "http://cdn.strikepro.ru/article/1251694_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1251694_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4743,
        "original": "1251694_0_headimage.jpg",
        "thumb": "1251694_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1251694",
        "order": "0",
        "created_at": "2017-10-30 02:09:28",
        "updated_at": "2017-10-30 02:09:28",
        "thumb_url": "http://cdn.strikepro.ru/article/1251694_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1251694_0_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1251694", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1251694", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1251694", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1251694", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1251694", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1251694", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1251694", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1251694", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1251694", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1251694", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1251694", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1251694", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1251694", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1251694", "feature_id": "60", "value": "A010"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1251694", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1251700,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#A05",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:17:26",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4744,
        "original": "1251700_0_headimage.jpg",
        "thumb": "1251700_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1251700",
        "order": "0",
        "created_at": "2017-10-30 02:09:30",
        "updated_at": "2017-10-30 02:09:30",
        "thumb_url": "http://cdn.strikepro.ru/article/1251700_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1251700_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4744,
        "original": "1251700_0_headimage.jpg",
        "thumb": "1251700_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1251700",
        "order": "0",
        "created_at": "2017-10-30 02:09:30",
        "updated_at": "2017-10-30 02:09:30",
        "thumb_url": "http://cdn.strikepro.ru/article/1251700_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1251700_0_headimage.jpg"
    }, {
        "id": 7332,
        "original": "1251700_1_headimage.png",
        "thumb": "1251700_1_headimage_thumbnail.png",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1251700",
        "order": "1",
        "created_at": "2017-11-04 14:18:32",
        "updated_at": "2017-11-04 14:18:32",
        "thumb_url": "http://cdn.strikepro.ru/article/1251700_1_headimage_thumbnail.png",
        "original_url": "http://cdn.strikepro.ru/article/1251700_1_headimage.png"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1251700", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1251700", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1251700", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1251700", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1251700", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1251700", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1251700", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1251700", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1251700", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1251700", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1251700", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1251700", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1251700", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1251700", "feature_id": "60", "value": "A05"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1251700", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1252128,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#A17",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "35",
    "created_at": "2017-10-29 22:17:32",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4745,
        "original": "1252128_0_headimage.jpg",
        "thumb": "1252128_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1252128",
        "order": "0",
        "created_at": "2017-10-30 02:09:31",
        "updated_at": "2017-10-30 02:09:31",
        "thumb_url": "http://cdn.strikepro.ru/article/1252128_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1252128_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4745,
        "original": "1252128_0_headimage.jpg",
        "thumb": "1252128_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1252128",
        "order": "0",
        "created_at": "2017-10-30 02:09:31",
        "updated_at": "2017-10-30 02:09:31",
        "thumb_url": "http://cdn.strikepro.ru/article/1252128_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1252128_0_headimage.jpg"
    }, {
        "id": 7333,
        "original": "1252128_1_headimage.jpg",
        "thumb": "1252128_1_headimage_thumbnail.jpg",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1252128",
        "order": "1",
        "created_at": "2017-11-04 14:18:32",
        "updated_at": "2017-11-04 14:18:32",
        "thumb_url": "http://cdn.strikepro.ru/article/1252128_1_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1252128_1_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1252128", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1252128", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1252128", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1252128", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1252128", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1252128", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1252128", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1252128", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1252128", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1252128", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1252128", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1252128", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1252128", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1252128", "feature_id": "60", "value": "A17"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1252128", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1256441,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#612T",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:19:24",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4746,
        "original": "1256441_0_headimage.jpg",
        "thumb": "1256441_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256441",
        "order": "0",
        "created_at": "2017-10-30 02:09:32",
        "updated_at": "2017-10-30 02:09:32",
        "thumb_url": "http://cdn.strikepro.ru/article/1256441_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256441_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4746,
        "original": "1256441_0_headimage.jpg",
        "thumb": "1256441_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256441",
        "order": "0",
        "created_at": "2017-10-30 02:09:32",
        "updated_at": "2017-10-30 02:09:32",
        "thumb_url": "http://cdn.strikepro.ru/article/1256441_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256441_0_headimage.jpg"
    }, {
        "id": 7334,
        "original": "1256441_1_headimage.png",
        "thumb": "1256441_1_headimage_thumbnail.png",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256441",
        "order": "1",
        "created_at": "2017-11-04 14:18:33",
        "updated_at": "2017-11-04 14:18:33",
        "thumb_url": "http://cdn.strikepro.ru/article/1256441_1_headimage_thumbnail.png",
        "original_url": "http://cdn.strikepro.ru/article/1256441_1_headimage.png"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1256441", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256441", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256441", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256441", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256441", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256441", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256441", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256441", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256441", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256441", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256441", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256441", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256441", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256441", "feature_id": "60", "value": "612T"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1256441", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1256442,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#620T",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "7",
    "created_at": "2017-10-29 22:19:24",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4747,
        "original": "1256442_0_headimage.jpg",
        "thumb": "1256442_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256442",
        "order": "0",
        "created_at": "2017-10-30 02:09:34",
        "updated_at": "2017-10-30 02:09:34",
        "thumb_url": "http://cdn.strikepro.ru/article/1256442_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256442_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4747,
        "original": "1256442_0_headimage.jpg",
        "thumb": "1256442_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256442",
        "order": "0",
        "created_at": "2017-10-30 02:09:34",
        "updated_at": "2017-10-30 02:09:34",
        "thumb_url": "http://cdn.strikepro.ru/article/1256442_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256442_0_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1256442", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256442", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256442", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256442", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256442", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256442", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256442", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256442", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256442", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256442", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256442", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256442", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256442", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256442", "feature_id": "60", "value": "620T"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1256442", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1256443,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#626E",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:19:24",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4748,
        "original": "1256443_0_headimage.jpg",
        "thumb": "1256443_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256443",
        "order": "0",
        "created_at": "2017-10-30 02:09:35",
        "updated_at": "2017-10-30 02:09:35",
        "thumb_url": "http://cdn.strikepro.ru/article/1256443_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256443_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4748,
        "original": "1256443_0_headimage.jpg",
        "thumb": "1256443_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256443",
        "order": "0",
        "created_at": "2017-10-30 02:09:35",
        "updated_at": "2017-10-30 02:09:35",
        "thumb_url": "http://cdn.strikepro.ru/article/1256443_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256443_0_headimage.jpg"
    }, {
        "id": 7335,
        "original": "1256443_1_headimage.png",
        "thumb": "1256443_1_headimage_thumbnail.png",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256443",
        "order": "1",
        "created_at": "2017-11-04 14:18:33",
        "updated_at": "2017-11-04 14:18:33",
        "thumb_url": "http://cdn.strikepro.ru/article/1256443_1_headimage_thumbnail.png",
        "original_url": "http://cdn.strikepro.ru/article/1256443_1_headimage.png"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1256443", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256443", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256443", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256443", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256443", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256443", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256443", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256443", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256443", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256443", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256443", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256443", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256443", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256443", "feature_id": "60", "value": "626E"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1256443", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1256444,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#A68G",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:19:24",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4749,
        "original": "1256444_0_headimage.jpg",
        "thumb": "1256444_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256444",
        "order": "0",
        "created_at": "2017-10-30 02:09:36",
        "updated_at": "2017-10-30 02:09:36",
        "thumb_url": "http://cdn.strikepro.ru/article/1256444_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256444_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4749,
        "original": "1256444_0_headimage.jpg",
        "thumb": "1256444_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256444",
        "order": "0",
        "created_at": "2017-10-30 02:09:36",
        "updated_at": "2017-10-30 02:09:36",
        "thumb_url": "http://cdn.strikepro.ru/article/1256444_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256444_0_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1256444", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256444", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256444", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256444", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256444", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256444", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256444", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256444", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256444", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256444", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256444", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256444", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256444", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256444", "feature_id": "60", "value": "A68G"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1256444", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1256445,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#A70-713",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:19:24",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4750,
        "original": "1256445_0_headimage.jpg",
        "thumb": "1256445_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256445",
        "order": "0",
        "created_at": "2017-10-30 02:09:38",
        "updated_at": "2017-10-30 02:09:38",
        "thumb_url": "http://cdn.strikepro.ru/article/1256445_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256445_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4750,
        "original": "1256445_0_headimage.jpg",
        "thumb": "1256445_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256445",
        "order": "0",
        "created_at": "2017-10-30 02:09:38",
        "updated_at": "2017-10-30 02:09:38",
        "thumb_url": "http://cdn.strikepro.ru/article/1256445_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256445_0_headimage.jpg"
    }, {
        "id": 7336,
        "original": "1256445_1_headimage.png",
        "thumb": "1256445_1_headimage_thumbnail.png",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256445",
        "order": "1",
        "created_at": "2017-11-04 14:18:34",
        "updated_at": "2017-11-04 14:18:34",
        "thumb_url": "http://cdn.strikepro.ru/article/1256445_1_headimage_thumbnail.png",
        "original_url": "http://cdn.strikepro.ru/article/1256445_1_headimage.png"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1256445", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256445", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256445", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256445", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256445", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256445", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256445", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256445", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256445", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256445", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256445", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256445", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256445", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256445", "feature_id": "60", "value": "A70-713"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1256445", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1256446,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#X10",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:19:25",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4751,
        "original": "1256446_0_headimage.jpg",
        "thumb": "1256446_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256446",
        "order": "0",
        "created_at": "2017-10-30 02:09:39",
        "updated_at": "2017-10-30 02:09:39",
        "thumb_url": "http://cdn.strikepro.ru/article/1256446_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256446_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4751,
        "original": "1256446_0_headimage.jpg",
        "thumb": "1256446_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1256446",
        "order": "0",
        "created_at": "2017-10-30 02:09:39",
        "updated_at": "2017-10-30 02:09:39",
        "thumb_url": "http://cdn.strikepro.ru/article/1256446_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1256446_0_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1256446", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256446", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256446", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256446", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256446", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1256446", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256446", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256446", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1256446", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256446", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1256446", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256446", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256446", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1256446", "feature_id": "60", "value": "X10"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1256446", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1257145,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#A142-264",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:19:55",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4752,
        "original": "1257145_0_headimage.jpg",
        "thumb": "1257145_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257145",
        "order": "0",
        "created_at": "2017-10-30 02:09:41",
        "updated_at": "2017-10-30 02:09:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1257145_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257145_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4752,
        "original": "1257145_0_headimage.jpg",
        "thumb": "1257145_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257145",
        "order": "0",
        "created_at": "2017-10-30 02:09:41",
        "updated_at": "2017-10-30 02:09:41",
        "thumb_url": "http://cdn.strikepro.ru/article/1257145_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257145_0_headimage.jpg"
    }, {
        "id": 7337,
        "original": "1257145_1_headimage.png",
        "thumb": "1257145_1_headimage_thumbnail.png",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257145",
        "order": "1",
        "created_at": "2017-11-04 14:18:34",
        "updated_at": "2017-11-04 14:18:34",
        "thumb_url": "http://cdn.strikepro.ru/article/1257145_1_headimage_thumbnail.png",
        "original_url": "http://cdn.strikepro.ru/article/1257145_1_headimage.png"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1257145", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257145", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257145", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257145", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257145", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257145", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257145", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257145", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257145", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257145", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257145", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257145", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257145", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257145", "feature_id": "60", "value": "A142-264"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1257145", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1257383,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#630V",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:20:04",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4754,
        "original": "1257383_0_headimage.jpg",
        "thumb": "1257383_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257383",
        "order": "0",
        "created_at": "2017-10-30 02:09:43",
        "updated_at": "2017-10-30 02:09:43",
        "thumb_url": "http://cdn.strikepro.ru/article/1257383_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257383_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4754,
        "original": "1257383_0_headimage.jpg",
        "thumb": "1257383_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257383",
        "order": "0",
        "created_at": "2017-10-30 02:09:43",
        "updated_at": "2017-10-30 02:09:43",
        "thumb_url": "http://cdn.strikepro.ru/article/1257383_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257383_0_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1257383", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257383", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257383", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257383", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257383", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257383", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257383", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257383", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257383", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257383", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257383", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257383", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257383", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257383", "feature_id": "60", "value": "630V"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1257383", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1257386,
    "group_id": "794",
    "new": "0",
    "sale": "1",
    "code": "JL-119F#A140E",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "51",
    "created_at": "2017-10-29 22:20:05",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4757,
        "original": "1257386_0_headimage.jpg",
        "thumb": "1257386_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257386",
        "order": "0",
        "created_at": "2017-10-30 02:09:48",
        "updated_at": "2017-10-30 02:09:48",
        "thumb_url": "http://cdn.strikepro.ru/article/1257386_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257386_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4757,
        "original": "1257386_0_headimage.jpg",
        "thumb": "1257386_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257386",
        "order": "0",
        "created_at": "2017-10-30 02:09:48",
        "updated_at": "2017-10-30 02:09:48",
        "thumb_url": "http://cdn.strikepro.ru/article/1257386_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257386_0_headimage.jpg"
    }, {
        "id": 7338,
        "original": "1257386_1_headimage.jpg",
        "thumb": "1257386_1_headimage_thumbnail.jpg",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257386",
        "order": "1",
        "created_at": "2017-11-04 14:18:35",
        "updated_at": "2017-11-04 14:18:35",
        "thumb_url": "http://cdn.strikepro.ru/article/1257386_1_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257386_1_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1257386", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257386", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257386", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257386", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 26,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257386", "feature_id": "26", "value": "Да"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257386", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257386", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257386", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257386", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257386", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257386", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257386", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257386", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257386", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257386", "feature_id": "60", "value": "A140E"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1257386", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1257387,
    "group_id": "794",
    "new": "0",
    "sale": "1",
    "code": "JL-119F#SM37F",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "24",
    "created_at": "2017-10-29 22:20:05",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4758,
        "original": "1257387_0_headimage.jpg",
        "thumb": "1257387_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257387",
        "order": "0",
        "created_at": "2017-10-30 02:09:49",
        "updated_at": "2017-10-30 02:09:49",
        "thumb_url": "http://cdn.strikepro.ru/article/1257387_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257387_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4758,
        "original": "1257387_0_headimage.jpg",
        "thumb": "1257387_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257387",
        "order": "0",
        "created_at": "2017-10-30 02:09:49",
        "updated_at": "2017-10-30 02:09:49",
        "thumb_url": "http://cdn.strikepro.ru/article/1257387_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257387_0_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1257387", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257387", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257387", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257387", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 26,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257387", "feature_id": "26", "value": "Да"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257387", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257387", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257387", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257387", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257387", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257387", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257387", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257387", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257387", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257387", "feature_id": "60", "value": "SM37F"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1257387", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1257388,
    "group_id": "794",
    "new": "0",
    "sale": "1",
    "code": "JL-119F#SM51F",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "40",
    "created_at": "2017-10-29 22:20:05",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4759,
        "original": "1257388_0_headimage.jpg",
        "thumb": "1257388_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257388",
        "order": "0",
        "created_at": "2017-10-30 02:09:51",
        "updated_at": "2017-10-30 02:09:51",
        "thumb_url": "http://cdn.strikepro.ru/article/1257388_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257388_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4759,
        "original": "1257388_0_headimage.jpg",
        "thumb": "1257388_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257388",
        "order": "0",
        "created_at": "2017-10-30 02:09:51",
        "updated_at": "2017-10-30 02:09:51",
        "thumb_url": "http://cdn.strikepro.ru/article/1257388_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257388_0_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1257388", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257388", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257388", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257388", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 26,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257388", "feature_id": "26", "value": "Да"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257388", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257388", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257388", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257388", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257388", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257388", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257388", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257388", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257388", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257388", "feature_id": "60", "value": "SM51F"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1257388", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1257446,
    "group_id": "794",
    "new": "0",
    "sale": "1",
    "code": "JL-119F#A141",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "50",
    "created_at": "2017-10-29 22:20:08",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4760,
        "original": "1257446_0_headimage.jpg",
        "thumb": "1257446_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257446",
        "order": "0",
        "created_at": "2017-10-30 02:09:52",
        "updated_at": "2017-10-30 02:09:52",
        "thumb_url": "http://cdn.strikepro.ru/article/1257446_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257446_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4760,
        "original": "1257446_0_headimage.jpg",
        "thumb": "1257446_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257446",
        "order": "0",
        "created_at": "2017-10-30 02:09:52",
        "updated_at": "2017-10-30 02:09:52",
        "thumb_url": "http://cdn.strikepro.ru/article/1257446_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257446_0_headimage.jpg"
    }, {
        "id": 7339,
        "original": "1257446_1_headimage.jpg",
        "thumb": "1257446_1_headimage_thumbnail.jpg",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257446",
        "order": "1",
        "created_at": "2017-11-04 14:18:35",
        "updated_at": "2017-11-04 14:18:35",
        "thumb_url": "http://cdn.strikepro.ru/article/1257446_1_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257446_1_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1257446", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257446", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257446", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257446", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 26,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257446", "feature_id": "26", "value": "Да"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257446", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257446", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257446", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257446", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257446", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257446", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257446", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257446", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257446", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257446", "feature_id": "60", "value": "A141"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1257446", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1257778,
    "group_id": "794",
    "new": "0",
    "sale": "1",
    "code": "JL-119F#71",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "80",
    "created_at": "2017-10-29 22:20:28",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4762,
        "original": "1257778_0_headimage.jpg",
        "thumb": "1257778_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257778",
        "order": "0",
        "created_at": "2017-10-30 02:09:55",
        "updated_at": "2017-10-30 02:09:55",
        "thumb_url": "http://cdn.strikepro.ru/article/1257778_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257778_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4762,
        "original": "1257778_0_headimage.jpg",
        "thumb": "1257778_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257778",
        "order": "0",
        "created_at": "2017-10-30 02:09:55",
        "updated_at": "2017-10-30 02:09:55",
        "thumb_url": "http://cdn.strikepro.ru/article/1257778_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257778_0_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1257778", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257778", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257778", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257778", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 26,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257778", "feature_id": "26", "value": "Да"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257778", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1257778", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257778", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257778", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1257778", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257778", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1257778", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257778", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257778", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1257778", "feature_id": "60", "value": "71"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1257778", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1258071,
    "group_id": "794",
    "new": "0",
    "sale": "1",
    "code": "JL-119F#513-713",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "61",
    "created_at": "2017-10-29 22:20:46",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4763,
        "original": "1258071_0_headimage.jpg",
        "thumb": "1258071_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258071",
        "order": "0",
        "created_at": "2017-10-30 02:09:56",
        "updated_at": "2017-10-30 02:09:56",
        "thumb_url": "http://cdn.strikepro.ru/article/1258071_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258071_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4763,
        "original": "1258071_0_headimage.jpg",
        "thumb": "1258071_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258071",
        "order": "0",
        "created_at": "2017-10-30 02:09:56",
        "updated_at": "2017-10-30 02:09:56",
        "thumb_url": "http://cdn.strikepro.ru/article/1258071_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258071_0_headimage.jpg"
    }, {
        "id": 7340,
        "original": "1258071_1_headimage.jpg",
        "thumb": "1258071_1_headimage_thumbnail.jpg",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258071",
        "order": "1",
        "created_at": "2017-11-04 14:18:36",
        "updated_at": "2017-11-04 14:18:36",
        "thumb_url": "http://cdn.strikepro.ru/article/1258071_1_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258071_1_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1258071", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258071", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258071", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258071", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 26,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258071", "feature_id": "26", "value": "Да"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258071", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258071", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258071", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258071", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258071", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258071", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258071", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258071", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258071", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258071", "feature_id": "60", "value": "513-713"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1258071", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1258072,
    "group_id": "794",
    "new": "0",
    "sale": "1",
    "code": "JL-119F#A172FL",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м Fluo",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м Fluo",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "97",
    "created_at": "2017-10-29 22:20:46",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4764,
        "original": "1258072_0_headimage.jpg",
        "thumb": "1258072_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258072",
        "order": "0",
        "created_at": "2017-10-30 02:09:57",
        "updated_at": "2017-10-30 02:09:57",
        "thumb_url": "http://cdn.strikepro.ru/article/1258072_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258072_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4764,
        "original": "1258072_0_headimage.jpg",
        "thumb": "1258072_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258072",
        "order": "0",
        "created_at": "2017-10-30 02:09:57",
        "updated_at": "2017-10-30 02:09:57",
        "thumb_url": "http://cdn.strikepro.ru/article/1258072_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258072_0_headimage.jpg"
    }, {
        "id": 7341,
        "original": "1258072_1_headimage.jpg",
        "thumb": "1258072_1_headimage_thumbnail.jpg",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258072",
        "order": "1",
        "created_at": "2017-11-04 14:18:36",
        "updated_at": "2017-11-04 14:18:36",
        "thumb_url": "http://cdn.strikepro.ru/article/1258072_1_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258072_1_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1258072", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258072", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258072", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258072", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 26,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258072", "feature_id": "26", "value": "Да"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258072", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258072", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258072", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258072", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258072", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258072", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258072", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258072", "feature_id": "51", "value": "75"}
    }, {
        "id": 53,
        "title": "Светящийся",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "979c441c-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258072", "feature_id": "53", "value": "Да"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258072", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258072", "feature_id": "60", "value": "A172FL"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1258072", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1258244,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#022P-713",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:20:55",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4765,
        "original": "1258244_0_headimage.jpg",
        "thumb": "1258244_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258244",
        "order": "0",
        "created_at": "2017-10-30 02:09:59",
        "updated_at": "2017-10-30 02:09:59",
        "thumb_url": "http://cdn.strikepro.ru/article/1258244_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258244_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4765,
        "original": "1258244_0_headimage.jpg",
        "thumb": "1258244_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258244",
        "order": "0",
        "created_at": "2017-10-30 02:09:59",
        "updated_at": "2017-10-30 02:09:59",
        "thumb_url": "http://cdn.strikepro.ru/article/1258244_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258244_0_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1258244", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258244", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258244", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258244", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258244", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258244", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258244", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258244", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258244", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258244", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258244", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258244", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258244", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258244", "feature_id": "60", "value": "022P-713"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1258244", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1258296,
    "group_id": "794",
    "new": "0",
    "sale": "1",
    "code": "JL-119F#A174FW",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "90",
    "created_at": "2017-10-29 22:20:59",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4766,
        "original": "1258296_0_headimage.jpg",
        "thumb": "1258296_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258296",
        "order": "0",
        "created_at": "2017-10-30 02:10:00",
        "updated_at": "2017-10-30 02:10:00",
        "thumb_url": "http://cdn.strikepro.ru/article/1258296_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258296_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4766,
        "original": "1258296_0_headimage.jpg",
        "thumb": "1258296_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258296",
        "order": "0",
        "created_at": "2017-10-30 02:10:00",
        "updated_at": "2017-10-30 02:10:00",
        "thumb_url": "http://cdn.strikepro.ru/article/1258296_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258296_0_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1258296", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258296", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258296", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258296", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 26,
        "title": "Распродажа",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258296", "feature_id": "26", "value": "Да"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258296", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258296", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258296", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258296", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258296", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258296", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258296", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258296", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258296", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258296", "feature_id": "60", "value": "A174FW"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1258296", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1258740,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#A178S",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:21:23",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4767,
        "original": "1258740_0_headimage.jpg",
        "thumb": "1258740_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258740",
        "order": "0",
        "created_at": "2017-10-30 02:10:02",
        "updated_at": "2017-10-30 02:10:02",
        "thumb_url": "http://cdn.strikepro.ru/article/1258740_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258740_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4767,
        "original": "1258740_0_headimage.jpg",
        "thumb": "1258740_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258740",
        "order": "0",
        "created_at": "2017-10-30 02:10:02",
        "updated_at": "2017-10-30 02:10:02",
        "thumb_url": "http://cdn.strikepro.ru/article/1258740_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258740_0_headimage.jpg"
    }, {
        "id": 7342,
        "original": "1258740_1_headimage.jpg",
        "thumb": "1258740_1_headimage_thumbnail.jpg",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258740",
        "order": "1",
        "created_at": "2017-11-04 14:18:37",
        "updated_at": "2017-11-04 14:18:37",
        "thumb_url": "http://cdn.strikepro.ru/article/1258740_1_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258740_1_headimage.jpg"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1258740", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258740", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258740", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258740", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258740", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258740", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258740", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258740", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258740", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258740", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258740", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258740", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258740", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258740", "feature_id": "60", "value": "A178S"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1258740", "feature_id": "66", "value": "Минноу"}
    }]
}, {
    "id": 1258741,
    "group_id": "794",
    "new": "0",
    "sale": "0",
    "code": "JL-119F#AR152G",
    "name": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "fullname": "Воблер Strike Pro Arc Minnow 75 плавающий 7,5см 4,5гр Загл. 0,4м - 0,8м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "7",
    "in_stock": "0",
    "created_at": "2017-10-29 22:21:23",
    "updated_at": "2017-11-08 17:00:54",
    "logo": {
        "id": 4768,
        "original": "1258741_0_headimage.jpg",
        "thumb": "1258741_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258741",
        "order": "0",
        "created_at": "2017-10-30 02:10:03",
        "updated_at": "2017-10-30 02:10:03",
        "thumb_url": "http://cdn.strikepro.ru/article/1258741_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258741_0_headimage.jpg"
    },
    "head_images": [{
        "id": 4768,
        "original": "1258741_0_headimage.jpg",
        "thumb": "1258741_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258741",
        "order": "0",
        "created_at": "2017-10-30 02:10:03",
        "updated_at": "2017-10-30 02:10:03",
        "thumb_url": "http://cdn.strikepro.ru/article/1258741_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258741_0_headimage.jpg"
    }, {
        "id": 7343,
        "original": "1258741_1_headimage.png",
        "thumb": "1258741_1_headimage_thumbnail.png",
        "title": "",
        "primary": "0",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258741",
        "order": "1",
        "created_at": "2017-11-04 14:18:37",
        "updated_at": "2017-11-04 14:18:37",
        "thumb_url": "http://cdn.strikepro.ru/article/1258741_1_headimage_thumbnail.png",
        "original_url": "http://cdn.strikepro.ru/article/1258741_1_headimage.png"
    }],
    "features": [{
        "id": 16,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "1",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-29 21:58:50",
        "updated_at": "2017-10-29 21:58:50",
        "pivot": {"group_article_id": "1258741", "feature_id": "16", "value": "Да"}
    }, {
        "id": 21,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258741", "feature_id": "21", "value": "ТАЙВАНЬ"}
    }, {
        "id": 22,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258741", "feature_id": "22", "value": "Лето"}
    }, {
        "id": 23,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258741", "feature_id": "23", "value": "Блистер"}
    }, {
        "id": 29,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258741", "feature_id": "29", "value": "JL-119F"}
    }, {
        "id": 30,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-10-29 21:58:51",
        "pivot": {"group_article_id": "1258741", "feature_id": "30", "value": "Arc Minnow 75"}
    }, {
        "id": 31,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:51",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258741", "feature_id": "31", "value": "4,5"}
    }, {
        "id": 36,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258741", "feature_id": "36", "value": "0,8"}
    }, {
        "id": 37,
        "title": "Минимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-11-08 17:00:18",
        "pivot": {"group_article_id": "1258741", "feature_id": "37", "value": "0,4"}
    }, {
        "id": 39,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258741", "feature_id": "39", "value": "2"}
    }, {
        "id": 48,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:52",
        "updated_at": "2017-10-29 21:58:52",
        "pivot": {"group_article_id": "1258741", "feature_id": "48", "value": "Плавающий"}
    }, {
        "id": 51,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258741", "feature_id": "51", "value": "75"}
    }, {
        "id": 57,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258741", "feature_id": "57", "value": "Тройник"}
    }, {
        "id": 60,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-29 21:58:53",
        "updated_at": "2017-10-29 21:58:53",
        "pivot": {"group_article_id": "1258741", "feature_id": "60", "value": "AR152G"}
    }, {
        "id": 66,
        "title": "По форме тела",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-29 21:58:54",
        "updated_at": "2017-10-30 21:03:23",
        "pivot": {"group_article_id": "1258741", "feature_id": "66", "value": "Минноу"}
    }]
}]
//# sourceMappingURL=productSlider.js.map
