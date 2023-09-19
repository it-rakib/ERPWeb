
var CmnUpozilaDetailsManager = {
    SaveCmnUpozilaDetails: function () {
        var msg = "";
        var objCmnUpozila = CmnUpozilaDetailsHelper.CreateCmnUpozilaObject();
        var jsonParam = JSON.stringify(objCmnUpozila);
        var serviceUrl = _baseUrlLand + "/api/CmnUpozila/CreateUpdateCmnUpozila";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdCmnUpozilaSummary").data("kendoGrid").dataSource.read();
                            CmnUpozilaDetailsHelper.ClearForm();
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

var CmnUpozilaDetailsHelper = {
    InitCmnUpozilaDetails: function () {
        LandHelper.LoadCmnDivisionCombo("cmbCmnDivision");
        LandHelper.LoadCmnDistrictCombo("cmbCmnDistrict");
        $("#btnSave").click(function () {
            CmnUpozilaDetailsManager.SaveCmnUpozilaDetails();
        });

        $("#btnClearAll").click(function () {
            CmnUpozilaDetailsHelper.ClearForm();
        });
        $("#cmbCmnDivision").change(function () {
            LandHelper.ChangeEventOfDivisionCombo();
        });
    },
    CreateCmnUpozilaObject: function () {
        var obj = new Object();
        obj.DistrictId = $("#cmbCmnDistrict").data("kendoComboBox").value();
        obj.UpozilaId = $("#hdnCmnUpozilaId").val();
        obj.UpozilaName = $("#txtCmnUpozilaName").val();
        return obj;
    },
    FillCmnUpozilaForm: function (obj) {
        $("#cmbCmnDivision").data("kendoComboBox").value(obj.DivisionId);
        LandHelper.ChangeEventOfDivisionCombo();
        $("#cmbCmnDistrict").data("kendoComboBox").value(obj.DistrictId);
        $("#hdnCmnUpozilaId").val(obj.UpozilaId);
        $("#txtCmnUpozilaName").val(obj.UpozilaName);
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#cmbCmnDivision").data("kendoComboBox").value("");
        $("#cmbCmnDistrict").data("kendoComboBox").value("");
        $("#hdnCmnUpozilaId").val("00000000-0000-0000-0000-000000000000");
        $("#txtCmnUpozilaName").val("");
    }
}