/**
 * Created by alexshor on 10/28/15.
 */

var mcapFormatter = d3.format('.3s');

/*
get all per year data
 */

d3.json("data/filing-per-year".json, function(data) {


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
                format: 'd'

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
                title: data.total.count
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
                chart: nv.models.multiBarChart()
            //     .transitionDuration(350)
            .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
            //.rotateLabels(270)      //Angle to rotate x-axis labels.
            .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
            .groupSpacing(0.3)  //Distance between each group of bars.

            }
        );




        //Mean and Median Shareholder Losses
        drawHBar(
            [
                {
                    key: "Shareholder Losses",
                    color: "#d67777",
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
                showControls: false
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
get all data for settled cases
 */

d3.json("/slastats/settlement/"+nids_md5, function(data) {


        //Discovery Duration
        drawHBar(
            [
                {
                    key: "Discovery Duration",
                    color: "#d67777",
                    values: data.discoveries.items.map(function (datum) {
                        return {label: datum.label, value: datum.count};
                    })
                }
            ],
            'length-of-discovery',
            {
                w: 200,
                h: 600,
                format: ',.0d',
                margin: {top: 20, right: 20, bottom: 50, left: 130},
                showControls: false
            }
        );

        //Settlement Timing
        drawDonut(
            data.timings.items.map(function (datum) {
                return {label: datum.label, value: datum.count};
            }),

            'settlement-timing',
            {
                w: 300,
                h: 300,
                title: data.timings.count
            }


        );

        //Length of Discovery Mean/Median
        drawHBar(
            [
                {
                    key: "Length of Discovery Mean/Median",
                    color: "#d67777",
                    values: [
                        {label: "Median", value: data.discoveries.median},
                        {label: "Mean", value: data.discoveries.mean}
                    ]
                }
            ],
            'length-of-discovery-mean',
            {

                format: ',.0d',
                margin: {top: 20, right: 20, bottom: 50, left: 130},
                showControls: false
            }
        );

        //Distribution of settlements (buckets)
        drawDonut(
            data.buckets.map(function (datum) {
                return {label: datum.label, value: datum.count};
            }),

            'distribution-settlement-size-buckets',
            {
                w: 300,
                h: 300//,
                //title: data.timings.count
            }


        );

        //Settlement Size by Timing
        drawVBar(
            [
                {
                    key: "Mean",
                    //color: "#d67777",
                    values: data.timings.items.map(function (datum) {
                        return {x: datum.label, y: datum.mean};
                    })
                },
                {
                    key: "Median",
                    //color: "#d67777",
                    values: data.timings.items.map(function (datum) {
                        return {x: datum.label, y: datum.median};
                    })
                }
            ],
            'settlement-size-by-timing',
            {
                w: 200,
                h: 100,
                xformat: false,
                yformat: function(val) { return mcapFormatter(val).replace('G', 'B'); },
                chart: nv.models.multiBarChart()
                    //     .transitionDuration(350)
                    .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
                    //.rotateLabels(270)      //Angle to rotate x-axis labels.
                    .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.3)  //Distance between each group of bars.

            }
        );


        //Case Duration (for settled cases)
        drawHBar(
            [
                {
                    key: "Case Duration",
                    color: "#d67777",
                    values: data.caseLength.items
                }
            ],
            'case-duration-until-filing-settlement',
            {
                w: 200,
                h: 600,
                format: ',.0d',
                margin: {top: 20, right: 20, bottom: 50, left: 130},
                showControls: false
            }
        );


        //Case Duration Mean/Median (years)
        drawHBar(
            [
                {
                    key: "Case duration Mean/Median",
                    color: "#d67777",
                    values: [
                        {label: "Median", value: data.caseLength.median},
                        {label: "Mean", value: data.caseLength.mean}
                    ]
                }
            ],
            'case-duration-until-filing-settlement-mean',
            {

                format: 's',
                margin: {top: 20, right: 20, bottom: 50, left: 130},
                showControls: false
            }
        );

    }
);

/*
 Class Length
 */

d3.json("/slastats/classlength/"+nids_md5, function(data) {


        //Class period Length (days)
        drawHBar(
            [
                {
                    key: "Days",
                    color: "#d67777",
                    values:[
                        {label: "Mean", value: data.days.mean},
                        {label: "Median", value: data.days.median}
                    ]
                }
            ],
            'class-period-length',
            {
                w: 200,
                h: 600,
                format: 'f',
                margin: {top: 20, right: 20, bottom: 50, left: 130},
                showControls: false
            }
        );

        //Class period Length (months)
        drawHBar(
            [
                {
                    key: "Months",
                    color: "#d67777",
                    values:[
                        {label: "Mean", value: data.months.mean},
                        {label: "Median", value: data.months.median}
                    ]
                }
            ],
            'class-period-length-month',
            {
                w: 200,
                h: 600,
                format: 'f',
                margin: {top: 20, right: 20, bottom: 50, left: 130},
                showControls: false
            }
        );





    }
);

/*
Industries
 */

d3.json("/slastats/industries/"+nids_md5, function(data) {


        //Industries (filings number per year)
        drawVBar(
            [
                {
                    key: "Filings per Year",
                    //color: "#d67777",
                    values: data.items.map(function (datum) {
                        return {x: datum.label, y: datum.count};
                    })
                }
            ],
            'suites-by-industry',
            {
                w: 200,
                h: 100,
                xformat: false,
                margin:  {top: 200, right: 20, bottom: 550, left: 50},
                chart:  nv.models.multiBarChart()
                    //     .transitionDuration(350)
                    .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(270)      //Angle to rotate x-axis labels.
                    .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.1)  //Distance between each group of bars.

            }
        );


    }
);


/*
 Nature of Misstatement and Restatement
 */

d3.json("/slastats/nature/"+nids_md5, function(data) {


        drawDonut(
            [
                {label : "Financial", value: data.totalFin},
                {label : "Non-Financial", value: data.totalNFin}
            ],

            'nature-of-misstatement',
            {
                w: 300,
                h: 300,
                title: data.total
            }


        );

        drawDonut(
            [
                {label : "Restatement", value: data.totalRes},
                {label : "No Restatement", value: data.totalNRes}
            ],

            'restatements',
            {
                w: 300,
                h: 300,
                title: data.totalFin
            }


        );


    }
);

/*
SEC
 */

d3.json("/slastats/sec/"+nids_md5, function(data) {


        drawDonut(
            [
                {label : "Parallel SEC", value: data.sec},
                {label : "No Parallel SEC", value: data.noSec}
            ],

            'sec',
            {
                w: 300,
                h: 300,
                title: data.total
            }


        );



    }
);


/*
 Context of misstatement
 */

d3.json("/slastats/context/"+nids_md5, function(data) {



        drawVBar(
            [
                {
                    key: "Context of misstatement",
                    //color: "#d67777",
                    values: data.map(function (datum) {
                        return {x: datum.label, y: datum.count};
                    })
                }
            ],
            'context-of-misstatement',
            {
                w: 200,
                h: 100,
                xformat: false,
                margin:  {top: 200, right: 20, bottom: 200, left: 50},
                chart:  nv.models.multiBarChart()
                    //     .transitionDuration(350)
                    .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(270)      //Angle to rotate x-axis labels.
                    .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.1)  //Distance between each group of bars.

            }
        );


    }
);

/*
 Evidence of Intent
 */

d3.json("/slastats/intent/"+nids_md5, function(data) {



        drawVBar(
            [
                {
                    key: "Alleged Evidence of Intent",
                    //color: "#d67777",
                    values: data.map(function (datum) {
                        return {x: datum.label, y: datum.count};
                    })
                }
            ],
            'alleged-intent',
            {
                w: 200,
                h: 100,
                xformat: false,
                margin:  {top: 200, right: 20, bottom: 200, left: 50},
                chart:  nv.models.multiBarChart()
                    //     .transitionDuration(350)
                    .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(270)      //Angle to rotate x-axis labels.
                    .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.1)  //Distance between each group of bars.

            }
        );


    }
);


/*
 Director & Officer Positions Named
 */

d3.json("/slastats/positions/"+nids_md5, function(data) {



        drawVBar(
            [
                {
                    key: "Director & Officer Positions Named",
                    //color: "#d67777",
                    values: data.map(function (datum) {
                        return {x: datum.label, y: datum.value};
                     })
                }
            ],
            'director-officer-positions-named',
            {
                w: 200,
                h: 100,
                xformat: false,
               // margin:  {top: 200, right: 20, bottom: 200, left: 50},
                chart:  nv.models.multiBarChart()
                    //     .transitionDuration(350)
                    .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(0)      //Angle to rotate x-axis labels.
                    .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.1)  //Distance between each group of bars.

            }
        );


    }
);


/*
 Auditors Named in Financial Misstatement Cases
 */

d3.json("/slastats/auditors/"+nids_md5, function(data) {


        drawDonut(
            data.items.map(function (datum) {
                return {label : datum.label, value: datum.count};
            }),

            'auditors-named',
            {
                w: 300,
                h: 300,
                title: data.total
            }


        );



    }
);

/*
 Underwriters Defendants in Public Offering Cases
 */

d3.json("/slastats/underwriters/"+nids_md5, function(data) {


        drawDonut(
            data.items.map(function (datum) {
                return {label : datum.label, value: datum.count};
            }),

            'underwriters-defendants',
            {
                w: 300,
                h: 300,
                title: data.total
            }


        );



    }
);


/*
Case Status
 */

d3.json("/slastats/status/"+nids_md5, function(data) {


        drawDonut(
            data.items,

            'case-status',
            {
                w: 300,
                h: 300,
                title: data.total
            }


        );



    }
);

/*
Section Violations
 */

d3.json("/slastats/sectionviolations/"+nids_md5, function(data) {


        drawDonut(
            data.items.map(function (datum) {
                return {label : datum.label, value: datum.count};
            }),

            'alleged-section-violations',
            {
                w: 300,
                h: 300,
                title: data.total
            }


        );



    }
);
