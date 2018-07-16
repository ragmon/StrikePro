
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
                } else if (_num === row_length) {
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


    if (tile_list.length !== 0 && location.pathname === '/') {
        tile_check();
    }
})
//# sourceMappingURL=tileFilter.js.map
