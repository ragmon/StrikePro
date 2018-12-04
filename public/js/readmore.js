$(document).ready(function () {

    var $readmoreWrapper = $('.readmore-wrapper');
    var $readmoreContent = $('.readmore-content');
    var $readmoreButtonWrapper = $('.readmore-button_wrapper');
    var $readmoreButton = $('.readmore-button');

    // readmore-button_wrapper--half
    function CloseReadMoreContent() {
        var MinHeight = ($($readmoreWrapper).width() / 4).toFixed();
        console.log(MinHeight);
        console.log($($readmoreWrapper).height());
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
        } else if (!$($readmoreButtonWrapper).hasClass('readmore-button_wrapper--close')) {
            $($readmoreButtonWrapper).addClass('hidden');
        } else if ($($readmoreWrapper).height() <= MinHeight) {
            $($readmoreButtonWrapper).addClass('hidden');
        }
    }

    function OpenReadMoreContent() {
        $($readmoreContent).css('height', 'auto');
        $($readmoreContent).css('display', 'inline');
    }

    function init() {

        console.log('$readmoreContent: ', $readmoreContent);
        if (!$readmoreWrapper.length) {
            return null;
        }
        if($readmoreWrapper["0"].children.length === 3) {
            $($readmoreButtonWrapper).addClass('readmore-button_wrapper--half');
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
                if ($($readmoreButtonWrapper).hasClass('readmore-button_wrapper--close')) {
                    CloseReadMoreContent();
                }
            }));
    }

    init()
});

//# sourceMappingURL=readmore.js.map
