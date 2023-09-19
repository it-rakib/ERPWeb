var validationSuccess = $("#validation-success");
var JurisdictionDetailsManager = {
    SaveJurisdictionDetails: function () {
        
        var msg = "";
        
        var objJurisdiction = JurisdictionDetailsHelper.CreateJurisdictionObject();
        var jsonParam = JSON.stringify(objJurisdiction);
        var serviceUrl = _baseUrlLegal + "/api/Jurisdiction/CreateUpdateJurisdiction";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdJurisdictionSummary").data("kendoGrid").dataSource.read();
                            JurisdictionDetailsHelper.ClearForm();
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

var JurisdictionDetailsHelper = {
    InitJurisdictionDetails: function () {

        $("#btnSave").click(function () {
            
            JurisdictionDetailsManager.SaveJurisdictionDetails();
        });

        $("#btnClearAll").click(function () {
            JurisdictionDetailsHelper.ClearForm();
        });
    },
    FillJurisdictionForm: function (obj) {
        
        $("#hdnJurisdictionId").val(obj.JurisdictionId);
        $("#txtJurisdiction").val(obj.JurisdictionName);
    },
    CreateJurisdictionObject: function (jurisdictionObj) {
        
        var obj = new Object();
        obj.JurisdictionId = $("#hdnJurisdictionId").val();
        obj.JurisdictionName = $("#txtJurisdiction").val().trim();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnJurisdictionId").val("0");
        $("#txtJurisdiction").val("");
    }
};