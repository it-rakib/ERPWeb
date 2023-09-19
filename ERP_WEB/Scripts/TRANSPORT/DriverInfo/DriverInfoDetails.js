var validationSuccess = $("#validation-success");
var DriverInfoDetailsManager = {
    SaveDriverInfoDetails: function () {
        var msg = "";

        var objDriver = DriverInfoDetailsHelper.CreateDriverObject();
        var jsonParam = JSON.stringify(objDriver);
        var serviceUrl = _baseUrlTransport + "/api/Driver/CreateUpdateDriver";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdDriverInfoSummary").data("kendoGrid").dataSource.read();
                            DriverInfoDetailsHelper.ClearForm();
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
    GetEmployee: function () {
        //var empId = 0;
        var objPs = "";
        var jsonParam = "";
        var serviceUrl = "../DriverInfo/GetAllEmployee/";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objPs = jsonData;
        }
        function onFailed(error) {
            alert(error.statusText);
        }
        return objPs;
    },

    GetLicenseType() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/LicenseType/all");
        return list == null ? [] : list;
    },
    GetDutyType() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/DutyType/all");
        return list == null ? [] : list;
    }
};

var DriverInfoDetailsHelper = {
    InitDriverDetails: function () {
        DriverInfoDetailsHelper.GenerateDatePicker();
        DriverInfoDetailsHelper.LoadUserCombo("cmbEmp");
        DriverInfoDetailsHelper.LoadLicenseTypeCombo("cmbLicenseType");
        DriverInfoDetailsHelper.LoadDutyTypeCombo("cmbDutyType");

        $("#btnSave").click(function () {

            DriverInfoDetailsManager.SaveDriverInfoDetails();
        });

        $("#btnClearAll").click(function () {
            DriverInfoDetailsHelper.ClearForm();
        });
    },
    LoadUserCombo(cmbEmp) {
        UtilityHelper.LoadCombo(cmbEmp, "EmpID", "EmpName", DriverInfoDetailsManager.GetEmployee(), "--Select Employee--");
    },
    LoadLicenseTypeCombo(cmbLicenseType) {
        UtilityHelper.LoadCombo(cmbLicenseType, "LicenseTypeId", "LicenseTypeName", DriverInfoDetailsManager.GetLicenseType(), "--Select License Type--");
    },
    LoadDutyTypeCombo(cmbDutyType) {
        UtilityHelper.LoadCombo(cmbDutyType, "DutyTypeId", "DutyTypeName", DriverInfoDetailsManager.GetDutyType(), "--Select Dutt Type--");
    },
    FillDriverForm: function (obj) {
        $("#hdnDriverId").val(obj.DriverId);
        $("#txtDriverName").val(obj.DriverName);
        $("#cmbEmp").data("kendoComboBox").value(obj.EmpId);
        $("#txtManualId").val(obj.ManualId);
        $("#txtLicenseNumber").val(obj.LicenseNumber);
        $("#cmbLicenseType").data("kendoComboBox").value(obj.LicenseTypeId);
        $("#txtLicenseIssueDate").data("kendoDatePicker").value(obj.LicenseIssueDate);
        $("#txtLicenseExpiredDate").data("kendoDatePicker").value(obj.LicenseExpiredDate);
        $("#txtDriverExperience").val(obj.DriverExperience);
        $("#cmbDutyType").data("kendoComboBox").value(obj.DutyTypeId);
        $("#txtWorkTime").data("kendoDateTimePicker").value(obj.WorkTime);
        $("#txtDriverContact").val(obj.DriverContact);
        if (obj.IsActive == true) {
            $("#chkIsActive").prop('checked', true)
        } else {
            $("#chkIsActive").prop('checked', false)
        };
    },

    CreateDriverObject: function (driverObj) {
        var obj = new Object();
        obj.DriverId = $("#hdnDriverId").val();
        obj.DriverName = $("#txtDriverName").val();
        obj.EmpId = $("#cmbEmp").data("kendoComboBox").value();
        obj.ManualId = $("#txtManualId").val();
        obj.LicenseNumber = $("#txtLicenseNumber").val();
        obj.LicenseTypeId = $("#cmbLicenseType").data("kendoComboBox").value();
        obj.LicenseIssueDate = kendo.toString($("#txtLicenseIssueDate").data("kendoDatePicker").value());
        obj.LicenseExpiredDate = kendo.toString($("#txtLicenseExpiredDate").data("kendoDatePicker").value());
        obj.DriverExperience = $("#txtDriverExperience").val();
        obj.DutyTypeId = $("#cmbDutyType").data("kendoComboBox").value();
        obj.WorkTime = kendo.toString($("#txtWorkTime").data("kendoDateTimePicker").value());
        //obj.WorkTime = $("#txtWorkTime").data("kendoDateTimePicker").value();
        //obj.WorkTime = $("#txtWorkTime").data("kendoDatePicker").value();
        obj.DriverContact = $("#txtDriverContact").val();
        obj.IsActive = $("#chkIsActive").is(":checked");
        debugger;
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnDriverId").val("0");
        $("#txtDriverName").val("");
        $("#cmbEmp").data("kendoComboBox").value("");
        $("#txtManualId").val("");
        $("#txtLicenseNumber").val("");
        $("#cmbLicenseType").data("kendoComboBox").value("");
        $("#txtLicenseIssueDate").data("kendoDatePicker").value("");
        $("#txtLicenseExpiredDate").data("kendoDatePicker").value("");        
        $("#txtDriverExperience").val("");
        $("#cmbDutyType").data("kendoComboBox").value("");
        $("#txtWorkTime").data("kendoDateTimePicker").value("");

        //$("#txtWorkTime").data("kendoDateTimePickers").value(""); 
        $("#txtDriverContact").val("");
        $("#chkIsActive").prop('checked', false);
    },
    GenerateDatePicker: function () {
        $("#txtLicenseIssueDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
        $("#txtLicenseExpiredDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
        $("#txtWorkTime").kendoDateTimePicker({
            format: "h:mm tt",
            value: new Date()
        });
    }
};