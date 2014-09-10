/**
 * Created by secarl on 2014-09-09.
 */
$(document).ready(function() {

    function createRect() {
        var rectDemo = d3.select("#rect").
            append("svg:svg").
            attr("width", 400).
            attr("height", 300);

        rectDemo.append("svg:rect").
            attr("x", 100).
            attr("y", 100).
            attr("height", 100).
            attr("width", 200);
    }

    function test() {
        $.getJSON('../data/temp.json', function(data) {
            var barWidth = 40;
            var width = (barWidth + 10) * data.length;
            var height = 300;

            var x = d3.scale.linear().domain([0, data.length]).rangeRound([0, width]);
            var y = d3.scale.linear().domain([0, d3.max(data, function(t) {
                return d3.max(t.temperatures);
            })]).rangeRound([0, height]);

            var bars = d3.select('#temps').
                append('svg:svg').
                attr('width', width).
                attr('height', height);

            bars.selectAll('rect').
                data(data).
                enter().
                append('svg:rect').
                attr('x', function(datum, index) { // Sätter x-position i pixlar returnerat från var x
                    return x(index);
                }).
                attr('y', function(datum) {
                    return height - y(d3.max(datum.temperatures));
                }).
                attr('height', function(datum) {
                    return y(d3.max(datum.temperatures));
                }).
                attr('width', barWidth).
                attr('fill', '#2d578b').
                transition(2000);

            // Events
            bars.selectAll('rect').on('mouseover', (function(elem) {
                d3.select(this).transition().duration(500).attr('fill', '#5779A2');
            }));

            bars.selectAll('rect').on('mouseout', (function(elem) {
                d3.select(this).transition().duration(500).attr('fill', '#2d578b');
            }));

            bars.selectAll('rect').on('click', (function(elem) {
                console.log(elem);
                createLineChart(elem);
            }));


            bars.selectAll('text').
                data(data).
                enter().
                append('svg:text').
                attr('x', function(datum, index) {
                    return x(index) + barWidth;
                }).
                attr('y', function(datum) {
                    return height - y(d3.max(datum.temperatures));
                }).
                attr('dx', -barWidth/2).
                attr('dy', "1.2em").
                attr("text-anchor", "middle").
                text(function(datum) {
                    return d3.max(datum.temperatures);
                }).
                attr("fill", "white");

            bars.selectAll("text.yAxis").
                data(data).
                enter().append("svg:text").
                attr("x", function(datum, index) { return x(index) + barWidth; }).
                attr("y", height).
                attr("dx", -barWidth/2).
                attr("text-anchor", "middle").
                attr("style", "font-size: 12; font-family: Helvetica, sans-serif").
                text(function(datum) { return datum.id;}).
                attr("transform", "translate(0, 18)").
                attr("class", "yAxis");
        });
    }

    function createLineChart(data) {
        data = data.temperatures;

        var svg = $('#dayTemp');
        while (svg[0].lastChild) {
            svg[0].removeChild(svg[0].lastChild);
        }

        var vis = d3.select('#dayTemp'),
            WIDTH = 1000,
            HEIGHT = 500,
            MARGINS = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 50
            },
            xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, 24]),
            yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(data), d3.max(data)]),
            xAxis = d3.svg.axis()
                .scale(xRange)
                .tickSize(5)
                .tickSubdivide(true),
            yAxis = d3.svg.axis()
                .scale(yRange)
                .tickSize(5)
                .orient('left')
                .tickSubdivide(true);

        vis.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
            .call(xAxis);

        vis.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
            .call(yAxis);

        var lineFunc = d3.svg.line()
            .x(function(d, index) {
                return xRange(index);
            })
            .y(function(d, index) {
                return yRange(d);
            })
            .interpolate('linear');

        vis.append('svg:path')
            .attr('d', lineFunc(data))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    }

    test();

    function createBarChart() {
        var data = [{year: 2006, books: 54},
            {year: 2007, books: 43},
            {year: 2008, books: 41},
            {year: 2009, books: 44},
            {year: 2010, books: 35}];

        var barWidth = 40;
        var width = (barWidth + 10) * data.length;
        var height = 200;

        var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
        var y = d3.scale.linear().domain([0, d3.max(data, function(datum) {
            return datum.books}
        )]).rangeRound([0, height]);

        var barDemo = d3.select('#bar-chart').
            append('svg:svg').
            attr('width', width).
            attr('height', height);

        barDemo.selectAll("rect").
            data(data).
            enter().
            append("svg:rect").
            attr("x", function(datum, index) {
                return x(index);
            }).
            attr("y", function(datum) {
                return height - y(datum.books);
            }).
            attr("height", function(datum) {
                return y(datum.books);
            }).
            attr("width", barWidth).
            attr("fill", "#2d578b");

        var generateBarLabels = function() {
            barDemo.selectAll("text").
                data(data).
                enter().
                append("svg:text").
                attr("x", function(datum, index) {
                    return x(index) + barWidth;
                }).
                attr("y", function(datum) {
                    return height - y(datum.books);
                }).
                attr("dx", -barWidth/2).
                attr("dy", "1.2em").
                attr("text-anchor", "middle").
                text(function(datum) {
                    return datum.books;
                }).
                attr("fill", "white");
        };

        var generateYAxis = function() {
            barDemo.selectAll("text.yAxis").
                data(data).
                enter().append("svg:text").
                attr("x", function(datum, index) {
                    return Math.round(x(index) + barWidth);
                }).
                attr("y", height).
                attr("dx", -barWidth/2).
                attr("text-anchor", "middle").
                attr("style", "font-size: 12; font-family: Helvetica, sans-serif; z-index: 99999;").
                text(function(datum) {
                    return datum.year;
                }).
                attr("transform", "translate(0, 18)").
                attr("class", "yAxis");
        };

        generateBarLabels();
        generateYAxis();
    }

//    function generateJSON() {
//        var arr = [];
//        for (var i = 1; i < 4; i++) {
//            var temps = generateTemperatures();
//            var obj = { id: i, temperatures: temps }
//            arr.push(obj);
//        }
//        console.log(JSON.stringify(arr));
//    }
//
//    function generateTemperatures() {
//        var temps = [];
//
//        while (temps.length < 25) {
//            var rand = Math.random() * (26 - 18) + 18;
//            var newTemp = Math.round(rand);
//            if (temps.length < 1) {
//                temps.push(newTemp);
//            } else {
//                var prev = temps[temps.length-1];
//                if (Math.abs(prev - newTemp) < 3) {
//                    temps.push(newTemp);
//                }
//            }
//        }
//        return temps;
//    }
//
//    generateJSON();

//    createBarChart();
//    createRect();

});