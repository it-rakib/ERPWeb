var validationSuccess = $("#validation-success");
var FileTypeDetailsManager = {
    SaveFileTypeDetails: function () {
        var msg = "";
        
        var objFileType = FileTypeDetailsHelper.CreateFileTypeObject();
        var jsonParam = JSON.stringify(objFileType);
        var serviceUrl = _baseUrlLegal + "/api/FileType/CreateUpdateFileType";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdFileTypeSummary").data("kendoGrid").dataSource.read();
                            FileTypeDetailsHelper.ClearForm();
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

var FileTypeDetailsHelper = {
    InitFileTypeDetails: function () {

        $("#btnSave").click(function () {
            
            FileTypeDetailsManager.SaveFileTypeDetails();
        });

        $("#btnClearAll").click(function () {
            FileTypeDetailsHelper.ClearForm();
        });
    },
    FillFileTypeForm: function (obj) {        
        $("#hdnFileTypeId").val(obj.FileTypeId);
        $("#txtFileType").val(obj.FileTypeName);
        $("#txtFileTypeNo").val(obj.FileTypeNo);
    },

    CreateFileTypeObject: function (fileTypeObj) {
        
        var obj = new Object();
        obj.FileTypeId = $("#hdnFileTypeId").val();
        obj.FileTypeName = $("#txtFileType").val().trim();
        obj.FileTypeNo = $("#txtFileTypeNo").val();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnFileTypeId").val("0");
        $("#txtFileType").val("");
        $("#txtFileTypeNo").val("");
    }
};