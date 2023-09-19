
var CmnDistrictDetailsManager = {
    SaveCmnDistrictDetails: function () {
        var msg = "";
        var objCmnDistrict = CmnDistrictDetailsHelper.CreateCmnDistrictObject();
        var jsonParam = JSON.stringify(objCmnDistrict);
        var serviceUrl = _baseUrlLand + "/api/CmnDistrict/CreateUpdateCmnDistrict";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdCmnDistrictSummary").data("kendoGrid").dataSource.read();
                            CmnDistrictDetailsHelper.ClearForm();
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

var CmnDistrictDetailsHelper = {
    InitCmnDistrictDetails: function () {
        LandHelper.LoadCmnDivisionCombo("cmbCmnDivision");
        $("#btnSave").click(function () {
            CmnDistrictDetailsManager.SaveCmnDistrictDetails();
        });
        $("#btnClearAll").click(function () {
            CmnDistrictDetailsHelper.ClearForm();
        });
    },
    CreateCmnDistrictObject: function () {
        var obj = new Object();
        obj.DistrictId = $("#hdnCmnDistrictId").val();
        obj.DistrictName = $("#txtCmnDistrictName").val();
        obj.DivisionId = $("#cmbCmnDivision").data("kendoComboBox").value();
        return obj;
    },
    FillCmnDistrictForm: function (obj) {
        $("#hdnCmnDistrictId").val(obj.DistrictId);
        $("#txtCmnDistrictName").val(obj.DistrictName);
        $("#cmbCmnDivision").data("kendoComboBox").value(obj.DivisionId);
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnCmnDistrictId").val("00000000-0000-0000-0000-000000000000");
        $("#txtCmnDistrictName").val("");
        $("#cmbCmnDivision").data("kendoComboBox").value("");
    }
}