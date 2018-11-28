chrome.tabs.executeScript({
    code: "window.getSelection().toString();"
}, function (selection) {
    document.getElementById("output").innerHTML = selection && selection[0];
    //async request to the url -> print the result
    function httpGetAsync(theUrl) {
        $.ajax({
            url: theUrl,
            data: {
                format: 'json'
            },
            error: function () {
                document.getElementById("output").innerHTML = status + " (See console.)";
            },
            dataType: 'json',
            success: function (json) {
                var html = "<table border='1'>";
                for (var b in json.results.bindings) {
                    html += "<tr>";
                    for (var x in json.head.vars) {
                        var value = json.results.bindings[b][json.head.vars[x]];
                        if (value.type == "uri")
                            html += "<td><a href='" + value.value + "'>" + value.value + "</a></td>";
                        else
                            html += "<td>" + value.value + "</td>";
                    }
                    html += "</tr>";
                }
                html += "</table>";
                document.getElementById("output").innerHTML = html;
            },
            type: 'GET'
        });
    }
    //sparql query
    var query = [
        "PREFIX dbo: <http://dbpedia.org/ontology/>",
        "SELECT ?t ?p WHERE {",
        "dbr:"+selection[0]+" ?t ?p .",
        "}"
    ].join(" ");
    //url for the query
    var url = "http://dbpedia.org/sparql";
    var queryUrl = url + "?query=" + encodeURIComponent(query);
    //query call
    httpGetAsync(queryUrl);
});
