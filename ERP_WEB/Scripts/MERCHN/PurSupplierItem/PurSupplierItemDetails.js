PurSupplierItemDetailsManager = {
    SavePurSupplierItemPermission: function () {
        var validator = $("#divSupplierDetails").kendoValidator().data("kendoValidator"),
            status = $(".status");
        if (validator.validate()) {
            debugger;
            var supplierObject = PurSupplierItemDetailsHelper.CreateUserObj();
            var jsonParam = JSON.stringify(supplierObject);
            var serviceUrl = _baseUrl + '/api/Suppliers/CreateOrUpdateSupplierItem';
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success:', jsonData.Message,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            gbSelectiveMenuArray = [];
                            gbRemovedMenuArray = [];
                            $("#gridSupplierPermission").data("kendoGrid").dataSource.read();
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error', jsonData.Message,
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
    }
};
var PurSupplierItemDetailsHelper = {
    InitPurSupplierItemDetails: function () {
            MerchantHelper.LoadItemGroupCombo("cmbItemGroup");
        PurSupplierItemDetailsHelper.LoadItemCategoryCombo("cmbItemCategory");
        PurSupplierItemDetailsHelper.createTab();
            SystemCommonHelper.GenerateUserTypeCombo("cmbUserType");
            SystemCommonHelper.GenerateUserLevelCombo("cmbUserLevel");
            $("#btnSaveUser").click(function () {
                PurSupplierItemDetailsManager.SavePurSupplierItemPermission();
            });
            $("#btnClear").click(function () {
                PurSupplierItemDetailsHelper.ClearForm();
            });
            $("#cmbItemGroup").change(function () {
                PurSupplierItemDetailsHelper.ChangeEventGroupCombo();
            });
            $("#cmbItemCategory").change(function () {
                PurSupplierItemDetailsHelper.ChangeEventCategoryCombo();
            });
        
    },
    LoadItemCategoryCombo(cboId) {
        UtilityHelper.LoadCombo(cboId, "ItemCategoryId", "CategoryName", [], "--Select Category--");
    },
    createTab: function () {
        $("#tabstrip").kendoTabStrip({});
    },
    CreateUserObj: function () {
        var obj = new Object();
        obj.UserId = CurrentUser.USERID;
        obj.SupplierId = $("#hdnSupplierId").val();
        obj.AddPurSupplierItems = PurSupplierItemDetailsHelper.SelectedItemObj();
        obj.RemovePurSupplierItems = PurSupplierItemDetailsHelper.RemovedItemObj();
        return obj;
    },
    SelectedItemObj: function () {
        var selectedItmList = [];
        for (var i = 0; i < gbSelectiveItemArray.length; i++) {
            var itm = gbSelectiveItemArray[i];
            if (itm.SupplierItemId == AjaxManager.DefaultGuidId()) {
                var obj = new Object();
                obj.SupplierItemId = AjaxManager.DefaultGuidId();
                obj.SupplierId = $("#hdnSupplierId").val();
                obj.ItemId = itm.ItemId;
                obj.ItemGroupId = itm.ItemGroupId;
                selectedItmList.push(obj);
            }
        }
        return selectedItmList;
    },
    RemovedItemObj: function () {
        var removedItmList = [];
        for (var i = 0; i < gbRemovedItemArray.length; i++) {
            var itm = gbRemovedItemArray[i];
            if (itm.SupplierItemId != AjaxManager.DefaultGuidId()) {
                var obj = new Object();
                obj.SupplierItemId = itm.SupplierItemId;
                obj.SupplierId = $("#hdnSupplierId").val();
                obj.ItemId = itm.ItemId;
                obj.ItemGroupId = itm.ItemGroupId;
                removedItmList.push(obj);
            }
        }
        return removedItmList;
    },
    ClearForm: function () {
        gbSelectiveMenuArray = [];
        gbRemovedMenuArray = [];
        gbSelectiveReportArray = [];
        gbRemovedReportArray = [];
        $("#cmbItemGroup").data("kendoComboBox").value("");
        $("#cmbItemCategory").data("kendoComboBox").value("");
        $("#gridSupplierPermission").data("kendoGrid").dataSource.read();
        $("#gridSupplierPermission tbody input:checkbox").removeAttr("checked", this.checked);
    },
    ChangeEventGroupCombo: function () {
        var groupId = $("#cmbItemGroup").data("kendoComboBox").value();
        var data = PurSupplierItemDetailsManager.GetItemCategoryByGroupId(groupId);
        var catgCombo = $("#cmbItemCategory").data("kendoComboBox");
        catgCombo.value("");
        catgCombo.text("");
        catgCombo.setDataSource(data);
    },
    ChangeEventCategoryCombo: function () {
        var categoryId = $("#cmbItemCategory").data("kendoComboBox").value();
        var entityGrid = $("#grdSupplierSummary").data("kendoGrid");
        var selectedItem = entityGrid.dataItem(entityGrid.select());
        if (selectedItem != null) {
            var groupId = $("#cmbItemGroup").data("kendoComboBox").value();
            categoryId = categoryId === "" ? "" : categoryId;
            if (groupId != "") {
                var data = PurSupplierItemPermissionSummaryManager.gridDataSource(selectedItem.SupplierId, groupId, categoryId);
                $("#gridSupplierPermission").data("kendoGrid").setDataSource(data);
            } else {
                $("#gridSupplierPermission").data("kendoGrid").setDataSource([]);
            }
        }
    }
}