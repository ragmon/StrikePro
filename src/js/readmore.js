$(document).ready(function () {

    var readMoreWrapper = $('.js-readmore');
    var readMoreBtn = null;
    var readMoreBtnWrapper = null;
    var currentLineHeight = parseInt($(readMoreWrapper).css('line-height'));
    var currentHeight = parseInt($(readMoreWrapper).css('height'));

    function initToggleDescription() {

        if (currentHeight > (currentLineHeight * 4)) {
            $(readMoreWrapper).css({height: (currentLineHeight * 4) + 'px'})
        } else {
            $(readMoreWrapper).css({height: 'auto'})
        }
    }


    function toggleDescriptionHandler() {
        if ($(readMoreWrapper).hasClass('readmore_close')) {
            $(readMoreBtn).text('Свернуть');
            $(readMoreWrapper).removeClass('readmore_close').addClass('readmore_open').css({height: 'auto'})
        } else {
            $(readMoreBtn).text('Подробнее');
            $(readMoreWrapper).removeClass('readmore_open').addClass('readmore_close').css({height: (currentLineHeight * 4) + 'px'})
        }
    }

    function superToggleDescription() {
        var height = parseInt($(readMoreWrapper).css('width')) / 4;
        if (currentHeight > height) {
            console.log('superToggleDescription');
            if ($(document).width() >= 992) {
                console.log(height);
                $(readMoreBtnWrapper).css({width: '50%'});
                $(readMoreWrapper).addClass('readmore_close').css({height: height + 'px'});
            } else {
                $(readMoreBtnWrapper).css({width: '100%'});
                $(readMoreWrapper).addClass('readmore_close').css({height: (getHeightDescription() + currentLineHeight * 4) + 'px'});
            }
        } else {
            $(readMoreWrapper).css({height: 'auto'})
        }
    }

    function superToggleDescriptionHandler() {
        if ($(readMoreWrapper).hasClass('readmore_close')) {
            $(readMoreBtn).text('Свернуть');
            $(readMoreBtnWrapper).css({width: '100%'});
            $(readMoreWrapper).removeClass('readmore_close').addClass('readmore_open').css({height: 'auto'})
        } else {
            $(readMoreBtn).text('Подробнее');
            $(readMoreWrapper).removeClass('readmore_open').addClass('readmore_close');
            if ($(document).width() >= 992) {
                $(readMoreBtnWrapper).css({width: '50%'});
                $(readMoreWrapper).css({height: (parseInt($(readMoreWrapper).css('width')) / 4) + 'px'});
            } else {
                $(readMoreBtnWrapper).css({width: '100%'});
                $(readMoreWrapper).css({height: (getHeightDescription() + currentLineHeight * 6) + 'px'});
            }
        }
    }

    function responsiveInit() {
        window.addEventListener('resize', function () {
            console.log('resize');
            if ($(readMoreWrapper).hasClass('readmore_close')) {
                superToggleDescription();
            }
        });

    }

    function getHeightDescription() {
        var childHeight = [],
            childWidth = [];

        $(readMoreWrapper).children().each(function (indx, element) {
            if (!$(element).hasClass('readmore_btn-wrap')) {
                childHeight.push($(element).outerHeight());
                childWidth.push($(element).outerWidth());
            }
        });

        var minHeight = getMin(childHeight),
            minWidth = getMin(childWidth),
            maxHeight = getMax(childHeight),
            maxWidth = getMax(childWidth);

        console.log('minHeight:', minHeight);
        console.log('minWidth:', minWidth);
        console.log('maxHeight:', maxHeight);
        console.log('maxWidth:', maxWidth);
        return minHeight;
    }

    init();

    function init() {
        if ($(readMoreWrapper).children().length === 1) {
            addReadmoreBtn('100%', toggleDescriptionHandler, '');
            initToggleDescription();
        } else if ($(readMoreWrapper).children().length === 2) {
            if ($(document).width() >= 992) {
                addReadmoreBtn('50%', superToggleDescriptionHandler, 'readmore_btn-wrap--white');
            } else {
                addReadmoreBtn('100%', superToggleDescriptionHandler, 'readmore_btn-wrap--white');
            }
            superToggleDescription();
            responsiveInit()
        }
    }

    function addReadmoreBtn(btnWidth, clickHandler, wrapperMode) {
        var btn = '<div style="width: ' + btnWidth + '" class="readmore_btn-wrap ' + wrapperMode + '">\n' +
            '              <btn class="readmore_btn js-readmore_btn item-more">Подробнее</btn>\n' +
            '            </div>';

        $(readMoreWrapper).append(btn);
        readMoreBtn = $('.js-readmore_btn');
        readMoreBtnWrapper = $('.readmore_btn-wrap');
        $(readMoreBtn).on('click', clickHandler);
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


