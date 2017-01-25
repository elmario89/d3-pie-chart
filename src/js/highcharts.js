
var myData = [3, 3.5, 3.9, 4.5, 4.4, 5, 4.9, 5, 5.2, 5.3, 8.4, 7.5, 7.7];
var len = myData.length -1;
var lastPoint = myData[len];
var currentCurrency = "EUR/USD";

var chart = Highcharts.chart('currency-compare', {
    chart: {
        backgroundColor:'transparent',
        height: 110
    },
    title: {
        text: ''
    },
    xAxis: {
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        labels: {
            enabled: false
        },
        minorTickLength: 0,
        tickLength: 0,
        minPadding: 0,
        maxPadding: 0
    },
    credits: {
        enabled: false
    },
    yAxis: [{
        title: {
            text: ''
        },
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        labels: {
            enabled: false
        },
        minorTickLength: 0,
        gridLineWidth: 0,
        tickLength: 0,
        minPadding: 0,
        maxPadding: 0
    },
    {
        title: {
            text: ''
        },
        opposite:true,
        linkedTo:0,
        tickPositions:[lastPoint] ,
        gridLineWidth:0,
        labels: {
            style: {
                color: "#fff",
                fontFamily: "Roboto",
                fontWeight: "lighter",
                fontSize: "26px"
            },
            formatter: function () {
                return '<div>' + [lastPoint] + '<br><span class="highchart-sublabel">' + currentCurrency + '</span></div>';
            }
        }
    }],
    tooltip: {
        valueSuffix: '',
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadow: false,
        style: {
            color: "#fff",
            fontWeight: "bold",
            fontSize: "13px",
            letterSpacing: "1.66px",
            cursor: "pointer"
        },
        formatter: function() {
            return this.y;
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: [{
        showInLegend: false,
        data: myData,
        type: 'spline',
        color: '#fff',
        marker: {
            enabled: false,
            states: {
                hover: {
                    fillColor: '#fff',
                    lineWidth: 2,
                    radius: 5,
                    lineColor: "#fff"
                }
            }
        }
    }],
    plotOptions: {
        series: {
            cursor: 'pointer',
            states: {
                hover: {
                    halo: {
                        size: 0
                    }
                }
            }
        }
    }
});


// reflow chart to correct parent size on load!
$(function() {
    chart.reflow();
});
