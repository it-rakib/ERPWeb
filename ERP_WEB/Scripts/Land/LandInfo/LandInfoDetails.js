
var PlotWiseLandSaleDetailList = [];
var OwnerWiseLandSaleDetailList = [];

var PlotWiseLandTransferDetailList = [];
var OwnerWiseLandTransferDetailList = [];

var LandDetailsOwnerList = [];
var LandDetailsKhatianList = [];

var files = [];
var BayaDeedList = [];
var isDelete = false;

var LandInfoDetailsManager = {
    SaveLandMasterDetails: function () {
        var msg = "";
        if (LandInfoDetailsHelper.ValidateForm()) {
            var createOrUpdateLandMasterCommand = LandInfoDetailsHelper.CreateLandMasterObject();
            var jsonParam = JSON.stringify(createOrUpdateLandMasterCommand);
            var serviceUrl = _baseUrlLand + "/api/LandMaster/CreateOrUpdateLandMaster";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdLandMasterSummary").data("kendoGrid").dataSource.read();
                            LandInfoDetailsHelper.ClearFullForm();
                            $("#divLandInfoSummary").show();
                            $("#divLandInfoDetails").hide();
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
    GetAllMutatedDeedNoList() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/MutationMaster/mutatedDeedNoList");
        return list == null ? [] : list;
    },
    GetLandOwnerType() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/LandOwnerType/all");
        return list == null ? [] : list;
    },
    GetSubRegOfficeByUpozilaId: function (upozilaId) {
        var objSubRegOfc = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/CmnSubRegOffice/subRegOfc/" + upozilaId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objSubRegOfc = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objSubRegOfc;
    },
    GetKhatianType() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/KhatianType/all");
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

    GetAllPlotWiseLandTransferDetailByLandMasterId: function (landMasterId) {
        var objLandTransferDetailDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/plotWiseLandTransferDetail/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objLandTransferDetailDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objLandTransferDetailDetail;
    },
    GetAllOwnerWiseLandTransferDetailByLandMasterId: function (landMasterId) {
        var objLandTransferDetailDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/ownerWiseLandTransferDetail/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objLandTransferDetailDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objLandTransferDetailDetail;
    },

    GetAllPlotWiseLandSaleDetailByLandMasterId: function (landMasterId) {
        var objLandTransferDetailDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/plotWiseLandSaleDetail/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objLandTransferDetailDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objLandTransferDetailDetail;
    },
    GetAllOwnerWiseLandSaleDetailByLandMasterId: function (landMasterId) {
        var objLandTransferDetailDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/ownerWiseLandSaleDetail/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objLandTransferDetailDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objLandTransferDetailDetail;
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
    },
    GetAllKhatianTypeListByLandMasterId: function (landMasterId) {
        var objKhatianType = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/khatianTypes/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objKhatianType = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objKhatianType;
    },
    GetAllBayaDeedDetailListByLandMasterId: function (landMasterId) {
        var objDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/bayaDeedDetail/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objDetail;
    },
    GetAllDagNoListByLandMasterKhatianType: function (landMasterId, khatianTypeId) {
        var objDagNo = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/MutationMaster/dagNoList/" + landMasterId + "/" + khatianTypeId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objDagNo = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objDagNo;
    },
    GetAllTransferedOwnerInfoByLandMasterKhatianTypeId: function (landMasterId, khatianTypeId) {
        var objOwnerInfo = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/MutationMaster/transferedOwnerInfoList/" + landMasterId + "/" + khatianTypeId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objOwnerInfo = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objOwnerInfo;
    },

    GetTotalPlotWiseMutatedLandAmountByLandMasterKhatianTypeDagNo: function (transferedLandMasterId, transferedKhatianTypeId, transferedDagNo) {
        var objMutatedLand = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/MutationMaster/totalPlotWiseMutatedLand/" + transferedLandMasterId + "/" + transferedKhatianTypeId + "/" + transferedDagNo;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objMutatedLand = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objMutatedLand;
    },
    GetTotalPlotWiseTransferedLandAmountByLandMasterKhatianTypeDagNo: function (transferedLandMasterId, transferedKhatianTypeId, transferedDagNo) {
        var objTotalPlotWiseTransferedLand = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/totalPlotWiseTransferedLandAmount/" + transferedLandMasterId + "/" + transferedKhatianTypeId + "/" + transferedDagNo;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalPlotWiseTransferedLand = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalPlotWiseTransferedLand;
    },

    GetTotalOwnerWiseMutatedLandAmountByLandMasterKhatianTypeOwnerInfoId: function (transferedLandMasterId, transferedKhatianTypeId, transferedOwnerInfoId) {
        var objMutatedLand = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/MutationMaster/totalOwnerWiseMutatedLand/" + transferedLandMasterId + "/" + transferedKhatianTypeId + "/" + transferedOwnerInfoId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objMutatedLand = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objMutatedLand;
    },
    GetTotalOwnerWiseTransferedLandAmountByLandMasterKhatianTypeOwnerInfoId: function (transferedLandMasterId, transferedKhatianTypeId, transferedOwnerInfoId) {
        var objTotalOwnerWiseTransferedLand = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/totalOwnerWiseTransferedLandAmount/" + transferedLandMasterId + "/" + transferedKhatianTypeId + "/" + transferedOwnerInfoId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalOwnerWiseTransferedLand = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalOwnerWiseTransferedLand;
    },

    GetTotalPlotWiseSaleLandAmountByLandMasterKhatianTypeDagNo: function (saleLandMasterId, saleKhatianTypeId, saleDagNo) {
        var objTotalPlotWiseTransferedLand = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/totalPlotWiseSaleLandAmount/" + saleLandMasterId + "/" + saleKhatianTypeId + "/" + saleDagNo;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalPlotWiseTransferedLand = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalPlotWiseTransferedLand;
    },
    GetTotalOwnerWiseSaleLandAmountByLandMasterKhatianTypeOwnerInfoId: function (saleLandMasterId, saleKhatianTypeId, saleOwnerInfoId) {
        var objTotalOwnerWiseTransferedLand = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/totalOwnerWiseSaleLandAmount/" + saleLandMasterId + "/" + saleKhatianTypeId + "/" + saleOwnerInfoId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalOwnerWiseTransferedLand = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalOwnerWiseTransferedLand;
    },

}

var LandInfoDetailsHelper = {
    InitLandInfoDetails: function () {
        $("#btnAddNew").click(function () {
            LandInfoDetailsHelper.ClearFullForm();
            $("#divLandInfoSummary").hide();
            $("#divLandInfoDetails").show();
        });
        $("#btnSubmitApplication").click(function () {
            
            LandInfoDetailsManager.SaveLandMasterDetails();
        });
        $("#btnCancelApplication").click(function () {
            LandInfoDetailsHelper.ClearFullForm();
            $("#divLandInfoSummary").show();
            $("#divLandInfoDetails").hide();
        });

        $("#btnAddKhatian").click(function () {
            if ($("#btnAddKhatian").text() === "Add Khatian") {
                LandInfoDetailsHelper.AddToListKhatian();
            } else {
                LandInfoDetailsHelper.UpdateToListKhatian();
            }
        });
        $("#btnAddOwner").click(function () {
            if ($("#btnAddOwner").text() === "Add Owner") {
                LandInfoDetailsHelper.AddToListOwner();
            } else {
                LandInfoDetailsHelper.UpdateToListOwner();
            }
        });

        $("#btnAddPlotWiseLandTransfer").click(function () {
            if ($("#btnAddPlotWiseLandTransfer").text() === "Add Plot Wise Land Transfer") {
                LandInfoDetailsHelper.AddToListPlotWiseLandTransfer();
            } else {
                LandInfoDetailsHelper.UpdateToListPlotWiseLandTransfer();
            }
        });
        $("#btnAddOwnerWiseLandTransfer").click(function () {
            if ($("#btnAddOwnerWiseLandTransfer").text() === "Add Owner Wise Land Transfer") {
                LandInfoDetailsHelper.AddToListOwnerWiseLandTransfer();
            } else {
                LandInfoDetailsHelper.UpdateToListOwnerWiseLandTransfer();
            }
        });

        $("#btnAddPlotWiseLandSale").click(function () {
            if ($("#btnAddPlotWiseLandSale").text() === "Add Plot Wise Land Sale") {
                LandInfoDetailsHelper.AddToListPlotWiseLandSale();
            } else {
                LandInfoDetailsHelper.UpdateToListPlotWiseLandSale();
            }
        });
        $("#btnAddOwnerWiseLandSale").click(function () {
            if ($("#btnAddOwnerWiseLandSale").text() === "Add Owner Wise Land Sale") {
                LandInfoDetailsHelper.AddToListOwnerWiseLandSale();
            } else {
                LandInfoDetailsHelper.UpdateToListOwnerWiseLandSale();
            }
        });

        $("#btnAddBayaDeed").click(function () {
            if ($("#btnAddBayaDeed").text() === "Add Baya Deed") {
                LandInfoDetailsHelper.AddToListBayaDeed();
            } else {
                LandInfoDetailsHelper.UpdateToListBayaDeed();
            }
        });
        
        LandInfoDetailsHelper.InitLandOwnerType();
        LandInfoDetailsHelper.GenerateDatePicker();
        LandInfoDetailsHelper.GenerateNumericTextBox();
        LandHelper.LoadCmnDivisionCombo("cmbCmnDivision");
        LandHelper.LoadCmnDistrictCombo("cmbCmnDistrict");
        LandHelper.LoadCmnUpozilaCombo("cmbCmnUpozila");
        LandHelper.LoadCmnMouzaCombo("cmbCmnMouza");

        //----Land Transfer-----//
        LandInfoDetailsHelper.GenerateTransferedDeedNoMultiColumnComboBox("cmbTransferedDeedNo");
        LandInfoDetailsHelper.LoadTransferedKhatianTypeCombo("cmbTransferedKhatianType");
        LandInfoDetailsHelper.LoadTransferedDagNoCombo("cmbTransferedDagNo");
        LandInfoDetailsHelper.LoadTransferedOwnerInfoCombo("cmbTransferedOwnerInfo");

        LandInfoDetailsHelper.LoadKhatianTypeCombo("cmbKhatianType");
        LandInfoDetailsHelper.LoadSubRegOfficeCombo("cmbSubRegOffice");
        LandInfoDetailsHelper.LoadOwnerInfoCombo("cmbOwnerInfo");
        //----Land Transfer End-----//

        //----Land Sale---//
        LandInfoDetailsHelper.LoadSaleDeedNoCombo("cmbSaleDeedNo");
        LandInfoDetailsHelper.LoadSaleKhatianTypeCombo("cmbSaleKhatianType");
        LandInfoDetailsHelper.LoadSaleDagNoCombo("cmbSaleDagNo");
        LandInfoDetailsHelper.LoadSaleOwnerInfoCombo("cmbSaleOwnerInfo");
        //----Land Sale End---//

        $("#cmbCmnDivision").change(function () {
            LandHelper.ChangeEventOfDivisionCombo();
        });
        $("#cmbCmnDistrict").change(function () {
            LandHelper.ChangeEventOfDistrictCombo();
        });
        $("#cmbCmnUpozila").change(function () {
            LandHelper.ChangeEventOfUpozilaCombo();
            LandInfoDetailsHelper.ChangeEventOfUpozilaComboForSubRegOffice();
        });
        $(".chkLandOwnerType").change(function () {
            $("#divLandOwnerTypeOtherRemarks").hide();
            $('.chkLandOwnerType').not(this).prop('checked', false);

            var val = $("input[type=checkbox][lwt-id=c0620ce1-9225-4a6a-adc5-12701fccdbfd]:checked").val();
            if (val === "on") {
                $("#divLandOwnerTypeOtherRemarks").show();
            }
        });

        $("#chkIsTransfered").change(function () {
            $("#divTransferedLand").hide();
            var val = $("input[type=checkbox]:checked").val();
            if (val === "chkIsTransfered") {
                $("#divTransferedLand").show();
            }
        });

        $("#chkIsSale").change(function () {
            var grid = $("#grdOwnerDetailSummary").data("kendoGrid");
            $("#divSaleLand").hide();
            $("#divOwnerInfo").show();
            $("#divOwnerInfoSale").hide();
            var val = $("input[type=checkbox]:checked").val();
            if (val === "chkIsSale") {
                $("#divSaleLand").show();
                $("#divOwnerInfo").hide();
                $("#divOwnerInfoSale").show();
                
                grid.hideColumn(5);
                grid.showColumn(6);
            }
        });

        $("#cmbTransferedDeedNo").change(function () {
            LandInfoDetailsHelper.ChangeEventOfTransferedDeedNoMultiColumnCombo();
        });
        $("#cmbTransferedKhatianType").change(function () {
            LandInfoDetailsHelper.ChangeEventOfTransferedKhatianTypeCombo();
        });
        $("#cmbTransferedDagNo").change(function () {
            LandInfoDetailsHelper.CalculateTotalPlotWiseMutatedLandAmount();
        });
        $("#cmbTransferedOwnerInfo").change(function () {
            LandInfoDetailsHelper.CalculateTotalOwnerWiseMutatedLandAmount();
        });

        $("#cmbSaleDeedNo").change(function () {
            LandInfoDetailsHelper.ChangeEventOfSaleDeedNoCombo();
        });
        $("#cmbSaleKhatianType").change(function () {
            LandInfoDetailsHelper.ChangeEventOfSaleKhatianTypeCombo();
        });
        $("#cmbSaleDagNo").change(function () {
            LandInfoDetailsHelper.CalculateTotalPlotWiseMutatedLandAmountSale();
        });
        $("#cmbSaleOwnerInfo").change(function () {
            LandInfoDetailsHelper.CalculateTotalOwnerWiseMutatedLandAmountSale();
        });
    },

    GenerateTransferedDeedNoMultiColumnComboBox: function (cmbTransferedDeedNo) {
        $("#" + cmbTransferedDeedNo).kendoMultiColumnComboBox({
            dataSource: LandInfoDetailsManager.GetAllMutatedDeedNoList(),
            dataTextField: "DeedNo",
            dataValueField: "LandMasterId",
            //select: function (e) {
            //    //call preventDefault() to prevent the selection
            //    var status = e.dataItem.Status;
            //    if (status == "Non-Mutated Deed") {
            //        AjaxManager.NotifyMsg("cmbTransferedDeedNo", "error", "right", 3000, "Mutated Deed Required For Land Transfer!");
            //        e.preventDefault();
            //        $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox").value("");
            //    }
            //},
            columns: [
                { field: "DeedNo", title: "Mutated Deed No"},
                //{ field: "Status", title: "Status", width: 120 }
            ],
            filter: "startswith",
            filterFields: ["DeedNo"],
            placeholder: "---Select Transfered Deed No---",
            height: 300
        });
    },
    ChangeEventOfTransferedDeedNoMultiColumnCombo: function () {
        var transferedLandMasterId = $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox").value();
        var data = LandInfoDetailsManager.GetAllKhatianTypeListByLandMasterId(transferedLandMasterId);
        var transferedKhatianTypeCombo = $("#cmbTransferedKhatianType").data("kendoComboBox");
        transferedKhatianTypeCombo.value("");
        transferedKhatianTypeCombo.text("");
        transferedKhatianTypeCombo.setDataSource(data);
    },
    ChangeEventOfTransferedKhatianTypeCombo: function () {
        var transferedLandMasterId = $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox").value();
        var transferedKhatianTypeId = $("#cmbTransferedKhatianType").data("kendoComboBox").value();
        
        var data = LandInfoDetailsManager.GetAllDagNoListByLandMasterKhatianType(transferedLandMasterId, transferedKhatianTypeId);
        var transferedDagNoCombo = $("#cmbTransferedDagNo").data("kendoComboBox");
        transferedDagNoCombo.value("");
        transferedDagNoCombo.text("");
        transferedDagNoCombo.setDataSource(data);
        
        var ownerInfos = LandInfoDetailsManager.GetAllTransferedOwnerInfoByLandMasterKhatianTypeId(transferedLandMasterId, transferedKhatianTypeId);
        var transferedOwnerInfoCombo = $("#cmbTransferedOwnerInfo").data("kendoComboBox");
        transferedOwnerInfoCombo.value("");
        transferedOwnerInfoCombo.text("");
        transferedOwnerInfoCombo.setDataSource(ownerInfos);
    },
    CalculateTotalPlotWiseMutatedLandAmount: function () {
        var transferedLandMasterId = $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox").value();
        var transferedKhatianTypeId = $("#cmbTransferedKhatianType").data("kendoComboBox").value();
        var transferedDagNo = $("#cmbTransferedDagNo").data("kendoComboBox").value();

        var totalPlotWiseMutatedLand = LandInfoDetailsManager.GetTotalPlotWiseMutatedLandAmountByLandMasterKhatianTypeDagNo(transferedLandMasterId, transferedKhatianTypeId, transferedDagNo);
        $("#txtTotalPlotWiseMutationLandAmount").val(parseFloat(totalPlotWiseMutatedLand).toFixed(2));

        var totalPlotWiseTransferedLandAmount = LandInfoDetailsManager.GetTotalPlotWiseTransferedLandAmountByLandMasterKhatianTypeDagNo(transferedLandMasterId, transferedKhatianTypeId, transferedDagNo);

        var totalPlotWiseRemainMutatedLand = parseFloat(totalPlotWiseMutatedLand) - parseFloat(totalPlotWiseTransferedLandAmount);
        $("#txtTotalPlotWiseRemainMutationLandAmount").val(parseFloat(totalPlotWiseRemainMutatedLand).toFixed(2));
    },
    CalculateTotalOwnerWiseMutatedLandAmount: function () {
        var transferedLandMasterId = $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox").value();
        var transferedKhatianTypeId = $("#cmbTransferedKhatianType").data("kendoComboBox").value();
        var transferedOwnerInfoId = $("#cmbTransferedOwnerInfo").data("kendoComboBox").value();
        
        var totalOwnerWiseMutatedLand = LandInfoDetailsManager.GetTotalOwnerWiseMutatedLandAmountByLandMasterKhatianTypeOwnerInfoId(transferedLandMasterId, transferedKhatianTypeId, transferedOwnerInfoId);
        $("#txtTotalOwnerWiseMutationLandAmount").val(parseFloat(totalOwnerWiseMutatedLand).toFixed(2));

        var totalOwnerWiseTransferedLandAmount = LandInfoDetailsManager.GetTotalOwnerWiseTransferedLandAmountByLandMasterKhatianTypeOwnerInfoId(transferedLandMasterId, transferedKhatianTypeId, transferedOwnerInfoId);

        var totalOwnerWiseRemainMutatedLand = parseFloat(totalOwnerWiseMutatedLand) - parseFloat(totalOwnerWiseTransferedLandAmount);
        $("#txtTotalOwnerWiseRemainMutatedLand").val(parseFloat(totalOwnerWiseRemainMutatedLand).toFixed(2));
    },

    InitLandOwnerType() {
        var landOwnerTypes = LandInfoDetailsManager.GetLandOwnerType();
        var id = 0;
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
        $("#txtBayaDeedDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
        $("#txtEntryDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtPlotWiseSaleLandAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtOwnerWiseSaleLandAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtPlotWiseTransferedLandAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtOwnerWiseTransferedLandAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtTotalLandAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtLandRegAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtLandPurchaseAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtLandDevelopmentAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtLandAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0,
            change: function () {
                LandInfoDetailsHelper.CalculateAmountValue();
            }
        });
        $("#txtOwnerRegAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 2,
            min: 0
        });
        $("#txtOwnerPurchaseAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        $("#txtLandOtherAmount").kendoNumericTextBox({
            format: "n2",
            decimals: 3,
            min: 0
        });
        //$("#txtKhatianNo").kendoNumericTextBox({
        //    format: "n0",
        //    decimals: 3,
        //    min: 0
        //});
    },
    CalculateAmountValue: function () {
        var totalLandAmount = parseFloat($('#txtTotalLandAmount').data('kendoNumericTextBox').value());
        var landRegAmount = parseFloat($('#txtLandRegAmount').data('kendoNumericTextBox').value());
        var landPurchaseAmount = parseFloat($('#txtLandPurchaseAmount').data('kendoNumericTextBox').value());
        var ownerLandAmount = parseFloat($('#txtLandAmount').data('kendoNumericTextBox').value());
            
        var calOwnerRegAmount = (UtilityHelper.IsNaN(landRegAmount) / UtilityHelper.IsNaN(totalLandAmount)) * UtilityHelper.IsNaN(ownerLandAmount);
        var calOwnerPurAmount = (UtilityHelper.IsNaN(landPurchaseAmount) / UtilityHelper.IsNaN(totalLandAmount)) * UtilityHelper.IsNaN(ownerLandAmount);

        if (totalLandAmount >= ownerLandAmount) {
            $('#txtOwnerRegAmount').data('kendoNumericTextBox').value(calOwnerRegAmount);
            $('#txtOwnerPurchaseAmount').data('kendoNumericTextBox').value(calOwnerPurAmount);
        } else {
            AjaxManager.NotifyMsg("txtLandAmount", "error", "bottom", 1500, "Not More Than Total Land Amount!!");
            //$('#txtLandAmount').data('kendoNumericTextBox').value("");
            $('#txtOwnerRegAmount').data('kendoNumericTextBox').value(0);
            $('#txtOwnerPurchaseAmount').data('kendoNumericTextBox').value(0);
        }
    },

    LoadSaleDeedNoCombo(cmbSaleDeedNo) {
        UtilityHelper.LoadCombo(cmbSaleDeedNo, "LandMasterId", "DeedNo", LandInfoDetailsManager.GetAllMutatedDeedNoList(), "--Select Deed No(Sale)--");
    },
    LoadSaleKhatianTypeCombo(cmbSaleKhatianType) {
        UtilityHelper.LoadCombo(cmbSaleKhatianType, "KhatianTypeId", "KhatianTypeName", [], "--Select Name of Survey(Sale)--");
    },
    ChangeEventOfSaleDeedNoCombo: function () {
        var saleLandMasterId = $("#cmbSaleDeedNo").data("kendoComboBox").value();
        var data = LandInfoDetailsManager.GetAllKhatianTypeListByLandMasterId(saleLandMasterId);
        var saleKhatianTypeCombo = $("#cmbSaleKhatianType").data("kendoComboBox");
        saleKhatianTypeCombo.value("");
        saleKhatianTypeCombo.text("");
        saleKhatianTypeCombo.setDataSource(data);
    },
    LoadSaleDagNoCombo(cmbSaleDagNo) {
        UtilityHelper.LoadCombo(cmbSaleDagNo, "DagNo", "DagNo", [], "--Select Plot No(Sale)--");
    },
    LoadSaleOwnerInfoCombo(cmbSaleOwnerInfo) {
        UtilityHelper.LoadCombo(cmbSaleOwnerInfo, "TransferedOwnerInfoId", "TransferedOwnerInfoName", [], "--Select Name of The Owner(Sale)--");
    },
    ChangeEventOfSaleKhatianTypeCombo: function () {
        var saleLandMasterId = $("#cmbSaleDeedNo").data("kendoComboBox").value();
        var saleKhatianTypeId = $("#cmbSaleKhatianType").data("kendoComboBox").value();

        var data = LandInfoDetailsManager.GetAllDagNoListByLandMasterKhatianType(saleLandMasterId, saleKhatianTypeId);
        var saleDagNoCombo = $("#cmbSaleDagNo").data("kendoComboBox");
        saleDagNoCombo.value("");
        saleDagNoCombo.text("");
        saleDagNoCombo.setDataSource(data);

        var ownerInfos = LandInfoDetailsManager.GetAllTransferedOwnerInfoByLandMasterKhatianTypeId(saleLandMasterId, saleKhatianTypeId);
        var saleOwnerInfoCombo = $("#cmbSaleOwnerInfo").data("kendoComboBox");
        saleOwnerInfoCombo.value("");
        saleOwnerInfoCombo.text("");
        saleOwnerInfoCombo.setDataSource(ownerInfos);
    },
    CalculateTotalPlotWiseMutatedLandAmountSale: function () {
        var saleLandMasterId = $("#cmbSaleDeedNo").data("kendoComboBox").value();
        var saleKhatianTypeId = $("#cmbSaleKhatianType").data("kendoComboBox").value();
        var saleDagNo = $("#cmbSaleDagNo").data("kendoComboBox").value();

        var totalPlotWiseMutatedLand = LandInfoDetailsManager.GetTotalPlotWiseMutatedLandAmountByLandMasterKhatianTypeDagNo(saleLandMasterId, saleKhatianTypeId, saleDagNo);
        $("#txtTotalPlotWiseMutationLandAmountSale").val(parseFloat(totalPlotWiseMutatedLand).toFixed(2));

        var totalPlotWiseSaleLandAmount = LandInfoDetailsManager.GetTotalPlotWiseSaleLandAmountByLandMasterKhatianTypeDagNo(saleLandMasterId, saleKhatianTypeId, saleDagNo);

        var totalPlotWiseRemainMutatedLand = parseFloat(totalPlotWiseMutatedLand) - parseFloat(totalPlotWiseSaleLandAmount);
        $("#txtTotalPlotWiseRemainMutationLandAmountSale").val(parseFloat(totalPlotWiseRemainMutatedLand).toFixed(2));
    },
    CalculateTotalOwnerWiseMutatedLandAmountSale: function () {
        var saleLandMasterId = $("#cmbSaleDeedNo").data("kendoComboBox").value();
        var saleKhatianTypeId = $("#cmbSaleKhatianType").data("kendoComboBox").value();
        var saleOwnerInfoId = $("#cmbSaleOwnerInfo").data("kendoComboBox").value();

        var totalOwnerWiseMutatedLand = LandInfoDetailsManager.GetTotalOwnerWiseMutatedLandAmountByLandMasterKhatianTypeOwnerInfoId(saleLandMasterId, saleKhatianTypeId, saleOwnerInfoId);
        $("#txtTotalOwnerWiseMutationLandAmountSale").val(parseFloat(totalOwnerWiseMutatedLand).toFixed(2));

        var totalOwnerWiseSaleLandAmount = LandInfoDetailsManager.GetTotalOwnerWiseSaleLandAmountByLandMasterKhatianTypeOwnerInfoId(saleLandMasterId, saleKhatianTypeId, saleOwnerInfoId);

        var totalOwnerWiseRemainMutatedLand = parseFloat(totalOwnerWiseMutatedLand) - parseFloat(totalOwnerWiseSaleLandAmount);
        $("#txtTotalOwnerWiseRemainMutatedLandSale").val(parseFloat(totalOwnerWiseRemainMutatedLand).toFixed(2));
    },

    LoadKhatianTypeCombo(cmbKhatianType) {
        UtilityHelper.LoadCombo(cmbKhatianType, "KhatianTypeId", "KhatianTypeName", LandInfoDetailsManager.GetKhatianType(), "--Select Khatian Type--");
    },
    LoadSubRegOfficeCombo(cmbSubRegOffice) {
        UtilityHelper.LoadCombo(cmbSubRegOffice, "SubRegOfficeId", "SubRegOfficeName", [], "--Select Sub-Register Office--");
    },
    LoadOwnerInfoCombo(cmbOwnerInfo) {
        UtilityHelper.LoadCombo(cmbOwnerInfo, "OwnerInfoId", "OwnerInfoName", LandInfoSummaryManger.GetAllOwnerInfo(), "--Select Owner--");
    },
    LoadTransferedKhatianTypeCombo(cmbTransferedKhatianType) {
        UtilityHelper.LoadCombo(cmbTransferedKhatianType, "KhatianTypeId", "KhatianTypeName", [], "--Select Transfered Name of Survey--");
    },
    LoadTransferedDagNoCombo(cmbTransferedDagNo) {
        UtilityHelper.LoadCombo(cmbTransferedDagNo, "DagNo", "DagNo", [], "--Select Transfered Plot No--");
    },
    LoadTransferedOwnerInfoCombo(cmbTransferedOwnerInfo) {
        UtilityHelper.LoadCombo(cmbTransferedOwnerInfo, "TransferedOwnerInfoId", "TransferedOwnerInfoName", [], "--Select Transfered Name of The Owner--");
    },

    CalculateTotalLandAmount: function () {
        
        var gbTotalLandAmount = 0;
        var OwnerDetailSummaryGrid = $("#grdOwnerDetailSummary").data("kendoGrid");

        var gridData = OwnerDetailSummaryGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var itm = gridData[i];
            gbTotalLandAmount += itm.LandAmount;
        }
        $("#spnTotalLandAmount").html(gbTotalLandAmount.toFixed(2));
        //var tem = $("#spnTotalLandAmount").html();
            //console.log(tem);

    },
    ChangeEventOfUpozilaComboForSubRegOffice: function () {
        var upozilaId = $("#cmbCmnUpozila").data("kendoComboBox").value();
        var data = LandInfoDetailsManager.GetSubRegOfficeByUpozilaId(upozilaId);
        var subRegOfficeCombo = $("#cmbSubRegOffice").data("kendoComboBox");
        subRegOfficeCombo.value("");
        subRegOfficeCombo.text("");
        subRegOfficeCombo.setDataSource(data);
    },

    CreateLandMasterObject: function () {
        var obj = new Object();
        
        obj.LandMasterId = $("#hdnLandMasterId").val();
        obj.IsTransfered = $("#chkIsTransfered").is(":checked");
        obj.IsSale = $("#chkIsSale").is(":checked");
        obj.DivisionId = $("#cmbCmnDivision").data("kendoComboBox").value();
        obj.DistrictId = $("#cmbCmnDistrict").data("kendoComboBox").value();
        obj.UpozilaId = $("#cmbCmnUpozila").data("kendoComboBox").value();
        obj.DeedNo = $("#txtDeedNo").val();
        obj.EntryDate = $("#txtEntryDate").data("kendoDatePicker").value();
        obj.SubRegOfficeId = $("#cmbSubRegOffice").data("kendoComboBox").value();
        obj.IsBayna = $("#chkIsBayna").is(":checked");
        obj.TotalLandAmount = $("#txtTotalLandAmount").data('kendoNumericTextBox').value();
        obj.LandRegAmount = $("#txtLandRegAmount").data("kendoNumericTextBox").value();
        obj.LandPurchaseAmount = $("#txtLandPurchaseAmount").data("kendoNumericTextBox").value();
        obj.LandDevelopmentAmount = $("#txtLandDevelopmentAmount").data("kendoNumericTextBox").value();
        obj.LandOtherAmount = $("#txtLandOtherAmount").data("kendoNumericTextBox").value();
        obj.Remarks = $("#txtRemarks").val();
        obj.FileRemarks = $("#txtFileRemarks").val();

        obj.PlotWiseLandSaleDetails = LandInfoDetailsHelper.CreatePlotWiseLandSaleDetailsObject();
        obj.OwnerWiseLandSaleDetails = LandInfoDetailsHelper.CreateOwnerWiseLandSaleDetailsObject();

        obj.PlotWiseLandTransferDetails = LandInfoDetailsHelper.CreatePlotWiseLandTransferDetailsObject();
        obj.OwnerWiseLandTransferDetails = LandInfoDetailsHelper.CreateOwnerWiseLandTransferDetailsObject();

        obj.LandMasterOwnerRelations = LandInfoDetailsHelper.CreateLandMasterOwnerRelationObject();
        obj.LandSalersInfos = LandInfoDetailsHelper.CreateLandSalersInfosObject();
        obj.KhatianDetails = LandInfoDetailsHelper.CreateKhatianDetailsObject();
        obj.LandOwnersDetails = LandInfoDetailsHelper.CreateLandOwnersDetailsObject();
        obj.CreatedBy = CurrentUser.USERID;
        obj.UpdatedBy = CurrentUser.USERID;
        obj.DocumentVms = files;
        obj.BayaDeedDetails = LandInfoDetailsHelper.CreateBayaDeedDetailsObject();
        
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        return obj;
    },

    CreatePlotWiseLandSaleDetailsObject: function () {
        var plotWiseLandSaleSummaryGrid = $("#grdPlotWiseLandSaleSummary").data("kendoGrid");
        var data = plotWiseLandSaleSummaryGrid.dataSource.data();
        $.each(data, function (i, item) {
            data[i].PlotWiseLandSaleDetailId = AjaxManager.DefaultGuidId();
            data[i].LandMasterId = AjaxManager.DefaultGuidId();
        });
        return data;
    },
    CreateOwnerWiseLandSaleDetailsObject: function () {
        var ownerWiseLandSaleSummaryGrid = $("#grdOwnerWiseLandSaleSummary").data("kendoGrid");
        var data = ownerWiseLandSaleSummaryGrid.dataSource.data();
        $.each(data, function (i, item) {
            data[i].OwnerWiseLandSaleDetailId = AjaxManager.DefaultGuidId();
            data[i].LandMasterId = AjaxManager.DefaultGuidId();
        });
        return data;
    },

    CreatePlotWiseLandTransferDetailsObject: function () {
        var plotWiseLandTranferSummaryGrid = $("#grdPlotWiseLandTransferSummary").data("kendoGrid");
        var data = plotWiseLandTranferSummaryGrid.dataSource.data();
        $.each(data, function (i, item) {
            data[i].PlotWiseLandTransferDetailId = AjaxManager.DefaultGuidId();
            data[i].LandMasterId = AjaxManager.DefaultGuidId();
        });
        return data;
    },
    CreateOwnerWiseLandTransferDetailsObject: function () {
        var ownerWiseLandTranferSummaryGrid = $("#grdOwnerWiseLandTransferSummary").data("kendoGrid");
        var data = ownerWiseLandTranferSummaryGrid.dataSource.data();
        $.each(data, function (i, item) {
            data[i].OwnerWiseLandTransferDetailId = AjaxManager.DefaultGuidId();
            data[i].LandMasterId = AjaxManager.DefaultGuidId();
        });
        return data;
    },

    CreateLandMasterOwnerRelationObject: function () {
        var list = [];
        
        var selectedLandOwnerTypelist = [];
        $("#LandOwnerType input[type='checkbox']:checked").each(function () {
            selectedLandOwnerTypelist.push({
                LandOwnerTypeId: $(this).attr("lwt-id"),
                OtherRemarks: $("#txtOtherRemarks").val()
        });
            return selectedLandOwnerTypelist;
        });

        for (var i = 0; i < selectedLandOwnerTypelist.length; i++) {
            var detailsData = selectedLandOwnerTypelist[i];
            var obj = new Object();
            obj.LandMasterId = AjaxManager.DefaultGuidId();
            obj.LandMasterOwnerRelationId = AjaxManager.DefaultGuidId();
            obj.LandOwnerTypeId = detailsData.LandOwnerTypeId;
            obj.OtherRemarks = detailsData.OtherRemarks;
            list.push(obj);
        }
        return list;
    },
    CreateLandSalersInfosObject: function () {
        var salerInfoGrid = $("#grdSalerInfoSummary").data("kendoGrid");
        var data = salerInfoGrid.dataSource.data();
        $.each(data, function (i, item) {
            data[i].SalersInfoId = AjaxManager.DefaultGuidId();
            data[i].LandMasterId = AjaxManager.DefaultGuidId();
        });
        return data;
    },
    CreateKhatianDetailsObject: function () {
        var khatianDetailList = [];
        var KhatianDetailGrid = $("#grdKhatianDetailSummary").data("kendoGrid");
        var gridData = KhatianDetailGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var detailsData = gridData[i];
            var obj = new Object();
            obj.KhatianDetailId = detailsData.KhatianDetailId;
            obj.LandMasterId = detailsData.LandMasterId;
            obj.MouzaId = detailsData.MouzaId;
            obj.KhatianTypeId = detailsData.KhatianTypeId;
            obj.KhatianNo = detailsData.KhatianNo;
            obj.DagNo = detailsData.DagNo;
            obj.RecordedOwnerName = detailsData.RecordedOwnerName;
            khatianDetailList.push(obj);
        }
        return khatianDetailList;
    },
    CreateLandOwnersDetailsObject: function () {
        var landOwnerDetailList = [];
        var landOwnerDetailGrid = $("#grdOwnerDetailSummary").data("kendoGrid");
        var gridData = landOwnerDetailGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var detailsData = gridData[i];
            var obj = new Object();
            obj.LandOwnersDetailId = detailsData.LandOwnersDetailId;
            obj.LandMasterId = detailsData.LandMasterId;
            obj.OwnerInfoId = detailsData.OwnerInfoId;
            obj.SaleOwnerName = detailsData.SaleOwnerName;
            obj.MouzaId = detailsData.MouzaId;
            obj.LandAmount = detailsData.LandAmount;
            obj.OwnerRegAmount = detailsData.OwnerRegAmount;
            obj.OwnerPurchaseAmount = detailsData.OwnerPurchaseAmount;
            landOwnerDetailList.push(obj);
        }
        return landOwnerDetailList;
    },
    CreateBayaDeedDetailsObject: function () {
        var bayaDeedGrid = $("#grdBayaDeedSummary").data("kendoGrid");
        var data = bayaDeedGrid.dataSource.data();
        $.each(data, function (i, item) {
            data[i].BayaDeedDetailId = AjaxManager.DefaultGuidId();
            data[i].LandMasterId = AjaxManager.DefaultGuidId();
        });
        return data;
    },

    AddToListPlotWiseLandTransfer: function () {
        var transferedDeedNoMultiCombo = $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox");
        var transferedKhatianTypeCombo = $("#cmbTransferedKhatianType").data("kendoComboBox");
        var transferedDagNoCombo = $("#cmbTransferedDagNo").data("kendoComboBox");
        var plotWiseTransferedLandAmount = $("#txtPlotWiseTransferedLandAmount").data("kendoNumericTextBox").value();
        var totalPlotWiseRemainMutationLandAmount = $("#txtTotalPlotWiseRemainMutationLandAmount").val();
        var plotWiseLandTranferSummaryGrid = $("#grdPlotWiseLandTransferSummary").data("kendoGrid");

        if (transferedDeedNoMultiCombo.value() !== "" && transferedKhatianTypeCombo.value() !== ""
            && transferedDagNoCombo.value() !== "" && plotWiseTransferedLandAmount !== "" && plotWiseTransferedLandAmount !== null) {

            var gridData = plotWiseLandTranferSummaryGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                var transferedLandMasterId = transferedDeedNoMultiCombo.value();
                var transferedKhatianTypeId = transferedKhatianTypeCombo.value();
                var transferedDagNo = transferedDagNoCombo.value();
                
                if (itm.TransferedLandMasterId === transferedLandMasterId
                    && itm.TransferedKhatianTypeId === transferedKhatianTypeId
                    && itm.TransferedDagNo === transferedDagNo) {
                    AjaxManager.NotifyMsg("btnAddPlotWiseLandTransfer", "error", "right", 1500, "Already Added!");
                    return;
                }
            }
            if (plotWiseTransferedLandAmount > totalPlotWiseRemainMutationLandAmount) {
                AjaxManager.NotifyMsg("btnAddPlotWiseLandTransfer", "error", "bottom", 15000, "Transfered Land Amount is More Than Remain Mutated Land!");
                return;
            }

            var obj = new Object();
            obj.PlotWiseLandTransferDetailId = AjaxManager.DefaultGuidId();
            obj.LandMasterId = AjaxManager.DefaultGuidId();
            obj.TransferedLandMasterId = transferedDeedNoMultiCombo.value();
            obj.TransferedDeedNo = transferedDeedNoMultiCombo.text();
            obj.TransferedKhatianTypeId = transferedKhatianTypeCombo.value();
            obj.TransferedKhatianTypeName = transferedKhatianTypeCombo.text();
            obj.TransferedDagNo = transferedDagNoCombo.value();
            obj.PlotWiseTransferedLandAmount = plotWiseTransferedLandAmount;

            PlotWiseLandTransferDetailList.push(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: PlotWiseLandTransferDetailList,
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
            plotWiseLandTranferSummaryGrid.setDataSource(gridDataSource);
            LandInfoDetailsHelper.ClearPlotWiseLandTransferDetailsForm();
        } else {
            if (transferedDeedNoMultiCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedDeedNo", "error", "right", 1500, "Required");
            }
            if (transferedKhatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedKhatianType", "error", "right", 1500, "Required");
            }
            if (transferedDagNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedDagNo", "error", "right", 1500, "Required");
            }
            if (plotWiseTransferedLandAmount === null || plotWiseTransferedLandAmount === "") {
                AjaxManager.NotifyMsg("txtPlotWiseTransferedLandAmount", "error", "right", 1500, "Required");
            }
        }

    },
    ClearPlotWiseLandTransferDetailsForm: function () {
        //$("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox").value("");
        //$("#cmbTransferedKhatianType").data("kendoComboBox").value("");
        $("#cmbTransferedDagNo").data("kendoComboBox").value("");
        $("#txtTotalPlotWiseMutationLandAmount").val("");
        $("#txtTotalPlotWiseRemainMutationLandAmount").val("");
        $("#txtPlotWiseTransferedLandAmount").data("kendoNumericTextBox").value("");
    },
    UpdateToListPlotWiseLandTransfer: function () {

        var transferedDeedNoMultiCombo = $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox");
        var transferedKhatianTypeCombo = $("#cmbTransferedKhatianType").data("kendoComboBox");
        var transferedDagNoCombo = $("#cmbTransferedDagNo").data("kendoComboBox");
        var plotWiseTransferedLandAmount = $("#txtPlotWiseTransferedLandAmount").data("kendoNumericTextBox").value();
        var totalPlotWiseRemainMutationLandAmount = $("#txtTotalPlotWiseRemainMutationLandAmount").val();

        var plotWiseLandTranferSummaryGrid = $("#grdPlotWiseLandTransferSummary").data("kendoGrid");
        var selectedItem = plotWiseLandTranferSummaryGrid.dataItem(plotWiseLandTranferSummaryGrid.select());

        if (transferedDeedNoMultiCombo.value() !== "" && transferedKhatianTypeCombo.value() !== ""
            && transferedDagNoCombo.value() !== "" && plotWiseTransferedLandAmount !== "" && plotWiseTransferedLandAmount !== null) {

            //var gridData = plotWiseLandTranferSummaryGrid.dataSource.data();
            //for (var i = 0; i < gridData.length; i++) {
            //    var itm = gridData[i];
            //    var transferedLandMasterId = transferedDeedNoMultiCombo.value();
            //    var transferedKhatianTypeId = transferedKhatianTypeCombo.value();
            //    var transferedDagNo = transferedDagNoCombo.value();

            //    if (itm.TransferedLandMasterId === transferedLandMasterId
            //        && itm.TransferedKhatianTypeId === transferedKhatianTypeId
            //        && itm.TransferedDagNo === transferedDagNo) {
            //        AjaxManager.NotifyMsg("btnAddPlotWiseLandTransfer", "error", "right", 1500, "Already Added!");
            //        return;
            //    }
            //}
            if (plotWiseTransferedLandAmount > totalPlotWiseRemainMutationLandAmount) {
                AjaxManager.NotifyMsg("btnAddPlotWiseLandTransfer", "error", "bottom", 15000, "Transfered Land Amount is More Than Remain Mutated Land!");
                return;
            }

            var obj = new Object();
            obj.PlotWiseLandTransferDetailId = selectedItem.PlotWiseLandTransferDetailId !== AjaxManager.DefaultGuidId() ? selectedItem.PlotWiseLandTransferDetailId : AjaxManager.DefaultGuidId();
            obj.LandMasterId = selectedItem.LandMasterId !== AjaxManager.DefaultGuidId() ? selectedItem.LandMasterId : AjaxManager.DefaultGuidId();
            obj.TransferedLandMasterId = transferedDeedNoMultiCombo.value();
            obj.TransferedDeedNo = transferedDeedNoMultiCombo.text();
            obj.TransferedKhatianTypeId = transferedKhatianTypeCombo.value();
            obj.TransferedKhatianTypeName = transferedKhatianTypeCombo.text();
            obj.TransferedDagNo = transferedDagNoCombo.value();
            obj.PlotWiseTransferedLandAmount = plotWiseTransferedLandAmount;

            for (var i = 0; i < PlotWiseLandTransferDetailList.length; i++) {
                if (PlotWiseLandTransferDetailList[i].PlotWiseLandTransferDetailId === selectedItem.PlotWiseLandTransferDetailId) {
                    PlotWiseLandTransferDetailList.splice(i, 1);
                    break;
                }
            }

            PlotWiseLandTransferDetailList.push(obj);
            selectedItem.set('PlotWiseLandTransferDetailId', obj.PlotWiseLandTransferDetailId);
            selectedItem.set('LandMasterId', obj.LandMasterId);
            selectedItem.set('TransferedLandMasterId', obj.TransferedLandMasterId);
            selectedItem.set('TransferedDeedNo', obj.TransferedDeedNo);
            selectedItem.set('TransferedKhatianTypeId', obj.TransferedKhatianTypeId);
            selectedItem.set('TransferedKhatianTypeName', obj.TransferedKhatianTypeName);
            selectedItem.set('TransferedDagNo', obj.TransferedDagNo);
            selectedItem.set('PlotWiseTransferedLandAmount', obj.PlotWiseTransferedLandAmount);

            $("#btnAddPlotWiseLandTransfer").text("Add Plot Wise Land Transfer");
            $("#btnAddPlotWiseLandTransfer").addClass("fas fa-arrow-down");
            LandInfoDetailsHelper.ClearPlotWiseLandTransferDetailsForm();
        } else {
            if (transferedDeedNoMultiCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedDeedNo", "error", "right", 1500, "Required");
            }
            if (transferedKhatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedKhatianType", "error", "right", 1500, "Required");
            }
            if (transferedDagNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedDagNo", "error", "right", 1500, "Required");
            }
            if (plotWiseTransferedLandAmount === null || plotWiseTransferedLandAmount === "") {
                AjaxManager.NotifyMsg("txtPlotWiseTransferedLandAmount", "error", "right", 1500, "Required");
            }
        }
    },
    FillPlotWiseLandTransferDetailForm: function (obj) {
        $("#btnAddPlotWiseLandTransfer").text("Update Plot Wise Land Transfer");
        $("#btnAddPlotWiseLandTransfer").addClass("fa fa-edit");
        
        $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox").value(obj.TransferedLandMasterId);
        LandInfoDetailsHelper.ChangeEventOfTransferedDeedNoMultiColumnCombo();
        $("#cmbTransferedKhatianType").data("kendoComboBox").value(obj.TransferedKhatianTypeId);
        LandInfoDetailsHelper.ChangeEventOfTransferedKhatianTypeCombo();
        $("#cmbTransferedDagNo").data("kendoComboBox").value(obj.TransferedDagNo);
        LandInfoDetailsHelper.CalculateTotalPlotWiseMutatedLandAmount();
        $("#txtPlotWiseTransferedLandAmount").data("kendoNumericTextBox").value(obj.PlotWiseTransferedLandAmount);
    },

    AddToListOwnerWiseLandTransfer: function () {
        var transferedDeedNoMultiCombo = $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox");
        var transferedKhatianTypeCombo = $("#cmbTransferedKhatianType").data("kendoComboBox");
        var transferedOwnerInfoCombo = $("#cmbTransferedOwnerInfo").data("kendoComboBox");

        var ownerWiseTransferedLandAmount = $("#txtOwnerWiseTransferedLandAmount").data("kendoNumericTextBox").value();
        var totalOwnerWiseRemainMutationLandAmount = $("#txtTotalOwnerWiseRemainMutatedLand").val();
        var ownerWiseLandTranferSummaryGrid = $("#grdOwnerWiseLandTransferSummary").data("kendoGrid");

        if (transferedDeedNoMultiCombo.value() !== "" && transferedKhatianTypeCombo.value() !== ""
            && transferedOwnerInfoCombo.value() !== "" && ownerWiseTransferedLandAmount !== "" && ownerWiseTransferedLandAmount !== null) {

            var gridData = ownerWiseLandTranferSummaryGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                var transferedLandMasterId = transferedDeedNoMultiCombo.value();
                var transferedKhatianTypeId = transferedKhatianTypeCombo.value();
                var transferedOwnerInfo = transferedOwnerInfoCombo.value();

                if (itm.TransferedLandMasterId === transferedLandMasterId
                    && itm.TransferedKhatianTypeId === transferedKhatianTypeId
                    && itm.TransferedOwnerInfoId === transferedOwnerInfo) {
                    AjaxManager.NotifyMsg("btnAddOwnerWiseLandTransfer", "error", "bottom", 1500, "Already Added!");
                    return;
                }
            }
            if (ownerWiseTransferedLandAmount > totalOwnerWiseRemainMutationLandAmount) {
                AjaxManager.NotifyMsg("btnAddOwnerWiseLandTransfer", "error", "bottom", 15000, "Transfered Land Amount is More Than Remain Mutated Land!");
                return;
            }

            var obj = new Object();
            obj.OwnerWiseLandTransferDetailId = AjaxManager.DefaultGuidId();
            obj.LandMasterId = AjaxManager.DefaultGuidId();
            obj.TransferedLandMasterId = transferedDeedNoMultiCombo.value();
            obj.TransferedDeedNo = transferedDeedNoMultiCombo.text();
            obj.TransferedKhatianTypeId = transferedKhatianTypeCombo.value();
            obj.TransferedKhatianTypeName = transferedKhatianTypeCombo.text();
            obj.TransferedOwnerInfoId = transferedOwnerInfoCombo.value();
            obj.TransferedOwnerInfoName = transferedOwnerInfoCombo.text();
            obj.OwnerWiseTransferedLandAmount = ownerWiseTransferedLandAmount;

            OwnerWiseLandTransferDetailList.push(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: OwnerWiseLandTransferDetailList,
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
            ownerWiseLandTranferSummaryGrid.setDataSource(gridDataSource);
            LandInfoDetailsHelper.ClearOwnerWiseLandTransferDetailsForm();
        } else {
            if (transferedDeedNoMultiCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedDeedNo", "error", "right", 1500, "Required");
            }
            if (transferedKhatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedKhatianType", "error", "right", 1500, "Required");
            }
            if (transferedOwnerInfoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedOwnerInfo", "error", "right", 1500, "Required");
            }
            if (ownerWiseTransferedLandAmount === null || ownerWiseTransferedLandAmount === "") {
                AjaxManager.NotifyMsg("txtOwnerWiseTransferedLandAmount", "error", "right", 1500, "Required");
            }
        }

    },
    ClearOwnerWiseLandTransferDetailsForm: function () {
        $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox").value("");
        $("#cmbTransferedKhatianType").data("kendoComboBox").value("");
        $("#cmbTransferedOwnerInfo").data("kendoComboBox").value("");
        $("#txtTotalOwnerWiseMutationLandAmount").val("");
        $("#txtTotalOwnerWiseRemainMutatedLand").val("");
        $("#txtOwnerWiseTransferedLandAmount").data("kendoNumericTextBox").value("");
    },
    UpdateToListOwnerWiseLandTransfer: function () {
        var transferedDeedNoMultiCombo = $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox");
        var transferedKhatianTypeCombo = $("#cmbTransferedKhatianType").data("kendoComboBox");
        var transferedOwnerInfoCombo = $("#cmbTransferedOwnerInfo").data("kendoComboBox");
        var ownerWiseTransferedLandAmount = $("#txtOwnerWiseTransferedLandAmount").data("kendoNumericTextBox").value();
        var totalOwnerWiseRemainMutationLandAmount = $("#txtTotalOwnerWiseRemainMutatedLand").val();

        var ownerWiseLandTranferSummaryGrid = $("#grdOwnerWiseLandTransferSummary").data("kendoGrid");
        var selectedItem = ownerWiseLandTranferSummaryGrid.dataItem(ownerWiseLandTranferSummaryGrid.select());

        if (transferedDeedNoMultiCombo.value() !== "" && transferedKhatianTypeCombo.value() !== ""
            && transferedOwnerInfoCombo.value() !== "" && ownerWiseTransferedLandAmount !== "" && ownerWiseTransferedLandAmount !== null) {
            
            if (ownerWiseTransferedLandAmount > totalOwnerWiseRemainMutationLandAmount) {
                AjaxManager.NotifyMsg("btnAddOwnerWiseLandTransfer", "error", "bottom", 15000, "Transfered Land Amount is More Than Remain Mutated Land!");
                return;
            }

            var obj = new Object();
            obj.OwnerWiseLandTransferDetailId = selectedItem.OwnerWiseLandTransferDetailId !== AjaxManager.DefaultGuidId() ? selectedItem.OwnerWiseLandTransferDetailId : AjaxManager.DefaultGuidId();
            obj.LandMasterId = selectedItem.LandMasterId !== AjaxManager.DefaultGuidId() ? selectedItem.LandMasterId : AjaxManager.DefaultGuidId();
            obj.TransferedLandMasterId = transferedDeedNoMultiCombo.value();
            obj.TransferedDeedNo = transferedDeedNoMultiCombo.text();
            obj.TransferedKhatianTypeId = transferedKhatianTypeCombo.value();
            obj.TransferedKhatianTypeName = transferedKhatianTypeCombo.text();
            obj.TransferedOwnerInfoId = transferedOwnerInfoCombo.value();
            obj.TransferedOwnerInfoName = transferedOwnerInfoCombo.text();
            obj.OwnerWiseTransferedLandAmount = ownerWiseTransferedLandAmount;

            for (var i = 0; i < OwnerWiseLandTransferDetailList.length; i++) {
                if (OwnerWiseLandTransferDetailList[i].OwnerWiseLandTransferDetailId === selectedItem.OwnerWiseLandTransferDetailId) {
                    OwnerWiseLandTransferDetailList.splice(i, 1);
                    break;
                }
            }

            OwnerWiseLandTransferDetailList.push(obj);
            selectedItem.set('OwnerWiseLandTransferDetailId', obj.OwnerWiseLandTransferDetailId);
            selectedItem.set('LandMasterId', obj.LandMasterId);
            selectedItem.set('TransferedLandMasterId', obj.TransferedLandMasterId);
            selectedItem.set('TransferedDeedNo', obj.TransferedDeedNo);
            selectedItem.set('TransferedKhatianTypeId', obj.TransferedKhatianTypeId);
            selectedItem.set('TransferedKhatianTypeName', obj.TransferedKhatianTypeName);
            selectedItem.set('TransferedOwnerInfoId', obj.TransferedOwnerInfoId);
            selectedItem.set('TransferedOwnerInfoName', obj.TransferedOwnerInfoName);
            selectedItem.set('OwnerWiseTransferedLandAmount', obj.OwnerWiseTransferedLandAmount);

            $("#btnAddOwnerWiseLandTransfer").text("Add Owner Wise Land Transfer");
            $("#btnAddOwnerWiseLandTransfer").addClass("fas fa-arrow-down");
            LandInfoDetailsHelper.ClearOwnerWiseLandTransferDetailsForm();
        } else {
            if (transferedDeedNoMultiCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedDeedNo", "error", "right", 1500, "Required");
            }
            if (transferedKhatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedKhatianType", "error", "right", 1500, "Required");
            }
            if (transferedOwnerInfoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbTransferedOwnerInfo", "error", "right", 1500, "Required");
            }
            if (ownerWiseTransferedLandAmount === null || ownerWiseTransferedLandAmount === "") {
                AjaxManager.NotifyMsg("txtOwnerWiseTransferedLandAmount", "error", "right", 1500, "Required");
            }
        }
    },
    FillOwnerWiseLandTransferDetailForm: function (obj) {
        $("#btnAddOwnerWiseLandTransfer").text("Update Owner Wise Land Transfer");
        $("#btnAddOwnerWiseLandTransfer").addClass("fas fa-arrow-down");

        $("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox").value(obj.TransferedLandMasterId);
        LandInfoDetailsHelper.ChangeEventOfTransferedDeedNoMultiColumnCombo();
        $("#cmbTransferedKhatianType").data("kendoComboBox").value(obj.TransferedKhatianTypeId);
        LandInfoDetailsHelper.ChangeEventOfTransferedKhatianTypeCombo();

        $("#cmbTransferedOwnerInfo").data("kendoComboBox").value(obj.TransferedOwnerInfoId);
        LandInfoDetailsHelper.CalculateTotalOwnerWiseMutatedLandAmount();
        $("#txtOwnerWiseTransferedLandAmount").data("kendoNumericTextBox").value(obj.OwnerWiseTransferedLandAmount);
    },

    AddToListPlotWiseLandSale: function () {
        
        var saleDeedNoCombo = $("#cmbSaleDeedNo").data("kendoComboBox");
        var saleKhatianTypeCombo = $("#cmbSaleKhatianType").data("kendoComboBox");
        var saleDagNoCombo = $("#cmbSaleDagNo").data("kendoComboBox");
        var plotWiseSaleLandAmount = $("#txtPlotWiseSaleLandAmount").data("kendoNumericTextBox").value();
        var totalPlotWiseRemainMutationLandAmountSale = $("#txtTotalPlotWiseRemainMutationLandAmountSale").val();
        var plotWiseLandSaleSummaryGrid = $("#grdPlotWiseLandSaleSummary").data("kendoGrid");

        if (saleDeedNoCombo.value() !== "" && saleKhatianTypeCombo.value() !== ""
            && saleDagNoCombo.value() !== "" && plotWiseSaleLandAmount !== "" && plotWiseSaleLandAmount !== null) {

            var gridData = plotWiseLandSaleSummaryGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                var saleLandMasterId = saleDeedNoCombo.value();
                var saleKhatianTypeId = saleKhatianTypeCombo.value();
                var saleDagNo = saleDagNoCombo.value();

                if (itm.SaleLandMasterId === saleLandMasterId
                    && itm.SaleKhatianTypeId === saleKhatianTypeId
                    && itm.SaleDagNo === saleDagNo) {
                    AjaxManager.NotifyMsg("btnAddPlotWiseLandSale", "error", "right", 1500, "Already Added!");
                    return;
                }
            }
            if (plotWiseSaleLandAmount > totalPlotWiseRemainMutationLandAmountSale) {
                AjaxManager.NotifyMsg("btnAddPlotWiseLandSale", "error", "left", 15000, "Sale Land Amount is More Than Remain Mutated Land!");
                return;
            }

            var obj = new Object();
            obj.PlotWiseLandSaleDetailId = AjaxManager.DefaultGuidId();
            obj.LandMasterId = AjaxManager.DefaultGuidId();
            obj.SaleLandMasterId = saleDeedNoCombo.value();
            obj.SaleDeedNo = saleDeedNoCombo.text();
            obj.SaleKhatianTypeId = saleKhatianTypeCombo.value();
            obj.SaleKhatianTypeName = saleKhatianTypeCombo.text();
            obj.SaleDagNo = saleDagNoCombo.value();
            obj.PlotWiseSaleLandAmount = plotWiseSaleLandAmount;

            PlotWiseLandSaleDetailList.push(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: PlotWiseLandSaleDetailList,
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
            plotWiseLandSaleSummaryGrid.setDataSource(gridDataSource);
            LandInfoDetailsHelper.ClearPlotWiseLandSaleDetailsForm();
        } else {
            if (saleDeedNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleDeedNo", "error", "right", 1500, "Required");
            }
            if (saleKhatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleKhatianType", "error", "right", 1500, "Required");
            }
            if (saleDagNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleDagNo", "error", "right", 1500, "Required");
            }
            if (plotWiseSaleLandAmount === null || plotWiseSaleLandAmount === "") {
                AjaxManager.NotifyMsg("txtPlotWiseSaleLandAmount", "error", "right", 1500, "Required");
            }
        }

    },
    ClearPlotWiseLandSaleDetailsForm: function () {
        //$("#cmbSaleDeedNo").data("kendoComboBox").value("");
        $("#txtTotalPlotWiseMutationLandAmountSale").val("");
        $("#txtTotalPlotWiseRemainMutationLandAmountSale").val("");
        $("#txtPlotWiseSaleLandAmount").data("kendoNumericTextBox").value("");
    },
    UpdateToListPlotWiseLandSale: function () {

        var saleDeedNoCombo = $("#cmbSaleDeedNo").data("kendoComboBox");
        var saleKhatianTypeCombo = $("#cmbSaleKhatianType").data("kendoComboBox");
        var saleDagNoCombo = $("#cmbSaleDagNo").data("kendoComboBox");
        var plotWiseSaleLandAmount = $("#txtPlotWiseSaleLandAmount").data("kendoNumericTextBox").value();
        var totalPlotWiseRemainMutationLandAmountSale = $("#txtTotalPlotWiseRemainMutationLandAmountSale").val();

        var plotWiseLandSaleSummaryGrid = $("#grdPlotWiseLandSaleSummary").data("kendoGrid");
        var selectedItem = plotWiseLandSaleSummaryGrid.dataItem(plotWiseLandSaleSummaryGrid.select());

        if (saleDeedNoCombo.value() !== "" && saleKhatianTypeCombo.value() !== ""
            && saleDagNoCombo.value() !== "" && plotWiseSaleLandAmount !== "" && plotWiseSaleLandAmount !== null) {
            
            if (plotWiseSaleLandAmount > totalPlotWiseRemainMutationLandAmountSale) {
                AjaxManager.NotifyMsg("btnAddPlotWiseLandSale", "error", "bottom", 15000, "Sale Land Amount is More Than Remain Mutated Land!");
                return;
            }

            var obj = new Object();
            obj.PlotWiseLandSaleDetailId = selectedItem.PlotWiseLandSaleDetailId !== AjaxManager.DefaultGuidId() ? selectedItem.PlotWiseLandSaleDetailId : AjaxManager.DefaultGuidId();
            obj.LandMasterId = selectedItem.LandMasterId !== AjaxManager.DefaultGuidId() ? selectedItem.LandMasterId : AjaxManager.DefaultGuidId();
            obj.SaleLandMasterId = saleDeedNoCombo.value();
            obj.SaleDeedNo = saleDeedNoCombo.text();
            obj.SaleKhatianTypeId = saleKhatianTypeCombo.value();
            obj.SaleKhatianTypeName = saleKhatianTypeCombo.text();
            obj.SaleDagNo = saleDagNoCombo.value();
            obj.PlotWiseSaleLandAmount = plotWiseSaleLandAmount;

            for (var i = 0; i < PlotWiseLandSaleDetailList.length; i++) {
                if (PlotWiseLandSaleDetailList[i].LandMasterId == selectedItem.LandMasterId && PlotWiseLandSaleDetailList[i].PlotWiseLandSaleDetailId == selectedItem.PlotWiseLandSaleDetailId) {
                    PlotWiseLandSaleDetailList.splice(i, 1);
                    break;
                }
            }

            PlotWiseLandSaleDetailList.push(obj);
            selectedItem.set('PlotWiseLandSaleDetailId', obj.PlotWiseLandSaleDetailId);
            selectedItem.set('LandMasterId', obj.LandMasterId);
            selectedItem.set('SaleLandMasterId', obj.SaleLandMasterId);
            selectedItem.set('SaleDeedNo', obj.SaleDeedNo);
            selectedItem.set('SaleKhatianTypeId', obj.SaleKhatianTypeId);
            selectedItem.set('SaleKhatianTypeName', obj.SaleKhatianTypeName);
            selectedItem.set('SaleDagNo', obj.SaleDagNo);
            selectedItem.set('PlotWiseSaleLandAmount', obj.PlotWiseSaleLandAmount);

            $("#btnAddPlotWiseLandSale").text("Add Plot Wise Land Sale");
            $("#btnAddPlotWiseLandSale").addClass("fas fa-arrow-down");

            LandInfoDetailsHelper.ClearPlotWiseLandSaleDetailsForm();
        } else {
            if (saleDeedNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleDeedNo", "error", "right", 1500, "Required");
            }
            if (saleKhatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleKhatianType", "error", "right", 1500, "Required");
            }
            if (saleDagNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleDagNo", "error", "right", 1500, "Required");
            }
            if (plotWiseSaleLandAmount === null || plotWiseSaleLandAmount === "") {
                AjaxManager.NotifyMsg("txtPlotWiseSaleLandAmount", "error", "right", 1500, "Required");
            }
        }
    },
    FillPlotWiseLandSaleDetailForm: function (obj) {
        
        $("#btnAddPlotWiseLandSale").text("Update Plot Wise Land Sale");
        $("#btnAddPlotWiseLandSale").addClass("fa fa-edit");

        $("#cmbSaleDeedNo").data("kendoComboBox").value(obj.SaleLandMasterId);
        LandInfoDetailsHelper.ChangeEventOfSaleDeedNoCombo();
        $("#cmbSaleKhatianType").data("kendoComboBox").value(obj.SaleKhatianTypeId);
        LandInfoDetailsHelper.ChangeEventOfSaleKhatianTypeCombo();
        $("#cmbSaleDagNo").data("kendoComboBox").value(obj.SaleDagNo);
        LandInfoDetailsHelper.CalculateTotalPlotWiseMutatedLandAmountSale();
        $("#txtPlotWiseSaleLandAmount").data("kendoNumericTextBox").value(obj.PlotWiseSaleLandAmount);
    },

    AddToListOwnerWiseLandSale: function () {
        var saleDeedNoCombo = $("#cmbSaleDeedNo").data("kendoComboBox");
        var saleKhatianTypeCombo = $("#cmbSaleKhatianType").data("kendoComboBox");
        var saleOwnerInfoCombo = $("#cmbSaleOwnerInfo").data("kendoComboBox");

        var ownerWiseSaleLandAmount = $("#txtOwnerWiseSaleLandAmount").data("kendoNumericTextBox").value();
        var totalOwnerWiseRemainMutationLandAmountSale = $("#txtTotalOwnerWiseRemainMutatedLandSale").val();
        var ownerWiseLandSaleSummaryGrid = $("#grdOwnerWiseLandSaleSummary").data("kendoGrid");

        if (saleDeedNoCombo.value() !== "" && saleKhatianTypeCombo.value() !== ""
            && saleOwnerInfoCombo.value() !== "" && ownerWiseSaleLandAmount !== "" && ownerWiseSaleLandAmount !== null) {

            var gridData = ownerWiseLandSaleSummaryGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                var saleLandMasterId = saleDeedNoCombo.value();
                var saleKhatianTypeId = saleKhatianTypeCombo.value();
                var saleOwnerInfo = saleOwnerInfoCombo.value();

                if (itm.SaleLandMasterId === saleLandMasterId
                    && itm.SaleKhatianTypeId === saleKhatianTypeId
                    && itm.SaleOwnerInfoId === saleOwnerInfo) {
                    AjaxManager.NotifyMsg("btnAddOwnerWiseLandSale", "error", "bottom", 1500, "Already Added!");
                    return;
                }
            }
            if (ownerWiseSaleLandAmount > totalOwnerWiseRemainMutationLandAmountSale) {
                AjaxManager.NotifyMsg("btnAddOwnerWiseLandSale", "error", "left", 15000, "Sale Land Amount is More Than Remain Mutated Land!");
                return;
            }

            var obj = new Object();
            obj.OwnerWiseLandSaleDetailId = AjaxManager.DefaultGuidId();
            obj.LandMasterId = AjaxManager.DefaultGuidId();
            obj.SaleLandMasterId = saleDeedNoCombo.value();
            obj.SaleDeedNo = saleDeedNoCombo.text();
            obj.SaleKhatianTypeId = saleKhatianTypeCombo.value();
            obj.SaleKhatianTypeName = saleKhatianTypeCombo.text();
            obj.SaleOwnerInfoId = saleOwnerInfoCombo.value();
            obj.SaleOwnerInfoName = saleOwnerInfoCombo.text();
            obj.OwnerWiseSaleLandAmount = ownerWiseSaleLandAmount;

            OwnerWiseLandSaleDetailList.push(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: OwnerWiseLandSaleDetailList,
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
            ownerWiseLandSaleSummaryGrid.setDataSource(gridDataSource);
            LandInfoDetailsHelper.ClearOwnerWiseLandSaleDetailsForm();
        } else {
            if (saleDeedNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleDeedNo", "error", "right", 1500, "Required");
            }
            if (saleKhatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleKhatianType", "error", "right", 1500, "Required");
            }
            if (saleOwnerInfoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleOwnerInfo", "error", "right", 1500, "Required");
            }
            if (ownerWiseSaleLandAmount === null || ownerWiseSaleLandAmount === "") {
                AjaxManager.NotifyMsg("txtOwnerWiseSaleLandAmount", "error", "right", 1500, "Required");
            }
        }

    },
    ClearOwnerWiseLandSaleDetailsForm: function () {
        //$("#cmbTransferedDeedNo").data("kendoMultiColumnComboBox").value("");
        //$("#cmbSaleKhatianType").data("kendoComboBox").value("");
        //$("#cmbSaleOwnerInfo").data("kendoComboBox").value("");
        $("#txtTotalOwnerWiseMutationLandAmountSale").val("");
        $("#txtTotalOwnerWiseRemainMutatedLandSale").val("");
        $("#txtOwnerWiseSaleLandAmount").data("kendoNumericTextBox").value("");
    },
    UpdateToListOwnerWiseLandSale: function () {
        var saleDeedNoCombo = $("#cmbSaleDeedNo").data("kendoComboBox");
        var saleKhatianTypeCombo = $("#cmbSaleKhatianType").data("kendoComboBox");
        var saleOwnerInfoCombo = $("#cmbSaleOwnerInfo").data("kendoComboBox");

        var ownerWiseSaleLandAmount = $("#txtOwnerWiseSaleLandAmount").data("kendoNumericTextBox").value();
        var totalOwnerWiseRemainMutationLandAmountSale = $("#txtTotalOwnerWiseRemainMutatedLandSale").val();
        var ownerWiseLandSaleSummaryGrid = $("#grdOwnerWiseLandSaleSummary").data("kendoGrid");

        
        var selectedItem = ownerWiseLandSaleSummaryGrid.dataItem(ownerWiseLandSaleSummaryGrid.select());

        if (saleDeedNoCombo.value() !== "" && saleKhatianTypeCombo.value() !== ""
            && saleOwnerInfoCombo.value() !== "" && ownerWiseSaleLandAmount !== "" && ownerWiseSaleLandAmount !== null) {

            if (ownerWiseSaleLandAmount > totalOwnerWiseRemainMutationLandAmountSale) {
                AjaxManager.NotifyMsg("btnAddOwnerWiseLandSale", "error", "bottom", 15000, "Sale Land Amount is More Than Remain Mutated Land!");
                return;
            }

            var obj = new Object();
            obj.OwnerWiseLandSaleDetailId = selectedItem.OwnerWiseLandSaleDetailId !== AjaxManager.DefaultGuidId() ? selectedItem.OwnerWiseLandSaleDetailId : AjaxManager.DefaultGuidId();
            obj.LandMasterId = selectedItem.LandMasterId !== AjaxManager.DefaultGuidId() ? selectedItem.LandMasterId : AjaxManager.DefaultGuidId();
            obj.SaleLandMasterId = saleDeedNoCombo.value();
            obj.SaleDeedNo = saleDeedNoCombo.text();
            obj.SaleKhatianTypeId = saleKhatianTypeCombo.value();
            obj.SaleKhatianTypeName = saleKhatianTypeCombo.text();
            obj.SaleOwnerInfoId = saleOwnerInfoCombo.value();
            obj.SaleOwnerInfoName = saleOwnerInfoCombo.text();
            obj.OwnerWiseSaleLandAmount = ownerWiseSaleLandAmount;

            for (var i = 0; i < OwnerWiseLandSaleDetailList.length; i++) {
                if (OwnerWiseLandSaleDetailList[i].OwnerWiseLandSaleDetailId === selectedItem.OwnerWiseLandSaleDetailId) {
                    OwnerWiseLandSaleDetailList.splice(i, 1);
                    break;
                }
            }

            OwnerWiseLandSaleDetailList.push(obj);
            selectedItem.set('OwnerWiseLandSaleDetailId', obj.OwnerWiseLandSaleDetailId);
            selectedItem.set('LandMasterId', obj.LandMasterId);
            selectedItem.set('SaleLandMasterId', obj.SaleLandMasterId);
            selectedItem.set('SaleDeedNo', obj.SaleDeedNo);
            selectedItem.set('SaleKhatianTypeId', obj.SaleKhatianTypeId);
            selectedItem.set('SaleKhatianTypeName', obj.SaleKhatianTypeName);
            selectedItem.set('SaleOwnerInfoId', obj.SaleOwnerInfoId);
            selectedItem.set('SaleOwnerInfoName', obj.SaleOwnerInfoName);
            selectedItem.set('OwnerWiseSaleLandAmount', obj.OwnerWiseSaleLandAmount);

            $("#btnAddOwnerWiseLandSale").text("Add Owner Wise Land Sale");
            $("#btnAddOwnerWiseLandSale").addClass("fas fa-arrow-down");
            LandInfoDetailsHelper.ClearOwnerWiseLandSaleDetailsForm();
        } else {
            if (saleDeedNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleDeedNo", "error", "right", 1500, "Required");
            }
            if (saleKhatianTypeCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleKhatianType", "error", "right", 1500, "Required");
            }
            if (saleOwnerInfoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbSaleOwnerInfo", "error", "right", 1500, "Required");
            }
            if (ownerWiseSaleLandAmount === null || ownerWiseSaleLandAmount === "") {
                AjaxManager.NotifyMsg("txtOwnerWiseSaleLandAmount", "error", "right", 1500, "Required");
            }
        }
    },
    FillOwnerWiseLandSaleDetailForm: function (obj) {
        $("#btnAddOwnerWiseLandSale").text("Update Owner Wise Land Sale");
        $("#btnAddOwnerWiseLandSale").addClass("fas fa-arrow-down");

        $("#cmbSaleDeedNo").data("kendoComboBox").value(obj.SaleLandMasterId);
        LandInfoDetailsHelper.ChangeEventOfSaleDeedNoCombo();
        $("#cmbSaleKhatianType").data("kendoComboBox").value(obj.SaleKhatianTypeId);
        LandInfoDetailsHelper.ChangeEventOfSaleKhatianTypeCombo();

        $("#cmbSaleOwnerInfo").data("kendoComboBox").value(obj.SaleOwnerInfoId);
        LandInfoDetailsHelper.CalculateTotalOwnerWiseMutatedLandAmountSale();
        $("#txtOwnerWiseSaleLandAmount").data("kendoNumericTextBox").value(obj.OwnerWiseSaleLandAmount);
    },

    AddToListKhatian: function () {
        var cmnMouzaCombo = $("#cmbCmnMouza").data("kendoComboBox");
        var KhatianCombo = $("#cmbKhatianType").data("kendoComboBox");
        var KhatianNo = $("#txtKhatianNo").val();
        var khatianDetailSummaryGrid = $("#grdKhatianDetailSummary").data("kendoGrid");

        if (cmnMouzaCombo.value() !== "" && KhatianCombo.value() !== "" && $("#txtKhatianNo").val() !== ""
            && $("#txtDagNo").val() !== "" && $("#txtRecordedOwnerName").val() !== "") {
            var gridData = khatianDetailSummaryGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                var mouzaId = cmnMouzaCombo.value();
                var khatianTypeId = KhatianCombo.value();
                if (itm.MouzaId === mouzaId && itm.KhatianTypeId === khatianTypeId && itm.KhatianNo === KhatianNo) {
                    AjaxManager.NotifyMsg("btnAddKhatian", "error", "left", 1500, "Already Added!");
                    return;
                }
            }

            var obj = new Object();
            obj.KhatianDetailId = AjaxManager.DefaultGuidId();
            obj.LandMasterId = AjaxManager.DefaultGuidId();
            obj.MouzaId = cmnMouzaCombo.value();
            obj.MouzaName = cmnMouzaCombo.text();
            obj.KhatianTypeId = KhatianCombo.value();
            obj.KhatianTypeName = KhatianCombo.text();
            obj.KhatianNo = $("#txtKhatianNo").val();
            obj.DagNo = $("#txtDagNo").val();
            obj.RecordedOwnerName = $("#txtRecordedOwnerName").val();

            LandDetailsKhatianList.unshift(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: LandDetailsKhatianList,
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
            khatianDetailSummaryGrid.setDataSource(gridDataSource);
            LandInfoDetailsHelper.ClearKhatianDetailsForm();
        } else {
            if (cmnMouzaCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbCmnMouza", "error", "right", 1500, "Required");
            }
            if (KhatianCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbKhatianType", "error", "right", 1500, "Required");
            }
            if ($("#txtKhatianNo").val() === "") {
                AjaxManager.NotifyMsg("btnAddKhatian", "error", "left", 1500, "Khatian No Required!!");
            }
            if ($("#txtDagNo").val() === "") {
                AjaxManager.NotifyMsg("btnAddKhatian", "error", "left", 1500, "Plot No Required!!");
            }
            if ($("#txtRecordedOwnerName").val() === "") {
                AjaxManager.NotifyMsg("btnAddKhatian", "error", "left", 1500, "Recorded Owner Name Required!!");
            }
        }
    },
    ClearKhatianDetailsForm: function () {
        $("#txtKhatianNo").val("");
        $("#txtDagNo").val("");
        $("#txtRecordedOwnerName").val("");
    },
    UpdateToListKhatian: function () {
        
        var cmnMouzaCombo = $("#cmbCmnMouza").data("kendoComboBox");
        var KhatianCombo = $("#cmbKhatianType").data("kendoComboBox");
        var KhatianNo = $("#txtKhatianNo").val();
        
        var grid = $("#grdKhatianDetailSummary").data("kendoGrid");
        var selectedItem = grid.dataItem(grid.select());
        
        if (cmnMouzaCombo.value() !== "" && KhatianCombo.value() !== "" && $("#txtKhatianNo").val() !== ""
            && $("#txtDagNo").val() !== "" && $("#txtRecordedOwnerName").val() !== "") {

            //var gridData = grid.dataSource.data();
            //for (var i = 0; i < gridData.length; i++) {
            //    var itm = gridData[i];
            //    var mouzaId = cmnMouzaCombo.value();
            //    var khatianTypeId = KhatianCombo.value();
            //    if (itm.MouzaId === mouzaId && itm.MouzaId !== selectedItem.MouzaId
            //        && itm.KhatianTypeId === khatianTypeId && itm.KhatianTypeId !== selectedItem.KhatianTypeId
            //        && itm.KhatianNo === KhatianNo && itm.KhatianNo !== selectedItem.KhatianNo) {
            //        AjaxManager.NotifyMsg("btnAddKhatian", "error", "left", 1500, "Already Added!");
            //        return;
            //    }
            //}

            var obj = new Object();
            obj.KhatianDetailId = selectedItem.KhatianDetailId !== AjaxManager.DefaultGuidId() ? selectedItem.KhatianDetailId : AjaxManager.DefaultGuidId();
            obj.LandMasterId = selectedItem.LandMasterId !== AjaxManager.DefaultGuidId() ? selectedItem.LandMasterId : AjaxManager.DefaultGuidId();
            obj.MouzaId = cmnMouzaCombo.value();
            obj.MouzaName = cmnMouzaCombo.text();
            obj.KhatianTypeId = KhatianCombo.value();
            obj.KhatianTypeName = KhatianCombo.text();
            obj.KhatianNo = KhatianNo;
            obj.DagNo = $("#txtDagNo").val();
            obj.RecordedOwnerName = $("#txtRecordedOwnerName").val();

            for (var i = 0; i < LandDetailsKhatianList.length; i++) {
                if (LandDetailsKhatianList[i].KhatianDetailId === selectedItem.KhatianDetailId) {
                    LandDetailsKhatianList.splice(i, 1);
                    break;
                }
            }

            LandDetailsKhatianList.unshift(obj);
            selectedItem.set('KhatianDetailId', obj.KhatianDetailId);
            selectedItem.set('LandMasterId', obj.LandMasterId);
            selectedItem.set('MouzaId', obj.MouzaId);
            selectedItem.set('MouzaName', obj.MouzaName);
            selectedItem.set('KhatianTypeId', obj.KhatianTypeId);
            selectedItem.set('KhatianTypeName', obj.KhatianTypeName);
            selectedItem.set('KhatianNo', obj.KhatianNo);
            selectedItem.set('DagNo', obj.DagNo);
            selectedItem.set('RecordedOwnerName', obj.RecordedOwnerName);

            $("#btnAddKhatian").text("Add Khatian");
            $("#btnAddKhatian").addClass("fas fa-arrow-down");
            LandInfoDetailsHelper.ClearKhatianDetailsForm();
        }
        else {
            if (cmnMouzaCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbCmnMouza", "error", "right", 1500, "Required");
            }
            if (KhatianCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbKhatianType", "error", "right", 1500, "Required");
            }
            if ($("#txtKhatianNo").val() === "") {
                AjaxManager.NotifyMsg("btnAddKhatian", "error", "left", 1500, "Khatian No Required!!");
            }
            if ($("#txtDagNo").val() === "") {
                AjaxManager.NotifyMsg("btnAddKhatian", "error", "left", 1500, "Plot No Required!!");
            }
            if ($("#txtRecordedOwnerName").val() === "") {
                AjaxManager.NotifyMsg("btnAddKhatian", "error", "left", 1500, "Recorded Owner Name Required!!");
            }
        }
    },
    FillKhatianDetailForm: function (obj) {
        $("#btnAddKhatian").text("Update Khatian");
        $("#btnAddKhatian").addClass("fa fa-edit");

        $("#cmbCmnMouza").data("kendoComboBox").value(obj.MouzaId);
        $("#cmbCmnMouza").data("kendoComboBox").text(obj.MouzaName);
        $("#cmbKhatianType").data("kendoComboBox").value(obj.KhatianTypeId);
        $("#cmbKhatianType").data("kendoComboBox").text(obj.KhatianTypeName);
        $("#txtKhatianNo").val(obj.KhatianNo);
        $("#txtDagNo").val(obj.DagNo);
        $("#txtRecordedOwnerName").val(obj.RecordedOwnerName);
    },

    AddToListOwner: function () {
        
        var cmnMouzaCombo = $("#cmbCmnMouza").data("kendoComboBox");
        var OwnerCombo = $("#cmbOwnerInfo").data("kendoComboBox");
        var saleOwnerName = $("#txtSaleOwnerName").val();
        var landAmount = $("#txtLandAmount").data('kendoNumericTextBox').value();
        var ownerRegAmount = $("#txtOwnerRegAmount").data("kendoNumericTextBox").value();
        var ownerPurchaseAmount = $("#txtOwnerPurchaseAmount").data("kendoNumericTextBox").value();
        var OwnerDetailSummaryGrid = $("#grdOwnerDetailSummary").data("kendoGrid");

        if (cmnMouzaCombo.value() !== "" && (OwnerCombo.value() !== "" || saleOwnerName !== "") && landAmount !== null && ownerRegAmount !== null && ownerPurchaseAmount !== null) {
            var gridData = OwnerDetailSummaryGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                var mouzaId = cmnMouzaCombo.value();
                var ownerInfoId = OwnerCombo.value();
                if (itm.MouzaId === mouzaId && itm.OwnerInfoId === ownerInfoId) {
                    AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Already Added!");
                    return;
                }
            }

            var obj = new Object();
            obj.LandOwnersDetailId = AjaxManager.DefaultGuidId();
            obj.LandMasterId = AjaxManager.DefaultGuidId();
            obj.OwnerInfoId = OwnerCombo.value() === "" ? "a6e5b7ac-daa9-4fca-a4c4-31c5cd7b8fb5" : OwnerCombo.value();
            obj.OwnerInfoName = OwnerCombo.text() === "" ? "For Land Sale" : OwnerCombo.text();
            obj.SaleOwnerName = saleOwnerName;
            obj.MouzaId = cmnMouzaCombo.value();
            obj.MouzaName = cmnMouzaCombo.text();
            obj.LandAmount = landAmount;
            obj.OwnerRegAmount = ownerRegAmount;
            obj.OwnerPurchaseAmount = ownerPurchaseAmount;

            LandDetailsOwnerList.unshift(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: LandDetailsOwnerList,
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
            OwnerDetailSummaryGrid.setDataSource(gridDataSource);
            LandInfoDetailsHelper.CalculateTotalLandAmount();
            LandInfoDetailsHelper.ClearOwnerDetailsForm();
            
        } else {
            if (cmnMouzaCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbCmnMouza", "error", "right", 1500, "Required");
                AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Mouza Required!");
            }
            if (landAmount === null) {
                AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Owner Land Amount Required!");
            }
            if (ownerRegAmount === null) {
                AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Owner Registration Cost Required!");
            }
            if (ownerPurchaseAmount === null) {
                AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Owner Purchase Price of Land Required!");
            }
            if (OwnerCombo.value() === "" || saleOwnerName === "") {
                AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Owner Required!");
                AjaxManager.NotifyMsg("txtSaleOwnerName", "error", "right", 1500, "Required");
            }
        }
    },
    ClearOwnerDetailsForm: function () {
        $("#cmbOwnerInfo").data("kendoComboBox").value("");
        $("#txtSaleOwnerName").val("");
        $("#txtLandAmount").data('kendoNumericTextBox').value("");
        $("#txtOwnerRegAmount").data("kendoNumericTextBox").value("");
        $("#txtOwnerPurchaseAmount").data("kendoNumericTextBox").value("");
    },
    UpdateToListOwner: function () {

        var cmnMouzaCombo = $("#cmbCmnMouza").data("kendoComboBox");
        var OwnerCombo = $("#cmbOwnerInfo").data("kendoComboBox");
        var saleOwnerName = $("#txtSaleOwnerName").val();
        var landAmount = $("#txtLandAmount").data('kendoNumericTextBox').value();
        var ownerRegAmount = $("#txtOwnerRegAmount").data("kendoNumericTextBox").value();
        var ownerPurchaseAmount = $("#txtOwnerPurchaseAmount").data("kendoNumericTextBox").value();

        var grid = $("#grdOwnerDetailSummary").data("kendoGrid");
        var selectedItem = grid.dataItem(grid.select());
        
        if (cmnMouzaCombo.value() !== "" && (OwnerCombo.value() !== "" || saleOwnerName !== "") && landAmount !== null
            && ownerRegAmount !== null && ownerPurchaseAmount !== null) {
            //var gridData = grid.dataSource.data();
            //for (var i = 0; i < gridData.length; i++) {
            //    var itm = gridData[i];
            //    var mouzaId = cmnMouzaCombo.value();
            //    var ownerInfoId = OwnerCombo.value();
            //    if (parseInt(itm.MouzaId) === parseInt(mouzaId) && itm.MouzaId !== selectedItem.MouzaId
            //        && parseInt(itm.OwnerInfoId) === parseInt(ownerInfoId) && itm.OwnerInfoId !== selectedItem.OwnerInfoId) {
            //        AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Already Added!");
            //        return;
            //    }
            //}

            var obj = new Object();
            obj.LandOwnersDetailId = selectedItem.LandOwnersDetailId !== AjaxManager.DefaultGuidId() ? selectedItem.LandOwnersDetailId : AjaxManager.DefaultGuidId();
            obj.LandMasterId = selectedItem.LandMasterId !== AjaxManager.DefaultGuidId() ? selectedItem.LandMasterId : AjaxManager.DefaultGuidId();
            obj.OwnerInfoId = OwnerCombo.value() === "" ? "a6e5b7ac-daa9-4fca-a4c4-31c5cd7b8fb5" : OwnerCombo.value();
            obj.OwnerInfoName = OwnerCombo.text() === "" ? "For Land Sale" : OwnerCombo.text();
            obj.SaleOwnerName = saleOwnerName;
            obj.MouzaId = cmnMouzaCombo.value();
            obj.MouzaName = cmnMouzaCombo.text();
            obj.LandAmount = landAmount;
            obj.OwnerRegAmount = ownerRegAmount;
            obj.OwnerPurchaseAmount = ownerPurchaseAmount;

            for (var i = 0; i < LandDetailsOwnerList.length; i++) {
                if (LandDetailsOwnerList[i].LandOwnersDetailId === selectedItem.LandOwnersDetailId) {
                    LandDetailsOwnerList.splice(i, 1);
                    break;
                }
            }

            LandDetailsOwnerList.unshift(obj);
            selectedItem.set('LandOwnersDetailId', obj.LandOwnersDetailId);
            selectedItem.set('LandMasterId', obj.LandMasterId);
            selectedItem.set('OwnerInfoId', obj.OwnerInfoId);
            selectedItem.set('OwnerInfoName', obj.OwnerInfoName);
            selectedItem.set('SaleOwnerName', obj.SaleOwnerName);
            selectedItem.set('MouzaId', obj.MouzaId);
            selectedItem.set('MouzaName', obj.MouzaName);
            selectedItem.set('LandAmount', obj.LandAmount);
            selectedItem.set('OwnerRegAmount', obj.OwnerRegAmount);
            selectedItem.set('OwnerPurchaseAmount', obj.OwnerPurchaseAmount);

            LandInfoDetailsHelper.CalculateTotalLandAmount();
            $("#btnAddOwner").text("Add Owner");
            $("#btnAddOwner").addClass("fas fa-arrow-down");
            LandInfoDetailsHelper.ClearOwnerDetailsForm();
        } else {
            if (cmnMouzaCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbCmnMouza", "error", "right", 1500, "Required");
                AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Mouza Required!");
            }
            if (OwnerCombo.value() === "" || saleOwnerName === "") {
                AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Owner Required!");
                AjaxManager.NotifyMsg("txtSaleOwnerName", "error", "right", 1500, "Required");
            }
            if (landAmount === null) {
                AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Owner Land Amount Required!");
            }
            if (ownerRegAmount === null) {
                AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Owner Registration Cost of Land!");
            }
            if (OwnerPurchaseAmount === null) {
                AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Owner Purchase Price of Land!");
            }
        }
    },
    FillOwnerDetailForm: function (obj) {
        $("#btnAddOwner").text("Update Owner");
        $("#btnAddOwner").addClass("fa fa-edit");

        $("#cmbCmnMouza").data("kendoComboBox").value(obj.MouzaId);
        $("#cmbCmnMouza").data("kendoComboBox").text(obj.MouzaName);
        $("#cmbOwnerInfo").data("kendoComboBox").value(obj.OwnerInfoId);
        $("#cmbOwnerInfo").data("kendoComboBox").text(obj.OwnerInfoName);
        $("#txtSaleOwnerName").val(obj.SaleOwnerName);
        $("#txtLandAmount").data('kendoNumericTextBox').value(obj.LandAmount);
        $("#txtOwnerRegAmount").data("kendoNumericTextBox").value(obj.OwnerRegAmount);
        $("#txtOwnerPurchaseAmount").data("kendoNumericTextBox").value(obj.OwnerPurchaseAmount);
    },

    AddToListBayaDeed: function () {
       
        var bayaDeedNo = $("#txtBayaDeedNo").val();
        var bayaDeedDate = $("#txtBayaDeedDate").data("kendoDatePicker").value();
        var bayaDeedlSummaryGrid = $("#grdBayaDeedSummary").data("kendoGrid");

        if (bayaDeedNo !== "" /*&& bayaDeedDate !== "" && bayaDeedDate !== null*/) {
            var gridData = bayaDeedlSummaryGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                
                //if (itm.BayaDeedNo === bayaDeedNo) {
                //    AjaxManager.NotifyMsg("btnAddBayaDeed", "error", "right", 1500, "Already Added!");
                //    return;
                //}
            }

            var obj = new Object();
            obj.BayaDeedDetailId = AjaxManager.DefaultGuidId();
            obj.LandMasterId = AjaxManager.DefaultGuidId();
            obj.BayaDeedNo = bayaDeedNo;
            obj.BayaDeedDate = bayaDeedDate;
            
            BayaDeedList.unshift(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: BayaDeedList,
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
            bayaDeedlSummaryGrid.setDataSource(gridDataSource);
            LandInfoDetailsHelper.ClearBayaDeedForm();

        } else {
            if (bayaDeedNo === "") {
                AjaxManager.NotifyMsg("txtBayaDeedNo", "error", "right", 1500, "Required");
            }
            //if (bayaDeedDate === "" && bayaDeedDate !== null) {
            //    AjaxManager.NotifyMsg("txtBayaDeedDate", "error", "right", 1500, "Required");
            //}
        }
    },
    ClearBayaDeedForm: function () {
        $("#txtBayaDeedNo").val("");
    },
    UpdateToListBayaDeed: function () {
        
        var bayaDeedNo = $("#txtBayaDeedNo").val();
        var bayaDeedDate = $("#txtBayaDeedDate").data("kendoDatePicker").value();
        var grid = $("#grdBayaDeedSummary").data("kendoGrid");
        
        var selectedItem = grid.dataItem(grid.select());

        if (bayaDeedNo !== "" /*&& bayaDeedDate !== "" && bayaDeedDate !== null*/) {

            var obj = new Object();
            obj.BayaDeedDetailId = selectedItem.BayaDeedDetailId !== AjaxManager.DefaultGuidId() ? selectedItem.BayaDeedDetailId : AjaxManager.DefaultGuidId();
            obj.LandMasterId = selectedItem.LandMasterId !== AjaxManager.DefaultGuidId() ? selectedItem.LandMasterId : AjaxManager.DefaultGuidId();
            obj.BayaDeedNo = bayaDeedNo;
            obj.BayaDeedDate = bayaDeedDate;

            for (var i = 0; i < BayaDeedList.length; i++) {
                if (BayaDeedList[i].BayaDeedDetailId == selectedItem.BayaDeedDetailId && BayaDeedList[i].LandMasterId == selectedItem.LandMasterId) {
                    BayaDeedList.splice(i, 1);
                    break;
                }
            }

            BayaDeedList.unshift(obj);
            selectedItem.set('BayaDeedDetailId', obj.BayaDeedDetailId);
            selectedItem.set('LandMasterId', obj.LandMasterId);
            selectedItem.set('BayaDeedNo', obj.BayaDeedNo);
            selectedItem.set('BayaDeedDate', obj.BayaDeedDate);

            $("#btnAddBayaDeed").text("Add Baya Deed");
            $("#btnAddBayaDeed").addClass("fas fa-arrow-down");
            LandInfoDetailsHelper.ClearBayaDeedForm();
        } else {
            if (bayaDeedNo === "") {
                AjaxManager.NotifyMsg("txtBayaDeedNo", "error", "right", 1500, "Required");
            }
            //if (bayaDeedDate === "" && bayaDeedDate == null) {
            //    AjaxManager.NotifyMsg("txtBayaDeedDate", "error", "right", 1500, "Required");
            //}
        }
    },
    FillBayaDeedForm: function (obj) {
        $("#btnAddBayaDeed").text("Update Baya Deed");
        $("#btnAddBayaDeed").addClass("fas fa-arrow-down");

        $("#txtBayaDeedNo").val(obj.BayaDeedNo);
        $("#txtBayaDeedDate").data("kendoDatePicker").value(obj.BayaDeedDate);
    },

    FillLandMasterDetailsForm: function (obj) {
        
        $("#hdnLandMasterId").val(obj.LandMasterId);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
       
        $("#divLandOwnerTypeOtherRemarks").show();

        $("#divTransferedLand").hide();
        $("#divChkIsTransfered").hide();

        if (obj.IsTransfered == true) {
            $("#chkIsTransfered").prop('checked', true);
            $("#divTransferedLand").show();
            $("#divChkIsTransfered").show();

            //Fill Plot Wise Land Transfer Detail Summary Grid
            LandInfoDetailsHelper.FillPlotWiseLandTransferDetailSummaryGrid(obj.LandMasterId);

            //Fill Owner Wise Land Transfer Detail Summary Grid
            LandInfoDetailsHelper.FillOwnerWiseLandTransferDetailSummaryGrid(obj.LandMasterId);
        } else {
            $("#chkIsTransfered").prop('checked', false);
        };

        

        $("#divSaleLand").hide();
        $("#divChkIsSale").hide();
        $("#divOwnerInfoSale").hide();
        var grid = $("#grdOwnerDetailSummary").data("kendoGrid");
        grid.hideColumn(5);
        grid.hideColumn(6);
        if (obj.IsSale == true) {
            $("#chkIsSale").prop('checked', true);
            $("#divSaleLand").show();
            $("#divChkIsSale").show();
            $("#divOwnerInfoSale").show();
            $("#divOwnerInfo").hide();
            
            grid.showColumn(6);

            //Fill Plot Wise Land Sale Detail Summary Grid
            LandInfoDetailsHelper.FillPlotWiseLandSaleDetailSummaryGrid(obj.LandMasterId);

            //Fill Owner Wise Land Sale Detail Summary Grid
            LandInfoDetailsHelper.FillOwnerWiseLandSaleDetailSummaryGrid(obj.LandMasterId);
        } else {
            $("#chkIsSale").prop('checked', false);
            $("#divOwnerInfo").show();
            grid.showColumn(5);
        };

        
        
        
         //LandOwnerType List Load
        LandInfoDetailsHelper.LoadOwnerTypeListData(obj.LandMasterId);
        
        $("#cmbCmnDivision").data("kendoComboBox").value(obj.DivisionId);

        LandHelper.ChangeEventOfDivisionCombo();

        $("#cmbCmnDistrict").data("kendoComboBox").value(obj.DistrictId);
        
        LandHelper.ChangeEventOfDistrictCombo();
        $("#cmbCmnUpozila").data("kendoComboBox").value(obj.UpozilaId);

        LandHelper.ChangeEventOfUpozilaCombo();
        LandInfoDetailsHelper.ChangeEventOfUpozilaComboForSubRegOffice();
        $("#cmbSubRegOffice").data("kendoComboBox").value(obj.SubRegOfficeId);
        if (obj.IsBayna == true) {
            $("#chkIsBayna").prop('checked', true);
        } else {
            $("#chkIsBayna").prop('checked', false);
        };

        $("#txtEntryDate").data("kendoDatePicker").value(obj.EntryDate);
        $("#txtTotalLandAmount").data('kendoNumericTextBox').value(obj.TotalLandAmount);
        $("#txtDeedNo").val(obj.DeedNo);
        $("#txtLandRegAmount").data("kendoNumericTextBox").value(obj.LandRegAmount);
        $("#txtLandPurchaseAmount").data("kendoNumericTextBox").value(obj.LandPurchaseAmount);
        $("#txtLandDevelopmentAmount").data("kendoNumericTextBox").value(obj.LandDevelopmentAmount);
        $("#txtLandOtherAmount").data("kendoNumericTextBox").value(obj.LandOtherAmount);
        $("#txtRemarks").val(obj.Remarks);
        $("#txtFileRemarks").val(obj.FileRemarks);
        //Load Saler Info Grid
        LandInfoDetailsHelper.LoadSalerInfoGrid(obj.LandMasterId);
        //Load Khatian Summary Grid
        LandInfoDetailsHelper.FillKhatianDetailSummaryGrid(obj.LandMasterId);
        //Load Land Owner Grid
        LandInfoDetailsHelper.FillOwnerDetailSummaryGrid(obj.LandMasterId);

        files = obj.FilesVm;
        LandInfoDetailsHelper.LoadFile();

        //Load Baya Deed Grid
        LandInfoDetailsHelper.FillBayaDeedSummaryGrid(obj.LandMasterId);
    },
    LoadOwnerTypeListData: function (landMasterId) {
        
        $("#LandOwnerType").find("input[type='checkbox']").prop('checked', false);
        // Owner Type List
        var ownerTypeObjs = LandInfoDetailsManager.GetAllLandOwnerTypeListByLandMasterId(landMasterId);
        ownerTypeObjs.map(otObj => {
            $("#LandOwnerType").find("input[type='checkbox'][lwt-id='" + otObj.LandOwnerTypeId + "']").prop('checked', true);
            $("#LandOwnerType").find("input[type='checkbox'][lwt-id='" + otObj.LandOwnerTypeId + "']").attr("lmwr-id", otObj.LandMasterOwnerRelationId);
            $("#txtOtherRemarks").val(otObj.OtherRemarks);
        });
    },

    FillPlotWiseLandTransferDetailSummaryGrid: function (landMasterId) {
        // Plot Wise Land Transfer Detail Summary Grid List
        var plotWiseLandTransferDetailObjs = LandInfoDetailsManager.GetAllPlotWiseLandTransferDetailByLandMasterId(landMasterId);
        var plotWiseLandTransferSummaryGrid = $("#grdPlotWiseLandTransferSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: plotWiseLandTransferDetailObjs,
            schema: {
                model: {
                    fields: {
                    }
                }
            }
        });
        plotWiseLandTransferSummaryGrid.setDataSource(gridDataSource);
        PlotWiseLandTransferDetailList = plotWiseLandTransferDetailObjs;
    },
    FillOwnerWiseLandTransferDetailSummaryGrid: function (landMasterId) {
        // Owner Wise Land Transfer Detail Summary Grid List
        var ownerWiseLandTransferDetailObjs = LandInfoDetailsManager.GetAllOwnerWiseLandTransferDetailByLandMasterId(landMasterId);
        var ownerWiseLandTransferSummaryGrid = $("#grdOwnerWiseLandTransferSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: ownerWiseLandTransferDetailObjs,
            schema: {
                model: {
                    fields: {
                    }
                }
            }
        });
        ownerWiseLandTransferSummaryGrid.setDataSource(gridDataSource);
        OwnerWiseLandTransferDetailList = ownerWiseLandTransferDetailObjs;
    },

    FillPlotWiseLandSaleDetailSummaryGrid: function (landMasterId) {
        // Plot Wise Land Sale Detail Summary Grid List
        var plotWiseLandSaleDetailObjs = LandInfoDetailsManager.GetAllPlotWiseLandSaleDetailByLandMasterId(landMasterId);
        var plotWiseLandSaleSummaryGrid = $("#grdPlotWiseLandSaleSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: plotWiseLandSaleDetailObjs,
            schema: {
                model: {
                    fields: {
                    }
                }
            }
        });
        plotWiseLandSaleSummaryGrid.setDataSource(gridDataSource);
        PlotWiseLandSaleDetailList = plotWiseLandSaleDetailObjs;
    },
    FillOwnerWiseLandSaleDetailSummaryGrid: function (landMasterId) {
        // Owner Wise Land Sale Detail Summary Grid List
        var ownerWiseLandSaleDetailObjs = LandInfoDetailsManager.GetAllOwnerWiseLandSaleDetailByLandMasterId(landMasterId);
        var ownerWiseLandSaleSummaryGrid = $("#grdOwnerWiseLandSaleSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: ownerWiseLandSaleDetailObjs,
            schema: {
                model: {
                    fields: {
                    }
                }
            }
        });
        ownerWiseLandSaleSummaryGrid.setDataSource(gridDataSource);
        OwnerWiseLandSaleDetailList = ownerWiseLandSaleDetailObjs;
    },

    LoadSalerInfoGrid: function (landMasterId) {
        // Saler Info List
        var salerInfoObjs = LandInfoDetailsManager.GetAllLandSalerInfoListByLandMasterId(landMasterId);

        var salerInfoSummary = $("#grdSalerInfoSummary").data("kendoGrid");
        salerInfoSummary.setDataSource(salerInfoObjs);
    },
    FillKhatianDetailSummaryGrid: function (landMasterId) {
        // Khatian Detail List
        var khatianDetailObjs = LandInfoDetailsManager.GetAllKhatianDetailListByLandMasterId(landMasterId);
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
        LandDetailsKhatianList = khatianDetailObjs; 
    },
    FillOwnerDetailSummaryGrid: function (landMasterId) {
        // Owner Detail List
        var ownerDetailObjs = LandInfoDetailsManager.GetAllLandOwnerListByLandMasterId(landMasterId);
        var ownerDetailSummary = $("#grdOwnerDetailSummary").data("kendoGrid");
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
        LandDetailsOwnerList = ownerDetailObjs;
        LandInfoDetailsHelper.CalculateTotalLandAmount();
    },

    FillBayaDeedSummaryGrid: function (landMasterId) {
        // Owner Detail List
        var bayaDeedlObjs = LandInfoDetailsManager.GetAllBayaDeedDetailListByLandMasterId(landMasterId);
        var bayaDeedSummaryGrid = $("#grdBayaDeedSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: bayaDeedlObjs,
            schema: {
                model: {
                    fields: {
                        BayaDeedDate: { type: "date", format: "{0:dd-MM-yyyy}" }
                    }
                }
            }
        });
        bayaDeedSummaryGrid.setDataSource(gridDataSource);
        BayaDeedList = bayaDeedlObjs;
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
    },

    ValidateForm: function () {
        var res = true;

        var checkedLandOwnerType = $("#LandOwnerType input[type=checkbox]:checked").length;
        if (checkedLandOwnerType <= 0) {
            AjaxManager.NotifyMsg("LandOwnerType", "error", "bottom", 1500, "Basis of Ownership Required!");
            AjaxManager.NotifyMsg("btnSubmitApplication", "error", "left", 1500, "Basis of Ownership Required!");
            res = false;
        }
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
        var entryDate = $("#txtEntryDate").data("kendoDatePicker");
        if (entryDate.value() === "" || entryDate.value() === undefined || entryDate.value() === null) {
            AjaxManager.NotifyMsg("txtEntryDate", "error", "bottom", 1500, "Required");
            res = false;
        }
        var subRegOfficeName = $("#cmbSubRegOffice").data("kendoComboBox");
        if (subRegOfficeName.value() === "" || subRegOfficeName.value() === undefined) {
            AjaxManager.NotifyMsg("cmbSubRegOffice", "error", "right", 1500, "Required");
            res = false;
        }
        var totalLandAmount = $("#txtTotalLandAmount").data("kendoNumericTextBox");
        if (totalLandAmount.value() === "" || totalLandAmount.value() === undefined || totalLandAmount.value() === null) {
            AjaxManager.NotifyMsg("txtTotalLandAmount", "error", "right", 1500, "Required");
            res = false;
        }
        var deedNo = $("#txtDeedNo");
        if (deedNo.val() === "" || deedNo.val() === undefined) {
            AjaxManager.NotifyMsg("txtDeedNo", "error", "right", 1500, "Required");
            res = false;
        }
        var landPurchaseAmount = $("#txtLandPurchaseAmount").data("kendoNumericTextBox");
        if (landPurchaseAmount.value() === "" || landPurchaseAmount.value() === undefined || landPurchaseAmount.value() === null) {
            AjaxManager.NotifyMsg("txtLandPurchaseAmount", "error", "right", 1500, "Required");
            res = false;
        }
       
        var salerInfoGrid = $("#grdSalerInfoSummary").data("kendoGrid");
        var data = salerInfoGrid.dataSource.data();
        if (data.length <= 0) {
            AjaxManager.NotifyMsg("DivSalerInfo", "error", "bottom", 1500, "Saler Info Required!");
            AjaxManager.NotifyMsg("btnSubmitApplication", "error", "left", 1500, "Saler Info Required!");
            res = false;
        }
        
        //var gridData = OwnerDetailSummaryGrid.dataSource.data();
        for (var i = 0; i < data.length; i++) {
            var itm = data[i];
            if (itm.SalerName === "" || itm.SalerName === null) {
                AjaxManager.NotifyMsg("DivSalerInfo", "error", "bottom", 1500, "Saler Name Required!");
                AjaxManager.NotifyMsg("btnSubmitApplication", "error", "left", 1500, "Saler Name Required!");
                res = false;
            }
        }

        //Khatian List if empty
        if (LandDetailsKhatianList.length <= 0) {
            AjaxManager.NotifyMsg("btnAddKhatian", "error", "left", 1500, "Khatian Info Required!");
            AjaxManager.NotifyMsg("btnSubmitApplication", "error", "left", 1500, "Khatian Info Required!");
            res = false;
        }
        //Land Owner list if empty
        if (LandDetailsOwnerList.length <= 0) {
            AjaxManager.NotifyMsg("btnAddOwner", "error", "left", 1500, "Owner Info Required!");
            AjaxManager.NotifyMsg("btnSubmitApplication", "error", "left", 1500, "Owner Info Required!");
            res = false;
        }
        
        var landmasterId = $("#hdnLandMasterId").val();
      //  if (landmasterId === '00000000-0000-0000-0000-000000000000') {
            var totalOwnerLandAmount = 0;
            var ownerSummaryGrid = $("#grdOwnerDetailSummary").data("kendoGrid");
            var gridData = ownerSummaryGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                totalOwnerLandAmount += itm.LandAmount;
            }

            var totalAreaOfLand = $("#txtTotalLandAmount").data('kendoNumericTextBox').value();
            var x = parseFloat(totalOwnerLandAmount).toFixed(2);
            var y = parseFloat(totalAreaOfLand).toFixed(2);
            if (x !== y) {
                AjaxManager.NotifyMsg("btnSubmitApplication", "error", "left", 15000, "Total Area of Land & Total Owner Area of Land is Not Equal!");
                res = false;
         //   }
        }
        

        return res;
    },
    ClearFullForm: function () {
        $("#btnSubmitApplication").text("Submit");
        $("#btnSubmitApplication").addClass("glyphicon glyphicon-floppy-disk");

        $("#btnAddPlotWiseLandTransfer").text("Add Plot Wise Land Transfer");
        $("#btnAddPlotWiseLandTransfer").addClass("fas fa-arrow-down");
        $("#btnAddOwnerWiseLandTransfer").text("Add Owner Wise Land Transfer");
        $("#btnAddOwnerWiseLandTransfer").addClass("fas fa-arrow-down");

        $("#btnAddPlotWiseLandSale").text("Add Plot Wise Land Sale");
        $("#btnAddPlotWiseLandSale").addClass("fas fa-arrow-down");
        $("#btnAddOwnerWiseLandSale").text("Add Owner Wise Land Sale");
        $("#btnAddOwnerWiseLandSale").addClass("fas fa-arrow-down");

        $("#btnAddKhatian").text("Add Khatian");
        $("#btnAddKhatian").addClass("fas fa-arrow-down");
        $("#btnAddOwner").text("Add Owner");
        $("#btnAddOwner").addClass("fas fa-arrow-down");
        $("#btnAddBayaDeed").text("Add Baya Deed");
        $("#btnAddBayaDeed").addClass("fas fa-arrow-down");

        $("#divChkIsTransfered").show();
        $("#divChkIsSale").show();
        $("#divOwnerInfoSale").hide();
        $("#divTransferedLand").hide();
        $("#divSaleLand").hide();

        PlotWiseLandSaleDetailList = [];
        OwnerWiseLandSaleDetailList = [];

        PlotWiseLandTransferDetailList = [];
        OwnerWiseLandTransferDetailList = [];

        LandDetailsKhatianList = [];
        LandDetailsOwnerList = [];
        BayaDeedList = [];
        
        $("#hdnLandMasterId").val("00000000-0000-0000-0000-000000000000");
        $("#chkIsTransfered").prop('checked', false);
        $("#chkIsSale").prop('checked', false);

        $("#grdPlotWiseLandTransferSummary").data("kendoGrid").dataSource.data([]);
        $("#grdOwnerWiseLandTransferSummary").data("kendoGrid").dataSource.data([]);

        $("#grdPlotWiseLandSaleSummary").data("kendoGrid").dataSource.data([]);
        $("#grdOwnerWiseLandSaleSummary").data("kendoGrid").dataSource.data([]);

        $("#LandOwnerType").find("input[type='checkbox']").prop('checked', false);
        $("#divLandOwnerTypeOtherRemarks").hide();
        $("#txtOtherRemarks").val("");
        $("#cmbCmnDivision").data("kendoComboBox").value("");
        $("#cmbCmnDistrict").data("kendoComboBox").value("");
        $("#cmbCmnUpozila").data("kendoComboBox").value("");
        $("#cmbCmnMouza").data("kendoComboBox").value("");
        $("#cmbKhatianType").data("kendoComboBox").value("");
        $("#txtDeedNo").val("");
        //$("#txtEntryDate").data("kendoDatePicker").value("");
        $("#cmbSubRegOffice").data("kendoComboBox").value("");
        $("#chkIsBayna").prop('checked', false);
        $("#txtTotalLandAmount").data('kendoNumericTextBox').value("");
        $("#txtLandRegAmount").data("kendoNumericTextBox").value(0);
        $("#txtLandPurchaseAmount").data("kendoNumericTextBox").value("");
        $("#txtLandDevelopmentAmount").data("kendoNumericTextBox").value(0);
        $("#txtLandOtherAmount").data("kendoNumericTextBox").value(0);
        $("#grdSalerInfoSummary").data("kendoGrid").dataSource.data([]);
        $("#txtKhatianNo").val();
        $("#txtDagNo").val("");
        $("#txtRecordedOwnerName").val("");
        $("#txtRemarks").val("");
        $("#txtFileRemarks").val("");
        $("#grdKhatianDetailSummary").data("kendoGrid").dataSource.data([]);
        $("#cmbOwnerInfo").data("kendoComboBox").value("");
        $("#txtLandAmount").data('kendoNumericTextBox').value("");
        $("#txtOwnerRegAmount").data("kendoNumericTextBox").value("");
        $("#txtOwnerPurchaseAmount").data("kendoNumericTextBox").value("");
        $("#grdOwnerDetailSummary" ).data( "kendoGrid" ).dataSource.data( [] );

        files = [];
        LandInfoDetailsHelper.LoadFile();

        $("#grdBayaDeedSummary").data("kendoGrid").dataSource.data([]);
        $("#txtBayaDeedNo").val("");

        var grid = $("#grdOwnerDetailSummary").data("kendoGrid");
        grid.showColumn(5);
    }
}