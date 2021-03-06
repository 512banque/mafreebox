$(document).ready(function() {
    function a() {
        $(".form_del_wan_redir").rpcform({
            success: function(b) {
                sbar.text("Redirection supprimée");
                $(this).parent().parent().remove()
            },
            error: function(b) {
                sbar.error(null, b.error)
            }
        })
    }
    a();
    $("#redirs_list tbody").dynamiclist({
        jsonrpc: {
            method: "fw.wan_redirs_get"
        },
        ejs: {
            url: "tpl/fw_wan_redir.ejs",
            data: function(b) {
                return {
                    v: b
                }
            }
        },
        key: "id",
        jsonfield: function(b) {
            return b
        },
        interval: 0
    }).bind("dynamiclist.new", function() {
        a()
    });
    $("#form_add_wan_redir").rpcform({
        beforeSubmit: function(d, b) {
            var c = b[0];
            if (!check_ipv4(c.lan_ip.value)) {
                sbar.error(null, "Adresse IP incorrecte");
                return false
            }
            if (!check_port(c.wan_port.value)) {
                sbar.error(null, "Port externe incorrect");
                return false
            }
            if (!check_port(c.lan_port.value)) {
                sbar.error(null, "Port interne incorrect");
                return false
            }
            if (!check_ipv4_in_network(c.lan_ip.value, c.network.value, "255.255.255.0")) {
                sbar.error(null, "L'adresse IP n'est pas dans votre réseau");
                return false
            }
            if (c.comment.value.length > 63) {
                sbar.error(null, "Commentaire trop long");
                return false
            }
            return true
        },
        success: function(b) {
            $(this).clearForm();
            sbar.text("Redirection ajoutée");
            $("#redirs_list tbody").dynamiclist("refresh")
        },
        error: function(b) {
            sbar.error(null, b.error)
        }
    })
});
