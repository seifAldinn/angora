(function($) {
    "use strict";

    var parameters = [];

    var settings_block = '<div class="block-settings-wrapper">' +
        '<div id="block_settings" class="block_settings">' +
        '<section>' +
        '<h3>HEADER STYLE</h3>' +
        '<ul>' +
        '<li class="header-slide"><a href="slide.html">Image Slideshow</a></li>' +
        '<li class="header-image"><a href="image.html">Single Image</a></li>' +
        '<li class="header-video"><a href="video.html">Video Background</a></li>' +
        '</ul>' +
        '<hr>' +
        '<h3>COLORS</h3>' +
        '<span class="red" 			title="Red" 		data-color="#f25454" />' +
        '<span class="blue" 		title="Blue" 		data-color="#4e9cb5" />' +
        '<span class="green" 		title="Green" 		data-color="#24bca4" />' +
        '<span class="turquoise" 	title="Turquoise" 	data-color="#46cad7" />' +
        '<span class="purple" 		title="Purple" 		data-color="#c86f98" />' +
        '<span class="orange" 		title="Orange" 		data-color="#ee8f67" />' +
        '<span class="yellow" 		title="Yellow" 		data-color="#e4d20c" />' +
        '<span class="grey" 		title="Grey" 		data-color="#6b798f" />' +
        '</section>' +
        '<a href="#" id="settings_close">Close</a>' +
        '</div>' +
        '</div>';

    //Init color buttons
    function initColor() {
        $(".block-settings-wrapper section span").on("click", function() {
            var cls = $(this).attr("class");
            var color = $(this).data("color");

            //CSS
            $("link.colors").attr('href', 'layout/colors/' + cls + '.css');

            //Logo
            $('.navbar .navbar-brand > img').attr('data-alt', 'images/logo/logo-' + cls + '.png');
            $('.navbar.floating .navbar-brand > img').attr('src', 'images/logo/logo-' + cls + '.png');

            //Icon
            $('#about .icon > img').attr('src', 'images/icon/icon-' + cls + '.png');

            //Google Maps
            $("#google-map").data("color", color);
            $("#google-map").data("marker", "layout/images/map-marker-" + cls + ".png");

            $.AngoraTheme.mapCreate();
        });
    }

    //Init open/close button	
    function initClose() {
        parameters.push("opened");

        $("#settings_close").on("click", function(e) {
            $("body").toggleClass("opened-settings");

            if (!$.cookies.get("opened")) {
                $.cookies.set("opened", "opened-settings");
            } else {
                $.cookies.del("opened");
            }

            e.preventDefault();
        });
    }

    //Init cookies
    function initCookies() {
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                var name = parameters[key];
                var parameter = $.cookies.get(name);

                if (parameter) {
                    $("body").addClass(parameter);
                }
            }
        }
    }

    //Init
    $("body").prepend(settings_block);
    initColor();
    initClose();
    initCookies();

    //Activate header style
    var url = window.location.href;
    var ind = url.lastIndexOf("/");
    url = url.substr(ind + 1);

    ind = url.indexOf(".");
    url = url.substr(0, ind);

    if (url === "") {
        url = "slide";
    }

    var $page = $("li.header-" + url);

    $page.addClass("active");
    $page.append('<i class="fas fa-check"></i>');

})(jQuery);