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
        "SELECT ?album ?artist WHERE {",
        "?album dbo:artist ?artist .",
        "} LIMIT 10"
    ].join(" ");
    //url for the query
    var url = "http://dbpedia.org/sparql";
    var queryUrl = url + "?query=" + encodeURIComponent(query);
    //query call
    httpGetAsync(queryUrl);


    /*SPARQL = function (o) {
        this.apiKey = o.apikey;
        this.endpoint = o.endpoint;
        this.query = function (q) {
            chrome.extension.getBackgroundPage().console.log("Ajax!");
            return $.ajax({
                url: this.endpoint,
                accepts: { json: "application/sparql-results+json" },
                data: { query: q, apikey: this.apiKey },
                dataType: "json"
            });
        };
    };
    var bioportal = new SPARQL({
        apikey: "YOUR-API-KEY-HERE",
        endpoint: "http://sparql.bioontology.org/sparql/"
    });
    var query_string = "PREFIX omv: <http://omv.ontoware.org/2005/05/ontology#>\n\
                        SELECT ?ont ?name ?acr \n\
                        WHERE { \n\
                           ?ont a omv:Ontology .  \n\
                           ?ont omv:acronym ?acr.  \n\
                           ?ont omv:name ?name .\n\
                           FILTER (str(?acr)='SNOMEDCT')\n\
                        }";
    function onFailure(xhr, status) {
        document.getElementById("output").innerHTML = status + " (See console.)";
    }
    function onSuccess(json) {
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
    }
    chrome.extension.getBackgroundPage().console.log(bioportal);
    bioportal.query(query_string)
        .done(onSuccess)
        .fail(onFailure);*/
});
