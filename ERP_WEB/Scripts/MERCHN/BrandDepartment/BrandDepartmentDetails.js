var BrandDepartmentDetailsManager = {
    SaveBrandDepartmentDetails: function () {
        var msg = "";
        var objDepartment = BrandDepartmentDetailsHelper.CreateBrandDepartmentObject();
        var jsonParam = JSON.stringify(objDepartment);
        var serviceUrl = _baseUrl + "/api/BrandDepartments/CreateUpdateBrandDepartment";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdDepartmentSummary").data("kendoGrid").dataSource.read();
                            BrandDepartmentDetailsHelper.ClearForm();
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
    },
    GetBrandByBuyerId: function (buyerId) {
        debugger;
        var objBrand = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/BuyerBrands/brands/" + buyerId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objBrand = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objBrand;
    },
};
var BrandDepartmentDetailsHelper = {
    InitBrandDepartmentDetails: function () {
        MerchantHelper.LoadBuyerCombo("cmbBuyer");
        BrandDepartmentDetailsHelper.LoadBrandCombo("cmbBrand");
        $("#btnSave").click(function () {
            BrandDepartmentDetailsManager.SaveBrandDepartmentDetails();
        });

        $("#btnClearAll").click(function () {
            BrandDepartmentDetailsHelper.ClearForm();
        });
        $("#cmbBuyer").change(function () {
            debugger;
            BrandDepartmentDetailsHelper.ChangeEventOfBuyerCombo();
        });
    },
    FillBrandDepartmentForm: function (obj) {
        $("#hdnDepartmentId").val(obj.DepartmentId);
        $("#txtDepartmentName").val(obj.BuyerDepartmentName);
        $("#cmbBuyer").data("kendoComboBox").value(obj.BuyerId);

        var data = BrandDepartmentDetailsManager.GetBrandByBuyerId(obj.BuyerId);
        var brandCombo = $("#cmbBrand").data("kendoComboBox");
        brandCombo.value("");
        brandCombo.text("");
        brandCombo.setDataSource(data);

        $("#cmbBrand").data("kendoComboBox").value(obj.BrandId);
        
    },
    CreateBrandDepartmentObject: function () {
        var obj = new Object();
        obj.DepartmentId = $("#hdnDepartmentId").val();
        obj.BuyerDepartmentName = $("#txtDepartmentName").val().trim();
        obj.BuyerId = $("#cmbBuyer").data("kendoComboBox").value();
        obj.BrandId = $("#cmbBrand").data("kendoComboBox").value();
        // obj.IsActive = 1;
        return obj;
    },
    LoadBrandCombo(cboId) {
        UtilityHelper.LoadCombo(cboId, "BrandId", "BuyerBrandName", [], "--Select Brand--");
    },

    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnDepartmentId").val("00000000-0000-0000-0000-000000000000");
        $("#txtDepartmentName").val("");
        $("#cmbBuyer").data("kendoComboBox").value("");
        $("#cmbBrand").data("kendoComboBox").value("");
    },
    ChangeEventOfBuyerCombo: function () {
        debugger;
        var buyerId = $("#cmbBuyer").data("kendoComboBox").value();
        var data = BrandDepartmentDetailsManager.GetBrandByBuyerId(buyerId);
        var brandCombo = $("#cmbBrand").data("kendoComboBox");
        brandCombo.value("");
        brandCombo.text("");
        brandCombo.setDataSource(data);
    }
}