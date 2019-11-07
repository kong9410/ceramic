$(function() {
  "use strict";
  $(document).ready(function() {
    if ($("#outlier_correlation_ajax").length) {
      var waitingAjax = false;
      var $loader = $("#waitingResult");
      var $result = $("#x_content_correlation");

      $("#outlier_correlation_ajax").submit(function(e) {
        e.preventDefault();
        if (waitingAjax) {
          return;
        }

        const form = $(this);
        const url = form.attr("action");

        $.ajax({
          url: url,
          method: "POST",
          dataType: "JSON",
          data: form.serialize(),
          beforeSend: function() {
            waitingAjax = true;
            $loader.show();

            $result.html("");
            $("#x_content_rf").html("");
            $("#x_content_ff").html("");
            $("#x_content_sp").html("");
          },
          success: function(data) {
            if (data.rf !== undefined) {
              $("#x_content_rf").html("<div id='chart_rf'></div>");

              if (data.rf.cats.length > 0) {
                var chart = c3.generate({
                  bindto: "#chart_rf",
                  size: {
                    height: 400
                  },
                  data: {
                    columns: data.rf.data,
                    types: {
                      size: "bar",
                      correlation: "area"
                    },
                    axes: {
                      size: "y",
                      correlation: "y2"
                    }
                  },
                  axis: {
                    y: {
                      label: "Data size"
                    },
                    y2: {
                      show: true,
                      min: 0,
                      max: 100,
                      label: "Correlation (%)"
                    },
                    x: {
                      type: "category",
                      categories: data.rf.cats,
                      label: "Factors"
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
              } else {
                $("#x_content_rf").html("<p>Data is inadequate.</p>");
              }
            } else {
              $("#x_content_rf").html("<p>No data is found.</p>");
            }

            if (data.ff === undefined) {
              $("#x_content_ff").html("<p>No data is found.</p>");
              return;
            }

            $("#x_content_ff").html(
              "<div id='chart_ff' style='height: 400px;'></div>"
            );

            D3Correlation("chart_ff", {
              dataset: data.ff
            });


            if (data.dataset !== undefined && data.dataset.length > 0) {
                $("#x_content_sp").html("<div id='chart_sp'>1</div>");

                var chart_sp = c3.generate({
                    bindto: '#chart_sp',
                    data: {
                        
                        columns: data.dataset,
                        type: 'scatter'
                    }
                });
            }
            console.log(data.regression_data)
            // correlation
            //if (data.regression_data !== undefined && data.regression_data.length > 0){
            $("#x_content_rg").html("<div id='chart_rg'>1</div>");
            make_chart(data.regression_data);
            //}

          },
          error: function(xhr, status, error) {
            $result.html("<p class='red'>" + error + "</p>");
          },
          complete: function() {
            $loader.hide();
            waitingAjax = false;
          }
        });
      });

      $("#outlier_correlation_ajax").submit();

      $(".outlier_batch_opt").change(function(e) {
        $("#outlier_correlation_ajax").submit();
      });
    }
  });
});



// correlation graph
function make_chart(data) {
  //console.log(line)
  var xs = {};
  xs[data['y_label'] + '/' + data['x_label']] = 'x_data';
  xs['Regression'] = 'x_fit';
  console.log(xs);
  var chart = c3.generate({
    bindto: "#chart_rg",
    data: {
      xs: xs,
      // iris data from R
      columns: [
        data['x_data'],
        data['y_data'],
        data['x_fit'],
        data['y_quad']
      ],
      type: 'scatter',
      types: {
        'x_fit': 'spline',
        'Regression': 'spline'
      }
    },
    axis: {
      x: {
        label: data['x_label'],
        tick: {
          fit: false
        }
      },
      y: {
        label: data['y_label']
      }
    }
  });
}