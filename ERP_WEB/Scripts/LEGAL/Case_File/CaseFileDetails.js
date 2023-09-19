
var files = [];
var isDelete = false;
var CaseFileDetailsManager = {
    SaveCaseFileDetails: function () {
        var msg = "";
        if (CaseFileDetailsHelper.ValidateForm()) {
            
            var objCaseFile = CaseFileDetailsHelper.CreateCaseFileObject();
            
        var jsonParam = JSON.stringify(objCaseFile);
        var serviceUrl = _baseUrlLegal + "/api/CaseFileMaster/CreateUpdateCaseFileMaster";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdCaseFileSummary").data("kendoGrid").dataSource.read();                            
                            $("#divCaseFileSummary").show();
                            $("#divCaseFileDetails").hide();
                            CaseFileDetailsHelper.ClearForm();
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
    GetJurisdictions() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/Jurisdiction/all");
        return list == null ? [] : list;
    },
    GetCourt() {
        //var list = ApiManager.GetList(_baseUrlLegal + "/api/Court/all");
        var list = [];
        return list == null ? [] : list;
    },
    GetMatter() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/MatterInfo/all");
        return list == null ? [] : list;
    },
    GetLawyers() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/LawyerInfo/all");
        return list == null ? [] : list;
    },
    GetFileType() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/FileType/all");
        return list == null ? [] : list;
    },
    GetCaseType() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/CaseType/all");
        return list == null ? [] : list;
    },
    GetDistrict() {
        var list = ApiManager.GetList("../Common/GetAllDistrict/");
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
    },
    GetStatus() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/Status/all");
        return list == null ? [] : list;
    },
    GetOnBeHalf() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/OnBeHalfOf/GetAllOnBehalfOf");
        return list == null ? [] : list;
        debugger;
    },
    GetAllDistrictByCourtId: function (courtId) {
        var objDistrict = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/Court/districtByCourtId/" + courtId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objDistrict = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        
        return objDistrict;
    },
    GetAllJurisdictionByCourtId: function (courtId) {
        var objJurisdiction = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/DistrictWiseJurisdiction/GetAllDistrictWiseJurisdiction/" + courtId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objJurisdiction = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        
        return objJurisdiction;
    },
    GetCourtByFileMasterId: function (fileId) {
        var objFile = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/CaseFileMaster/GetAllCourtByFileId/" + fileId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objFile = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objFile;
    },
    GetCourtByDistrictAndJurisdiction: function (districtId, jurisdictionId) {
        var objCourt = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + '/api/DistrictWiseJurisdiction/GetCourtByDistrictAndJurisdictionId/' + districtId + '/' + jurisdictionId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objCourt = jsonData;
        }
        function onFailed(error) {
            debugger
            window.alert(error.statusText);
        }
        return objCourt;
    }
};

var CaseFileDetailsHelper = {
    InitCaseFileDetails: function () {
        CaseFileDetailsHelper.LoadDistrictCombo("cmbDistrict");
        CaseFileDetailsHelper.LoadJurisdictionCombo("cmbJurisdiction");
        CaseFileDetailsHelper.LoadCourtCombo("cmbCourt");
        CaseFileDetailsHelper.LoadMatterCombo("cmbMatter");
        CaseFileDetailsHelper.LoadAssignLawyerCombo("cmbAssignLawyer");
        CaseFileDetailsHelper.LoadFileTypeCombo("cmbFileType");
        CaseFileDetailsHelper.LoadCompanyCombo("cmbCompany");
        CaseFileDetailsHelper.LoadUnitCombo("cmbUnit");
        CaseFileDetailsHelper.GenerateDatePicker();
        CaseFileDetailsHelper.LoadStatusCombo("cmbStatus");
        CaseFileDetailsHelper.LoadOnBeHalfCombo("cmbOnBeHalf");

        $("#cmbJurisdiction").change(function() {
            CaseFileDetailsHelper.ChangeEventOfCourtCombo();
        });

        $("#cmbPetitioner").change(function () {
            $("#txtPetitionerCont").removeAttr('disabled');
        });

        $("#cmbFillingLawyer").change(function () {
            $("#txtFlowyerContact").removeAttr('disabled');
        });

        $("#cmbOppositeParty").change(function () {
            $("#txtOppositePartyCont").removeAttr('disabled');
        });

        $("#cmbOppositeLawyer").change(function () {
            $("#txtOlowyerContact").removeAttr('disabled');
        });

        $("#cmbCompany").change(function () {
            CaseFileDetailsHelper.ChangeEventOfCompnayCombo();
        });

        $("#cmbStatus").change(function () {
            var statusId = $("#cmbStatus").data("kendoComboBox").value();
            if (statusId != 1) {
                $("#divStatus").show();
            }
            else {
                $("#divStatus").hide();
            }
        });

        $("#btnSave").click(function () {
            CaseFileDetailsManager.SaveCaseFileDetails();
        });

        $("#btnCancelApplication").click(function () {
            $("#divCaseFileSummary").show();
            $("#divCaseFileDetails").hide();
            CaseFileDetailsHelper.ClearForm();
        });

        $("#btnClearAll").click(function () {
            $("#divCaseFileSummary").show();
            $("#divCaseFileDetails").hide();
            CaseFileDetailsHelper.ClearForm();
        });

    },
    FillCaseFileForm: function (obj) {      
        
        $("#hdnFileMasterId").val(obj.FileMasterId);
        $("#txtRegNo").val(obj.RegNo);
        $("#cmbFileType").data("kendoComboBox").value(obj.FileTypeId);        
        $("#cmbFileType").data("kendoComboBox").enable(true);

        $("#cmbPetitioner").val(obj.Petitioner);
        $("#cmbPetitioner").removeAttr("disabled");
        //$('#cmbPetitioner').attr("disabled", "disabled");

        $("#txtPetitionerCont").val(obj.PetitionerContact);
        $("#txtPetitionerCont").removeAttr("disabled");
        //$('#txtPetitionerCont').attr("disabled", "disabled");

        $("#cmbOppositeLawyer").val(obj.OppositeLawyer);
        $("#cmbOppositeLawyer").removeAttr("disabled");
        //$('#cmbOppositeLawyer').attr("disabled", "disabled");

        $("#txtOlowyerContact").val(obj.OppositeLawyerContact);
        $("#txtOlowyerContact").removeAttr("disabled");
        //$('#txtOlowyerContact').attr("disabled", "disabled");

        $("#txtCaseNo").val(obj.CaseNo);
        $("#txtCaseNo").removeAttr("disabled");
        //$('#txtCaseNo').attr("disabled", "disabled");

        $("#cmbFillingLawyer").val(obj.FillingLawyer);
        $("#cmbFillingLawyer").removeAttr("disabled");
        //$('#cmbFillingLawyer').attr("disabled", "disabled");

        $("#txtFlowyerContact").val(obj.FillingLawyerContact);
        $("#txtFlowyerContact").removeAttr("disabled");
        //$('#txtFlowyerContact').attr("disabled", "disabled");

        $("#cmbAssignLawyer").data("kendoComboBox").value(obj.AssignLawyer);
        $("#cmbAssignLawyer").data("kendoComboBox").enable(true);

        $("#txtDiscription").val(obj.Discription);
        $("#txtDiscription").removeAttr("disabled");
        //$('#txtDiscription').attr("disabled", "disabled");

        $("#cmbMatter").data("kendoComboBox").value(obj.MatterId);
        $("#cmbMatter").data("kendoComboBox").enable(true);

        $("#cmbOnBeHalf").data("kendoComboBox").value(obj.OnBehalfOfId);
        $("#cmbOnBeHalf").data("kendoComboBox").enable(true);

        $("#cmbOppositeParty").val(obj.OppositeParty);
        $("#cmbOppositeParty").removeAttr("disabled");
        //$('#cmbOppositeParty').attr("disabled", "disabled");

        $("#txtOppositePartyCont").val(obj.OppositePartyContact);
        $("#txtOppositePartyCont").removeAttr("disabled");
        //$('#txtOppositePartyCont').attr("disabled", "disabled");

        $("#cmbCompany").data("kendoComboBox").value(obj.CompanyId);
        $("#cmbCompany").data("kendoComboBox").enable(true);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
        CaseFileDetailsHelper.FillUnit(obj.CompanyId);
        //$("#cmbUnit").data("kendoComboBox").value(obj.UnitId);

        CaseFileDetailsHelper.FillDistrict(obj.CourtId);
        CaseFileDetailsHelper.FillJurisdiction(obj.CourtId);

        CaseFileDetailsHelper.FillCourt(obj.FileMasterId);

        $("#cmbStatus").data("kendoComboBox").value(obj.StatusId);
        $("#cmbStatus").data("kendoComboBox").enable(true);

        var statusValue = $("#cmbStatus").data("kendoComboBox").value();
        if (statusValue == 1) {
            $("#divStatus").hide();
        }
        else {
            $("#divStatus").show();
            $("#txtStatusDate").val(obj.StatusDate);
        }

        $("#txtStatusDate").data("kendoDatePicker").value(obj.StatusDate);
        $("#txtStatusDate").data("kendoDatePicker").enable(true);

        if (obj.IsPublish == true) {
            $("#chkIsPublish").prop('checked', true);
            $("#chkIsPublish").removeAttr("disabled");
            //$('#chkIsPublish').attr("disabled", "disabled");
        }
        else {
            $("#chkIsPublish").prop('checked', false);
            $("#chkIsPublish").removeAttr("disabled");
            //$('#chkIsPublish').attr("disabled", "disabled");
        };
        files = obj.FilesVm;
        CaseFileDetailsHelper.LoadFile();
    },
    FillCaseFileFormDisabled: function (obj) {
        $("#divCaseFileDetails").attr('disabled', 'disabled');
        $("#hdnFileMasterId").val(obj.FileMasterId);
        $("#txtRegNo").val(obj.RegNo);
        $("#cmbFileType").data("kendoComboBox").value(obj.FileTypeId);
        $("#cmbFileType").data("kendoComboBox").enable(false); 

        $("#cmbPetitioner").val(obj.Petitioner);
        $("#cmbPetitioner").prop("disabled", true);
        //$('#cmbPetitioner').attr("disabled", "enabled");

        $("#txtPetitionerCont").val(obj.PetitionerContact);
        $("#txtPetitionerCont").prop("disabled", true);
        //$('#txtPetitionerCont').attr("disabled", "disabled");

        $("#cmbOppositeLawyer").val(obj.OppositeLawyer);
        $("#cmbOppositeLawyer").prop("disabled", true);
        //$('#cmbOppositeLawyer').attr("disabled", "disabled");

        $("#txtOlowyerContact").val(obj.OppositeLawyerContact);
        $("#txtOlowyerContact").prop("disabled", true);
        //$('#txtOlowyerContact').attr("disabled", "disabled");

        $("#txtCaseNo").val(obj.CaseNo);
        $("#txtCaseNo").prop("disabled", true);
        //$('#txtCaseNo').attr("disabled", "disabled");

        $("#cmbFillingLawyer").val(obj.FillingLawyer);
        $("#cmbFillingLawyer").prop("disabled", true);
        //$('#cmbFillingLawyer').attr("disabled", "disabled");

        $("#txtFlowyerContact").val(obj.FillingLawyerContact);
        $("#txtFlowyerContact").prop("disabled", true);
        //$('#txtFlowyerContact').attr("disabled", "disabled");

        $("#cmbAssignLawyer").data("kendoComboBox").value(obj.AssignLawyer);
        $("#cmbAssignLawyer").data("kendoComboBox").enable(false); 

        $("#txtDiscription").val(obj.Discription);
        $("#txtDiscription").prop("disabled", true);
        //$('#txtDiscription').attr("disabled", "disabled");

        $("#cmbMatter").data("kendoComboBox").value(obj.MatterId);
        $("#cmbMatter").data("kendoComboBox").enable(false); 

        $("#cmbOnBeHalf").data("kendoComboBox").value(obj.OnBehalfOfId);
        $("#cmbOnBeHalf").data("kendoComboBox").enable(false); 

        $("#cmbOppositeParty").val(obj.OppositeParty);
        $("#cmbOppositeParty").prop("disabled", true);
        //$('#cmbOppositeParty').attr("disabled", "disabled");

        $("#txtOppositePartyCont").val(obj.OppositePartyContact);
        $("#txtOppositePartyCont").prop("disabled", true);
        //$('#txtOppositePartyCont').attr("disabled", "disabled");

        $("#cmbCompany").data("kendoComboBox").value(obj.CompanyId);
        $("#cmbCompany").data("kendoComboBox").enable(false);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
        CaseFileDetailsHelper.EditFillUnit(obj.CompanyId);
        //$("#cmbUnit").data("kendoComboBox").value(obj.UnitId);

        CaseFileDetailsHelper.EditFillDistrict(obj.CourtId);
        CaseFileDetailsHelper.EditFillJurisdiction(obj.CourtId);

        CaseFileDetailsHelper.EditFillCourt(obj.FileMasterId);

        $("#cmbStatus").data("kendoComboBox").value(obj.StatusId);
        $("#cmbStatus").data("kendoComboBox").enable(false);

        var statusValue = $("#cmbStatus").data("kendoComboBox").value();
        if (statusValue == 1) {
            $("#divStatus").hide();
        }
        else {
            $("#divStatus").show();
            $("#txtStatusDate").val(obj.StatusDate);            
        }

        $("#txtStatusDate").data("kendoDatePicker").value(obj.StatusDate);
        $("#txtStatusDate").data("kendoDatePicker").enable(false);

        if (obj.IsPublish == true) {
            $("#chkIsPublish").prop('checked', true);
            $('#chkIsPublish').attr("disabled", "disabled");
        }
        else {
            $("#chkIsPublish").prop('checked', false);
            $('#chkIsPublish').attr("disabled", "disabled");
        };
        files = obj.FilesVm;
        CaseFileDetailsHelper.LoadFile();
    },
    CreateCaseFileObject: function () {
        var obj = new Object();
        obj.FileMasterId = $("#hdnFileMasterId").val();
        obj.RegNo = $("#txtRegNo").val();
        obj.FileTypeId = $("#cmbFileType").data("kendoComboBox").value();
        obj.Petitioner = $("#cmbPetitioner").val();
        obj.PetitionerContact = $("#txtPetitionerCont").val();
        obj.OppositeLawyer = $("#cmbOppositeLawyer").val();
        obj.OppositeLawyerContact = $("#txtOlowyerContact").val();
        obj.CourtId = $("#cmbCourt").data("kendoComboBox").value();
        obj.OnBehalfOfId = $("#cmbOnBeHalf").data("kendoComboBox").value();
        obj.CaseNo = $("#txtCaseNo").val();
        obj.FillingLawyer = $("#cmbFillingLawyer").val();
        obj.FillingLawyerContact = $("#txtFlowyerContact").val();
        obj.AssignLawyer = $("#cmbAssignLawyer").data("kendoComboBox").value();
        obj.Discription = $("#txtDiscription").val();
        obj.MatterId = $("#cmbMatter").data("kendoComboBox").value();
        obj.OppositeParty = $("#cmbOppositeParty").val();
        obj.OppositePartyContact = $("#txtOppositePartyCont").val();
        obj.CompanyId = $("#cmbCompany").data("kendoComboBox").value();
        var unit = $("#cmbUnit").data("kendoComboBox").value();
        if (unit == undefined || unit == "") {
            obj.UnitId = 0;
        } else {
            obj.UnitId = $("#cmbUnit").data("kendoComboBox").value();
        }
        obj.StatusId = $("#cmbStatus").data("kendoComboBox").value();
        obj.StatusDate = kendo.toString($("#txtStatusDate").data("kendoDatePicker").value()) == undefined ? "" : kendo.toString($("#txtStatusDate").data("kendoDatePicker").value());
        obj.IsPublish = $("#chkIsPublish").is(":checked");
        obj.CreatedBy = CurrentUser.USERID;
        obj.UpdatedBy = CurrentUser.USERID;
        obj.DocumentVms = files;
        if (isDelete == true) {
            obj.IsDeleted = true;
            obj.DeletedBy = CurrentUser.USERID;
        }
        else {
            isDelete == false;
        }
        
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnFileMasterId").val("0");
        $("#txtRegNo").val("");
        $("#cmbFileType").data("kendoComboBox").value("");
        $("#cmbDistrict").data("kendoComboBox").value("");
        $("#cmbPetitioner").val("");
        $("#txtPetitionerCont").val("");
        $("#cmbOppositeLawyer").val("");
        $("#txtOlowyerContact").val("");
        $("#cmbJurisdiction").data("kendoComboBox").value("");
        $("#cmbCourt").data("kendoComboBox").value("");
        $("#cmbOnBeHalf").data("kendoComboBox").value("");
        $("#txtCaseNo").val("");
        $("#cmbFillingLawyer").val("");
        $("#txtFlowyerContact").val("");
        $("#cmbAssignLawyer").data("kendoComboBox").value("");
        $("#txtDiscription").val("");
        $("#cmbMatter").data("kendoComboBox").value("");
        $("#cmbOppositeParty").val("");
        $("#txtOppositePartyCont").val("");
        $("#cmbCompany").data("kendoComboBox").value("");
        $("#cmbUnit").data("kendoComboBox").value("");
        $("#cmbStatus").data("kendoComboBox").value("");
        $("#txtStatusDate").data("kendoDatePicker").value("");
        $("#chkIsPublish").prop('checked', false);
        files = [];
        CaseFileDetailsHelper.LoadFile();
    },
    GenerateDatePicker: function () {
        $("#txtStatusDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    ValidateForm: function () {
        var res = true;
        
        var cmnDistrict = $("#cmbDistrict").data("kendoComboBox");
        if (cmnDistrict.value() === "" || cmnDistrict.value() === undefined) {
            AjaxManager.NotifyMsg("cmbDistrict", "error", "right", 1500, "Required");
            res = false;
        }
        var court = $("#cmbCourt").data("kendoComboBox");
        if (court.value() === "" || court.value() === undefined) {
            AjaxManager.NotifyMsg("cmbCourt", "error", "right", 1500, "Required");
            res = false;
        }
        var matter = $("#cmbMatter").data("kendoComboBox");
        if (matter.value() === "" || matter.value() === undefined) {
            AjaxManager.NotifyMsg("cmbMatter", "error", "right", 1500, "Required");
            res = false;
        }

        var petitioner = $("#cmbPetitioner");
        if (petitioner.val() === "" || petitioner.val() === undefined ) {
            AjaxManager.NotifyMsg("cmbPetitioner", "error", "right", 1500, "Required");
            res = false;
        }

        var oppositeP = $("#cmbOppositeParty");
        if (oppositeP.val() === "" || oppositeP.val() === undefined) {
            AjaxManager.NotifyMsg("cmbOppositeParty", "error", "right", 1500, "Required");
            res = false;
        }

        var assignLawyer = $("#cmbAssignLawyer");
        if (assignLawyer.val() === "" || assignLawyer.val() === undefined) {
            AjaxManager.NotifyMsg("cmbAssignLawyer", "error", "right", 1500, "Required");
            res = false;
        }
        var fileType = $("#cmbFileType");
        if (fileType.val() === "" || fileType.val() === undefined) {
            AjaxManager.NotifyMsg("cmbFileType", "error", "right", 1500, "Required");
            res = false;
        }
        var caseNo = $("#txtCaseNo");
        if (caseNo.val() === "" || caseNo.val() === undefined) {
            AjaxManager.NotifyMsg("txtCaseNo", "error", "right", 1500, "Required");
            res = false;
        }

        return res;
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
    LoadOnBeHalfCombo: function (cmbOnBeHalf) {
        UtilityHelper.LoadCombo(cmbOnBeHalf, "OnBehalfOfId", "OnBehalfOfName", CaseFileDetailsManager.GetOnBeHalf(), "--Select BeHalf--");

    },
    LoadStatusCombo: function (cmbStatus) {
        UtilityHelper.LoadCombo(cmbStatus, "StatusId", "StatusName", CaseFileDetailsManager.GetStatus(), "--Select Status--");
        //$("#cmbStatus").kendoComboBox({
        //    dataTextField: "text",
        //    dataValueField: "value",
        //    dataSource: [
        //        { text: "--Select--", value: "0" },
        //        { text: "Pending", value: "1" },
        //        { text: "Disposed", value: "2" },
        //        { text: "Stayed", value: "3" }
        //    ],
        //    filter: "contains",
        //    suggest: true,
        //    index: 0
        //});
    },
    LoadDistrictCombo(cmbDistrict) {
        UtilityHelper.LoadCombo(cmbDistrict, "DistrictID", "DistrictName", CaseFileDetailsManager.GetDistrict(), "--Select District--");
    },
    LoadJurisdictionCombo(cmbJurisdiction) {
        UtilityHelper.LoadCombo(cmbJurisdiction, "JurisdictionId", "JurisdictionName", CaseFileDetailsManager.GetJurisdictions(), "--Select Jurisdiction--");
    },
    LoadCourtCombo(cmbCourt) {
        UtilityHelper.LoadCombo(cmbCourt, "CourtId", "CourtName", [], "--Select Court--");
    },
    LoadMatterCombo(cmbMatter) {
        UtilityHelper.LoadCombo(cmbMatter, "MatterId", "MatterName", CaseFileDetailsManager.GetMatter(), "--Select Matter--");
    },
    LoadAssignLawyerCombo(cmbAssignLawyer) {
        UtilityHelper.LoadCombo(cmbAssignLawyer, "LawyerId", "LawyerName", CaseFileDetailsManager.GetLawyers(), "--Select Assign Lawyer--");
    },    
    LoadFileTypeCombo(cmbFileType) {
        UtilityHelper.LoadCombo(cmbFileType, "FileTypeId", "FileTypeName", CaseFileDetailsManager.GetFileType(), "--Select File Type--");
    },
    LoadCompanyCombo(cmbCompany) {
        UtilityHelper.LoadCombo(cmbCompany, "CompanyId", "CompanyName", CaseFileDetailsManager.GetReferenceCompany(), "--Select Company--");
    },
    LoadUnitCombo(cmbUnit) {
        UtilityHelper.LoadCombo(cmbUnit, "UnitId", "UnitName", [], "--Select Reference--");
    },
    ChangeEventOfCourtCombo: function () {
        var districtId = $("#cmbDistrict").data("kendoComboBox").value();
        var jurisdictionId = $("#cmbJurisdiction").data("kendoComboBox").value();
        var data = CaseFileDetailsManager.GetCourtByDistrictAndJurisdiction(districtId, jurisdictionId);
        var courtCombo = $("#cmbCourt").data("kendoComboBox");
        courtCombo.value("");
        courtCombo.text("");
        courtCombo.setDataSource(data);
    },
    ChangeEventOfCompnayCombo: function () {
        var companyId = $("#cmbCompany").data("kendoComboBox").value();
        var data = CaseFileDetailsManager.GetReference(companyId);
        var unitCombo = $("#cmbUnit").data("kendoComboBox");
        unitCombo.value("");
        unitCombo.text("");
        unitCombo.setDataSource(data);
    },
    FillJurisdiction: function (obj) {
        var jurisdictionObj = [];
        var data = CaseFileDetailsManager.GetAllJurisdictionByCourtId(obj);
        var jurisdictionCombo = $("#cmbJurisdiction").data("kendoComboBox");
        if (data != null) {
            jurisdictionObj = data[0];
            $("#cmbJurisdiction").data("kendoComboBox").value(jurisdictionObj.JurisdictionId);
            $("#cmbJurisdiction").data("kendoComboBox").enable(true);
            //jurisdictionCombo.value(jurisdictionObj.jurisdictionId)
        }

        //for (var i = 0; i < data.length; i++) {
        //    courtObj.push(data[i].JurisdictionId);
        //}
        //jurisdictionCombo.value(courtObj);
    },
    EditFillJurisdiction: function (obj) {
        var jurisdictionObj = [];
        var data = CaseFileDetailsManager.GetAllJurisdictionByCourtId(obj);
        var jurisdictionCombo = $("#cmbJurisdiction").data("kendoComboBox");
        if (data != null) {
            jurisdictionObj = data[0];
            $("#cmbJurisdiction").data("kendoComboBox").value(jurisdictionObj.JurisdictionId);
            $("#cmbJurisdiction").data("kendoComboBox").enable(false);
            //jurisdictionCombo.value(jurisdictionObj.jurisdictionId)
        }

        //for (var i = 0; i < data.length; i++) {
        //    courtObj.push(data[i].JurisdictionId);
        //}
        //jurisdictionCombo.value(courtObj);
    },
    FillDistrict: function (obj) {        
        var districtObj = [];
        var districtData = CaseFileDetailsManager.GetAllDistrictByCourtId(obj);
        if (districtData != null) {
            var districtObj = districtData[0];
            $("#cmbDistrict").data("kendoComboBox").value(districtObj.DistrictId);
            $("#cmbDistrict").data("kendoComboBox").enable(true);
        };
    },
    EditFillDistrict: function (obj) {
        var districtObj = [];
        var districtData = CaseFileDetailsManager.GetAllDistrictByCourtId(obj);
        if (districtData != null) {
            var districtObj = districtData[0];
            $("#cmbDistrict").data("kendoComboBox").value(districtObj.DistrictId);
            $("#cmbDistrict").data("kendoComboBox").enable(false);
        };
    },
    FillUnit: function (obj) {
        
        var unitObj = [];
        var unitData = CaseFileDetailsManager.GetReference(obj);
        $("#cmbUnit").data("kendoComboBox").setDataSource(unitData);
        if (unitData.length > 0) {
            var unitObj = unitData[0];
            $("#cmbUnit").data("kendoComboBox").value(unitObj.UnitId);
            $("#cmbUnit").data("kendoComboBox").enable(true);
        }
        else {
            $("#cmbUnit").data("kendoComboBox").value("");
            $("#cmbUnit").data("kendoComboBox").enable(true);
        }
    },
    EditFillUnit: function (obj) {

        var unitObj = [];
        var unitData = CaseFileDetailsManager.GetReference(obj);
        $("#cmbUnit").data("kendoComboBox").setDataSource(unitData);
        if (unitData.length > 0) {
            var unitObj = unitData[0];
            $("#cmbUnit").data("kendoComboBox").value(unitObj.UnitId);
            $("#cmbUnit").data("kendoComboBox").enable(false);
        }
        else {
            $("#cmbUnit").data("kendoComboBox").value("");
            $("#cmbUnit").data("kendoComboBox").enable(false);
        }
    },
    FillCourt(fileId) {
        var districtId = $("#cmbDistrict").data("kendoComboBox").value();
        var jurisdictionId = $("#cmbJurisdiction").data("kendoComboBox").value();
        var data = CaseFileDetailsManager.GetCourtByDistrictAndJurisdiction(districtId, jurisdictionId);
        $("#cmbCourt").data("kendoComboBox").setDataSource(data);

        var filedata = CaseFileDetailsManager.GetCourtByFileMasterId(fileId);
        for (var i = 0; i < data.length; i++) {
            if (data[i].CourtId == filedata[0].CourtId) {
                $("#cmbCourt").data("kendoComboBox").value(filedata[0].CourtId);
                $("#cmbCourt").data("kendoComboBox").enable(true);
            }
        }
        
    },
    EditFillCourt(fileId) {
        var districtId = $("#cmbDistrict").data("kendoComboBox").value();
        var jurisdictionId = $("#cmbJurisdiction").data("kendoComboBox").value();
        var data = CaseFileDetailsManager.GetCourtByDistrictAndJurisdiction(districtId, jurisdictionId);
        $("#cmbCourt").data("kendoComboBox").setDataSource(data);

        var filedata = CaseFileDetailsManager.GetCourtByFileMasterId(fileId);
        for (var i = 0; i < data.length; i++) {
            if (data[i].CourtId == filedata[0].CourtId) {
                $("#cmbCourt").data("kendoComboBox").value(filedata[0].CourtId);
                $("#cmbCourt").data("kendoComboBox").enable(false);
            }
        }

    }
};