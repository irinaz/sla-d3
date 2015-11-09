/**
 * Created by alexshor on 10/28/15.
 */

var mcapFormatter = d3.format('.3s');

/*
get all per year data
 */

d3.json("data/filing-per-year.json", function(data) {


        //Filings per Year
        drawVBar(
            [
                {
                    key: "Filings per Year",
                    //color: "#d67777",
                    values: data.annual.map(function (datum) {
                        return {x: datum.year, y: datum.count};
                    })
                }
            ],
            'filings-per-year',
            {
                w: 200,
                h: 100,
				margin: {top: 0, right: 20, bottom: 50, left: 100},
                format: 'd',
                colors: ['#0f0', '#000', '#00f']


            }
        );


        //Mean Market Cap per Filing Year
        drawVBar(
            [
                {
                    key: "Mean Market Cap per Filing Year",
                    //color: "#d67777",
                    values: data.annual.map(function (datum) {
                        return {x: datum.year, y: datum.market_cap.mean};
                    })
                }
            ],
            'issuer-market-cap-mean',
            {

                format: 'd',
                yformat: function(val) { return mcapFormatter(val).replace('G', 'B'); },
                lines: [
                    {label : "Mean", value :  data.total.mean}
                ]


            }
        );

        // Median Market Cap per Filing Year
        drawVBar(
            [
                {
                    key: "Median Market Cap per Filing Year",
                    //color: "#d67777",
                    values: data.annual.map(function (datum) {
                        return {x: datum.year, y: datum.market_cap.median};
                    })
                }
            ],
            'issuer-market-cap-median',
            {

                format: 'd',
                yformat: function(val) { return mcapFormatter(val).replace('G', 'B'); },
                lines: [
                    {label : "Median", value :  data.total.median}
                ]


            }
        );

        //Market Cap Ranges
        drawDonut(
            data.caps,

            'filings-by-market-cap-range',
            {
                w: 300,
                h: 300,
                title: data.total.count,
                colors: ['#f00', '#0f0', '#0ff'],
                clickableLegend: false
            }


        );


        //Institutional Plaintiffs
        drawVBar(
            [
                {
                    key: "Public Pensions",
                    //color: "#d67777",
                    values: data.annual.map(function (datum) {
                        return {x: datum.year, y: datum.institutions.pensions};
                    })
                },
                {
                    key: "Unions",
                    //color: "#d67777",
                    values: data.annual.map(function (datum) {
                        return {x: datum.year, y: datum.institutions.unions};
                    })
                },
                {
                    key: "Other Institutions",
                    //color: "#d67777",
                    values: data.annual.map(function (datum) {
                        return {x: datum.year, y: datum.institutions.other};
                    })
                }
            ],
            'institutional-plaintiffs',
            {
                w: 200,
                h: 100,
                format: 'd',
                // chart: nv.models.multiBarChart()
                colors: ['#f00', '#0f0', '#00f']
            }
        );




        //Mean and Median Shareholder Losses
        drawHBar(
            [
                {
                    key: "Shareholder Losses",
                    // color: "#d67777",
                    values: [
                        {label: "Median", value: data.total.max_drop_median},
                        {label: "Mean", value: data.total.max_drop_mean}
                    ]
                }
            ],
            'shareholder-losses-mean-median',
            {

                format: 's',
                margin: {top: 20, right: 20, bottom: 50, left: 130},
                showControls: false,
                colors: ['#ff0', '#000', '#00f']
            }
        );

        //Shareholder Losses by Year
        drawVBar(
            [
                {
                    key: "Mean",
                    //color: "#d67777",
                    values: data.annual.map(function (datum) {
                        return {x: datum.year, y: datum.max_drop.mean};
                    })
                },
                {
                    key: "Median",
                    //color: "#d67777",
                    values: data.annual.map(function (datum) {
                        return {x: datum.year, y: datum.max_drop.median};
                    })
                }
            ],
            'shareholder-losses-by-year',
            {
                w: 200,
                h: 100,
                format: 'd',
                chart: nv.models.multiBarChart()
                    //     .transitionDuration(350)
                    .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
                    //.rotateLabels(270)      //Angle to rotate x-axis labels.
                    .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.3)  //Distance between each group of bars.

            }
        );
		
		
		

    }
);

/*
Industries
 */

d3.json("data/suites-by-industry.json", function(data) {


        //Industries (filings number per year)
        drawVBar(
            [
                {
                    key: "Suites Filed by Industry per Year",
                    //color: "#d67777",
                    values: data.items.map(function (datum) {
                        return {x: datum.label, y: datum.count};
                    })
                }
            ],
            'suites-by-industry',
            {
                xformat: false,
                margin:  {top: 200, right: 20, bottom: 550, left: 50},
                chart:  nv.models.multiBarChart()
                    //     .transitionDuration(350)
                    .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(270)      //Angle to rotate x-axis labels.
                    .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .showLegend(false)
                    .groupSpacing(0.1)  //Distance between each group of bars.

            }
        );


    }
);

 