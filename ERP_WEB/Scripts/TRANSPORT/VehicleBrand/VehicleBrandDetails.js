var isDelete = false;
var BrandDetailsManager = {
    SaveBrandDetails: function () {
        var msg = "";
        var objBrand = BrandDetailsHelper.CreateBrandObject();
        var jsonParam = JSON.stringify(objBrand);
        var serviceUrl = _baseUrlTransport + "/api/VehicleBrand/CreateUpdateVehicleBrand";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdBrandSummary").data("kendoGrid").dataSource.read();
                            BrandDetailsHelper.ClearForm();
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
var BrandDetailsHelper = {
    InitBrandDetails: function () {
        $("#btnSave").click(function () {
            BrandDetailsManager.SaveBrandDetails();
        });

        $("#btnClearAll").click(function () {
            BrandDetailsHelper.ClearForm();
        });
    },
    FillBrandForm: function (obj) {
        $("#hdnBrandId").val(obj.VehicleBrandId);
        $("#txtBrandName").val(obj.VehicleBrandName);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
    },

    CreateBrandObject: function () {
        debugger;
        var obj = new Object();
        obj.VehicleBrandId = $("#hdnBrandId").val();
        obj.VehicleBrandName = $("#txtBrandName").val().trim();
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnBrandId").val("0");
        $("#txtBrandName").val("");
        $("#chkIsDeleted").prop('checked', false);
    }
};