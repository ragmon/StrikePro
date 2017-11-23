$(document).ready(function () {

    var productDescription = $('.js-readmore');
    var productDescriptionHeight = '';

    function readMoreInit() {
        var childHeight = [],
            childWidth = [];

        // if($(productDescription).hasClass('active')) return;

        $(productDescription).children().each(function (indx, element) {
            console.log($(element).hasClass('readmore_btn'));
            if (!$(element).hasClass('readmore_btn')) {
                childHeight.push($(element).outerHeight());
                childWidth.push($(element).outerWidth());
            }
        });
        console.log(childHeight,childWidth);
        if (childHeight.length < 2 && childWidth.length < 2) {
            if($(productDescription).children('.tile__text').outerHeight() < 300) return
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

            console.log($(productDescription).children('.tile__text').outerHeight());
            console.log($(productDescription).children('.tile__text'));
            console.log(minHeight);
            if(
                $(productDescription).children('.tile__text').outerHeight() <
                $(productDescription).children('.tile__wrapper').outerHeight() ||
                $(document).width() < 992
            ){
                $(productDescription)
                    .removeClass('readmore_disable')
                    .css({height: 'auto'});
                return
            }

            $(productDescription)
                .addClass('readmore_disable')
                .css({height: minHeight});

            if ($(productDescription).children('.readmore_btn').length === 0) {
                $(productDescription).append('<div style="width: 50%" class="readmore_btn"><div class="readmore_text">Подробнее</div></div>')
            }
        }


        $('.readmore_btn').click(function () {
            $(productDescription).removeClass('readmore_disable').addClass('active').css({height: 'auto'}).children('.tile__text').css({height: 'auto'});
        })
    }
    if($(document).width() >= 992) {
        readMoreInit();
    } else {
        readMoreInitMobile();
    }
    $(window).resize(function () {
        if($(document).width() >= 992){
            readMoreInit();
        } else {
            readMoreInitMobile();
            $('.readmore_btn').css({width: '100%'});
            $(productDescription).css({height: 'auto'});

            $(productDescription).addClass('readmore_disable').children('.tile__text').css({height: '250px'})
        }
    });

    function readMoreInitMobile() {
        if($(productDescription).hasClass('active')) return;
        if($(productDescription).children('.tile__text').outerHeight() < 250) return

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

});