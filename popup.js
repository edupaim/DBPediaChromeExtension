chrome.tabs.executeScript({
    code: "window.getSelection().toString();"
}, function (selection) {
    document.getElementById("output").innerHTML = selection[0];
});

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
    document.getElementById("result").innerHTML = status + " (See console.)";
    console.log("error");
    console.log(xhr);
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
    document.getElementById("result").innerHTML = html;
}
bioportal.query(query_string).done(onSuccess).error(onFailure);