(function($) {

    "use strict";

    /* Default Variables */
    var AngoraOptions = {
        parallax: true,
        loader: true,
        animations: true,
        scrollSpeed: 700,
        navigation: 'sticky', //sticky, default
        zoomControlDiv: null
    };

    if (typeof Angora !== 'undefined') {
        $.extend(AngoraOptions, Angora);
    }

    $.AngoraTheme = {

        //Initialize
        init: function() {
            this.loader();
            this.animations();
            this.navigation();
            this.intro();
            this.portfolio();
            this.contact();
            this.map();
            this.parallax();
            this.videos();
            this.imageSlider();
            this.contentSlider();
            this.blog();
            this.errorPage();
            this.shortCodes();
        },

        //Page Loader
        loader: function() {
            if (AngoraOptions.loader) {
                var loaderHide = function() {
                    $(window).trigger('angora.loaded');

                    $('.page-loader').delay(1000).fadeOut('slow', function() {
                        $(window).trigger('angora.complete');
                    });
                };

                //Loadsafe
                $(window).on('load', function() {
                    window._loaded = true;
                });

                window.loadsafe = function(callback) {
                    if (window._loaded) {
                        callback.call();
                    } else {
                        $(window).on('load', function() {
                            callback.call();
                        });
                    }
                };

                //Hide loader
                if ($('#intro').attr('data-type') === 'video' && !Modernizr.touch) {
                    $(window).on('angora.intro-video', function() {
                        window.loadsafe(function() {
                            loaderHide();
                        });
                    });
                } else {
                    $(window).on('load', function() {
                        loaderHide();
                    });
                }
            } else {
                $('.page-loader').remove();
                $(window).trigger('angora.loaded');

                setTimeout(function() {
                    $(window).trigger('angora.complete');
                }, 1);
            }
        },

        //Animations
        animations: function() {
            new WOW().init();
        },

        //Navigation
        navigation: function() {
            //Line height
            $('.navbar .navbar-brand img').waitForImages(function() {
                var height = parseInt($(this).height(), 10);
                $('.navbar .navbar-nav > li > a, .navbar .navbar-social').css('line-height', height + 'px');

                //Responsive menu
                var $toggle = $('.navbar .navbar-toggle'),
                    toggle_height = parseInt($toggle.height(), 10);

                $('.navbar .navbar-header').css('height', height + 'px');
                $toggle.css('margin-top', parseInt((height - (toggle_height + 2)) / 2, 10) + 'px');
            });

            //Floating menu
            var floatingMenuShow = function() {
                var $that = $('.navbar.floating'),
                    $old = $('.navbar:not(.floating)');

                if (!$that.hasClass('process')) {
                    dropdownHide();

                    $old.animate({
                        opacity: 0
                    }, {
                        duration: 75,
                        queue: false,
                        complete: function() {
                            $that.find('img[data-alt]').each(function() {
                                $(this).attr('src', $(this).attr('data-alt')).removeAttr('data-alt');
                                new retinajs(this);
                            });
                        }
                    });

                    $that.addClass('process').addClass('positive')
                        .animate({
                            top: 0
                        }, {
                            duration: 500,
                            queue: false
                        });

                    setTimeout(function() {
                        $that.removeClass('process');
                    }, 200);
                }
            };

            var floatingMenuHide = function() {
                var $that = $('.navbar.floating'),
                    $old = $('.navbar:not(.floating)');

                if (!$that.hasClass('process')) {
                    dropdownHide();

                    $that.addClass('process').removeClass('positive').addClass('negative')
                        .animate({
                            top: $that.data('top')
                        }, {
                            duration: 500,
                            queue: false
                        });

                    $old.animate({
                        opacity: 1
                    }, {
                        duration: 250,
                        queue: false
                    });
                    $old.find('.navbar-collapse.collapse.in').removeClass('in');

                    setTimeout(function() {
                        $that.removeClass('process');
                    }, 200);
                }
            };

            var floatingMenu = function() {
                var isFloating = $('.navbar').hasClass('positive');

                if ($(document).scrollTop() > 0 && !isFloating) {
                    floatingMenuShow();
                } else if ($(document).scrollTop() === 0 && isFloating) {
                    floatingMenuHide();
                }
            };

            //Dropdown menu
            var dropdownHide = function() {
                if ($('.navbar .dropdown.open').length === 0) {
                    return;
                }

                $('.navbar .dropdown.open').each(function() {
                    $(this).find('.dropdown-menu').animate({
                        opacity: 0
                    }, {
                        duration: 150,
                        queue: false,
                        complete: function() {
                            $(this).parent().removeClass('open');
                        }
                    });
                });
            };

            var dropdownShow = function($that) {
                $that.find('.dropdown-menu').css({
                    opacity: 0
                });
                $that.addClass('open').find('.dropdown-menu').animate({
                    opacity: 1
                }, {
                    duration: 150,
                    queue: false
                });
            };

            //Collapse menu
            var collapseMenu = function() {
                if ($('.navbar-collapse.collapse.in').length > 0) {
                    $('.navbar-collapse.collapse.in').each(function() {
                        $(this).parent().find('.navbar-toggle').click();
                    });
                }
            };

            //Resize window
            $(window).on('resize', function() {
                collapseMenu();
                dropdownHide();
            });

            $(window).on('scroll', function() {
                collapseMenu();
            });

            //Navbar toggle
            $('.navbar .navbar-toggle').on("click", function(e) {
                e.preventDefault();
                dropdownHide();
            });

            //Create floating navigation bar
            if (AngoraOptions.navigation === 'sticky') {
                //Floating menu
                $('.navbar').clone().prependTo('body').addClass('floating navbar-fixed-top').find('.navbar-toggle').attr('data-target', '#navbar-collapse-alt').parent().parent().find('.navbar-collapse').attr('id', 'navbar-collapse-alt');

                $(window).on('load', function() {
                    floatingMenu();

                    //Set top position
                    var $floating = $('.navbar.floating'),
                        $nav = $('.navbar:not(.floating)'),
                        navHeight = parseInt($nav.outerHeight(), 10) + 20;

                    $floating.data('top', -navHeight).css('top', (-navHeight) + 'px');
                });

                $(window).on('scroll', function() {
                    floatingMenu();
                });
            } else {
                //Fixed menu
                $('.navbar').removeClass('navbar-fixed-top').css({
                    position: 'absolute'
                });
            }

            //Dropdown menu
            var dropdownTimer, dropdownExists = false;

            $('.dropdown').hover(function() {
                if (!$(this).parent().parent().hasClass('in') && !$(this).parent().parent().hasClass('collapsing')) {
                    clearTimeout(dropdownTimer);
                    if ($(this).hasClass('open')) {
                        return;
                    }
                    if (dropdownExists) {
                        dropdownHide();
                    }
                    dropdownExists = true;
                    dropdownShow($(this));
                }
            }, function() {
                if (!$(this).parent().parent().hasClass('in')) {
                    dropdownTimer = setTimeout(function() {
                        dropdownHide();
                        dropdownExists = false;
                    }, 500);
                }
            });

            $(document).on('click', '.navbar-collapse.in .dropdown > a', function(e) {
                e.preventDefault();
                var $parent = $(this).parent();

                if (!$parent.hasClass('open')) {
                    dropdownShow($parent);
                } else {
                    dropdownHide();
                }
            });

            //Scroll to anchor links
            $('a[href^=\\#]').on("click", function(e) {
                if ($(this).attr('href') !== '#' && !$(e.target).parent().parent().is('.navbar-nav') && !$(this).attr('data-toggle')) {
                    $(document).scrollTo($(this).attr('href'), AngoraOptions.scrollSpeed, {
                        offset: {
                            top: -85,
                            left: 0
                        }
                    });
                    e.preventDefault();
                }
            });

            //Navigation
            $(document).ready(function() {
                $('.navbar-nav').onePageNav({
                    currentClass: 'active',
                    changeHash: false,
                    scrollSpeed: AngoraOptions.scrollSpeed,
                    scrollOffset: 85,
                    scrollThreshold: 0.5,
                    filter: 'li a[href^=\\#]',
                    begin: function() {
                        collapseMenu();
                    }
                });
            });

            if (document.location.hash && AngoraOptions.loader) {
                if (!/\?/.test(document.location.hash)) {
                    $(window).on('load', function() {
                        $(window).scrollTo(document.location.hash, 0, {
                            offset: {
                                top: -85,
                                left: 0
                            }
                        });
                    });
                }
            }

            //To top
            $('footer .to-top').on('click', function() {
                $(window).scrollTo($('body'), 1500, {
                    offset: {
                        top: 0,
                        left: 0
                    }
                });
            });
        },

        //Intro
        intro: function() {
            if ($('#intro').length === 0) {
                return;
            }

            var $intro = $('#intro');
            var useImages = false,
                useVideo = false;
            var $elements;

            //Vertical Align Content
            var verticalAlignContent = function() {
                var contentH = $intro.find('.content').outerHeight(),
                    windowH = $(window).height(),
                    menuH = $intro.find('.navbar').outerHeight(true),
                    value = (windowH / 2) - (contentH / 2) - menuH / 2;

                $intro.find('.content').css({
                    marginTop: Math.floor(value)
                });
            };

            //Magic mouse
            var magicMouse = function() {
                var mouseOpacity = 1 - $(document).scrollTop() / 400;
                if (mouseOpacity < 0) {
                    mouseOpacity = 0;
                }
                $intro.find('.mouse').css({
                    opacity: mouseOpacity
                });
            };

            if (!AngoraOptions.animations) {
                $intro.find('.wow').removeClass('wow');
            }

            $(window).on('resize', function() {
                verticalAlignContent();
            });

            $(window).on('load', function() {
                verticalAlignContent();
                magicMouse();
            });

            $(window).on('scroll', function() {
                magicMouse();
            });

            //Static image
            if ($intro.data('type') === 'single-image') {
                useImages = true;
                $elements = $intro.find('.animate');

                if ($elements.length > 0) {
                    verticalAlignContent();

                    $(window).on('angora.complete', function() {
                        $elements.removeClass('animated');
                        $elements.removeAttr('style');

                        new WOW({
                            boxClass: 'animate'
                        }).init();
                    });
                } else {
                    verticalAlignContent();
                }

                $('<div />').addClass('slider fullscreen').prependTo('body');

                $('<div />').addClass('image').css({
                    opacity: 0,
                    backgroundImage: "url('" + $intro.attr('data-source') + "')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }).appendTo('.slider');

                $('.slider').waitForImages(function() {
                    $(this).find('.image').css({
                        opacity: 1
                    });
                });

                if ($intro.attr('data-parallax') === 'true' && !Modernizr.touch) {
                    $(document).ready(function() {
                        $('.slider').find('.image').css({
                            backgroundRepeat: 'repeat'
                        }).parallax('50%', 0.25);
                    });
                }
            }
            //Slideshow
            else if ($intro.data('type') === 'slideshow') {
                useImages = true;

                var contentListShow = function($that, $contentList, index) {
                    var $current;

                    if (!$contentList) {
                        $contentList = $intro;
                        $current = $contentList;
                    } else {
                        $current = $contentList.find('> div[data-index=' + index + ']');
                    }

                    $current.show();
                    verticalAlignContent();

                    var $elements = $current.find('.animate');

                    if ($elements.length > 0) {
                        $elements.removeClass('animated');
                        $elements.removeAttr('style');

                        new WOW({
                            boxClass: 'animate'
                        }).init();
                    }
                };

                var contentListHide = function($that, $contentList, onComplete) {
                    if ($contentList) {
                        var $current = $contentList.find('> div:visible');
                        if (typeof $current !== 'undefined') {
                            $contentList.find('> div').hide();
                        }
                    }

                    if (onComplete && typeof onComplete === 'function') {
                        onComplete();
                    }
                };

                var $imagesList = $intro.find($intro.data('images')),
                    $contentList = $intro.data('content') ? $intro.find($intro.data('content')) : false,
                    changeContent = $contentList !== false ? true : false,
                    $toLeft = $intro.data('to-left') ? $intro.find($intro.data('to-left')) : false,
                    $toRight = $intro.data('to-right') ? $intro.find($intro.data('to-right')) : false,
                    delay = parseInt($intro.data('delay'), 10) > 0 ? parseInt($intro.data('delay'), 10) * 1000 : 7000,
                    images = [];

                $imagesList.hide();

                $imagesList.find('> img').each(function(index) {
                    images.push({
                        src: $(this).attr('src')
                    });
                    $(this).attr('data-index', index);
                });

                if (changeContent) {
                    $contentList.find('> div').hide();
                    $contentList.find('> div').each(function(index) {
                        $(this).attr('data-index', index);
                    });
                }

                var slideshowTimeout = false,
                    slideshowCurrent = 0,
                    slideshowIsFirst = true;

                var slideshowChange = function($that, index) {
                    if (index >= images.length) {
                        index = 0;
                    } else if (index < 0) {
                        index = images.length - 1;
                    }

                    slideshowCurrent = index;

                    var isFirst = $that.find('.image').length === 0 ? true : false;

                    if (isFirst) {
                        $('<div />').css({
                            backgroundImage: "url('" + images[index].src + "')",
                            backgroundRepeat: 'no-repeat'
                        }).addClass('image').appendTo('.slider');
                    } else {
                        $('<div />').css({
                            backgroundImage: "url('" + images[index].src + "')",
                            backgroundRepeat: 'no-repeat',
                            opacity: 0
                        }).addClass('image').appendTo('.slider');

                        setTimeout(function() {
                            $that.find('.image:last-child').css({
                                opacity: 1
                            });
                            setTimeout(function() {
                                $that.find('.image:first-child').remove();
                            }, 1500);
                        }, 100);
                    }

                    if ($contentList || slideshowIsFirst) {
                        contentListHide($that, $contentList, function() {
                            contentListShow($that, $contentList, index);
                        });
                    }

                    slideshowIsFirst = false;

                    clearTimeout(slideshowTimeout);

                    slideshowTimeout = setTimeout(function() {
                        slideshowNext($that);
                    }, delay);
                };

                var slideshowCreate = function() {
                    $('<div />').addClass('slider fullscreen').prependTo('body');

                    $(window).on('load', function() {
                        $imagesList.waitForImages(function() {
                            slideshowChange($('.slider'), 0);
                        });
                    });
                };

                var slideshowNext = function($slider) {
                    slideshowChange($slider, slideshowCurrent + 1);
                };

                var slideshowPrev = function($slider) {
                    slideshowChange($slider, slideshowCurrent - 1);
                };

                slideshowCreate();

                if ($toLeft !== false && $toRight !== false) {
                    $toLeft.on("click", function(e) {
                        slideshowPrev($('.slider'));
                        e.preventDefault();
                    });

                    $toRight.on("click", function(e) {
                        slideshowNext($('.slider'));
                        e.preventDefault();
                    });
                }
            }
            //Fullscreen Video
            else if ($intro.data('type') === 'video') {
                useVideo = true;

                if (Modernizr.touch) {
                    $('#video-mode').removeClass('animate').hide();
                    useImages = true;
                    useVideo = false;
                }

                $elements = $intro.find('.animate');

                if ($elements.length > 0) {
                    verticalAlignContent();

                    $(window).on('angora.complete', function() {
                        $elements.removeClass('animated');
                        $elements.removeAttr('style');

                        new WOW({
                            boxClass: 'animate'
                        }).init();
                    });
                } else {
                    verticalAlignContent();
                }

                $(document).ready(function() {
                    var reserveTimer,
                        onlyForFirst = true,
                        quality = $intro.attr('data-quality'),
                        callBackImage = $intro.attr('data-on-error');

                    if (quality !== 'small' && quality !== 'medium' && quality !== 'large' && quality !== 'hd720' && quality !== 'hd1080' && quality !== 'highres') {
                        quality = 'default';
                    }

                    $('[data-hide-on-another="true"]').remove();

                    $(window).on('YTAPIReady', function() {
                        reserveTimer = setTimeout(function() {
                            $(window).trigger('angora.intro-video');
                            onlyForFirst = false;
                        }, 5000);
                    });

                    $('<div />').addClass('slider fullscreen').prependTo('body').on('YTPStart', function() {
                        if (onlyForFirst) {
                            clearTimeout(reserveTimer);
                            $(window).trigger('angora.intro-video');
                            onlyForFirst = false;
                        }
                    }).mb_YTPlayer({
                        videoURL: $intro.attr('data-source'),
                        mobileFallbackImage: callBackImage,
                        mute: $intro.attr('data-mute') === 'true' ? true : false,
                        startAt: parseInt($intro.attr('data-start'), 10),
                        stopAt: parseInt($intro.attr('data-stop'), 10),
                        autoPlay: true,
                        showControls: false,
                        ratio: '16/9',
                        showYTLogo: false,
                        vol: 100,
                        quality: quality,
                        onError: function() {
                            clearTimeout(reserveTimer);
                            $(window).trigger('angora.intro-video');
                        }
                    });

                    if ($intro.attr('data-overlay')) {
                        $('.YTPOverlay').css({
                            backgroundColor: 'rgba(0, 0, 0, ' + $intro.attr('data-overlay') + ')'
                        });
                    }
                });

                var videoMode = false,
                    videoModeSelector = '#intro .mouse, #intro .content, .slider.fullscreen .overlay';

                $('#video-mode').on("click", function() {
                    $(videoModeSelector).animate({
                        opacity: 0
                    }, {
                        duration: 500,
                        queue: false,
                        complete: function() {
                            if (!videoMode) {
                                $('.slider').YTPUnmute();

                                $('.YTPOverlay').animate({
                                    opacity: 0
                                }, {
                                    duration: 500,
                                    queue: false,
                                    complete: function() {
                                        $(this).hide();
                                    }
                                });

                                $('<div />').appendTo('#intro').css({
                                    position: 'absolute',
                                    textAlign: 'center',
                                    bottom: '30px',
                                    color: '#fff',
                                    left: 0,
                                    right: 0,
                                    opacity: 0
                                }).addClass('click-to-exit');

                                $('<h5 />').appendTo('.click-to-exit').text('Click to exit full screen');

                                setTimeout(function() {
                                    $('.click-to-exit').animate({
                                        opacity: 1
                                    }, {
                                        duration: 500,
                                        queue: false,
                                        complete: function() {
                                            setTimeout(function() {
                                                $('.click-to-exit').animate({
                                                    opacity: 0
                                                }, {
                                                    duration: 500,
                                                    queue: false,
                                                    complete: function() {
                                                        $(this).remove();
                                                    }
                                                });
                                            }, 1500);
                                        }
                                    });
                                }, 500);
                            }

                            videoMode = true;

                            $(this).hide();
                        }
                    });
                });

                $intro.on("click", function(e) {
                    if (videoMode && $(e.target).is('#intro')) {
                        $('.slider').YTPMute();
                        $('.YTPOverlay').show().animate({
                            opacity: 1
                        }, {
                            duration: 500,
                            queue: false
                        });
                        $(videoModeSelector).show().animate({
                            opacity: 1
                        }, {
                            duration: 500,
                            queue: false
                        });
                        $intro.find('.click-to-exit').remove();
                        videoMode = false;
                    }
                });
            }
        },

        //Portfolio
        portfolio: function() {
            if ($('.portfolio-item').length === 0) {
                return;
            }

            var that = this;

            var calculatePortfolioItems = function() {
                var sizes = {
                        lg: 4,
                        md: 4,
                        sm: 4,
                        xs: 2
                    },
                    $that = $('.portfolio-items'),
                    w = $(window).width(),
                    onLine = 0,
                    value = 0;

                if ($that.attr('data-on-line-lg') > 0) {
                    sizes.lg = parseInt($that.attr('data-on-line-lg'), 10);
                }
                if ($that.attr('data-on-line-md') > 0) {
                    sizes.md = parseInt($that.attr('data-on-line-md'), 10);
                }
                if ($that.attr('data-on-line-sm') > 0) {
                    sizes.sm = parseInt($that.attr('data-on-line-sm'), 10);
                }
                if ($that.attr('data-on-line-xs') > 0) {
                    sizes.xs = parseInt($that.attr('data-on-line-xs'), 10);
                }

                if (w <= 767) {
                    onLine = sizes.xs;
                } else if (w >= 768 && w <= 991) {
                    onLine = sizes.sm;
                } else if (w >= 992 && w <= 1199) {
                    onLine = sizes.md;
                } else {
                    onLine = sizes.lg;
                }

                value = Math.floor(w / onLine);
                $('.portfolio-item').css({
                    width: value + 'px',
                    height: value + 'px'
                });
            };

            $(window).on('resize', function() {
                calculatePortfolioItems();
            });

            $(window).on('load', function() {
                calculatePortfolioItems();

                //Isotope
                $('.portfolio-items').isotope({
                    itemSelector: '.portfolio-item',
                    layoutMode: 'fitRows'
                });

                var $items = $('.portfolio-items').isotope();

                //Filter items on button click
                $('.portfolio-filters').on('click', 'span', function() {
                    var filter = $(this).data('filter');
                    $items.isotope({
                        filter: filter
                    });
                });

                $('.portfolio-filters').on('click', 'span', function() {
                    $(this).addClass("active").siblings().removeClass('active');
                });
            });

            var closeProject = function() {
                $('#portfolio-details').animate({
                    opacity: 0
                }, {
                    duration: 600,
                    queue: false,
                    complete: function() {
                        $(this).hide().html('').removeAttr('data-current');
                    }
                });
            };

            //Portfolio details
            $('.portfolio-item a').on("click", function(e) {
                e.preventDefault();
                var $that = $(this);
                var $item = $that.closest(".portfolio-item");

                if ($item.find('.loading').length === 0) {
                    $('<div />').addClass('loading').appendTo($item);
                    $that.parent().addClass('active');

                    var $loading = $item.find('.loading'),
                        $container = $('#portfolio-details'),
                        timer = 1;

                    if ($container.is(':visible')) {
                        closeProject();
                        timer = 800;
                        $loading.animate({
                            width: '70%'
                        }, {
                            duration: 2000,
                            queue: false
                        });
                    }

                    setTimeout(function() {
                        $loading.stop(true, false).animate({
                            width: '70%'
                        }, {
                            duration: 6000,
                            queue: false
                        });

                        //Add AJAX query to the url
                        var url = $that.attr("href") + "?ajax=1";

                        $.get(url).done(function(response) {
                            $container.html(response);

                            $container.waitForImages(function() {
                                $loading.stop(true, false).animate({
                                    width: '100%'
                                }, {
                                    duration: 500,
                                    queue: true
                                });

                                $loading.animate({
                                    opacity: 0
                                }, {
                                    duration: 200,
                                    queue: true,
                                    complete: function() {
                                        $that.parent().removeClass('active');
                                        $(this).remove();

                                        $container.show().css({
                                            opacity: 0
                                        });

                                        that.imageSlider($container, function() {
                                            $(document).scrollTo($container, 600, {
                                                offset: {
                                                    top: -parseInt($(".navbar").height(), 10),
                                                    left: 0
                                                }
                                            });
                                            $container.animate({
                                                opacity: 1
                                            }, {
                                                duration: 600,
                                                queue: false
                                            });
                                            $container.attr('data-current', $that.data("rel"));
                                        });
                                    }
                                });
                            });
                        }).fail(function() {
                            $that.parent().removeClass('active');
                            $loading.remove();
                        });
                    }, timer);
                }

                e.preventDefault();
            });

            $(document.body).on('click', '#portfolio-details .icon.close i', function() {
                closeProject();
            });

            //Anchor Links for Projects
            var dh = document.location.hash;

            if (/#view-/i.test(dh)) {
                var $item = $('[rel="' + dh.substr(6) + '"]');

                if ($item.length > 0) {
                    $(document).scrollTo('#portfolio', 0, {
                        offset: {
                            top: 0,
                            left: 0
                        }
                    });
                    $(window).on('angora.complete', function() {
                        $item.trigger('click');
                    });
                }
            }

            $('a[href^="#view-"]').on("click", function() {
                var $item = $('[rel="' + $(this).attr('href').substr(6) + '"]');

                if ($item.length > 0) {
                    $(document).scrollTo('#portfolio', AngoraOptions.scrollSpeed, {
                        offset: {
                            top: -85,
                            left: 0
                        },
                        onAfter: function() {
                            $item.trigger('click');
                        }
                    });
                }
            });
        },

        //Parallax Sections
        parallax: function() {
            if ($('.parallax').length === 0) {
                return;
            }

            $(window).on('load', function() {
                $('.parallax').each(function() {
                    if ($(this).attr('data-image')) {
                        $(this).parallax('50%', 0.5);
                        $(this).css({
                            backgroundImage: 'url(' + $(this).data('image') + ')'
                        });
                    }
                });
            });
        },

        //Video Background for Sections
        videos: function() {
            if (Modernizr.touch) {
                $('section.video').remove();
                return;
            }

            if ($('section.video').length > 0) {
                var tag = document.createElement('script');
                tag.src = "//www.youtube.com/player_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                $(window).on('resize', function() {
                    $('section.video').each(function() {
                        $(this).css({
                            height: $(this).find('.video-container .container').outerHeight(true)
                        });
                    });
                }).resize();
            }
        },

        //Google Maps
        map: function() {
            if ($('#google-map').length === 0) {
                return;
            }

            var that = this;

            $(window).on('load', function() {
                that.mapCreate();
            });
        },

        //Create map
        mapCreate: function() {
            var $map = $('#google-map');

            //Main color			
            var main_color = $map.data('color');

            //Saturation and brightness
            var saturation_value = -20;
            var brightness_value = 5;

            //Map style
            var style = [{ //Set saturation for the labels on the map
                    elementType: "labels",
                    stylers: [{
                        saturation: saturation_value
                    }, ]
                },

                { //Poi stands for point of interest - don't show these labels on the map 
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{
                        visibility: "off"
                    }, ]
                },

                { //Hide highways labels on the map
                    featureType: 'road.highway',
                    elementType: 'labels',
                    stylers: [{
                        visibility: "off"
                    }, ]
                },

                { //Hide local road labels on the map
                    featureType: "road.local",
                    elementType: "labels.icon",
                    stylers: [{
                        visibility: "off"
                    }, ]
                },

                { //Hide arterial road labels on the map
                    featureType: "road.arterial",
                    elementType: "labels.icon",
                    stylers: [{
                        visibility: "off"
                    }, ]
                },

                { //Hide road labels on the map
                    featureType: "road",
                    elementType: "geometry.stroke",
                    stylers: [{
                        visibility: "off"
                    }, ]
                },

                { //Style different elements on the map
                    featureType: "transit",
                    elementType: "geometry.fill",
                    stylers: [{
                            hue: main_color
                        },
                        {
                            visibility: "on"
                        },
                        {
                            lightness: brightness_value
                        },
                        {
                            saturation: saturation_value
                        },
                    ]
                },

                {
                    featureType: "poi",
                    elementType: "geometry.fill",
                    stylers: [{
                            hue: main_color
                        },
                        {
                            visibility: "on"
                        },
                        {
                            lightness: brightness_value
                        },
                        {
                            saturation: saturation_value
                        },
                    ]
                },

                {
                    featureType: "poi.government",
                    elementType: "geometry.fill",
                    stylers: [{
                            hue: main_color
                        },
                        {
                            visibility: "on"
                        },
                        {
                            lightness: brightness_value
                        },
                        {
                            saturation: saturation_value
                        },
                    ]
                },

                {
                    featureType: "poi.attraction",
                    elementType: "geometry.fill",
                    stylers: [{
                            hue: main_color
                        },
                        {
                            visibility: "on"
                        },
                        {
                            lightness: brightness_value
                        },
                        {
                            saturation: saturation_value
                        },
                    ]
                },

                {
                    featureType: "poi.business",
                    elementType: "geometry.fill",
                    stylers: [{
                            hue: main_color
                        },
                        {
                            visibility: "on"
                        },
                        {
                            lightness: brightness_value
                        },
                        {
                            saturation: saturation_value
                        },
                    ]
                },

                {
                    featureType: "transit",
                    elementType: "geometry.fill",
                    stylers: [{
                            hue: main_color
                        },
                        {
                            visibility: "on"
                        },
                        {
                            lightness: brightness_value
                        },
                        {
                            saturation: saturation_value
                        },
                    ]
                },

                {
                    featureType: "transit.station",
                    elementType: "geometry.fill",
                    stylers: [{
                            hue: main_color
                        },
                        {
                            visibility: "on"
                        },
                        {
                            lightness: brightness_value
                        },
                        {
                            saturation: saturation_value
                        },
                    ]
                },

                {
                    featureType: "landscape",
                    stylers: [{
                            hue: main_color
                        },
                        {
                            visibility: "on"
                        },
                        {
                            lightness: brightness_value
                        },
                        {
                            saturation: saturation_value
                        },
                    ]
                },

                {
                    featureType: "road",
                    elementType: "geometry.fill",
                    stylers: [{
                            hue: main_color
                        },
                        {
                            visibility: "on"
                        },
                        {
                            lightness: brightness_value
                        },
                        {
                            saturation: saturation_value
                        },
                    ]
                },

                {
                    featureType: "road.highway",
                    elementType: "geometry.fill",
                    stylers: [{
                            hue: main_color
                        },
                        {
                            visibility: "on"
                        },
                        {
                            lightness: brightness_value
                        },
                        {
                            saturation: saturation_value
                        },
                    ]
                },

                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{
                            hue: main_color
                        },
                        {
                            visibility: "on"
                        },
                        {
                            lightness: brightness_value
                        },
                        {
                            saturation: saturation_value
                        },
                    ]
                }
            ];

            var coordY = $map.data('latitude'),
                coordX = $map.data('longitude');
            var latlng = new google.maps.LatLng(coordY, coordX);

            var settings = {
                zoom: $map.data('zoom'),
                center: new google.maps.LatLng(coordY, coordX),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                panControl: false,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                scrollwheel: false,
                draggable: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                navigationControl: false,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.SMALL
                },
                styles: style
            };

            var map = new google.maps.Map($map.get(0), settings);

            google.maps.event.addDomListener(window, "resize", function() {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            });

            var contentString = $map.parent().find('#map-info').html() || '';
            var infoWindow = new google.maps.InfoWindow({
                content: contentString
            });
            var companyPos = new google.maps.LatLng(coordY, coordX);

            var marker = new google.maps.Marker({
                position: companyPos,
                map: map,
                icon: $map.data('marker'),
                zIndex: 3
            });

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open(map, marker);
            });

            //Add custom buttons for the zoom-in/zoom-out on the map
            if (AngoraOptions.zoomControlDiv === null) {
                var zoomControlDiv = document.createElement('div');
                var zoomControl = new customZoomControl(zoomControlDiv, map);
                AngoraOptions.zoomControlDiv = zoomControlDiv;
            }

            //Insert the zoom div on the top left of the map
            map.controls[google.maps.ControlPosition.LEFT_TOP].push(AngoraOptions.zoomControlDiv);
        },

        //Content slider
        contentSlider: function($root, element) {
            if (typeof $root === 'undefined') {
                $root = $('body');
            }
            if (typeof element === 'undefined') {
                element = 'div';
            }

            $root.find('.content-slider').each(function() {
                var $that = $(this),
                    timeout, delay = false,
                    process = false,
                    $arrows;

                $that.css({
                    position: 'relative'
                }).find('> ' + element).each(function(index) {
                    $that.height($(this).outerHeight(true));
                    $(this).attr('data-index', index);
                    $(this).css({
                        position: 'relative',
                        left: 0,
                        top: 0
                    });

                    if (index > 0) {
                        $(this).hide();
                    } else {
                        $that.attr('data-index', 0);
                    }
                });

                if ($that.attr('data-arrows')) {
                    $arrows = $($that.attr('data-arrows'));
                } else {
                    $arrows = $that.parent();
                }

                if ($that.attr('data-delay')) {
                    delay = parseInt($that.attr('data-delay'), 10);
                    timeout = setInterval(function() {
                        $arrows.find('.arrow.right').click();
                    }, delay);
                }

                if ($that.find('> ' + element + '[data-index]').length < 2) {
                    $arrows.hide();
                    clearInterval(timeout);
                    delay = false;
                }

                $arrows.find('.arrow').on("click", function() {
                    if (!process) {
                        process = true;
                        clearInterval(timeout);

                        var index = parseInt($that.attr('data-index'), 10),
                            last = parseInt($that.find('> ' + element + ':last-child').attr('data-index'), 10),
                            set;
                        var property;

                        if ($(this).hasClass('left')) {
                            set = index === 0 ? last : index - 1;
                            property = [{
                                left: 100
                            }, {
                                left: -100
                            }];
                        } else {
                            set = index === last ? 0 : index + 1;
                            property = [{
                                left: -100
                            }, {
                                left: 100
                            }];
                        }

                        var $current = $that.find('> ' + element + '[data-index=' + index + ']'),
                            $next = $that.find('> ' + element + '[data-index=' + set + ']');

                        $that.attr('data-index', set);
                        $current.css({
                            left: 'auto',
                            right: 'auto'
                        });
                        $current.animate({
                            opacity: 0
                        }, {
                            duration: 300,
                            queue: false
                        });

                        $current.animate(property[0], {
                            duration: 300,
                            queue: false,
                            complete: function() {
                                $(this).hide().css({
                                    opacity: 1
                                }).css({
                                    left: 0
                                });

                                $that.animate({
                                    height: $next.outerHeight(true)
                                }, {
                                    duration: (($that.outerHeight(true) === $next.outerHeight(true)) ? 0 : 200),
                                    queue: false,
                                    complete: function() {
                                        $next.css({
                                            opacity: 0,
                                            left: 'auto',
                                            right: 'auto'
                                        }).css(property[1]).show();
                                        $next.animate({
                                            opacity: 1
                                        }, {
                                            duration: 300,
                                            queue: false
                                        });

                                        $next.animate({
                                            left: 0
                                        }, {
                                            duration: 300,
                                            queue: false,
                                            complete: function() {
                                                if (delay !== false) {
                                                    timeout = setInterval(function() {
                                                        $arrows.find('.arrow.right').click();
                                                    }, delay);
                                                }
                                                process = false;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

                $(window).on('resize', function() {
                    $that.each(function() {
                        $(this).height($(this).find('> ' + element + ':visible').outerHeight(true));
                    });
                }).resize();
            });
        },

        //Contact form
        contact: function() {
            if ($('#contact').length === 0) {
                return;
            }

            var $name = $('.field-name'),
                $email = $('.field-email'),
                $phone = $('.field-phone'),
                $text = $('.field-message'),
                $button = $('#contact-submit');

            $('.field-name, .field-email, .field-message').focus(function() {
                if ($(this).parent().find('.error').length > 0) {
                    $(this).parent().find('.error').fadeOut(150, function() {
                        $(this).remove();
                    });
                }
            });

            $button.removeAttr('disabled');

            $button.on("click", function() {
                var fieldNotice = function($that) {
                    if ($that.parent().find('.error').length === 0) {
                        $('<span class="error"><i class="fas fa-times"></i></span>').appendTo($that.parent()).fadeIn(150);
                    }
                };

                if ($name.val().length < 1) {
                    fieldNotice($name);
                }
                if ($email.val().length < 1) {
                    fieldNotice($email);
                }
                if ($text.val().length < 1) {
                    fieldNotice($text);
                }

                if ($('#contact').find('.field .error').length === 0) {
                    $(document).ajaxStart(function() {
                        $button.attr('disabled', true);
                    });

                    $.post('contact.php', {
                        name: $name.val(),
                        email: $email.val(),
                        phone: $phone.val(),
                        message: $text.val()
                    }, function(response) {
                        var data = $.parseJSON(response);

                        if (data.status === 'email') {
                            fieldNotice($email);
                            $button.removeAttr('disabled');
                        } else if (data.status === 'error') {
                            $button.text('Unknown Error :(');
                        } else {
                            $('.contact-form-holder').fadeOut(300);
                            $('.contact-form-result').fadeIn(300);
                        }
                    });
                }
            });
        },

        //Images Slider
        imageSlider: function($root, onComplete) {
            if (typeof $root === 'undefined') {
                $root = $('body');
            }

            if ($root.find('.image-slider').length === 0) {
                if (onComplete && typeof onComplete === 'function') {
                    onComplete();
                }
                return;
            }

            $root.find('.image-slider').each(function() {
                var $that = $(this),
                    $arrows = $that.find('.arrows');
                var $list = $(this).find('> div').not('.arrows');
                var timeout, delay = false,
                    process = false;

                var setHeight = function($that, onComplete) {
                    $that.css({
                        height: $that.find('> div:visible img').outerHeight(true)
                    });

                    if (onComplete && typeof onComplete === 'function') {
                        onComplete();
                    }
                };

                if ($that.attr('data-delay')) {
                    delay = parseInt($that.attr('data-delay'), 10);
                    timeout = setInterval(function() {
                        $arrows.find('.arrow.right').click();
                    }, delay);
                }

                $(this).waitForImages(function() {
                    $(this).css({
                        position: 'relative'
                    });

                    $list.hide().css({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        width: '100%',
                        paddingLeft: 15,
                        paddingRight: 15,
                    });

                    $list.eq(0).show();

                    setHeight($that, onComplete);

                    $(window).on('resize', function() {
                        setTimeout(function() {
                            setHeight($that);
                        }, 1);
                    });

                    if ($list.length === 1) {
                        $arrows.hide();
                        clearInterval(timeout);
                        delay = false;
                    }
                });

                $arrows.find('.arrow').on('click', function(e) {
                    if (process) {
                        e.preventDefault();
                        return;
                    }

                    clearInterval(timeout);

                    var isRight = $(this).hasClass('right');
                    var $current = $that.find('> div:visible').not('.arrows'),
                        $next;

                    if (isRight) {
                        $next = $current.next();
                        if (!$next || $next.is('.arrows')) {
                            $next = $list.eq(0);
                        }
                    } else {
                        if ($current.is(':first-child')) {
                            $next = $list.last();
                        } else {
                            $next = $current.prev();
                        }
                    }

                    process = true;
                    $current.css({
                        zIndex: 1
                    });

                    $next.css({
                        opacity: 0,
                        zIndex: 2
                    }).show().animate({
                        opacity: 1
                    }, {
                        duration: 300,
                        queue: false,
                        complete: function() {
                            $current.hide().css({
                                opacity: 1
                            });

                            if (delay !== false) {
                                timeout = setInterval(function() {
                                    $arrows.find('.arrow.right').click();
                                }, delay);
                            }
                            process = false;
                        }
                    });
                });
            });
        },

        //Blog
        blog: function() {
            //Search form
            $(window).on('resize', function() {
                var width = parseInt($(".search-form .btn").outerWidth(), 10);
                $(".search-form .search-field").css("padding-right", (width + 16) + "px");
            }).resize();

            //Masonry blog
            if ($('.blog-masonry').length) {
                //Get column width
                var getColumnWidth = function() {
                    var $that = $('.blog-masonry'),
                        w = $that.outerWidth(true) - 30,
                        ww = $(window).width(),
                        columns;

                    if ($that.hasClass('blog-masonry-four')) {
                        columns = 4;
                    } else if ($that.hasClass('blog-masonry-three')) {
                        columns = 3;
                    } else if ($that.hasClass('blog-masonry-two')) {
                        columns = 2;
                    } else {
                        columns = 1;
                    }

                    if (ww <= 767) {
                        columns = 1;
                    } else if (ww >= 768 && ww <= 991 && columns > 2) {
                        columns -= 1;
                    }

                    return Math.floor(w / columns);
                };

                $('.blog-post.masonry').css({
                    width: getColumnWidth()
                });

                $('.blog-masonry').waitForImages(function() {
                    $(this).isotope({
                        itemSelector: '.blog-post.masonry',
                        resizable: false,
                        transformsEnabled: false,
                        masonry: {
                            columnWidth: getColumnWidth()
                        }
                    });
                });

                $(window).on('resize', function() {
                    var size = getColumnWidth();
                    $('.blog-post.masonry').css({
                        width: size
                    });
                    $('.blog-masonry').isotope({
                        masonry: {
                            columnWidth: size
                        }
                    });
                });
            }
        },

        //Error page
        errorPage: function() {
            if ($('#error-page').length > 0) {
                $(window).on('resize', function() {
                    $('#error-page').css({
                        marginTop: -Math.ceil($('#error-page').outerHeight() / 2)
                    });
                }).resize();
            }
        },

        //Short codes
        shortCodes: function() {
            //Progress bars
            if ($('.progress .progress-bar').length > 0) {
                setTimeout(function() {
                    $(window).on('angora.complete', function() {
                        $(window).scroll(function() {
                            var scrollTop = $(window).scrollTop();
                            $('.progress .progress-bar').each(function() {
                                var $that = $(this),
                                    itemTop = $that.offset().top - $(window).height() + $that.height() / 2;

                                if (scrollTop > itemTop && $that.outerWidth() === 0) {
                                    var percent = parseInt($(this).attr('data-value'), 10) + '%';
                                    var $value = $(this).parent().parent().find('.progress-value');

                                    if ($value.length > 0) {
                                        $value.css({
                                            width: percent,
                                            opacity: 0
                                        }).text(percent);
                                    }

                                    $that.animate({
                                        width: percent
                                    }, {
                                        duration: 1500,
                                        queue: false,
                                        complete: function() {
                                            if ($value.length > 0) {
                                                $value.animate({
                                                    opacity: 1
                                                }, {
                                                    duration: 300,
                                                    queue: false
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }).scroll();
                    });
                }, 1);
            }

            //Counters
            if ($('.number-count').length > 0) {
                $('.number-count').counterUp({
                    delay: 4,
                    time: 1000
                });
            }

            //Clients
            if ($('.clients-slider').length > 0) {
                $('.clients-slider').owlCarousel({
                    autoplay: 3000,
                    autoplaySpeed: 300,
                    dots: false,
                    responsive: {
                        0: {
                            items: 2
                        },
                        480: {
                            items: 3
                        },
                        768: {
                            items: 5
                        }
                    }
                });
            }

            //Testimonials
            if ($('.testimonial-slider').length > 0) {
                $(".testimonial-slider").slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    asNavFor: ".testimonial-nav"
                });

                $(".testimonial-nav").slick({
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    asNavFor: ".testimonial-slider",
                    dots: false,
                    centerMode: true,
                    focusOnSelect: true,
                    variableWidth: false,
                    arrows: false,
                    responsive: [{
                            breakpoint: 991,
                            settings: {
                                slidesToShow: 5
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 3
                            }
                        }
                    ]
                });
            }
        },

        //Share functions
        share: function(network, title, image, url) {
            //Window size
            var w = 650,
                h = 350,
                params = 'width=' + w + ', height=' + h + ', resizable=1';

            //Title
            if (typeof title === 'undefined') {
                title = $('title').text();
            } else if (typeof title === 'string') {
                if ($(title).length > 0) {
                    title = $(title).text();
                }
            }

            //Image
            if (typeof image === 'undefined') {
                image = '';
            } else if (typeof image === 'string') {
                if (!/http/i.test(image)) {
                    if ($(image).length > 0) {
                        if ($(image).is('img')) {
                            image = $(image).attr('src');
                        } else {
                            image = $(image).find('img').eq(0).attr('src');
                        }
                    } else {
                        image = '';
                    }
                }
            }

            //Url
            if (typeof url === 'undefined') {
                url = document.location.href;
            } else {
                url = document.location.protocol + '//' + document.location.host + document.location.pathname + url;
            }

            //Share
            if (network === 'twitter') {
                return window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(title + ' ' + url), 'share', params);
            } else if (network === 'facebook') {
                return window.open('https://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + encodeURIComponent(url) + '&p[title]=' + encodeURIComponent(title) + '&p[images][0]=' + encodeURIComponent(image), 'share', params);
            } else if (network === 'pinterest') {
                return window.open('https://pinterest.com/pin/create/bookmarklet/?media=' + image + '&description=' + title + ' ' + encodeURIComponent(url), 'share', params);
            } else if (network === 'google') {
                return window.open('https://plus.google.com/share?url=' + encodeURIComponent(url), 'share', params);
            } else if (network === 'linkedin') {
                return window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(url) + '&title=' + title, 'share', params);
            }

            return;
        }
    };

    //Initialize
    $.AngoraTheme.init();

})(jQuery);

//Map zoom controls
function customZoomControl(controlDiv, map) {
    //Grap the zoom elements from the DOM and insert them in the map 
    var controlUIzoomIn = document.getElementById('zoom-in'),
        controlUIzoomOut = document.getElementById('zoom-out');

    controlDiv.appendChild(controlUIzoomIn);
    controlDiv.appendChild(controlUIzoomOut);

    //Setup the click event listeners and zoom-in or out according to the clicked element
    google.maps.event.addDomListener(controlUIzoomIn, 'click', function() {
        map.setZoom(map.getZoom() + 1);
    });

    google.maps.event.addDomListener(controlUIzoomOut, 'click', function() {
        map.setZoom(map.getZoom() - 1);
    });
}

//Share Functions
function shareTo(network, title, image, url) {
    return $.AngoraTheme.share(network, title, image, url);
}

//Video Background for Sections
function onYouTubePlayerAPIReady() {
    $('section.video').each(function(index) {
        var $that = $(this),
            currentId = 'video-background-' + index;

        $('<div class="video-responsive"><div id="' + currentId + '"></div></div>').prependTo($that);

        var player = new YT.Player(currentId, {
            height: '100%',
            width: '100%',
            playerVars: {
                'rel': 0,
                'autoplay': 1,
                'loop': 1,
                'controls': 0,
                'start': parseInt($that.attr('data-start'), 10),
                'autohide': 1,
                'wmode': 'opaque',
                'playlist': currentId
            },
            videoId: $that.attr('data-source'),
            events: {
                'onReady': function(evt) {
                    evt.target.mute();
                },
                'onStateChange': function(evt) {
                    if (evt.data === 0) {
                        evt.target.playVideo();
                    }
                }
            }
        });

        var $control = $that.find('.video-control'),
            $selector = $that.find($control.attr('data-hide')),
            $container = $that.find('.video-container'),
            videoMode = $that.attr('data-video-mode') === 'true' ? true : false;

        if ($control.length > 0 && $selector.length > 0) {
            $control.on("click", function() {
                if (!videoMode) {
                    $that.attr('data-video-mode', 'true');
                    videoMode = true;

                    $that.find('.video-overlay').animate({
                        opacity: 0
                    }, {
                        duration: 500,
                        queue: false,
                        complete: function() {
                            $(this).hide();
                        }
                    });

                    $selector.animate({
                        opacity: 0
                    }, {
                        duration: 500,
                        queue: false,
                        complete: function() {
                            player.unMute();

                            $('<div />').appendTo($container).css({
                                position: 'absolute',
                                textAlign: 'center',
                                bottom: '30px',
                                color: '#fff',
                                left: 0,
                                right: 0,
                                opacity: 0
                            }).addClass('click-to-exit');

                            $('<h5 />').appendTo($that.find('.click-to-exit')).text('Click to exit full screen');

                            setTimeout(function() {
                                $that.find('.click-to-exit').animate({
                                    opacity: 1
                                }, {
                                    duration: 500,
                                    queue: false,
                                    complete: function() {
                                        setTimeout(function() {
                                            $that.find('.click-to-exit').animate({
                                                opacity: 0
                                            }, {
                                                duration: 500,
                                                queue: false,
                                                complete: function() {
                                                    $(this).remove();
                                                }
                                            });
                                        }, 1500);
                                    }
                                });
                            }, 500);

                            $selector.hide();
                        }
                    });
                }
            });

            $that.on("click", function(evt) {
                if (videoMode && ($(evt.target).is('.video-container') || $(evt.target).parent().is('.click-to-exit'))) {
                    $selector.show().animate({
                        opacity: 1
                    }, {
                        duration: 500,
                        queue: false
                    });
                    $that.find('.video-overlay').show().animate({
                        opacity: 1
                    }, {
                        duration: 500,
                        queue: false
                    });

                    $that.find('.click-to-exit').remove();
                    $that.removeAttr('data-video-mode');
                    videoMode = false;

                    player.mute();
                }
            });
        }
    });
}