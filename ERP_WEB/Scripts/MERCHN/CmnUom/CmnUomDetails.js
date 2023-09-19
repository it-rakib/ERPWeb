var validationSuccess = $("#validation-success");
var UomDetailsManager = {
    SaveUomDetails: function () {
        var msg = "";
        var objUom = UomDetailsHelper.CreateUomObject();
        var jsonParam = JSON.stringify(objUom);
        var serviceUrl = _baseUrl + "/api/CmnUoms/CreateUpdateCmnUom";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdUomSummary").data("kendoGrid").dataSource.read();
                            UomDetailsHelper.ClearForm();
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
var UomDetailsHelper = {
    InitUomDetails: function () {

        $("#btnSave").click(function () {
            UomDetailsManager.SaveUomDetails();
        });

        $("#btnClearAll").click(function () {
            UomDetailsHelper.ClearForm();
        });
    },
    FillUomForm: function (obj) {
        debugger;
        $("#hdnUOMId").val(obj.Uomid);
        $("#txtUOMName").val(obj.Uomname);
    },
    CreateUomObject: function (uomObj) {
        var obj = new Object();
        obj.Uomid = $("#hdnUOMId").val();
        obj.Uomname = $("#txtUOMName").val().trim();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnUOMId").val("00000000-0000-0000-0000-000000000000");
        $("#txtUOMName").val("");
    }
}