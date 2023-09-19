
var LandInfoViewDetailsManager = {
    GetLandOwnerType() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/LandOwnerType/all");
        return list == null ? [] : list;
    },
    GetAllLandOwnerTypeListByLandMasterId: function (landMasterId) {
        var objOwnerType = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandOwnerType/ownerType/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objOwnerType = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objOwnerType;
    },
    GetAllLandSalerInfoListByLandMasterId: function (landMasterId) {
        var objSalerInfo = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/salerInfo/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objSalerInfo = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objSalerInfo;
    },
    GetAllKhatianDetailListByLandMasterId: function (landMasterId) {
        var objKhatianDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/khatianDetails/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objKhatianDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objKhatianDetail;
    },
    GetAllLandOwnerListByLandMasterId: function (landMasterId) {
        var objOwnerDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/landOwner/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objOwnerDetail = jsonData;

        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objOwnerDetail;
    }
}

var LandInfoViewDetailsHelper = {
    InitLandInfoViewDetails: function () {
        $("#btnCancelApplication").click(function () {
            $("#divLandInfoViewDetails").hide();
            $("#divLandInfoViewSummary").show();
        });
        LandInfoViewDetailsHelper.InitLandOwnerType();
        LandInfoViewDetailsHelper.GenerateDatePicker();
        LandInfoViewDetailsHelper.GenerateNumericTextBox();
        LandHelper.LoadCmnDivisionCombo("cmbCmnDivision");
        LandHelper.LoadCmnDistrictCombo("cmbCmnDistrict");
        LandHelper.LoadCmnUpozilaCombo("cmbCmnUpozila");
        LandHelper.LoadSubRegOfficeCombo("cmbSubRegOffice");
        $(".chkLandOwnerType").attr("disabled", true);
        $("#chkIsBayna").attr("disabled", true);
    },
    InitLandOwnerType() {
        var landOwnerTypes = LandInfoViewDetailsManager.GetLandOwnerType();
        var id = AjaxManager.DefaultGuidId();
        $.map(landOwnerTypes, function (landOwnerType) {
            $("#LandOwnerType").append('<div class="col-md-1" style="width: 20%;">'
                + '<input style="margin-right:1px;" class ="chkLandOwnerType"  lmwr-id=' + id + ' lwt-id=' + landOwnerType.LandOwnerTypeId + ' type="checkbox" />'
                + '<label class ="lblChkLabel"> By ' + landOwnerType.LandOwnerTypeName + ' </label> '
                + '</div>');
        });
    },
    GenerateDatePicker: function () {
        $("#txtEntryDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtLandRegAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 2,
            min: 0
        });
        $("#txtLandPurchaseAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 2,
            min: 0
        });
        $("#txtLandDevelopmentAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 2,
            min: 0
        });
        $("#txtOwnerRegAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 2,
            min: 0,
            change: function () {
                LandInfoViewDetailsHelper.CalculateAmountValue();
            }
        });
        $("#txtOwnerPurchaseAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 2,
            min: 0,
            change: function () {
                LandInfoViewDetailsHelper.CalculateAmountValue();
            }
        });
    },
    FillLandMasterDetailsForm: function (obj) {
        $("#hdnLandMasterId").val(obj.LandMasterId);
        $("#divLandOwnerTypeOtherRemarks").show();
         //LandOwnerType List Load
        LandInfoViewDetailsHelper.LoadOwnerTypeListData(obj.LandMasterId);
        $("#cmbCmnDivision").data("kendoComboBox").value(obj.DivisionId);
        LandHelper.ChangeEventOfDivisionCombo();
        $("#cmbCmnDistrict").data("kendoComboBox").value(obj.DistrictId);

        LandHelper.ChangeEventOfDistrictCombo();
        $("#cmbCmnUpozila").data("kendoComboBox").value(obj.UpozilaId);

        $("#txtEntryDate").data("kendoDatePicker").value(obj.EntryDate);
        $("#cmbSubRegOffice").data("kendoComboBox").value(obj.SubRegOfficeName);
        if (obj.IsBayna == true) {
            $("#chkIsBayna").prop('checked', true);
        } else {
            $("#chkIsBayna").prop('checked', false);
        };
        $("#txtTotalLandAmount").val(obj.TotalLandAmount);
        $("#txtDeedNo").val(obj.DeedNo);
        $("#txtLandRegAmount").data("kendoNumericTextBox").value(obj.LandRegAmount);
        $("#txtLandPurchaseAmount").data("kendoNumericTextBox").value(obj.LandPurchaseAmount);
        $("#txtLandDevelopmentAmount").data("kendoNumericTextBox").value(obj.LandDevelopmentAmount);
        //Load Saler Info Grid
        LandInfoViewDetailsHelper.LoadSalerInfoGrid(obj.LandMasterId);
        //Load Khatian Summary Grid
        LandInfoViewDetailsHelper.FillKhatianDetailSummaryGrid(obj.LandMasterId);
        //Load Land Owner Grid
        LandInfoViewDetailsHelper.FillOwnerDetailSummaryGrid(obj.LandMasterId);
        debugger;
        files = obj.FilesVm;
        LandInfoViewDetailsHelper.LoadFile();
    },
    LoadOwnerTypeListData: function (landMasterId) {
        $("#LandOwnerType").find("input[type='checkbox']").prop('checked', false);
        // Owner Type List
        var ownerTypeObjs = LandInfoViewDetailsManager.GetAllLandOwnerTypeListByLandMasterId(landMasterId);
        ownerTypeObjs.map(otObj => {
            $("#LandOwnerType").find("input[type='checkbox'][lwt-id='" + otObj.LandOwnerTypeId + "']").prop('checked', true);
            $("#LandOwnerType").find("input[type='checkbox'][lwt-id='" + otObj.LandOwnerTypeId + "']").attr("lmwr-id", otObj.LandMasterOwnerRelationId);
            $("#txtOtherRemarks").val(otObj.OtherRemarks);
        });
    },
    LoadSalerInfoGrid: function (landMasterId) {
        // Saler Info List
        var salerInfoObjs = LandInfoViewDetailsManager.GetAllLandSalerInfoListByLandMasterId(landMasterId);

        var salerInfoSummary = $("#grdSalerInfoViewSummary").data("kendoGrid");
        salerInfoSummary.setDataSource(salerInfoObjs);
    },
    FillKhatianDetailSummaryGrid: function (landMasterId) {
        // Khatian Detail List
        var khatianDetailObjs = LandInfoViewDetailsManager.GetAllKhatianDetailListByLandMasterId(landMasterId);
        var khatianDetailSummary = $("#grdKhatianDetailViewSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: khatianDetailObjs,
            schema: {
                model: {
                    fields: {
                    }
                }
            }
        });
        khatianDetailSummary.setDataSource(gridDataSource);
    },
    FillOwnerDetailSummaryGrid: function (landMasterId) {
        // Owner Detail List
        var ownerDetailObjs = LandInfoViewDetailsManager.GetAllLandOwnerListByLandMasterId(landMasterId);
        var ownerDetailSummary = $("#grdOwnerDetailViewSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: ownerDetailObjs,
            schema: {
                model: {
                    fields: {
                    }
                }
            }
        });
        ownerDetailSummary.setDataSource(gridDataSource);
    },
    LoadFile: function () {
        debugger;
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