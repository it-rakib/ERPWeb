var FabricTypeDetailsManager = {
    SaveFabricTypeDetails: function () {
        var msg = "";
        var objFabric = FabricTypeDetailsHelper.CreateFabricTypeObject();
        var jsonParam = JSON.stringify(objFabric);
        var serviceUrl = _baseUrl + "/api/MerchantFabricTypes/CreateUpdateMerchFabricType";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdFabricTypeSummary").data("kendoGrid").dataSource.read();
                            FabricTypeDetailsHelper.ClearForm();
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
var FabricTypeDetailsHelper = {
    InitFabrictypeDetails: function () {

        $("#btnSave").click(function () {
            FabricTypeDetailsManager.SaveFabricTypeDetails();
        });

        $("#btnClearAll").click(function () {
            FabricTypeDetailsHelper.ClearForm();
        });
    },
    FillFabricTypeForm: function (obj) {
        $("#hdnFabricTypeId").val(obj.FabricTypeId);
        $("#txtFabricType").val(obj.FabricType);
    },
    CreateFabricTypeObject: function () {
        var obj = new Object();
        obj.FabricTypeId = $("#hdnFabricTypeId").val();
        obj.FabricType = $("#txtFabricType").val().trim();
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnFabricTypeId").val("00000000-0000-0000-0000-000000000000");
        $("#txtFabricType").val("");
    }
}