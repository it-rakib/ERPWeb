var isDelete = false;
var VehicleInfoDetailsManager = {
    SaveVehicleDetails: function () {
        
        var msg = "";
        var objVehicle = VehicleDetailsHelper.CreateVehicleObject();
        var jsonParam = JSON.stringify(objVehicle);
        var serviceUrl = _baseUrlTransport + "/api/VehicleInfo/CreateUpdateVehicleInfo";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdVehicleInfoSummary").data("kendoGrid").dataSource.read();
                            VehicleDetailsHelper.ClearForm();
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
    GetBrands() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleBrand/all");
        return list == null ? [] : list;
    },
    GetVehicleCategory() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleCategory/all");
        return list == null ? [] : list;
    },
    GetRtaOffice() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/RTACircleOffice/all");
        return list == null ? [] : list;
    },
    GetAllVendor() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/Vendor/all");
        return list == null ? [] : list;
    },
    GetAllOwnerShip() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleOwnership/all");
        return list == null ? [] : list;
    },
    GetAllVehicleCondition() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleCondition/all");
        return list == null ? [] : list;
    },
    GetGetModelByBrandId: function (brandId) {
        var objBrand = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlTransport + "/api/VehicleModel/" + brandId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objBrand = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objBrand;
    },
    GetAllVehicleModel() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleModel/all");
        return list == null ? [] : list;
    },
    GetDepartment() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/Department/all");
        return list == null ? [] : list;
    },
    GetFuelType() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/FuelType/all");
        return list == null ? [] : list;
    },
    GetDivision() {
        var list = ApiManager.GetList(_baseUrlTransport + "/api/Division/all");
        return list == null ? [] : list;
    }
};
var VehicleDetailsHelper = {
    InitVehicleDetails: function () {
        
        $("#btnSave").click(function () {
            VehicleInfoDetailsManager.SaveVehicleDetails();
        });
        $("#btnBack").click(function () {
            VehicleDetailsHelper.ClearForm();
            $("#divVehicleSummary").show();
            $("#divVehicleDetails").hide();            
        });
        VehicleDetailsHelper.GenerateDatePicker();
        VehicleDetailsHelper.GenerateNumericTextBox();
        VehicleDetailsHelper.LoadVehicleCategoryCombo("cmbVehicleCategory");
        VehicleDetailsHelper.GenerateDepartmentComboforTransport("cmbDepartment");
        VehicleDetailsHelper.LoadCmnDivisionCombo("cmbDivision");
        VehicleDetailsHelper.LoadRtaOfficeCombo("cmbRTACircleOffice");
        VehicleDetailsHelper.LoadVendorCombo("cmbVendor");
        VehicleDetailsHelper.LoadOwnershipCombo("cmbOwnerShip");
        VehicleDetailsHelper.LoadVehicleConditionCombo("cmbVehicleCondition");
        VehicleDetailsHelper.LoadBrandCombo("cmbVehicleBrand");
        VehicleDetailsHelper.LoadModelCombo("cmbVehicleModel");
        VehicleDetailsHelper.LoadFuelTypeCombo("cmbPrimaryFuelType");
        VehicleDetailsHelper.LoadFuelTypeCombo("cmbSecondaryFuelType");

        $("#cmbVehicleBrand").change(function () {
            VehicleDetailsHelper.ChangeEventOfModelCombo();
        });
    },
    FillModelForm: function (obj) {
        $("#hdnVehicleId").val(obj.VehicleId);
        $("#txtVehicleName").val(obj.VehicleName);
        $("#cmbVehicleCategory").data("kendoComboBox").value(obj.VehicleCategoryId);
        $("#cmbDepartment").data("kendoComboBox").value(obj.DepartmentId);
        $("#cmbDivision").data("kendoComboBox").value(obj.DivisionId);
        $("#txtRegistrationDate").data("kendoDatePicker").value(obj.RegistrationDate);
        $("#cmbRTACircleOffice").data("kendoComboBox").value(obj.RtacircleOfficeId);
        $("#txtLicensePlate").val(obj.LicensePlate);
        $("#cmbVendor").data("kendoComboBox").value(obj.VendorId);
        $("#txtSeatCapacity").val(obj.SeatCapacity);
        $("#cmbOwnerShip").data("kendoComboBox").value(obj.OwnerShipId);
        $("#txtVehicleManual").val(obj.VehicleManualId);
        $("#txtVehicleNo").val(obj.VehicleNo);
        $("#txtEngineNo").val(obj.EngineNo);
        if (obj.AirCondition == true) {
            $("#chkIsAirCondition").prop('checked', true)
        } else {
            $("#chkIsAirCondition").prop('checked', false)
        };
        $("#cmbVehicleCondition").data("kendoComboBox").value(obj.VehicleConditionId);
        $("#cmbVehicleBrand").data("kendoComboBox").value(obj.VehicleBrandId);
        VehicleDetailsHelper.FillModel(obj.VehicleBrandId);
        //$("#cmbVehicleModel").data("kendoComboBox").value(obj.ModelId);
        $("#txtRentalCompany").val(obj.RentalCompany);
        $("#txtRentalCompanyAdrs").val(obj.RentalCompanyAddress);
        $("#txtRentalContact").val(obj.RentalContact);
        $("#txtRentAmnt").data('kendoNumericTextBox').value(obj.RentAmnt);
        //$("#txtRentAmnt").val(obj.RentAmnt);
        $("#txtRentPayDate").data("kendoDatePicker").value(obj.RentPayDate);
        $("#txtRentAccountName").val(obj.RentAccountName);
        $("#txtRentStartDate").data("kendoDatePicker").value(obj.RentStartDate);
        $("#cmbPrimaryFuelType").data("kendoComboBox").value(obj.PrimaryFuelTypeId);
       // $("#txtPrimaryFuelLimit").val(obj.PrimaryFuelLimit);
        $("#txtPrimaryFuelLimit").data('kendoNumericTextBox').value(obj.PrimaryFuelLimit);
        $("#cmbSecondaryFuelType").data("kendoComboBox").value(obj.SecondaryFuelTypeId);
        //$("#txtSecondaryFuelLimit").val(obj.SecondaryFuelLimit);
        $("#txtSecondaryFuelLimit").data('kendoNumericTextBox').value(obj.SecondaryFuelLimit);
        $("#txtFuelPerLitre").data('kendoNumericTextBox').value(obj.FuelPerLitre);
        //$("#txtFuelPerLitre").val(obj.FuelPerLitre);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
    },
    CreateVehicleObject: function () {        
        var obj = new Object();
        
        obj.VehicleId = $("#hdnVehicleId").val();
        obj.VehicleName = $("#txtVehicleName").val().trim();
        obj.VehicleCategoryId = $("#cmbVehicleCategory").data("kendoComboBox").value() == null ? 0 : $("#cmbVehicleCategory").data("kendoComboBox").value();
        //obj.DepartmentId = $("#cmbDepartment").data("kendoComboBox").value() == null || $("#cmbDepartment").data("kendoComboBox").value() == "" ? 0 : $("#cmbDepartment").data("kendoComboBox").value();
        obj.DepartmentId = $("#cmbDepartment").data("kendoComboBox").value();
        //obj.DivisionId = $("#cmbDivision").data("kendoComboBox").value() == null || $("#cmbDivision").data("kendoComboBox").value() == "" ? 0 : $("#cmbDivision").data("kendoComboBox").value();
        obj.DivisionId = $("#cmbDivision").data("kendoComboBox").value();
        obj.RegistrationDate = $("#txtRegistrationDate").data("kendoDatePicker").value() == null ? "" : $("#txtRegistrationDate").data("kendoDatePicker").value();
        obj.RtacircleOfficeId = $("#cmbRTACircleOffice").data("kendoComboBox").value() == "" || $("#cmbRTACircleOffice").data("kendoComboBox").value() == null ? 0 : $("#cmbRTACircleOffice").data("kendoComboBox").value() ;
        obj.LicensePlate = $("#txtLicensePlate").val();
        obj.VendorId = $("#cmbVendor").data("kendoComboBox").value() == null || $("#cmbVendor").data("kendoComboBox").value() == "" ? 0 : $("#cmbVendor").data("kendoComboBox").value();
        obj.SeatCapacity = $("#txtSeatCapacity").val();
        obj.OwnerShipId = $("#cmbOwnerShip").data("kendoComboBox").value() == null || $("#cmbOwnerShip").data("kendoComboBox").value() == "" ? 0 : $("#cmbOwnerShip").data("kendoComboBox").value();
        obj.VehicleManualId = $("#txtVehicleManual").val();
        obj.VehicleNo = $("#txtVehicleNo").val() == "" || $("#txtVehicleNo").val() == null ? 0 : $("#txtVehicleNo").val();
        obj.EngineNo = $("#txtEngineNo").val() == null ? "" : $("#txtEngineNo").val();
        obj.AirCondition = $("#chkIsAirCondition").is(":checked");
        obj.VehicleConditionId = $("#cmbVehicleCondition").data("kendoComboBox").value() == null || $("#cmbVehicleCondition").data("kendoComboBox").value() == "" ? 0 : $("#cmbVehicleCondition").data("kendoComboBox").value();
        obj.VehicleBrandId = $("#cmbVehicleBrand").data("kendoComboBox").value() == null || $("#cmbVehicleBrand").data("kendoComboBox").value() == "" ? 0 : $("#cmbVehicleBrand").data("kendoComboBox").value();
        obj.ModelId = $("#cmbVehicleModel").data("kendoComboBox").value() == null || $("#cmbVehicleModel").data("kendoComboBox").value() == "" ? 0 : $("#cmbVehicleModel").data("kendoComboBox").value();
        obj.RentalCompany = $("#txtRentalCompany").val();
        obj.RentalCompanyAddress = $("#txtRentalCompanyAdrs").val();
        obj.RentalContact = $("#txtRentalContact").val();
        obj.RentAmnt = $("#txtRentAmnt").val();
        obj.RentPayDate = $("#txtRentPayDate").data("kendoDatePicker").value() == null ? null : $("#txtRentPayDate").data("kendoDatePicker").value();
        obj.RentAccountName = $("#txtRentAccountName").val();
        obj.RentStartDate = $("#txtRentStartDate").data("kendoDatePicker").value() == null ? null : $("#txtRentStartDate").data("kendoDatePicker").value();
        obj.PrimaryFuelTypeId = $("#cmbPrimaryFuelType").data("kendoComboBox").value() == null || $("#cmbPrimaryFuelType").data("kendoComboBox").value() == ""? 0 : $("#cmbPrimaryFuelType").data("kendoComboBox").value();
        obj.PrimaryFuelLimit = $("#txtPrimaryFuelLimit").val();
        obj.SecondaryFuelTypeId = $("#cmbSecondaryFuelType").data("kendoComboBox").value() == null || $("#cmbSecondaryFuelType").data("kendoComboBox").value() == "" ? 0 : $("#cmbSecondaryFuelType").data("kendoComboBox").value();
        obj.SecondaryFuelLimit = $("#txtSecondaryFuelLimit").val();
        obj.FuelPerLitre = $("#txtFuelPerLitre").val();        
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnVehicleId").val("0");
        $("#txtVehicleName").val("");
        $("#cmbVehicleCategory").data("kendoComboBox").value("");
        $("#cmbDepartment").data("kendoComboBox").value("");
        $("#cmbDivision").data("kendoComboBox").value("");
        $("#txtRegistrationDate").data("kendoDatePicker").value("");
        $("#cmbRTACircleOffice").data("kendoComboBox").value("");
        $("#txtLicensePlate").val("");
        $("#cmbVendor").data("kendoComboBox").value("");
        $("#txtSeatCapacity").val("");
        $("#cmbOwnerShip").data("kendoComboBox").value("");
        $("#txtVehicleManual").val("");
        $("#txtVehicleNo").val("");
        $("#txtEngineNo").val("");
        $("#chkIsAirCondition").prop('checked', false);
        $("#cmbVehicleCondition").data("kendoComboBox").value("");
        $("#cmbVehicleBrand").data("kendoComboBox").value("");
        $("#cmbVehicleModel").data("kendoComboBox").value("");
        $("#txtRentalCompany").val("");
        $("#txtRentalCompanyAdrs").val("");
        $("#txtRentalContact").val("");
        $("#txtRentAmnt").val("");
        $("#txtRentPayDate").data("kendoDatePicker").value("");
        $("#txtRentAccountName").val("");
        $("#txtRentStartDate").data("kendoDatePicker").value("");
        $("#cmbPrimaryFuelType").data("kendoComboBox").value("");
        $("#txtPrimaryFuelLimit").val("");
        $("#cmbSecondaryFuelType").data("kendoComboBox").value("");
        $("#txtSecondaryFuelLimit").val("");
        $("#txtFuelPerLitre").val("");
    },
    LoadBrandCombo(cboId) {
        VehicleDetailsHelper.LoadCombo(cboId, "VehicleBrandId", "VehicleBrandName", VehicleInfoDetailsManager.GetBrands(), "--Select Brand--");
    },
    LoadVehicleCategoryCombo(cboId) {
        VehicleDetailsHelper.LoadCombo(cboId, "VehicleCategoryId", "VehicleCategoryName", VehicleInfoDetailsManager.GetVehicleCategory(), "--Select Vehicle Category--");
    },
    GenerateDepartmentComboforTransport(cboId) {
        VehicleDetailsHelper.LoadCombo(cboId, "DepartmentId", "DepartmentName", VehicleInfoDetailsManager.GetDepartment(), "--Select Department--");
    },
    LoadRtaOfficeCombo(cboId) {
        VehicleDetailsHelper.LoadCombo(cboId, "RtacircleOfficeId", "RtacircleOfficeName", VehicleInfoDetailsManager.GetRtaOffice(), "--Select Office--");
    },
    LoadCmnDivisionCombo(cboId) {
        VehicleDetailsHelper.LoadCombo(cboId, "DivisionId", "DivisionName", VehicleInfoDetailsManager.GetDivision(), "--Select Division--");
    },
    LoadVendorCombo(cboId) {
        VehicleDetailsHelper.LoadCombo(cboId, "VendorId", "VendorName", VehicleInfoDetailsManager.GetAllVendor(), "--Select Vendor--");
    },
    LoadOwnershipCombo(cboId) {
        VehicleDetailsHelper.LoadCombo(cboId, "OwnerShipId", "OwnerShipName", VehicleInfoDetailsManager.GetAllOwnerShip(), "--Select Owner--");
    },
    LoadVehicleConditionCombo(cboId) {
        VehicleDetailsHelper.LoadCombo(cboId, "VehicleConditionId", "VehicleConditionName", VehicleInfoDetailsManager.GetAllVehicleCondition(), "--Select Condition--");
    },
    LoadModelCombo(cboId) {
        VehicleDetailsHelper.LoadCombo(cboId, "ModelId", "ModelName", [], "--Select Model--");
    },
    LoadFuelTypeCombo(cboId) {
        VehicleDetailsHelper.LoadCombo(cboId, "FueltypeId", "FuelTypeName", VehicleInfoDetailsManager.GetFuelType(), "--Select Fuel Type--");
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
        $("#txtRegistrationDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
        $("#txtRentPayDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
        $("#txtRentStartDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtRentAmnt").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtPrimaryFuelLimit").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtSecondaryFuelLimit").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtFuelPerLitre").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });        
    },
    ChangeEventOfModelCombo: function () {
        var brandId = $("#cmbVehicleBrand").data("kendoComboBox").value();
        var data = VehicleInfoDetailsManager.GetGetModelByBrandId(brandId);
        var modelCombo = $("#cmbVehicleModel").data("kendoComboBox");
        modelCombo.value("");
        modelCombo.text("");
        modelCombo.setDataSource(data);
    },
    FillModel: function (obj) {
        var modelObj = [];
        var modelData = VehicleInfoDetailsManager.GetGetModelByBrandId(obj);
        $("#cmbVehicleModel").data("kendoComboBox").setDataSource(modelData);
        if (modelData.length > 0) {
            var modelObj = modelData[0];
            $("#cmbVehicleModel").data("kendoComboBox").value(modelObj.ModelId);
        }
        else {
            $("#cmbVehicleModel").data("kendoComboBox").value("");
        }
    }
};