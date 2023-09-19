var VendorDetailsManager = {
    SaveVendorDetails: function () {
        var msg = "";
        var objBuyer = VendorDetailsHelper.CreateOfficeObject();
        var jsonParam = JSON.stringify(objBuyer);
        var serviceUrl = _baseUrlTransport + "/api/Vendor/CreateUpdateVendor";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdVendorSummary").data("kendoGrid").dataSource.read();
                            VendorDetailsHelper.ClearForm();
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
var VendorDetailsHelper = {
    InitVendorDetails: function () {
        $("#btnSave").click(function () {
            VendorDetailsManager.SaveVendorDetails();
        });

        $("#btnClearAll").click(function () {
            VendorDetailsHelper.ClearForm();
        });
    },
    FillVendorForm: function (obj) {
        $("#hdnVendorId").val(obj.VendorId);
        $("#txtVendorName").val(obj.VendorName);
        if (obj.IsActive == true) {
            $("#chkIsActive").prop('checked', true)
        } else {
            $("#chkIsActive").prop('checked', false)
        };
    },

    CreateOfficeObject: function () {
        debugger;
        var obj = new Object();
        obj.VendorId = $("#hdnVendorId").val();
        obj.VendorName = $("#txtVendorName").val().trim();
        obj.IsActive = $("#chkIsActive").is(":checked");
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnVendorId").val("0");
        $("#txtVendorName").val("");
        $("#chkIsActive").prop('checked', false);
    }
};