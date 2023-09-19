
var files = [];
var isDelete = false;

var LandMapDetailsManager = {
    SaveLandMapDetails: function () {
        var msg = "";
        
        if (LandMapDetailsHelper.ValidateForm()) {            
            var createOrUpdateLandMapCommand = LandMapDetailsHelper.CreateLandMapObject();
            var jsonParam = JSON.stringify(createOrUpdateLandMapCommand);
            var serviceUrl = _baseUrlLand + "/api/LandMapInfo/CreateOrUpdateLandMap";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdLandMapSummary").data("kendoGrid").dataSource.read();
                            $("#divLandMapSummary").show();
                            $("#divLandMapDetails").hide();
                            LandMapDetailsHelper.ClearForm();
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
    GetAllSheetNoList() {        
        var list = ApiManager.GetList(_baseUrlLand + "/api/SheetNo/all");
        return list == null ? [] : list;
    },
    GetMapType() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/MapType/all");
        return list == null ? [] : list;
    }
}

var LandMapDetailsHelper = {
    InitLandMapDetails: function () {
        $("#btnAddNew").click(function () {
            $("#divLandMapSummary").hide();
            $("#divLandMapDetails").show();
            LandMapDetailsHelper.ClearForm();
        });
        $("#btnSubmitApplication").click(function () {
            
            LandMapDetailsManager.SaveLandMapDetails();
        });
        $("#btnCancelApplication").click(function () {
            $("#divLandMapSummary").show();
            $("#divLandMapDetails").hide();
            LandMapDetailsHelper.ClearForm();
        });
        LandHelper.LoadCmnDivisionCombo("cmbCmnDivision");
        LandHelper.LoadCmnDistrictCombo("cmbCmnDistrict");
        LandHelper.LoadCmnUpozilaCombo("cmbCmnUpozila");
        LandHelper.LoadCmnMouzaCombo("cmbCmnMouza");
        LandMapDetailsHelper.LoadSheetNoCombo("cmbSheetNo");
        LandMapDetailsHelper.LoadMapTypeCombo("cmbTransferedKhatianType");
        $("#cmbCmnDivision").change(function () {
            LandHelper.ChangeEventOfDivisionCombo();
        });
        $("#cmbCmnDistrict").change(function () {
            LandHelper.ChangeEventOfDistrictCombo();
        });
        $("#cmbCmnUpozila").change(function () {
            LandHelper.ChangeEventOfUpozilaCombo();
        });
        //$(".chkKhatianType").change(function () {
        //   // $('.chkKhatianType').not(this).prop('checked', false);            
        //});
    },
    //InitFields() {
    //    var khatianTypes = LandMapDetailsManager.GetKhatianType();
    //    var id = AjaxManager.DefaultGuidId();
    //    $.map(khatianTypes, function (khatianType) {
    //        $("#LandKhatianType").append('<div class="col-md-2">'
    //            + '<input style="margin-right:5px;" class ="chkKhatianType" sw-id=' + id + ' w-id= ' + khatianType.KhatianTypeId + ' type="checkbox" />'
    //            + '<label class ="lblChkLabel" > ' + khatianType.KhatianTypeName + ' </label> '
    //            + '</div>');
    //    });        
    //},
    CreateLandMapObject: function () {
        debugger;
        var obj = new Object();
        if (isDelete == true) {
            obj.IsDeleted = true;
        }        
        obj.LandMapId = $("#hdnLandMapId").val();
        obj.DivisionId = $("#cmbCmnDivision").data("kendoComboBox").value();
        obj.DistrictId = $("#cmbCmnDistrict").data("kendoComboBox").value();
        obj.UpozilaId = $("#cmbCmnUpozila").data("kendoComboBox").value(); 
        obj.MouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        obj.SheetNoInfoId = $("#cmbSheetNo").data("kendoComboBox").value();
        obj.MapTypeId = $("#cmbTransferedKhatianType").data("kendoComboBox").value();
        obj.Remarks = $("#txtRemarks").val();
        obj.DocumentVms = files;
        return obj;
    },
    //CreateKhatianTypeObject: function () {
        
    //    var list = [];
    //    var selectedKhatianTypelist = [];
    //    $("#LandKhatianType input[type='checkbox']:checked").each(function () {
    //        selectedKhatianTypelist.push({
    //            KhatianTypeId: $(this).attr("w-id"),
    //            FileRemarks: $("#txtFileRemarks").val()
    //        });
    //        return selectedKhatianTypelist;
    //    });
    //    for (var i = 0; i < selectedKhatianTypelist.length; i++) {
    //        var detailsData = selectedKhatianTypelist[i];
    //        var obj = new Object();
    //        obj.LandMapKhatianRelationId = AjaxManager.DefaultGuidId();
    //        obj.LandMapId = AjaxManager.DefaultGuidId();
    //        obj.KhatianTypeId = detailsData.KhatianTypeId;
    //        obj.OtherRemarks = detailsData.FileRemarks;
    //        list.push(obj);
    //    }
    //    return list;
    //},
    LoadMapTypeCombo(cmbTransferedKhatianType) {
        UtilityHelper.LoadCombo(cmbTransferedKhatianType, "MapTypeId", "MapTypeName", LandMapDetailsManager.GetMapType(), "--Select Map Type--");
    },
    LoadSheetNoCombo(cmbSheetNo) {
        UtilityHelper.LoadCombo(cmbSheetNo,
            "SheetNoInfoId",
            "SheetNo",
            LandMapDetailsManager.GetAllSheetNoList(),
            "--Select Sheet No--");
    },
    FillForm: function (obj) {
        debugger;
        $("#hdnLandMapId").val(obj.LandMapId);
        $("#cmbCmnDivision").data("kendoComboBox").value(obj.DivisionId);
        LandHelper.ChangeEventOfDivisionCombo();
        $("#cmbCmnDistrict").data("kendoComboBox").value(obj.DistrictId);
        LandHelper.ChangeEventOfDistrictCombo();
        $("#cmbCmnUpozila").data("kendoComboBox").value(obj.UpozilaId);
        LandHelper.ChangeEventOfUpozilaCombo();
        $("#cmbCmnMouza").data("kendoComboBox").value(obj.MouzaId);
        //LandMapDetailsHelper.LoadKhatianTypeListData(obj.LandMapId);
        //$(".chkKhatianType").change(function () {
        //   // $('.chkKhatianType').not(this).prop('checked', false);
        //});
        $("#cmbSheetNo").data("kendoComboBox").value(obj.SheetNoInfoId);
        $("#cmbTransferedKhatianType").data("kendoComboBox").value(obj.MapTypeId);
        $("#txtRemarks").val(obj.Remarks);

        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
        files = obj.FilesVm;
        LandMapDetailsHelper.LoadFile();
    },
    //LoadKhatianTypeListData: function (landMapId) {
        
    //    $("#LandKhatianType").find("input[type='checkbox']").prop('checked', false);
    //    var khatianTypeObjs = LandMapDetailsManager.GetAllLandKhatianTypeListByLandMapId(landMapId);
    //    khatianTypeObjs.map(otObj => {
    //        $("#LandKhatianType").find("input[type='checkbox'][w-id='" + otObj.KhatianTypeId + "']").prop('checked', true);
    //        $("#LandKhatianType").find("input[type='checkbox'][w-id='" + otObj.KhatianTypeId + "']").attr("sw-id", otObj.LandMapKhatianRelationId);
    //        $("#txtFileRemarks").val(otObj.FileRemarks);
    //    });
    //},
    ValidateForm: function () {
        
        var res = true;

        var cmnDivision = $("#cmbCmnDivision").data("kendoComboBox");
        if (cmnDivision.value() === "" || cmnDivision.value() === undefined) {
            AjaxManager.NotifyMsg("cmbCmnDivision", "error", "right", 1500, "Required");
            res = false;
        }

        var cmnDistrict = $("#cmbCmnDistrict").val();
        if (cmnDistrict === "" || cmnDistrict === undefined) {
            AjaxManager.NotifyMsg("cmbCmnDistrict", "error", "right", 1500, "Required");
            res = false;
        }

        var cmnUpozila = $("#cmbCmnUpozila").val();
        if (cmnUpozila === "" || cmnUpozila === undefined) {
            AjaxManager.NotifyMsg("cmbCmnUpozila", "error", "right", 1500, "Required");
            res = false;
        }

        var cmnMouza = $("#cmbCmnMouza").val();
        if (cmnMouza === "" || cmnMouza === undefined) {
            AjaxManager.NotifyMsg("cmbCmnMouza", "error", "right", 1500, "Required");
            res = false;
        }

        var cmnSheetNo = $("#cmbSheetNo").val();
        if (cmnSheetNo === "" || cmnSheetNo === undefined) {
            AjaxManager.NotifyMsg("cmbSheetNo", "error", "right", 1500, "Required");
            res = false;
        }

        var mapType = $("#cmbTransferedKhatianType").val();
        if (mapType === "" || mapType === undefined) {
            AjaxManager.NotifyMsg("cmbTransferedKhatianType", "error", "right", 1500, "Required");
            res = false;
        }

        //var checkedKhatian = $("#LandKhatianType input[type=checkbox]:checked").length;
        //if (checkedKhatian <= 0) {
        //    AjaxManager.NotifyMsg("LandKhatianType", "error", "bottom", 1500, "Map Type Required!");
        //    res = false;
        //}
        return res;
    },
    ClearForm: function () {
        $("#btnSubmitApplication").text("Submit");
        $("#btnSubmitApplication").addClass("glyphicon glyphicon-floppy-disk");
        $("#hdnLandMapId").val("00000000-0000-0000-0000-000000000000");
        $("#cmbCmnDivision").data("kendoComboBox").value("");
        $("#cmbCmnDistrict").data("kendoComboBox").value("");
        $("#cmbCmnUpozila").data("kendoComboBox").value("");
        $("#cmbCmnMouza").data("kendoComboBox").value("");
        $("#cmbSheetNo").data("kendoComboBox").value("");
        $("#cmbTransferedKhatianType").data("kendoComboBox").value("");
        $("#txtRemarks").val();
        $("#txtFileRemarks").val("");
        //$("#LandKhatianType").find("input[type='checkbox']").prop('checked', false);
        files = [];
        LandMapDetailsHelper.LoadFile();
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
