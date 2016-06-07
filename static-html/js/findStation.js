// A $( document ).ready() block.
$(document).ready(function () {
    $('.showFilter').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $('.finder-filterOptions').slideToggle('fast');
    });
    $('.miles-select li a').click(function (e) {
        e.preventDefault();
        $('.miles-select li a').not(this).removeClass('active');
        $(this).toggleClass('active');
    });
    $('.type-select li a').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            addFilter($(this).attr('data-filter'), "Eq", "TRUE", false);
        }
        else {
            removeFilter($(this).attr('data-filter'));
        }
    });
    $('.miles-select li a').click(function (e) {
        e.preventDefault();
        $('#ddlRange').val($(this).attr('data-range'));
    });
    $('.reset').click(function (e) {
        e.preventDefault();
        $("#addressLocation").val("");
        $('#ddlRange').val("5");
        $('.type-select li a').each(function () {
            if ($(this).hasClass('active')) {
                removeFilter($(this).attr('data-filter'));
            }
        });
        $('.miles-select li a').removeClass('active');
        $('.type-select li a').removeClass('active');
        $('.miles-select li a.default').addClass('active');
        $('.type-select li a.default').addClass('active');
        $("#addressLocation").focus();
    });

    $("#addressLocation").keyup(function (e) {
        if (e.which == 13) {
            address = $(this).val();
            searchBtnClick(address);
        }
    });
    $('#ApplyFilter').click(function (e) {
        address = $('#addressLocation').val();
        searchBtnClick(address);
        e.preventDefault();
    });
    $('.controlBtn').click(function (e) {
        $('.controlBtn .off').toggle();
        $('.controlBtn .on').toggle();
        $('.controlBtn .arrow').toggleClass('active');
        $('#dvResultsTxt').toggleClass('active');
        $('#dvResultsTxt .result').toggleClass('active').toggleClass('noDetails');
        var Eid = ($('.ConocoPP.clicked').attr('class')).split(' ');
        Eid = (Eid[1]).substr(5);
        $('#dvResultsTxt #result' + Eid).addClass('active').removeClass('noDetails');
        e.preventDefault();
    });

});// end document ready
