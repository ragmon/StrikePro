$(document).ready(function () {

    var tile_list = $(".tile__wrapper[data-tileid]");

    function toggle_tile_class(row_length, _array) {
        for (var a = 0; a < _array.length; a++) {
            switch (row_length) {
                case 5:
                    if ($(_array[a]).hasClass("col-4_8")) {
                        $(_array[a]).toggleClass("col-4_8 col-2_4");
                        return
                    }
                    break;
                case 4:
                    if ($(_array[a]).hasClass("col-md-6")) {
                        $(_array[a]).toggleClass("col-md-6 col-md-3");
                        return
                    }
                    break;
                case 3:
                    if ($(_array[a]).hasClass("col-sm-8")) {
                        $(_array[a]).toggleClass("col-sm-8 col-sm-4");
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
            w = screen.width,
            row_length;
        if (w >= 1400) {
            row_length = 5;
        } else if (w >= 1024) {
            row_length = 4;
        } else if (w >= 768) {
            row_length = 3;
        } else {
            return
        }
        if (w >= 768) {
            for (var i = 0; i < length; i++) {
                _num += $(tile_list[i]).data("tileid");
                _array.push(tile_list[i]);
                if (_num > row_length) {
                    toggle_tile_class(row_length, _array);
                    _num = 0;
                    _array.length = 0;
                } else if (_num == row_length) {
                    _num = 0;
                    _array.length = 0;
                }
            }
        }
    }
    tile_check();
})


$(function () {
    function ajaxSubmitSunscribe(form) {
        var $this = $(form);
        var data = $this.serialize();
        $.ajax({
            'url': global_config.ajaxSubmitSunscribeUrl,
            'type': 'post',
            'dataType': 'html',
            'data': data,
            'success': function (data, textStatus, jqXHR) {
                console.log('Success register subscription.', data, textStatus, jqXHR);

                $(".subscription-form").find(".js__popup").show()
            },
            'error': function (jqXHR, textStatus, errorThrown) {
                console.error('Error register subscription!', jqXHR, textStatus, errorThrown);

                alert('Возникла ошибка!');
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
        $(event.target).closest(".js__popup").hide();
        $("body").css({
            "overflow": "inherit"
        });
        return
    } else if ($(event.target).closest(".js__noPropagation").length == 1) {
        event.stopPropagation();
        return
    } else if ($(event.target).closest(".js__popup").length == 1) {
        event.stopPropagation();
        $(event.target).closest(".js__popup").hide();
        $("body").css({
            "overflow": "inherit"
        });
        $(".popUP__wrapper").detach();
        return
    }
})


// VIDEO POPUP
$(document).ready(function () {

    $(".js__videoPopup").on("click", function (event) {
        event.preventDefault();
        var link = $(this).attr('href');
        var popUp_content = '<iframe width="100%" height="100%" src="' + link + '" frameborder="0" allowfullscreen></iframe>';
        var popUp = '<div class="popUP__wrapper js__popup active"><div class="popUP__video js__noPropagation"> <button class="close__popup js__closePopup">&#215;</button>' + popUp_content + '</div></div>';
        $("body").css({
            "overflow": "hidden"
        });
        $("body").append(popUp);
    })



    $(window).resize(function () {
        var k = 700 / 420;
        var w = screen.width;

        if (w < 700) {
            $('.popUP__video').height($('.popUP__video').width() / k);
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


// tabs in category header
$("#catalog__tabs").on("click", function (event) {
    event.stopPropagation();
})
$(document).ready(function () {
    $('.accordion-tabs').children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
    $('.accordion-tabs').on('click', 'li > a', function (event) {
        if (!$(this).hasClass('is-active')) {
            event.preventDefault();
            $('.accordion-tabs .is-open').removeClass('is-open').hide();
            $(this).next().toggleClass('is-open').toggle();
            $('.accordion-tabs').find('.is-active').removeClass('is-active');
            $(this).addClass('is-active');
        } else if ($(this).hasClass('is-active')) {
            event.preventDefault();
            $(this).removeClass('is-active');
            $(this).next().toggleClass('is-open').toggle();
        } else {
            event.preventDefault();
        }
    });
});
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

$(".tab-head-cont section a").on("click", function (event) {
    event.stopPropagation();
})

// mobile search popup
$(".header__search--btn").on("click", function (event) {

    event.preventDefault();
    if (!$("body").hasClass("nav__active")) {
        $(".header__search--mobile").show();
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







// JQUERY UI Autocomplete Widget
$(document).ready(function () {

    $('.js__search').autocomplete({
        minLength: 2,
        delay: 1000,
        source: function (request, response) {
            $.ajax({
                url: global_config.autocompleteServerUrl, // ссылка на json
                type : 'post',
                data : {
                    'q' : $('[name=q]').val()
                },
                success: function (data) { // получаем данные из json
                    var Data = $.grep(data.data, function (value) {
                        return value.title.substring(0, request.term.length).toLowerCase() == request.term.toLowerCase();
                    });
                    response(Data);
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
        if (item.image == undefined) {
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
    })

    $(".popUP__productImg").css({
        "width": $(this).closest(".product__stand").find("img").width() + "px",
        "height": $(this).closest(".product__stand").find("img").height() + "px"
    })

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
        $(".productVariation__wrap").niceScroll({
            touchbehavior: true,
            cursorcolor: "transparent",
            cursorborder: "0px solid transparent"
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
            $(this).empty()
            $(this).append(video_content);


        })

    }
);
