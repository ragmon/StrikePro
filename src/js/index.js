

$(".movwDown").on("click", function (event) {
    event.preventDefault();
    var id  = $(this).attr('href'),
        top = $(id).offset().top - $(".header").innerHeight();
    $('body,html').animate({scrollTop: top}, 300);
});

$(document).ready(function () {

    var tile_list = $(".tile__wrapper[data-tileid]");
    var _num_row = 0;
    var num_col = 0;
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
        setTimeout(addGhosteTile(), 1000);
    }
    if(tile_list.length != 0){
        tile_check();
    }


    function addGhosteTile() {
        var tile_list = $(".tile__wrapper[data-tileid]");
        var num__row = 0;
        var windowWidth = screen.width,
            length = tile_list.length,
            max_width = $(".tile-list").width(),
            numCol = 0,
            col_width = 0;
        var num_row = 0;

        for(var i = 0; i < length; i++){
            col_width += $(tile_list[i]).outerWidth();
            if(col_width == max_width){
                col_width = 0;
                num_row += 1;
            }
        }

        if(col_width != 0){
            var d = Math.round((max_width - col_width) / $(".col-sm-4").outerWidth());
            var col_cap_array = [];
            for (var key in tile_cap_list) {
                col_cap_array.push(tile_cap_list[key])
            }
            for(var t = 0; t < d; t++){
                var tile_list = $(".tile__wrapper[data-tileid]");
                $("ul.row").append(col_cap_array[Math.floor(Math.random() * ((col_cap_array.length - 1) - 0 + 1)) + 0]);
            }
        }
    }

    // $(window).resize(function () {
    //     var w = screen.width;
    //     if (w >= 768) {
    //         tile_check();
    //     }
    // });

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

                $(".subscription-form").find(".js__popup").show()
            },
            'error': function (jqXHR, textStatus, errorThrown) {
                console.error('Error register subscription!', jqXHR, textStatus, errorThrown);

                $(".subscription-form").find(".js__popup--error").show()
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
        var popUp = '<div class="popUP__wrapper js__popUP__video js__popup active"><div class="popUP__video js__noPropagation"> <button class="close__popup js__closePopup">&#215;</button>' + popUp_content + '</div></div>';
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

//

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

$(document).keyup(function(eventObject){
    if(eventObject.which == 27){
        $(".header__search--mobile").hide();
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

        var scrollSetting = {
            parentCategoryBlock : "",
            parentCategoryBlockWidth : "",
            childrenCategoryBlock : "",
            childrenCategoryBlockWidth : "",
            maxPos: 0,
            currentPos: 0,
            scrollSpeed : 15
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

            if(scrollDir > 0){
                console.log("down");
                if(scrollSetting.currentPos < scrollSetting.maxPos){
                    scrollSetting.currentPos +=scrollSetting.scrollSpeed;
                } else {
                    return
                }
                if(scrollSetting.currentPos >= scrollSetting.maxPos){
                    $(scrollSetting.childrenCategoryBlock).css({"left" : "-"+scrollSetting.maxPos+"px"});
                    return
                }
                $(scrollSetting.childrenCategoryBlock).css({"left" : "-"+scrollSetting.currentPos+"px"})
            } else if(scrollDir < 0){
                console.log("up");
                if(scrollSetting.currentPos > 0){
                    scrollSetting.currentPos -=scrollSetting.scrollSpeed;
                } else {
                    return
                }
                if(scrollSetting.currentPos <= 0){
                    $(scrollSetting.childrenCategoryBlock).css({"left" : "0px"});
                    return
                }
                $(scrollSetting.childrenCategoryBlock).css({"left" : "-"+scrollSetting.currentPos+"px"})
            }
        }

        $(".headerNav__item").hover(
            function(){
                // пришел
                var w = screen.width;
                if(w >= 1024){
                    initHscrool();
                    $(scrollSetting.parentCategoryBlock).bind('mousewheel DOMMouseScroll', HScrollCategory);
                }

            },
            function(){
                // ушел
                var w = screen.width;
                if(w >= 1024) {
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
            $(this).empty()
            $(this).append(video_content);


        })

    }
);
