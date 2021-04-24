d3.json("samples.json").then((data) => {

    console.log(data);

    //update Test Subject ID dropdown
    var ids = data.names
    var idlist = d3.select("#selDataset");
    ids.forEach(d => {
        idlist.append("option").text(d);
    });

    d3.select('#selDataset').on('change', function() {
        var newId = eval(d3.select(this).property('value'));

        var filterIndex = data.names.indexOf(newId.toString());
        console.log(filterIndex);

        var metadata = data.metadata[filterIndex];
        var samples = data.samples[filterIndex];
        buildDashboard(metadata, samples);
    });

    function buildDashboard(metadata, samples){
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
                color: otu_ids
            }
        };
            
        var data = [trace1];
            
        var layout = {
            showlegend: false
        };
            
        Plotly.newPlot('bubble', data, layout);

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