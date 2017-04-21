//var Location = {
//    "Moscow": {
//        "id": 1, // City ID
//        "name": "Москва",
//        "center": {
//            "lat": 55.755826, // latitude (широта)
//            "lng": 37.6173
//        },
//        "stores": [
//            {
//                "id": 1, // Store   
//                "lat": 55.679603, // latitude (широта)
//                "lng": 37.312771 // longitude (долгота)                
//            },
//            {
//                "id": 2, // Store  
//                "lat": 55.761849, // latitude (широта)
//                "lng": 37.6365888 // longitude (долгота)
//
//            },
//            {
//                "id": 3, // Store
//                "lat": 55.6800736, // latitude (широта)
//                "lng": 37.732702 // longitude (долгота)                
//            }
//        ]
//    },
//    "Spb": {
//        "id": 2, // City ID
//        "name": "Санкт-Петербург",
//        "center": {
//            "lat": 59.9342802, // latitude (широта)
//            "lng": 30.3350986
//        },
//        "stores": [
//            {
//                "id": 1, // Store      
//                "lat": 59.836173, // latitude (широта)
//                "lng": 30.3676546 // longitude (долгота)                
//            },
//            {
//                "id": 2, // Store  
//                "lat": 59.9860228, // latitude (широта)
//                "lng": 30.3213429 // longitude (долгота)               
//            }
//        ]
//    },
//    "Novosibirsk": {
//        "id": 3, // City ID
//        "name": "Новосибирск",
//        "center": {
//            "lat": 55.0083526, // latitude (широта)
//            "lng": 82.9357327
//        },
//        "stores": [
//            {
//                "id": 1, // Store 
//                "lat": 55.045832, // latitude (широта)
//                "lng": 82.930247 // longitude (долгота)
//
//            },
//            {
//                "id": 2, // Store  
//                "lat": 54.9494949, // latitude (широта)
//                "lng": 82.8374367 // longitude (долгота)                
//            }
//        ]
//    },
//    "Kazan": {
//        "id": 4, // City ID
//        "name": "Казань",
//        "center": {
//            "lat": 55.8304307, // latitude (широта)
//            "lng": 49.0660806
//        },
//        "stores": [
//            {
//                "id": 1, // Store  
//                "lat": 55.8362801, // latitude (широта)
//                "lng": 49.1121332 // longitude (долгота)                
//            },
//            {
//                "id": 2, // Store  
//                "lat": 55.8435833, // latitude (широта)
//                "lng": 49.094269 // longitude (долгота)                
//            }
//        ]
//    },
//    "Samara": {
//        "id": 5, // City ID
//        "name": "Самара",
//        "center": {
//            "lat": 53.2415041, // latitude (широта)
//            "lng": 50.2212463
//        },
//        "stores": [
//            {
//                "id": 1, // Store        
//                "lat": 53.240493, // latitude (широта)
//                "lng": 50.235174 // longitude (долгота)                
//            },
//            {
//                "id": 2, // Store    
//                "lat": 53.2420649, // latitude (широта)
//                "lng": 50.239387 // longitude (долгота)                
//            }
//        ]
//    }
//}

var Location;
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
    iconImageHref: 'images/marker_YMAP.png',
    iconImageSize: [36, 43],
    iconImageOffset: [-10, -10]
}

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
}
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
                iconImageHref: 'image/marker_YMAP.png',
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
        console.log(markersCollection)
        markersCollection.remove(ObjectsPoints)
        ObjectsPoints.splice(0, ObjectsPoints.length);
        points.splice(0, points.length);
    }
}

function changeMarker(objectId, status) {
    clearMarker()
    if (status == "hover") {
        markersCollection.objects.setObjectOptions(objectId, {
            iconImageHref: 'image/marker_YMAP-hover.png'
        });
    } else {
        markersCollection.objects.setObjectOptions(objectId, {
            iconImageHref: 'image/marker_YMAP.png'
        });
    }
}

function clearMarker() {
    for (var i = 0; i < ObjectsPoints.length; i++)
        markersCollection.objects.setObjectOptions(i + 1, {
            iconImageHref: 'image/marker_YMAP.png'
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
