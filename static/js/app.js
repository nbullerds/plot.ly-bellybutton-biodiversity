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
        // var newData = data.filter(d => {
        //     return d. === 6
        //   })
        // buildDashboard(newData);
        var filterIndex = data.names.indexOf(newId.toString());
        console.log(filterIndex);

        var metadata = data.metadata[filterIndex];
        var samples = data.samples[filterIndex];
        buildDashboard(metadata, samples);
    });

    function buildDashboard(metadata, samples){
        console.log(samples);

        // Fill summary demographic information
        var metadataList = d3.select("#sample-metadata");
        metadataList.html("");
        for (key in metadata){
            metadataList.append("p").text(key +": " + metadata[key]);
        }

        // set x values for bar graph
        x = samples.sample_values.slice(0,10);

        // Set y values for bar graph
        y = samples.otu_ids.slice(0,10);
        console.log(y);
        for(var i=0;i<y.length;i++){
            y[i]="OTU "+y[i];
        }

        //Set hover over text values
        text = samples.otu_labels.slice(0,10);

        // Create bar chart using x and y data
        var trace = [{
            type: 'bar',
            x: x,
            y: y,
            text: text,
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