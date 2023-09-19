var ComGroupLcDetailsManager = {
    SaveComGroupLcDetails: function () {
        var msg = "";
        var validator = $("#divComGroupLcDetails").kendoValidator().data("kendoValidator"),
            status = $(".status");
        if (validator.validate()) {
            var objComGroupLc = ComGroupLcDetailsHelper.CreateComGroupLcObject();
            var jsonParam = JSON.stringify(objComGroupLc);
            var serviceUrl = _baseUrl + "/api/ComGroupLc/CreateUpdateComGroupLc";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdComGroupLcSummary").data("kendoGrid").dataSource.read();
                            ComGroupLcDetailsHelper.ClearForm();
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
};
var ComGroupLcDetailsHelper = {
    InitComGroupLcDetails: function () {
        MerchantHelper.LoadCompanyCombo("cmbCompany");
        MerchantHelper.LoadBuyerCombo("cmbBuyer");
        $("#btnSave").click(function () {
            ComGroupLcDetailsManager.SaveComGroupLcDetails();
        });

        $("#btnClearAll").click(function () {
            ComGroupLcDetailsHelper.ClearForm();
        });
    },
    FillComGroupLcForm: function (obj) {
        $("#hdnGroupLcid").val(obj.GroupLcid);
        $("#cmbCompany").data("kendoComboBox").value(obj.CompanyId);
        $("#cmbBuyer").data("kendoComboBox").value(obj.BuyerId);
        $("#nmbGroupAmount").val(obj.GroupAmount);
        $("#nmbUsedAmount").val(obj.UsedAmount);
        //$("#txtCompanyIdentered").val(obj.CompanyIdentered);
        //$("#txtCompanyIdlastUpdated").val(obj.CompanyIdlastUpdated);
        if (obj.IsAllBuyer == true) {
            $("#chkIsAllBuyer").prop('checked', true)
        } else {
            $("#chkIsAllBuyer").prop('checked', false)
        };

    },
    CreateComGroupLcObject: function () {
        var obj = new Object();
        obj.GroupLcid = $("#hdnGroupLcid").val();
        obj.CompanyId = $("#cmbCompany").data("kendoComboBox").value();
        obj.BuyerId = $("#cmbBuyer").data("kendoComboBox").value();
        obj.GroupAmount = $("#nmbGroupAmount").val();
        obj.UsedAmount = $("#nmbUsedAmount").val();
        //obj.CompanyIdentered = $("#txtCompanyIdentered").val();
        //obj.CompanyIdlastUpdated = $("#txtCompanyIdlastUpdated").val();
        obj.IsAllBuyer = $("#chkIsAllBuyer").is(":checked");
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnGroupLcid").val("00000000-0000-0000-0000-000000000000");
        $("#cmbCompany").data("kendoComboBox").value("");
        $("#cmbBuyer").data("kendoComboBox").value("");
        $("#nmbGroupAmount").val("");
        $("#nmbUsedAmount").val("");
        //$("#txtCompanyIdentered").val("");
        //$("#txtCompanyIdlastUpdated").val("");
        $("#chkIsAllBuyer").prop('checked', false);
    },
}