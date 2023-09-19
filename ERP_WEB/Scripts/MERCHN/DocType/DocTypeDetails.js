var validationSuccess = $("#validation-success");
var DocTypeDetailsManager = {
    SaveDocTypeDetails: function () {
        var msg = "";
            var objDocType = DocTypeDetailsHelper.CreateDocTypeObject();
            var jsonParam = JSON.stringify(objDocType);
        var serviceUrl = _baseUrl + "/api/CmnDocTypes/CreateUpdateCmnDocType";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
            function onSuccess(jsonData) {
                if (jsonData.Success) {
                    msg = jsonData.Message;
                    AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                                $("#grdDocTypeSummary").data("kendoGrid").dataSource.read();
                                DocTypeDetailsHelper.ClearForm();
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
var DocTypeDetailsHelper = {
    InitDocTypeDetails: function () {

        $("#btnSave").click(function () {
            DocTypeDetailsManager.SaveDocTypeDetails();
        });

        $("#btnClearAll").click(function () {
            DocTypeDetailsHelper.ClearForm();
        });
    },
    FillDocTypeForm: function (obj) {
        $("#hdnDocTypeId").val(obj.DocTypeId);
        $("#txtDocTypeName").val(obj.DocTypeName);
    },

    CreateDocTypeObject: function (docTypeObj) {
        var obj = new Object();
        obj.DocTypeId = $("#hdnDocTypeId").val();
        obj.DocTypeName = $("#txtDocTypeName").val().trim();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnDocTypeId").val("00000000-0000-0000-0000-000000000000");
        $("#txtDocTypeName").val("");
    }
};