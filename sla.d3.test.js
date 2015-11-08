/**
 * Created by alexshor on 10/27/15.
 * to be included at the end of test.tpl.php
 */
d3.json("/slastats/settlement/"+nids_md5, function(data) {



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
            'test-hbar',
            {
                w: 200,
                h: 600,
                format: ',.0d',
                margin: {top: 20, right: 20, bottom: 50, left: 130},
                showControls: false
            }
        );

//the same with different settings
        drawHBar(
            [
                {
                    key: "Discovery Duration 2",
                    color: "#d67777",
                    values: data.discoveries.items.map(function (datum) {
                        return {label: datum.label, value: datum.count};
                    })
                }
            ],
            'test-hbar2',
            {
                w: 200,
                h: 60,
                format: ',.0d',
                chart:  nv.models.multiBarHorizontalChart()
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value })
                    .margin( {top: 0, right: 20, bottom: 50, left: 175})
                    .showValues(true)           //Show bar value next to each bar.
                    .tooltips(true)             //Show tooltips on hover.
//          .transitionDuration(350)
                    .showControls(true)
            }
        );




    }
);






d3.json("/slastats/sectionviolations/"+nids_md5, function(data) {
    drawDonut(
        data.items.map(function (datum) {
            return {label: datum.label, value: datum.count};
        }),

        'test-donut',
        {
            w: 300,
            h: 300,
        }
    );

});