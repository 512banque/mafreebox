$(document).ready(function() {
    $("input:checkbox").checkbox();
    $("#form_config").rpcform({
        success: function(a) {
            sbar.text("Modifications effectuées")
        },
        error: function(a) {
            $(this).resetForm();
            sbar.error(null, a.error)
        }
    })
});
