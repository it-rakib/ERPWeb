var validationSuccess = $("#validation-success");
var RouteDetailsManager = {
    SaveRouteDetails: function () {
        var msg = "";
        var objRoute = RouteDetailsHelper.CreateRouteObject();
        var jsonParam = JSON.stringify(objRoute);
        var serviceUrl = _baseUrlTransport + "/api/VehicleRoute/CreateUpdateVehicleRoute";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdRouteSummary").data("kendoGrid").dataSource.read();
                            RouteDetailsHelper.ClearForm();
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

var RouteDetailsHelper = {
    InitRouteDetails: function () {

        $("#btnSave").click(function () {

            RouteDetailsManager.SaveRouteDetails();
        });

        $("#btnClearAll").click(function () {
            RouteDetailsHelper.ClearForm();
        });
    },
    FillRouteForm: function (obj) {
        $("#hdnRouteId").val(obj.VehicleRouteId);
        $("#txtVehicleRouteName").val(obj.VehicleRouteName);
        $("#txtDestination").val(obj.Destination);
        $("#txtStartPoint").val(obj.StartPoint);
        $("#txtDescription").val(obj.Description);
        if (obj.IsActive == true) {
            $("#chkIsActive").prop('checked', true)
        } else {
            $("#chkIsActive").prop('checked', false)
        };
    },

    CreateRouteObject: function (driverObj) {
        var obj = new Object();
        obj.VehicleRouteId = $("#hdnRouteId").val();
        obj.VehicleRouteName = $("#txtVehicleRouteName").val();        
        obj.Destination = $("#txtDestination").val();
        obj.StartPoint = $("#txtStartPoint").val();
        obj.Description = $("#txtDescription").val();
        obj.IsActive = $("#chkIsActive").is(":checked");
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnRouteId").val("0");
        $("#txtVehicleRouteName").val("");
        $("#txtDestination").val("");
        $("#txtStartPoint").val("");
        $("#txtDescription").val("");
        $("#chkIsActive").prop('checked', false);
    }
};