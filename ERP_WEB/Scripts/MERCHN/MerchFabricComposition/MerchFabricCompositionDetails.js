var MerchFabricCompositionDetailsManager = {
    SaveMerchFabricCompositionDetails: function () {
        var msg = "";
        var objFabricComposition = MerchFabricCompositionDetailsHelper.CreateFabricCompositionObject();
        var jsonParam = JSON.stringify(objFabricComposition);
        var serviceUrl = _baseUrl + "/api/MerchFabricComposition/CreateUpdateMerchFabricComposition";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdFabricCompositionSummary").data("kendoGrid").dataSource.read();
                            MerchFabricCompositionDetailsHelper.ClearForm();
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

};
var MerchFabricCompositionDetailsHelper = {
    InitMerchFabricCompositionDetails: function () {
        MerchantHelper.LoadFabricTypeCombo("cmbFabricType");

        $("#btnSave").click(function () {
            MerchFabricCompositionDetailsManager.SaveMerchFabricCompositionDetails();
        });

        $("#btnClearAll").click(function () {
            MerchFabricCompositionDetailsHelper.ClearForm();
        });
    },
    FillFabricCompositionForm: function (obj) {
        $("#hdnFabricCompositionId").val(obj.FabricCompositionId);
        $("#txtCompositionName").val(obj.CompositionName);
        $("#cmbFabricType").data("kendoComboBox").value(obj.FabricTypeId);
        //if (obj.IsActive == true) {
        //    $("#chkIsActive").prop('checked', true)
        //} else {
        //    $("#chkIsActive").prop('checked', false)
        //};
    },
    CreateFabricCompositionObject: function () {
        var obj = new Object();
        obj.FabricCompositionId = $("#hdnFabricCompositionId").val();
        obj.CompositionName = $("#txtCompositionName").val().trim();
        obj.FabricTypeId = $("#cmbFabricType").data("kendoComboBox").value();
        debugger;
        obj.AddedBy = CurrentUser.USERID;
        return obj;
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnFabricCompositionId").val("00000000-0000-0000-0000-000000000000");
        $("#txtCompositionName").val("");
        $("#cmbFabricType").data("kendoComboBox").value("");
    }
};