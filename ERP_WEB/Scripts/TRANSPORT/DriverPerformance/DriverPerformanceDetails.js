var isDelete = false;
var validationSuccess = $("#validation-success");
var DriverPerformanceDetailsManager = {
    SaveVehiclePerformanceDetails: function () {
        var msg = "";

        var objDriver = DriverPerformanceDetailsHelper.CreateDriverPerformanceObject();
        var jsonParam = JSON.stringify(objDriver);
        var serviceUrl = _baseUrlTransport + "/api/DriverPerformance/CreateUpdateDriverPerformance";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdDriverPerformanceSummary").data("kendoGrid").dataSource.read();
                            DriverPerformanceDetailsHelper.ClearForm();
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
    //GetDriver: function () {
    //    //var empId = 0;
    //    var objPs = "";
    //    var jsonParam = "";
    //    var serviceUrl = "../DriverInfo/GetAllEmployee/";
    //    AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
    //    function onSuccess(jsonData) {
    //        objPs = jsonData;
    //    }
    //    function onFailed(error) {
    //        alert(error.statusText);
    //    }
    //    return objPs;
    //},

    GetDriver() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/Driver/all");
        return list == null ? [] : list;
    },
    GetAllStatus() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/AllStatus/all");
        return list == null ? [] : list;
    }
};

var DriverPerformanceDetailsHelper = {
    InitDriverPerformanceDetails: function () {
        DriverPerformanceDetailsHelper.GenerateDatePicker();
        DriverPerformanceDetailsHelper.GenerateNumericTextBox();
        DriverPerformanceDetailsHelper.LoadDriverCombo("cmbDriver");
        DriverPerformanceDetailsHelper.LoadSalaryStatus("cmbSalaryStatus");
        DriverPerformanceDetailsHelper.LoadOverTimeStatusStatus("cmbOverTimeStatus");

        $("#btnSave").click(function () {

            DriverPerformanceDetailsManager.SaveVehiclePerformanceDetails();
        });

        $("#btnClearAll").click(function () {
            DriverPerformanceDetailsHelper.ClearForm();
        });
    },
    LoadDriverCombo(cmbDriver) {
        UtilityHelper.LoadCombo(cmbDriver, "DriverId", "DriverName", DriverPerformanceDetailsManager.GetDriver(), "--Select Driver--");
    },
    LoadSalaryStatus(cmbSalaryStatus) {
        UtilityHelper.LoadCombo(cmbSalaryStatus, "StatusId", "StatusName", DriverPerformanceDetailsManager.GetAllStatus(), "--Select Status--");
    },
    LoadOverTimeStatusStatus(cmbOverTimeStatus) {
        UtilityHelper.LoadCombo(cmbOverTimeStatus, "StatusId", "StatusName", DriverPerformanceDetailsManager.GetAllStatus(), "--Select Status--");
    },

    FillDriverPerformanceForm: function (obj) {
        $("#hdnDriverPerformanceId").val(obj.DriverPerformanceId);
        $("#cmbDriver").data("kendoComboBox").value(obj.DriverId);
        $("#cmbSalaryStatus").data("kendoComboBox").value(obj.SalaryStatus);
        $("#cmbOverTimeStatus").data("kendoComboBox").value(obj.OverTimeStatus);
        $("#txtOverTimePayment").data('kendoNumericTextBox').value(obj.OverTimePayment);
        $("#txtPerformanceBonus").data('kendoNumericTextBox').value(obj.PerformanceBonus);
        $("#txtPenaltyAmount").data('kendoNumericTextBox').value(obj.PenaltyAmount);
        $("#txtPenaltyReason").val(obj.PenaltyReason);
        $("#txtPenaltyDate").data("kendoDatePicker").value(obj.PenaltyDate);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
    },

    CreateDriverPerformanceObject: function (driverPerformanceObj) {
        var obj = new Object();
        obj.DriverPerformanceId = $("#hdnDriverPerformanceId").val();
        obj.DriverId = $("#cmbDriver").data("kendoComboBox").value();
        obj.SalaryStatus = $("#cmbSalaryStatus").data("kendoComboBox").value();
        obj.OverTimeStatus = $("#cmbOverTimeStatus").data("kendoComboBox").value();
        obj.OverTimePayment = $("#txtOverTimePayment").val();
        obj.PerformanceBonus = $("#txtPerformanceBonus").val();
        obj.PenaltyAmount = $("#txtPenaltyAmount").val();
        obj.PenaltyReason = $("#txtPenaltyReason").val();
        obj.PenaltyDate = $("#txtPenaltyDate").data("kendoDatePicker").value();        
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnDriverPerformanceId").val("0");
        $("#cmbDriver").data("kendoComboBox").value("");
        $("#cmbSalaryStatus").data("kendoComboBox").value("");
        $("#cmbOverTimeStatus").data("kendoComboBox").value("");
        $("#txtOverTimePayment").data('kendoNumericTextBox').value("");
        $("#txtPerformanceBonus").data('kendoNumericTextBox').value("");
        $("#txtPenaltyAmount").data('kendoNumericTextBox').value("");
        $("#txtPenaltyReason").val("");
        $("#txtPenaltyDate").data("kendoDatePicker").value("")
    },
    GenerateDatePicker: function () {
        $("#txtPenaltyDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtOverTimePayment").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtPerformanceBonus").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtPenaltyAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
    }
};