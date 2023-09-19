var isDelete = false;
var OwnershipDetailsManager = {
    SaveOwnershipDetails: function () {
        var msg = "";
        var objBuyer = OwnershipDetailsHelper.CreateOwnershipObject();
        var jsonParam = JSON.stringify(objBuyer);
        var serviceUrl = _baseUrlTransport + "/api/VehicleOwnership/CreateUpdateVehicleOwnership";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdOwnershipSummary").data("kendoGrid").dataSource.read();
                            OwnershipDetailsHelper.ClearForm();
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
var OwnershipDetailsHelper = {
    InitOwnershipDetails: function () {
        $("#btnSave").click(function () {
            OwnershipDetailsManager.SaveOwnershipDetails();
        });

        $("#btnClearAll").click(function () {
            OwnershipDetailsHelper.ClearForm();
        });
    },
    FillOwnershipForm: function (obj) {
        $("#hdnOwnershipId").val(obj.OwnerShipId);
        $("#txtOwnershipName").val(obj.OwnerShipName);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
    },

    CreateOwnershipObject: function () {
        debugger;
        var obj = new Object();
        obj.OwnerShipId = $("#hdnOwnershipId").val();
        obj.OwnerShipName = $("#txtOwnershipName").val().trim();
        //var isdelete = $("#chkIsDeleted").is(":checked");
        if (isDelete == true) {
            obj.IsDeleted = true;
        } 
        //obj.IsDeleted = $("#chkIsDeleted").is(":checked");
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnOwnershipId").val("0");
        $("#txtOwnershipName").val("");
        $("#chkIsDeleted").prop('checked', false);
    }
};