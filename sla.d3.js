function drawLineLabels (chart, svg, lineData) {
    var width = nv.utils.availableWidth(null, svg, chart.margin() );
    var availableWidth = width - chart.legend.margin().left - chart.legend.margin().right;
    var padding = 28;
    var container = svg.select('.nv-legendWrap');

    var wrap = container.selectAll('g.nv-legend').data(lineData);

    var gEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-legend').append('g');
    var g = wrap.select('g');

    wrap.attr('transform', 'translate(' + chart.legend.margin().left + ',' + chart.legend.margin().top + ')');

    var series = g.selectAll('.nv-series')
        .data(lineData);

    var seriesEnter = series.enter().append('g').attr('class', 'nv-series').style('cursor', 'unset')
        
    seriesEnter.append('text')
        .attr('text-anchor', 'start')
        .attr('class','nv-legend-text')
        .attr('dy', '.32em')
        .attr('dx', '8');

    series.selectAll('circle').remove();
    series.select('text').text( function (d) { return d.label + ": " + d3.format('.3s')(d.value).replace('G', 'B'); });

    // add the line
    series.each(function (d, i) {
        var yValueScale = chart.yAxis.scale();
        var xValueScale = chart.xAxis.scale();
        var margin = chart.margin();

        svg.append("line")
            .style("stroke", "#FF7F0E")
            .style("stroke-width", "2.5px")
            .attr("x1", margin.left -10)
            .attr("y1", yValueScale(d.value) +  margin.top  )
            .attr("x2", width + margin.right)
            .attr("y2",yValueScale(d.value) +  margin.top );

    });


    var seriesWidths = [];
    series.each(function(d,i) {
        var legendText = d3.select(this).select('text');
        var nodeTextLength;
        try {
            nodeTextLength = legendText.node().getComputedTextLength();
            // If the legendText is display:none'd (nodeTextLength == 0), simulate an error so we approximate, instead
            if(nodeTextLength <= 0) throw Error();
        }
        catch(e) {
            nodeTextLength = nv.utils.calcApproxTextWidth(legendText);
        }

        seriesWidths.push(nodeTextLength + padding);
    });

    var seriesPerRow = 0;
    var legendWidth = 0;
    var columnWidths = [];

    while ( legendWidth < availableWidth && seriesPerRow < seriesWidths.length) {
        columnWidths[seriesPerRow] = seriesWidths[seriesPerRow];
        legendWidth += seriesWidths[seriesPerRow++];
    }
    if (seriesPerRow === 0) seriesPerRow = 1; //minimum of one series per row

    while ( legendWidth > availableWidth && seriesPerRow > 1 ) {
        columnWidths = [];
        seriesPerRow--;

        for (var k = 0; k < seriesWidths.length; k++) {
            if (seriesWidths[k] > (columnWidths[k % seriesPerRow] || 0) )
                columnWidths[k % seriesPerRow] = seriesWidths[k];
        }

        legendWidth = columnWidths.reduce(function(prev, cur, index, array) {
            return prev + cur;
        });
    }

    var xPositions = [];
    for (var i = 0, curX = 0; i < seriesPerRow; i++) {
        xPositions[i] = curX;
        curX += columnWidths[i];
    }

    series
        .attr('transform', function(d, i) {
            return 'translate(' + xPositions[i % seriesPerRow] + ',' + (5 + Math.floor(i / seriesPerRow) * 20) + ')';
        });

    //position legend as far right as possible within the total width

    g.attr('transform', 'translate(' + (width - chart.legend.margin().right - legendWidth) + ',' + chart.legend.margin().top + ')');

}

function setSLAChart(id, settings) {
    if (id === 'filings-per-year' ) {
        console.log ("creating svg element "+id +"settings: ");
        console.dir(settings);
    }

    var w = '100%';
    var h = '100%';
    // var wrapper = d3.select('#' + id).append('div').attr('width', settings.w || w).attr

    //Create SVG element
    var svg = d3.select('#'+id)
        .append("svg")
        .attr("id", id +'-chart')
        .attr("width", settings.w || w)
        .attr("height",settings.h || h) ;
    return svg;
}


function drawHBar(data, id, settings) {

    var colors = settings.colors || d3.scale.category20().range();

    nv.addGraph(function() {

        var svg = setSLAChart(id, {w: settings.w, h: settings.h});

        var chart = settings.chart;
        if(!chart){
            chart = nv.models.multiBarHorizontalChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
                .margin(settings.margin || {top: 0, right: 20, bottom: 50, left: 175})
                .showValues(true)           //Show bar value next to each bar.
                .tooltips(true)             //Show tooltips on hover.
//          .transitionDuration(350)
                .showControls(typeof settings.showControls != 'undefined' ? settings.showControls : true)        //Allow user to switch between "Grouped" and "Stacked" mode.
                .color( nv.utils.getColor(colors) );

        }

        chart.yAxis
            .tickFormat(d3.format(settings.format || 'd'));
        chart.valueFormat(d3.format(settings.format || 'd'));

        d3.select('#'+id+'-chart')
            .datum( data )
            .call(chart);

        if ( settings.labels ) {
            var labels = svg.select('.nv-x').selectAll('text');
            labels.style('fill', settings.labels.color);
            labels.style('font-size', settings.labels.size);
        }

        if (settings.noClickableLegend) { 
            chart.legend.updateState(false);
            svg.selectAll('.nv-series').style('cursor', 'unset');
        }

        nv.utils.windowResize(chart.update);

        return chart;
    });
}


function drawDonut(data, id, settings) {
    nv.addGraph(function() {

        var svg = setSLAChart(id, {w: settings.w, h: settings.h});
        var colors = settings.colors || d3.scale.category20().range();

        var chart = settings.chart;
        if(!chart){
            chart = nv.models.pieChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
                .width(settings.w)
                .height(settings.h)
                .donut(true);

            if(settings.title){
                chart = chart.title(settings.title);
            }
        }

        chart.color( nv.utils.getColor(colors) );
        chart.valueFormat(d3.format(settings.format || 'd'));



        // .nvd3 .nv-legend .nv-series

        d3.select('#'+id+'-chart')
            //.datum(historicalBarChart)
            .datum(data)
            .transition().duration(1200)
            .call(chart);

        if (settings.noClickableLegend) {
            chart.legend.updateState(false);
            svg.selectAll('.nv-series').style('cursor', 'unset');
        }
        if ( settings.labels ) {
            var labels = svg.select('.nv-x').selectAll('text');
            labels.style('fill', settings.labels.color);
            labels.style('font-size', settings.labels.size);
        }

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

function drawVBar(data, id, settings) {
    nv.addGraph(function() {

        var svg = setSLAChart(id, {w: settings.w, h: settings.h});
        var chart = settings.chart;
        var colors = settings.colors || d3.scale.category20().range();
        var width = null;

        if(!chart){

            chart = nv.models.multiBarChart()
                    // .transitionDuration(350)
                .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                .rotateLabels(0)      //Angle to rotate x-axis labels.
                .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                .groupSpacing(0.1)  //Distance between each group of bars.
                // .margin(settings.margin || {top: 0, right: 20, bottom: 50, left: 175})
                .color( nv.utils.getColor(colors) );
                // each data stream is one represented by one color in the array
         }

        if(settings.xformat !== false) {
            chart.xAxis
                .tickFormat(settings.xformat ||  d3.format('f'));
        }


        if(settings.yformat !== false) {
            chart.yAxis
                .tickFormat(settings.yformat || d3.format('f'));
        }

        if (settings.noLegend) {
            chart.showLegend(false);
        }        

        d3.select('#'+id+'-chart')
            .datum( data )
            .call(chart);

        if (settings.noClickableLegend) {
            chart.legend.updateState(false);
            svg.selectAll('.nv-series').style('cursor', 'unset');
        }

        if (settings.lines) {
            chart.showLegend(false);
            drawLineLabels(chart, svg, settings.lines);
            svg.selectAll('.nv-series').style('cursor', 'unset');

        }

        nv.utils.windowResize( function () {
            chart.update();
            if (settings.lines) {
                console.log('resizing line labels... ');
                drawLineLabels(chart, svg, settings.lines);
            }
        });

        if ( settings.labels ) {
            var labels = svg.select('.nv-x').selectAll('text');
            labels.style('fill', settings.labels.color);
            labels.style('font-size', settings.labels.size);
        }

        return chart;
    });
}

function drawFixedLineAndText(id, yValue,  text, chart) {
    console.log("chart:");
    var yValueScale = chart.yAxis.scale();
    var xValueScale = chart.xAxis.scale();

    console.log(xValueScale.domain());
    var domain = xValueScale.domain();
    var maxx = domain[domain.length -1];
    var margin = chart.margin();
    var svg = d3.select("#" + id + "-chart");
    svg.append("line")
        .style("stroke", "#FF7F0E")
        .style("stroke-width", "2.5px")
        .attr("x1", margin.left -10)
        .attr("y1", yValueScale(yValue) +  margin.top  )
        .attr("x2",xValueScale(maxx) + margin.left)
        .attr("y2",yValueScale(yValue) +  margin.top );


//add text to fixed line
    // d3.select("#" + id + "-chart")
    //     .append("text")
    //     .attr("x", margin.left - 30)
    //     .attr("y", yValueScale(yValue) + margin.top )
    //     .attr("text-anchor", "middle")
    //     .text(text);
//end fixed line
}