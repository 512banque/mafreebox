$(document).ready(function() {
    $("#form_clear_sync_logs").formrpc({
        success: function() {
            $("#tbl_sync_logs tbody").empty()
        }
    })
});
