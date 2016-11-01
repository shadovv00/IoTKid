// (function() {
// d3.legend = 
function d3_legend(g) {
  g.each(function() {
    var g= d3.select(this),
        items = {},
        svg = d3.select(g.property("nearestViewportElement")),
        legendPadding = g.attr("data-style-padding") || 5,
        lb = g.selectAll(".legend-box").data([true]),
        li = g.selectAll(".legend-items").data([true])

    lb.enter().append("rect").classed("legend-box",true)
    li.enter().append("g").classed("legend-items",true)

    svg.selectAll("[data-legend]").each(function() {
        var self = d3.select(this)
        items[self.attr("data-legend")] = {
          pos : self.attr("data-legend-pos") || this.getBBox().y,
          color : self.attr("data-legend-color") != undefined ? 
            self.attr("data-legend-color") : 
            self.style("fill") != 'none' ? self.style("fill") : self.style("stroke"),
          icon: "line"
        }
      })

    items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})

    
    li.selectAll("text")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("text")})
        .call(function(d) { d.exit().remove()})
        .attr("y",function(d,i) { return i+"em"})
        .attr("x","1em")
        .text(function(d) { ;return d.key})
    
    li.selectAll("circle")
        .data(items.filter(function(item, index) { 
                // save original index
                item.value.index = index;
                return item.value.icon == 'circle'
            }), 
            function(d) { return d.key})
        .call(function(d) { d.enter().append("circle")})
        .call(function(d) { d.exit().remove()})
        .attr("cy",function(d) { return (d.value.index-0.25)+"em"})
        .attr("cx",0)
        .attr("r","0.4em")
        .style("fill",function(d) { return d.value.color})

    li.selectAll("line")
        .data(items.filter(function(item, index) { 
                // save original index
                item.value.index = index;
                return item.value.icon == 'line'
            }),
            function(d) { return d.key})
        .call(function(d) { d.enter().append("line")})
        .call(function(d) { d.exit().remove()})
        .attr("x1", "-0.4em")
        .attr("x2", "0.4em")
        .attr("y1", function(d) { return (d.value.index-0.4)+"em"})
        .attr("y2", function(d) { return (d.value.index-0.4)+"em"})
        .attr("stroke-width", 2)
        .attr("stroke", function(d) { return d.value.color})
        
    // Reposition and resize the box
    var lbbox = li[0][0].getBBox()  
    lb.attr("x",(lbbox.x-legendPadding))
        .attr("y",(lbbox.y-legendPadding))
        .attr("height",(lbbox.height+2*legendPadding))
        .attr("width",(lbbox.width+2*legendPadding))
  })
  return g
}
// })()

function createChart(container,receivedData){
	// console.log(receivedData);
	// Масив даних
	var data = [];
	var iii;
		for (iii = 0; iii < receivedData.length; iii++) {
			data.push({date: receivedData[iii].CREATION_TS, close: receivedData[iii].TEMP});
		}	
	// var parseDate = d3.time.format("%H:%M").parse;
	data.forEach(function (d) {
	    // d.date = parseDate(d.date);
	    d.date = new Date(+d.date.substring(6, 19));
	    d.close = +d.close;
	});
	
	
	var margin = {
	    top: 30,
	    right: 150,
	    bottom: 50,
	    left: 50
	};
	var parentWidth =$(container).parent().width();
	// var width = $(container).width() - margin.left - margin.right;
	var width = parentWidth*0.98 - margin.left - margin.right;
	var height =  $(container).height() - margin.top - margin.bottom;

					// $("#overviewpage--chartContainer").html('');
	//змініть тут на значення топ і нижньої меж
	var bottomY = "4";
	var topY = "10";
	
	//30 - це відступ справа і зліва лінії від початку графіка 
	var x = d3.time.scale().range([30, width-30]);
	var y = d3.scale.linear().range([height, 0]);
	
	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").outerTickSize(0);
	
	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").innerTickSize(-width)
	    .outerTickSize(0)
	    .ticks(4);
	
	var valueline = d3.svg.line()
	    .x(function (d) {
	      return x(d.date);
	    })
	    .y(function (d) {
	      return y(d.close);
	    });
					// $("#overviewpage--chartContainer").html('');
	var classN = $(container).attr('id');
	var svg = d3.select("#"+classN)
	    .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom+15)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	

	
	console.log(data);
	
	// Scale the range of the data
	x.domain(d3.extent(data, function (d) {
	    return d.date;
	    }));
	y.domain([0, d3.max(data, function (d) {
	//30 потрібно вже вам змінювати на значення взалежності від якого буде верхня межа графа
	    // return d.close+30;
	    return 30;
	    })]);
	    
	
	   
		svg.append("path")
		.attr("d", valueline([{date:data[0].date, close:bottomY}, {date:data[data.length-1].date,close:bottomY}])).attr('class','bottom-line').attr("data-legend","Min"); 
		
		svg.append("path").attr("class", "line") 
		.attr("d", valueline([{date:data[0].date, close:topY}, {date:data[data.length-1].date,close:topY}])).attr('class','top-line').attr("data-legend", "Max");  
		
		svg.append("path").attr("class", "line") // Add the valueline path.
		.attr("d", valueline(data)).attr("data-legend", "Temperatuur");

	svg.append("g") // Add the X Axis
	.attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);
	
	svg.append("g") // Add the Y Axis
	.attr("class", "y axis")
	    .call(yAxis);
	    
	svg.append("text")      // text label for the x axis
	        .attr("x", width / 2 )
	        .attr("y",  height+margin.bottom)
	        .style("text-anchor", "middle")
	        .text("Tijd");
	        
	svg.append("text")      // text label for the x axis
	         .attr("transform", "rotate(-90)")
	         .attr("x", -(height/2) )
	         .attr("y",  -(margin.left-20))
	         .style("text-anchor", "middle")
	         .text("Temperatuur & Max & Min");
	          
	svg.selectAll("dot").data(data)
	  .enter().append("circle")
	  .attr("cx", function(d) { return x(d.date); })
	  .attr("cy", function(d) { return y(d.close); });
	   
	// svg.selectAll("dot").data(data)
	//   .enter().append("circle")
	//   .attr("cx", function(d) { return x(d.date); })
	//   .attr("cy", function(d) { return y(bottomY); })
	//   .attr("class", "bottom-line-dot");
	   
	// svg.selectAll("dot").data(data)
	//   .enter().append("circle")
	//   .attr("cx", function(d) { return x(d.date); })
	//   .attr("cy", function(d) { return y(topY); })
	//   .attr("class", "top-line-dot");
	
	legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate("+(width+margin.left)+","+margin.top+")")
    .style("font-size","14px")
    .call(d3_legend)
	
}