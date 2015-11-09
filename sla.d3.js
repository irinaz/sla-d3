
function setSLAChart(id, settings) {
    if (id === 'filings-per-year' ) {
        console.log ("creating svg element "+id +"settings: ");
        console.dir(settings);
    }

    var w = 600;
    var h = 300;

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

        if (!settings.clickableLegend) {
            chart.legend.updateState(false);
            svg.selectAll('.nv-series').style('cursor', 'unset');
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
        if(!chart){

            chart = nv.models.multiBarChart()
                    // .transitionDuration(350)
                .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                .rotateLabels(0)      //Angle to rotate x-axis labels.
                .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                .groupSpacing(0.1)  //Distance between each group of bars.
                .margin(settings.margin || {top: 0, right: 20, bottom: 50, left: 175})
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

      //  var formatAxis = d3.format('.3s');
      //  chart.yAxis
       //     .tickFormat(function(val) { return formatAxis(val).replace('G', 'B'); });

        d3.select('#'+id+'-chart')
            .datum( data )
            .call(chart);


        if (settings.lines) {
            console.log(settings);
            for (var i= 0; i < settings.lines.length; i++) {
                var p = settings.lines[i];
                console.log("p:");
                console.log(p);
                drawFixedLineAndText(id, p.value, p.label, chart );
            }
        }

        nv.utils.windowResize(chart.update);

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
    d3.select("#" + id + "-chart")
        .append("text")
        .attr("x", margin.left - 30)
        .attr("y", yValueScale(yValue) + margin.top )
        .attr("text-anchor", "middle")
        .text(text);
//end fixed line
}