function buildMetadata(sample) {

  let url = `/metadata/${sample}`;
  let sampleData = d3.select("#sample-metadata");

  sampleData.html("");

  d3.json(url).then(data => {
    // console.log(data);
    let row = sampleData.append("p");
    Object.entries(data).forEach(([key, value]) => {
    let entry = row.append("p")
    entry.html(`${key}: ${value}`);
  });
});
};
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

  let url = `/samples/${sample}`;
  let pieChart = d3.select("#pie");

  pieChart.html("")

  d3.json(url).then(data => {
    let otu_ids = data.otu_ids;
    let sample_values = data.sample_values;
    let otu_labels = data.otu_labels;

    console.log(otu_ids);
    console.log(sample_values);
    console.log(otu_labels);

    let barData = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      type: 'pie'
    }];

    let layout = {
      title: `Bacteria Pie Chart`,
      showlegend: true,
      height: 500,
      width: 700
    };
    
    Plotly.newPlot('pie', barData, layout);


    let trace1 = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      },
      type: 'scatter',
      text: otu_labels
    }];

    let layout2 = {
      title: `Bacteria Bubble Chart`,
      yaxis: {
        autorange: true
      },
      xaxis: {
        autorange: true,
        title: `OTU ID`
      },
      showlegend: true,
      height: 500,
      width: 900
    };

    Plotly.newPlot('bubble', trace1, layout2);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    // console.log(firstSample);
    // console.log(sampleNames);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
