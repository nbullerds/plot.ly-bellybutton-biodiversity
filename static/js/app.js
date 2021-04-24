d3.json("samples.json").then((data) => {

    //Populate Test Subject ID dropdown
    var ids = data.names
    var idlist = d3.select("#selDataset");
    ids.forEach(d => {
        idlist.append("option").text(d);
    });

    // On dropdown selection, re-build dashboard given new selection
    d3.select('#selDataset').on('change', function() {
        var newId = eval(d3.select(this).property('value'));

        var filterIndex = data.names.indexOf(newId.toString());

        var metadata = data.metadata[filterIndex];
        var samples = data.samples[filterIndex];
        buildDashboard(metadata, samples);
    });

    // Called at initialization and when new sample dropdown is selected
    // Input: metadata and sample of selected value
    // Output: N/A.  Uses data to build graphs and populate panel
    function buildDashboard(metadata, samples){
        console.log(metadata);
        console.log(samples);
        //__________DEMOGRAPHIC INFO PANEL__________//
        // Populate summary demographic information
        var metadataList = d3.select("#sample-metadata");
        metadataList.html("");
        for (key in metadata){
            metadataList.append("p").text(key +": " + metadata[key]);
        }

        //__________BUBBLE CHART__________//
        var sample_values = samples.sample_values;
        var otu_ids = samples.otu_ids;
        var otu_lables = samples.otu_labels;

        // make hover text slightly more readable
        for(var i=0; i<otu_lables.length; i++) {
            otu_lables[i] = otu_lables[i].replaceAll(';','  ');
        }

        var trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_lables,
            mode: 'markers',
            marker: {
                size: sample_values.map(d => d * .7),
                color: otu_ids,
                colorscale: 'Jet'
            }
        };
            
        var data = [trace1];
            
        var layout = {
            showlegend: false
        };
            
        Plotly.newPlot('bubble', data, layout);

        //__________GAUGE CHART__________//

        var data = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: metadata.wfreq,
            title: { text: "<b>Bellybutton Washing Frequency</b><br>" + "Scrubs per Week"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [0, 1], color:'#ffffff', label: "0-1"},
                    { range: [1, 2], color:'#e6ffe6'},
                    { range: [2, 3], color:'#ccffcc'},
                    { range: [3, 4], color:'#99ff99'},
                    { range: [4, 5], color:'#00ff00'},
                    { range: [5, 6], color:'#00e600'},
                    { range: [6, 7], color:'#00b300'},
                    { range: [7, 8], color:'#009900'},
                    { range: [8, 9], color:'#008000'},
                ]
            }
        }];
        Plotly.newPlot('gauge', data);

        //__________BAR CHART__________//
        // set x values for bar graph
        sample_values = sample_values.slice(0,10);

        // Set y values for bar graph
        otu_ids = otu_ids.slice(0,10);

        // Convert y values to string and add OTU as a prefix
        for(var i=0; i<otu_ids.length; i++) {
            otu_ids[i] = "OTU "+ otu_ids[i];
        }

        //Set hover over text values
        otu_lables = otu_lables.slice(0,10);

        // Create bar chart using x and y data
        var trace = [{
            type: 'bar',
            x: sample_values,
            y: otu_ids,
            text: otu_lables,
            hoverinfo: "text",
            orientation: 'h'
          }];

        var layout = {
            yaxis:{autorange:'reversed'}
        } 
        Plotly.newPlot('bar', trace, layout);
    }

    //create default visualization on page load
    buildDashboard(data.metadata[0], data.samples[0]);
});