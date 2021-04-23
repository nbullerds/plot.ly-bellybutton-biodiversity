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
        var metadataList = d3.select("#sample-metadata");
        for (key in metadata){
            metadataList.append("p").text(key +": " + metadata[key]);
        }
    }
});