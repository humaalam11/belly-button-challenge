// STEP 1: Get the samples_url endpoint
const samples_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// STEP 2: Initialize the function. Create dropdown. 
function init() {
    // Fetch the JSON data named "samples" and console log it
    let dropdownMenu = d3.select("#selDataset");
    d3.json(samples_url).then(function (samples) {
        console.log(samples);

        let labels = samples.names;

        for (let i = 0; i < labels.length; i++) {
            dropdownMenu.append("option").text(labels[i]).property("value", labels[i]);

        };
        let firstSample = labels[0];
        console.log(firstSample);
        charts(firstSample);
        buildtable(firstSample);
    });
}
init();

// STEP 3: Create function for metadata. Create the panel that displays the selected ID:
function buildtable(x) {
    d3.json(samples_url).then(function (samples) {
        let metadata = samples.metadata;
        console.log(metadata)
        results = metadata.filter(number => number.id == x);
        result = results[0];
        panel = d3.select("#sample-metadata");

        // Use panel.html('') to clear previous selected results in the panel
        panel.html('');

        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toLowerCase()}: ${value}`);
        });

    });

}
// STEP 4: Create Bar Graph and Bubble Plot using the data that is selected from the dropdown:
function charts(x) {
    d3.json(samples_url).then(function (samples) {
        let samples1 = samples.samples;
        results = samples1.filter(number => number.id == x);
        result = results[0];

        // Now that we are in the sample section of the data, we will filter into the 3 keys for the data we need:
        let samplesValues = result.sample_values; //Filter 1: samples_values
        let otuIds = result.otu_ids; // Filter 2: otu_ids
        let otuLabels = result.otu_labels; // Filter 3: otu_labels

        let otu_Order_Data = otuIds.slice(0, 10).map(y => `OTU ${y}`).reverse(); // Slicing otu_ids top 10, and ".map" for formatting

        // Creating the Bar Graph, Slicing the Top 10 values and Displaying in desending order:
        let trace1 = {
            x: samplesValues.slice(0, 10).reverse(), //using the variables earlier to plug into the x and y axis
            y: otu_Order_Data,
            text: otuLabels.slice(0, 10).reverse(), // creating hover text over each bar in the graph
            type: "bar",
            orientation: "h"
        };

        let traceData = [trace1];

        let layout = {
            title: "Top 10 Bacterias",
            margin: {
                l: 150,
                t: 30
            }
        };

        Plotly.newPlot("bar", traceData, layout);

        // Creating Bubble Plot for all the data (no, slicing):
        let trace2 = {
            x: otuIds,
            y: samplesValues,
            mode: 'markers',
            marker: {
                color: otuIds,
                text: otuLabels,
                size: samplesValues,
                colorscale: "Earth"
            }
        };

        let traceData2 = [trace2];

        let layout2 = {
            showlegend: false,
            xaxis: {
                title: 'OTU ID' // Label the x-axis
            },
            height: 600,
            width: 1000
        };

        Plotly.newPlot('bubble', traceData2, layout2);
    }
    )
}


function optionChanged(params) {
    charts(params);
    buildtable(params);

}
