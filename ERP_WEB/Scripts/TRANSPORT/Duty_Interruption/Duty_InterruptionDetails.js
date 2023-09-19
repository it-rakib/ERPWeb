var isDelete = false;
var validationSuccess = $("#validation-success");
var DutyInterruptionDetailsManager = {
    SaveDutyInterruptionDetails: function () {
        var msg = "";

        var objDriver = DutyInterruptionDetailsHelper.CreateDutyInterruptionObject();
        var jsonParam = JSON.stringify(objDriver);
        var serviceUrl = _baseUrlTransport + "/api/DutyInterruption/CreateUpdateDutyInterruption";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdDutyInterruptSummary").data("kendoGrid").dataSource.read();
                            DutyInterruptionDetailsHelper.ClearForm();
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
    GetAllVehicle: function (searchKey) {
        var objVehicle = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlTransport + "/api/VehicleInfo/GetAllVehicleDropdown/" + $.trim(searchKey);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objVehicle = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objVehicle;
    },
    GetDriver() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/Driver/all");
        return list == null ? [] : list;
    },
    GetAllProblemType() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/ProblemType/all");
        return list == null ? [] : list;
    }
};

var DutyInterruptionDetailsHelper = {
    InitDutyInterruptionDetails: function () {
        DutyInterruptionDetailsHelper.GenerateDatePicker();

        DutyInterruptionDetailsHelper.LoadDriverCombo("cmbDriver");
        DutyInterruptionDetailsHelper.LoadProblemType("cmbProblemType");
        DutyInterruptionDetailsHelper.LoadVehicleMulticolumn("cboVehicle");

        $("#btnSave").click(function () {

            DutyInterruptionDetailsManager.SaveDutyInterruptionDetails();
        });

        $("#btnClearAll").click(function () {
            DutyInterruptionDetailsHelper.ClearForm();
        });
        $("#txtSearchKey").keypress(function (event) {
            if (event.keyCode === 13) {
                DutyInterruptionDetailsHelper.LoadVehicleCombo();
            }
        });
         $("#btnSearchStyle").click(function () {
             DutyInterruptionDetailsHelper.LoadVehicleCombo();
        });
    },
    LoadDriverCombo(cmbDriver) {
        UtilityHelper.LoadCombo(cmbDriver, "DriverId", "DriverName", DutyInterruptionDetailsManager.GetDriver(), "--Select Driver--");
    },
    LoadProblemType(cmbProblemType) {
        UtilityHelper.LoadCombo(cmbProblemType, "ProblemTypeId", "ProblemTypeName", DutyInterruptionDetailsManager.GetAllProblemType(), "--Select Problem--");
    },

    FillDutyInterruptionForm: function (obj) {
        $("#hdnDutyInterruptionId").val(obj.DutyInterruptionId);
        $("#cboVehicle").data("kendoMultiColumnComboBox").value(obj.VehicleId);
        $("#cmbDriver").data("kendoComboBox").value(obj.DriverId);
        $("#cmbProblemType").data("kendoComboBox").value(obj.ProblemTypeId);
        $("#txtProblemDetails").val(obj.ProblemDetails);
        $("#txtNoticeDate").data("kendoDatePicker").value(obj.NoticeDate);
        $("#txtWorkShop").val(obj.WorkShop);
        $("#txtRepairDuration").val(obj.RepairDuration);
        $("#txtEstimatedReturnDate").data("kendoDatePicker").value(obj.EstimatedReturnDate);
        $("#txtRemarks").val(obj.Remarks);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
    },

    CreateDutyInterruptionObject: function (dutyInterruptionObj) {
        var obj = new Object();
        obj.DutyInterruptionId = $("#hdnDutyInterruptionId").val();
        obj.VehicleId = $("#cboVehicle").data("kendoMultiColumnComboBox").value();
        obj.DriverId = $("#cmbDriver").data("kendoComboBox").value();
        obj.ProblemTypeId = $("#cmbProblemType").data("kendoComboBox").value();
        obj.ProblemDetails = $("#txtProblemDetails").val();
        obj.NoticeDate = $("#txtNoticeDate").data("kendoDatePicker").value();
        obj.WorkShop = $("#txtWorkShop").val();
        obj.RepairDuration = $("#txtRepairDuration").val();
        obj.EstimatedReturnDate = $("#txtEstimatedReturnDate").data("kendoDatePicker").value();
        obj.Remarks = $("#txtRemarks").val();        
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnDutyInterruptionId").val("0");
        $("#txtSearchKey").val("");
        $("#cboVehicle").data("kendoMultiColumnComboBox").value("");
        $("#cmbDriver").data("kendoComboBox").value("");
        $("#cmbProblemType").data("kendoComboBox").value("");
        $("#txtProblemDetails").val("");
        $("#txtNoticeDate").data("kendoDatePicker").value("");
        $("#txtWorkShop").val("");
        $("#txtRepairDuration").val("");
        $("#txtEstimatedReturnDate").data("kendoDatePicker").value("");
        $("#txtRemarks").val("");
    },
    GenerateDatePicker: function () {
        $("#txtNoticeDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
        $("#txtEstimatedReturnDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    LoadVehicleCombo: function () {
        var searchKey = $("#txtSearchKey").val();
        if (searchKey !== "") {
            var data = DutyInterruptionDetailsManager.GetAllVehicle(searchKey);
            data.unshift(DutyInterruptionDetailsHelper.GetUnshiftForVehicleSearch());
            var cboStyle = $("#cboVehicle").data("kendoMultiColumnComboBox");
            cboStyle.value("");
            cboStyle.setDataSource(data);
            cboStyle.select(0);
        } else {
            AjaxManager.MsgBox('warning', 'center', 'Alert', "Please type some text to search vehicle!",
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    },
    GetUnshiftForVehicleSearch() {
        return {
            VehicleId: "",
            VehicleNo: "--Select Vehicle--",
            VehicleName: "",
            VehicleCategoryName: ""
        };
    },
    LoadVehicleMulticolumn: function (ctrlId) {
        $("#" + ctrlId).kendoMultiColumnComboBox({
            dataSource: [],
            dataTextField: "VehicleNo",
            dataValueField: "VehicleId",
            columns: [
                { field: "VehicleNo", title: "Vehicle No", width: 120 },
                { field: "VehicleName", title: "Vehicle", width: 120 },
                { field: "VehicleCategoryName", title: "Vehicle Category", width: 120 }
            ],
            filter: "startswith",
            filterFields: ["VehicleNo"],
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            index: 0,
            placeholder: "---Select Vehicle---",
            height: 400

        });
    },
};