var MerchItemDetailsManager = {
    SaveMerchItemDetails: function () {
        var msg = "";
        var objItem = MerchItemDetailsHelper.CreateMerchItemObject();
        var jsonParam = JSON.stringify(objItem);
        var serviceUrl = _baseUrl + "/api/MerchItems/CreateUpdateMerchItem";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdItemSummary").data("kendoGrid").dataSource.read();
                            MerchItemDetailsHelper.ClearForm();
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
    GetItemCategoryByGroupId: function (groupId) {
        var objCatg = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/MerchItemCategories/categories/" + groupId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objCatg = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objCatg;
    },

};
var MerchItemDetailsHelper = {
    InitMerchItemDetails: function () {
        MerchantHelper.LoadItemGroupCombo("cmbGroup");

        MerchItemDetailsHelper.LoadItemCategoryCombo("cmbCategory");

        $("#btnSave").click(function () {
            MerchItemDetailsManager.SaveMerchItemDetails();
        });

        $("#btnClearAll").click(function () {
            MerchItemDetailsHelper.ClearForm();
        });

        $("#cmbGroup").change(function () {
            MerchItemDetailsHelper.ChangeEventOfGroupCombo();
        });
    },
    FillMerchItemForm: function (obj) {
        $("#hdnItemId").val(obj.ItemId);
        $("#txtItemName").val(obj.ItemName);
        $("#cmbGroup").data("kendoComboBox").value(obj.ItemGroupId);
        var data = MerchItemDetailsManager.GetItemCategoryByGroupId(obj.ItemGroupId);
        var catgCombo = $("#cmbCategory").data("kendoComboBox");
        catgCombo.value("");
        catgCombo.text("");
        catgCombo.setDataSource(data);
        $("#cmbCategory").data("kendoComboBox").value(obj.ItemCategoryId);
        if (obj.IsActive == true) {
            $("#txtIsActive").prop('checked', true)
        } else {
            $("#txtIsActive").prop('checked', false)
        }
    },

    CreateMerchItemObject: function () {
        var obj = new Object();
        obj.ItemId = $("#hdnItemId").val();
        obj.ItemName = $("#txtItemName").val().trim();
        obj.ItemGroupId = $("#cmbGroup").data("kendoComboBox").value();
        obj.ItemCategoryId = $("#cmbCategory").data("kendoComboBox").value();
        obj.IsActive = $("#txtIsActive").is(":checked");
        // obj.IsActive = 1;
        return obj;
    },
    LoadItemCategoryCombo(cboId) {
        UtilityHelper.LoadCombo(cboId, "ItemCategoryId", "CategoryName", [], "--Select Category--");
    },

    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnItemId").val("00000000-0000-0000-0000-000000000000");
        $("#txtItemName").val("");
        $("#cmbGroup").data("kendoComboBox").value("");
        $("#cmbCategory").data("kendoComboBox").value("");
        $("#txtIsActive").prop('checked', false);
    },
    ChangeEventOfGroupCombo: function () {
        var groupId = $("#cmbGroup").data("kendoComboBox").value();
        var data = MerchItemDetailsManager.GetItemCategoryByGroupId(groupId);
        var catgCombo = $("#cmbCategory").data("kendoComboBox");
        catgCombo.value("");
        catgCombo.text("");
        catgCombo.setDataSource(data);
    }
};