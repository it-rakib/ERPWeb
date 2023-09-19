var MerchProductTypeDetailsManager = {
    SaveMerchProductTypeDetails: function () {
        var msg = "";
        var objProduct = ProductTypeDetailsHelper.CreateMerchProductTypeObject();
        var jsonParam = JSON.stringify(objProduct);
        var serviceUrl = _baseUrl + "/api/MerchProductType/CreateUpdateMerchProductType";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdProductTypeSummary").data("kendoGrid").dataSource.read();
                            ProductTypeDetailsHelper.ClearForm();
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
var ProductTypeDetailsHelper = {
    InitProductTypeDetails: function () {

        $("#btnSave").click(function () {
            MerchProductTypeDetailsManager.SaveMerchProductTypeDetails();
        });

        $("#btnClearAll").click(function () {
            ProductTypeDetailsHelper.ClearForm();
        });
    },
    FillMerchProductTypeForm: function (obj) {
        $("#hdnProductTypeId").val(obj.ProductTypeId);
        $("#txtProductTypeName").val(obj.ProductTypeName);
    },
    CreateMerchProductTypeObject: function () {
        var obj = new Object();
        obj.ProductTypeId = $("#hdnProductTypeId").val();
        obj.ProductTypeName = $("#txtProductTypeName").val().trim();
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnProductTypeId").val("00000000-0000-0000-0000-000000000000");
        $("#txtProductTypeName").val("");
    }
};