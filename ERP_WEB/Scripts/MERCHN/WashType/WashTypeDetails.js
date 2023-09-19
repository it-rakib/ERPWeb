var validationSuccess = $("#validation-success");
var WashTypeDetailsManager = {
    SaveWashTypeDetails: function () {
        var msg = "";
        var objWashType = WashTypeDetailsHelper.CreateWashTypeObject();
        var jsonParam = JSON.stringify(objWashType);
        var serviceUrl = _baseUrl + '/api/WashTypes/CreateUpdateWashType';
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdWashTypeSummary").data("kendoGrid").dataSource.read();
                            WashTypeDetailsHelper.ClearForm();
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

var WashTypeDetailsHelper = {
    InitWashTypeDetails: function () {

        $("#btnSave").click(function () {
            WashTypeDetailsManager.SaveWashTypeDetails();
        });

        $("#btnClearAll").click(function () {
            WashTypeDetailsHelper.ClearForm();
        });
    },
    FillWashTypeForm: function (obj) {
        $("#hdnWashTypeId").val(obj.WashTypeId);
        $("#txtWashTypeName").val(obj.WashTypeName);
    },

    CreateWashTypeObject: function () {
        var obj = new Object();
        obj.WashTypeId = $("#hdnWashTypeId").val();
        obj.WashTypeName = $("#txtWashTypeName").val().trim();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnWashTypeId").val("00000000-0000-0000-0000-000000000000");
        $("#txtWashTypeName").val("");
    }
};