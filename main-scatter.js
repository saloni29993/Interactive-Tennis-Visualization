var data = [];

var width = 2500;
var height = 1250;

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};


//define row information
function row(d) {
  return {
    year: +d.year,
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

    // Define the div for the tooltip
    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var scale_fastserve = d3.scale.linear()
                    .domain([240, 190])
                    .range([0, 1100]);
                                

    var scale_aces = d3.scale.linear()
                    .domain([0, 22])
                    .range([0, 1600]);                

    var data_svg = d3.select(".chart")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("transform","translate(600,5)");

 
    //Showing the X-axis showing aces and Y-axis showing fast serve speed                
    var xAxis = d3.svg.axis().scale(scale_aces).outerTickSize(3).orient("bottom").tickFormat(d3.format("d"));
    var yAxis = d3.svg.axis().scale(scale_fastserve).orient("left").outerTickSize(3);

    data_svg.append("svg:g")
            .call(xAxis)
            .attr("transform", "translate(30,1150)")
            .style("font-size","25px")
            .style("font-family", "Arial");

    data_svg.append("svg:g")
            .call(yAxis)
            .attr("transform", "translate(30,50)")
            .style("font-size","25px")
            .style("font-family", "Arial");

    data_svg.append("text")      // text label for the x axis
            .attr("transform", "translate(1560,1130)")
            .style("text-anchor", "middle")
            .text("Ace Score")
            .style("font-size","30px")
            .style("font-family", "Arial");

    data_svg.append("text")     //text label for y axis   
            .attr("transform", "rotate(-90)")
            .attr("dx", "-7em")
            .attr("dy", "2em")
            .text("Fast Serve Speed (KPH)")
            .style("text-anchor", "middle")
            .style("font-size","30px")
            .style("font-family", "Arial");                                           

    //var colorScale = d3.scale.category10(); 

    var colorScale = d3.scale.ordinal()
                              .domain(["Andy Roddick", "Andy Murray", "Roger Fedrer", 
                                        "Rafal Nadal", "Novak Djokovic", "James Blake", 
                                        "David N", "Fernando V", "Mardy Fish", "John Isner"])
                              .range(["#FF0000", "#009933" , "#00BFFF", "#FF6600", "#FF00FF", "#6600FF", 
                                    "#000000", "#3366FF", "#FFFF00", "#330066"]);

    var radiusScale = d3.scale.linear().domain([0, 20]).range([15, 50]);

    function color(d) {
        return d.player;
    }

    function radius(d) {
        return 0.2;
    }
    

    // Defines a sort order so that the smallest dots are drawn on top.
    function order(a, b) {
        return radius(b) - radius(a);
    }

    var data_g = data_svg.selectAll("circle")
        .data(data)
        .enter()
        .append("g");

    var hover_text = data_svg.append("text")      // Onhover diplaying player's name
                            .attr("transform", "translate(400,135)")
                            .attr("width", "200px")
                            .attr("height", "100px")
                            .style("text-anchor", "end"); 

    // adding linear line
    data_g.append("line")
        .attr("x1", scale_aces(2))
        .attr("y1", scale_fastserve(193.5))
        .attr("x2", scale_aces(21))
        .attr("y2", scale_fastserve(226))
        .attr("stroke-width", 15)
        .attr("stroke", "#f0f0f0")
        .style("z-index",-100);                           

    var data_circles = data_g.append("circle")
        .attr("cx", function(d) {
            return 30 + scale_aces(d.aces);
        })
        .attr("opacity", 0.4)
        .attr("cy", function(d) {
            return scale_fastserve(d.fastserve) + 40;
        })
        .attr("r", function(d) {
            return radiusScale(radius(d));
        })
        .style("fill", function (d) {
            return colorScale(color(d));
        })
        .attr('class',function(d){
            return d.player.replace(' ','_');
        })
        .on("mouseover", function(d) {
            d3.selectAll("." +d.player.replace(' ','_'))
                .moveToFront()
                .style("opacity", 1); 

            d3.selectAll("circle:not(." +d.player.replace(' ','_') +")")
                .moveToFront()
                .style("opacity", 0.2); 

            div.transition()        
                .duration(200)      
                .style("opacity", 0.9); 

            div .html("Fast Serve Speed: " + d.fastserve + "<br/> Ace Score: "  + d.aces) 
                .style("left", (d3.event.pageX - 35) + "px")     
                .style("top", (d3.event.pageY + 28) + "px");

            hover_text.text(d.player)
                .style("text-anchor", "middle")
                .style("font-size","100px")
                .style("font-family", "Arial")
                .style("opacity", 0.2);              
        })
        .on("mouseout", function(d) {
            d3.selectAll("circle")
                .style("opacity", 0.4)
                .style("z-index",0);

            div.transition()        
                .duration(500)      
                .style("opacity", 0);

            hover_text.text("");            
        })
        .sort(order);                                                
 
});



