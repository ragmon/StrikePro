jQuery("#input_range-1").slider({
    min: 0,
    max: 15,
    values: [0, 15],
    range: true
});
jQuery("#input_range-2").slider({
    min: 0,
    max: 11,
    values: [0, 11],
    range: true
});
jQuery("#input_range-3").slider({
    min: 0,
    max: 6,
    values: [0, 6],
    range: true
});


$(".productList__filtrBlock--close").on("click", function () {
    var filtr = $(".productList__filtrBlock");
    filtr.slideToggle();
    $(".productList__filtrBlock--close").toggleClass("active");
})

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
        } else if ($(this).hasClass('is-active')){
            event.preventDefault();
            $(this).removeClass('is-active');
            $(this).next().toggleClass('is-open').toggle();
        } else {
            event.preventDefault();
        }
    });
});

$(".headerNav__toggle").on("click", function(){
    $(this).toggleClass("active")
    if($(this).hasClass("active")){
        $(".header__top").addClass("nav__active");
        $("body").addClass("nav__active")
    } else {
        $(".header__top").removeClass("nav__active");
        $("body").removeClass("nav__active");
    }
    
})
