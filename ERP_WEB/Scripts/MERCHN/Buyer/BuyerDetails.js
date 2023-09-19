
var BuyerDetailsManager = {
    SaveBuyerDetails: function () {
        var msg = "";
        var objBuyer = BuyerDetailsHelper.CreateBuyerObject();
        var jsonParam = JSON.stringify(objBuyer);
        var serviceUrl = _baseUrl + "/api/Buyers/CreateUpdateBuyer";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdBuyerSummary").data("kendoGrid").dataSource.read();
                            BuyerDetailsHelper.ClearForm();
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
var BuyerDetailsHelper = {
    InitBuyerDetails: function () {
        MerchantHelper.LoadCountryCombo("cmbCountry");
        $("#btnSave").click(function () {
            BuyerDetailsManager.SaveBuyerDetails();
        });

        $("#btnClearAll").click(function () {
            BuyerDetailsHelper.ClearForm();
        });
    },
    FillBuyerForm: function (obj) {
        $("#hdnBuyerId").val(obj.BuyerId);
        $("#txtBuyerName").val(obj.BuyerName);
        $("#txtBuyerShortName").val(obj.BuyerShortName);
        $("#cmbCountry").data("kendoComboBox").value(obj.CountryId);
        if (obj.IsActive == true) {
            $("#chkIsActive").prop('checked', true)
        } else {
            $("#chkIsActive").prop('checked', false)
        };
    },

    CreateBuyerObject: function () {
        var obj = new Object();
        obj.BuyerId = $("#hdnBuyerId").val();
        obj.BuyerName = $("#txtBuyerName").val().trim();
        obj.BuyerShortName = $("#txtBuyerShortName").val().trim();
        obj.CountryId = $("#cmbCountry").data("kendoComboBox").value();
        obj.IsActive = $("#chkIsActive").is(":checked");
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnBuyerId").val("00000000-0000-0000-0000-000000000000");
        $("#txtBuyerName").val("");
        $("#txtBuyerShortName").val("");
        $("#cmbCountry").data("kendoComboBox").value("");
        $("#chkIsActive").prop('checked', false);
    }
};