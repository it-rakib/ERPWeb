var InsuranceCompanyDetailsManager = {
    SaveInsuranceCompanyDetails: function () {
        var msg = "";
        var objCom = InsuranceCompanyDetailsHelper.CreateInsuranceCompanyObject();
        var jsonParam = JSON.stringify(objCom);
        var serviceUrl = _baseUrlTransport + "/api/InsuranceCompany/CreateUpdateInsuranceCompany";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdInsuranceCompanySummary").data("kendoGrid").dataSource.read();
                            InsuranceCompanyDetailsHelper.ClearForm();
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
var InsuranceCompanyDetailsHelper = {
    InitInsuranceCompanyDetails: function () {
        $("#btnSave").click(function () {
            InsuranceCompanyDetailsManager.SaveInsuranceCompanyDetails();
        });

        $("#btnClearAll").click(function () {
            InsuranceCompanyDetailsHelper.ClearForm();
        });
    },
    FillInsuranceCompanyForm: function (obj) {
        $("#hdnInsuranceCompanyId").val(obj.InsuranceCompanyId);
        $("#txtInsuranceCompanyName").val(obj.InsuranceCompanyName);
        if (obj.IsActive == true) {
            $("#chkIsActive").prop('checked', true)
        } else {
            $("#chkIsActive").prop('checked', false)
        };
    },

    CreateInsuranceCompanyObject: function () {
        debugger;
        var obj = new Object();
        obj.InsuranceCompanyId = $("#hdnInsuranceCompanyId").val();
        obj.InsuranceCompanyName = $("#txtInsuranceCompanyName").val().trim();
        obj.IsActive = $("#chkIsActive").is(":checked");
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnInsuranceCompanyId").val("0");
        $("#txtInsuranceCompanyName").val("");
        $("#chkIsActive").prop('checked', false);
    }
};