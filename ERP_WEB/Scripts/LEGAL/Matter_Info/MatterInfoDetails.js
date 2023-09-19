var validationSuccess = $("#validation-success");
var MatterDetailsManager = {
    SaveMatterDetails: function () {
        var msg = "";
        
        var objMatter = MatterDetailsHelper.CreateMatterObject();
        var jsonParam = JSON.stringify(objMatter);
        var serviceUrl = _baseUrlLegal + "/api/MatterInfo/CreateUpdateMatter";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdMatterInfoSummary").data("kendoGrid").dataSource.read();
                            MatterDetailsHelper.ClearForm();
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

var MatterDetailsHelper = {
    InitMatterDetails: function () {

        $("#btnSave").click(function () {
            
            MatterDetailsManager.SaveMatterDetails();
        });

        $("#btnClearAll").click(function () {
            MatterDetailsHelper.ClearForm();
        });
    },
    FillMatterForm: function (obj) {
        $("#hdnMatterId").val(obj.MatterId);
        $("#txtMatter").val(obj.MatterName);
        $("#txtDescription").val(obj.Discription);
    },

    CreateMatterObject: function (matterObj) {
        
        var obj = new Object();
        obj.MatterId = $("#hdnMatterId").val();
        obj.MatterName = $("#txtMatter").val().trim();
        obj.Discription = $("#txtDescription").val();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnMatterId").val("0");
        $("#txtMatter").val("");
        $("#txtDescription").val("");
    }
};