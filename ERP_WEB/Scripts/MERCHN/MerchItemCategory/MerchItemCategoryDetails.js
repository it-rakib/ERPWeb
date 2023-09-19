var MerchItemCategoryDetailsManager = {
    SaveMerchItemCategoryDetails: function () {
        var msg = "";
        var objCategory = MerchItemCategoryDetailsHelper.CreateMerchItemCategoryObject();
        var jsonParam = JSON.stringify(objCategory);
        var serviceUrl = _baseUrl + "/api/MerchItemCategories/CreateUpdateMerchItemCategory";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdItemCategorySummary").data("kendoGrid").dataSource.read();
                            MerchItemCategoryDetailsHelper.ClearForm();
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

var MerchItemCategoryDetailsHelper = {
    InitMerchItemCategoryDetails: function () {
        MerchantHelper.LoadItemGroupCombo("cmbGroup");

        $("#btnSave").click(function () {
            MerchItemCategoryDetailsManager.SaveMerchItemCategoryDetails();
        });

        $("#btnClearAll").click(function () {
            MerchItemCategoryDetailsHelper.ClearForm();
        });
    },
    FillMerchItemCategoryForm: function (obj) {
        $("#hdnItemCategoryId").val(obj.ItemCategoryId);
        $("#txtCategoryName").val(obj.CategoryName);
        $("#cmbGroup").data("kendoComboBox").value(obj.ItemGroupId);
    },

    CreateMerchItemCategoryObject: function () {
        var obj = new Object();
        obj.ItemCategoryId = $("#hdnItemCategoryId").val();
        obj.CategoryName = $("#txtCategoryName").val().trim();
        obj.ItemGroupId = $("#cmbGroup").data("kendoComboBox").value();
        // obj.IsActive = 1;
        return obj;
    },


    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnItemCategoryId").val("00000000-0000-0000-0000-000000000000");
        $("#txtCategoryName").val("");
        $("#cmbGroup").data("kendoComboBox").value("");
    }
};