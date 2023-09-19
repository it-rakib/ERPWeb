var validationSuccess = $("#validation-success");
var ProductCategoryDetailsManager = {
    SaveProductCategoryDetails: function () {
        var msg = "";
        var objProductCategory = ProductCategoryDetailsHelper.CreateProductCategoryObject();
        var jsonParam = JSON.stringify(objProductCategory);
        var serviceUrl = _baseUrl + "/api/MerchProductCategory/CreateUpdateMerchProductCategory";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdProductCategorySummary").data("kendoGrid").dataSource.read();
                            ProductCategoryDetailsHelper.ClearForm();
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
var ProductCategoryDetailsHelper = {
    InitProductCategoryDetails: function () {

        $("#btnSave").click(function () {
            ProductCategoryDetailsManager.SaveProductCategoryDetails();
        });

        $("#btnClearAll").click(function () {
            ProductCategoryDetailsHelper.ClearForm();
        });
    },
    FillProductCategoryForm: function (obj) {
        $("#hdnProductCategoryId").val(obj.ProductCategoryId);
        $("#txtProductCategoryName").val(obj.ProductCategoryName);
    },
    CreateProductCategoryObject: function () {
        var obj = new Object();
        obj.ProductCategoryId = $("#hdnProductCategoryId").val();
        obj.ProductCategoryName = $("#txtProductCategoryName").val().trim();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnProductCategoryId").val("00000000-0000-0000-0000-000000000000");
        $("#txtProductCategoryName").val("");
    }
}