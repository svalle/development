var $breadcrumbText;
var $chkRewardLocation;
var $lblRewardLocation;
var promotion;
var rReq;
var resultsLimit = '25';
var showResultinDiv=0;
$(document).ready(function () {
    $breadcrumbText = $("#subnavigation h3 b");
    // $chkRewardLocation = $("#chkRewardLocation");
    // $chkKBRewardsLocation = $("#chkKBRewardsLocation");
    // $lblRewardLocation = $("#lblRewardLocation");
    // $lblRewardLocation.find("a").click(rewardsLocationWebsiteClick);
    // $("#dvResultsImg").css("cursor", "default");
    // $(document).click(function (e) { searchOff(false); routeOff(false); weatherOff(false); });
    // $("#aResetMap").click(resetMapClick);
    // $("#btnFind").click(searchBtnClick);
    // $("#btnRoute").click(routeBtnClick);
    // $("#btnWeather").click(weatherBtnClick);
    // $("#chkStations").change(toggleStations);
    // $("#chkTraffic").change(toggleTraffic);
    // $("#dvRoute")
    //     .click(routeClick)
    //     .hover(routeHoverIn, routeHoverOut);
    // $("#dvSearch")
    //     .click(searchClick)
    //     .hover(searchHoverIn, searchHoverOut);
    // $("#dvWeather")
    //     .click(weatherClick)
    //     .hover(weatherHoverIn, weatherHoverOut);
    // $("#dvRouteForm").click(function (e) { catchEvent(e); });
    // $("#dvSearchForm").click(function (e) { catchEvent(e); });
    // $("#dvWeatherForm").click(function (e) { catchEvent(e); });
    // $(".formDdl").keypress(formKeypress);
    // $(".formTxt").blur(formTxtBlur);
    // $(".formTxt").focus(formTxtFocus);
    // $(".formTxt").keypress(formKeypress);
    // $("div[name=btnReset]").click(resetClick);
    // $chkRewardLocation.click(chkRewardLocationClick);
    // $chkRewardLocation.change(toggleKBStations);
    // $chkKBRewardsLocation.change(toggleKBStations);
    checkPromotions();
    showResultinDiv=1;
    initMap($("#BingMapsKey").val());
    $("#pin-location").click(getNearbyLocation);
    //$("#pin-location").click();
});

function activateHowToPane() {
    $("#dvHowToImg").click(showHowTo);
    $("#dvResultsImg")
        .click(showResults)
        .css("cursor", "");
}

function addResult(resultIn, numIn, routeLink, RewardLocation) {
    if (resultIn.KB) {
        routeLink = routeLink + RewardLocation;
    }
    var html='<div class="result" id="result{0}" onclick="javascript:zoomToPushpin(\'{0}\', \'{1}\', \'{2}\');"><img src="{3}" alt="" class="right" width="{4}%" /><h5 class="red">{5}</h3><h6>{13} Miles</h6><div class="detailed"><div class="station-detail">{6}, {7}, {8}, {9}<a href="" class="green">{11}</a></div><div class="row same-height"><div class="col-sm-7"><ul class="line-options station-type clearfix"></ul></div><div class="col-sm-5 getdirectionsDiv">{12}</div></div></div></div>';
    //var html = '<div id="result{0}" class="result" onclick="javascript:zoomToPushpin(\'{0}\', \'{1}\', \'{2}\');"><div class="rsImg"><img src="{3}" height="{4}" width="{5}" /></div><div class="rsTtl">{6}. {7}</div>{8}<br />{9}, {10} {11}<br /><a href="tel:{12}">{13}</a><br />{14}</div>';
    var iconPath = "img/common/logo.png";
    var iconWidth = resultIn.Brand == "CON" ? 45 : 25;
    var distance = parseFloat(convertKilometersToMiles(resultIn.__Distance)).toFixed(1);
    //$("#dvResultsTxt").append($.validator.format(html, resultIn.EntityID, resultIn.Latitude, resultIn.Longitude, iconPath, 20, iconWidth, numIn, resultIn.Name, resultIn.AddressLine, resultIn.Locality, resultIn.AdminDistrict, resultIn.PostalCode, getPhoneNumberDigitsUS(resultIn.Phone), getPhoneNumberFormattedUS(resultIn.Phone), routeLink));
    $("#dvResultsTxt").append($.validator.format(html, resultIn.EntityID, resultIn.Latitude, resultIn.Longitude, iconPath, 20, resultIn.Name, resultIn.AddressLine, resultIn.Locality, resultIn.AdminDistrict, resultIn.PostalCode, getPhoneNumberDigitsUS(resultIn.Phone), getPhoneNumberFormattedUS(resultIn.Phone), routeLink, distance));

    //displaying ameneties icons
    var amenities = [{ key: "kickback", value: resultIn.KB }, { key: "diesel", value: resultIn.Diesel }, { key: "carwash", value: resultIn.CarWash },
                    { key: "atm", value: resultIn.ATM }, { key: "cstore", value: resultIn.CStore }, { key: "tfh", value: resultIn.TFH },
                    { key: "trs", value: resultIn.TRS }, { key: "freeair", value: resultIn.FreeAir },
                    { key: "jambago", value: resultIn.JambaGo }, { key: "vending", value: resultIn.Vending }, { key: "fastflow", value: resultIn.FastFlow }, 
                    { key: "uimg", value: resultIn.UIMG }];
    var cntr = 0;
    var topcntr = 0;
    var xoffset = 48;
    var yoffset = 70;
    for (var i = 0; i < amenities.length; i++) {
        if (amenities[i].value) {
            // if (cntr == 0 && topcntr==0) {
            //     //add a parent div
            //     $("#result" + resultIn.EntityID).append('<div style="position:relative;left:-20px" id=dv' + resultIn.EntityID + '>');
            // }
            if (amenities[i].key == "kickback") {
                $("#result" + resultIn.EntityID+ " .station-type").append('<li><span class="icon-icon_kickback icon"></span>Kickback</li>');
                //$("#dv" + resultIn.EntityID + ' .tfh').css("left", (cntr * xoffset));
                //$("#dv" + resultIn.EntityID + ' .tfh').css("top", topcntr * yoffset);
                cntr++;
            }
            if (amenities[i].key == "diesel") {
                $("#result" + resultIn.EntityID + " .station-type").append('<li><span class="icon-icon_diesel icon"></span>Diesel</li>');
                //$("#dv" + resultIn.EntityID + ' .diesellogo').css("left", (cntr * xoffset));
                cntr++;
            }
            if (amenities[i].key == "carwash") {
                $("#result" + resultIn.EntityID+ " .station-type").append('<li><span class="icon-icon_carwash icon"></span>Carwash</li>');              
                //$("#dv" + resultIn.EntityID + ' .carwash').css("left", (cntr * xoffset));
                cntr++;
            }
            if (amenities[i].key == "atm") {
                $("#result" + resultIn.EntityID+ " .station-type").append('<li><span class="icon-icon_atm icon"></span>ATM</li>');
                //$("#dv" + resultIn.EntityID + ' .atm').css("left", (cntr * xoffset))                        
                //cntr++;
            }
            if (amenities[i].key == "cstore") {
                $("#result" + resultIn.EntityID+ " .station-type").append('<li><span class="icon-icon_conv_store icon"></span>C Store</li>');
                //$("#dv" + resultIn.EntityID + ' .cstore').css("left", (cntr * xoffset));
                //$("#dv" + resultIn.EntityID + ' .cstore').css("top", (topcntr * yoffset));
                //cntr++;
                }
            if (amenities[i].key == "tfh") {
                $("#result" + resultIn.EntityID+ " .station-type").append('<li><span class="icon-icon_24hrs icon"></span>24 hrs.</li>');
                //$("#dv" + resultIn.EntityID + ' .tfh').css("left", (cntr * xoffset));
                //$("#dv" + resultIn.EntityID + ' .tfh').css("top", topcntr * yoffset);
                cntr++;
            }
            
            // if (amenities[i].key == "trs") {
            //     $("#dv" + resultIn.EntityID).append("<div class='spriteimg trs'></div>");
            //     $("#dv" + resultIn.EntityID + ' .trs').css("left", (cntr * xoffset));
            //     $("#dv" + resultIn.EntityID + ' .trs').css("top", topcntr * yoffset);
            //     cntr++;
            // }
            // if (amenities[i].key == "freeair") {
            //     $("#dv" + resultIn.EntityID).append("<div class='spriteimg freeair'></div>");
            //     $("#dv" + resultIn.EntityID + ' .freeair').css("left", (cntr * xoffset));
            //     $("#dv" + resultIn.EntityID + ' .freeair').css("top", topcntr * yoffset);
            //     cntr++;
            // }
            // if (amenities[i].key == "jambago") {
            //     $("#dv" + resultIn.EntityID).append("<div class='spriteimg jambago'></div>");
            //     $("#dv" + resultIn.EntityID + ' .jambago').css("left", (cntr * xoffset));
            //     $("#dv" + resultIn.EntityID + ' .jambago').css("top", topcntr * yoffset);
            //     cntr++;
            // }
            // if (amenities[i].key == "vending") {
            //     $("#dv" + resultIn.EntityID).append("<div class='spriteimg vending'></div>");
            //     $("#dv" + resultIn.EntityID + ' .vending').css("left", (cntr * xoffset));
            //     $("#dv" + resultIn.EntityID + ' .vending').css("top", topcntr * yoffset);
            //     cntr++;
            // }
            // if (amenities[i].key == "fastflow") {
            //     $("#dv" + resultIn.EntityID).append("<div class='spriteimg fastflow'></div>");
            //     $("#dv" + resultIn.EntityID + ' .fastflow').css("left", (cntr * xoffset));
            //     $("#dv" + resultIn.EntityID + ' .fastflow').css("top", topcntr * yoffset);
            //     cntr++;
            // }
            // if (amenities[i].key == "uimg") {
            //     $("#dv" + resultIn.EntityID).append("<div class='spriteimg uimg'></div>");
            //     $("#dv" + resultIn.EntityID + ' .uimg').css("left", (cntr * xoffset));
            //     $("#dv" + resultIn.EntityID + ' .uimg').css("top", topcntr * yoffset);
            //     cntr++;
            // }
            // if (amenities[i].key == "snacks") {
            //     $("#dv" + resultIn.EntityID).append("<div class='spriteimg snacks'></div>");
            //     $("#dv" + resultIn.EntityID + ' .snacks').css("left", (cntr * xoffset));
            //     $("#dv" + resultIn.EntityID + ' .snacks').css("top", topcntr * yoffset);
            //     cntr++;
            // }
            //increase the height of the parent div
            // if (cntr == 4) {
            //     cntr = 0; topcntr++;
            //     $("#result" + resultIn.EntityID).height("+=70");
            // }
        }
    }

    // if (cntr > 0) {
    //     //increase the height of the parent div
    //     if (topcntr <= 4) { $("#result" + resultIn.EntityID).height("+=70"); }        
    //     $("#result" + resultIn.EntityID).append('</div>');
    // }
}

function checkPromotions() {
    //hide Tank5 link
    $(".dvTank5Rules").css('display', 'none');
    $(".tank5logo").css('display', 'none');
    promotion = getQueryStringByKey("p");

    switch (promotion) {
        case "kb":
            updateBreadcrumbText("STATION FINDER");
            setRewardsLocation(true);
            break;
        case "gfl":
            updateBreadcrumbText("GAS FOR LIFE STATION FINDER");
            break;
        case "t5": //Updated Sprite Image for Tank5 Stations            
            updateBreadcrumbText("Tank5 Stations");
            $(".dvTank5Rules").css('display', '');
            $(".promologo").css('display', '');
            $("#dvSearch").css('background-image', 'url(../../media/img/station-finder/stationfinder-sprite-t5.png)');
            $(".promologo").css('background-image', 'url(../../media/img/station-finder/tank5_logo.png)');
            break;
        case "db":
            updateBreadcrumbText("Denver Broncos");
            $(".promologo").css('display', '');
            $(".promologo").css('background-image', 'url(../../media/img/station-finder/denver-broncos.png)');
            break;
        default:
            updateBreadcrumbText("STATION FINDER");
            break;
    }

    if ((promotion != "") && (promotion != "kb"))
        addFilter(promotion.toUpperCase(), "Eq", "TRUE", false);
}

function clearResults(bKeepMe) {
    $("#dvResultsTxt").empty();
    removePushPins(bKeepMe);
}

function deactivateHowToPane() {
    $("#dvHowToImg")
        .unbind("click")
        .removeClass("alt");
    $("#dvResultsImg")
        .css("cursor", "default")
        .unbind("click")
        .removeClass("alt");
}

function disableOptionStations() {
    $("#chkStations").attr("disabled", "disabled");
}

function disableOptionTraffic() {
    $("#chkTraffic").attr("disabled", "disabled");
}

function enableOptionStations() {
    $("#chkStations").removeAttr("disabled");
}

function enableOptionTraffic() {
    $("#chkTraffic").removeAttr("disabled");
}

function enableOptionKickback() {
    $("#chkKBRewardsLocation").removeAttr("disabled");
    $chkKBRewardsLocation.removeAttr("checked");
    $chkRewardLocation.removeAttr("checked");
    removeFilter("KB");
}

function disableOptionKickback() {
    $("#chkKBRewardsLocation").attr("disabled", "disabled");
}

function findNearbyBack(result) {
    var results = result.d;
    var nlimit = results.__count > 25 ? 25 : results.__count;
    var bbox = new Array(4);
    if (nlimit == 0) {
        hideLoading();
        showError("No stations found within the range specified.");
        centerMapOnMe();
    }
    else {
        var me = getMe();
        bbox[0] = me.latitude;
        bbox[1] = me.longitude;
        bbox[2] = me.latitude;
        bbox[3] = me.longitude;
        var pushpinMeOptions = {icon: "img/common/mylocation.png", width: 33, height: 42}; 
        //addPushpin(new Microsoft.Maps.Location(bbox[0], bbox[1]), pushpinMeOptions);
        var pushpin= new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(bbox[0], bbox[1]), pushpinMeOptions);
        bmo.map.entities.push(pushpin);
        var nearDistance = 5;
        var stationId = 0;
        for (var i = 0; i < nlimit; i++) {
            var step = results.results[i];
            //var iconPath = "img/station-finder/pin_" + step.Brand + ".gif";
            var iconPath = "img/common/default_pin.png";
            var iconWidth = step.Brand == "CON" ? 45 : 30;

            var pushpinOptions = {
                icon: iconPath,
                height: 35,
                typeName: "ConocoPP pinID"+step.EntityID,
                // visible: visible,
                width: 29,
                zIndex: 1
            };

            var sRouteLink = $.validator.format(bmo.routeLinkHTML, me.latitude, me.longitude, "Me", step.Latitude, step.Longitude, step.Name);

            var sRewardLocation = "";

            if (step.KB)
                sRewardLocation = $.validator.format(bmo.rewardLocationHTML, 'http://www.kickbackpoints.com/', 'KickBack Points');

            var desc = $.validator.format(bmo.ibHTML, (i + 1), step.Name, step.AddressLine, step.Locality, step.AdminDistrict, step.PostalCode, getPhoneNumberDigitsUS(step.Phone), getPhoneNumberFormattedUS(step.Phone), step.Latitude, step.Longitude, sRouteLink, sRewardLocation);
            addPushpin(new Microsoft.Maps.Location(step.Latitude, step.Longitude), pushpinOptions, step.Name, desc, step.EntityID, step.KB);
            bbox[0] = step.Latitude > bbox[0] ? step.Latitude : bbox[0];
            bbox[1] = step.Longitude < bbox[1] ? step.Longitude : bbox[1];
            bbox[2] = step.Latitude < bbox[2] ? step.Latitude : bbox[2];
            bbox[3] = step.Longitude > bbox[3] ? step.Longitude : bbox[3];
            addResult(step, i + 1, sRouteLink, sRewardLocation);

            if (i == 0)
                $("#dvResultsTxt").children().first().addClass("first");

            if ((i + 1) == nlimit)
                $("#dvResultsTxt").children().last().addClass("last");

            if (nearDistance > step.__Distance) {
                nearDistance = step.__Distance;
                stationId = step.EntityID;
                nstep=i
            }
        }

        setMapView(bbox);

        if ($("#chkStations").is(":checked"))
            bmo.map.entities.setOptions({ visible: true });

        //Cufon.replace("#dvResultsTxt .rsTtl", { fontFamily: "brandon_grotesquebold" });
        //Cufon.now();
        hideLoading();
        $('.result').hover(function(){
            var Eid=($(this).attr('id')).substr(6);
            $('.pinID'+Eid).addClass('selectedStation');
        },function(){
            var Eid=($(this).attr('id')).substr(6);
            $('.pinID'+Eid).removeClass('selectedStation');
        });
        showNearStation(stationId);
        // var sStations = "stations";

        // if (results.__count == 1)
        //     sStations = "station";

        // if (results.__count > resultsLimit)
        //     showSearchResults(results.__count + ' ' + sStations + ' found.<br />Results limited to ' + resultsLimit + '.');
        // else
        //     showSearchResults(nlimit + ' ' + sStations + ' found.');

    }
}
function showNearStation(stationID){
    
    scrollToResult(stationID);
    showResults();
}
function formKeypress(e) {
    if (e.which == 13) {
        catchEvent(e);
        $button = $(e.target).siblings(".formBtn").first();

        if ($(e.target).parent().attr("id") == "dvRouteTo")
            $button = $("#btnRoute");

        $button.click();
    }
}

function formTxtBlur(e) {
    catchEvent(e);

    if ($(this).val() == "")
        $(this).val($(this).attr("default"));
}

function formTxtFocus(e) {
    catchEvent(e);

    if (($(this).val() == $(this).attr("default")) || ($(this).val() == ""))
        $(this).val("");
    else
        $(this).select();
}

function getVal($elmIn) {
    switch ($elmIn.prop("tagName").toLowerCase()) {
        case "input":
            return $elmIn.val() == $elmIn.attr("default") ? "" : $elmIn.val();
            break;
        case "select":
            return $elmIn.val() == 0 ? "" : $elmIn.val();
            break;
    }
}

function hideError() {
    $("#dvError").slideUp("fast", function () { $(this).empty(); });
    $(".error").removeClass("error");
}

function hideHowTo() {
    $("#dvHowToImg").addClass("alt");
    $("#dvHowToTxt").hide();
}

function hideLoading() {
    $("#dvLoading").hide();
}

function hideResults() {
    $("#dvResultsImg").removeClass("alt");
    $("#dvResultsTxt").hide();
}

function locationGeocoded(result) {
    var loc = result.resourceSets[0].resources[0];
    var bLoc = new Microsoft.Maps.Location(loc.point.coordinates[0], loc.point.coordinates[1]);
    var visible = $("#chkStations").is(":checked");

    var pinOptions = {
        text: "Me",
        typeName: "bingme",
        visible: visible,
        zIndex: 2
    };

    var add = loc.address.addressLine ? loc.address.addressLine : "";
    var zip = loc.address.postalCode ? loc.address.postalCode.substr(0, 5) : "";
    var desc = $.validator.format(bmo.ibMeHTML, "Me", add, loc.address.locality, loc.address.adminDistrict, zip, bLoc.latitude, bLoc.longitude);
    //addPushpin(bLoc, pinOptions, "Me", desc);
    setMe(bLoc);
    findNearby(bLoc.latitude, bLoc.longitude);
    //showResults();
    activateHowToPane();
    enableOptionStations();
    enableOptionTraffic();
    //enableOptionKickback();
}
function getAdress(result) {
    var loc = result.resourceSets[0].resources[0];
    var address = loc.address.formattedAddress;
    $('#addressLocation').val(address);
}

function locationGeocodedFrom(result) {
    var loc = result.resourceSets[0].resources[0];
    rReq.sNam = loc.name;
    rReq.sLoc = new Microsoft.Maps.Location(loc.point.coordinates[0], loc.point.coordinates[1]);
    geocodeLocation(rReq.eAdd, rReq.eCit, rReq.eSta, rReq.eZip, locationGeocodedTo);
}

function locationGeocodedTo(result) {
    var loc = result.resourceSets[0].resources[0];
    rReq.eNam = loc.name;
    rReq.eLoc = new Microsoft.Maps.Location(loc.point.coordinates[0], loc.point.coordinates[1]);
    getRoute(rReq, true);
    showResults();
    activateHowToPane();
    enableOptionStations();
    enableOptionTraffic();
    enableOptionKickback();
}

function resetClick(e) {
    catchEvent(e);
    var $parent = $(this).parent();

    if ($(this).attr("id") == "btnRouteReset")
        $parent = $(this).parent().parent();

    $parent.find("input").each(function () { $(this).val($(this).attr("default")); });
    $parent.find("select").each(function () { $(this)[0].selectedIndex = 0; });
    $parent.find("input[type=radio]:first").attr("checked", "checked");
}

function resetOptions() {
    $("#chkStations").attr("checked", "checked");
    $("#chkTraffic").removeAttr("checked");
    disableOptionStations();
    disableOptionTraffic();
}

function resetMapClick(e) {
    catchEvent(e);
    resetMap();
    deactivateHowToPane();
    showHowTo();
    clearResults();
    resetOptions();
    hideError();
    return false;
}

function routeBtnClick(e) {
    catchEvent(e);
    clearResults();
    var fcit = getVal($("#txtCityFrom"));
    var fsta = getVal($("#ddlStateFrom"));
    var fstr = getVal($("#txtStreetFrom"));
    var fzip = getVal($("#txtZipFrom"));
    var tcit = getVal($("#txtCityTo"));
    var tsta = getVal($("#ddlStateTo"));
    var tstr = getVal($("#txtStreetTo"));
    var tzip = getVal($("#txtZipTo"));

    if (validateSearch(fzip, fcit, fsta) && validateSearch(tzip, tcit, tsta)) {
        hideError();
        routeOff(false);
        rReq = new RouteRequest();
        rReq.eAdd = tstr;
        rReq.eCit = tcit;
        rReq.eSta = tsta;
        rReq.eZip = tzip;
        rReq.sAdd = fstr;
        rReq.sCit = fcit;
        rReq.sSta = fsta;
        rReq.sZip = fzip;
        showLoading();
        geocodeLocation(rReq.sAdd, rReq.sCit, rReq.sSta, rReq.sZip, locationGeocodedFrom);
        $('#dvResultsTxt').prepend('<div id="dvMapInfo"><div id="printImage"><a href="javascript:window.print();" title="PRINT"><img src="/img/find_a_station/cnc_print_icon.png" alt="PRINT"></a></div></div>');
    }
    else {
        resetMap();
        resetOptions();
        deactivateHowToPane();
        showHowTo();
        $("#txtCityFrom").addClass("error");
        $("#txtZipFrom").addClass("error");
        $("#ddlStateFrom").addClass("error");
        $("#txtCityTo").addClass("error");
        $("#txtZipTo").addClass("error");
        $("#ddlStateTo").addClass("error");
        showError("Enter at least a zipcode or city/state combination.");
    }
}

function routeClick(e) {
    catchEvent(e);
    $("#dvRouteForm").is(":visible") ? routeOff(true) : routeOn();
    searchOff(false);
    weatherOff(false);
}

function routeHoverIn(e) {
    catchEvent(e);
    $("#dvRoute").addClass("down");
}

function routeHoverOut(e) {
    catchEvent(e);

    if (!$("#dvRouteForm").is(":visible"))
        $("#dvRoute").removeClass("down");
}

function routeOff(down) {
    if (!down)
        $("#dvRouteForm").slideUp("fast", function () { $("#dvRoute").removeClass("down"); });
    else
        $("#dvRouteForm").slideUp("fast");
}

function routeOn() {
    $("#dvRouteForm").slideDown();
    $("#dvRoute").addClass("down");
}

function RouteRequest() {
    this.$element = $("#dvResultsTxt");
    this.eAdd = null;
    this.eCit = null;
    this.eLoc = null;
    this.eNam = null;
    this.eSta = null;
    this.eZip = null;
    this.sAdd = null;
    this.sCit = null;
    this.sLoc = null;
    this.sNam = null;
    this.sSta = null;
    this.sZip = null;
}

function scrollToResult(idIn,ActualPin) {
    //console.log($(ActualPin).attr('class'));
    var $target = $("#result" + idIn);
    if($("#dvResultsTxt").hasClass('active')){
        $(".result").addClass('noDetails');
        $("#result" + idIn).removeClass('noDetails');
        $("#dvResultsTxt")
            .stop()
            .scrollTo($target, 800, { offset: 0, onAfter: function () {  } });
    }else{
    $("#dvResultsTxt > .active").removeClass("active");
    }
    
    showResults();
    $target.addClass("active");
    $('.ConocoPP').removeClass('selectedStation').removeClass('clicked');
    $('.pinID'+idIn).addClass('selectedStation').addClass('clicked');

    // $("#dvResultsTxt")
    //     .stop()
    //     .scrollTo($target, 800, { offset: -8, onAfter: function () { $target.addClass("active", 250); } });
}
function searchBtnClick(address) {
    //catchEvent(e);
    clearResults();
    //var cit = city;
    //var sta = state;
    var str = address;
    //var zip = getVal($("#txtZip"));
    bmo.range = getVal($("#ddlRange"));
    //var str = "";
    //var zip = "";
    //bmo.range = getVal($("#ddlRange"));

    if (validateSearch(str)) {
        hideError();
        searchOff(false);
        showLoading();
        geocodeLocation(str, locationGeocoded);
    }
    else {
        resetMap();
        resetOptions();
        deactivateHowToPane();
        showHowTo();
        $("#txtCity").addClass("error");
        $("#txtZip").addClass("error");
        $("#ddlState").addClass("error");
        showError("Enter at least a zipcode or city/state combination.");
    }
}

function searchClick(e) {
    catchEvent(e);
    $("#dvSearchForm").is(":visible") ? searchOff(true) : searchOn();
    routeOff(false);
    weatherOff(false);
}

function searchHoverIn(e) {
    catchEvent(e);
    $("#dvSearch").addClass("down");
}

function searchHoverOut(e) {
    catchEvent(e);

    if (!$("#dvSearchForm").is(":visible"))
        $("#dvSearch").removeClass("down");
}

function searchOff(down) {
    if (!down)
        $("#dvSearchForm").slideUp("fast", function () { $("#dvSearch").removeClass("down"); });
    else
        $("#dvSearchForm").slideUp("fast");
}

function searchOn() {
    $("#dvSearchForm").slideDown();
    $("#dvSearch").addClass("down");
}

function showError(msgIn) {
    var errElm = $("#dvError");

    if (msgIn.statusText)
        msgIn = msgIn.statusText;

    errElm.html(msgIn);
    errElm.slideDown();
}

function showHowTo() {
    hideResults();
    $("#dvHowToImg").removeClass("alt");
    $("#dvHowToTxt").show();
}

function showLoading() {
    $("#dvLoading").show();
}

function showResults() {
    // hideHowTo();
    // $("#dvResultsImg").addClass("alt");
    $(".resultsDiv").show();
}

function showRouteStations() {
    $(".directionsPanel.MicrosoftMap").attr("style", "");
    request = $.validator.format(bmo.stationsURL, "a1ed23772f5f4994a096eaa782d07cfb", "US_BrandedSites", "Sites", rReq.sLoc.latitude, rReq.sLoc.longitude, rReq.eLoc.latitude, rReq.eLoc.longitude, getExtraFilterString(), bmo.key);
    $.ajax({
        url: request,
        type: "get",
        dataType: 'jsonp',
        jsonp: 'jsonp',
        success: showRouteStationsBack,
        error: showError
    });

    return false;
}

function showRouteStationsBack(result) {
    var visible = $("#chkStations").is(":checked");
    var results = result.d;
    var limit = results.__count;

    //Calculate distance from the origin for each station
    for (var i = 0; i < limit; i++) {
        var dist = calculateDistanceFromGeo(rReq.sLoc.latitude, results.results[i].Longitude, results.results[i].Latitude, rReq.sLoc.longitude);
        results.results[i].distance = dist;
    }
    //Sort the stations based on distance from  origin
    var locations = [];
    locations = results.results;
    function sortLoc(a, b) {
        return a.distance - b.distance;
    }
    locations.sort(sortLoc);

    for (var i = 0; i < limit; i++) {
        var step = locations[i];
        var iconPath = "../img/station-finder/pin_" + step.Brand + ".gif";
        var iconWidth = step.Brand == "CON" ? 45 : 30;

        var pushpinOptions = {
            icon: iconPath,
            height: 32,
            typeName: "bingpp",
            visible: visible,
            width: iconWidth,
            zIndex: 1
        };

        var sRouteLink = $.validator.format(bmo.routeLinkHTML, rReq.sLoc.latitude, rReq.sLoc.longitude, rReq.sNam, step.Latitude, step.Longitude, step.Name);

        var sRewardLocation = "";

        if (step.KB)
            sRewardLocation = $.validator.format(bmo.rewardLocationHTML, 'http://www.kickbackpoints.com/', 'KickBack Points');

        var desc = $.validator.format(bmo.ibHTML, (i + 1), step.Name, step.AddressLine, step.Locality, step.AdminDistrict, step.PostalCode, getPhoneNumberDigitsUS(step.Phone), getPhoneNumberFormattedUS(step.Phone), step.Latitude, step.Longitude, sRouteLink, sRewardLocation);
        addPushpin(new Microsoft.Maps.Location(step.Latitude, step.Longitude), pushpinOptions, step.Name, desc, step.EntityID, step.KB);
        addResult(step, i + 1, sRouteLink, sRewardLocation);

        if (i == 0)
            $("#dvResultsTxt").children().first().addClass("first");

        if ((i + 1) == results.length)
            $("#dvResultsTxt").children().last().addClass("last");
    }

    hideLoading();




}

function validateSearch(addressIn) {
    //if ((isValidZip(zipIn)) || ((citIn && (citIn != "")) && (staIn && (staIn != ""))))
    if(addressIn && (addressIn != ""))
        return true;
    else
        return false;
}

function weatherBtnClick(e) {
    catchEvent(e);
    var zip = getVal($("#txtZipWeather"));

    if (validateSearch(zip)) {
        hideError();
        weatherOff(true);
        showLoading();
        getWeather(zip, $("#dvWeatherResult"));
    }
    else {
        $("#txtZipWeather").addClass("error");
        showError("Enter a valid zipcode.");
    }
}

function weatherClick(e) {
    catchEvent(e);
    $("#dvWeatherForm").is(":visible") ? weatherOff(true) : weatherOn();
    routeOff(false);
    searchOff(false);
}

function weatherHoverIn(e) {
    catchEvent(e);
    $("#dvWeather").addClass("down");
}

function weatherHoverOut(e) {
    catchEvent(e);

    if (!(($("#dvWeatherForm").is(":visible")) || ($("#dvWeatherResult").is(":visible"))))
        $("#dvWeather").removeClass("down");
}

function weatherOff(down) {
    if (!down)
        $("#dvWeatherForm").slideUp("fast", function () { $("#dvWeather").removeClass("down"); });
    else
        $("#dvWeatherForm").slideUp("fast");

    $("#dvWeatherResult").slideUp("fast", function () { $(this).html(""); });
}

function weatherOn() {
    if ($("#dvWeatherResult").is(":visible"))
        $("#dvWeatherResult").slideUp("fast", function () {
            $(this).html("");
            $("#dvWeatherForm").slideDown();
            $("#dvWeather").addClass("down");
        });
    else {
        $("#dvWeatherForm").slideDown();
        $("#dvWeather").addClass("down");
    }
}

function zoomToPushpin(idIn, latIn, lonIn) {
    scrollToResult(idIn);
    zoomTo(latIn, lonIn, 14);
}

function setRewardsLocation(bRewardsLocationsOnly) {
    if (bRewardsLocationsOnly) {
        $chkRewardLocation.attr("checked", "checked");
        addFilter("KB", "Eq", "TRUE", false);
    }
    else {
        $chkRewardLocation.removeAttr("checked");
        removeFilter("KB");
    }
}

function chkRewardLocationClick(e) {
    setRewardsLocation($chkRewardLocation.attr("checked") == "checked");
}

function chkKBRewardLocationClick(e) {
    setKBRewardsLocation($chkKBRewardsLocation.attr("checked") == "checked");
}

function updateBreadcrumbText(sNewTextIn) {
    $breadcrumbText.text(sNewTextIn);


}

function routeLinkClick(sLat, sLon, sName, eLat, eLon, eName) {
    clearResults(true);
    rReq = new RouteRequest();
    rReq.sNam = sName;
    rReq.sLoc = new Microsoft.Maps.Location(sLat, sLon);
    rReq.eNam = eName;
    rReq.eLoc = new Microsoft.Maps.Location(eLat, eLon);
    getRoute(rReq, false);
    $('#dvResultsTxt').prepend('<div id="dvMapInfo"><div id="printImage"><a href="javascript:window.print();" title="PRINT"><img src="/img/find_a_station/cnc_print_icon.png" alt="PRINT"></a></div></div>');
    ibClose();
    return false;
}

function rewardsLocationWebsiteClick(e) {
    setRewardsLocation($chkRewardLocation.attr("checked") != "checked");
}

function showSearchResults(msgIn, ResponseStatus) {
    var errElm = $('#dvResultsTxt');
    errElm.prepend('<div id="dvMapInfo"><div id="printImage"><a href="javascript:window.print();" title="PRINT"><img src="/img/find_a_station/cnc_print_icon.png" alt="PRINT"></a></div>' + msgIn + '</div>');
}

function setRewardsLocation(bRewardsLocationsOnly) {
    if (bRewardsLocationsOnly) {
        $chkRewardLocation.attr("checked", "checked");
        addFilter("KB", "Eq", "TRUE", false);
    }
    else {
        $chkRewardLocation.removeAttr("checked");
        removeFilter("KB");
    }
}
function getNearbyLocation(e){
    e.preventDefault();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPositionLatLonga);
    } else {
        //alert("Geolocation is not supported by this browser.");
    }
    
}

function getPositionLatLonga(map) {
        var coords = map;
        myLat = map.coords.latitude;
        myLong = map.coords.longitude;
        showResultinDiv=1;
        clearResults();
        
        findNearStation(map.coords.latitude, map.coords.longitude,true);
        //myLat = 33.7683; myLong = -118.1956;
        //findNearStation(33.7683,-118.1956);
    }