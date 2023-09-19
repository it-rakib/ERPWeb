
var gbOwnerWiseMutationList = [];
var gbPlotWiseMutationList = [];
var files = [];
var isDelete = false;

var MutationInfoDetailsManager = {
    SaveMutationMasterDetails: function () {
        var msg = "";
        
        if (MutationInfoDetailsHelper.ValidateForm()) {            
            var createOrUpdateMutationMasterCommand = MutationInfoDetailsHelper.CreateMutationMasterObject();
            
            var jsonParam = JSON.stringify(createOrUpdateMutationMasterCommand);
            var serviceUrl = _baseUrlLand + "/api/MutationMaster/CreateOrUpdateMutationMaster";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdMutationMasterSummary").data("kendoGrid").dataSource.read();
                            MutationInfoDetailsHelper.ClearFullForm();
                            $("#divMutationInfoSummary").show();
                            $("#divMutationInfoDetails").hide();
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
    GetCmnDivisions() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/CmnDivision/all");
        return list == null ? [] : list;
    },
    GetDeedNo() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/LandMaster/allDeedNoList");
        return list == null ? [] : list;
    },
    GetDistrictByDivisionId: function (divisionId) {
        var objDistrict = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/CmnDistrict/district/" + divisionId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objDistrict = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objDistrict;
    },
    GetUpozilaByDistrictId: function (districtId) {
        var objUpozila = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/CmnUpozila/upozila/" + districtId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objUpozila = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objUpozila;
    },
    GetMouzaByUpozilaId: function (upozilaId) {
        var objMouza = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/CmnMouza/mouza/" + upozilaId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objMouza = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objMouza;
    },
    GetDeedNoListByMouzaId: function (mouzaId) {
        var objDeedNo = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/deedNoList/" + mouzaId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objDeedNo = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objDeedNo;
    },
    GetLandAmountByLandMasterIdMouzaId: function (landMasterId, mouzaId) {
        
        var objLandAmount = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/totalLandAmount/" + landMasterId + "," + mouzaId;
        //var serviceUrl = _baseUrlLand + "/api/LandMaster/totalLandAmount/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objLandAmount = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objLandAmount;
    },
    GetAllPlotWiseMutationDetailListByMutationMasterId: function (mutationMasterId) {

        var objPlotWiseMutationDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/MutationMaster/plotWiseMutationDetail/" + mutationMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objPlotWiseMutationDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objPlotWiseMutationDetail;
    },
    GetAllOwnerWiseMutationDetailListByMutationMasterId: function (mutationMasterId) {
        var objMutationDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/MutationMaster/ownerWiseMutationDetail/" + mutationMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objMutationDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objMutationDetail;
    },
    GetAllKhatianTypeListByLandMasterIdMouzaId: function (landMasterId, mouzaId) {
        var objKhatianType = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/khatianTypes/" + landMasterId + "," + mouzaId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objKhatianType = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objKhatianType;
    },
    GetAllKhatianDetailListByLandMasterIdMouzaIdKhatianTypeId: function (landMasterId, mouzaId, khatianTypeId) {
        var objKhatianDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/khatianDetails/" + landMasterId + "," + mouzaId + "," + khatianTypeId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objKhatianDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objKhatianDetail;
    },
    GetAllLandOwnerDetailByLandMasterIdMouzaId: function (landMasterId, mouzaId) {
        var objLandOwner = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandOwnersDetail/landOwnerDetail/" + landMasterId + "," + mouzaId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objLandOwner = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objLandOwner;
    },
    GetTotalMutatedLandByLandMasterId: function (landMasterId, khatianTypeId) {
        var objMutatedLand = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/MutationMaster/TotalMutatedLand/" + landMasterId + "," + khatianTypeId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objMutatedLand = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        
        return objMutatedLand;
    },
}

var MutationInfoDetailsHelper = {
    InitMutationInfoDetails: function () {
        $("#btnAddNew").click(function () {
            $("#divMutationInfoSummary").hide();
            $("#divMutationInfoDetails").show();
            MutationInfoDetailsHelper.ClearFullForm();
        });
        $("#btnSubmitApplication").click(function () {
            MutationInfoDetailsManager.SaveMutationMasterDetails();
        });
        $("#btnCancelApplication").click(function () {
            $("#divMutationInfoDetails").hide();
            $("#divMutationInfoSummary").show();
            MutationInfoDetailsHelper.ClearFullForm();
        });
        $("#btnAddToListOwnerWise").click(function () {
            if ($("#btnAddToListOwnerWise").text() === "Add Owner Wise Mutation") {
                MutationInfoDetailsHelper.AddToListOwnerWise();
            } else {
                MutationInfoDetailsHelper.UpdateToListOwnerWise();
            }
        });
        $("#btnAddToListPlotWiseMutation").click(function () {
            if ($("#btnAddToListPlotWiseMutation").text() === "Add Plot Wise Mutation") {
                MutationInfoDetailsHelper.AddToListPlotWiseMutation();
            } else {
                MutationInfoDetailsHelper.UpdateToListPlotWiseMutation();
            }
        });
        MutationInfoDetailsHelper.GenerateDatePicker();
        MutationInfoDetailsHelper.GenerateNumericTextBox();
        MutationInfoDetailsHelper.LoadCmnDivisionCombo("cmbCmnDivision");
        MutationInfoDetailsHelper.LoadCmnDistrictCombo("cmbCmnDistrict");
        MutationInfoDetailsHelper.LoadCmnUpozilaCombo("cmbCmnUpozila");
        MutationInfoDetailsHelper.LoadCmnMouzaCombo("cmbCmnMouza");
        MutationInfoDetailsHelper.LoadDeedNoCombo("cmbDeedNo");
        $("#chkIsRecorded").change(function () {
            var val = $("input[type=checkbox]:checked").val();
            if (val === "chkIsRecorded") {
                $("#txtMutationApplicationNo").prop('disabled', true);
                $("#txtCaseNo").prop('disabled', true);
                $("#txtDCRNo").prop('disabled', true);
                $("#txtMutationKhatianNo").prop('disabled', true);
                $('#txtMutationApplicationDate').data('kendoDatePicker').enable(false);
            }
            else {
                $("#txtMutationApplicationNo").prop('disabled', false);
                $("#txtCaseNo").prop('disabled', false);
                $("#txtDCRNo").prop('disabled', false);
                $("#txtMutationKhatianNo").prop('disabled', false);
                $('#txtMutationApplicationDate').data('kendoDatePicker').enable(true);
            }
        });
        $("#cmbCmnDivision").change(function () {
            MutationInfoDetailsHelper.ChangeEventOfDivisionCombo();
        });
        $("#cmbCmnDistrict").change(function () {
            MutationInfoDetailsHelper.ChangeEventOfDistrictCombo();
        });
        $("#cmbCmnUpozila").change(function () {
            MutationInfoDetailsHelper.ChangeEventOfUpozilaCombo();
        });
        $("#cmbCmnMouza").change(function () {
            MutationInfoDetailsHelper.ChangeEventOfMouzaCombo();
        });
        $("#cmbDeedNo").change(function () {
            
            MutationInfoDetailsHelper.ChangeEventOfDeedNoCombo();
        });
        MutationInfoDetailsHelper.LoadKhatianTypeCombo("cmbKhatianType");
        MutationInfoDetailsHelper.LoadKhatianNoCombo("cmbKhatianNo");
        $("#cmbKhatianType").change(function () {
            MutationInfoDetailsHelper.ChangeEventOfKhatianTypeCombo();
        });
        MutationInfoDetailsHelper.LoadDagNoCombo("cmbDagNo");
        $("#cmbKhatianNo").change(function () {
            MutationInfoDetailsHelper.ChangeEventOfKhatianNoCombo();
        });
        MutationInfoDetailsHelper.LoadOwnerInfoCombo("cmbOwnerInfo");
        $("#cmbOwnerInfo").change(function () {
            MutationInfoDetailsHelper.ChangeEventOfOwnerInfoCombo();
        });
    },

    CreateMutationMasterObject: function () {
        var obj = new Object();
        obj.MutationMasterId = $("#hdnMutationMasterId").val();
        obj.DivisionId = $("#cmbCmnDivision").data("kendoComboBox").value();
        obj.DistrictId = $("#cmbCmnDistrict").data("kendoComboBox").value();
        obj.UpozilaId = $("#cmbCmnUpozila").data("kendoComboBox").value();
        obj.MouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        obj.MutationApplicationNo = $("#txtMutationApplicationNo").val();
        obj.MutationApplicationDate = $("#txtMutationApplicationDate").data("kendoDatePicker").value();
        obj.CaseNo = $("#txtCaseNo").val();
        obj.Dcrno = $("#txtDCRNo").val();
        obj.MutationKhatianNo = $("#txtMutationKhatianNo").val();
        obj.HoldingNo = $("#txtHoldingNo").val();
        obj.Remarks = $("#txtRemarks").val();
        obj.IsRecorded = $("#chkIsRecorded").is(":checked");
        obj.FileRemarks = $("#txtFileRemarks").val();
        obj.PlotWiseMutationDetails = MutationInfoDetailsHelper.CreatePlotWiseMutationDetailsObject();
        obj.OwnerWiseMutationDetails = MutationInfoDetailsHelper.CreateOwnerWiseMutationDetailsObject();
        obj.CreatedBy = CurrentUser.USERID;
        obj.UpdatedBy = CurrentUser.USERID;
        obj.DocumentVms = files;
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        return obj;
        
    },
    CreatePlotWiseMutationDetailsObject: function () {
        
        var plotWiseMutationDetailList = [];
        var plotWiseMutationSummaryGrid = $("#grdPlotWiseMutationSummary").data("kendoGrid");
        var gridData = plotWiseMutationSummaryGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var detailsData = gridData[i];
            var obj = new Object();
            obj.PlotWiseMutationDetailId = detailsData.PlotWiseMutationDetailId;
            obj.MutationMasterId = detailsData.MutationMasterId;
            obj.LandMasterId = detailsData.LandMasterId;
            obj.KhatianTypeId = detailsData.KhatianTypeId;
            obj.KhatianNo = detailsData.KhatianNo;
            obj.DagNo = detailsData.DagNo;
            obj.PlotWiseMutationLandAmount = detailsData.PlotWiseMutationLandAmount;
            plotWiseMutationDetailList.push(obj);
        }
        return plotWiseMutationDetailList;
    },
    CreateOwnerWiseMutationDetailsObject: function () {
        var ownerWiseMutationDetailList = [];
        var ownerWiseMutationSummaryGrid = $("#grdOwnerWiseMutationSummary").data("kendoGrid");
        var gridData = ownerWiseMutationSummaryGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var detailsData = gridData[i];
            var obj = new Object();
            obj.OwnerWiseMutationDetailId = detailsData.OwnerWiseMutationDetailId;
            obj.MutationMasterId = detailsData.MutationMasterId;
            obj.LandMasterId = detailsData.LandMasterId;
            obj.KhatianTypeId = detailsData.KhatianTypeId;
            obj.OwnerInfoId = detailsData.OwnerInfoId;
            obj.OwnerLandAmount = detailsData.OwnerLandAmount;
            obj.OwnerMutatedLandAmount = detailsData.OwnerMutatedLandAmount;
            ownerWiseMutationDetailList.push(obj);
        }
        return ownerWiseMutationDetailList;
    },

    GenerateDatePicker: function () {
        $("#txtMutationApplicationDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtPlotWiseMutationLandAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 2,
            min: 0
        });
        $("#txtOwnerMutatedLandAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 2,
            min: 0
        });
    },

    LoadCmnDivisionCombo(cmbCmnDivision) {
        UtilityHelper.LoadCombo(cmbCmnDivision, "DivisionId", "DivisionName", MutationInfoDetailsManager.GetCmnDivisions(), "--Select Division--");
    },
    LoadCmnDistrictCombo(cmbCmnDistrict) {
        UtilityHelper.LoadCombo(cmbCmnDistrict, "DistrictId", "DistrictName", [], "--Select District--");
    },
    LoadCmnUpozilaCombo(cmbCmnUpozila) {
        UtilityHelper.LoadCombo(cmbCmnUpozila, "UpozilaId", "UpozilaName", [], "--Select Upazila/Thana--");
    },
    LoadCmnMouzaCombo(cmbCmnMouza) {
        UtilityHelper.LoadCombo(cmbCmnMouza, "MouzaId", "MouzaName", [], "--Select Mouza--");
    },
    LoadDeedNoCombo(cmbDeedNo) {
        UtilityHelper.LoadCombo(cmbDeedNo, "LandMasterId", "DeedNo", MutationInfoDetailsManager.GetDeedNo(), "--Select Deed--");
    },
    LoadKhatianTypeCombo(cmbKhatianType) {
        
        UtilityHelper.LoadCombo(cmbKhatianType, "KhatianTypeId", "KhatianTypeName", [], "--Select Name of Survey--");
    },
    LoadKhatianNoCombo(cmbKhatianNo) {
        UtilityHelper.LoadCombo(cmbKhatianNo, "KhatianNo", "KhatianNo", [], "--Select Khatian No--");
    },
    LoadDagNoCombo(cmbDagNo) {
        UtilityHelper.LoadCombo(cmbDagNo, "DagNo", "DagNo", [], "--Select Plot No--");
    },
    LoadOwnerInfoCombo(cmbOwnerInfo) {
        UtilityHelper.LoadCombo(cmbOwnerInfo, "OwnerInfoId", "OwnerInfoName", [], "--Select Owner--");
    },

    ChangeEventOfDivisionCombo: function () {
        var divisionId = $("#cmbCmnDivision").data("kendoComboBox").value();
        var data = MutationInfoDetailsManager.GetDistrictByDivisionId(divisionId);
        var districtCombo = $("#cmbCmnDistrict").data("kendoComboBox");
        districtCombo.value("");
        districtCombo.text("");
        districtCombo.setDataSource(data);
    },
    ChangeEventOfDistrictCombo: function () {
        var districtId = $("#cmbCmnDistrict").data("kendoComboBox").value();
        var data = MutationInfoDetailsManager.GetUpozilaByDistrictId(districtId);
        var upozilaCombo = $("#cmbCmnUpozila").data("kendoComboBox");
        upozilaCombo.value("");
        upozilaCombo.text("");
        upozilaCombo.setDataSource(data);
    },
    ChangeEventOfUpozilaCombo: function () {
        var upozilaId = $("#cmbCmnUpozila").data("kendoComboBox").value();
        var data = MutationInfoDetailsManager.GetMouzaByUpozilaId(upozilaId);
        var mouzaCombo = $("#cmbCmnMouza").data("kendoComboBox");
        mouzaCombo.value("");
        mouzaCombo.text("");
        mouzaCombo.setDataSource(data);
    },
    ChangeEventOfMouzaCombo: function () {
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        var data = MutationInfoDetailsManager.GetDeedNoListByMouzaId(mouzaId);
        var DeedNoCombo = $("#cmbDeedNo").data("kendoComboBox");
        DeedNoCombo.value("");
        DeedNoCombo.text("");
        DeedNoCombo.setDataSource(data);
    },
    ChangeEventOfDeedNoCombo: function () {
        
        MutationInfoDetailsHelper.FillKhatianTypeCombo();
        $("#grdKhatianDetailSummary").data("kendoGrid").dataSource.data([]);

        var landMasterId = $("#cmbDeedNo").data("kendoComboBox").value();
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        MutationInfoDetailsHelper.FillLandOwnerDetailSummaryGrid(landMasterId, mouzaId);

        MutationInfoDetailsHelper.FillOwnerInfoCombo();
    },
    ChangeEventOfOwnerInfoCombo: function () {
        var landMasterId = $("#cmbDeedNo").data("kendoComboBox").value();
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        var ownerInfoId = $("#cmbOwnerInfo").data("kendoComboBox").value();

        var landAmount = 0;
        var landOwnerDetailObjs = MutationInfoDetailsManager.GetAllLandOwnerDetailByLandMasterIdMouzaId(landMasterId, mouzaId);
        for (var i = 0; i < landOwnerDetailObjs.length; i++) {
            var data = landOwnerDetailObjs[i];
            if (data.OwnerInfoId == ownerInfoId) {
                landAmount = data.LandAmount;
            }
        }
        $("#txtOwnerLandAmount").val(landAmount.toFixed(2));
    },

    FillKhatianTypeCombo: function () {
        
        var KhatianTypeList = [];
        var landMasterId = $("#cmbDeedNo").data("kendoComboBox").value();
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        var khatianTypeObjs = MutationInfoDetailsManager.GetAllKhatianTypeListByLandMasterIdMouzaId(landMasterId, mouzaId);

        for (var i = 0; i < khatianTypeObjs.length; i++) {
            var obj = new Object();
            obj.KhatianTypeId = khatianTypeObjs[i].KhatianTypeId;
            obj.KhatianTypeName = khatianTypeObjs[i].KhatianTypeName;
            KhatianTypeList.push(obj);
        }

        const key = 'KhatianTypeId';
        var uniquekhatianTypeList = [...new Map(KhatianTypeList.map(item =>
            [item[key], item])).values()];

        var khatianTypeCombo = $("#cmbKhatianType").data("kendoComboBox");
        khatianTypeCombo.value("");
        khatianTypeCombo.text("");
        khatianTypeCombo.setDataSource(uniquekhatianTypeList);

        $("#cmbKhatianNo").data("kendoComboBox").value("");
        $("#cmbDagNo").data("kendoComboBox").value("");
        $("#txtPlotWiseMutationLandAmount").data("kendoNumericTextBox").value("");
    },
    FillLandOwnerDetailSummaryGrid: function (landMasterId, mouzaId) {
        var landOwnerDetailObjs = MutationInfoDetailsManager.GetAllLandOwnerDetailByLandMasterIdMouzaId(landMasterId, mouzaId);
        var landOwnerDetailSummary = $("#grdLandOwnerDetailSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: landOwnerDetailObjs,
            schema: {
                model: {
                    fields: {
                    }
                }
            }
        });
        landOwnerDetailSummary.setDataSource(gridDataSource);
    },
    FillOwnerInfoCombo: function () {
        var landOwnerList = [];
        var landMasterId = $("#cmbDeedNo").data("kendoComboBox").value();
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        var landOwnerDetailObjs = MutationInfoDetailsManager.GetAllLandOwnerDetailByLandMasterIdMouzaId(landMasterId, mouzaId);
        for (var i = 0; i < landOwnerDetailObjs.length; i++) {
            var obj = new Object();
            obj.OwnerInfoId = landOwnerDetailObjs[i].OwnerInfoId;
            obj.OwnerInfoName = landOwnerDetailObjs[i].OwnerInfoName;
            landOwnerList.push(obj);
        }

        var ownerInfoCombo = $("#cmbOwnerInfo").data("kendoComboBox");
        ownerInfoCombo.value("");
        ownerInfoCombo.text("");
        ownerInfoCombo.setDataSource(landOwnerList);
    },

    ChangeEventOfKhatianTypeCombo: function () {
        
        var landMasterId = $("#cmbDeedNo").data("kendoComboBox").value();
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        var khatianTypeId = $("#cmbKhatianType").data("kendoComboBox").value();
        MutationInfoDetailsHelper.FillKhatianDetailSummaryGrid(landMasterId, mouzaId, khatianTypeId);

        var KhatianNoList = [];
        var khatianDetailObjs = MutationInfoDetailsManager.GetAllKhatianDetailListByLandMasterIdMouzaIdKhatianTypeId(landMasterId, mouzaId, khatianTypeId);

        for (var i = 0; i < khatianDetailObjs.length; i++) {
            var obj = new Object();
            obj.KhatianNo = khatianDetailObjs[i].KhatianNo;
            KhatianNoList.push(obj);
        }

        var khatianNoCombo = $("#cmbKhatianNo").data("kendoComboBox");
        khatianNoCombo.value("");
        khatianNoCombo.text("");
        khatianNoCombo.setDataSource(KhatianNoList);

        $("#cmbDagNo").data("kendoComboBox").value("");
        $("#txtPlotWiseMutationLandAmount").data("kendoNumericTextBox").value("");

        var totalAreaOfLand = MutationInfoDetailsManager.GetLandAmountByLandMasterIdMouzaId(landMasterId, mouzaId);
        //var totalAreaOfLand = MutationInfoDetailsManager.GetLandAmountByLandMasterIdMouzaId(landMasterId);
        
        $("#txtTotalAreaOfLand").val(totalAreaOfLand.toFixed(2));
        
        var mutatedLand = MutationInfoDetailsManager.GetTotalMutatedLandByLandMasterId(landMasterId, khatianTypeId);
        $("#txtMutatedLand").val(mutatedLand.toFixed(2));
        var nonMutatedLand = UtilityHelper.IsNaN(totalAreaOfLand) - UtilityHelper.IsNaN(mutatedLand);
        $("#txtNonMutatedLand").val(nonMutatedLand.toFixed(2));
    },
    FillKhatianDetailSummaryGrid: function (landMasterId, mouzaId, khatianTypeId) {
        // Khatian Detail List By Land Master Id, Mouza Id, Khatian Type Id
        var khatianDetailObjs = MutationInfoDetailsManager.GetAllKhatianDetailListByLandMasterIdMouzaIdKhatianTypeId(landMasterId, mouzaId, khatianTypeId);
        var khatianDetailSummary = $("#grdKhatianDetailSummary").data("kendoGrid");
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
    ChangeEventOfKhatianNoCombo: function () {
        var DagNo = [];
        var landMasterId = $("#cmbDeedNo").data("kendoComboBox").value();
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        var khatianTypeId = $("#cmbKhatianType").data("kendoComboBox").value();
        var khatianNo = $("#cmbKhatianNo").data("kendoComboBox").value();

        var khatianDetailObjs = MutationInfoDetailsManager.GetAllKhatianDetailListByLandMasterIdMouzaIdKhatianTypeId(landMasterId, mouzaId, khatianTypeId);

        for (var i = 0; i < khatianDetailObjs.length; i++) {
            if (khatianDetailObjs[i].KhatianNo == khatianNo) {
                DagNo = khatianDetailObjs[i].DagNo;
            }
        }

        var splitDagNo = $.map(DagNo.split(","), $.trim);
        var resultDagNo = [];
        for (var i = 0; i < splitDagNo.length; i++) {
            var obj = new Object();
            obj.DagNo = splitDagNo[i];
            obj.DagNo = splitDagNo[i];
            resultDagNo.push(obj);
        }

        var dagNoCombo = $("#cmbDagNo").data("kendoComboBox");
        dagNoCombo.value("");
        dagNoCombo.text("");
        dagNoCombo.setDataSource(resultDagNo);

        $("#txtPlotWiseMutationLandAmount").data("kendoNumericTextBox").value("");
    },

    AddToListPlotWiseMutation: function () {

        var deedNoCombo = $("#cmbDeedNo").data("kendoComboBox");
        var khatianTypeCombo = $("#cmbKhatianType").data("kendoComboBox");
        var khatianNoCombo = $("#cmbKhatianNo").data("kendoComboBox");
        var dagNoCombo = $("#cmbDagNo").data("kendoComboBox");
        var plotWiseMutationLandAmount = $("#txtPlotWiseMutationLandAmount").data("kendoNumericTextBox").value();
        //var plotWiseMutationLandAmount = $("#txtPlotWiseMutationLandAmount").data("kendoNumericTextBox");
        var nonMutatedLand = $("#txtNonMutatedLand").val();

        var plotWiseMutationSummaryGrid = $("#grdPlotWiseMutationSummary").data("kendoGrid");

        if (deedNoCombo.value() !== "" && khatianTypeCombo.value() !== "" && khatianNoCombo.value() !== ""
            && dagNoCombo.value() !== "" && plotWiseMutationLandAmount !== ""
            && plotWiseMutationLandAmount!== null) {
            var gridData = plotWiseMutationSummaryGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                if (itm.LandMasterId === deedNoCombo.value()
                    && itm.KhatianTypeId === khatianTypeCombo.value()
                    && itm.KhatianNo === khatianNoCombo.value()
                    && itm.DagNo === dagNoCombo.value()) {
                    AjaxManager.NotifyMsg("btnAddToListPlotWiseMutation", "error", "right", 1500, "Already Added!");
                    return;
                }
            }
            
            var totalPlotWiseMutatedLand = 0;            
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                if (itm.LandMasterId === deedNoCombo.value()) {
                    totalPlotWiseMutatedLand += itm.PlotWiseMutationLandAmount;
                }
            }
            //totalPlotWiseMutatedLand += plotWiseMutationLandAmount;
            //if (nonMutatedLand > totalPlotWiseMutatedLand) {
            //    AjaxManager.NotifyMsg("btnAddToListPlotWiseMutation", "error", "bottom", 1500, "Plot Wise Mutated Land is More Than Non-Mutated Land!");
            //    return;
            //}

            var obj = new Object();
            obj.PlotWiseMutationDetailId = AjaxManager.DefaultGuidId();
            //obj.PlotWiseMutationDetailId = plotWIseMutationDetailId;
            //obj.MutationMasterId = mutationMasterId;
            obj.MutationMasterId = AjaxManager.DefaultGuidId();
            obj.LandMasterId = deedNoCombo.value();
            obj.DeedNo = deedNoCombo.text();
            obj.KhatianTypeId = khatianTypeCombo.value();
            obj.KhatianTypeName = khatianTypeCombo.text();
            obj.KhatianNo = khatianNoCombo.value();
            obj.DagNo = dagNoCombo.value();
            obj.PlotWiseMutationLandAmount = plotWiseMutationLandAmount;

            gbPlotWiseMutationList.unshift(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: gbPlotWiseMutationList,
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
            plotWiseMutationSummaryGrid.setDataSource(gridDataSource);
            MutationInfoDetailsHelper.CalculateTotalLandAmount();
            MutationInfoDetailsHelper.ClearPlotWiseMutationDetailsForm();
        } else {
            if (deedNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbDeedNo", "error", "right", 1500, "Required");
            }
            if (khatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbKhatianType", "error", "right", 1500, "Required");
            }
            if (khatianNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbKhatianNo", "error", "right", 1500, "Required");
            }
            if (dagNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbDagNo", "error", "right", 1500, "Required");
            }
            if (plotWiseMutationLandAmount.value() === "" || plotWiseMutationLandAmount.value() == undefined) {
                AjaxManager.NotifyMsg("txtPlotWiseMutationLandAmount", "error", "right", 1500, "Required");
            }
        }
    },
    ClearPlotWiseMutationDetailsForm: function () {
        //$("#cmbKhatianType").data("kendoComboBox").value("");
        //$("#cmbKhatianNo").data("kendoComboBox").value("");
        //$("#cmbDagNo").data("kendoComboBox").value("");
        $("#txtPlotWiseMutationLandAmount").data("kendoNumericTextBox").value("");
    },
    FillPlotWiseMutationDetailForm: function (obj) {
        $("#btnAddToListPlotWiseMutation").text("Update Plot Wise Mutation");
        $("#btnAddToListPlotWiseMutation").addClass("fa fa-edit");

        $("#cmbDeedNo").data("kendoComboBox").value(obj.LandMasterId);
        MutationInfoDetailsHelper.ChangeEventOfDeedNoCombo();


        $("#cmbKhatianType").data("kendoComboBox").value(obj.KhatianTypeId);
        $("#cmbKhatianType").data("kendoComboBox").text(obj.KhatianTypeName);
        MutationInfoDetailsHelper.ChangeEventOfKhatianTypeCombo();
        $("#cmbKhatianNo").data("kendoComboBox").value(obj.KhatianNo);
        MutationInfoDetailsHelper.ChangeEventOfKhatianNoCombo();
        $("#cmbDagNo").data("kendoComboBox").value(obj.DagNo);
        $("#txtPlotWiseMutationLandAmount").data("kendoNumericTextBox").value(obj.PlotWiseMutationLandAmount);

    },
    UpdateToListPlotWiseMutation: function () {
        $("#btnAddToListPlotWiseMutation").text("Add Plot Wise Mutation");
        $("#btnAddToListPlotWiseMutation").addClass("fas fa-arrow-down");
        var deedNoCombo = $("#cmbDeedNo").data("kendoComboBox");
        var khatianTypeCombo = $("#cmbKhatianType").data("kendoComboBox");
        var khatianNoCombo = $("#cmbKhatianNo").data("kendoComboBox");
        var dagNoCombo = $("#cmbDagNo").data("kendoComboBox");
        var plotWiseMutationLandAmount = $("#txtPlotWiseMutationLandAmount").data("kendoNumericTextBox");
        //var nonMutatedLand = $("#txtNonMutatedLand").val();

        var grid = $("#grdPlotWiseMutationSummary").data("kendoGrid");
        var selectedItem = grid.dataItem(grid.select());

        if (deedNoCombo.value() !== "" && khatianTypeCombo.value() !== "" && khatianNoCombo.value() !== ""
            && dagNoCombo.value() !== "" && plotWiseMutationLandAmount.value() !== ""
            && plotWiseMutationLandAmount.value() !== null) {

            //var gridData = grid.dataSource.data();
            //var totalPlotWiseMutatedLand = 0;
            //for (var i = 0; i < gridData.length; i++) {
            //    var itm = gridData[i];
            //    if (itm.LandMasterId === deedNoCombo.value()) {
            //        totalPlotWiseMutatedLand += itm.PlotWiseMutationLandAmount;
            //    }
            //}
            //totalPlotWiseMutatedLand += plotWiseMutationLandAmount.value();
            //if (nonMutatedLand < totalPlotWiseMutatedLand) {
            //    AjaxManager.NotifyMsg("btnAddToListPlotWiseMutation", "error", "bottom", 1500, "Plot Wise Mutated Land is More Than Non-Mutated Land!");
            //    return;
            //}

            var obj = new Object();
            obj.PlotWiseMutationDetailId = selectedItem.PlotWiseMutationDetailId !== AjaxManager.DefaultGuidId() ? selectedItem.PlotWiseMutationDetailId : AjaxManager.DefaultGuidId();
            obj.MutationMasterId = selectedItem.MutationMasterId !== AjaxManager.DefaultGuidId() ? selectedItem.MutationMasterId : AjaxManager.DefaultGuidId();
            obj.LandMasterId = deedNoCombo.value();
            obj.DeedNo = deedNoCombo.text();
            obj.KhatianTypeId = khatianTypeCombo.value();
            obj.KhatianTypeName = khatianTypeCombo.text();
            obj.KhatianNo = khatianNoCombo.value();
            obj.DagNo = dagNoCombo.value();
            obj.PlotWiseMutationLandAmount = plotWiseMutationLandAmount.value();

            for (var i = 0; i < gbPlotWiseMutationList.length; i++) {
                if (gbPlotWiseMutationList[i].PlotWiseMutationDetailId === selectedItem.PlotWiseMutationDetailId) {
                    gbPlotWiseMutationList.splice(i, 1);
                    break;
                }
            }

            gbPlotWiseMutationList.unshift(obj);
            selectedItem.set('PlotWiseMutationDetailId', obj.PlotWiseMutationDetailId);
            selectedItem.set('MutationMasterId', obj.MutationMasterId);
            selectedItem.set('LandMasterId', obj.LandMasterId);
            selectedItem.set('DeedNo', obj.DeedNo);
            selectedItem.set('KhatianTypeId', obj.KhatianTypeId);
            selectedItem.set('KhatianTypeName', obj.KhatianTypeName);
            selectedItem.set('KhatianNo', obj.KhatianNo);
            selectedItem.set('DagNo', obj.DagNo);
            selectedItem.set('PlotWiseMutationLandAmount', obj.PlotWiseMutationLandAmount);
            
            MutationInfoDetailsHelper.CalculateTotalLandAmount();
            MutationInfoDetailsHelper.ClearPlotWiseMutationDetailsForm();

        } else {
            if (deedNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbDeedNo", "error", "right", 1500, "Required");
            }
            if (khatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbKhatianType", "error", "right", 1500, "Required");
            }
            if (khatianNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbKhatianNo", "error", "right", 1500, "Required");
            }
            if (dagNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbDagNo", "error", "right", 1500, "Required");
            }
            if (plotWiseMutationLandAmount.value() === "" || plotWiseMutationLandAmount.value() == undefined) {
                AjaxManager.NotifyMsg("txtPlotWiseMutationLandAmount", "error", "right", 1500, "Required");
            }
        }
    },

    AddToListOwnerWise: function () {
        //var mutationMasterId = ("#hdnMutationMasterId").val();
        //var ownerWiseMutationDetailId = ("#hdnOwnerWiseMutationDetailId").val();
        var deedNoCombo = $("#cmbDeedNo").data("kendoComboBox");
        var khatianTypeCombo = $("#cmbKhatianType").data("kendoComboBox");
        var ownerInfoCombo = $("#cmbOwnerInfo").data("kendoComboBox");
        var ownerLandAmount = $("#txtOwnerLandAmount").val();
        var ownerMutatedLandAmount = $("#txtOwnerMutatedLandAmount").data("kendoNumericTextBox").value();
        var ownerWiseMutationSummaryGrid = $("#grdOwnerWiseMutationSummary").data("kendoGrid");

        if (deedNoCombo.value() !== "" && khatianTypeCombo.value() !== "" && ownerInfoCombo.value() !== "" && ownerLandAmount !== "" && ownerMutatedLandAmount !== "") {
            var gridData = ownerWiseMutationSummaryGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                var landMasterId = deedNoCombo.value();
                var ownerInfoId = ownerInfoCombo.value();
                //if (itm.LandMasterId === landMasterId && itm.OwnerInfoId === ownerInfoId) {
                //    AjaxManager.NotifyMsg("btnAddToListOwnerWise", "error", "right", 1500, "Already Added!");
                //    return;
                //}
            }
            
            var obj = new Object();
            obj.OwnerWiseMutationDetailId = AjaxManager.DefaultGuidId();
            //obj.OwnerWiseMutationDetailId = ownerWiseMutationDetailId;
            //obj.MutationMasterId = mutationMasterId;
            obj.MutationMasterId = AjaxManager.DefaultGuidId();
            obj.LandMasterId = deedNoCombo.value();
            obj.DeedNo = deedNoCombo.text();
            obj.KhatianTypeId = khatianTypeCombo.value();
            obj.KhatianTypeName = khatianTypeCombo.text();
            obj.OwnerInfoId = ownerInfoCombo.value();
            obj.OwnerInfoName = ownerInfoCombo.text();
            obj.OwnerLandAmount = ownerLandAmount;
            obj.OwnerMutatedLandAmount = ownerMutatedLandAmount;

            gbOwnerWiseMutationList.unshift(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: gbOwnerWiseMutationList,
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
            ownerWiseMutationSummaryGrid.setDataSource(gridDataSource);
            MutationInfoDetailsHelper.ClearOwnerWiseMutationDetailsForm();
        } else {
            if (deedNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbDeedNo", "error", "right", 1500, "Required");
                AjaxManager.NotifyMsg("btnAddToListOwnerWise", "error", "right", 1500, "Deed No Required");
            }
            if (khatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbKhatianType", "error", "right", 1500, "Required");
            }
            if (ownerInfoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbOwnerInfo", "error", "right", 1500, "Required");
                AjaxManager.NotifyMsg("btnAddToListOwnerWise", "error", "right", 1500, "Owner Required");
            }
            if (ownerLandAmount === "" || ownerLandAmount == undefined) {
                AjaxManager.NotifyMsg("txtOwnerLandAmount", "error", "right", 1500, "Required");
            }
            if (ownerMutatedLandAmount === "" || ownerMutatedLandAmount == undefined) {
                AjaxManager.NotifyMsg("txtOwnerMutatedLandAmount", "error", "right", 1500, "Required");
            }
        }
    },
    ClearOwnerWiseMutationDetailsForm: function () {
        $("#cmbOwnerInfo").data("kendoComboBox").value("");
        $("#txtOwnerLandAmount").val("");
        $("#txtOwnerMutatedLandAmount").data("kendoNumericTextBox").value("");
    },
    FillOwnerWiseMutationDetailForm: function (obj) {
        $("#btnAddToListOwnerWise").text("Update Owner Wise Mutation");
        $("#btnAddToListOwnerWise").addClass("fa fa-edit");

        $("#cmbDeedNo").data("kendoComboBox").value(obj.LandMasterId);
        $("#cmbDeedNo").data("kendoComboBox").text(obj.cmbDeedNo);
        MutationInfoDetailsHelper.ChangeEventOfDeedNoCombo();
        $("#cmbKhatianType").data("kendoComboBox").value(obj.KhatianTypeId);
        $("#cmbKhatianType").data("kendoComboBox").text(obj.KhatianTypeName);
        MutationInfoDetailsHelper.ChangeEventOfKhatianTypeCombo();
        $("#cmbOwnerInfo").data("kendoComboBox").value(obj.OwnerInfoId);
        $("#cmbOwnerInfo").data("kendoComboBox").text(obj.OwnerInfoName);
        $("#txtOwnerLandAmount").val(obj.OwnerLandAmount);
        $("#txtOwnerMutatedLandAmount").data("kendoNumericTextBox").value(obj.OwnerMutatedLandAmount);
    },
    UpdateToListOwnerWise: function () {
        $("#btnAddToListOwnerWise").text("Add Owner Wise Mutation");
        $("#btnAddToListOwnerWise").addClass("fas fa-arrow-down");

        var deedNoCombo = $("#cmbDeedNo").data("kendoComboBox");
        var khatianTypeCombo = $("#cmbKhatianType").data("kendoComboBox");
        var ownerInfoCombo = $("#cmbOwnerInfo").data("kendoComboBox");
        var ownerLandAmount = $("#txtOwnerLandAmount").val();
        var ownerMutatedLandAmount = $("#txtOwnerMutatedLandAmount").data("kendoNumericTextBox").value();

        var grid = $("#grdOwnerWiseMutationSummary").data("kendoGrid");
        var selectedItem = grid.dataItem(grid.select());

        if (deedNoCombo.value() !== "" && khatianTypeCombo.value() !== "" && ownerInfoCombo.value() !== ""
            && ownerLandAmount !== "" && ownerMutatedLandAmount !== "") {
            var obj = new Object();
            obj.OwnerWiseMutationDetailId = selectedItem.OwnerWiseMutationDetailId !== AjaxManager.DefaultGuidId() ? selectedItem.OwnerWiseMutationDetailId : AjaxManager.DefaultGuidId();
            obj.MutationMasterId = selectedItem.MutationMasterId !== AjaxManager.DefaultGuidId() ? selectedItem.MutationMasterId : AjaxManager.DefaultGuidId();
            obj.LandMasterId = deedNoCombo.value();
            obj.DeedNo = deedNoCombo.text();
            obj.KhatianTypeId = khatianTypeCombo.value();
            obj.KhatianTypeName = khatianTypeCombo.text();
            obj.OwnerInfoId = ownerInfoCombo.value();
            obj.OwnerInfoName = ownerInfoCombo.text();
            obj.OwnerLandAmount = ownerLandAmount;
            obj.OwnerMutatedLandAmount = ownerMutatedLandAmount;

            for (var i = 0; i < gbOwnerWiseMutationList.length; i++) {
                if (gbOwnerWiseMutationList[i].OwnerWiseMutationDetailId === selectedItem.OwnerWiseMutationDetailId) {
                    gbOwnerWiseMutationList.splice(i, 1);
                    break;
                }
            }

            gbOwnerWiseMutationList.unshift(obj);
            selectedItem.set('OwnerWiseMutationDetailId', obj.OwnerWiseMutationDetailId);
            selectedItem.set('MutationMasterId', obj.MutationMasterId);
            selectedItem.set('LandMasterId', obj.LandMasterId);
            selectedItem.set('DeedNo', obj.DeedNo);
            selectedItem.set('KhatianTypeId', obj.KhatianTypeId);
            selectedItem.set('KhatianTypeName', obj.KhatianTypeName);
            selectedItem.set('OwnerInfoId', obj.OwnerInfoId);
            selectedItem.set('OwnerInfoName', obj.OwnerInfoName);
            selectedItem.set('OwnerLandAmount', obj.OwnerLandAmount);
            selectedItem.set('OwnerMutatedLandAmount', obj.OwnerMutatedLandAmount);

            MutationInfoDetailsHelper.CalculateTotalLandAmount();
            MutationInfoDetailsHelper.ClearOwnerWiseMutationDetailsForm();
        } else {
            if (deedNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbDeedNo", "error", "right", 1500, "Required");
                AjaxManager.NotifyMsg("btnAddToListOwnerWise", "error", "right", 1500, "Deed No Required");
            }
            if (khatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbKhatianType", "error", "right", 1500, "Required");
            }
            if (ownerInfoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbOwnerInfo", "error", "right", 1500, "Required");
                AjaxManager.NotifyMsg("btnAddToListOwnerWise", "error", "right", 1500, "Owner Required");
            }
            if (ownerLandAmount === "" || ownerLandAmount == undefined) {
                AjaxManager.NotifyMsg("txtOwnerLandAmount", "error", "right", 1500, "Required");
            }
            if (ownerMutatedLandAmount === "" || ownerMutatedLandAmount == undefined) {
                AjaxManager.NotifyMsg("txtOwnerMutatedLandAmount", "error", "right", 1500, "Required");
            }
        }
    },

    FillMutationMasterDetailsForm: function (obj) {
        if (obj.IsRecorded == true) {
            $("#chkIsRecorded").prop('checked', true)
        } else {
            $("#chkIsRecorded").prop('checked', false)
        };
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
        $("#hdnMutationMasterId").val(obj.MutationMasterId);
        $("#cmbCmnDivision").data("kendoComboBox").value(obj.DivisionId);

        MutationInfoDetailsHelper.ChangeEventOfDivisionCombo();
        $("#cmbCmnDistrict").data("kendoComboBox").value(obj.DistrictId);

        MutationInfoDetailsHelper.ChangeEventOfDistrictCombo();
        $("#cmbCmnUpozila").data("kendoComboBox").value(obj.UpozilaId);

        MutationInfoDetailsHelper.ChangeEventOfUpozilaCombo();

        $("#cmbCmnMouza").data("kendoComboBox").value(obj.MouzaId);       

        $("#txtMutationApplicationNo").val(obj.MutationApplicationNo);
        $("#txtMutationApplicationDate").data("kendoDatePicker").value(obj.MutationApplicationDate);
        $("#txtCaseNo").val(obj.CaseNo);
        $("#txtDCRNo").val(obj.Dcrno);
        $("#txtMutationKhatianNo").val(obj.MutationKhatianNo);
        $("#txtHoldingNo").val(obj.HoldingNo);
        MutationInfoDetailsHelper.ChangeEventOfMouzaCombo();
        $("#txtRemarks").val(obj.Remarks);
        $("#txtFileRemarks").val(obj.FileRemarks);
        $("#txtTotalAreaOfLand").val(obj.OwnerLandAmount);
        //$("#txtMutatedLand").val(obj.OwnerMutatedLandAmount);
        //var a = $("#txtTotalAreaOfLand").val();
        //var b = $("#txtMutatedLand").val();
        //var c = a - b;
        //$("#txtNonMutatedLand").val(c);
        //Fill Plot Wise Mutation Grid
        MutationInfoDetailsHelper.FillPlotWiseMutationSummaryGrid(obj.MutationMasterId);
        //Fill Owner Wise Mutation Summary Grid
        MutationInfoDetailsHelper.FillOwnerWiseMutationSummaryGrid(obj.MutationMasterId);       

        files = obj.FilesVm;
        MutationInfoDetailsHelper.LoadFile();
    },
    FillPlotWiseMutationSummaryGrid: function (mutationMasterId) {
        // Mutation Detail List
        var plotWiseMutationDetailObjs = MutationInfoDetailsManager.GetAllPlotWiseMutationDetailListByMutationMasterId(mutationMasterId);
        var plotWiseMutationSummary = $("#grdPlotWiseMutationSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: plotWiseMutationDetailObjs,
            schema: {
                model: {
                    fields: {
                    }
                }
            }
        });
        plotWiseMutationSummary.setDataSource(gridDataSource);
        gbPlotWiseMutationList = plotWiseMutationDetailObjs;
        MutationInfoDetailsHelper.CalculateTotalLandAmount();
    },
    FillOwnerWiseMutationSummaryGrid: function (mutationMasterId) {
        // Mutation Detail List
        var mutationDetailObjs = MutationInfoDetailsManager.GetAllOwnerWiseMutationDetailListByMutationMasterId(mutationMasterId);
        var mutationSummary = $("#grdOwnerWiseMutationSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: mutationDetailObjs,
            schema: {
                model: {
                    fields: {
                    }
                }
            }
        });
        mutationSummary.setDataSource(gridDataSource);
        gbOwnerWiseMutationList = mutationDetailObjs;
    },

    ValidateForm: function () {
        var res = true;

        var cmnDivision = $("#cmbCmnDivision").data("kendoComboBox");
        if (cmnDivision.value() === "" || cmnDivision.value() === undefined) {
            AjaxManager.NotifyMsg("cmbCmnDivision", "error", "right", 1500, "Required");
            res = false;
        }
        var cmnDistrict = $("#cmbCmnDistrict").data("kendoComboBox");
        if (cmnDistrict.value() === "" || cmnDistrict.value() === undefined) {
            AjaxManager.NotifyMsg("cmbCmnDistrict", "error", "right", 1500, "Required");
            res = false;
        }
        var cmnUpozila = $("#cmbCmnUpozila").data("kendoComboBox");
        if (cmnUpozila.value() === "" || cmnUpozila.value() === undefined) {
            AjaxManager.NotifyMsg("cmbCmnUpozila", "error", "right", 1500, "Required");
            res = false;
        }
        var cmnMouza = $("#cmbCmnMouza").data("kendoComboBox");
        if (cmnMouza.value() === "" || cmnMouza.value() === undefined) {
            AjaxManager.NotifyMsg("cmbCmnMouza", "error", "right", 1500, "Required");
            res = false;
        }

        var mutationApplicationDate = $("#txtMutationApplicationDate").data("kendoDatePicker");
        if (mutationApplicationDate.value() === "" || mutationApplicationDate.value() === undefined || mutationApplicationDate.value() === null) {
            AjaxManager.NotifyMsg("txtMutationApplicationDate", "error", "right", 1500, "Required");
            res = false;
        }

        var holdingNo = $("#txtHoldingNo");
        if (holdingNo.val() === "" || holdingNo.val() === undefined) {
            AjaxManager.NotifyMsg("txtHoldingNo", "error", "right", 1500, "Required");
            res = false;
        }

        //Plot Wise Mutation List if empty
        if (gbPlotWiseMutationList.length <= 0) {
            AjaxManager.NotifyMsg("btnSubmitApplication", "error", "left", 1500, "Plot Wise Mutation Detail Required!");
            res = false;
        }

        //Mutation List if empty
        if (gbOwnerWiseMutationList.length <= 0) {
            AjaxManager.NotifyMsg("btnSubmitApplication", "error", "left", 1500, "Mutation Detail Required!");
            res = false;
        }

        //Plot Wise Mutated Land & Owner Wise Mutated Land Will be Equal
        var totalPlotWiseMutatedLand = 0;
        var plotWiseMutationSummaryGrid = $("#grdPlotWiseMutationSummary").data("kendoGrid");
        var gridData = plotWiseMutationSummaryGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var itm = gridData[i];
            totalPlotWiseMutatedLand += itm.PlotWiseMutationLandAmount;
            var total = totalPlotWiseMutatedLand.toFixed(2);
        }

        var totalOwnerWiseMutatedLand = 0;
        var ownerWiseMutationSummaryGrid = $("#grdOwnerWiseMutationSummary").data("kendoGrid");
        var gridDataOwner = ownerWiseMutationSummaryGrid.dataSource.data();
        for (var i = 0; i < gridDataOwner.length; i++) {
            var itmOwner = gridDataOwner[i];
            totalOwnerWiseMutatedLand += itmOwner.OwnerMutatedLandAmount;
            var oTotal = totalOwnerWiseMutatedLand.toFixed(2);
        }
        if (total !== oTotal) {
            AjaxManager.NotifyMsg("btnSubmitApplication", "error", "left", 15000, "Plot Wise & Owner Wise Mutated Total Amount is Not Equal!");
            res = false;
        }

        return res;
    },
    ClearFullForm: function () {
        $("#btnSubmitApplication").text("Submit");
        $("#btnSubmitApplication").addClass("glyphicon glyphicon-floppy-disk");

        $("#btnAddToListOwnerWise").text("Add Owner Wise Mutation");
        $("#btnAddToListOwnerWise").addClass("fas fa-arrow-down");

        $("#btnAddToListPlotWiseMutation").text("Add Plot Wise Mutation");
        $("#btnAddToListPlotWiseMutation").addClass("fas fa-arrow-down");

        gbOwnerWiseMutationList = [];
        gbPlotWiseMutationList = [];

        $("#hdnMutationMasterId").val("00000000-0000-0000-0000-000000000000");
        $("#cmbCmnDivision").data("kendoComboBox").value("");
        $("#cmbCmnDistrict").data("kendoComboBox").value("");
        $("#cmbCmnUpozila").data("kendoComboBox").value("");
        $("#cmbCmnMouza").data("kendoComboBox").value("");
        $("#txtMutationApplicationNo").val("");
        //$("#txtMutationApplicationDate").data("kendoDatePicker").value("");
        $("#txtCaseNo").val("");
        $("#txtDCRNo").val("");
        $("#txtMutationKhatianNo").val("");
        $("#chkIsRecorded").prop('checked', false);
        $("#txtHoldingNo").val("");
        $("#txtRemarks").val("");
        $("#txtFileRemarks").val("");
        $("#cmbKhatianType").data("kendoComboBox").value("");
        MutationInfoDetailsHelper.ClearPlotWiseMutationDetailsForm();
        $("#cmbKhatianNo").data("kendoComboBox").value("");
        $("#cmbDagNo").data("kendoComboBox").value("");
        $("#txtTotalAreaOfLand").val("");
        $("#txtMutatedLand").val("");
        $("#txtNonMutatedLand").val("");
        MutationInfoDetailsHelper.ClearOwnerWiseMutationDetailsForm();
        $("#grdKhatianDetailSummary").data("kendoGrid").dataSource.data([]);
        $("#grdPlotWiseMutationSummary").data("kendoGrid").dataSource.data([]);
        $("#grdLandOwnerDetailSummary").data("kendoGrid").dataSource.data([]);
        $("#grdOwnerWiseMutationSummary").data("kendoGrid").dataSource.data([]);

        files = [];
        MutationInfoDetailsHelper.LoadFile();
    },
    CalculateTotalLandAmount: function () {
        var gbTotalLandAmount = 0;
        var OwnerDetailSummaryGrid = $("#grdPlotWiseMutationSummary").data("kendoGrid");

        var gridData = OwnerDetailSummaryGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var itm = gridData[i];
            gbTotalLandAmount += itm.PlotWiseMutationLandAmount;
        }
        $("#spnTotalLandAmount").html(gbTotalLandAmount.toFixed(2));
        //var tem = $("#spnTotalLandAmount").html();
        //console.log(tem);

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