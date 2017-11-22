$(document).ready(function () {

    var productDescription = $('.js-readmore');
    var productDescriptionHeight = '';

    console.log($(productDescription).children());

    function readMoreInit() {
        var childHeight = [],
            childWidth = [];

        if($(productDescription).hasClass('active')) return;

        $(productDescription).children().each(function (indx, element) {
            console.log($(element).hasClass('readmore_btn'));
            if (!$(element).hasClass('readmore_btn')) {
                childHeight.push($(element).outerHeight());
                childWidth.push($(element).outerWidth());
            }
        });
        console.log(childHeight,childWidth);
        if (childHeight.length < 2 && childWidth.length < 2) {
            console.log('aasda');
            $(productDescription).css({
                height: '300px'
            })
                .addClass('readmore_disable');
            if ($(productDescription).children('.readmore_btn').length === 0) {
                $(productDescription).append('<div style="width: 100%" class="readmore_btn"><div class="readmore_text">Подробнее</div></div>');
            }
        } else {
            var minHeight = getMin(childHeight),
                minWidth = getMin(childWidth),
                maxHeight = getMax(childHeight),
                maxWidth = getMax(childWidth);

            $(productDescription)
                .addClass('readmore_disable')
                .css({height: minHeight});

            if ($(productDescription).children('.readmore_btn').length === 0) {
                $(productDescription).append('<div style="width: ' + (minWidth / (maxWidth * 0.01)) + '%" class="readmore_btn"><div class="readmore_text">Подробнее</div></div>')
            } else {
                $('.readmore_btn').css({width: (minWidth / (maxWidth * 0.01))+'%'})
            }
        }


        $('.readmore_btn').click(function () {
            $(productDescription).removeClass('readmore_disable').addClass('active').css({height: 'auto'});
        })
    }
    if(screen.width >= 992) {
        readMoreInit();
    } else {
        readMoreInitMobile();
    }
    $(window).resize(function () {
        if(screen.width >= 992){
            readMoreInit();
        } else {
            readMoreInitMobile();
            $('.readmore_btn').css({width: '100%'});
            $(productDescription).css({height: 'auto'});

            $(productDescription).children('.tile__text').css({height: '250px'})
        }
    });

    function readMoreInitMobile() {
        if($(productDescription).hasClass('active')) return;

        $(productDescription)
            .addClass('readmore_disable')
            .children('.tile__text')
            .css({height: '250px'})
            .append('<div style="width: 100%; height: 70px" class="readmore_btn"><div class="readmore_text">Подробнее</div></div>');
        $('.readmore_btn').click(function () {
            $(productDescription).removeClass('readmore_disable').addClass('active').children('.tile__text').css({height: 'auto'});
        })
    }


    function getMin(arr) {
        var arrLen = arr.length,
            minEl = arr[0];
        for (var i = 0; i < arrLen; i++) {
            if (minEl > arr[i]) {
                minEl = arr[i];
            }
        }
        return minEl;
    }

    function getMax(arr) {
        var arrLen = arr.length,
            maxEl = arr[0];
        for (var i = 0; i < arrLen; i++) {
            if (maxEl < arr[i]) {
                maxEl = arr[i];
            }
        }
        return maxEl;
    }


    // function init() {
    //     productDescriptionHeight = $(productDescription).innerHeight();
    //     var prevElemHeight;
    //
    //     if ($(productDescription).find('.tile__wrapper').length === 0) {
    //         if (screen.width >= 992) {
    //             prevElemHeight = $(productDescription).innerWidth() / 6;
    //         } else if (screen.width >= 768) {
    //             prevElemHeight = $(productDescription).innerWidth() / 4;
    //         } else if (screen.width >= 500 && screen.width < 768) {
    //             prevElemHeight = $(productDescription).innerWidth() / 2
    //         } else if (screen.width >= 320 && screen.width < 500) {
    //             prevElemHeight = $(productDescription).innerWidth();
    //         } else {
    //             $(this).outerHeight('auto');
    //             $(this).removeClass('product-desc__disable');
    //             return
    //         }
    //     } else if (screen.width >= 992) {
    //         prevElemHeight = $(productDescription).innerWidth() / 4;
    //     } else if (screen.width >= 768) {
    //         prevElemHeight = $(productDescription).innerWidth() / 1.5;
    //     } else if (screen.width >= 320 && screen.width < 500) {
    //         prevElemHeight = $(productDescription).innerWidth() * 2;
    //     } else {
    //         $(this).outerHeight('auto');
    //         $(this).removeClass('product-desc__disable');
    //         return
    //     }
    //
    //     if (prevElemHeight > productDescriptionHeight) {
    //         $(this).outerHeight('auto');
    //         $(this).removeClass('product-desc__disable');
    //         return
    //     }
    //
    //     $(productDescription).addClass('product-desc__disable');
    //     $(productDescription).innerHeight(prevElemHeight);
    //     $(productDescription).on('click', function () {
    //         if ($(this).hasClass('.product-desc__disable')) {
    //             $(this).outerHeight('auto');
    //             $(this).removeClass('product-desc__disable')
    //         } else {
    //             // $(this).outerHeight(prevElemHeight);
    //             // $(this).addClass('product-desc__disable')
    //         }
    //
    //     })
    // }
    //
    // init();
    // $(window).resize(function () {
    //     init();
    // })
});
//# sourceMappingURL=readmore.js.map
