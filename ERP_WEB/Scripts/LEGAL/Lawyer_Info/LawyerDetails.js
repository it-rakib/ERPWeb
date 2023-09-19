var validationSuccess = $("#validation-success");
var LawyerDetailsManager = {
    SaveLawyerDetails: function () {
        var msg = "";
        
        var objLawyer = LawyerDetailsHelper.CreateLawyerObject();
        var jsonParam = JSON.stringify(objLawyer);
        var serviceUrl = _baseUrlLegal + "/api/LawyerInfo/CreateUpdateLawyer";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdLawyerSummary").data("kendoGrid").dataSource.read();
                            LawyerDetailsHelper.ClearForm();
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

var LawyerDetailsHelper = {
    InitLawyerDetails: function () {

        $("#btnSave").click(function () {
            
            LawyerDetailsManager.SaveLawyerDetails();
        });

        $("#btnClearAll").click(function () {
            LawyerDetailsHelper.ClearForm();
        });
    },
    FillLawyerForm: function (obj) {

        $("#hdnLawyerId").val(obj.LawyerId);
        $("#txtLawyer").val(obj.LawyerName);
        $("#txtEmail").val(obj.Email);
        $("#txtAddress").val(obj.LawyerAddress);
        $("#txtContact").val(obj.ContactNo);
    },

    CreateLawyerObject: function () {
        
        var obj = new Object();
        obj.LawyerId = $("#hdnLawyerId").val();
        obj.LawyerName = $("#txtLawyer").val().trim();
        obj.Email = $("#txtEmail").val();
        obj.LawyerAddress = $("#txtAddress").val();
        obj.ContactNo = $("#txtContact").val();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnLawyerId").val("0");
        $("#txtLawyer").val("");
        $("#txtEmail").val("");
        $("#txtAddress").val("");
        $("#txtContact").val("");
    }
};