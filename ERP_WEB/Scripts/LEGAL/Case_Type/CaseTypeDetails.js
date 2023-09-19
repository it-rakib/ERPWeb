var validationSuccess = $("#validation-success");
var CaseTypeDetailsManager = {
    SaveCaseTypeDetails: function () {
        var msg = "";
        
        var objCaseType = CaseTypeDetailsHelper.CreateCaseTypeObject();
        var jsonParam = JSON.stringify(objCaseType);
        var serviceUrl = _baseUrlLegal + "/api/CaseType/CreateUpdateCaseType";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdCaseTypeSummary").data("kendoGrid").dataSource.read();
                            CaseTypeDetailsHelper.ClearForm();
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

var CaseTypeDetailsHelper = {
    InitCaseTypeDetails: function () {

        $("#btnSave").click(function () {
            
            CaseTypeDetailsManager.SaveCaseTypeDetails();
        });

        $("#btnClearAll").click(function () {
            CaseTypeDetailsHelper.ClearForm();
        });
    },
    FillCaseTypeForm: function (obj) {
        $("#hdnCaseTypeId").val(obj.CaseTypeId);
        $("#txtCaseType").val(obj.CaseTypeName);
    },

    CreateCaseTypeObject: function (caseTypeObj) {
        
        var obj = new Object();
        obj.CaseTypeId = $("#hdnCaseTypeId").val();
        obj.CaseTypeName = $("#txtCaseType").val().trim();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnCaseTypeId").val("0");
        $("#txtCaseType").val("");
    }
};