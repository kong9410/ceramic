(function (window) {
    'use strict';

    var lib = function myLibrary(ctx, cfg) {

        // Prepare the data for the box plots
        var dataset = cfg.dataset || undefined;

        if (dataset === undefined) {
            return;
        }
    
        // Size and color settings for the chart
        var element = document.getElementById(ctx);

        var totalWidth = element.offsetWidth;
        var totalheight = cfg.totalheight || 500;
        var margin = {top: cfg.margin && cfg.margin.top || 40, right: cfg.margin && cfg.margin.right || 30, bottom: cfg.margin && cfg.margin.bottom || 30, left: cfg.margin && cfg.margin.left || 50},
            width = totalWidth - margin.left - margin.right,
            height = totalheight - margin.top - margin.bottom;
        var barWidth = cfg.barWidth || 40;
        var boxPlotColor = cfg.boxPlotColor || "#898989";
        var medianLineColor = cfg.medianLineColor || "#ffffff";
        var axisColor = cfg.axisColor || "#898989";

        // Setup the svg and group we will draw the box plot in
        var svg = d3.select("#" + ctx).append("svg")
            .attr("width", totalWidth)
            .attr("height", totalheight)
            .append("g")
            .attr("transform", "translate(" + (margin.left - barWidth) + "," + margin.top + ")");

        // Move axis to center align the bars with the xAxis ticks
        var yAxisBox = svg.append("g").attr("transform", "translate(40,0)");
        var xAxisBox = svg.append("g").attr("transform", "translate(40,0)");
        

        
        var globalCounts = [];
        for (var key in dataset) {
            var groupCount = dataset[key]
            dataset[key] = groupCount.sort(sortNumber);
            dataset[key].forEach(element => {
                globalCounts.push(element);
            });
        }

        console.log('globalCounts', globalCounts);

        var plotData = [];
        var colorIndex = 0.1;
        var colorIndexStepSize = 0.08;

        Object.keys(dataset).forEach(item => {
            var data = dataset[item];

            var record = {};
            var localMin = d3.min(data);
            var localMax = d3.max(data);

            record["key"] = item;
            record["counts"] = data.length;
            record["quartile"] = boxQuartiles(data);
            record["whiskers"] = [localMax, localMin];
            record["color"] = d3.interpolateInferno(colorIndex);


            console.log(record["quartile"]);

            plotData.push(record);
            colorIndex += colorIndexStepSize;
            globalCounts.push(item);
        });


        // Create Tooltips
        var tip = d3.tip().attr('class', 'd3-tip').direction('e').offset([0,5])
            .html(function(d) {
                var content = "<span style='margin-left: 2.5px;'><b>" + d.key + "</b></span><br>";
                content +=`
                    <table style="margin-top: 2.5px;">
                            <tr><td>Max: </td><td style="text-align: right">` + d3.format(".2f")(d.whiskers[0]) + `</td></tr>
                            <tr><td>Q3: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[0]) + `</td></tr>
                            <tr><td>Median: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[1]) + `</td></tr>
                            <tr><td>Q1: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[2]) + `</td></tr>
                            <tr><td>Min: </td><td style="text-align: right">` + d3.format(".2f")(d.whiskers[1]) + `</td></tr>
                    </table>
                    `;
                return content;
            });
        svg.call(tip);
        
        // Compute an ordinal xScale for the keys in plotData
        var xScale = d3.scalePoint()
        .domain(Object.keys(dataset))
        .rangeRound([0, width])
        .padding([0.5]);

        // Compute a global y scale based on the global counts
        var min = d3.min(globalCounts);
        var max = d3.max(globalCounts);

        var yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([min, max])
            .nice();

        // Setup the group the box plot elements will render in
        var g = svg.append("g")
        .attr("transform", "translate(20,0)");

        // Draw the box plot vertical lines
        var verticalLines = g.selectAll(".verticalLines")
        .data(plotData)
        .enter()
        .append("line")
        .attr("x1", d => { return xScale(d.key) + barWidth/2; })
        .attr("y1", d =>  { return yScale(d.whiskers[0]); })
        .attr("x2", d =>  { return xScale(d.key) + barWidth/2; })
        .attr("y2", d => { return yScale(d.whiskers[1]); })
        .attr("stroke", boxPlotColor)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5")
        .attr("fill", "none");

        // Draw the boxes of the box plot, filled in white and on top of vertical lines
        var rects = g.selectAll("rect")
        .data(plotData)
        .enter()
        .append("rect")
        .attr("width", barWidth)
        .attr("height", d => { return yScale(d.quartile[2]) - yScale(d.quartile[0]); })
        .attr("x", d => { return xScale(d.key); })
        .attr("y", d => { return yScale(d.quartile[0]); })
        .attr("fill", d => { return d.color; })
        .attr("stroke", boxPlotColor)
        .attr("stroke-width", 1)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

        // Config for whiskers and median
        var horizontalLineConfigs = [
        {   // Top whisker
            x1: d => { return xScale(d.key) },
            y1: d => { return yScale(d.whiskers[0]) },
            x2: d => { return xScale(d.key) + barWidth },
            y2: d => { return yScale(d.whiskers[0]) },
            color: boxPlotColor
        },
        {   // Median
            x1: d => { return xScale(d.key) },
            y1: d => { return yScale(d.quartile[1]) },
            x2: d => { return xScale(d.key) + barWidth },
            y2: d => { return yScale(d.quartile[1]) },
            color: medianLineColor
        },
        {   // Bottom whisker
            x1: d => { return xScale(d.key) },
            y1: d => { return yScale(d.whiskers[1]) },
            x2: d => { return xScale(d.key) + barWidth },
            y2: d => { return yScale(d.whiskers[1]) },
            color: boxPlotColor
        }
        ];
            
        // Draw the whiskers and median line
        for(var i=0; i < horizontalLineConfigs.length; i++) {
            var lineConfig = horizontalLineConfigs[i];
            var horizontalLine = g.selectAll(".whiskers")
                .data(plotData)
                .enter()
                .append("line")
                .attr("x1", lineConfig.x1)
                .attr("y1", lineConfig.y1)
                .attr("x2", lineConfig.x2)
                .attr("y2", lineConfig.y2)
                .attr("stroke", lineConfig.color)
                .attr("stroke-width", 1)
                .attr("fill", "none");
        }

        // add the Y gridlines
        svg.append("g")
            .attr("transform", "translate(40,0)")			
            .attr("class", "grid")
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat("")
            )

        // Setup a scale on the left
        var yAxis = d3.axisLeft(yScale).ticks(6)
        yAxisBox.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // Setup a series axis on the bottom
        var xAxis = d3.axisBottom(xScale);
        xAxisBox.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);


        
  


    // Quartile definition
    function boxQuartiles(d) {
        return [
            d3.quantile(d, .75),
            d3.quantile(d, .5),
            d3.quantile(d, .25),
        ];
    }

    // Perform a numeric sort on an array
    function sortNumber(a,b) { return a - b; }

    };

    if (typeof window.D3Boxplot === 'undefined') {
        window.D3Boxplot = lib;
    }
})(window);