var cercanos = []
var markers = []
var direccion = [];
var info_suc = [];

$(document).ready(function () {
    initialize('Ciudad de México', false);
});

$('#direccion').live('keyup keydown keypress', function (e) {
    if (e.keyCode == 13)
    {
        $("#localizar").click();
    }
});

$("#localizar").live('click', function (e)
{
    e.preventDefault();
    var direccion = $.trim($("#direccion").val());
    if (direccion.length > 0)
    {
        if (!isNaN(direccion))
        {
            direccion += ',México';
        }
        initialize(direccion);
    }
    return false;
});

function initialize(address, flag) {
    var geoCoder = new google.maps.Geocoder(address)
    var request = {address: address};
    geoCoder.geocode(request, function (result, status) {
        var final = result[0];
        for (var i = 0; i < result.length; i++)
        {
            if (result[i].formatted_address.indexOf('México') != -1)
            {
                final = result[i];
                break;
            }
        }
        var latlng = new google.maps.LatLng(final.geometry.location.lat(), final.geometry.location.lng());
        icon = {
            url: 'http://www.kiwishop.mx/src/img/kiwi_mkt.png',
            scaledSize: new google.maps.Size(53 / 2, 63 / 2)
        }
        $("#localizador").data('pos', latlng);
        var myOptions = {
            zoom: 5, center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        infowindow = new google.maps.InfoWindow({content: '', maxWidth: 500});
        findSucursales();
        if (flag != false)
        {
            $(".sucursal").hide();
            var arco = findNear();
            var pos = (arco + "").replace('(', '', arco + "").replace(')', '', arco + "");
            var latlang = new google.maps.LatLng(parseFloat(pos.split(',')[0]), parseFloat(pos.split(',')[1]));
            var id = '#li-' + latlang.toUrlValue();
            var _id = $.trim(id.replace('(', '', id).replace(')', '', id)).replace(' ', '', id);
            $(_id).find('.sucursal').slideToggle();
        }

        if (arco != null)
        {

            map.setCenter(arco);
            map.setZoom(15);
        }
    });
}

function toggleBounce(marker) {

    if (marker.getAnimation() != null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function findNear()
{
    var pos = $("#localizador").data('pos'),
            markers = $("#localizador").data('markers'),
            closest;
    $.each(markers, function () {
        var distance = google.maps.geometry.spherical
                .computeDistanceBetween(this.getPosition(), pos);
        cercanos[this.getPosition()] = distance;
        if (!closest || closest.distance > distance) {
            closest = {
                marker: this,
                distance: distance
            }
        }
    });
    cercanos.sort(function (a, b) {
        return a - b
    });
    if (closest) {
        map.setCenter(closest.marker.getPosition());
        showSucursal(closest.marker);
        return closest.marker.getPosition();
    }
    return null;
}

function createMarker(lat, lng) {
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(lat, lng),
        icon: icon, animation: google.maps.Animation.BOUNCE
    });
    google.maps.event.addListener(marker, 'click', function () {
        showSucursal(marker);
    });
    return marker;
}

function showSucursal(marker)
{
    $(".sucursal").hide();
    $(".sucursal").each(function ()
    {
        var pos = $.trim($(this).attr('coord'));
        var lat = parseFloat(pos.split(',')[0]);
        var lng = parseFloat(pos.split(',')[1]);
        var latlang = new google.maps.LatLng(lat, lng);
        if (latlang.toUrlValue() === marker.position.toUrlValue())
        {
            $(this).show();
            return;
        }

    })
}

