var CmnBankDetailsManager = {
    SaveCmnBankDetails: function () {
        var msg = "";
        var validator = $("#divCmnBankDetails").kendoValidator().data("kendoValidator"),
            status = $(".status");
        if (validator.validate()) {
            var objCmnBank = CmnBankDetailsHelper.CreateCmnBankObject();
            var jsonParam = JSON.stringify(objCmnBank);
            var serviceUrl = _baseUrl + "/api/CmnBank/CreateUpdateCmnBank";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }        
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdBankSummary").data("kendoGrid").dataSource.read();
                            CmnBankDetailsHelper.ClearForm();
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
    GetAllBranch() {
        debugger;
        var list = ApiManager.GetList(_baseUrl + "/api/CmnBankBranch/all");
        return list == null ? [] : list;
    }
};
var CmnBankDetailsHelper = {
    InitBankDetails: function () {
        debugger;
        CmnBankDetailsHelper.LoadBranchCombo("cmbBranch");

        $("#btnSave").click(function () {
            CmnBankDetailsManager.SaveCmnBankDetails();
        });

        $("#btnClearAll").click(function () {
            debugger;
            CmnBankDetailsHelper.ClearForm();
        });
    },
    FillBankForm: function (obj) {
        debugger;
        $("#hdnBankId").val(obj.BankId);
        $("#txtBankName").val(obj.BankName);
        $("#txtAddress1").val(obj.Address1);
        $("#txtAddress2").val(obj.Address2);
        $("#txtAddress3").val(obj.Address3);
        $("#cmbBranch").data("kendoComboBox").value(obj.BranchId);
        $("#txtPhoneNo").val(obj.PhoneNo);
        $("#txtFaxNo").val(obj.FaxNo);
        $("#txtEmail").val(obj.Email);
        $("#txtContractPerson").val(obj.ContractPerson);
        if (obj.IsFacilityOptional == true) {
            $("#chkIsFacilityOptional").prop('checked', true)
        } else {
            $("#chkIsFacilityOptional").prop('checked', false)
        };
        $("#txtAreaRemarks").val(obj.Remarks);
    },
    CreateCmnBankObject: function () {
        var obj = new Object();
        obj.BankId = $("#hdnBankId").val();
        obj.BankName = $("#txtBankName").val().trim();
        obj.Address1 = $("#txtAddress1").val();
        obj.Address2 = $("#txtAddress2").val();
        obj.Address3 = $("#txtAddress3").val();
        obj.BranchId = $("#cmbBranch").data("kendoComboBox").value();
        obj.PhoneNo = $("#txtPhoneNo").val().trim();
        obj.FaxNo = $("#txtFaxNo").val();
        obj.Email = $("#txtEmail").val();
        obj.ContractPerson = $("#txtContractPerson").val();
        obj.IsFacilityOptional = $("#chkIsFacilityOptional").is(":checked");
        obj.Remarks = $("#txtAreaRemarks").val();
        return obj;
    },
    ClearForm: function () {
        debugger;
        $("#btnSave").text("Save");
        $("#hdnBankId").val("00000000-0000-0000-0000-000000000000");
        $("#txtBankName").val("");
        $("#txtAddress1").val("");
        $("#txtAddress2").val("");
        $("#txtAddress3").val("");
       // $("#hdnBranchId").val("");
        $("#cmbBranch").data("kendoComboBox").value("");
        $("#txtPhoneNo").val("");
        $("#txtFaxNo").val("");
        $("#txtEmail").val("");
        $("#txtContractPerson").val("");
        $("#chkIsFacilityOptional").prop('checked', false);
        $("#txtAreaRemarks").val("");
    },
    LoadBranchCombo: function (cboId) {
        //debugger;
        UtilityHelper.LoadCombo(cboId, "BranchId", "BranchName", CmnBankDetailsManager.GetAllBranch(), "--Select Branch--");
    }
};