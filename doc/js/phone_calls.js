function delete_call(b) {
    var a = b;
    $.jsonrpc({
        method: "call.del",
        data: b,
        success: function() {
            $("#call-" + a).fadeOut()
        },
        error: function(c) {
            sbar.error(null, "Erreur lors de la suppression")
        }
    })
};
