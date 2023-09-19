var UserWiseStoreDetailsManager = {
    SaveUserWiseStorePermission: function () {
        var validator = $("#divUserDetails").kendoValidator().data("kendoValidator"),
            status = $(".status");
        if (validator.validate()) {
            debugger;
            var userObject = UserWiseStoreDetailsHelper.CreateUserObj();
            var jsonParam = JSON.stringify(userObject);
            var serviceUrl = _baseUrl + '/api/UserStorePermission/CreateOrUpdateUserWiseStore';
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
                            $("#gridStorePermission").data("kendoGrid").dataSource.read();
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
    }
};

var UserWiseStoreDetailsHelper = {
    InitUserWiseStoreDetails: function () {
        MerchantHelper.LoadStoreCombo("cmbStore");
        smsCommonHelper.GenerateUserBlankCombo("cmbUser");
        UserWiseStoreDetailsHelper.createTab();
        SystemCommonHelper.GenerateUserTypeCombo("cmbUserType");
        SystemCommonHelper.GenerateUserLevelCombo("cmbUserLevel");
        $("#btnSaveUser").click(function () {
            UserWiseStoreDetailsManager.SaveUserWiseStorePermission();
        });
        $("#btnClear").click(function () {
            UserWiseStoreDetailsHelper.ClearForm();
        });
        //$("#cmbStore").change(function () {
        //    debugger;
        //    UserWiseStoreDetailsHelper.ChangeEventStoreCombo();
        //});
    },
    createTab: function () {
        $("#tabstrip").kendoTabStrip({});
    },

    CreateUserObj: function () {
        var obj = new Object();
        obj.UserId = $("#hdnUserId").val();
        obj.AddUserWiseStore = UserWiseStoreDetailsHelper.SelectedStoreObj();
        obj.RemoveUserWiseStore = UserWiseStoreDetailsHelper.RemovedStoreObj();
        return obj;
    },
    SelectedStoreObj: function () {
        debugger;
        var selectedStoreList = [];
        for (var i = 0; i < gbSelectiveItemArray.length; i++) {
            var itm = gbSelectiveItemArray[i];
            if (itm.UserStoreId == 0) {
                var obj = new Object();
                obj.UserStoreId = 0;
                obj.UserId = $("#hdnUserId").val();
                obj.StoreId = itm.StoreId;
                selectedStoreList.push(obj);
            }
        }
        return selectedStoreList;
    },
    RemovedStoreObj: function () {
        debugger;
        var removedStoreList = [];
        for (var i = 0; i < gbRemovedItemArray.length; i++) {
            var itm = gbRemovedItemArray[i];
            if (itm.UserStoreId != 0) {
                var obj = new Object();
                obj.UserStoreId = itm.UserStoreId;
                obj.UserId = $("#hdnUserId").val();
                obj.StoreId = itm.StoreId;
                removedStoreList.push(obj);
            }
        }
        return removedStoreList;
    },
    ClearForm: function () {
        gbSelectiveMenuArray = [];
        gbRemovedMenuArray = [];
        gbSelectiveReportArray = [];
        gbRemovedReportArray = [];
        $("#gridStorePermission").data("kendoGrid").dataSource.read();
        $("#gridStorePermission tbody input:checkbox").removeAttr("checked", this.checked);
    },
    
    ChangeEventGroupCombo: function () {
        var groupId = $("#cmbItemGroup").data("kendoComboBox").value();
        var data = UserWiseStoreDetailsManager.GetItemCategoryByGroupId(groupId);
        var catgCombo = $("#cmbItemCategory").data("kendoComboBox");
        catgCombo.value("");
        catgCombo.text("");
        catgCombo.setDataSource(data);
    }
}