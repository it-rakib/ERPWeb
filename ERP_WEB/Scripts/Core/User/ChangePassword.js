var passProgress;
$(document).ready(function () {
    //for first login change pass hide menu
    if (!CurrentUser.IsSetPass) {
        $("#navSidebarMenu11").remove();
        $("#kendoMenu").remove();
        $(".liDashboard").remove();
    }//

    $("#btnChangePass").click(function () {
        ChangePasswordManager.ChangePassword();
    });
    passProgress = $("#passStrength").kendoProgressBar({
        type: "value",
        max: 9,
        animation: false,
        change: onChange
    }).data("kendoProgressBar");
    passProgress.progressStatus.text("");

    $("#txtNewPassword").keyup(function () {
        passProgress.value(this.value.length);
    });

    function onChange(e) {
        this.progressWrapper.css({
            "background-image": "none",
            "border-image": "none"
        });
        if (e.value < 1) {
           
            this.progressStatus.text("");
        } else if (e.value <= 3) {
          
            this.progressStatus.text("Weak");

            this.progressWrapper.css({
                "background-color": "#EE9F05",
                "border-color": "#EE9F05"
            });
        } else if (e.value <= 6) {
            this.progressStatus.text("Good");

            this.progressWrapper.css({
                "background-color": "#428bca",
                "border-color": "#428bca"
            });
        } else {
            this.progressStatus.text("Strong");

            this.progressWrapper.css({
                "background-color": "#8EBC00",
                "border-color": "#8EBC00"
            });
        }
    }
});
var ChangePasswordManager = {

    ChangePassword: function () {
        var curpassword = $("#txtCurrentPass").val();
        var newpassword = $('#txtNewPassword').val();
        var confirmpass = $('#txtReNewPass').val();

        if (newpassword != confirmpass) {
            AjaxManager.NotifyMsg("txtNewPassword", "error", "right", 2000, "Password does not match");
            AjaxManager.NotifyMsg("txtReNewPass", "error", "right", 2000, "Password does not match");
            $('#txtReNewPass').val('');
            $('#txtReNewPass').focus();
            return false;
        }
        if (ChangePasswordManager.Validator()) {
            var jsonParam = "curpassword=" + curpassword + "&newpassword=" + newpassword;
            var serviceURL = "../Home/PasswordChange";
            AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            if (jsonData == "Success") {
                AjaxManager.MsgBox('success', 'center', 'Success:', 'Password Changed Successfully',
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            CurrentUser = "";
                            var url = "../Home/Logoff";
                            window.location.href = url;
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('warning', 'center', 'Warning', jsonData,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
            }
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Failed', error,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
        }
    },
    Validator: function () {
        var rv = true;
        var curpassword = $("#txtCurrentPass").val();
        var newpassword = $('#txtNewPassword').val();
        var confirmpass = $('#txtReNewPass').val();
        if (curpassword.trim() === "") {
            AjaxManager.NotifyMsg("txtCurrentPass", "error", "right", 2000, "Required");
            rv = false;
        }
        if (newpassword.trim() === "") {
            AjaxManager.NotifyMsg("txtNewPassword", "error", "right", 2000, "Required");
            rv = false;
        }
        if (confirmpass.trim() === "") {
            AjaxManager.NotifyMsg("txtReNewPass", "error", "right", 2000, "Required");
            rv = false;
        }

        return rv;

    }

   
}