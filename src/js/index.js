$(".movwDown").on("click", function (event) {
    event.preventDefault();
    var id = $(this).attr('href'),
        top = $(id).offset().top - $(".header").innerHeight();
    $('body,html').animate({scrollTop: top}, 300);
});

$(function () {
    var defaultImage = 'http://cdn.strikepro.ru/default_group.png';
    var Body = $("body");
    var characteristicsList = $('.characteristics__list');
    var GalleryWrap = $('.colorTable__gallery--wrapper');
    var gallerySliderWrap = $('.colorTable__gallery--slider');
    var galleryPhotoList = $('.variation__list');
    var GalleryMainPhoto = $('.colorTable__gallery--img');

    var colorTable = $('.colorTable');
    var colorTableItem = [];
    var sliderItem = [];
    var currentPhoto = [];
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
            var windowSize = window.innerWidth;
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

            $('.colorTable .colorTable__item').on('click', initGallery);

            console.log(colorTableItem);
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

                $(GalleryMainPhoto).css({
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


    CreateArticlesTable();

    CreateSliderItems();

});

var articles = [
    {
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
    }
]

$(function () {
    function ajaxSubmitSunscribe(form) {
        var $this = $(form);
        var data = $this.serialize();
        $.ajax({
            'url': ajax_url.ajaxSubmitSunscribeUrl,
            'type': 'post',
            'dataType': 'html',
            'data': data,
            'success': function (data, textStatus, jqXHR) {
                console.log('Success register subscription.', data, textStatus, jqXHR);

                $(".subscription-form").find(".js__popup").show();
                $(".popUP__wrapper").css({"height": window.innerHeight + "px"});
            },
            'error': function (jqXHR, textStatus, errorThrown) {
                console.error('Error register subscription!', jqXHR, textStatus, errorThrown);

                $(".subscription-form").find(".js__popup--error").show();
                $(".popUP__wrapper").css({"height": window.innerHeight + "px"});
            }
        }).done(function () {
            form.reset();
        });
    }

    $(".subscription-form").submit(function (e) {
        e.preventDefault();
        return false;
    }).validate({
        rules: {
            email: {
                required: true,
                email: true,
                minlength: 6
            }
        },
        messages: {
            email: {
                required: "Поле Email обязательно для заполнения",
                email: "Адрес электронной почты недействителен"
            }
        },
        submitHandler: function (form) {
            ajaxSubmitSunscribe(form);
        }
    });
});


$(document).on("click", function (event) {
    if ($(event.target).closest(".js__closePopup").length == 1) {
        $(".js__popUP__video").detach();
        $(".js__popup--error").hide();
        $(event.target).closest(".js__popup").hide();
        $("body").css({
            "overflow": "inherit"
        });
        return
    } else if ($(event.target).closest(".js__noPropagation").length == 1) {
        event.stopPropagation();
        return
    } else if ($(event.target).closest(".js__popup").length == 1) {

        $(".js__popUP__video").detach();
        $(".js__popup--error").hide();
        event.stopPropagation();
        $(event.target).closest(".js__popup").hide();
        $("body").css({
            "overflow": "inherit"
        });
        return
    }
})


// VIDEO POPUP
$(document).ready(function () {

    $(".js__videoPopup").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log('closk')
        var k = 1280 / 720;
        var w = screen.width;
        var link = $(this).attr('href');
        var popUp_content = '<iframe width="100%" height="100%" src="' + link + '" frameborder="0" allowfullscreen></iframe>';
        var popUp = '<div class="popUP__wrapper js__popUP__video js__popup active"><div class="popUP__video js__noPropagation"> <button class="close__popup js__closePopup">&#215;</button>' + popUp_content + '</div></div>';
        $("body").css({
            "overflow": "hidden"
        });
        $("body").append(popUp);


        $(".popUP__wrapper").css({"height": window.innerHeight + "px"});
        $('.popUP__video').css({"height": w * 0.7 / k, "width": w * 0.7});

    })


    $(window).resize(function () {
        var k = 1280 / 720;
        var w = screen.width;

        $(".popUP__wrapper").css({"height": window.innerHeight + "px"});
        $('.header__search--mobile').css({"height": window.innerHeight + "px"});
        console.log(w);
        if (w < 700) {
            $('.popUP__video').css({"width": "100%"});
            $('.popUP__video').height($('.popUP__video').width() / k);
        } else {
            $('.popUP__video').css({"height": w * 0.8 / k, "width": w * 0.8});
        }
    });


})


// FLEXSLIDER PAGE INDEX


// Jquery UI range
$(document).ready(function () {
    jQuery("#input_range-1").slider({
        min: 0,
        max: 15,
        step: 1,
        value: '',
        range: true
    });

    jQuery("#input_range-2").slider({
        min: 0,
        max: 11,
        values: '',
        range: true
    });
    jQuery("#input_range-3").slider({
        min: 0,
        max: 61,
        values: "",
        range: true
    });
    addValue()

    function addValue() {
        var btn = $(".ui-slider-handle");
        for (var i = 0; i < btn.length; i++) {
            $(btn[i]).append("<span class='input_range-value'></span>")
        }
    }

    $('#input_range-1').bind('slide', function () {
        var rangList = $('#input_range-1 .input_range-value');
        $(rangList[0]).text($('#input_range-1').slider('values')[0] + " кг");
        $(rangList[1]).text($('#input_range-1').slider('values')[1] + " кг");
    });
    $('#input_range-2').bind('slide', function () {
        var rangList = $('#input_range-2 .input_range-value');
        $(rangList[0]).text($('#input_range-2').slider('values')[0] + " cм");
        $(rangList[1]).text($('#input_range-2').slider('values')[1] + " см");
    });
    $('#input_range-3').bind('slide', function () {
        var rangList = $('#input_range-3 .input_range-value');
        $(rangList[0]).text($('#input_range-3').slider('values')[0] + " метров");
        $(rangList[1]).text($('#input_range-3').slider('values')[1] + " метров");
    });

    $(".productList__filtrBlock--reset").on('click', function () {
        $('#input_range-3').slider('values', [0, 15])
        $('#input_range-1 .input_range-value').text($('#input_range-1').slider('values') + " кг");
        $('#input_range-2').slider('values', [0, 11]);
        $('#input_range-2 .input_range-value').text($('#input_range-2').slider('values') + " см");
        $('#input_range-1').slider('values', [0, 6])
        $('#input_range-3 .input_range-value').text($('#input_range-3').slider('values') + " метр");
    })

})


// close product filtr
$(".productList__filtrBlock--close").on("click", function (event) {
    event.preventDefault();
    var filtr = $(".productList__filtrBlock");
    filtr.slideToggle();
    $(".productList__filtrBlock--close").toggleClass("active");
})


// mobile menu
$(".headerNav__toggle").on("click", function () {
    var $body = $("body");
    var $headerTop = $(".header__top");
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
        $($headerTop).addClass("nav__active");
        $($body).addClass("nav__active");

        if ($($body).find('.nav-backdrop').length) {
            var $navBackdrop = $(".nav-backdrop");
            $($navBackdrop).addClass("active");
            console.log('closeHeaderNav');
            $($navBackdrop).bind('click', closeHeaderNav);
        } else {

            $($body).append('<div class="nav-backdrop active"></div>');
            $(".nav-backdrop").bind('click', closeHeaderNav);
        }

    } else {
        closeHeaderNav();
    }
});

function closeHeaderNav() {
    console.log('closeHeaderNav');
    var $body = $("body");
    var $headerTop = $(".header__top");
    var $navBackdrop = $(".nav-backdrop");

    $($headerTop).removeClass("nav__active");
    $('.headerNav__toggle').removeClass("active");
    $($body).removeClass("nav__active");
    $($navBackdrop).unbind('click', closeHeaderNav);

    $($navBackdrop).removeClass("active");
}


// $(".custom-menu__wrapper").hover(
//     function () {
//         console.log("on");
//         $("body").css({"overflow": "hidden"})
//     },
//     function () {
//         console.log("off");
//         $("body").css({"overflow": "auto"})
//     });
$('.custom-menu__toggle').on('click', function () {
    console.log('click');
    if (window.innerWidth < 1024) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $('.custom-menu__toggle').removeClass('active');
            $(this).addClass('active');
        }
    }
});
// $('.custom-menu__toggle').hover(function () {
//     console.log('click');
//     if (window.outerWidth < 1024) {
//         if ($(this).hasClass('active')) {
//             $(this).removeClass('active');
//         } else {
//             $('.custom-menu__toggle').removeClass('active');
//             $(this).addClass('active');
//         }
//     }
// },function () {
//     console.log('click');
//     if (window.outerWidth < 1024) {
//         if ($(this).hasClass('active')) {
//             $(this).removeClass('active');
//         } else {
//             $('.custom-menu__toggle').removeClass('active');
//             $(this).addClass('active');
//         }
//     }
// });

// desctop menu
$(window).resize(function () {
    var w = screen.width;

    if (w > 1023) {
        $("body").removeClass("nav__active");
        $(".header__top").removeClass("nav__active");
        $(".headerNav__toggle").removeClass("active");
        closeHeaderNav()
    }
});


// mobile search popup
$(".header__search--btn").on("click", function (event) {

    event.preventDefault();
    if (!$("body").hasClass("nav__active")) {
        $(".header__search--mobile").show();
        $(".header__search--mobile").css({"height": window.innerHeight + "px"});
    }

})

$(document).on("click", function (event) {
    if ($(event.target).closest(".form-group").length == 1) {
        event.stopPropagation();
        return
    } else if ($(event.target).closest(".header__search--mobile").length == 1) {
        $(".header__search--mobile").hide();
        return
    }
})

$(document).keyup(function (eventObject) {
    if (eventObject.which == 27) {
        $(".header__search--mobile").hide();
        $(".js__popup").hide();
        $(".js__popup").hide();
        $(".js__popUP__video").detach();
        $("body").css({
            "overflow": "inherit"
        });
    }

});


// JQUERY UI Autocomplete Widget
$(document).ready(function () {

    $('.js__search').autocomplete({
        minLength: 2,
        delay: 1000,
        source: function (request, response) {
            $.ajax({
                url: ajax_url.autocompleteServerUrl, // ссылка на json
                type: 'get',
                data: {
                    'q': $('[name=q]').val()
                },
                success: function (data) { // получаем данные из json

                    response(data.data);
                },
                'error': function (jqXHR, textStatus, errorThrown) {
                    console.error('Error register subscription!', jqXHR, textStatus, errorThrown);
                }
            });
        },
        select: function (event, ui) {
            location.assign(ui.item.url)
        },
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        if (item.image === undefined) {
            return $("<li></li>")
                .data("ui-autocomplete-item", item)
                .append("<span class='autocompleteItem__title'>" +
                    item.title +
                    "</span>")
                .appendTo(ul);
        } else {
            return $("<li></li>")
                .data("ui-autocomplete-item", item)
                .append("<span class='autocompleteItem__img'>" +
                    "<img src=" + item.image.data.thumb + ">" +
                    "</span>" +
                    "<span class='autocompleteItem__title'>" +
                    item.title +
                    "</span>")
                .appendTo(ul);
        }
    };


    $('.js__search').keydown(function (event) {
        if (event.keyCode == 13) {
            $(".header__search").submit();
            return false;
        }
    });


});


$(".product__zoom").on("click", function () {
    var link = $(this).closest(".product__stand").find("img").attr("src");

    $("body").css({
        "overflow": "hidden"
    });

    $(".popUP__productImg").css({
        "width": $(this).closest(".product__stand").find("img").width() + "px",
        "height": $(this).closest(".product__stand").find("img").height() + "px"
    });

    $(".popUP__productImg").find("img").attr("src", link);
    $(".popUP__productImg").closest(".popUP__wrapper").show();

})

//--------------------------------------------------------------
//--------------------------------------------------------------
/* 

 код ниже нужен для горизонтального скрола на странице списка продуктов  для прокрутки вариация проддуктов

 */
//--------------------------------------------------------------
//--------------------------------------------------------------

$(document).ready(
    function () {

        var scrollSetting = {
            parentCategoryBlock: "",
            parentCategoryBlockWidth: "",
            childrenCategoryBlock: "",
            childrenCategoryBlockWidth: "",
            maxPos: 0,
            currentPos: 0,
            scrollSpeed: 15
        }

        function initHscrool() {
            scrollSetting.parentCategoryBlock = $(".container-tab");
            scrollSetting.parentCategoryBlockWidth = $(scrollSetting.parentCategoryBlock).width();
            scrollSetting.childrenCategoryBlock = $(".accordion-tabs");
            scrollSetting.childrenCategoryBlockWidth = $(scrollSetting.childrenCategoryBlock).width();
            scrollSetting.maxPos = scrollSetting.childrenCategoryBlockWidth - scrollSetting.parentCategoryBlockWidth;
            scrollSetting.currentPos = parseInt($(scrollSetting.childrenCategoryBlock).css("left"), 10);
        }

        function HScrollCategory(e) {
            var scrollTo = null;
            var scrollDir = 0;
            if (e.type === 'mousewheel') {
                scrollTo = (e.originalEvent.wheelDelta * -1);
                scrollDir = scrollTo;
            }
            else if (e.type === 'DOMMouseScroll') {
                scrollTo = 40 * e.originalEvent.detail;
                scrollDir = scrollTo;
            }
            if (scrollTo) {
                e.preventDefault();
                $(this).scrollTop(scrollTo + $(this).scrollTop());
            }

            if (scrollDir > 0) {
                console.log("down");
                if (scrollSetting.currentPos < scrollSetting.maxPos) {
                    scrollSetting.currentPos += scrollSetting.scrollSpeed;
                } else {
                    return
                }
                if (scrollSetting.currentPos >= scrollSetting.maxPos) {
                    $(scrollSetting.childrenCategoryBlock).css({"left": "-" + scrollSetting.maxPos + "px"});
                    return
                }
                $(scrollSetting.childrenCategoryBlock).css({"left": "-" + scrollSetting.currentPos + "px"})
            } else if (scrollDir < 0) {
                console.log("up");
                if (scrollSetting.currentPos > 0) {
                    scrollSetting.currentPos -= scrollSetting.scrollSpeed;
                } else {
                    return
                }
                if (scrollSetting.currentPos <= 0) {
                    $(scrollSetting.childrenCategoryBlock).css({"left": "0px"});
                    return
                }
                $(scrollSetting.childrenCategoryBlock).css({"left": "-" + scrollSetting.currentPos + "px"})
            }
        }

        $(".headerNav__item").hover(
            function () {
                // пришел
                var w = screen.width;
                if (w >= 1024) {
                    initHscrool();
                    $(scrollSetting.parentCategoryBlock).bind('mousewheel DOMMouseScroll', HScrollCategory);
                }

            },
            function () {
                // ушел
                var w = screen.width;
                if (w >= 1024) {
                    $(scrollSetting.parentCategoryBlock).unbind('mousewheel DOMMouseScroll', HScrollCategory);
                    $(".accordion-tabs").css({"left": "0px"});
                }
            });


        $(window).resize(function () {
            var w = screen.width;

            if (w > 1024) {

            }
        });


        //
        // $(window).resize(function () {
        //     addGradientBlock()
        // });

        $(".tile__wrapper--big").on("click", function (event) {
            event.preventDefault();
            var href = $(this).attr('href');
            var video_content = '<iframe width="100%" height="100%" src="' + href + '" frameborder="0" allowfullscreen></iframe>';
            $(this).empty();
            $(this).append(video_content);
        })

    }
);


(function ($) {
    $(function () {

        $('#moveup').click(function () {
            $('html, body').animate({scrollTop: 0}, 500);
            return false;
        })

    })
})(jQuery)