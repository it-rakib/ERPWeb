var MerchProductDetailsManager = {
    SaveMerchProductDetails: function () {
        var msg = "";
        var objProduct = MerchProductDetailsHelper.CreateMerchProductObject();
        var jsonParam = JSON.stringify(objProduct);
        var serviceUrl = _baseUrl + "/api/MerchProducts/CreateUpdateMerchProduct";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdProductSummary").data("kendoGrid").dataSource.read();
                            MerchProductDetailsHelper.ClearForm();
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
var MerchProductDetailsHelper = {
    InitMerchProductDetails: function () {
        MerchantHelper.LoadProductCategoryCombo("cmbProduct");

        $("#btnSave").click(function () {
            MerchProductDetailsManager.SaveMerchProductDetails();
        });

        $("#btnClearAll").click(function () {
            MerchProductDetailsHelper.ClearForm();
        });
    },
    FillMerchProductForm: function (obj) {
        $("#hdnProductId").val(obj.ProductId);
        $("#txtProductName").val(obj.ProductName);
        $("#cmbProduct").data("kendoComboBox").value(obj.ProductCategoryId);
    },

    CreateMerchProductObject: function () {
        var obj = new Object();
        obj.ProductId = $("#hdnProductId").val();
        obj.ProductName = $("#txtProductName").val().trim();
        obj.ProductCategoryId = $("#cmbProduct").data("kendoComboBox").value();
        // obj.IsActive = 1;
        return obj;
    },


    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnProductId").val("00000000-0000-0000-0000-000000000000");
        $("#txtProductName").val("");
        $("#cmbProduct").data("kendoComboBox").value("");
    }
};