
var CmnSubRegOfficeDetailsManager = {
    SaveCmnSubRegOfficeDetails: function () {
        var msg = "";
        var objCmnSubRegOffice = CmnSubRegOfficeDetailsHelper.CreateCmnSubRegOfficeObject();
        var jsonParam = JSON.stringify(objCmnSubRegOffice);
        var serviceUrl = _baseUrlLand + "/api/CmnSubRegOffice/CreateUpdateCmnSubRegOffice";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdCmnSubRegOfficeSummary").data("kendoGrid").dataSource.read();
                            CmnSubRegOfficeDetailsHelper.ClearForm();
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
    }
}

var CmnSubRegOfficeDetailsHelper = {
    InitCmnSubRegOfficeDetails: function () {
        LandHelper.LoadCmnDivisionCombo("cmbCmnDivision");
        LandHelper.LoadCmnDistrictCombo("cmbCmnDistrict");
        LandHelper.LoadCmnUpozilaCombo("cmbCmnUpozila");
        $("#btnSave").click(function () {
            CmnSubRegOfficeDetailsManager.SaveCmnSubRegOfficeDetails();
        });
        $("#btnClearAll").click(function () {
            CmnSubRegOfficeDetailsHelper.ClearForm();
        });
        $("#cmbCmnDivision").change(function () {
            LandHelper.ChangeEventOfDivisionCombo();
        });
        $("#cmbCmnDistrict").change(function () {
            LandHelper.ChangeEventOfDistrictCombo();
        });
    },
    CreateCmnSubRegOfficeObject: function () {
        var obj = new Object();
        obj.SubRegOfficeId = $("#hdnCmnSubRegOfficeId").val();
        obj.SubRegOfficeName = $("#txtCmnSubRegOfficeName").val();
        obj.UpozilaId = $("#cmbCmnUpozila").data("kendoComboBox").value();
        obj.IsActive = $("#chkIsActive").is(":checked");
        return obj;
    },
    FillCmnSubRegOfficeForm: function (obj) {
        $("#cmbCmnDivision").data("kendoComboBox").value(obj.DivisionId);
        LandHelper.ChangeEventOfDivisionCombo();
        $("#cmbCmnDistrict").data("kendoComboBox").value(obj.DistrictId);
        LandHelper.ChangeEventOfDistrictCombo();
        $("#cmbCmnUpozila").data("kendoComboBox").value(obj.UpozilaId);
        $("#hdnCmnSubRegOfficeId").val(obj.SubRegOfficeId);
        $("#txtCmnSubRegOfficeName").val(obj.SubRegOfficeName);
        if (obj.IsActive == true) {
            $("#chkIsActive").prop('checked', true);
        } else {
            $("#chkIsActive").prop('checked', false);
        };
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#cmbCmnDivision").data("kendoComboBox").value("");
        $("#cmbCmnDistrict").data("kendoComboBox").value("");
        $("#cmbCmnUpozila").data("kendoComboBox").value("");
        $("#hdnCmnSubRegOfficeId").val("00000000-0000-0000-0000-000000000000");
        $("#txtCmnSubRegOfficeName").val("");
        $("#chkIsActive").prop('checked', false);
    },
    FillCmnSubRegOfficeFormDelete: function (obj) {
        $("#cmbCmnDivision").data("kendoComboBox").value(obj.DivisionId);
        LandHelper.ChangeEventOfDivisionCombo();
        $("#cmbCmnDistrict").data("kendoComboBox").value(obj.DistrictId);
        LandHelper.ChangeEventOfDistrictCombo();
        $("#cmbCmnUpozila").data("kendoComboBox").value(obj.UpozilaId);
        $("#hdnCmnSubRegOfficeId").val(obj.SubRegOfficeId);
        $("#txtCmnSubRegOfficeName").val(obj.SubRegOfficeName);
        $("#chkIsActive").prop('checked', false);
    }
}