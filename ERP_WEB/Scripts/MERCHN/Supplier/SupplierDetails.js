var SupplierDetailsManager = {
    SaveSupplierDetails: function () {
        var msg = "";
        var objSupplier = SupplierDetailsHelper.CreateSupplierObject();
        var jsonParam = JSON.stringify(objSupplier);
        var serviceUrl = _baseUrl + "/api/Suppliers/CreateUpdateSupplier";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdSupplierSummary").data("kendoGrid").dataSource.read();
                            SupplierDetailsHelper.ClearForm();
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
var SupplierDetailsHelper = {
    InitSupplierDetails: function () {
        MerchantHelper.LoadCountryCombo("cmbCountry");

        $("#btnSave").click(function () {
            SupplierDetailsManager.SaveSupplierDetails();
        });

        $("#btnClearAll").click(function () {
            SupplierDetailsHelper.ClearForm();
        });
    },
    FillSupplierForm: function (obj) {
        $("#hdnSupplierId").val(obj.SupplierId);
        $("#txtSupplierName").val(obj.SupplierName);
        $("#txtSupplierShortName").val(obj.SupplierShortName);
        $("#cmbCountry").data("kendoComboBox").value(obj.CountryId);
    },
    CreateSupplierObject: function () {
        var obj = new Object();
        obj.SupplierId = $("#hdnSupplierId").val();
        obj.SupplierName = $("#txtSupplierName").val().trim();
        obj.SupplierShortName = $("#txtSupplierShortName").val().trim();
        obj.CountryId = $("#cmbCountry").data("kendoComboBox").value();
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnSupplierId").val("00000000-0000-0000-0000-000000000000");
        $("#txtSupplierName").val("");
        $("#txtSupplierShortName").val("");
        $("#cmbCountry").data("kendoComboBox").value("");
    }
}