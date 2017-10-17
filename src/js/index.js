$(".movwDown").on("click", function (event) {
    event.preventDefault();
    var id = $(this).attr('href'),
        top = $(id).offset().top - $(".header").innerHeight();
    $('body,html').animate({scrollTop: top}, 300);
});

$(document).ready(function () {

    var tile_list = $(".tile__wrapper[data-tileid]");
    var _num_row = 0;
    var num_col = 0;

    var tile1Width = $(".tile__wrapper[data-tileid='1']").innerWidth(),
        tile2Width = $(".tile__wrapper[data-tileid='2']").innerWidth();

    var tileListWidth = $(".tile-list").width();
    var tile_array = $(".tile__wrapper[data-tileid]");

    var tile_row_array = [];

    function row_object_constructor(top, row_width, elem_list) {
        this.row_top_position = top;
        this.row_width = row_width;
        this.elem_list = elem_list;
    }

    function init() {
        var screenWidth = window.innerWidth;
        var top = 0;
        var elem_newarray = [];
        var row_width = 0;
        var tile_array_length = $(tile_array).length;
        for (var i = 0; i < tile_array_length; i++) {
            if (top < $(tile_array[i]).position().top) {
                top = $(tile_array[i]).position().top;
                elem_newarray = $(tile_array).filter(function (index) {
                    return $(this).position().top === top;
                });
                for (var a = 0; a < $(elem_newarray).length; a++) {
                    row_width += $(elem_newarray[a]).innerWidth();
                }
                var new_row = new row_object_constructor(top, row_width, elem_newarray);
                tile_row_array.push(new_row);
                row_width = 0;
            }
        }

        // console.log(tile_row_array);
        // console.log(tile1Width + " tile1Width");
        // console.log(tile2Width + " tile2Width");
        // console.log(tile1Width * 4);
        // console.log(tileListWidth);

        // если сумма ширин элементов последней строки не равна ширине контейнера
        if (tile_row_array[tile_row_array.length - 1].row_width != tileListWidth) {
            // получаю разницу в виде колличества недостающих плиток
            var raznica = Math.round((tileListWidth - tile_row_array[tile_row_array.length - 1].row_width) / tile1Width);
            // коллекция элементов последней строки
            var elemList = tile_row_array[tile_row_array.length - 1].elem_list;
            // длинна коллекции элементов последней строки
            var elemListLength = elemList.length;
            var count = 2;
            var statusWhile = true;
            // если разница равна нулю или меньше
            if (raznica <= 0) {
                return

            } else { // иначе едем дальше


                if (screenWidth >= 1400) {
                    console.log(raznica);
                    switch (raznica) {
                        case 4:
                            console.log("колличество элементов в строке равно 1 == col-2_4");
                            while (statusWhile === true) {
                                var prevRowElemList = tile_row_array[tile_row_array.length - count].elem_list;
                                for (var i = 0; i < prevRowElemList.length; i++) {
                                    if ($(prevRowElemList[i]).hasClass("col-4_8")) {
                                        $(prevRowElemList[i]).toggleClass("col-4_8 col-2_4");
                                        statusWhile = false;
                                        return
                                    }
                                }
                                count++;
                            }
                            break;
                        case 3:
                            if (elemListLength === 1) {
                                console.log("колличество элементов в строке равно 1 == col-4_8");
                                // элемент последней строи сжимаем до  ячейки
                                $(elemList[0]).toggleClass("col-4_8 col-2_4");
                                while (statusWhile === true) {
                                    var prevRowElemList = tile_row_array[tile_row_array.length - count].elem_list;
                                    for (var i = 0; i < prevRowElemList.length; i++) {
                                        if ($(prevRowElemList[i]).hasClass("col-4_8")) {
                                            $(prevRowElemList[i]).toggleClass("col-4_8 col-2_4");
                                            statusWhile = false;
                                            return
                                        }
                                    }
                                    count++;
                                }
                            } else if (elemListLength === 2) {
                                console.log("колличество элементов в строке равно 2");
                                if (window.location.pathname === "/") {
                                    $(tile_cap_list.vk).insertAfter(elemList[elemListLength - 1]);
                                }
                                for (var i = 0; i < elemListLength; i++) {
                                    if ($(elemList[i]).hasClass("col-2_4")) {
                                        $(elemList[i]).toggleClass("col-2_4 col-4_8");
                                    }
                                }
                            }
                            break;
                        case 2:
                            console.log("колличество элементов в строке равно 3");
                            if (window.location.pathname === "/") {
                                $(tile_cap_list.vk).insertBefore(elemList[elemListLength - 1]);
                            }
                            for (var i = 0; i < elemListLength; i++) {
                                if ($(elemList[i]).hasClass("col-2_4")) {
                                    $(elemList[i]).toggleClass("col-2_4 col-4_8");
                                }
                            }
                            break;
                        case 1:
                            console.log("колличество элементов в строке равно 4");
                            if (window.location.pathname === "/") {
                                $(tile_cap_list.vk).insertBefore(elemList[elemListLength - 1]);
                            }
                            break;
                    }

                } else if (screenWidth >= 1024) {
                    console.log(raznica);
                    switch (raznica) {
                        case 3:
                            console.log("Элементов в строке 1");
                            while (statusWhile === true) {
                                var prevRowElemList = tile_row_array[tile_row_array.length - count].elem_list;
                                for (var i = 0; i < prevRowElemList.length; i++) {
                                    if ($(prevRowElemList[i]).hasClass("col-md-6")) {
                                        $(prevRowElemList[i]).toggleClass("col-md-6 col-md-3");
                                        statusWhile = false;
                                        return
                                    }
                                }
                                count++;
                            }
                            break;
                        case 2:
                            console.log("колличество элементов в строке равно 3");
                            if (elemListLength === 1) {
                                console.log("колличество элементов в строке равно 1 == равен двум");
                                // элемент последней строи сжимаем до  ячейки
                                $(elemList[0]).toggleClass("col-md-6 col-md-3");
                                while (statusWhile === true) {
                                    var prevRowElemList = tile_row_array[tile_row_array.length - count].elem_list;
                                    for (var i = 0; i < prevRowElemList.length; i++) {
                                        if ($(prevRowElemList[i]).hasClass("col-md-6")) {
                                            $(prevRowElemList[i]).toggleClass("col-md-6 col-md-3");
                                            statusWhile = false;
                                            return
                                        }
                                    }
                                    count++;
                                }
                            } else if (elemListLength === 2) {
                                console.log("колличество элементов в строке равно 2");
                                for (var i = 0; i < elemListLength; i++) {
                                    if ($(elemList[i]).hasClass("col-md-3")) {
                                        $(elemList[i]).toggleClass("col-md-3 col-md-6");
                                    }
                                }
                            }
                            break;
                        case 1:
                            console.log("колличество элементов в строке равно 3");
                            $(tile_cap_list.vk).insertBefore(elemList[elemListLength - 1]);
                            break;
                    }

                } else if (screenWidth >= 768) {
                    console.log(raznica);
                    switch (raznica) {
                        case 2:
                            console.log("колличество элементов в строке равно 1");
                            $(tile_cap_list.vk).insertBefore(elemList[elemListLength - 1]);
                            $(elemList[0]).toggleClass("col-sm-4 col-sm-8");
                            break;
                        case 1:
                            console.log("колличество элементов в строке равно 2 илиширина одного равна двум");
                            $(tile_cap_list.vk).insertBefore(elemList[elemListLength - 1]);
                            break;
                    }
                } else {
                    return
                }
            }

        }


    }

    function toggle_tile_class(row_length, _array) {
        for (var a = 0; a < _array.length; a++) {
            switch (row_length) {
                case 5:
                    if ($(_array[a]).hasClass("col-4_8")) {
                        $(_array[a]).toggleClass("col-4_8 col-2_4");
                        _num_row += 1;
                        return
                    }
                    break;
                case 4:
                    if ($(_array[a]).hasClass("col-md-6")) {
                        $(_array[a]).toggleClass("col-md-6 col-md-3");
                        _num_row += 1;
                        return
                    }
                    break;
                case 3:
                    if ($(_array[a]).hasClass("col-sm-8")) {
                        $(_array[a]).toggleClass("col-sm-8 col-sm-4");
                        _num_row += 1;
                        return false
                    }
                    break;
            }
        }

    }

    function tile_check() {
        var _array = [],
            _num = 0,
            length = tile_list.length,
            w = window.innerWidth,
            row_length;
        if (w >= 1400) {
            row_length = 5;
        } else if (w >= 992) {
            row_length = 4;
        } else if (w >= 768) {
            row_length = 3;
        } else {
            return
        }

        if (w >= 768) {
            for (var i = 0; i < length; i++) {
                _num += $(tile_list[i]).data("tileid");
                num_col += _num;
                _array.push(tile_list[i]);
                if (_num > row_length) {
                    toggle_tile_class(row_length, _array);
                    _num = 0;
                    _array.length = 0;
                } else if (_num == row_length) {
                    _num_row += 1;
                    _num = 0;
                    _array.length = 0;
                }
            }
        }
        init();
    }

    // $(window).resize(function () {
    //     var screenWidth = window.innerWidth;
    // });


    if (tile_list.length != 0) {
        tile_check();
    }
})


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
            $('.popUP__video').css({"width": "100%" });
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
    $(this).toggleClass("active")
    if ($(this).hasClass("active")) {
        $(".header__top").addClass("nav__active");
        $("body").addClass("nav__active")
    } else {
        $(".header__top").removeClass("nav__active");
        $("body").removeClass("nav__active");
    }

});

$(".custom-menu__wrapper").hover(
    function () {
        console.log("on");
        $("body").css({"overflow": "hidden"})
    },
    function () {
        console.log("off");
        $("body").css({"overflow": "auto"})
    });
$('.custom-menu__toggle').on('click', function () {
    var w = screen.width;
    console.log('click');
    if (w <= 992) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $('.custom-menu__toggle').removeClass('active');
            $(this).addClass('active');
        }
    }

})

// desctop menu
$(window).resize(function () {
    var w = screen.width;

    if (w > 1023) {
        $("body").removeClass("nav__active");
        $(".header__top").removeClass("nav__active");
        $(".headerNav__toggle").removeClass("active");
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


        $(".productVariation__wrap").niceScroll({
            touchbehavior: true,
            cursorcolor: "transparent",
            cursorborder: "0px solid transparent"
        });

        $(window).resize(function () {
            var w = screen.width;

            if (w > 1024) {

            }
        });


        // проверяет есть ли у карточки с товаром ссылки на вариации
        // если есть добавит градиент если общая ширина ссылок больше ширины контейнера
        function addGradientBlock() {
            var blockList = $(".productVariation__wrap");
            for (var i = 0; i < blockList.length; i++) {
                var elements = $(blockList[i]).find("li");
                var itemWidth = $(elements[0]).width() * $(elements).length;

                if ($(elements).length != 0 && $(blockList[i]).width() < itemWidth) {
                    if ($(blockList[i]).find(".gradientBlock").length == 1) continue
                    $(blockList[i]).append("<div class='gradientBlock'></div>");

                } else {
                    $(blockList[i]).find(".gradientBlock").remove()
                }

            }
        };
        addGradientBlock();

        $(window).resize(function () {
            addGradientBlock()
        });

        $(".tile__wrapper--big").on("click", function (event) {
            event.preventDefault();
            var href = $(this).attr('href');
            var video_content = '<iframe width="100%" height="100%" src="' + href + '" frameborder="0" allowfullscreen></iframe>';
            $(this).empty();
            $(this).append(video_content);
        })

    }
);
