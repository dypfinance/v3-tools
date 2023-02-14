(function($) {
    "use strict";

    //===== Prealoder
    $(window).on('load', function(event) {
        $('.proloader').delay(500).fadeOut(500);
    });


    // sticky
    var wind = $(window);
    var sticky = $('.header-wrap');
    wind.on('scroll', function() {
        var scroll = wind.scrollTop();
        if (scroll < 100) {
            sticky.removeClass('sticky');
        } else {
            sticky.addClass('sticky');
        }
    });

    //dropdown list
    // $('.dropdown').on('click', function() {
    //     $(this).toggleClass('open')
    // });
    //Open popup
    $('.btn-popup').on('click', function() {
        $('.popup-modal').addClass('open');
        $('.body_overlay').addClass('open');
    });
    //close popup
    $('.popup-close button, .body_overlay').on('click', function() {
        $('.popup-modal').removeClass('open');
        $('.body_overlay').removeClass('open');
    });
    //Minimize sidebar
    $('.minimize_btn').on('click', function() {
        $('.page_wrapper').toggleClass('minimize')
    });

    //Change theme Color
    $('.change-clr').on('click', function() {
        if ($('body').hasClass('theme-dark')) {
            $('body').removeClass('theme-dark');
            $('body').addClass('theme-white');
        } else {
            $('body').addClass('theme-dark');
            $('body').removeClass('theme-white');
        }
    });
    //open & close Sidebar in mobile
    $('.hamburger-menu').on('click', function() {
        $('.sidebar').addClass('open')
    });
    $('.close-sidebar').on('click', function() {
        $('.sidebar').removeClass('open')
    });

    //Progress Bar Animation
    // $('.progress-bar').appear(function() {
    //     var element = $(this);
    //     var delay = 500;
    //     element.each(function(i) {
    //         $(this).delay(delay * i).animate({ width: $(this).attr('aria-valuenow') + '%' }, delay);

    //         $(this.span).prop('Counter', 0).animate({
    //             Counter: $(this).text()
    //         }, {
    //             duration: delay,
    //             easing: 'swing',
    //             step: function(now) {
    //                 $(this).text(Math.ceil(now) + '%');
    //             }
    //         });
    //     });
    // });

    //Nicescroll
    var nice = $(".sidebar").niceScroll();


    // Show or hide the scroll-to-top button
    $(window).on('scroll', function(event) {
        if ($(this).scrollTop() > 600) {
            $('.back-to-top').fadeIn(200)
        } else {
            $('.back-to-top').fadeOut(200)
        }
    });


    //Animate the scroll to top
    $('.back-to-top').on('click', function(event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: 0,
        }, 1500);
    });
    //progressbar
    var progress_one = document.querySelector('.progress-done-one');
    var progress_two = document.querySelector('.progress-done-two');
    var progress_three = document.querySelector('.progress-done-three');
    var progress_four = document.querySelector('.progress-done-four');
    var progress_five = document.querySelector('.progress-done-five');

    progress_one.style.width = progress_one.getAttribute('data-done') + '%';
    progress_two.style.width = progress_two.getAttribute('data-done') + '%';
    progress_three.style.width = progress_three.getAttribute('data-done') + '%';
    progress_four.style.width = progress_four.getAttribute('data-done') + '%';
    progress_five.style.width = progress_five.getAttribute('data-done') + '%';
    progress_one.style.opacity = 1;
    progress_two.style.opacity = 1;
    progress_three.style.opacity = 1;
    progress_four.style.opacity = 1;
    progress_five.style.opacity = 1;


})(jQuery);