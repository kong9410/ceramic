$(function () {
    'use strict';

    function single_calendar() {
        if (typeof($.fn.daterangepicker) === 'undefined') {
            return;
        }

        if ($('#start_dt').length) {
            $('#start_dt').daterangepicker({
                singleDatePicker: true,
                singleClasses: "picker_2",
                startDate: moment('2018-01-01'),
                locale: {
                    format: 'Y-MM-DD'
                }
            }, function(start, end, label) {
                console.log(start.toISOString(), end.toISOString(), label);
            });
        }
        
        if ($('#end_dt').length) {
            $('#end_dt').daterangepicker({
                singleDatePicker: true,
                singleClasses: "picker_2",
                startDate: moment('2018-12-31'),
                locale: {
                    format: 'Y-MM-DD'
                }
            }, function(start, end, label) {
                console.log(start.toISOString(), end.toISOString(), label);
            });
        }

       
    };

    $(document).ready(function () {

        if ($('#outlier_batch_ajax').length) {

        
            var waitingAjax = false;
            var $loader = $('#waitingResult');
            var $result = $('#x_content_outliers');

            $('#outlier_batch_ajax').submit(function(e) {
                e.preventDefault();
                if (waitingAjax) {
                    return;
                }

                const form = $(this);
                const url = form.attr('action');

                $.ajax({
                    url: url,
                    method: 'POST',
                    dataType: 'JSON',
                    data: form.serialize(),
                    beforeSend: function () {
                        waitingAjax = true;
                        $loader.show();

                        $result.html("");
                    },
                    success: function (data) {

                        var results = data.results;

                        if (data.data_q === false) {
                            $result.html("<p>Data is inadequate.</p>");
                            return;
                        }

                        if (results.length <= 0) {
                            $result.html("<p>No data is found.</p>");
                            return;
                        }
                        // Creating Line Chart
                        try {
                            $result.html("<div class='row'><div class='col-lg-9'><div id='chart_line'></div></div><div class='col-lg-3'><div id='chart_boxplot'></div></div></div>");

                            var chartLine_data = results.map(a => parseFloat(a.result));

                            var chartBoxplot_data = results.map(a => parseFloat(a.result));;

                            var factor = data.factor;

                            chartLine_data.unshift(factor);

                            var chart = c3.generate({
                                bindto: '#chart_line',
                                data: {
                                    columns: [chartLine_data],
                                    types: {
                                        'min': 'area',
                                        'max': 'area',
                                        factor: 'line'
                                    },
                                    regions: {
                                        
                                    },
                                    colors: {
                                        factor: '#16a085'
                                    },
                                    color: function(color, d) {
                                        if (d.id === factor) {

                                            var outlier = results[d.index];

                                            if (outlier !== undefined) {
                                                outlier = outlier['outlier'];
                                                if (parseInt(outlier) === -1) {
                                                    return 'red';
                                                }
                                            }
                                        }

                                        return color;
                                    }
                                    
                                },
                                point: {
                                    show: function(d) {
                                        return (d.id === factor);
                                    }
                                },
                                subchart: {
                                    show: true
                                },
                                axis: {
                                    x: {
                                        extent: [0, 0],
                                    }
                                },
                                grid: {
                                    x: {
                                        show: true
                                    },
                                    y: {
                                        show: true
                                    }
                                }
                                
                            });
                            
                        } catch(err) {
                            $result.html("<p class='red'>" + err + "</p>");
                        }
                        // Created Line Chart
                        
                        // Creating Boxplot
                        console.log(chartBoxplot_data);
                        console.log(factor);
                        var boxplot =  D3Boxplot('chart_boxplot', {
                            'totalheight': 320,
                            'dataset': {factor: chartBoxplot_data}
                        });


                        // Created Boxplot


                        // Creating Table
                        var $table = "<table class='table'>";
                        $table += "<tr><th>Factory</th><th>Line</th><th>Process</th><th>Date</th><th>" + data['factor'] + "</th><th>Outlier</th></tr>";

                        for (var i = 0, ln = results.length; i < ln; i++) {
                            var rw = results[i];
                            $table += "<tr>";
                            $table += "<td>" + data['factory'] + "</td>";
                            $table += "<td>" + data['line'] + "</td>";
                            $table += "<td>" + data['process'] + "</td>";
                            $table += "<td>" + rw['product_date'] + "</td>";
                            $table += "<td>" + rw['result'] + "</td>";
                            $table += "<td>" + rw['outlier'] + "</td>";
                            $table += "</tr>";

                            if (i == 15) {
                                break;
                            }
                        }
                        $table += "</table>";
                        $result.append($table);
                        // Created Table


                    },
                    error: function (xhr, status, error) {
                        $result.html("<p class='red'>" + error + "</p>");
                    },
                    complete: function () {
                        $loader.hide();
                        waitingAjax = false;
                    }
                });


            });

            $('.outlier_batch_opt').change(function(e) {
                $('#outlier_batch_ajax').submit();
            });

            
            $('#outlier_batch_ajax').submit();
        }
    });

    $(document).ready(function () {
        single_calendar();

        
    });

});