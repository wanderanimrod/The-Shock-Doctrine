var height = 1000;

svg = d3.select("#map")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height);


projection = d3.geo.equirectangular()
    .center([-25.0, 0.0])
    .scale(190)
    .translate([350, height / 2]);

color = d3.scale.quantize().range(["rgb(237,248,233)", "rgb(186,228,179)",
    "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"
]);

path = d3.geo.path().projection(projection);

d3.json("world.json", function(json) {

    svg.selectAll("path.feature")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#838383")
        .attr("stroke", "#0E0E0E")
        .attr("stroke-width", "0.1px")
});

d3.json("presentation.json", function(data) {

    themeDiv = d3.select("#theme");
    captionDiv = d3.select("#caption");

    setupHomeSlide(data);

    runSlides(wrapSlides(data.slides), data.slideDuration)
});

d3.json("events.json", function(json) {
    runEvents(wrapEvents(json.events));
});

var slidesIntervalId;
function runSlides(slides, slideDuration) {
    slidesIntervalId = setInterval(function() {
        if(slides.hasNext()) {
            var slide = slides.next();
            setTheme(slide.theme);
            setCaption(slide.caption);
        }
        else stopPresentation();
    }, slideDuration * 1000);
}


function stopPresentation() {
    clearInterval(slidesIntervalId);
}
var eventsIntervalId;

function runEvents(events) {
    eventsIntervalId = setInterval(function() {
        if(events.hasNext()) {
            clearInterval(breatheIntervalId);
            plot(events.next());
        }
        else stopPlotting();
    }, 3000);
}

var themeDiv, captionDiv;

function setupHomeSlide(content) {
    setTheme(content.title);
    setCaption(content.subTitle);
}

function setTheme(value) {
    //Set theme div text to value
//    console.log("Setting theme to ", value);
}

function setCaption(value) {
    //Set caption div text to value
//    console.log("Setting caption to ", value);
}

function stopPlotting() {
    clearInterval(breatheIntervalId);
    clearInterval(eventsIntervalId);
}

function plot(event) {
    var center = projection([event.coordinates.lon, event.coordinates.lat]);
    var circle = svg.append("circle")
        .attr("cx", center[0])
        .attr("cy", center[1])
        .attr("r", 6.5)
        .attr("fill", "#C4C4C4")
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 0.8);
    breathe(circle);
}

var breatheIntervalId;
function breathe(circle) {
    breatheIntervalId = setInterval(function() {
        circle.transition()
            .ease("linear")
            .duration(500)
            .style("stroke-width", 1.6)
            .style("stroke", "red")
            .attr("r", 14)
            .transition()
            .ease("linear")
            .duration(500)
            .style("stroke-width", 0.8)
            .style("stroke", "white")
            .attr("r", 5)
    }, 1000);

}

var nextEventIndex = -1;
function wrapEvents(events) {
    return wrap(events, nextEventIndex);
}

var nextSlideIndex = -1;
function wrapSlides(slides) {
    return wrap(slides, nextSlideIndex);
}

function wrap(objects, trackingIndex) {
    objects.next = function() {
        trackingIndex += 1;
        return objects[trackingIndex];
    };

    objects.hasNext = function() {
        return trackingIndex < objects.length - 1;
    };

    return objects;
}



