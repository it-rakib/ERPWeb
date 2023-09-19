var passProgress;
$(document).ready(function () {
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
        var curpassword = "";
        var newpassword = $('#txtNewPassword').val();
        var confirmpass = $('#txtReNewPass').val();

        if (newpassword != confirmpass) {
            alert("Password does not match");
            $('#txtReNewPass').val('');
            $('#txtReNewPass').focus();
            return false;
        }

        var jsonParam = "curpassword=" + curpassword + "&newpassword=" + newpassword;
        var serviceURL = "../Home/PasswordChange";
        AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData == "Success") {
                AjaxManager.MsgBox('success', 'center', 'Success:', 'Password Change Successfully',
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
                AjaxManager.MsgBox('error', 'center', 'Failed', jsonData,
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
    }

   
}