var UserWiseItemDetailsManager = {
    SaveUserWiseItemPermission: function () {
        var validator = $("#divUserDetails").kendoValidator().data("kendoValidator"),
         status = $(".status");
        if (validator.validate()) {
            var userObject = UserWiseItemDetailsHelper.CreateUserObj();
            var jsonParam = JSON.stringify(userObject);
            var serviceUrl = _baseUrl + '/api/UserWiseItem/CreateOrUpdateUserWiseItem';
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
                            $("#gridItemPermission").data("kendoGrid").dataSource.read();
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

var UserWiseItemDetailsHelper = {
    InitUserWiseItemDetails: function () {
        MerchantHelper.LoadItemGroupCombo("cmbItemGroup");
        UserWiseItemDetailsHelper.LoadItemCategoryCombo("cmbItemCategory");
        smsCommonHelper.GenerateUserBlankCombo("cmbUser");
        UserWiseItemDetailsHelper.createTab();
        SystemCommonHelper.GenerateUserTypeCombo("cmbUserType");
        SystemCommonHelper.GenerateUserLevelCombo("cmbUserLevel");
        $("#btnSaveUser").click(function () {
            UserWiseItemDetailsManager.SaveUserWiseItemPermission();
        });
        $("#btnClear").click(function () {
            UserWiseItemDetailsHelper.ClearForm();
        });
        $("#cmbItemGroup").change(function () {
            UserWiseItemDetailsHelper.ChangeEventGroupCombo();
        });
        $("#cmbItemCategory").change(function () {
            debugger;
            UserWiseItemDetailsHelper.ChangeEventCategoryCombo();
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
        obj.UserId = $("#hdnUserId").val();
        obj.AddUserWiseItems = UserWiseItemDetailsHelper.SelectedItemObj();
        obj.RemoveUserWiseItems = UserWiseItemDetailsHelper.RemovedItemObj();
        return obj;
    },
    SelectedItemObj: function () {
        var selectedItmList = [];
        for (var i = 0; i < gbSelectiveItemArray.length; i++) {
            var itm = gbSelectiveItemArray[i];
            if (itm.UserWiseItemId == AjaxManager.DefaultGuidId()) {
                var obj = new Object();
                obj.UserWiseItemId = AjaxManager.DefaultGuidId();
                obj.UserId = $("#hdnUserId").val();
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
            if (itm.UserWiseItemId != AjaxManager.DefaultGuidId()) {
                var obj = new Object();
                obj.UserWiseItemId = itm.UserWiseItemId;
                obj.UserId = $("#hdnUserId").val();
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
        $("#gridItemPermission").data("kendoGrid").dataSource.read();
        $("#gridItemPermission tbody input:checkbox").removeAttr("checked", this.checked);
    },
    
    ChangeEventGroupCombo: function () {
        var groupId = $("#cmbItemGroup").data("kendoComboBox").value();
        var data = UserWiseItemDetailsManager.GetItemCategoryByGroupId(groupId);
        var catgCombo = $("#cmbItemCategory").data("kendoComboBox");
        catgCombo.value("");
        catgCombo.text("");
        catgCombo.setDataSource(data);
    },
    ChangeEventCategoryCombo: function () {
        debugger;
        var categoryId = $("#cmbItemCategory").data("kendoComboBox").value();
        var entityGrid = $("#grdUserSummary").data("kendoGrid");
        var selectedItem = entityGrid.dataItem(entityGrid.select());
        if (selectedItem != null) {
            var groupId = $("#cmbItemGroup").data("kendoComboBox").value();
            categoryId = categoryId === "" ? "" : categoryId;
            if (groupId != "") {
                var data = UserItemPermissionSummaryManager.gridDataSource(selectedItem.USERID,groupId, categoryId);
                $("#gridItemPermission").data("kendoGrid").setDataSource(data);
            } else {
                $("#gridItemPermission").data("kendoGrid").setDataSource([]);
            }
        }
    }
}