var periods = [null, "hour", "hour", "hour", "hour"];

function refresh(g, b, d, a) {
    var f = new Date().getTime();
    var c = "rrd.cgi?db=fbxios&port=" + b + "&dir=" + d + "&color1=" + a + "&w=300&h=150&period=" + periods[b] + "&ts=" + f + "";
    g.attr("src", c).load()
}
function refresh_graphs() {
    var a = $("#port_graphs_accordion").accordion("option", "active") + 1;
    for (i = 1; i <= 4; ++i) {
        if (i != a) {
            continue
        }
        refresh($("#graph_p" + i + "_tx"), i, "tx", "00ff00");
        refresh($("#graph_p" + i + "_rx"), i, "rx", "0000ff")
    }
}
function period_click(a) {
    var c = a.target;
    var b = $(c).attr("port_id");
    var d = $(c).attr("period");
    periods[b] = d;
    refresh_graphs()
}
$(document).ready(function() {
    $("#port_graphs_accordion").accordion({
        collapsible: true
    });
    $("#port_graphs_accordion").bind("accordionchange", function(a, b) {
        refresh_graphs()
    });
    $(".graph_period").click(period_click);
    setInterval(function() {
        refresh_graphs()
    }, 5000);
    refresh_graphs()
});
