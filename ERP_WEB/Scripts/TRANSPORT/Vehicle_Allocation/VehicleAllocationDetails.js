var isDelete = false;
var validationSuccess = $("#validation-success");
var VehicleAllocationDetailsManager = {
    SaveVehicleAllocationDetails: function () {
        var msg = "";        
        var objAllocation = VehicleAllocationDetailsHelper.CreateVehicleAllocationObject();
        var jsonParam = JSON.stringify(objAllocation);
        debugger;
        var serviceUrl = _baseUrlTransport + "/api/VehicleAllocation/CreateUpdateVehicleAllocation";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdAllocationSummary").data("kendoGrid").dataSource.read();
                            VehicleAllocationDetailsHelper.ClearForm();
                            $("#divAllocationSummary").show();
                            $("#divAllocationDetails").hide();
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
    GetDriver() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/Driver/all");
        return list == null ? [] : list;
    },
    GetAllVehicle() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleInfo/all");
        return list == null ? [] : list;
    },
    GetRequisitionNo() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleRequisition/all");
        return list == null ? [] : list;
    },
    GetAllRoute() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleRoute/all");
        return list == null ? [] : list;
    },
    GetReferenceCompany() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/Company/all");
        //var list = ApiManager.GetList("../Common/GetAllCompany2/");
        return list == null ? [] : list;
    },
    GetReference(companyId) {
        var objReference = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/Company/GetAllUnitByCompanyId/" + companyId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objReference = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objReference;
    }
};

var VehicleAllocationDetailsHelper = {
    InitAllocationDetails: function () {
        VehicleAllocationDetailsHelper.LoadRequisitionCombo("cboRequisitionNo");
        VehicleAllocationDetailsHelper.LoadVehicleCombo("cmbVehicle");
        VehicleAllocationDetailsHelper.LoadDriverCombo("cmbDriver");
        VehicleAllocationDetailsHelper.LoadVehicleRoute("cmbVehicleRoute");
        VehicleAllocationDetailsHelper.LoadCompanyCombo("cmbCompany");
        VehicleAllocationDetailsHelper.LoadUnitCombo("cmbUnit");
        $("#cmbCompany").change(function () {
            VehicleAllocationDetailsHelper.ChangeEventOfCompnayCombo();
        });

        $("#btnSave").click(function () {
            VehicleAllocationDetailsManager.SaveVehicleAllocationDetails();
        });

        $("#btnBack").click(function () {
            VehicleAllocationDetailsHelper.ClearForm();
            $("#divAllocationSummary").show();
            $("#divAllocationDetails").hide();
        });
    },
    LoadRequisitionCombo(cboRequisitionNo) {
        UtilityHelper.LoadCombo(cboRequisitionNo, "VehicleRequisitionId", "RequisitionNo", VehicleAllocationDetailsManager.GetRequisitionNo(), "--Select Requisition No--");
    },
    LoadVehicleCombo(cmbVehicle) {
        UtilityHelper.LoadCombo(cmbVehicle, "VehicleId", "VehicleName", VehicleAllocationDetailsManager.GetAllVehicle(), "--Select Vehicle--");
    },
    LoadDriverCombo(cmbDriver) {
        UtilityHelper.LoadCombo(cmbDriver, "DriverId", "DriverName", VehicleAllocationDetailsManager.GetDriver(), "--Select Driver--");
    },
    LoadVehicleRoute(cmbVehicleRoute) {
        UtilityHelper.LoadCombo(cmbVehicleRoute, "VehicleRouteId", "VehicleRouteName", VehicleAllocationDetailsManager.GetAllRoute(), "--Select Route--");
    },
    LoadCompanyCombo(cmbCompany) {
        UtilityHelper.LoadCombo(cmbCompany, "CompanyId", "CompanyName", VehicleAllocationDetailsManager.GetReferenceCompany(), "--Select Company--");
    },
    LoadUnitCombo(cmbUnit) {
        UtilityHelper.LoadCombo(cmbUnit, "UnitId", "UnitName", [], "--Select Unit--");
    },
    ChangeEventOfCompnayCombo: function () {
        var companyId = $("#cmbCompany").data("kendoComboBox").value();
        var data = VehicleAllocationDetailsManager.GetReference(companyId);
        var unitCombo = $("#cmbUnit").data("kendoComboBox");
        unitCombo.value("");
        unitCombo.text("");
        unitCombo.setDataSource(data);
    },
    FillAllocationForm: function (obj) {
        $("#hdnVehicleAllocationId").val(obj.VehicleAllocationId);
        $("#cboRequisitionNo").data("kendoComboBox").value(obj.VehicleRequisitionId);
        $("#cmbVehicle").data("kendoComboBox").value(obj.VehicleId);
        $("#cmbDriver").data("kendoComboBox").value(obj.DriverId);
        $("#cmbVehicleRoute").data("kendoComboBox").value(obj.VehicleRouteId);
        $("#txtParkingLocation").val(obj.ParkingLocation);
        $("#txtParkingCost").val(obj.ParkingCost);
        $("#cmbCompany").data("kendoComboBox").value(obj.CompanyId);
        VehicleAllocationDetailsHelper.FillUnit(obj.CompanyId);
        //$("#cmbUnit").data("kendoComboBox").value(obj.UnitId);
        $("#txtRemarks").val(obj.Remarks);
    },

    CreateVehicleAllocationObject: function (allocationObj) {
        var obj = new Object();
        obj.VehicleAllocationId = $("#hdnVehicleAllocationId").val();
        obj.VehicleRequisitionId = $("#cboRequisitionNo").data("kendoComboBox").value();
        obj.VehicleId = $("#cmbVehicle").data("kendoComboBox").value();
        obj.DriverId = $("#cmbDriver").data("kendoComboBox").value();
        obj.VehicleRouteId = $("#cmbVehicleRoute").data("kendoComboBox").value();
        obj.ParkingLocation = $("#txtParkingLocation").val();
        var cost = $("#txtParkingCost").val();
        if (cost == "") {
            obj.ParkingCost = 0;
        }
        else {
            obj.ParkingCost = cost;
        }
        
        obj.CompanyId = $("#cmbCompany").data("kendoComboBox").value();
        obj.UnitId = $("#cmbUnit").data("kendoComboBox").value();
        obj.Remarks = $("#txtRemarks").val();
        debugger;
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnVehicleAllocationId").val("0");
        $("#cboRequisitionNo").data("kendoComboBox").value("");
        $("#cmbVehicle").data("kendoComboBox").value("");
        $("#cmbDriver").data("kendoComboBox").value("");
        $("#cmbVehicleRoute").data("kendoComboBox").value("");
        $("#txtParkingLocation").val("");
        $("#txtParkingCost").val("");
        $("#cmbCompany").data("kendoComboBox").value("");
        $("#cmbUnit").data("kendoComboBox").value("");
        $("#txtRemarks").val("");
    },
    FillUnit: function (obj) {

        var unitObj = [];
        var unitData = VehicleAllocationDetailsManager.GetReference(obj);
        $("#cmbUnit").data("kendoComboBox").setDataSource(unitData);
        if (unitData.length > 0) {
            var unitObj = unitData[0];
            $("#cmbUnit").data("kendoComboBox").value(unitObj.UnitId);
        }
        else {
            $("#cmbUnit").data("kendoComboBox").value("");
        }
    },
    //LoadVehicleCombo: function () {
    //    var searchKey = $("#txtSearchKey").val();
    //    if (searchKey !== "") {
    //        var data = VehicleAllocationDetailsManager.GetAllVehicle(searchKey);
    //        data.unshift(VehicleAllocationDetailsHelper.GetUnshiftForVehicleSearch());
    //        var cboStyle = $("#cboVehicle").data("kendoMultiColumnComboBox");
    //        cboStyle.value("");
    //        cboStyle.setDataSource(data);
    //        cboStyle.select(0);
    //    } else {
    //        AjaxManager.MsgBox('warning', 'center', 'Alert', "Please type some text to search vehicle!",
    //            [{
    //                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
    //                    $noty.close();
    //                }
    //            }]);
    //    }
    //},
    //GetUnshiftForVehicleSearch() {
    //    return {
    //        VehicleId: "",
    //        VehicleNo: "--Select Vehicle--",
    //        VehicleName: "",
    //        VehicleCategoryName: ""
    //    };
    //},
    //LoadRequisitionMultiCombo: function (ctrlId) {
    //    $("#" + ctrlId).kendoMultiColumnComboBox({
    //        dataSource: [],
    //        dataTextField: "RequisitionNo",
    //        dataValueField: "VehicleRequisitionId",
    //        columns: [
    //            { field: "RequisitionNo", title: "Requisition No", width: 120 },
    //            { field: "VehicleName", title: "Vehicle", width: 120 },
    //            { field: "VehicleCategoryName", title: "Vehicle Category", width: 120 }
    //        ],
    //        filter: "startswith",
    //        filterFields: ["VehicleNo"],
    //        footerTemplate: 'Total #: instance.dataSource.total() # items found',
    //        index: 0,
    //        placeholder: "---Select Vehicle---",
    //        height: 400

    //    });
    //},
};