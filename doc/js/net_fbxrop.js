$(document).ready(function() {
    $("input:checkbox").checkbox();
    $("#form_config").rpcform({
        success: function(a) {
            sbar.text("Configuration appliquée")
        },
        error: function(a) {
            sbar.error(null, "Impossible d'appliquer la configuration")
        }
    });
    $("#fbxrop_enable_knob").click(function(b) {
        var c = b.target;
        var a = !c.checked;
        if (a) {
            $("#fbxrop_mdp_div").show()
        } else {
            $("#fbxrop_mdp_div").hide()
        }
    })
});
