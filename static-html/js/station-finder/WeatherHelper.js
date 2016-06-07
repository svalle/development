var wo;

function getWeather(zipIn, elmIn) {
    wo = new WeatherObject();
    wo.element = elmIn;
    wo.zip = zipIn;
    var request = $.validator.format(wo.queryURL, encodeURIComponent($.validator.format(wo.query, zipIn)));

    $.ajax({
        url: request,
        dataType: "jsonp",
        jsonpCallback: "weatherFound"
    });
}

function weatherFound(result) {
    result = result.query.results.channel;
    wo.weather = result.item.description.replace(/<br \/>/i,"");
    wo.weatherTitle = result.title;
    wo.element.html("<h3>" + wo.weatherTitle + "</h3>" + wo.weather);
    wo.element.slideDown();
    wo.element.click(function(e) { catchEvent($.event.fix(e)); });
    wo.element.find("a").click(function(e) { catchEvent($.event.fix(e)); window.location = $(e.target).attr("href"); });
    hideLoading();
}

function WeatherObject() {
    this.element = null;
    this.query = "select * from weather.forecast where location={0}";
    this.queryURL = "http://query.yahooapis.com/v1/public/yql?format=json&q={0}";
    this.weather = null;
    this.weatherTitle = null;
    this.woeid = null;
    this.zip = null;
}