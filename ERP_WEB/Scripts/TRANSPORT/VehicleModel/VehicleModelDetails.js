var isDelete = false;
var ModelDetailsManager = {
    SaveModelDetails: function () {
        var msg = "";
        var objModel= ModelDetailsHelper.CreateModelObject();
        var jsonParam = JSON.stringify(objModel);
        var serviceUrl = _baseUrlTransport + "/api/VehicleModel/CreateUpdateVehicleModel";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdModelSummary").data("kendoGrid").dataSource.read();
                            ModelDetailsHelper.ClearForm();
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
    GetBrands() {
        //var brandId = 0;
        var list = ApiManager.GetList(_baseUrlTransport + "/api/VehicleBrand/all");
        return list == null ? [] : list;
    },

};
var ModelDetailsHelper = {
    InitModelDetails: function () {
        ModelDetailsHelper.LoadBrandCombo("cmbBrand");

        $("#btnSave").click(function () {
            ModelDetailsManager.SaveModelDetails();
        });

        $("#btnClearAll").click(function () {
            ModelDetailsHelper.ClearForm();
        });
    },
    FillModelForm: function (obj) {
        $("#hdnModelId").val(obj.ModelId);
        $("#txtModelName").val(obj.ModelName);
        $("#cmbBrand").data("kendoComboBox").value(obj.VehicleBrandId);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }
    },

    CreateModelObject: function () {
        var obj = new Object();
        obj.ModelId = $("#hdnModelId").val();
        obj.ModelName = $("#txtModelName").val().trim();
        obj.VehicleBrandId = $("#cmbBrand").data("kendoComboBox").value();
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        return obj;
    },


    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnModelId").val("0");
        $("#txtModelName").val("");
        $("#cmbBrand").data("kendoComboBox").value("");
    },
    LoadBrandCombo(cboId) {
        ModelDetailsHelper.LoadCombo(cboId, "VehicleBrandId", "VehicleBrandName", ModelDetailsManager.GetBrands(), "--Select Brand--");
    },
    LoadCombo(cboId, valueField, textField, dataList, placeholder) {
        if (cboId.trim() == "" || valueField.trim() == "" || textField.trim() == "") return null;
        dataList = dataList == "" ? [] : dataList;
        var obj = new Object();
        obj[valueField] = AjaxManager.DefaultGuidId();
        obj[textField] = "---Select---";
        dataList.unshift(obj);
        $("#" + cboId).kendoComboBox({
            placeholder: placeholder,
            dataValueField: valueField,
            dataTextField: textField,
            dataSource: dataList,
            //index: 0,
            suggest: true,
            filter: "contains"
            //change: function () {

            //}
        });
    },
};