function catchEvent(e) {
    //e.preventDefault();
    e.stopPropagation();
}

function calculateDistanceFromGeo(sLatIn, sLonIn, eLatIn, eLonIn) {
    var dLat = convertDegreesToRadians(eLatIn - sLatIn);
    var dLon = convertDegreesToRadians(eLonIn - sLonIn);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(convertDegreesToRadians(sLatIn)) * Math.cos(convertDegreesToRadians(eLatIn)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var test = convertKilometersToMiles(6371 * c);
    return convertKilometersToMiles(6371 * c);
}

function convertDegreesToRadians(dIn) {
    return dIn * Math.PI / 180;
}

function convertKilometersToMiles(kmIn) {
    return kmIn * 0.621371192;
}

function convertMilesToKilometers(mIn) {
    return mIn * 1.609344;
}

function getPhoneNumberDigitsUS(phoneIn) {
    phone = phoneIn.replace(/[\D]/g, '');

    if (/^[\d]{10}$/.test(phone))
        return '+1' + phone;
    else
        return phone;
}

function getPhoneNumberFormattedUS(phoneIn) {
    phone = phoneIn.replace(/[\D]/g, '');

    if (/^[\d]{10}$/.test(phone))
        return '1 (' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + '-' + phone.substring(6, 10);
    else
        return phone;
}

function getQueryStringByKey(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function isValidZip(zipIn) {
    return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipIn);
}

function OpenInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
    return false;
}
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}