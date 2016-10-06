var SPX = [{
    "name": "Andy Murray",
        "status": "Winner",
        "FastServeSpeed": [
        [2003, 0],
        [2004, 0],
        [2005, 212],
        [2006, 208],
        [2007, 216],
        [2008, 210],
        [2009, 216],
        [2010, 215],
        [2011, 210],
        [2012, 213],
        [2013, 214]
    ],
        "TotalPoints": [
        [2003, 0],
        [2004, 0],
        [2005, 149],
        [2006, 130],
        [2007, 175],
        [2008, 92],
        [2009, 113],
        [2010, 94],
        [2011, 95],
        [2012, 105],
        [2013, 129]
    ],
        "AverageServeSpeed": [
        [2003, 10],
        [2004, 10],
        [2005, 163],
        [2006, 162],
        [2007, 167],
        [2008, 160],
        [2009, 170],
        [2010, 165],
        [2011, 165],
        [2012, 165],
        [2013, 163]
    ]
}, {
    "name": "Novak Djokovic",
        "status": "Winner",
        "FastServeSpeed": [
        [2003, 0],
        [2004, 0],
        [2005, 207],
        [2006, 213],
        [2007, 208],
        [2008, 204],
        [2009, 205],
        [2010, 202],
        [2011, 203],
        [2012, 208],
        [2013, 200]
    ],
        "TotalPoints": [
        [2003, 0],
        [2004, 0],
        [2005, 151],
        [2006, 144],
        [2007, 104],
        [2008, 96],
        [2009, 90],
        [2010, 159],
        [2011, 0],
        [2012, 79],
        [2013, 165]
    ],
        "AverageServeSpeed": [
        [2003, 0],
        [2004, 0],
        [2005, 164],
        [2006, 169],
        [2007, 170],
        [2008, 171],
        [2009, 168],
        [2010, 165],
        [2011, 161],
        [2012, 167],
        [2013, 162]
    ]
}, {
    "name": "Andy Roddick",
        "status": "Winner",
        "FastServeSpeed": [
        [2003, 225],
        [2004, 234],
        [2005, 175],
        [2006, 229],
        [2007, 229],
        [2008, 229],
        [2009, 228],
        [2010, 223],
        [2011, 219],
        [2012, 222],
        [2013, 222]
    ],
        "TotalPoints": [
        [2003, 109],
        [2004, 96],
        [2005, 0],
        [2006, 55],
        [2007, 83],
        [2008, 90],
        [2009, 93],
        [2010, 159],
        [2011, 0],
        [2012, 89],
        [2013, 0]
    ],
        "AverageServeSpeed": [
        [2003, 170],
        [2004, 177],
        [2005, 175],
        [2006, 174],
        [2007, 174],
        [2008, 174],
        [2009, 169],
        [2010, 165],
        [2011, 171],
        [2012, 172],
        [2013, 172]
    ]
}];

function x(d) {
    return d.FastServeSpeed;
}

function y(d) {
    return d.AverageServeSpeed;
}

function radius(d) {
    return d.TotalPoints;
}

function color(d) {
    return d.name;
}

function key(d) {
    return d.name;
}

var currentPlayer = "";

// Chart dimensions.
var margin = {
    top: 19.5,
    right: 19.5,
    bottom: 39.5,
    left: 50.5
},
width = 960 - margin.right,
    height = 500 - margin.top - margin.bottom,
    yearMargin = 10;

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scale.linear().domain([170, 240]).range([0, width - yearMargin]),
    yScale = d3.scale.linear().domain([150, 180]).range([height, 0]),
    radiusScale = d3.scale.linear().domain([90, 175]).range([10, 50]),
    colorScale = d3.scale.category20();

// The x & y axes.
// formatter = d3.format(".0%");
var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(10, d3.format(",d")),
    yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10, d3.format(",d"));

// Create the SVG container and set the origin.
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the x-axis.
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the y-axis.
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Add an x-axis label.
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Fast Serve Speed (KPH)");

// Add a y-axis label.
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Average of First Serve and Second Serve Speed (KPH)");

// Add the year label; the value is set on transition.
var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height - 24)
    .attr("x", width)
    .text(2003);

var playertxt = svg.append("text")
    .attr("class", "playertxt")
    .attr("y", height - margin.bottom)
    .attr("x", margin.left)
    .text("");

// Load the data.
drawSPX(SPX);

function drawSPX(player) {

    var currentPlayers = "";

    // A bisector since many player's data is sparsely-defined.
    var bisect = d3.bisector(function (d) {
        return d[0];
    });

    // Add a dot per player. Initialize the data at 2003, and set the colors.
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    tooltip.text("my tooltip text");



    var dots = svg.append("g")
        .attr("class", "dots");

    var dot = dots.selectAll(".dot")
        .data(interpolateData(2003))
        .enter().append("circle")
        .attr("class", "dot")
        .style("fill", function (d) {
        return colorScale(color(d));
    })
    .on("mouseover", function (d) {tooltip.html("<strong>Name:</strong> " + d.name + "<br><strong>Player Status:</strong> " + d.status + "<br><strong>Total Points:</strong> " + d.TotalPoints);
        tooltip.attr('class', 'd3-tip');
        return tooltip.style("visibility", "visible");
    })
        .on("mousemove", function (d) {tooltip.html("<strong>Name:</strong> " + d.name + "<br><strong>Player Status:</strong> " + d.status + "<br><strong>TotalPoints:</strong> " + d.TotalPoints);
        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
    })
        .on("mouseout", function (d) {return tooltip.style("visibility", "hidden");
    })
        .call(position)
        .sort(order);

    // Add a title.
    dot.append("text")
        .text(function (d) {
        return d.name;
    });

    // Add an overlay for the year label.
    var box = label.node().getBBox();

    var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", 530)
        .attr("y", 250)
        .attr("width", 400)
        .attr("height", 200)
        .attr("fill", "white")
        .attr("fill-opacity", 0.0 )
        .on("mouseover", enableInteraction);

    // Start a transition that interpolates the data based on year.
    svg.transition()
        .duration(40000)
        .ease("linear")
        .tween("year", tweenYear)
        .each("end", enableInteraction);

    // Positions the dots based on data.
    function position(dot) {
        dot.attr("cx", function (d) {
            return xScale(x(d));
        })
            .attr("cy", function (d) {
            return yScale(y(d));
        })
            .attr("r", function (d) {
            return radiusScale(radius(d));
        });
    }

    // Defines a sort order so that the smallest dots are drawn on top.
    function order(a, b) {
        return radius(b) - radius(a);
    }

    // After the transition finishes, you can mouseover to change the year.
    function enableInteraction() {
        var yearScale = d3.scale.linear()
            .domain([2003, 2013])
            .range([box.x + 10, box.x + box.width - 10])
            .clamp(true);


        // Cancel the current transition, if any.
        svg.transition().duration(0);

        overlay.on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .on("touchmove", mousemove);

        function mouseover() {
            label.classed("active", true);
        }

        function mouseout() {
            label.classed("active", false);
        }

        function mousemove() {
            displayYear(yearScale.invert(d3.mouse(this)[0]));
        }
    }

    // Tweens the entire chart by first tweening the year, and then the data.
    // For the interpolated data, the dots and label are redrawn.
    function tweenYear() {
        var year = d3.interpolateNumber(2003, 2013);
        return function (t) {
            displayYear(year(t));
        };
    }

    // Updates the display to show the specified year.
    function displayYear(year) {
        dot.data(interpolateData(year), key).call(position).sort(order);
        label.text(Math.round(year));
    }

    // Interpolates the dataset for the given (fractional) year.
    function interpolateData(year) {
        return player.map(function (d) {
            return {
                name: d.name,
                status: d.status,
                FastServeSpeed: interpolateValues(d.FastServeSpeed, year),
                TotalPoints: interpolateValues(d.TotalPoints, year),
                AverageServeSpeed: interpolateValues(d.AverageServeSpeed, year)
            };
        });
    }

    // Finds (and possibly interpolates) the value for the specified year.
    function interpolateValues(values, year) {
        var i = bisect.left(values, year, 0, values.length - 1),
            a = values[i];
        if (i > 0) {
            var b = values[i - 1],
                t = (year - a[0]) / (b[0] - a[0]);
            return a[1] * (1 - t) + b[1] * t;
        }
        return a[1];
    }
}