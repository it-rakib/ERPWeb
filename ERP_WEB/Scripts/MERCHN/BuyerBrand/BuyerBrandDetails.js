
var BrandDetailsManager = {
    SaveBrandDetails: function () {
        var msg = "";
        var objBrand = BrandDetailsHelper.CreateBrandObject();
        var jsonParam = JSON.stringify(objBrand);
        var serviceUrl = _baseUrl + "/api/BuyerBrands/CreateUpdateBuyerBrand";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdBrandSummary").data("kendoGrid").dataSource.read();
                            BrandDetailsHelper.ClearForm();
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
var BrandDetailsHelper = {
    InitBrandDetails: function () {
        MerchantHelper.LoadBuyerCombo("cmbBuyer");

        $("#btnSave").click(function () {
            BrandDetailsManager.SaveBrandDetails();
        });

        $("#btnClearAll").click(function () {
            BrandDetailsHelper.ClearForm();
        });
    },
    FillBrandForm: function (obj) {
        $("#hdnBrandId").val(obj.BrandId);
        $("#txtBrandName").val(obj.BrandName);
        $("#cmbBuyer").data("kendoComboBox").value(obj.BuyerId);
    },

    CreateBrandObject: function () {
        var obj = new Object();
        obj.BrandId = $("#hdnBrandId").val();
        obj.BuyerBrandName = $("#txtBrandName").val().trim();
        obj.BuyerId = $("#cmbBuyer").data("kendoComboBox").value();
        return obj;
    },


    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnBrandId").val("00000000-0000-0000-0000-000000000000");
        $("#txtBrandName").val("");
        $("#cmbBuyer").data("kendoComboBox").value("");
    }
};