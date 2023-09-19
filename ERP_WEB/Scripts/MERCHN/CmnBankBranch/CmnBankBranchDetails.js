var validationSuccess = $("#validation-success");
var CmnBankBranchDetailsManager = {
    SaveCmnBankBranchDetails: function () {
        var msg = "";
        var validator = $("#divCmnBankBranchDetails").kendoValidator().data("kendoValidator"),
            status = $(".status");
        if (validator.validate()) {
            var objBranch = CmnBankBranchDetailsHelper.CreateCmnBankBranchObject();
            var jsonParam = JSON.stringify(objBranch);
            var serviceUrl = _baseUrl + "/api/CmnBankBranch/CreateUpdateCmnBankBranch";
        }
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdBranchSummary").data("kendoGrid").dataSource.read();
                            CmnBankBranchDetailsHelper.ClearForm();
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

var CmnBankBranchDetailsHelper = {
    InitBranchDetails: function () {

        $("#btnSave").click(function () {
            CmnBankBranchDetailsManager.SaveCmnBankBranchDetails();
        });

        $("#btnClearAll").click(function () {
            CmnBankBranchDetailsHelper.ClearForm();
        });
    },
    FillBranchForm: function (obj) {
        $("#hdnBranchId").val(obj.BranchId);
        $("#txtBranchName").val(obj.BranchName);
        $("#txtBranchAddress").val(obj.BranchAddress);
    },

    CreateCmnBankBranchObject: function (agentObj) {
        var obj = new Object();
        obj.BranchId = $("#hdnBranchId").val();
        obj.BranchName = $("#txtBranchName").val().trim();
        obj.BranchAddress = $("#txtBranchAddress").val();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnBranchId").val("00000000-0000-0000-0000-000000000000");
        $("#txtBranchName").val("");
        $("#txtBranchAddress").val("");
    }
};