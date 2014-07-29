var width = "100%",
    height = 1000;

svg = d3.select("#map")
    .attr("style", "background-color: #0E0E0E; padding-left: 20px")
    .attr("width", width)
    .append("svg")
    .attr("width", "68%")
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

//d3.json("events.json", function(json) {
//    run(wrapEvents(json.events));
//});

var eventsIntervalId;

function run(events) {
    eventsIntervalId = setInterval(function() {
        var event = events.next();
        if(event === terminationEvent) {
            stopPlotting();
        }
        else {
            clearInterval(breatheIntervalId);
            plot(event);
        }
    }, 3000);
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


