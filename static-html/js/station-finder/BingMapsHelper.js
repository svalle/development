var bmo;

function addPushpin(location, pushpinOptions, titleIn, descriptionIn, resultIDIn,isKB) {
    var pushpin= new Microsoft.Maps.Pushpin(location, pushpinOptions);
    pushpin.title = titleIn;
    pushpin.description = descriptionIn;
    pushpin.isKB = isKB;
    if (!Microsoft.Maps.Events.hasHandler(pushpin, "click")) {
        if (resultIDIn)
            Microsoft.Maps.Events.addHandler(pushpin, "click", function(e) { e = $.event.fix(e); catchEvent(e); scrollToResult(resultIDIn,pushpin); });
            //Microsoft.Maps.Events.addHandler(pushpin, "mouseover", function(e) { e = $.event.fix(e); catchEvent(e); overPin(resultIDIn); });
            //Microsoft.Maps.Events.addHandler(pushpin, "mouseout", function(e) { e = $.event.fix(e); catchEvent(e); outPin(resultIDIn); });
        else
            Microsoft.Maps.Events.addHandler(pushpin, "click", pushpinClick);
    }

    bmo.map.entities.push(pushpin);
}

function BingMapsObj(bingMapsKeyIn) {
    this.key = bingMapsKeyIn;
    this.ibHTML = '<div class="infobox"><div class="ibTitle">{0}. {1}</div><div class="ibDesc">{2}<br />{3}, {4} {5}<br /><a href="tel:{6}">{7}</a><br />{10}{11}</div><div class="ibFooter"><div class="ibLine"><div class="ibArrow"></div></div><div class="ibZoom">Zoom to - <a href="#" onclick="javascript:zoomTo(\'{8}\',\'{9}\',20);">street</a><span class="ibZoomDiv">|</span><a href="#" onclick="javascript:zoomTo(\'{8}\',\'{9}\',11);">city</a><span class="ibZoomDiv">|</span><a href="#" onclick="javascript:zoomTo(\'{8}\',\'{9}\',9);">region</a></div></div></div>';
    this.ibMeHTML = '<div class="infobox"><div class="ibTitle">{0}</div><div class="ibDesc">{1}<br />{2}, {3} {4}</div><div class="ibFooter"><div class="ibLine"><div class="ibArrow"></div></div><div class="ibZoom">Zoom to - <a href="#" onclick="javascript:zoomTo(\'{5}\',\'{6}\',20);">street</a><span class="ibZoomDiv">|</span><a href="#" onclick="javascript:zoomTo(\'{5}\',\'{6}\',11);">city</a><span class="ibZoomDiv">|</span><a href="#" onclick="javascript:zoomTo(\'{5}\',\'{6}\',9);">region</a></div></div></div>';
    this.infobox = null;
    this.map = null;
    this.me = null;
    this.range = 5;
    this.rewardLocationHTML = '<a href="{0}" title="{1}" target="_blank" class="rewardLogoLink"></a>';
    this.routeLinkHTML = '<a href="./" class="routeLink button bigbtn" id="GetDirections" onclick="javascript:return routeLinkClick({0},{1},\'{2}\',{3},{4},\'{5}\');">Get Directions</a>';
    this.routeManager = null;
    this.routeStations = null;
    this.routeStationsCallsCurrent = null;
    this.routeStationsCallsTotal = null;
    this.trafficLayer = null;
    this.stationsURL = "https://spatial.virtualearth.net/REST/v1/data/{0}/{1}/{2}?spatialFilter=nearRoute('{3},{4}','{5},{6}')&$filter=Confidence Eq 'High' And (EntityType Eq 'Address' Or EntityType Eq 'RoadIntersection'){7}&$format=json&$inlinecount=allpages&$select=EntityID,Latitude,Longitude,AddressLine,AdminDistrict,CountryRegion,Locality,PostalCode,Name,Brand,Phone,KB,Diesel,CarWash,Snacks,ATM,TFH,CStore,TRS,UIMG,Vending,JambaGo,FastFlow,FreeAir&$top=250&key={8}";

}

function centerMapOnMe() {
    var bbox = new Array(4);
    bbox[0] = bmo.me.latitude;
    bbox[1] = bmo.me.longitude;
    bbox[2] = bmo.me.latitude;
    bbox[3] = bmo.me.longitude;
    setMapView(bbox);
    var pushpinMeOptions = {icon: "img/common/mylocation.png", width: 33, height: 42}; 
        //addPushpin(new Microsoft.Maps.Location(bbox[0], bbox[1]), pushpinMeOptions);
        var pushpin= new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(bbox[0], bbox[1]), pushpinMeOptions);
        bmo.map.entities.push(pushpin);
}

function findNearby(latIn, lonIn) {
    if (bmo.routeManager)
        bmo.routeManager.resetDirections();

    //var url = "http://spatial.virtualearth.net/REST/v1/data/{0}/{1}/{2}?spatialFilter=nearby({3},{4},{5})&$filter=Confidence Eq 'High' And (EntityType Eq 'Address' Or EntityType Eq 'RoadIntersection'){6}&$format=json&$inlinecount=allpages&$select=EntityID,Latitude,Longitude,AddressLine,AdminDistrict,CountryRegion,Locality,PostalCode,Name,Brand,Phone,KB,Diesel,CarWash,Snacks,ATM,TFH,CStore,TRS,UIMG,Vending,JambaGo,FastFlow,FreeAir,__Distance&key={7}";
    var url = "http://spatial.virtualearth.net/REST/v1/data/{0}/{1}/{2}?spatialFilter=nearby({3},{4},{5})&$filter=Confidence Eq 'High' And (EntityType Eq 'Address' Or EntityType Eq 'RoadIntersection'){6}&$format=json&$inlinecount=allpages&$select=*,__Distance&key={7}";

    var request = $.validator.format(url, "a1ed23772f5f4994a096eaa782d07cfb", "US_BrandedSites", "Sites", latIn, lonIn, convertMilesToKilometers(bmo.range), getExtraFilterString(), bmo.key);
    $.ajax({
        url: request,
        type: "get",
        dataType: "jsonp",
        jsonp: "jsonp",
        success: findNearbyBack,
        error: showError
    });

    return false;
}


function geocodeLocation(streetIn, successIn) {
    var street = streetIn == "" ? "-" : streetIn;
    // var city = cityIn == "" ? "-" : cityIn;
    // var state = stateIn == "" ? "-" : stateIn;
    // var zip = zipIn == "" ? "-" : zipIn;
    var url = "http://dev.virtualearth.net/REST/v1/Locations/{0}?key={1}";
    var request = $.validator.format(url, street, bmo.key);

    $.ajax({
        url: request,
        type: "get",
        dataType: "jsonp",
        jsonp: "jsonp",
        success: successIn,
        error: showError
    });

    return false;
}

function getMe() {
    return bmo.me;
}

function getRoute(rReqIn, showWaypointIcons) {
    if (!bmo.routeManager)
        bmo.routeManager = new Microsoft.Maps.Directions.DirectionsManager(bmo.map);
    else
        bmo.routeManager.resetDirections();

    if (!Microsoft.Maps.Events.hasHandler(bmo.routeManager, "directionsError"))
        Microsoft.Maps.Events.addHandler(bmo.routeManager, "directionsError", function(e) { showError(e.message); });

    bmo.routeManager.setRequestOptions({ maxRoutes: 1, routeDraggable: false });
    bmo.routeManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ address: rReqIn.sNam, location: new Microsoft.Maps.Location(rReqIn.sLoc.latitude, rReqIn.sLoc.longitude) }));
    bmo.routeManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ address: rReqIn.eNam, location: new Microsoft.Maps.Location(rReqIn.eLoc.latitude, rReqIn.eLoc.longitude) }));
    
    var waypointOptions = {
        draggable: false,
        visible: showWaypointIcons
    };
    
    bmo.routeManager.setRenderOptions({ displayTrafficAvoidanceOption: false, itineraryContainer: rReqIn.$element.get(0), waypointPushpinOptions: waypointOptions });

    if (!Microsoft.Maps.Events.hasHandler(bmo.routeManager, "directionsUpdated"))
        Microsoft.Maps.Events.addHandler(bmo.routeManager, "directionsUpdated", showRouteStations);

    bmo.routeManager.calculateDirections();
}

function hidePushpinInfobox(e) {
    e = $.event.fix(e);
    catchEvent(e);

    if (bmo.infobox)
        $(".infobox").data("tID", setTimeout(ibClose, 100));
}

function ibClose() {
    if (bmo.infobox) {
        bmo.map.entities.remove(bmo.infobox);
        bmo.infobox = null;
    }
}

function ibKeepOpen(e) {
    e = $.event.fix(e);
    catchEvent(e);

    if (bmo.infobox)
        clearTimeout($(".infobox").data("tID"));
}

function initMap(bingMapsKeyIn) {
    bmo = new BingMapsObj(bingMapsKeyIn);

    var mapOptions = {
        credentials: bmo.key,
        center: new Microsoft.Maps.Location(39, -96),
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 4,
        enableSearchLogo: false,
        enableClickableLogo: false,
    };

    bmo.map = new Microsoft.Maps.Map(document.getElementById("dvBingMap"), mapOptions);
    Microsoft.Maps.loadModule("Microsoft.Maps.Directions");
    Microsoft.Maps.loadModule("Microsoft.Maps.Traffic");
}

function pushpinClick(e) {
    e = $.event.fix(e);
    catchEvent(e);
    var point = new Microsoft.Maps.Point();
    point.x = e.pageX;
    point.y = e.pageY;
    var location = e.target.getLocation();
    zoomTo(location.latitude, location.longitude, 20);
}

function removePushPins(bKeepMe) {
    if (!bKeepMe)
        bKeepMe = false;
    
    for (var i = 0; i < bmo.map.entities.getLength(); i++) {
        var step = bmo.map.entities.get(i);

        //if (step._typeName && ((step._typeName == "bingpp") || ((step._typeName == "bingme") && !bKeepMe))) {
            bmo.map.entities.removeAt(i);
            i--;
        //}
    }
}

function resetMap() {
    if (bmo.map) {
        var mapOptions = {
            center: new Microsoft.Maps.Location(39, -96),
            mapTypeId: Microsoft.Maps.MapTypeId.road,
            zoom: 4
        };

        bmo.map.setView(mapOptions);

        if (bmo.map.entities.getLength() > 0)
            bmo.map.entities.clear();

        if (bmo.trafficLayer)
            bmo.trafficLayer.hide();

        if (bmo.routeManager)
            bmo.routeManager.resetDirections();
    }
}

function setMapView(bboxIn) {
    bboxIn[0] += .0035;
    bboxIn[1] -= .0035;
    bboxIn[2] -= .0035;
    bboxIn[3] += .0035;
    bmo.map.setView({ bounds: Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(bboxIn[0], bboxIn[1]), new Microsoft.Maps.Location(bboxIn[2], bboxIn[3])) });
}

function setMe(bLocIn) {
    bmo.me = bLocIn;
}

function showPushpinInfobox(e) {
    e = $.event.fix(e);
    catchEvent(e);

    if (bmo.infobox) {
        clearTimeout($(".infobox").data("tID"));
        bmo.map.entities.remove(bmo.infobox);
    }

    bmo.infobox = new Microsoft.Maps.Infobox();
    bmo.infobox.setLocation(e.target.getLocation());

    var ibOptions = {
        htmlContent: e.target.description,
        visible: true
    };

    bmo.infobox.setOptions(ibOptions);

    if (!Microsoft.Maps.Events.hasHandler(bmo.infobox, "mouseenter"))
        Microsoft.Maps.Events.addHandler(bmo.infobox, "mouseenter", ibKeepOpen);

    if (!Microsoft.Maps.Events.hasHandler(bmo.infobox, "mouseleave"))
        Microsoft.Maps.Events.addHandler(bmo.infobox, "mouseleave", hidePushpinInfobox);

    var left;

    switch (e.target._icon) {
        case "/images/station-finder/pin_U76.gif":
            left = "10px";
            break;
        case "images/station-finder/pin_CON.gif":
            left = "22px";
            break;
        case "images/station-finder/pin_P66.gif":
            left = "10px";
            break;
        default:
            left = "12px";
            break;
    }

    bmo.map.entities.push(bmo.infobox);
    $(".infobox").css("left", left);
    $(".infobox").parent().parent().css("z-index", 15);
}

function toggleStations(e) {
    var visible = false;

    if ($(this).is(":checked"))
        visible = true;

    for (var i = 0; i < bmo.map.entities.getLength(); i++) {
        var step = bmo.map.entities.get(i);

        if (step._typeName && (step._typeName == "bingpp"))
            step.setOptions({ visible: visible });
    }
}

function toggleTraffic(e) {
    if ($(this).is(":checked")) {

        if (!bmo.trafficLayer)
            bmo.trafficLayer = new Microsoft.Maps.Traffic.TrafficLayer(bmo.map);

        bmo.trafficLayer.getTileLayer().setOptions({ opacity: 0.4 });
        bmo.trafficLayer.show();
    }
    else
        bmo.trafficLayer.hide();
}

function zoomTo(latitudeIn, longitudeIn, zoomIn) {
    var mapOptions = {
        center: new Microsoft.Maps.Location(latitudeIn, longitudeIn),
        mapTypeId: Microsoft.Maps.MapTypeId.auto,
        zoom: zoomIn
    };

    bmo.map.setView(mapOptions);
}

function toggleKBStations(e) {
    for (var i = 0; i < bmo.map.entities.getLength() ; i++) {
        var step = bmo.map.entities.get(i);
        if (step._typeName && (step._typeName == "bingpp") && $(this).is(":checked")) {
            step.setOptions({ visible: step.isKB });
        }
        else {
            step.setOptions({ visible: true });
        }
    }
}