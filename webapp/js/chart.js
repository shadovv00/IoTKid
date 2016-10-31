function createChart(container,receivedData){
	// console.log(receivedData);
	// Масив даних
	var data = [
	// 	{
	//     date: "1:12",
	//     close: "58.13"
	// }, {
	//     date: "1:16",
	//     close: "53.98"
	// }, {
	//     date: "1:30",
	//     close: "67.00"
	// }, {
	//     date: "1:40",
	//     close: "89.70"
	// }, {
	//     date: "1:42",
	//     close: "99.00"
	// }
	];
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
	    right: 20,
	    bottom: 50,
	    left: 50
	};
	var width = $(container).width() - margin.left - margin.right;
	var height =  $(container).height() - margin.top - margin.bottom;
	console.log(width);
	console.log(height);
	//змініть тут на значення топ і нижньої меж
	var bottomY = "4";
	var topY = "20";
	
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
	.attr("d", valueline([{date:data[0].date, close:bottomY}, {date:data[data.length-1].date,close:bottomY}])).attr('class','bottom-line'); 
	
	svg.append("path").attr("class", "line") 
	.attr("d", valueline([{date:data[0].date, close:topY}, {date:data[data.length-1].date,close:topY}])).attr('class','top-line');  
	
	svg.append("path").attr("class", "line") // Add the valueline path.
	.attr("d", valueline(data));
	
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
}