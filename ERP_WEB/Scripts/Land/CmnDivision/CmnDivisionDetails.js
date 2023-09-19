//
var CmnDivisionDetailsManager = {
    SaveCmnDivisionDetails: function () {
        var msg = "";
        var objCmnDivision = CmnDivisionDetailsHelper.CreateCmnDivisionObject();
        var jsonParam = JSON.stringify(objCmnDivision);
        var serviceUrl = _baseUrlLand + "/api/CmnDivision/CreateUpdateCmnDivision";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdCmnDivisionSummary").data("kendoGrid").dataSource.read();
                            CmnDivisionDetailsHelper.ClearForm();
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
}

var CmnDivisionDetailsHelper = {
    InitCmnDivisionDetails: function () {
        $("#btnSave").click(function () {
            CmnDivisionDetailsManager.SaveCmnDivisionDetails();
        });
        $("#btnClearAll").click(function () {
            CmnDivisionDetailsHelper.ClearForm();
        });
    },
    CreateCmnDivisionObject: function () {
        var obj = new Object();
        obj.DivisionId = $("#hdnCmnDivisionId").val();
        obj.DivisionName = $("#txtCmnDivisionName").val();
        return obj;
    },
    FillCmnDivisionForm: function (obj) {
        $("#hdnCmnDivisionId").val(obj.DivisionId);
        $("#txtCmnDivisionName").val(obj.DivisionName);
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnCmnDivisionId").val("00000000-0000-0000-0000-000000000000");
        $("#txtCmnDivisionName").val("");
    }
}