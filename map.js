var width = 1500,
    height = 800;

svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

projection = d3.geo.mercator()
    .center([0.0, 0.0])
    .scale(200)
    .translate([width / 2, height / 2]);

color = d3.scale.quantize().range(["rgb(237,248,233)", "rgb(186,228,179)",
    "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"
]);

path = d3.geo.path().projection(projection);

d3.json("world.json", function(json) {

    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "rgb(50,50,192)")
        .attr("stroke-width", "0.9px")
});

d3.json("events.json", function(json) {
    run(wrapEvents(json.events));
});

function run(events) {
    setInterval(function() {
        var event = events.next();
        if(event === terminationEvent) {
            clearInterval(this.id);
        }
        else {
            console.log("Plotting event", event);
            plot(event);
        }
    }, 1000)
}

function plot(event) {
    var center = projection([event.coordinates.lon, event.coordinates.lat]);
    svg.append("circle")
        .attr("cx", center[0])
        .attr("cy", center[1])
        .attr("r", 5)
        .attr("fill", "red");
}

var terminationEvent = {type: "END"};
var nextEventIndex = -1;

function wrapEvents(events) {
    events.next = function() {
        if(nextEventIndex < events.length) {
            nextEventIndex += 1;
            return events[nextEventIndex];
        }
        else {
            return terminationEvent;
        }
    };
    return events;
}


