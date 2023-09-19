var FileCodeDetailsManager = {
    SaveFileCodeDetails: function () {
        debugger;
        var msg = "";
        var objFileCode = FileCodeDetailsHelper.CreateFileCodeObject();
        var jsonParam = JSON.stringify(objFileCode);
        var serviceUrl = _baseUrlLand + "/api/FileCode/CreateUpdateFileCodeInfo";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdFileCodeSummary").data("kendoGrid").dataSource.read();
                            FileCodeDetailsHelper.ClearForm();
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

var FileCodeDetailsHelper = {
    InitFileCodeDetails: function () {
        $("#btnSave").click(function () {
            FileCodeDetailsManager.SaveFileCodeDetails();
        });
        $("#btnClearAll").click(function () {
            FileCodeDetailsHelper.ClearForm();
        });
    },
    CreateFileCodeObject: function () {        
        var obj = new Object();
        obj.FileCodeInfoId = $("#hdnFileCodeInfoId").val();
        obj.FileCodeInfoName = $("#txtFileCodeInfoName").val();
        obj.FileCodeInfoFullName = $("#txtFileCodeInfoFullName").val();
        obj.IsActive = $("#chkIsActive").is(":checked");
        debugger;
        return obj;
    },
    FillFileCodeForm: function (obj) {
        $("#hdnFileCodeInfoId").val(obj.FileCodeInfoId);
        $("#txtFileCodeInfoName").val(obj.FileCodeInfoName);
        $("#txtFileCodeInfoFullName").val(obj.FileCodeInfoFullName);
        //$("#chkIsActive").prop('checked', false);
        if (obj.IsActive == true) {
            $("#chkIsActive").prop('checked', true);
        } else {
            $("#chkIsActive").prop('checked', false);
        };
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnFileCodeInfoId").val("00000000-0000-0000-0000-000000000000");
        $("#txtFileCodeInfoName").val("");
        $("#txtFileCodeInfoFullName").val("");
        $("#chkIsActive").prop('checked', false);
    },
    FillFileCodeDeleteForm: function (obj) {
        $("#hdnFileCodeInfoId").val(obj.FileCodeInfoId);
        $("#txtFileCodeInfoName").val(obj.FileCodeInfoName);
        $("#txtFileCodeInfoFullName").val(obj.FileCodeInfoFullName);
        $("#chkIsActive").prop('checked', false);
    }
}