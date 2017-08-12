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
            colorTableItem.push(colorTableItemRender(articles[i].id, articles[i].logo.thumb, articles[i].name));
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


var articles = [
    {
        "id": 19,
        "group_id": "16",
        "new": "0",
        "sale": "0",
        "code": null,
        "name": "Distinctio.",
        "fullname": "Consequatur odio voluptas neque earum fugit est.",
        "cols": "1",
        "og_url": null,
        "og_image": null,
        "og_type": null,
        "og_title": null,
        "meta_description": null,
        "meta_keywords": null,
        "meta_title": null,
        "in_stock": "0",
        "created_at": "2017-08-06 04:01:21",
        "updated_at": "2017-08-06 04:01:21",
        "logo": {
            "id": 104,
            "original": "http://lorempixel.com/640/480/?21889",
            "thumb": "http://lorempixel.com/640/480/?21889",
            "title": "Quia placeat.",
            "primary": "1",
            "area": "article",
            "type": "photo",
            "groups_or_article_id": "19",
            "created_at": "2017-08-06 04:01:21",
            "updated_at": "2017-08-06 04:01:21"
        },
        "photos": [
            {
                "id": 104,
                "original": "http://lorempixel.com/640/480/?21889",
                "thumb": "http://lorempixel.com/640/480/?21889",
                "title": "Quia placeat.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "19",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 105,
                "original": "http://lorempixel.com/640/480/?19692",
                "thumb": "http://lorempixel.com/640/480/?19692",
                "title": "Dicta.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "19",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 106,
                "original": "http://lorempixel.com/640/480/?31155",
                "thumb": "http://lorempixel.com/640/480/?31155",
                "title": "Aut quo iusto.",
                "primary": "0",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "19",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 107,
                "original": "http://lorempixel.com/640/480/?36361",
                "thumb": "http://lorempixel.com/640/480/?36361",
                "title": "Ratione.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "19",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }
        ],
        "features": [
            {
                "id": 1,
                "title": "Quisquam omnis.",
                "measurement": "м",
                "description": "Exercitationem eos ullam aut pariatur.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "vxaaau8-u7e-",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "19", "feature_id": "1", "value": "0.7808379827909349"}
            }, {
                "id": 2,
                "title": "Cum voluptas.",
                "measurement": "м",
                "description": "Sit aut est enim voluptatibus fugit.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "cbeqryq9gdpn",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "19", "feature_id": "2", "value": "0.598578382562184"}
            }, {
                "id": 3,
                "title": "Minima ut est.",
                "measurement": "м",
                "description": "Sed exercitationem totam sapiente quo officiis.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "emi3q92ool2w",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "19", "feature_id": "3", "value": "0.9431522157709823"}
            }, {
                "id": 4,
                "title": "Minima ut est.",
                "measurement": "м",
                "description": "Sed exercitationem totam sapiente quo officiis.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "emi3q92ool2w",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "19", "feature_id": "3", "value": "0.9431522157709823"}
            }
        ]
    },
    {
        "id": 20,
        "group_id": "16",
        "new": "0",
        "sale": "0",
        "code": "it7d96e",
        "name": "Mollitia quos.",
        "fullname": "Ipsam exercitationem odit atque ab illum.",
        "cols": "1",
        "og_url": null,
        "og_image": null,
        "og_type": null,
        "og_title": null,
        "meta_description": null,
        "meta_keywords": null,
        "meta_title": null,
        "in_stock": "0",
        "created_at": "2017-08-06 04:01:21",
        "updated_at": "2017-08-06 04:01:21",
        "logo": {
            "id": 108,
            "original": "http://lorempixel.com/640/480/?88606",
            "thumb": "http://lorempixel.com/640/480/?88606",
            "title": "Et repudiandae.",
            "primary": "1",
            "area": "article",
            "type": "photo",
            "groups_or_article_id": "20",
            "created_at": "2017-08-06 04:01:21",
            "updated_at": "2017-08-06 04:01:21"
        },
        "photos": [
            {
                "id": 108,
                "original": "http://lorempixel.com/640/480/?88606",
                "thumb": "http://lorempixel.com/640/480/?88606",
                "title": "Et repudiandae.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "20",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 110,
                "original": "http://lorempixel.com/640/480/?53728",
                "thumb": "http://lorempixel.com/640/480/?53728",
                "title": "Amet ut.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "20",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }
        ],
        "features": [
            {
                "id": 1,
                "title": "Quisquam omnis.",
                "measurement": "м",
                "description": "Exercitationem eos ullam aut pariatur.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "vxaaau8-u7e-",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "20", "feature_id": "1", "value": "0.19774882970272975"}
            }, {
                "id": 2,
                "title": "Cum voluptas.",
                "measurement": "м",
                "description": "Sit aut est enim voluptatibus fugit.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "cbeqryq9gdpn",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "20", "feature_id": "2", "value": "0.2509112694537785"}
            }, {
                "id": 3,
                "title": "Minima ut est.",
                "measurement": "м",
                "description": "Sed exercitationem totam sapiente quo officiis.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "emi3q92ool2w",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "20", "feature_id": "3", "value": "0.6352573505766956"}
            }
        ]
    },
    {
        "id": 21,
        "group_id": "16",
        "new": "1",
        "sale": "1",
        "code": "lqp3ny",
        "name": "Ut.",
        "fullname": "Et illo qui sed officiis.",
        "cols": "1",
        "og_url": null,
        "og_image": null,
        "og_type": null,
        "og_title": null,
        "meta_description": null,
        "meta_keywords": null,
        "meta_title": null,
        "in_stock": "0",
        "created_at": "2017-08-06 04:01:21",
        "updated_at": "2017-08-06 04:01:21",
        "logo": {
            "id": 112,
            "original": "http://lorempixel.com/640/480/?48615",
            "thumb": "http://lorempixel.com/640/480/?48615",
            "title": "Et aut est.",
            "primary": "1",
            "area": "article",
            "type": "photo",
            "groups_or_article_id": "21",
            "created_at": "2017-08-06 04:01:21",
            "updated_at": "2017-08-06 04:01:21"
        },
        "photos": [
            {
                "id": 112,
                "original": "http://lorempixel.com/640/480/?48615",
                "thumb": "http://lorempixel.com/640/480/?48615",
                "title": "Et aut est.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 113,
                "original": "http://lorempixel.com/640/480/?69752",
                "thumb": "http://lorempixel.com/640/480/?69752",
                "title": "Eaque magnam.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 114,
                "original": "http://lorempixel.com/640/480/?49449",
                "thumb": "http://lorempixel.com/640/480/?49449",
                "title": "Iusto.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 115,
                "original": "http://lorempixel.com/640/480/?88120",
                "thumb": "http://lorempixel.com/640/480/?88120",
                "title": "Natus vero.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }
        ],
        "features": [
            {
                "id": 1,
                "title": "Quisquam omnis.",
                "measurement": "м",
                "description": "Exercitationem eos ullam aut pariatur.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "vxaaau8-u7e-",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "1", "value": "0.7131757506696395"}
            }, {
                "id": 2,
                "title": "Cum voluptas.",
                "measurement": "м",
                "description": "Sit aut est enim voluptatibus fugit.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "cbeqryq9gdpn",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "2", "value": "0.3271589466962772"}
            }, {
                "id": 3,
                "title": "Minima ut est.",
                "measurement": "м",
                "description": "Sed exercitationem totam sapiente quo officiis.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "emi3q92ool2w",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "3", "value": "0.599098210501996"}
            }
        ]
    },
    {
        "id": 22,
        "group_id": "16",
        "new": "1",
        "sale": "1",
        "code": "lqp3ny",
        "name": "Ut.",
        "fullname": "Et illo qui sed officiis.",
        "cols": "1",
        "og_url": null,
        "og_image": null,
        "og_type": null,
        "og_title": null,
        "meta_description": null,
        "meta_keywords": null,
        "meta_title": null,
        "in_stock": "0",
        "created_at": "2017-08-06 04:01:21",
        "updated_at": "2017-08-06 04:01:21",
        "logo": {
            "id": 115,
            "original": "http://lorempixel.com/640/480/?48615",
            "thumb": "http://lorempixel.com/640/480/?48615",
            "title": "Et aut est.",
            "primary": "1",
            "area": "article",
            "type": "photo",
            "groups_or_article_id": "21",
            "created_at": "2017-08-06 04:01:21",
            "updated_at": "2017-08-06 04:01:21"
        },
        "photos": [
            {
                "id": 115,
                "original": "http://lorempixel.com/640/480/?48615",
                "thumb": "http://lorempixel.com/640/480/?48615",
                "title": "Et aut est.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 116,
                "original": "http://lorempixel.com/640/480/?69752",
                "thumb": "http://lorempixel.com/640/480/?69752",
                "title": "Eaque magnam.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 117,
                "original": "http://lorempixel.com/640/480/?49449",
                "thumb": "http://lorempixel.com/640/480/?49449",
                "title": "Iusto.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 118,
                "original": "http://lorempixel.com/640/480/?88120",
                "thumb": "http://lorempixel.com/640/480/?88120",
                "title": "Natus vero.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }
        ],
        "features": [
            {
                "id": 1,
                "title": "Quisquam omnis.",
                "measurement": "м",
                "description": "Exercitationem eos ullam aut pariatur.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "vxaaau8-u7e-",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "1", "value": "0.7131757506696395"}
            }, {
                "id": 2,
                "title": "Cum voluptas.",
                "measurement": "м",
                "description": "Sit aut est enim voluptatibus fugit.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "cbeqryq9gdpn",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "2", "value": "0.3271589466962772"}
            }, {
                "id": 3,
                "title": "Minima ut est.",
                "measurement": "м",
                "description": "Sed exercitationem totam sapiente quo officiis.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "emi3q92ool2w",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "3", "value": "0.599098210501996"}
            }
        ]
    },
    {
        "id": 23,
        "group_id": "16",
        "new": "1",
        "sale": "1",
        "code": "lqp3ny",
        "name": "Ut.",
        "fullname": "Et illo qui sed officiis.",
        "cols": "1",
        "og_url": null,
        "og_image": null,
        "og_type": null,
        "og_title": null,
        "meta_description": null,
        "meta_keywords": null,
        "meta_title": null,
        "in_stock": "0",
        "created_at": "2017-08-06 04:01:21",
        "updated_at": "2017-08-06 04:01:21",
        "logo": {
            "id": 119,
            "original": "http://lorempixel.com/640/480/?48615",
            "thumb": "http://lorempixel.com/640/480/?48615",
            "title": "Et aut est.",
            "primary": "1",
            "area": "article",
            "type": "photo",
            "groups_or_article_id": "21",
            "created_at": "2017-08-06 04:01:21",
            "updated_at": "2017-08-06 04:01:21"
        },
        "photos": [
            {
                "id": 119,
                "original": "http://lorempixel.com/640/480/?48615",
                "thumb": "http://lorempixel.com/640/480/?48615",
                "title": "Et aut est.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 120,
                "original": "http://lorempixel.com/640/480/?69752",
                "thumb": "http://lorempixel.com/640/480/?69752",
                "title": "Eaque magnam.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 121,
                "original": "http://lorempixel.com/640/480/?49449",
                "thumb": "http://lorempixel.com/640/480/?49449",
                "title": "Iusto.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 122,
                "original": "http://lorempixel.com/640/480/?88120",
                "thumb": "http://lorempixel.com/640/480/?88120",
                "title": "Natus vero.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }
        ],
        "features": [
            {
                "id": 1,
                "title": "Quisquam omnis.",
                "measurement": "м",
                "description": "Exercitationem eos ullam aut pariatur.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "vxaaau8-u7e-",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "1", "value": "0.7131757506696395"}
            }, {
                "id": 2,
                "title": "Cum voluptas.",
                "measurement": "м",
                "description": "Sit aut est enim voluptatibus fugit.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "cbeqryq9gdpn",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "2", "value": "0.3271589466962772"}
            }, {
                "id": 3,
                "title": "Minima ut est.",
                "measurement": "м",
                "description": "Sed exercitationem totam sapiente quo officiis.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "emi3q92ool2w",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "3", "value": "0.599098210501996"}
            }
        ]
    },
    {
        "id": 24,
        "group_id": "16",
        "new": "1",
        "sale": "1",
        "code": "lqp3ny",
        "name": "Ut.",
        "fullname": "Et illo qui sed officiis.",
        "cols": "1",
        "og_url": null,
        "og_image": null,
        "og_type": null,
        "og_title": null,
        "meta_description": null,
        "meta_keywords": null,
        "meta_title": null,
        "in_stock": "0",
        "created_at": "2017-08-06 04:01:21",
        "updated_at": "2017-08-06 04:01:21",
        "logo": {
            "id": 124,
            "original": "http://lorempixel.com/640/480/?48615",
            "thumb": "http://lorempixel.com/640/480/?48615",
            "title": "Et aut est.",
            "primary": "1",
            "area": "article",
            "type": "photo",
            "groups_or_article_id": "21",
            "created_at": "2017-08-06 04:01:21",
            "updated_at": "2017-08-06 04:01:21"
        },
        "photos": [
            {
                "id": 124,
                "original": "http://lorempixel.com/640/480/?48615",
                "thumb": "http://lorempixel.com/640/480/?48615",
                "title": "Et aut est.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 125,
                "original": "http://lorempixel.com/640/480/?69752",
                "thumb": "http://lorempixel.com/640/480/?69752",
                "title": "Eaque magnam.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 126,
                "original": "http://lorempixel.com/640/480/?49449",
                "thumb": "http://lorempixel.com/640/480/?49449",
                "title": "Iusto.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 127,
                "original": "http://lorempixel.com/640/480/?88120",
                "thumb": "http://lorempixel.com/640/480/?88120",
                "title": "Natus vero.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }
        ],
        "features": [
            {
                "id": 1,
                "title": "Quisquam omnis.",
                "measurement": "м",
                "description": "Exercitationem eos ullam aut pariatur.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "vxaaau8-u7e-",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "1", "value": "0.7131757506696395"}
            }, {
                "id": 2,
                "title": "Cum voluptas.",
                "measurement": "м",
                "description": "Sit aut est enim voluptatibus fugit.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "cbeqryq9gdpn",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "2", "value": "0.3271589466962772"}
            }, {
                "id": 3,
                "title": "Minima ut est.",
                "measurement": "м",
                "description": "Sed exercitationem totam sapiente quo officiis.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "emi3q92ool2w",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "3", "value": "0.599098210501996"}
            }
        ]
    },
    {
        "id": 25,
        "group_id": "16",
        "new": "1",
        "sale": "1",
        "code": "lqp3ny",
        "name": "Ut.",
        "fullname": "Et illo qui sed officiis.",
        "cols": "1",
        "og_url": null,
        "og_image": null,
        "og_type": null,
        "og_title": null,
        "meta_description": null,
        "meta_keywords": null,
        "meta_title": null,
        "in_stock": "0",
        "created_at": "2017-08-06 04:01:21",
        "updated_at": "2017-08-06 04:01:21",
        "logo": {
            "id": 130,
            "original": "http://lorempixel.com/640/480/?48615",
            "thumb": "http://lorempixel.com/640/480/?48615",
            "title": "Et aut est.",
            "primary": "1",
            "area": "article",
            "type": "photo",
            "groups_or_article_id": "21",
            "created_at": "2017-08-06 04:01:21",
            "updated_at": "2017-08-06 04:01:21"
        },
        "photos": [
            {
                "id": 130,
                "original": "http://lorempixel.com/640/480/?48615",
                "thumb": "http://lorempixel.com/640/480/?48615",
                "title": "Et aut est.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 131,
                "original": "http://lorempixel.com/640/480/?69752",
                "thumb": "http://lorempixel.com/640/480/?69752",
                "title": "Eaque magnam.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 132,
                "original": "http://lorempixel.com/640/480/?49449",
                "thumb": "http://lorempixel.com/640/480/?49449",
                "title": "Iusto.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }, {
                "id": 133,
                "original": "http://lorempixel.com/640/480/?88120",
                "thumb": "http://lorempixel.com/640/480/?88120",
                "title": "Natus vero.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }
        ],
        "features": [
            {
                "id": 1,
                "title": "Quisquam omnis.",
                "measurement": "м",
                "description": "Exercitationem eos ullam aut pariatur.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "vxaaau8-u7e-",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "1", "value": "0.7131757506696395"}
            }, {
                "id": 2,
                "title": "Cum voluptas.",
                "measurement": "м",
                "description": "Sit aut est enim voluptatibus fugit.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "cbeqryq9gdpn",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "2", "value": "0.3271589466962772"}
            }, {
                "id": 3,
                "title": "Minima ut est.",
                "measurement": "м",
                "description": "Sed exercitationem totam sapiente quo officiis.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "emi3q92ool2w",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "3", "value": "0.599098210501996"}
            }
        ]
    },
    {
        "id": 26,
        "group_id": "16",
        "new": "1",
        "sale": "1",
        "code": "lqp3ny",
        "name": "Ut.",
        "fullname": "Et illo qui sed officiis.",
        "cols": "1",
        "og_url": null,
        "og_image": null,
        "og_type": null,
        "og_title": null,
        "meta_description": null,
        "meta_keywords": null,
        "meta_title": null,
        "in_stock": "0",
        "created_at": "2017-08-06 04:01:21",
        "updated_at": "2017-08-06 04:01:21",
        "logo": {
            "id": 140,
            "original": "http://lorempixel.com/640/480/?48615",
            "thumb": "http://lorempixel.com/640/480/?48615",
            "title": "Et aut est.",
            "primary": "1",
            "area": "article",
            "type": "photo",
            "groups_or_article_id": "21",
            "created_at": "2017-08-06 04:01:21",
            "updated_at": "2017-08-06 04:01:21"
        },
        "photos": [
            {
                "id": 141,
                "original": "http://lorempixel.com/640/480/?48615",
                "thumb": "http://lorempixel.com/640/480/?48615",
                "title": "Et aut est.",
                "primary": "1",
                "area": "article",
                "type": "photo",
                "groups_or_article_id": "21",
                "created_at": "2017-08-06 04:01:21",
                "updated_at": "2017-08-06 04:01:21"
            }
        ],
        "features": [
            {
                "id": 1,
                "title": "Quisquam omnis.",
                "measurement": "м",
                "description": "Exercitationem eos ullam aut pariatur.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "vxaaau8-u7e-",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "1", "value": "0.7131757506696395"}
            }, {
                "id": 2,
                "title": "Cum voluptas.",
                "measurement": "м",
                "description": "Sit aut est enim voluptatibus fugit.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "cbeqryq9gdpn",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "2", "value": "0.3271589466962772"}
            }, {
                "id": 3,
                "title": "Minima ut est.",
                "measurement": "м",
                "description": "Sed exercitationem totam sapiente quo officiis.",
                "is_filter": "0",
                "value_type": "string",
                "1C_key": "emi3q92ool2w",
                "created_at": "2017-08-06 04:01:19",
                "updated_at": "2017-08-06 04:01:19",
                "pivot": {"group_article_id": "21", "feature_id": "3", "value": "0.599098210501996"}
            }
        ]
    }
];

//# sourceMappingURL=productSlider.js.map
