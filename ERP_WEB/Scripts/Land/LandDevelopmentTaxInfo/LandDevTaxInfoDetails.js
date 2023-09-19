
var files = [];
var isDelete = false;

var LandDevTaxInfoDetailsManager = {
    SaveLandDevTaxDetails: function () {
        var msg = "";
        
        if (LandDevTaxInfoDetailsHelper.ValidateForm()) {
            var createOrUpdateLandDevTaxCommand = LandDevTaxInfoDetailsHelper.CreateLandDevTaxObject();
            var jsonParam = JSON.stringify(createOrUpdateLandDevTaxCommand);
            var serviceUrl = _baseUrlLand + "/api/LandDevelopmentTax/CreateOrUpdateLandDevelopmentTax";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdLandDevTaxSummary").data("kendoGrid").dataSource.read();
                            $("#divLandDevTaxInfoSummary").show();
                            $("#divLandDevTaxInfoDetails").hide();
                            LandDevTaxInfoDetailsHelper.ClearForm();
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
    GetAllHoldingNoList() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/MutationMaster/GetAllHoldingNoList");
        return list == null ? [] : list;
    },
    GetAllCmnBanglaYear() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/CmnBanglaYear/all");
        return list == null ? [] : list;
    },
    GetMutationMasterById: function (mutationMasterId) {
        var objMutationMaster = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/MutationMaster/" + mutationMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objMutationMaster = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objMutationMaster;
    },
}

var LandDevTaxInfoDetailsHelper = {
    InitLandDevTaxInfoDetails: function () {
        $("#btnAddNew").click(function () {
            $("#divLandDevTaxInfoSummary").hide();
            $("#divLandDevTaxInfoDetails").show();
            LandDevTaxInfoDetailsHelper.ClearForm();
        });
        $("#btnSubmitApplication").click(function() {
            LandDevTaxInfoDetailsManager.SaveLandDevTaxDetails();
        });
        $("#btnCancelApplication").click(function () {
            $("#divLandDevTaxInfoSummary").show();
            $("#divLandDevTaxInfoDetails").hide();
            LandDevTaxInfoDetailsHelper.ClearForm();
        });
        LandHelper.LoadCmnDivisionCombo("cmbCmnDivision");
        LandHelper.LoadCmnDistrictCombo("cmbCmnDistrict");
        LandHelper.LoadCmnUpozilaCombo("cmbCmnUpozila");
        LandHelper.LoadCmnMouzaCombo("cmbCmnMouza");
        LandDevTaxInfoDetailsHelper.GenerateDatePicker();
        LandDevTaxInfoDetailsHelper.LoadHoldingNoCombo("cmbHoldingNo");
        LandDevTaxInfoDetailsHelper.LoadFromDateCombo("cmbFromDate");
        LandDevTaxInfoDetailsHelper.LoadToDateCombo("cmbToDate");
        LandDevTaxInfoDetailsHelper.GenerateNumericTextBox();
        $("#cmbHoldingNo").change(function() {
            LandDevTaxInfoDetailsHelper.ChangeEventOfHoldingNoCombo();
        });
    },
    CreateLandDevTaxObject: function() {
        var obj = new Object();
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        obj.LandDevelopmentTaxId = $("#hdnLandDevelopmentTaxId").val();
        obj.MutationMasterId = $("#cmbHoldingNo").data("kendoComboBox").value();
        obj.DakhilaNo = $("#txtDakhilaNo").val();
        obj.EntryDate = $("#txtEntryDate").data("kendoDatePicker").value();
        obj.FromDate = $("#cmbFromDate").data("kendoComboBox").value();
        obj.ToDate = $("#cmbToDate").data("kendoComboBox").value();
        obj.TaxAmount = $("#txtTaxAmount").data("kendoNumericTextBox").value();
        obj.Remarks = $("#txtRemarks").val();
        obj.FileRemarks = $("#txtFileRemarks").val();
        obj.DocumentVms = files;
        return obj;
    },
    GenerateDatePicker: function() {
        $("#txtEntryDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    LoadHoldingNoCombo(cmbHoldingNo) {
        UtilityHelper.LoadCombo(cmbHoldingNo,
            "MutationMasterId",
            "HoldingNo",
            LandDevTaxInfoDetailsManager.GetAllHoldingNoList(),
            "--Select Holding No--");
    },
    LoadFromDateCombo(cmbFromDate) {
        UtilityHelper.LoadCombo(cmbFromDate,
            "BanglaYearId",
            "BanglaYearName",
            LandDevTaxInfoDetailsManager.GetAllCmnBanglaYear(),
            "--Select Form Year--");
    },
    LoadToDateCombo(cmbToDate) {
        UtilityHelper.LoadCombo(cmbToDate,
            "BanglaYearId",
            "BanglaYearName",
            LandDevTaxInfoDetailsManager.GetAllCmnBanglaYear(),
            "--Select To Year--");
    },
    GenerateNumericTextBox: function() {
        $("#txtTaxAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 2,
            min: 0
        });
    },
    ChangeEventOfHoldingNoCombo: function () {
        var mutationMasterId = $("#cmbHoldingNo").data("kendoComboBox").value();
        var data = LandDevTaxInfoDetailsManager.GetMutationMasterById(mutationMasterId);
        $("#cmbCmnDivision").data("kendoComboBox").value(data.DivisionId);
        LandHelper.ChangeEventOfDivisionCombo();
        $("#cmbCmnDistrict").data("kendoComboBox").value(data.DistrictId);
        LandHelper.ChangeEventOfDistrictCombo();
        $("#cmbCmnUpozila").data("kendoComboBox").value(data.UpozilaId);
        LandHelper.ChangeEventOfUpozilaCombo();
        $("#cmbCmnMouza").data("kendoComboBox").value(data.MouzaId);
    },
    FillForm: function (obj) {
        $("#hdnLandDevelopmentTaxId").val(obj.LandDevelopmentTaxId);
        $("#cmbHoldingNo").data("kendoComboBox").value(obj.MutationMasterId);
        $("#txtDakhilaNo").val(obj.DakhilaNo);

        $("#cmbCmnDivision").data("kendoComboBox").value(obj.DivisionId);
        LandHelper.ChangeEventOfDivisionCombo();
        $("#cmbCmnDistrict").data("kendoComboBox").value(obj.DistrictId);
        LandHelper.ChangeEventOfDistrictCombo();
        $("#cmbCmnUpozila").data("kendoComboBox").value(obj.UpozilaId);
        LandHelper.ChangeEventOfUpozilaCombo();
        $("#cmbCmnMouza").data("kendoComboBox").value(obj.MouzaId);
        $("#cmbFromDate").data("kendoComboBox").value(obj.FromDate);
        $("#cmbToDate").data("kendoComboBox").value(obj.ToDate);
        $("#txtTaxAmount").data("kendoNumericTextBox").value(obj.TaxAmount);
        $("#txtEntryDate").data("kendoDatePicker").value(obj.EntryDate);
        $("#txtRemarks").val(obj.Remarks);
        $("#txtFileRemarks").val(obj.FileRemarks);

        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
        files = obj.FilesVm;
        LandDevTaxInfoDetailsHelper.LoadFile();
    },
    ValidateForm: function () {
        var res = true;

        var cmnHoldingNo = $("#cmbHoldingNo").data("kendoComboBox");
        if (cmnHoldingNo.value() === "" || cmnHoldingNo.value() === undefined) {
            AjaxManager.NotifyMsg("cmbHoldingNo", "error", "right", 1500, "Required");
            res = false;
        }

        var dakhilaNoNo = $("#txtDakhilaNo").val();
        if (dakhilaNoNo === "" || dakhilaNoNo === undefined) {
            AjaxManager.NotifyMsg("txtDakhilaNo", "error", "right", 1500, "Required");
            res = false;
        }

        var entryDate = $("#txtEntryDate").data("kendoDatePicker");
        if (entryDate.value() === "" || entryDate.value() === undefined || entryDate.value() === null) {
            AjaxManager.NotifyMsg("txtEntryDate", "error", "bottom", 1500, "Required");
            res = false;
        }

        var fromDate = $("#cmbFromDate").data("kendoComboBox").value();
        if (fromDate === "" || fromDate === undefined) {
            AjaxManager.NotifyMsg("cmbFromDate", "error", "right", 1500, "Required");
            res = false;
        }

        var toDate = $("#cmbToDate").data("kendoComboBox").value();
        if (toDate === "" || toDate === undefined) {
            AjaxManager.NotifyMsg("cmbToDate", "error", "right", 1500, "Required");
            res = false;
        }

        var taxAmount = $("#txtTaxAmount").data("kendoNumericTextBox").value();
        if (taxAmount === "" || taxAmount === undefined || taxAmount === null) {
            AjaxManager.NotifyMsg("txtTaxAmount", "error", "right", 1500, "Required");
            res = false;
        }

        return res;
    },
    ClearForm: function () {
        $("#btnSubmitApplication").text("Submit");
        $("#btnSubmitApplication").addClass("glyphicon glyphicon-floppy-disk");

        $("#hdnLandDevelopmentTaxId").val("00000000-0000-0000-0000-000000000000");
        $("#txtDakhilaNo").val("");
        $("#cmbCmnDivision").data("kendoComboBox").value("");
        $("#cmbCmnDistrict").data("kendoComboBox").value("");
        $("#cmbCmnUpozila").data("kendoComboBox").value("");
        $("#cmbCmnMouza").data("kendoComboBox").value("");
        //$("#txtEntryDate").data("kendoDatePicker").value("");
        $("#cmbHoldingNo").data("kendoComboBox").value("");
        $("#cmbFromDate").data("kendoComboBox").value("");
        $("#cmbToDate").data("kendoComboBox").value("");
        $("#txtTaxAmount").data("kendoNumericTextBox").value("");
        $("#txtRemarks").val("");
        $("#txtFileRemarks").val("");

        files = [];
        LandDevTaxInfoDetailsHelper.LoadFile();
    },
    LoadFile: function () {
        var uploadWidget = $("#files").getKendoUpload();

        // You won't need to clear the files as the Upload DOM is entirely removed
        // uploadWidget.clearAllFiles();

        var uploaderOptions = uploadWidget.options;
        uploaderOptions.files = files;

        uploadWidget.destroy();

        // Get reference to the 'files' <input> element and its .k-upload parent
        var uploadInput = $("#files");
        var wrapper = uploadInput.parents('.k-upload');
        // Remove the .k-upload from the DOM
        wrapper.remove();
        // Re-append the 'files' <input> to the DOM
        $('#divFileUpload').append(uploadInput);

        uploadWidget = $("#files").kendoUpload(uploaderOptions).data("kendoUpload");
    }
}
