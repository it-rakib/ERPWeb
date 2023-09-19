var validationSuccess = $("#validation-success");
var ColorDetailsManager = {
    SaveColorDetails: function () {
        var msg = "";
            var objColor = ColorDetailsHelper.CreateColorObject();
            var jsonParam = JSON.stringify(objColor);
            var serviceUrl = _baseUrl + "/api/CmnColors/CreateUpdateCmnColor";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
            function onSuccess(jsonData) {
                if (jsonData.Success) {
                    msg = jsonData.Message;
                    AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                                $("#grdColorSummary").data("kendoGrid").dataSource.read();
                                ColorDetailsHelper.ClearForm();
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

var ColorDetailsHelper = {
    InitColorDetails: function () {

        $("#btnSave").click(function () {
            ColorDetailsManager.SaveColorDetails();
        });

        $("#btnClearAll").click(function () {
            ColorDetailsHelper.ClearForm();
        });
    },
    FillColorForm: function (obj) {
        $("#hdnColorId").val(obj.ColorId);
        $("#txtColorName").val(obj.ColorName);
        $("#txtColorCode").val(obj.ColorCode);
    },
    CreateColorObject: function (colorObj) {
        var obj = new Object();
        obj.ColorId = $("#hdnColorId").val();
        obj.ColorName = $("#txtColorName").val().trim();
        obj.ColorCode = $("#txtColorCode").val().trim();
        debugger
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnColorId").val("00000000-0000-0000-0000-000000000000");
        $("#txtColorName").val("");
        $("#txtColorCode").val("");
    },
    
};