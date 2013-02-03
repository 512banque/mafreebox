$(document).ready(function() {
    function e(g, f) {
        for (i = 0; i < f.length; ++i) {
            if (g.indexOf(f.charAt(i)) >= 0) {
                return true
            }
        }
        return false
    }
    function a(f, g) {
        if (f == null) {
            return
        }
        f[0].str = g
    }
    function b(g, f) {
        user_forbidden = '"/\\[]:;|=,+*?<>\n';
        if (g.length > 104) {
            a(f, "Le nom d'utilisateur ne doit pas faire plus de 104 caractères.");
            return false
        }
        if (g.length < 1) {
            a(f, "Le nom d'utilisateur ne doit pas être vide.");
            return false
        }
        if (e(g, user_forbidden)) {
            a(f, "Le nom d'utilisateur ne doit pas contenir les caractères: \" / \\ [ ] : ; + * ? < >");
            return false
        }
        return true
    }
    function c(g, f) {
        password_forbidden = "\n";
        if (g.length > 14) {
            a(f, "Le mot de passe ne doit pas faire plus de 14 caractères.");
            return false
        }
        if (e(g, password_forbidden)) {
            return false
        }
        return true
    }
    function d(g, f, h) {
        netbios_forbidden = ' \\/:*?";|\t\n';
        if (g.length < 1) {
            a(f, h + " ne doit pas être vide.");
            return false
        }
        if (g.length > 15) {
            a(f, h + " ne doit pas faire plus de 15 caractères.");
            return false
        }
        if (e(g, netbios_forbidden)) {
            a(f, h + ' ne doit pas contenir les caractères espace et \\ / : ? " ; |');
            return false
        }
        return true
    }
    $("input:checkbox").checkbox();
    $("#form_config").rpcform({
        beforeSubmit: function(j, f) {
            var h = {};
            var g = f[0];
            if (!d($("#workgroup").val(), [h], "Le groupe de travail")) {
                sbar.error(null, h.str);
                return false
            }
            if (!b($("#logon_user").val(), [h])) {
                sbar.error(null, h.str);
                return false
            }
            if (!c($("#logon_password").val(), [h])) {
                sbar.error(null, h.str);
                return false
            }
            return true
        },
        success: function(f) {
            sbar.text("Configuration appliquée")
        },
        error: function(f) {
            sbar.error(null, "Impossible d'appliquer la configuration")
        }
    });
    $("#logon_enabled").click(function(g) {
        var h = g.target;
        var f = !h.checked;
        if (f) {
            $("#logon_fields").show()
        } else {
            $("#logon_fields").hide();
            if (!b($("#logon_user").val())) {
                $("#logon_user").val("freebox")
            }
            if (!c($("#logon_password").val())) {
                $("#logon_password").val("")
            }
        }
    })
});
