// A $( document ).ready() block.
var myLat = 0;
var myLong = 0;
$(document).ready(function () {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPositionLatLong);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
    function getPositionLatLong(map) {
        var coords = map;
        myLat = map.coords.latitude;
        myLong = map.coords.longitude;
        findNearStation(map.coords.latitude, map.coords.longitude);
        //myLat = 33.7683; myLong = -118.1956;
        //findNearStation(33.7683,-118.1956);
        $("#showPopNearStation").click(function(e){
            e.preventDefault();
            $('.modal-bg').fadeIn( "fast",function(){
                $( "#nearest-station" ).slideDown();
            });
        });
        $('.closeModal').click(function(e){
            e.preventDefault();
            $( "#nearest-station" ).slideUp(function(){
                $('.modal-bg').fadeOut("fast");
            });
        });
    }

});// end document ready

function findNearStation(latIn, lonIn) {
    var bkey = $("#BingMapsKey").val();
    var url = "http://spatial.virtualearth.net/REST/v1/data/{0}/{1}/{2}?spatialFilter=nearby({3},{4},{5})&$filter=Confidence Eq 'High' And (EntityType Eq 'Address' Or EntityType Eq 'RoadIntersection'){6}&$format=json&$inlinecount=allpages&$select=EntityID,Latitude,Longitude,AddressLine,AdminDistrict,CountryRegion,Locality,PostalCode,Name,Brand,Phone,KB,Diesel,CarWash,Snacks,ATM,TFH,CStore,TRS,UIMG,Vending,JambaGo,FastFlow,FreeAir,__Distance&key={7}";
    var request = $.validator.format(url, "a1ed23772f5f4994a096eaa782d07cfb", "US_BrandedSites", "Sites", latIn, lonIn, '8.04672', '', bkey);
    $.ajax({
        url: request,
        type: "get",
        dataType: "jsonp",
        jsonp: "jsonp",
        success: findNearStationBack,
        //error: showError
    });

    return false;
}

function findNearStationBack(result) {
    var results = result.d;
    var nlimit = results.__count > 25 ? 25 : results.__count;
    var nearDistance = 5;
    var stationId = 0;
    var nstep = 0;
    for (var i = 0; i < nlimit; i++) {
        var step = results.results[i];
        if (step !== undefined && step != null) {
            if (nearDistance > step.__Distance) {
                nearDistance = step.__Distance;
                stationId = step.EntityID;
                nstep=i
            }
           
        }
    }
    var lat2 = results.results[nstep].Latitude;
    var long2 = results.results[nstep].Longitude;
    var distance = parseFloat(convertKilometersToMiles(getDistanceFromLatLonInKm(myLat, myLong, lat2, long2))).toFixed(1);
    $('#distanceMiles').html(distance + '<span>Miles<br/>Away</span>');
    if(typeof showResultinDiv==="undefined"){
        showResultinDiv=0;
    }
    if(showResultinDiv){
        var bLoc = new Microsoft.Maps.Location(myLat, myLong);
        setMe(bLoc);
        clearResults(true);
        findNearbyBack(result);
        var positionA=myLat+","+myLong;
        geocodeLocation(positionA,getAdress);
    }
    popStation(result,nstep);
}
var map=null;
function popStation(result,stationPos){
    var bmapkey=$("#BingMapsKey").val();
    var mapOptions = {
        credentials: bmapkey,
        center: new Microsoft.Maps.Location(39, -96),
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 15,
        enableSearchLogo: false,
        enableClickableLogo: false,
    };

    map = new Microsoft.Maps.Map(document.getElementById("station-map"), mapOptions);
    Microsoft.Maps.loadModule("Microsoft.Maps.Directions");
    Microsoft.Maps.loadModule("Microsoft.Maps.Traffic");

    //map functions
    var results = result.d;
    var step= results.results[stationPos];
    map.entities.clear(); 
    var pushpinOptions = {icon: "img/common/selected_pin.png", width: 39, height: 52}; 
    var pushpin= new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(step.Latitude, step.Longitude), pushpinOptions);
    map.entities.push(pushpin);
    map.setView({ zoom: 16, center: new Microsoft.Maps.Location(step.Latitude, step.Longitude) });

    //station data
    $('#nearest-station .distance-info h2').text(parseFloat(convertKilometersToMiles(step.__Distance)).toFixed(1) + " miles away");
    $('#nearest-station .station-name').text(step.Name);
    $('#nearest-station .station-description .address').html(step.AddressLine+", "+step.Locality+", "+step.AdminDistrict+", "+step.PostalCode);
    $('#nearest-station .station-description .phone').text(getPhoneNumberFormattedUS(step.Phone));
    var amenities = [{ key: "kickback", value: step.KB }, { key: "diesel", value: step.Diesel }, { key: "carwash", value: step.CarWash },
                    { key: "atm", value: step.ATM }, { key: "cstore", value: step.CStore }, { key: "tfh", value: step.TFH },
                    { key: "trs", value: step.TRS }, { key: "freeair", value: step.FreeAir },
                    { key: "jambago", value: step.JambaGo }, { key: "vending", value: step.Vending }, { key: "fastflow", value: step.FastFlow }, 
                    { key: "uimg", value: step.UIMG }];
    for (var i = 0; i < amenities.length; i++) {
        if (amenities[i].value) {
            if (amenities[i].key == "kickback") {
                $("#nearest-station .station-amenities .station-type").append('<li><span class="icon-icon_kickback icon"></span>Kickback</li>');
            }
            if (amenities[i].key == "diesel") {
                $("#nearest-station .station-amenities .station-type").append('<li><span class="icon-icon_diesel icon"></span>Diesel</li>');
            }
            if (amenities[i].key == "carwash") {
                $("#nearest-station .station-amenities .station-type").append('<li><span class="icon-icon_carwash icon"></span>Carwash</li>');
            }
            if (amenities[i].key == "atm") {
                $("#nearest-station .station-amenities .station-type").append('<li><span class="icon-icon_atm icon"></span>ATM</li>');
            }
            if (amenities[i].key == "cstore") {
                $("#nearest-station .station-amenities .station-type").append('<li><span class="icon-icon_conv_store icon"></span>C Store</li>');
                }
            if (amenities[i].key == "tfh") {
                $("#nearest-station .station-amenities .station-type").append('<li><span class="icon-icon_24hrs icon"></span>24 hrs.</li>');
            }
        }
    }
}