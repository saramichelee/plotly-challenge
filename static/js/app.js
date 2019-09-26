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
    let otu_ids = data.otu_ids.slice(0,10);
    let sample_values = data.sample_values.slice(0,10);
    let otu_labels = data.otu_labels.slice(0,10);
    console.log(otu_ids);
    console.log(sample_values);
    console.log(otu_labels);
    let barData = [{
      values: sample_values,
      labels: otu_ids,
      text: otu_labels,
      type: "pie"
    }];
    Plotly.plot("pie",barData);

    let trace1 = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values
      }
    }];

    Plotly.newPlot('scatter', trace1);

  });

  

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
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
    // buildCharts(firstSample);
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
