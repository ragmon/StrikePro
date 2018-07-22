$(document).ready(function () {

    var $readmoreWrapper = $('.readmore-wrapper');
    var $readmoreContent = $('.readmore-content');
    var $readmoreButtonWrapper = $('.readmore-button_wrapper');
    var $readmoreButton = $('.readmore-button');


    function CloseReadMoreContent() {
        var MinHeight = ($($readmoreWrapper).width() / 4).toFixed();
        console.log(MinHeight);
        if ($($readmoreWrapper).height() > MinHeight) {
            if (window.innerWidth >= 768) {
                $($readmoreContent).height(MinHeight);
            } else {
                $($readmoreContent).height(200);
            }
            $($readmoreContent).css('display', 'block');
            if ($($readmoreButtonWrapper).hasClass('hidden')) {
                $($readmoreButtonWrapper).removeClass('hidden');
            }
        } else if(!$($readmoreButtonWrapper).hasClass('readmore-button_wrapper--close')){
            $($readmoreButtonWrapper).addClass('hidden');
        }
    }

    function OpenReadMoreContent() {
        $($readmoreContent).css('height', 'auto');
        $($readmoreContent).css('display', 'inline');
    }

    CloseReadMoreContent();
    $($readmoreButtonWrapper).addClass('readmore-button_wrapper--close');

    $($readmoreButton).on('click', $.debounce(300, true, function (e) {
        if ($($readmoreButtonWrapper).hasClass('readmore-button_wrapper--close')) {
            OpenReadMoreContent();
            $($readmoreButtonWrapper).removeClass('readmore-button_wrapper--close');
            $($readmoreButton).text('СВЕРНУТЬ');
        } else {
            CloseReadMoreContent();
            $($readmoreButtonWrapper).addClass('readmore-button_wrapper--close');
            $($readmoreButton).text('ПОДРОБНЕЕ');

        }
    }));

    $(window)
        .resize($.debounce(300, false, function (e) {
            if ($('.readmore-button_wrapper').hasClass('readmore-button_wrapper--close')) {
                CloseReadMoreContent();
            }
        }));

});
