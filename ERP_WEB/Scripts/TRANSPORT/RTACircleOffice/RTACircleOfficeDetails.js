var CircleOfficeDetailsManager = {
    SaveOfficeDetails: function () {
        var msg = "";
        var objBuyer = OfficeDetailsHelper.CreateOfficeObject();
        var jsonParam = JSON.stringify(objBuyer);
        var serviceUrl = _baseUrlTransport + "/api/RTACircleOffice/CreateUpdateRTACircleOffice";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdOfficeSummary").data("kendoGrid").dataSource.read();
                            OfficeDetailsHelper.ClearForm();
                        }
                    }]);
            }
            else {
                msg = jsonData.Message;
                AjaxManager.MsgBox('error', 'center', 'Error1', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    }
};
var OfficeDetailsHelper = {
    InitOfficeDetails: function () {
        $("#btnSave").click(function () {
            CircleOfficeDetailsManager.SaveOfficeDetails();
        });

        $("#btnClearAll").click(function () {
            OfficeDetailsHelper.ClearForm();
        });
    },
    FillOfficeForm: function (obj) {
        $("#hdnOfficeId").val(obj.RtacircleOfficeId);
        $("#txtOfficeName").val(obj.RtacircleOfficeName);
        if (obj.IsActive == true) {
            $("#chkIsActive").prop('checked', true)
        } else {
            $("#chkIsActive").prop('checked', false)
        };
    },

    CreateOfficeObject: function () {
        debugger;
        var obj = new Object();
        obj.RtacircleOfficeId = $("#hdnOfficeId").val();
        obj.RtacircleOfficeName = $("#txtOfficeName").val().trim();
        obj.IsActive = $("#chkIsActive").is(":checked");
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnOfficeId").val("0");
        $("#txtOfficeName").val("");
        $("#chkIsActive").prop('checked', false);
    }
};