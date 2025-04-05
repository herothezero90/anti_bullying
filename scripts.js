/* eslint-disable no-undef */

$(document).ready(function() {
    $('.first-button').on('click', function () {
        $('.animated-icon1').toggleClass('open');
    });

    $('#cta-button').on('click', function() {
        console.log("'Get Started' button clicked.");
        $('html, body').animate({
            scrollTop: $('.services').offset().top
        }, 800);
    });
    
    $('.service-button').on('click', function() {
        const serviceName = $(this).siblings('.card-title').text();
        console.log(`'Learn More' button clicked for ${serviceName}.`);
        alert(`You clicked on "${serviceName}"! More details coming soon.`);
    });

    $('.get-in-touch-button').on('click', function() {
        console.log("'Get in Touch' button clicked.");
    });

    const $cursor = $('.custom-cursor');

    $(document).on('mousemove', function(e) {
        $cursor.css({
            left: e.clientX + 'px',
            top: e.clientY + 'px'
        });
    });

    const { DateTime } = luxon;

    function displayCurrentDate() {
        const now = DateTime.local();
        const formattedDate = now.toLocaleString(DateTime.DATE_FULL);
        $('#current-date').text(formattedDate);
    }

    displayCurrentDate();

    const msUntilMidnight = DateTime.local().endOf('day').diffNow().toMillis();
    setTimeout(() => {
        displayCurrentDate();
        setInterval(displayCurrentDate, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
});
