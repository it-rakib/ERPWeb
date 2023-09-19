var isDelete = false;
var validationSuccess = $("#validation-success");
var InsuranceDetailsManager = {
    SaveInsuranceDetails: function () {
        var msg = "";

        var objIns = InsuranceDetailsHelper.CreateInsuranceObject();
        var jsonParam = JSON.stringify(objIns);
        var serviceUrl = _baseUrlTransport + "/api/Insurance/CreateUpdateInsurance";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdInsuranceSummary").data("kendoGrid").dataSource.read();
                            InsuranceDetailsHelper.ClearForm();
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
    GetInsuranceCompany() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/InsuranceCompany/all");
        return list == null ? [] : list;
    },
    GetAllVehicle() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleInfo/all");
        return list == null ? [] : list;
    },
    GetAllRecurringPeriod() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/RecurringPeriod/all");
        return list == null ? [] : list;
    }
};

var InsuranceDetailsHelper = {
    InitInsuranceDetails: function () {
        InsuranceDetailsHelper.GenerateDatePicker();
        InsuranceDetailsHelper.GenerateNumericTextBox();
        InsuranceDetailsHelper.LoadInsuranceCompanyCombo("cmbInsuranceCompany");
        InsuranceDetailsHelper.LoadVehicle("cmbVehicle");
        InsuranceDetailsHelper.LoadRecurringPeriod("cmbRecurringPeriod");

        $("#btnSave").click(function () {

            InsuranceDetailsManager.SaveInsuranceDetails();
        });

        $("#btnClearAll").click(function () {
            InsuranceDetailsHelper.ClearForm();
        });
    },
    LoadInsuranceCompanyCombo(cmbInsuranceCompany) {
        UtilityHelper.LoadCombo(cmbInsuranceCompany, "InsuranceCompanyId", "InsuranceCompanyName", InsuranceDetailsManager.GetInsuranceCompany(), "--Select Company--");
    },
    LoadVehicle(cmbVehicle) {
        UtilityHelper.LoadCombo(cmbVehicle, "VehicleId", "VehicleName", InsuranceDetailsManager.GetAllVehicle(), "--Select Vehicle--");
    },
    LoadRecurringPeriod(cmbRecurringPeriod) {
        UtilityHelper.LoadCombo(cmbRecurringPeriod, "RecurringPeriodId", "RecurringPeriodName", InsuranceDetailsManager.GetAllRecurringPeriod(), "--Select Recurring Period--");
    },

    FillInsuranceForm: function (obj) {
        $("#hdInsuranceId").val(obj.InsuranceId);
        $("#cmbInsuranceCompany").data("kendoComboBox").value(obj.InsuranceCompanyId);
        $("#cmbVehicle").data("kendoComboBox").value(obj.VehicleId);
        $("#cmbRecurringPeriod").data("kendoComboBox").value(obj.RecurringPeriodId);
        $("#txtPolicyNumber").val(obj.PolicyNumber);
        $("#txtChargePayable").data('kendoNumericTextBox').value(obj.ChargePayable);
        $("#txtStartDate").data("kendoDatePicker").value(obj.StartDate);
        $("#txtEndDate").data("kendoDatePicker").value(obj.EndDate);
        $("#txtRecurringDate").data("kendoDatePicker").value(obj.RecurringDate);
        $("#txtDeductable").data('kendoNumericTextBox').value(obj.Deductable);
        $("#txtRemarks").val(obj.Remarks);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
    },

    CreateInsuranceObject: function (insObj) {
        var obj = new Object();
        obj.InsuranceId = $("#hdInsuranceId").val();
        obj.InsuranceCompanyId = $("#cmbInsuranceCompany").data("kendoComboBox").value();
        obj.VehicleId = $("#cmbVehicle").data("kendoComboBox").value();
        obj.RecurringPeriodId = $("#cmbRecurringPeriod").data("kendoComboBox").value();
        obj.PolicyNumber = $("#txtPolicyNumber").val();
        obj.ChargePayable = $("#txtChargePayable").data('kendoNumericTextBox').value();
        obj.StartDate = $("#txtStartDate").data("kendoDatePicker").value();
        obj.EndDate = $("#txtEndDate").data("kendoDatePicker").value();
        obj.RecurringDate = $("#txtRecurringDate").data("kendoDatePicker").value();
        obj.Deductable = $("#txtDeductable").data('kendoNumericTextBox').value();
        obj.Remarks = $("#txtRemarks").val();       
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdInsuranceId").val("0");
        $("#cmbInsuranceCompany").data("kendoComboBox").value("");
        $("#cmbVehicle").data("kendoComboBox").value("");
        $("#cmbRecurringPeriod").data("kendoComboBox").value("");
        $("#txtPolicyNumber").val("");
        $("#txtChargePayable").data('kendoNumericTextBox').value("");        
        $("#txtStartDate").data("kendoDatePicker").value("");
        $("#txtEndDate").data("kendoDatePicker").value("");
        $("#txtRecurringDate").data("kendoDatePicker").value("");
        $("#txtDeductable").data('kendoNumericTextBox').value("");
        $("#txtRemarks").val("");
    },
    GenerateDatePicker: function () {
        $("#txtStartDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
        $("#txtEndDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
        $("#txtRecurringDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtChargePayable").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtDeductable").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
    }
};