var validationSuccess = $("#validation-success");
var CourtInfoDetailsManager = {
    SaveCourtInfoDetails: function () {
        var msg = "";
        
        var objCourt = CourtDetailsHelper.CreateCourtObject();
        var jsonParam = JSON.stringify(objCourt);
        var serviceUrl = _baseUrlLegal + "/api/Court/CreateUpdateCourt";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdCourtInfoSummary").data("kendoGrid").dataSource.read();
                            CourtDetailsHelper.ClearForm();
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
    GetDistrict() {
        var list = ApiManager.GetList("../Common/GetAllDistrict/");
        return list == null ? [] : list;
    },
    GetJurisdictions() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/Jurisdiction/all");
        return list == null ? [] : list;
    },

    GetAllJurisdictionByCourt(courtId) {
        var objCaseFile = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/Jurisdiction/" + $.trim(courtId);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objCaseFile = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objCaseFile;
    }
};

var CourtDetailsHelper = {
    InitCourtDetails: function () {

        CourtDetailsHelper.LoadDistrictCombo("cmbDistrict");
        CourtDetailsHelper.LoadJurisdictionCombo("cmbJurisdiction");

        $("#btnSave").click(function () {
            
            CourtInfoDetailsManager.SaveCourtInfoDetails();
        });

        $("#btnClearAll").click(function () {
            CourtDetailsHelper.ClearForm();
        });
    },
    LoadDistrictCombo(cmbDistrict) {
        UtilityHelper.LoadCombo(cmbDistrict, "DistrictID", "DistrictName", CourtInfoDetailsManager.GetDistrict(), "--Select District--");
    },
    LoadJurisdictionCombo(cmbJurisdiction) {
        UtilityHelper.LoadMultiSelectCombo(cmbJurisdiction, "JurisdictionId", "JurisdictionName", CourtInfoDetailsManager.GetJurisdictions(), "--Select Jurisdiction--");
    },
    FillCourtForm: function (obj) {
        $("#hdnCourtId").val(obj.CourtId);
        $("#txtCourtInfo").val(obj.CourtName);
        $("#txtCourtNo").val(obj.CourtNo);
        $("#txtEmail").val(obj.Email);
        $("#txtWebsite").val(obj.Website);
        $("#txtPhone").val(obj.Phone);
        $("#txtFax").val(obj.Fax);
        $("#txtAddress").val(obj.CourtAddress);
        $("#cmbDistrict").data("kendoComboBox").value(obj.DistrictId);
        CourtDetailsHelper.FillDistrictJurisdiction(obj.CourtId);
    },

    CreateCourtObject: function (caseTypeObj) {
        var obj = new Object();
        obj.CourtId = $("#hdnCourtId").val();
        obj.CourtName = $("#txtCourtInfo").val().trim();
        obj.CourtNo = $("#txtCourtNo").val();
        obj.Email = $("#txtEmail").val();
        obj.Website = $("#txtWebsite").val();
        obj.Phone = $("#txtPhone").val();
        obj.Fax = $("#txtFax").val();
        obj.DistrictId = $("#cmbDistrict").data("kendoComboBox").value();
        obj.DistrictWiseJurisdictions = CourtDetailsHelper.CreateDistrictWiseJurisdictionObject();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnCourtId").val("0");
        $("#txtCourtInfo").val("");
        $("#txtCourtNo").val("");
        $("#txtEmail").val("");
        $("#txtWebsite").val("");
        $("#txtPhone").val("");
        $("#txtFax").val("");
        $("#cmbDistrict").data("kendoComboBox").value("");
        $("#cmbJurisdiction").data("kendoMultiSelect").value("");

    },
    CreateDistrictWiseJurisdictionObject: function () {
        
        var objList = [];
        var data = $("#cmbJurisdiction").data("kendoMultiSelect").value();
        $.each(data, function (key, value) {
            var obj = new Object();
            obj.DistrictWiseJurisdictionId = 0;
            obj.CourtId = $("#hdnCourtId").val();
            obj.DistrictId = $("#cmbDistrict").data("kendoComboBox").value();
            obj.JurisdictionId = value;
            objList.push(obj);
        });
        return objList;
    },
    FillDistrictJurisdiction: function (courtId) {
        
        var obj = [];
        var data = CourtInfoDetailsManager.GetAllJurisdictionByCourt(courtId);
        var jurisdictionCmb = $("#cmbJurisdiction").data("kendoMultiSelect");
        for (var i = 0; i < data.length; i++) {
            obj.push(data[i].JurisdictionId);
        }
        //var multiselect = $("#multiselect").data("kendoMultiSelect");
        $("#cmbJurisdiction").data("kendoMultiSelect").value(obj);
        //jurisdictionCmb.setDataSource(jurisdictionList);
    }
};