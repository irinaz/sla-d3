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
        }

        chart.color( nv.utils.getColor(colors) );

        chart.yAxis
            .tickFormat(d3.format(settings.format || 'd'));
        chart.valueFormat(d3.format(settings.format || 'd'));

        if (settings.margin) {
            // default margins are {top: 30, right: 20, bottom: 50, left: 60}
            chart.margin(settings.margin);
        }        

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

        if (settings.margin) {
            // default margins are {top: 30, right: 20, bottom: 50, left: 60}
            chart.margin(settings.margin);
        }        

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

                // each data stream is one represented by one color in the array
         }

        chart.color( nv.utils.getColor(colors) );
        
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

        if (settings.noXAxis) {
            chart.showXAxis(false);
        }
        if (settings.margin) {
            // default margins are {top: 30, right: 20, bottom: 50, left: 60}
            chart.margin(settings.margin);
        }


        if (settings.customTooltip) {

            chart.tooltip.contentGenerator( function (datum) {

                var titleString = '',
                    title = datum.data.title;

                if (title) {
                    titleString += '<p class="title">' + title + '</p><p>';
                }
                /*
                 if (mediator) {
                 titleString += 'Mediator: ' + mediator + '<br/>';
                 }
                 */
                titleString += 'Settlement amount: ' + formatValue(datum.data.y) + '<br/>';
                if (datum.data.field_nature_of_misstatement) {
                    titleString += 'Nature of misstatement: ' +
                        (data.field_nature_of_misstatement == "FI" ? "Financial" : "Non-Financial")+ '<br/>';
                }

                if (datum.data.field_resolution_phase ) {
                    titleString += 'Resolution phase: ' + data.field_resolution_phase + '<br/>';
                }

                //      titleString += 'Amount paid by insurer:' + formatValue(data[1].values[i].y) + '<br/>';



                return titleString;

            } );

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


function formatValue(value) {
    value = value / 1e6;
    return ' $' +(value < 0.1 ? '<0.1' : value.toFixed(value < 1 ? 2 : 0))+ 'M';
}

function d3settlement (select, settings) {
    //console.log(settings);

    var chart;
    var options = {
        duration: 300,
        margin: {left: 70, bottom: 100},
        rotateLabels: 45,
        groupSpacing: .2,
        showXAxis: false
    };
    var xAxis = {
        axisLabel: 'X axis label for the glory',
        axisLabelDistance: 35,
        showMaxMin: false,
        tickFormatString: ',.6f'
    };

    if (!settings.data) {
        var rows = settings.rows;
        //var yLabels = rows.map(function(d) { return d.shift(); });
        settings.data = [{key: 'Settlement total', values: []}/*, {key: 'Amount Insurer paying', values: []}*/];
        settings.data.mediators = [];
        settings.data.titles = [];
        settings.data.misstamenet = [];
        settings.data.resolution = [];


        jQuery.each(rows, function (i, row) {
            var title = row.title,
                mediator = row.field_mediator,
                misstamenet = row.field_nature_of_misstatement,
                resolution = row.field_resolution_phase,
                settlTotal = settings.data[0];
            //amountPaid = settings.data[1];

            settlTotal.values.push({y: parseFloat(row.field_settl_total), x: i, row: row});
            //amountPaid.values.push({y: parseFloat(row.field_amount_insurer_paying), x: i, row: row});

            settings.data.mediators.push(mediator);
            settings.data.misstamenet.push(misstamenet);
            settings.data.resolution.push(resolution);
            settings.data.titles.push(title);
        })
    }

    nv.addGraph(function () {
        chart = nv.models.multiBarChart()
            //.barColor(d3.scale.category20().range())
            .options(options);

        chart.reduceXTicks(false).staggerLabels(true).showControls(false).height(200);

        chart.tooltip.contentGenerator(function (obj) {
            // console.log(obj);

            var titleString = '',
                title = obj.data.row.title,
            // mediator = settings.data.mediators[i],
                data = obj.data.row;

            if (title) {
                titleString += '<p class="title">' + title + '</p><p>';
            }
            /*
             if (mediator) {
             titleString += 'Mediator: ' + mediator + '<br/>';
             }
             */
            titleString += 'Settlement amount: ' + formatValue(obj.data.y) + '<br/>';
            if (data.field_nature_of_misstatement) {
                titleString += 'Nature of misstatement: ' +
                    (data.field_nature_of_misstatement == "FI" ? "Financial" : "Non-Financial")+ '<br/>';
            }

            if ( data.field_resolution_phase ) {
                titleString += 'Resolution phase: ' + data.field_resolution_phase + '<br/>';
            }


            //      titleString += 'Amount paid by insurer:' + formatValue(data[1].values[i].y) + '<br/>';



            return titleString;


        });
        var xAxis = chart.xAxis
            .options(xAxis);

        if (xAxis.tickFormatString) {
            xAxis.tickFormat(d3.format(xAxis.tickFormatString))
        }

        chart.yAxis
            .axisLabelDistance(-5)
            .tickFormat(function (value) { return '$' + value / 1e6 + 'M'});

        var bars = d3.select('#' + select).append('svg')
            .datum(settings.data)
            .call(chart)
            .selectAll('.nv-bar')
            .attr('class', function (barData) {
                var phase = barData.row.field_resolution_phase;
                return this.getAttribute('class') + ' ' + (phase == null ? "" : phase.replace(/\s+/g, '-').toLowerCase());
            })
            .on("click", function (barData) {
                window.location = "/node/" + barData.row.nid;    // link bar to the node
            });
        nv.utils.windowResize(chart.update);

        return chart;
    });

}