/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        navigator.notification.alert('PhoneGap Alert', null, 'Title', 'Button');
    }
};

app.initialize();


var imagenes = new Array();
imagenes[0] = "img/banners/collares_ban.png";
imagenes[1] = "img/banners/bolsas_ban.png";
imagenes[2] = "img/banners/pashmina_ban.png";
var index = 0;

setInterval(function () {
    index++;
    if (index > 2)
    {
        index = 0;
    }
    $(".banners img").fadeOut('fast').fadeIn('fast').attr('src', imagenes[index]);
}, 12000);

function enableCategories()
{
    $("#categorias li").on('click', function (e)
    {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 200);
        $.loader({
            className: "blue-with-image-2",
            content: ''
        });
        $(".banners").hide();

        var id = $(this).attr('id').replace('cat_', '', $(this).attr('id'));

        $.ajax({
            'url': 'http://localhost/kwshop/index.php?/app/pcat/',
            'dataType': 'json',
            'type': 'POST',
            data: {
                categoria: id
            }
        }).done(function (data)
        {
            $.loader('close');
            $(".pantallas").html(data.html).show();
            $("#productos li a").on('click', function (e)
            {
                e.preventDefault();
                return false;
            });
        });

        return false;
    });

    $("#productos li").on('click', function ()
    {

        $.loader({
            className: "blue-with-image-2",
            content: ''
        });

        var id = $(this).find('a').attr('href').split('/').pop();

        $.ajax({
            'url': 'http://localhost/kwshop/index.php?/app/detalle/',
            'dataType': 'json',
            'type': 'POST',
            data: {
                producto: id
            }
        }).done(function (data)
        {
            $.loader('close');
            $(".pantallas").html(data.html).show();
            $("#productos li a").on('click', function (e)
            {
                e.preventDefault();
                return false;
            });
        });

    });
}

$("#logo").on('click', function ()
{
    $(".pantallas").hide();
    $(".banners").show();
    $("#menu li").css('opacity', '0.5');
});

$("#perfil").on('click', function (e)
{
    e.preventDefault();
    return false;
});

$("#producto").on('click', function (e)
{
    e.preventDefault();
    $('html,body').animate({
        scrollTop: 0
    }, 1000);
    $("#menu li").css('opacity', '0.45');
    $(this).css('opacity', '1.0');
    $("#search").animate({'margin-top': '-5px'}, 500, function () {
        $("#search").focus();
    });
    $.loader({
        className: "blue-with-image-2",
        content: ''
    });

    $(".banners").hide();
    $.ajax({
        'url': 'http://localhost/kwshop/index.php?/app/categorias',
        'dataType': 'json',
        'type': 'POST',
    }).done(function (html)
    {
        $(".pantallas").html(html.html).show();

        enableCategories();

        $.loader('close');
    });
    return false;
});

$("#tiendas").on('click', function (e)
{
    e.preventDefault();
    $('html,body').animate({
        scrollTop: 0
    }, 1000);
    $("#menu li").css('opacity', '0.45');
    $(this).css('opacity', '1.0');
    $(".banners").hide();
    $.ajax({
        url: 'http://localhost/kwshop/app/tiendas',
        dataType: 'json',
        type: 'GET'
    }).done(function (data) {
        $('.pantallas').html(data.scripts);
        $("#arco").html(data.html);
    });
    return false;

})