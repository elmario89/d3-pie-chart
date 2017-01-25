$(function() {

    var svg = d3.select("#currency-pie-chart").append("svg").append("g");

    var drawPie = function(resizedWidth, resizedHeight){
        var width = resizedWidth,
            height = resizedHeight,
            maxSize = 866;

        if (width >= maxSize) {
            width = maxSize;
        }

        if (height >= maxSize){
            height = maxSize;
        }

        var radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var arcInner = ((radius / 100 ) * 76);

        if ($(window).width() < 1024) {
            arcInner -= 32;
            radius -= 32;
        }

        var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(arcInner);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.population; });

        //clear svg after resize and draw new
        //d3.selectAll("svg").remove();

        var svg = d3.select("#currency-pie-chart").select("svg")
            .attr("width", width)
            .attr("height", height)
            .select("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        d3.csv("/data/data.csv", type, function(error, data) {
            if (error) throw error;

            var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .attr("d", arc)
                .style("fill", function(d) { return color(d.data.age); });

            g.append("text")
                .attr("transform", function(d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("dy", ".35em")
                .text(function(d) { return d.data.age; });
        });


        function type(d) {
            d.population = +d.population;
            return d;
        }
    };

    var windowWidth = $(window).width(),
        windowHeight = $(window).height();

    drawPie(windowWidth, windowHeight);

    $( window ).resize(function() {
        drawPie($(window).width(), $(window).height());
    });

});
