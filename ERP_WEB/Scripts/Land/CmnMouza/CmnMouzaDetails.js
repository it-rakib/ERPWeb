
var CmnMouzaDetailsManager = {
    SaveCmnMouzaDetails: function () {
        var msg = "";
        var objCmnMouza = CmnMouzaDetailsHelper.CreateCmnMouzaObject();
        var jsonParam = JSON.stringify(objCmnMouza);
        var serviceUrl = _baseUrlLand + "/api/CmnMouza/CreateUpdateCmnMouza";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdCmnMouzaSummary").data("kendoGrid").dataSource.read();
                            CmnMouzaDetailsHelper.ClearForm();
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

var CmnMouzaDetailsHelper = {
    InitCmnMouzaDetails: function () {
        LandHelper.LoadCmnDivisionCombo("cmbCmnDivision");
        LandHelper.LoadCmnDistrictCombo("cmbCmnDistrict");
        LandHelper.LoadCmnUpozilaCombo("cmbCmnUpozila");
        $("#btnSave").click(function () {
            CmnMouzaDetailsManager.SaveCmnMouzaDetails();
        });
        $("#btnClearAll").click(function () {
            CmnMouzaDetailsHelper.ClearForm();
        });
        $("#cmbCmnDivision").change(function () {
            LandHelper.ChangeEventOfDivisionCombo();
        });
        $("#cmbCmnDistrict").change(function () {
            LandHelper.ChangeEventOfDistrictCombo();
        });
    },
    CreateCmnMouzaObject: function () {
        var obj = new Object();
        obj.MouzaId = $("#hdnCmnMouzaId").val();
        obj.MouzaName = $("#txtCmnMouzaName").val();
        obj.UpozilaId = $("#cmbCmnUpozila").data("kendoComboBox").value();
        return obj;
    },
    FillCmnMouzaForm: function (obj) {
        $("#cmbCmnDivision").data("kendoComboBox").value(obj.DivisionId);
        LandHelper.ChangeEventOfDivisionCombo();
        $("#cmbCmnDistrict").data("kendoComboBox").value(obj.DistrictId);
        LandHelper.ChangeEventOfDistrictCombo();
        $("#cmbCmnUpozila").data("kendoComboBox").value(obj.UpozilaId);
        $("#hdnCmnMouzaId").val(obj.MouzaId);
        $("#txtCmnMouzaName").val(obj.MouzaName);
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#cmbCmnDivision").data("kendoComboBox").value("");
        $("#cmbCmnDistrict").data("kendoComboBox").value("");
        $("#cmbCmnUpozila").data("kendoComboBox").value("");
        $("#hdnCmnMouzaId").val("00000000-0000-0000-0000-000000000000");
        $("#txtCmnMouzaName").val("");
    }
};