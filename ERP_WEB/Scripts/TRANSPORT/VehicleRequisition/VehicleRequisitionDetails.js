var isDelete = false;
var empList = [];
var VehicleRequisitionDetailsManager = {
    SaveVehicleRequisitionDetails: function () {
        var msg = "";
        var objVehicle = VehicleRequisitionDetailsHelper.CreateVehicleRequisitionObject(1);
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
                            //VehicleRequisitionDetailsHelper.ClearForm();
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
        var objContact = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlTransport + "/api/EmployeeInfo/all";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objStyle = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objContact;

        //var list = ApiManager.GetList(_baseUrlTransport + "/api/EmployeeInfo/all");
        //return list == null ? [] : list;
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
var VehicleRequisitionDetailsHelper = {
    InitVehicleRequisitionDetails: function () {

        $("#btnSave").click(function () {
            VehicleRequisitionDetailsManager.SaveVehicleRequisitionDetails();
        });
        $("#btnBack").click(function () {
            VehicleRequisitionDetailsHelper.ClearForm();
            VehicleRequisitionDetailsHelper.ClearPassengerForm();
            $("#divVehicleRequisitionSummary").show();
            $("#divVehicleRequisitionDetails").hide();
        });
        $("#btnAddEmp").click(function () {
            if ($("#btnAddEmp").text() === "Add Employee") {
                VehicleRequisitionDetailsHelper.AddToListPassenger();
            } else {
                VehicleRequisitionDetailsHelper.UpdateToListPassenger();
            }
        });
        $("#btnClearAll").click(function () {
            VehicleRequisitionDetailsHelper.ClearPassengerForm();
        });
        VehicleRequisitionDetailsHelper.GenerateDatePicker();
        VehicleRequisitionDetailsHelper.LoadVehicleRequisitionTypeCombo("cmbVehicleRequisitionType");
        VehicleRequisitionDetailsHelper.GeneratebVehicleAcquisitionTypeCombo("cmbVehicleAcquisitionType");
        VehicleRequisitionDetailsHelper.LoadRequisitionPurposeCombo("cmbVehicleRequisitionPurpose");
        VehicleRequisitionDetailsHelper.LoadVehicleTypeCombo("cmbVehicleType");
        VehicleRequisitionDetailsHelper.LoadSupervisorCombo("cmbSupervisor");
        VehicleRequisitionDetailsHelper.LoadEmployeeCombo("cmbEmployee");
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
            value = h-12 + ':' + m + " PM";
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
            value = h-12 + ':' + m + " PM";
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
        VehicleRequisitionDetailsHelper.FillRequisitionPassenger(obj.VehicleRequisitionId);
    },
    CreateVehicleRequisitionObject: function (value) {
        var obj = new Object();
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
        obj.Status = value;
        obj.SupervisorId = $("#cmbSupervisor").data("kendoComboBox").value();
        obj.VehicleRequisitionTypeId = $("#cmbVehicleRequisitionType").data("kendoComboBox").value();
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        obj.VehicleAcquisitionTypeId = $("#cmbVehicleAcquisitionType").data("kendoComboBox").value();
        obj.VehicleReqPassengers = VehicleRequisitionDetailsHelper.CreateRequisitionEmployeeObject();
        return obj;
    },
    CreateRequisitionEmployeeObject: function () {
        var requisitionEmpGrid = $("#grdRequisitionEmp").data("kendoGrid");
        var data = requisitionEmpGrid.dataSource.data();
        $.each(data, function (i, item) {
            data[i].VehiclePassengerId = 0;
            data[i].VehicleRequisitionId = 0;
        });
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
        VehicleRequisitionDetailsHelper.LoadCombo(cmbVehicleRequisitionType, "VehicleRequisitionTypeId", "VehicleRequisitionTypeName", VehicleRequisitionDetailsManager.GetRequisitionType(), "--Select Requisition Type--");
    },
    GeneratebVehicleAcquisitionTypeCombo(cmbVehicleAcquisitionType) {
        VehicleRequisitionDetailsHelper.LoadCombo(cmbVehicleAcquisitionType, "VehicleAcquisitionTypeId", "VehicleAcquisitionTypeName", VehicleRequisitionDetailsManager.GetVehicleAcquisitionType(), "--Select Acquisition Type--");
    },
    LoadRequisitionPurposeCombo(cmbVehicleRequisitionPurpose) {
        VehicleRequisitionDetailsHelper.LoadCombo(cmbVehicleRequisitionPurpose, "VehicleRequisitionPurposeId", "VehicleRequisitionPurposeName", VehicleRequisitionDetailsManager.GetVehicleRequisitionPurpose(), "--Select Requisition Purpose--");
    },
    LoadVehicleTypeCombo(cboId) {
        VehicleRequisitionDetailsHelper.LoadCombo(cboId, "VehicleCategoryId", "VehicleCategoryName", VehicleRequisitionDetailsManager.GetVehicleType(), "--Select Vehicle Type--");
    },
    LoadSupervisorCombo(cboId) {
        VehicleRequisitionDetailsHelper.LoadCombo(cboId, "SupervisorId", "SupervisorName", VehicleRequisitionDetailsManager.GetSupervisor(), "--Select Supervisor--");
    },
    LoadEmployeeCombo: function (ctrlId) {
        $("#" + ctrlId).kendoMultiColumnComboBox({
            dataSource: VehicleRequisitionDetailsManager.GetAllEmployee(),
            dataTextField: "Name",
            dataValueField: "EmpId",
            columns: [
                { field: "Name", title: "Name", width: 200 },
                { field: "EmpCode", title: "User Id", width: 200 },
                { field: "DesignationName", title: "Designation", width: 200 },
                { field: "DepartmentName", title: "Department", width: 200 }

            ],
            filter: "startswith",
            filterFields: ["Name", "EmpCode", "DepartmentName"],
            //footerTemplate: 'Total #: instance.dataSource.total() # items found',
            index: 1,
            height: 400,
            placeholder: "---Select Employee---"
        });
    },
    LoadEmployeeCombo(cboId) {
        VehicleRequisitionDetailsHelper.LoadCombo(cboId, "EmpId", "Name", VehicleRequisitionDetailsManager.GetAllEmployee(), "--Select Employee--");
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
        
        var passenger = VehicleRequisitionDetailsManager.GetAllPassengerByRequisitionId(vehicleRequisitionId);
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
            VehicleRequisitionDetailsHelper.ClearPassengerForm();

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
            VehicleRequisitionDetailsHelper.ClearPassengerForm();
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