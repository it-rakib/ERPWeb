var isDelete = false;
var ConditionDetailsManager = {
    SaveConditionDetails: function () {
        var msg = "";
        var objCondition = ConditionDetailsHelper.CreateConditionObject();
        var jsonParam = JSON.stringify(objCondition);
        var serviceUrl = _baseUrlTransport + "/api/VehicleCondition/CreateUpdateVehicleCondition";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdConditionSummary").data("kendoGrid").dataSource.read();
                            ConditionDetailsHelper.ClearForm();
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
var ConditionDetailsHelper = {
    InitConditionDetails: function () {
        $("#btnSave").click(function () {
            ConditionDetailsManager.SaveConditionDetails();
        });

        $("#btnClearAll").click(function () {
            ConditionDetailsHelper.ClearForm();
        });
    },
    FillConditionForm: function (obj) {
        $("#hdnConditionId").val(obj.VehicleConditionId);
        $("#txtConditionName").val(obj.VehicleConditionName);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
    },

    CreateConditionObject: function () {
        debugger;
        var obj = new Object();
        obj.VehicleConditionId = $("#hdnConditionId").val();
        obj.VehicleConditionName = $("#txtConditionName").val().trim();
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnConditionId").val("0");
        $("#txtConditionName").val("");
        $("#chkIsDeleted").prop('checked', false);
    }
};