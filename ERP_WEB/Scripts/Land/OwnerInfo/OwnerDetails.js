
var OwnerDetailsManager = {
    SaveOwnerDetails: function () {
        var msg = "";
        debugger;
        var objOwner = OwnerDetailsHelper.CreateOwnerObject();
        var jsonParam = JSON.stringify(objOwner);
        var serviceUrl = _baseUrlLand + "/api/OwnerInfo/CreateUpdateLandOwner";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdOwnerSummary").data("kendoGrid").dataSource.read();
                            OwnerDetailsHelper.ClearForm();
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
}

var OwnerDetailsHelper = {
    InitOwnerDetails: function () {
        $("#btnSave").click(function () {
            OwnerDetailsManager.SaveOwnerDetails();
        });
        $("#btnClearAll").click(function () {
            OwnerDetailsHelper.ClearForm();
        });
    },
    CreateOwnerObject: function () {
        debugger;
        var obj = new Object();
        obj.OwnerInfoId = $("#hdnOwnerInfoId").val();
        obj.OwnerInfoName = $("#txtOwnerInfoName").val();
        obj.IsCompany = $("#chkIsCompany").is(":checked");
        obj.IsActive = $("#chkIsActive").is(":checked");
        return obj;
    },
    FillOwnerForm: function (obj) {
        $("#hdnOwnerInfoId").val(obj.OwnerInfoId);
        $("#txtOwnerInfoName").val(obj.OwnerInfoName);
        if (obj.IsCompany == true) {
            $("#chkIsCompany").prop('checked', true);
        } else {
            $("#chkIsCompany").prop('checked', false);
        };
        if (obj.IsActive == true) {
            $("#chkIsActive").prop('checked', true);
        } else {
            $("#chkIsActive").prop('checked', false);
        };
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnOwnerInfoId").val("00000000-0000-0000-0000-000000000000");
        $("#txtOwnerInfoName").val("");
        $("#chkIsCompany").prop('checked', false);
        $("#chkIsActive").prop('checked', false);
    },
    FillOwnerFormDelete: function (obj) {
        $("#hdnOwnerInfoId").val(obj.OwnerInfoId);
        $("#txtOwnerInfoName").val(obj.OwnerInfoName);        
        if (obj.IsCompany == true) {
            $("#chkIsCompany").prop('checked', true);
        } else {
            $("#chkIsCompany").prop('checked', false);
        };
        $("#chkIsActive").prop('checked', false);
    },
}