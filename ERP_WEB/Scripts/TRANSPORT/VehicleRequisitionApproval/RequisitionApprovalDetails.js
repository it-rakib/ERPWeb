var isDelete = false;
var empList = [];
var VehicleRequisitionApprovalDetailsManager = {
    SaveVehicleRequisitionApprovalDetails: function () {
        var msg = "";
        var objVehicle = VehicleRequisitionApprovalDetailsHelper.CreateVehicleRequisitionObject(2);
        var jsonParam = JSON.stringify(objVehicle);
        var serviceUrl = _baseUrlTransport + "/api/VehicleRequisition/CreateUpdateVehicleRequisition";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdVehicleRequisition").data("kendoGrid").dataSource.read();
                            //VehicleRequisitionApprovalDetailsHelper.ClearForm();
                            $("#divVehicleRequisitionSummary").show();
                            $("#divVehicleRequisitionDetails").hide();
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
    SaveVehicleRequisitionRejectDetails: function () {
        var msg = "";
        var objVehicle = VehicleRequisitionApprovalDetailsHelper.CreateVehicleRequisitionObject(3);
        var jsonParam = JSON.stringify(objVehicle);
        var serviceUrl = _baseUrlTransport + "/api/VehicleRequisition/CreateUpdateVehicleRequisition";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdVehicleRequisition").data("kendoGrid").dataSource.read();
                            //VehicleRequisitionApprovalDetailsHelper.ClearForm();
                            $("#divVehicleRequisitionSummary").show();
                            $("#divVehicleRequisitionDetails").hide();
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
    GetRequisitionType() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/RequisitionType/all");
        return list == null ? [] : list;
    },
    GetVehicleAcquisitionType() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleAcquisitionType/all");
        return list == null ? [] : list;
    },
    GetVehicleRequisitionPurpose() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/RequisitionPurpose/all");
        return list == null ? [] : list;
    },
    GetVehicleType() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleCategory/all");
        return list == null ? [] : list;
    },
    GetAllEmployee() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/EmployeeInfo/all");
        return list == null ? [] : list;
    },
    GetAllPassengerByRequisitionId: function (vehicleRequisitionId) {
        var objDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlTransport + "/api/VehicleRequisition/GetAllVehicleReqPassenger/" + vehicleRequisitionId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objDetail;
    },
    GetSupervisor() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/EmpOrganogram/all");
        return list == null ? [] : list;
    }
};
var VehicleRequisitionApprovalDetailsHelper = {
    InitVehicleRequisitionDetails: function () {

        $("#btnApprove").click(function () {
            VehicleRequisitionApprovalDetailsManager.SaveVehicleRequisitionApprovalDetails();
        });
        $("#btnReject").click(function () {
            VehicleRequisitionApprovalDetailsManager.SaveVehicleRequisitionRejectDetails();
        });
        $("#btnBack").click(function () {
            VehicleRequisitionApprovalDetailsHelper.ClearForm();
            VehicleRequisitionApprovalDetailsHelper.ClearPassengerForm();
            $("#divVehicleRequisitionSummary").show();
            $("#divVehicleRequisitionDetails").hide();
        });
        $("#btnAddEmp").click(function () {
            if ($("#btnAddEmp").text() === "Add Employee") {
                VehicleRequisitionApprovalDetailsHelper.AddToListPassenger();
            } else {
                VehicleRequisitionApprovalDetailsHelper.UpdateToListPassenger();
            }
        });
        $("#btnClearAll").click(function () {
            VehicleRequisitionApprovalDetailsHelper.ClearPassengerForm();
        });
        VehicleRequisitionApprovalDetailsHelper.GenerateDatePicker();
        VehicleRequisitionApprovalDetailsHelper.LoadVehicleRequisitionTypeCombo("cmbVehicleRequisitionType");
        VehicleRequisitionApprovalDetailsHelper.GeneratebVehicleAcquisitionTypeCombo("cmbVehicleAcquisitionType");
        VehicleRequisitionApprovalDetailsHelper.LoadRequisitionPurposeCombo("cmbVehicleRequisitionPurpose");
        VehicleRequisitionApprovalDetailsHelper.LoadVehicleTypeCombo("cmbVehicleType");
        VehicleRequisitionApprovalDetailsHelper.LoadSupervisorCombo("cmbSupervisor");
        VehicleRequisitionApprovalDetailsHelper.LoadEmployeeCombo("cmbEmployee");
    },
    FillVehicleRequisitionForm: function (obj) {
        $("#hdnVehicleRequisitionId").val(obj.VehicleRequisitionId);
        //$("#hdnVehiclePassengerId").val("0");
        $("#cmbVehicleRequisitionType").data("kendoComboBox").value(obj.VehicleRequisitionTypeId);
        $("#txtRequisitionNo").val(obj.RequisitionNo);
        $("#txtRequisitionDate").data("kendoDatePicker").value(obj.RequisitionDate);
        $("#cmbVehicleAcquisitionType").data("kendoComboBox").value(obj.VehicleAcquisitionTypeId);
        $("#cmbVehicleRequisitionPurpose").data("kendoComboBox").value(obj.VehicleRequisitionPurposeId);
        $("#cmbVehicleType").data("kendoComboBox").value(obj.VehicleTypeId);
        $("#txtWhereFrom").val(obj.WhereFrom);
        $("#txtWhereTo").val(obj.WhereTo);
        //$("#txtTimeTo").data("kendoTimePicker").value(obj.TimeTo);
        var value;
        var d = new Date(obj.TimeTo);
        var h = (d.getHours() < 10 ? '0' : '') + d.getHours();
        var m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        if (h < 12) {
            value = h + ':' + m + " AM";
        }
        else {
            value = h - 12 + ':' + m + " PM";
        }

        debugger;
        var timePicker = $("#txtTimeTo").data("kendoTimePicker");
        timePicker.value(value);

        //$("#txtTimeFrom").data("kendoTimePicker").value(obj.TimeFrom);
        var d = new Date(obj.TimeFrom);
        var h = (d.getHours() < 10 ? '0' : '') + d.getHours();
        var m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        if (h < 12) {
            value = h + ':' + m + " AM";
        }
        else {
            value = h - 12 + ':' + m + " PM";
        }

        debugger;
        var timePicker = $("#txtTimeFrom").data("kendoTimePicker");
        timePicker.value(value);
        $("#txtToleranceDuration").val(obj.ToleranceDuration);
        $("#txtNoOfPassenfer").val(obj.NoOfPassenfer);
        $("#txtPickUp").val(obj.PickUp);
        $("#cmbSupervisor").data("kendoComboBox").value(obj.SupervisorId);
        $("#txtDetails").val(obj.Details);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
        VehicleRequisitionApprovalDetailsHelper.FillRequisitionPassenger(obj.VehicleRequisitionId);
    },
    CreateVehicleRequisitionObject: function (value) {
        var obj = new Object();
        debugger;
        obj.VehicleRequisitionId = $("#hdnVehicleRequisitionId").val();
        obj.RequisitionNo = $("#txtRequisitionNo").val();
        obj.TimeTo = $("#txtTimeTo").data("kendoTimePicker").value();
        obj.VehicleTypeId = $("#cmbVehicleType").data("kendoComboBox").value();
        obj.ToleranceDuration = $("#txtToleranceDuration").val();
        obj.WhereFrom = $("#txtWhereFrom").val();
        obj.NoOfPassenfer = $("#txtNoOfPassenfer").val();
        obj.WhereTo = $("#txtWhereTo").val();
        obj.PickUp = $("#txtPickUp").val();
        obj.VehicleRequisitionPurposeId = $("#cmbVehicleRequisitionPurpose").data("kendoComboBox").value();
        obj.RequisitionDate = $("#txtRequisitionDate").data("kendoDatePicker").value();
        obj.Details = $("#txtDetails").val();
        obj.TimeFrom = $("#txtTimeFrom").data("kendoTimePicker").value();
        //var status = $("")
        obj.Status = value;
        obj.SupervisorId = $("#cmbSupervisor").data("kendoComboBox").value();
        obj.VehicleRequisitionTypeId = $("#cmbVehicleRequisitionType").data("kendoComboBox").value();
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        obj.VehicleAcquisitionTypeId = $("#cmbVehicleAcquisitionType").data("kendoComboBox").value();
        obj.VehicleReqPassengers = VehicleRequisitionApprovalDetailsHelper.CreateRequisitionEmployeeObject();

        debugger;
        return obj;
    },
    CreateRequisitionEmployeeObject: function () {
        var requisitionEmpGrid = $("#grdRequisitionEmp").data("kendoGrid");
        var data = requisitionEmpGrid.dataSource.data();
        $.each(data, function (i, item) {
            data[i].VehiclePassengerId = 0;
            data[i].VehicleRequisitionId = 0;
        });
        debugger;
        return data;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnVehicleRequisitionId").val("0");
        $("#hdnVehiclePassengerId").val("0");
        $("#txtRequisitionNo").val("");
        $("#cmbVehicleRequisitionType").data("kendoComboBox").value("");
        $("#txtRequisitionDate").data("kendoDatePicker").value("");
        $("#cmbVehicleAcquisitionType").data("kendoComboBox").value("");
        $("#cmbVehicleRequisitionPurpose").data("kendoComboBox").value("");
        $("#cmbVehicleType").data("kendoComboBox").value("");
        $("#txtWhereFrom").val("");
        $("#txtWhereTo").val("");
        $("#txtTimeTo").data("kendoTimePicker").value("");
        $("#txtTimeFrom").data("kendoTimePicker").value("");
        $("#txtToleranceDuration").val("");
        $("#txtNoOfPassenfer").val("");
        $("#txtPickUp").val("");
        $("#cmbSupervisor").data("kendoComboBox").value("");
        $("#txtDetails").val("");
        $("#cmbEmployee").data("kendoComboBox").value("");
        $("#txtStoppage").val("");
        $("#grdRequisitionEmp").data("kendoGrid").dataSource.data([]);
    },
    LoadVehicleRequisitionTypeCombo(cmbVehicleRequisitionType) {
        VehicleRequisitionApprovalDetailsHelper.LoadCombo(cmbVehicleRequisitionType, "VehicleRequisitionTypeId", "VehicleRequisitionTypeName", VehicleRequisitionApprovalDetailsManager.GetRequisitionType(), "--Select Requisition Type--");
    },
    GeneratebVehicleAcquisitionTypeCombo(cmbVehicleAcquisitionType) {
        VehicleRequisitionApprovalDetailsHelper.LoadCombo(cmbVehicleAcquisitionType, "VehicleAcquisitionTypeId", "VehicleAcquisitionTypeName", VehicleRequisitionApprovalDetailsManager.GetVehicleAcquisitionType(), "--Select Acquisition Type--");
    },
    LoadRequisitionPurposeCombo(cmbVehicleRequisitionPurpose) {
        VehicleRequisitionApprovalDetailsHelper.LoadCombo(cmbVehicleRequisitionPurpose, "VehicleRequisitionPurposeId", "VehicleRequisitionPurposeName", VehicleRequisitionApprovalDetailsManager.GetVehicleRequisitionPurpose(), "--Select Requisition Purpose--");
    },
    LoadVehicleTypeCombo(cboId) {
        VehicleRequisitionApprovalDetailsHelper.LoadCombo(cboId, "VehicleCategoryId", "VehicleCategoryName", VehicleRequisitionApprovalDetailsManager.GetVehicleType(), "--Select Vehicle Type--");
    },
    LoadSupervisorCombo(cboId) {
        VehicleRequisitionApprovalDetailsHelper.LoadCombo(cboId, "SupervisorId", "SupervisorName", VehicleRequisitionApprovalDetailsManager.GetSupervisor(), "--Select Supervisor--");
    },
    LoadEmployeeCombo(cboId) {
        VehicleRequisitionApprovalDetailsHelper.LoadCombo(cboId, "EmpId", "Name", VehicleRequisitionApprovalDetailsManager.GetAllEmployee(), "--Select Employee--");
    },
    LoadCombo(cboId, valueField, textField, dataList, placeholder) {
        if (cboId.trim() == "" || valueField.trim() == "" || textField.trim() == "") return null;
        dataList = dataList == "" ? [] : dataList;
        var obj = new Object();
        obj[valueField] = AjaxManager.DefaultGuidId();
        obj[textField] = "---Select---";
        dataList.unshift(obj);
        $("#" + cboId).kendoComboBox({
            placeholder: placeholder,
            dataValueField: valueField,
            dataTextField: textField,
            dataSource: dataList,
            //index: 0,
            suggest: true,
            filter: "contains"
            //change: function () {

            //}
        });
    },
    GenerateDatePicker: function () {
        $("#txtRequisitionDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
        $("#txtTimeTo").kendoTimePicker({
            dateInput: true
        });
        $("#txtTimeFrom").kendoTimePicker({
            //format: "HH:MM",
            //value: new Date()
            dateInput: true
        });
    },
    FillPassengerForm: function (obj) {
        $("#btnAddEmp").text("Update Employee");
        $("#btnAddEmp").addClass("fa fa-edit");
        $("#cmbEmployee").data("kendoComboBox").value(obj.EmpId);
        $("#txtStoppage").val(obj.Stoppage);
    },
    FillRequisitionPassenger: function (vehicleRequisitionId) {

        var passenger = VehicleRequisitionApprovalDetailsManager.GetAllPassengerByRequisitionId(vehicleRequisitionId);
        var passengerSummaryGrid = $("#grdRequisitionEmp").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: passenger,
            schema: {
                model: {
                    fields: {
                    }
                }
            }
        });
        passengerSummaryGrid.setDataSource(gridDataSource);
        empList = passenger;
    },
    AddToListPassenger: function () {

        var empName = $("#cmbEmployee").data("kendoComboBox");
        var stoppage = $("#txtStoppage").val();
        var passengerGrid = $("#grdRequisitionEmp").data("kendoGrid");
        if (empName !== "" || empName !== null) {
            var gridData = passengerGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                var empcombo = empName.value();

            }

            var obj = new Object();
            obj.VehiclePassengerId = 0;
            obj.VehicleRequisitionId = 0;
            obj.EmpId = empName.value();
            obj.Name = empName.text();
            obj.Stoppage = stoppage;

            empList.unshift(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: empList,
                schema: {
                    model: {
                        fields: {
                            Edit: {
                                editable: false
                            }
                        }
                    }
                }
            });

            passengerGrid.setDataSource(gridDataSource);
            VehicleRequisitionApprovalDetailsHelper.ClearPassengerForm();

        } else {
            if (emp === "") {
                AjaxManager.NotifyMsg("cmbEmployee", "error", "right", 1500, "Required");
            }
        }
    },
    UpdateToListPassenger: function () {

        var emp = $("#cmbEmployee").data("kendoComboBox").value();
        var stoppage = $("#txtStoppage").val();
        var grid = $("#grdRequisitionEmp").data("kendoGrid");

        var selectedItem = grid.dataItem(grid.select());

        if (emp !== "") {

            var obj = new Object();
            obj.VehiclePassengerId = 0;
            obj.VehicleRequisitionId = 0;
            obj.EmpId = emp;
            obj.Stoppage = stoppage;

            for (var i = 0; i < empList.length; i++) {
                if (empList[i].VehiclePassengerId == selectedItem.VehiclePassengerId && empList[i].VehicleRequisitionId == selectedItem.VehicleRequisitionId) {
                    empList.splice(i, 1);
                    break;
                }
            }

            empList.unshift(obj);
            selectedItem.set('VehiclePassengerId', obj.VehiclePassengerId);
            selectedItem.set('VehicleRequisitionId', obj.VehicleRequisitionId);
            selectedItem.set('EmpId', obj.EmpId);
            selectedItem.set('Stoppage', obj.Stoppage);

            $("#btnAddEmp").text("Add Employee");
            $("#btnAddEmp").addClass("fas fa-arrow-down");
            VehicleRequisitionApprovalDetailsHelper.ClearPassengerForm();
        } else {
            if (emp === "") {
                AjaxManager.NotifyMsg("cmbEmployee", "error", "right", 1500, "Required");
            }
            //if (bayaDeedDate === "" && bayaDeedDate == null) {
            //    AjaxManager.NotifyMsg("txtBayaDeedDate", "error", "right", 1500, "Required");
            //}
        }
    },
    ClearPassengerForm: function () {
        $("#cmbEmployee").data("kendoComboBox").value("");
        $("#txtStoppage").val("");
    }
};