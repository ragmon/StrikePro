
//var Location;
// карта
var map;
// массив с координатами и id маркеров
var points = [];
// коллекция с маркерами карты
var ObjectsPoints = [];
var markersCollection;
// стили для маркеров карты
var markerStyle = {
    iconLayout: 'default#imageWithContent',
    iconImageHref: yandexMap_config.iconImageHref,
    iconImageSize: yandexMap_config.iconImageSize,
    iconImageOffset: yandexMap_config.iconImageOffset
};

// инициализация карты
function init() {
    map = new ymaps.Map("GMap", {
        center: [55.76, 37.64],
        zoom: 10
    }, {
        searchControlProvider: 'yandex#search'
    });
    // создание маркеров, на входи принимает ссылку на обект
    markerInit(Location[Object.keys(Location)[0]]);
}
// конструктор обекта с координатами и id маркеров
var pointsConstruct = function (lat, lng, id) {
    this.coords = [lat, lng];
    this.id = id;
};
// создание маркеров
function markerInit(locationOBJ) {
    clearMarkers(); // метод очистки коллекции маркеров

    city = locationOBJ, // переданный в функцию обект
        store = city.stores, // список городов
        markersCollection = new ymaps.ObjectManager({
            clusterize: false
        }); // создаем экземпляр гео коллекции, в ней будут хранится маркеры
    // метод выставляет центр карты и делает зум
    map.setCenter([city.center.lat, city.center.lng], 10, {
        checkZoomRange: true
    });

    // заполняем массив с информацией о координатах и id маркеров
    for (var i = 0; i < store.length; i++) {
        points.push(new pointsConstruct(store[i].lat, store[i].lng, store[i].id));
    }

    // добавляем маркеры в гео коллекцию
    for (var i = 0, l = points.length; i < l; i++) {
        ObjectsPoints.push({
            type: 'Feature',
            id: points[i].id,
            geometry: {
                type: 'Point',
                coordinates: points[i].coords
            },
            options: {
                iconLayout: 'default#imageWithContent',
                iconImageHref: yandexMap_config.iconImageHref,
                iconImageSize: [36, 43],
                iconImageOffset: [-20, -20]
            },
            properties: {
                // Контент метки.
                iconContent: "<span class='yamap_point'>" + points[i].id + "</span"
            }
        });
    }

    markersCollection.add(ObjectsPoints);
    map.geoObjects.add(markersCollection);

    // Функция вызываемая при наведении на маркер
    function onObjectEvent(e) {
        var objectId = e.get('objectId');
        if (e.get('type') == 'mouseenter') {
            changeMarker(objectId, "hover")
            LocationItemHover(objectId);

        } else {
            changeMarker(objectId)
            LocationItemOnHover(objectId);
        }
    }
    // Обработчик события наведения на маркер
    markersCollection.objects.events.add(['mouseenter', 'mouseleave'], onObjectEvent);


}


ymaps.ready(init);



function clearMarkers() {
    if (markersCollection) {
        markersCollection.remove(ObjectsPoints);
        ObjectsPoints.splice(0, ObjectsPoints.length);
        points.splice(0, points.length);
    }
}

function changeMarker(objectId, status) {
    clearMarker();
    if (status == "hover") {
        markersCollection.objects.setObjectOptions(objectId, {
            iconImageHref: yandexMap_config.iconImageHoverHref
        });
    } else {
        markersCollection.objects.setObjectOptions(objectId, {
            iconImageHref: yandexMap_config.iconImageHref
        });
    }
}

function clearMarker() {
    for (var i = 0; i < ObjectsPoints.length; i++)
        markersCollection.objects.setObjectOptions(i + 1, {
            iconImageHref: yandexMap_config.iconImageHref
        });

}
$(".location__tabs li a").on("click", function (event) {
    event.preventDefault();
    $(".location__item").removeClass("active");
    var $this = $($(this));
    var link = $this.attr("href");
    if ($this.closest("li").hasClass("active")) {
        return
    }
    $(".location__tabs li").removeClass("active");
    $this.closest("li").addClass("active");
    $(".location__list").removeClass("active");
    $(link).addClass("active");

    link = link.substring(1);
    markerInit(Location[link]);
})




var hoverColor = "#eaeaea";


$(".location__item").on("click", function (event) {
    var itemList = $(".location__item");

    for (var i = 0; i < itemList.length; i++) {
        $(itemList[i]).removeClass("active");
    }
    if ($(this).hasClass("active")) {
        return
    }
    $(this).addClass("active");

    var objectId = parseInt($(this).find(".location__title-num").text(), 10);
    clearMarker();
    changeMarker(objectId, "hover");

})

$(".location__item").hover(LocationItemHover, LocationItemOnHover);

function LocationItemHover(id) {

    if ($(this).hasClass("active")) {
        return
    }
    $(".location__item.active").css({
        "background-color": "transparent"
    })
    if ($(this).hasClass("location__item")) {
        $(this).css({
            "background-color": hoverColor
        })
        var objectId = parseInt($(this).find(".location__title-num").text(), 10);
        clearMarker();
        changeMarker(objectId, "hover");
    }
    if (id) {
        var arrayIdLocationItem = [];
        var num = $(".location__list.active").find(".location__item");
        for (var i = 0; i < num.length; i++) {
            if (id == i + 1) {
                $(num[i]).css({
                    "background-color": hoverColor
                })
            }
        }
        return
    }
}

function LocationItemOnHover(id) {
    if ($(this).hasClass("active")) {
        return
    }
    $(".location__item.active").css({
        "background-color": hoverColor
    })
    if ($(this).hasClass("location__item")) {
        $(this).css({
            "background-color": "transparent"
        })
        clearMarker();
        var objectId = parseInt($(".location__item.active").find(".location__title-num").text(), 10);
        clearMarker();
        changeMarker(objectId, "hover");
    }
    if (id) {
        var num = $(".location__list.active").find(".location__item");
        for (var i = 0; i < num.length; i++) {
            if ($(num[i]).hasClass("active")) {
                clearMarker();
                changeMarker(i + 1, "hover");
            } else if (id == i + 1) {
                $(num[i]).css({
                    "background-color": "transparent"
                })
            }
        }
        return
    }


}

//# sourceMappingURL=yandexMap.js.map
