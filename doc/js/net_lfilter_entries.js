$(document).ready(function() {
    $("input:checkbox").checkbox();
    $("#date_spec").hide();
    $("#time_spec").hide();
    $("#day_mode").change(function(b) {
        if ($(this).val() == "limit_mask") {
            $("#date_spec").show()
        } else {
            $("#date_spec").hide()
        }
    });
    $("#time_mode").change(function(b) {
        if ($(this).val() == "limit_range") {
            $("#time_spec").show()
        } else {
            $("#time_spec").hide()
        }
    });

    function a() {
        $(".form_remove_lan_filter").rpcform({
            success: function(b) {
                sbar.text("Filtre supprimé");
                $(this).parent().parent().next().remove();
                $(this).parent().parent().remove()
            },
            error: function(b) {
                sbar.error(null, b.errstr)
            }
        })
    }
    a();
    $("#lfilter_list").dynamiclist({
        jsonrpc: {
            method: "fw.lfilters_get"
        },
        ejs: {
            url: "tpl/lfilter_entry.ejs",
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
        interval: 0,
    }).bind("dynamiclist.new", function() {
        a()
    });
    $("#form_add_lan_filter").rpcform({
        beforeSubmit: function(d, b) {
            var c = b[0];
            if (ejs.trim(c.src_mac.value) && !check_mac(c.src_mac.value)) {
                sbar.error(null, "Adresse MAC incorrecte");
                return false
            }
            if (ejs.trim(c.src_ip.value)) {
                if (!check_ipv4(c.src_ip.value)) {
                    sbar.error(null, "Adresse IP incorrecte");
                    return false
                }
                if (!check_ipv4_in_network(c.src_ip.value, c.network.value, "255.255.255.0")) {
                    sbar.error(null, "L'adresse IP n'est pas dans votre réseau");
                    return false
                }
            }
            if (c.comment.value.length > 63) {
                sbar.error(null, "Commentaire trop long");
                return false
            }
            return true
        },
        success: function(b) {
            $(this).clearForm();
            sbar.text("Filtre ajoutée");
            $("#lfilter_list").dynamiclist("refresh")
        },
        error: function(b) {
            sbar.error(null, b.error)
        }
    })
});
