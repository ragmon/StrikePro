$(document).ready(function () {
    var defaultImage = 'http://cdn.strikepro.ru/default_group.png';
    var Body = $("body");
    var characteristicsList = $('.characteristics__list');
    var GalleryWrap = $('.colorTable__gallery--wrapper');
    var galleryPhotoList = $('.variation__list');
    var GalleryMainPhoto = $('.colorTable__gallery--img');

    var colorTable = $('.colorTable');
    var colorTableItem = [];
    var sliderItem = [];
    var GlideSlides = $('.glide__slides');
    var GlideSlidesList = [];

    var IndexCurrentSlide = 0;
    var $panzoom;
    var GlideSlider = new Glide('.glide', {
        startAt: IndexCurrentSlide,
        perView: 6,
        type: 'slider',
        breakpoints: {
            1920: {
                perView: 6
            },
            1600: {
                perView: 5
            },
            1024: {
                perView: 4
            },
            768: {
                perView: 3
            },
        }
    });

    var GlideInit = false;


    /** @desc рендер списка вариантов артикла, принимает на вход массив */
    function colorTableItemRender(id, image, data, classWrapper) {
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


        return ('<div class="colorTable__item ' + classWrapper + '" id="' + id + '">' +
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

    /** @desc инициализация списка харктеристик по id артикла */
    function initDescription(id) {
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                console.log(id);
                console.log(articles[i].features);
                descriptionRender(articles[i].features);
            }
        }
    }

    /** @desc рендер списка артиклей в слайдере */
    function sliderItemRender(image, id, data, index) {
        console.log(index);
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
            '<li data-key="'+index+'" class="slider__item glide__slide" id="' + id + '"> ' +
            '<a href="#!"  class="slider__link" >' +
            '<img src="' + image + '" />' +
            (ultraviolet ? '<div class="colorTable__marker colorTable__marker--ultraviolet"></div>' : '') +
            (luminous ? '<div class="colorTable__marker colorTable__marker--luminous"></div>' : '') +
            '</a>' +
            '<span class="slider__item-title">' + title + '</span> ' +
            '</li>'
        )
    }

    function CreateArticlesTable() {
        try {
            $(colorTable).empty();
            $(colorTable).after("<div class='colorTable _mobile'></div>");

            for (var i = 0; i < articles.length; i++) {
                if (articles[i].logo) {
                    colorTableItem.push(colorTableItemRender(articles[i].id, articles[i].logo.thumb_url ? articles[i].logo.thumb_url : defaultImage, articles[i]));
                } else {
                    colorTableItem.push(colorTableItemRender(articles[i].id, defaultImage, articles[i]));
                }
            }
            $(colorTable).append(colorTableItem);
            $('.colorTable._mobile').append(colorTableItem);

            $('.colorTable .colorTable__item').on('click', initGallery);

        } catch (err) {
            throw new Error(err);
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
                $(GalleryMainPhoto).empty();
                console.log('articles[i]: ', articles[i]);
                if (articles[i].logo) {

                    $(GalleryMainPhoto).append('<img src="' + articles[i].logo.original_url + '" alt="">');

                } else {
                    $(GalleryMainPhoto).append('<img src="' + defaultImage + '" alt="">');

                }

                if (luminous) {
                    $(GalleryMainPhoto).append('<div class="colorTable__gallery__marker colorTable__gallery__marker--luminous"></div>');
                }
                if (ultraviolet) {
                    $(GalleryMainPhoto).append('<div class="colorTable__gallery__marker colorTable__gallery__marker--ultraviolet"></div>');
                }
            }
        }
    }

    /** @desc рендер списка вариантов артикла, принимает на вход массив */
    function gelleryPhotoRender(Array) {
        var photos = [];
        var array = Array;

        if (array === undefined) {
            return null;
        }
        if (array.length > 1) {
            for (var i = 0; i < array.length; i++) {
                var photo = '<li class="variation__item">' +
                    '<img id="' + array[i].id + '" src="' + array[i].thumb_url + '" alt="">' +
                    '</li>';
                photos.push(photo);
            }
            $(galleryPhotoList).append(photos);
            $('.colorTable__gallery--variation').addClass('active');

            $('.variation__item img').on('click', function () {
                initGalleryMainPhoto($(this).attr('id'));

                $(GalleryMainPhoto).css({
                    'transform': 'none'
                })
            })
        } else {
            return null;
        }
    }

    /** @desc смена главного изображения по id артикла*/
    function initPhotos(id) {
        $(galleryPhotoList).empty();
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                initGalleryMainPhoto(articles[i].id);
                console.log(articles[i]);
                gelleryPhotoRender(articles[i].head_images);
            }
        }
    }

    function initGallery() {
        var windowSize = window.innerWidth;
        if (windowSize >= 768) {
            $(GalleryWrap).show();
            $(Body).css({
                "overflow": "hidden"
            });



            if (!GlideInit) {

                GlideSlider.mount();
                GlideInit = true;

                GlideSlider.on('run', function(event) {
                    console.log('run: ',event);
                    switch(event.direction){
                        case('>'):{
                            if(IndexCurrentSlide === $('.glide__slides')["0"].children.length - 1){
                                IndexCurrentSlide = 0;
                            } else {
                                IndexCurrentSlide += 1;
                            }
                            onActivePhoto($($('.glide__slides')["0"].children[IndexCurrentSlide]).attr('id'));
                            break
                        }
                        case('<'):{
                            if(IndexCurrentSlide === 0){
                                IndexCurrentSlide = $('.glide__slides')["0"].children.length - 1;
                            } else {
                                IndexCurrentSlide -= 1;
                            }
                            onActivePhoto($($('.glide__slides')["0"].children[IndexCurrentSlide]).attr('id'));

                            break
                        }
                    }
                })

                $(".slider__item").on('click', function () {
                    IndexCurrentSlide = $('.slider__item').index(this);
                    GlideSlider.go('=' + IndexCurrentSlide);
                    onActivePhoto($(this).attr('id'));
                });

            }
            IndexCurrentSlide = $('.colorTable__item').index(this);
            GlideSlider.go('=' + IndexCurrentSlide);



            return initSlider(this);
        }
        return false;
    }

    /** @desc инициализация слайдера */
    function initSlider(event) {
        sliderItem = [];
        console.log($(event));
        initDescription($(event).attr('id'));
        initPhotos($(event).attr('id'));
        PanZoomInit();
    }
    /** @desc активация элемента списка по id артикла */
    function onActivePhoto(id) {
        initDescription(id);
        initPhotos(id);

        $(GalleryMainPhoto).css({
            'transform': 'none'
        });
        PanZoomInit();
    }

    function CreateSliderItems() {
        try {
            var windowSize = window.innerWidth;
            if (windowSize >= 768) {
                $(GlideSlides).empty();

                for (var i = 0; i < articles.length; i++) {
                    if (articles[i].logo) {
                        GlideSlidesList.push(sliderItemRender(articles[i].logo.thumb_url, articles[i].id, articles[i],i))
                    } else {
                        GlideSlidesList.push(sliderItemRender(defaultImage, articles[i].id, articles[i],i))
                    }
                }
                $(GlideSlides).append(GlideSlidesList);

            }
        } catch (err) {
            throw new Error(err);
        }

    }

    function PanZoomInit(){
        $panzoom = $(GalleryMainPhoto).find('img').panzoom();
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
    }










    function colorTable_item_slider() {
        var colorTableItemMobile = $('.colorTable._mobile .colorTable__item');
        var colorTableItemMobileLength = colorTableItemMobile.length;
        for (var i = 0; i < colorTableItemMobileLength; i++) {


            var slides = [];
            var classNav = ".custom-navigation-" + i + " a";
            var photos = articles[i].head_images;
            var photosLength = photos.length;
            if (!photosLength) continue;

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
                '<a href="!#" class="flex-prev">' +
                '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg_arrow" class="caret__arrow"></use></svg>' +
                '</a>' +
                '<a href="!#" class="flex-next">' +
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

    try {

        CreateArticlesTable();

        CreateSliderItems();


        colorTable_item_slider()
    } catch (err) {
        console.log(err)
    }


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

//# sourceMappingURL=productSlider.js.map
