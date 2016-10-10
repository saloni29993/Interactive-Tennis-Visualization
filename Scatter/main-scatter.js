
var data = [];

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};


//define row information
function row(d) {
  return {
    year: +d.year, // convert "Year" column to number
    aces: +d.aces,
    player: d.player,
    fastserve: +d.fastserve
  };
}

//load csv file
d3.csv("data.csv", row, function(error, csv_data){
    csv_data.forEach(function (d) {
        data.push({ year: d.year, aces: d.aces, player: d.player, fastserve: d.fastserve });
    });

    var scale_fastserve = d3.scale.linear()
                    .domain([230, 200])
                    .range([0, 700]);

    var scale_year = d3.scale.linear()
                    .domain([2003, 2013])
                    .range([0, 1000]);

    var data_svg = d3.select("body")
                    .append("svg")
                    .attr("width", 1500)
                    .attr("height", 1000)
                    .attr("transform","translate(200,100)");

    //Showing the X-axis showing winner_ace and Y-axis showing year                
    var xAxis = d3.svg.axis().scale(scale_year).innerTickSize(7).outerTickSize(3).orient("bottom");
    var yAxis = d3.svg.axis().scale(scale_fastserve).orient("left").outerTickSize(3);    

    data_svg.append("svg:g").call(xAxis).attr("transform", "translate(30,750)");
    data_svg.append("svg:g").call(yAxis).attr("transform", "translate(30,50)");     

    var colorScale = d3.scale.category10(); 

    var radiusScale = d3.scale.linear().domain([0, 20]).range([15, 50]);

    function color(d) {
        return d.player;
    }

    function radius(d) {
        return d.aces;
    }

    // Defines a sort order so that the smallest dots are drawn on top.
    function order(a, b) {
        return radius(b) - radius(a);
    }

    var data_g = data_svg.selectAll("circle")
        .data(data)
        .enter()
        .append("g");
        // .filter(function(d) { return d.gender =="w"; });

    var data_circles = data_g.append("circle")
        .attr("cx", function(d) {
            return scale_year(d.year);
        })
        .attr("opacity", 0.4)
        .attr("cy", function(d) {
            return scale_fastserve(d.fastserve);
        })
        .attr("r", function(d) {
              //console.log(radius(d));
            return radiusScale(radius(d));
        })
        // .attr("fill", "#ff0000")
        .style("fill", function (d) {
            return colorScale(color(d));
        })
        .attr('class',function(d){
            return d.player.replace(' ','_');
        })
        .on("mouseover", function(d) {
            // var sel = d3.select(this);
            // sel.moveToFront();
          d3.selectAll("." +d.player.replace(' ','_')).moveToFront().style("opacity", 1).style("z-index",-100);
        })
        .on("mouseout", function(d) {
          d3.selectAll("." +d.player.replace(' ','_')).style("opacity", 0.4 ).style("z-index",0);
        })
        .sort(order);



    // var data_text = data_g.append("text")
    //     .text(function(d){return d.winner;})
    //     .attr("x", function(d) {
    //         return 5 + scale_year(d.year);
    //     })
    //     .attr("y", function(d) {
    //         return 5 + scale_ace(d.winner_ace);
    //     });

 
});



