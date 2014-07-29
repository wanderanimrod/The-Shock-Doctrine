var width = "100%",
    height = 800;

svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "background-color: #0E0E0E");


projection = d3.geo.equirectangular()
    .center([0.0, 0.0])
    .scale(200)
    .translate([700, height / 2]);

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

d3.json("events.json", function(json) {
    run(wrapEvents(json.events));
});

var intervalId;

function run(events) {
    intervalId = setInterval(function() {
        var event = events.next();
        if(event === terminationEvent) {
            stopPlotting();
        }
        else {
            plot(event);
        }
    }, 1000);
}

function stopPlotting() {
    clearInterval(intervalId);
}

function plot(event) {
    var center = projection([event.coordinates.lon, event.coordinates.lat]);
    svg.append("circle")
        .attr("cx", center[0])
        .attr("cy", center[1])
        .attr("r", 8)
        .attr("fill", "#C4C4C4")
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 0.8);
}

var terminationEvent = {type: "END"};
var nextEventIndex = -1;

function wrapEvents(events) {
    events.next = function() {
        if(nextEventIndex < events.length - 1) {
            nextEventIndex += 1;
            return events[nextEventIndex];
        }
        else {
            return terminationEvent;
        }
    };
    return events;
}


