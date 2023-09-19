
var StoreDetailsManager = {
    SaveStoreDetails: function () {
        var msg = "";
        var objStore = StoreDetailsHelper.CreateStoreObject();
        var jsonParam = JSON.stringify(objStore);
        var serviceUrl = _baseUrl + "/api/CmnStore/CreateUpdateCmnStore";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdStoreSummary").data("kendoGrid").dataSource.read();
                            StoreDetailsHelper.ClearForm();
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

var StoreDetailsHelper = {
    InitStoreDetails: function () {
        $("#btnSave").click(function () {
            StoreDetailsManager.SaveStoreDetails();
        });
        $("#btnClearAll").click(function () {
            StoreDetailsHelper.ClearForm();
        });
    },
    CreateStoreObject: function () {
        var obj = new Object();
        obj.StoreId = UtilityHelper.ZeroIfNullorEmpty($("#hdnStoreId").val());
        obj.StoreName = $("#txtStoreName").val().trim();
        obj.StoreShortName = $("#txtStoreShortName").val().trim();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnStoreId").val(0);
        $("#txtStoreName").val("");
        $("#txtStoreShortName").val("");
    },
    FillStoreForm: function (obj) {
        $("#hdnStoreId").val(UtilityHelper.ZeroIfNullorEmpty(obj.StoreId));
        $("#txtStoreName").val(obj.StoreName);
        $("#txtStoreShortName").val(obj.StoreShortName);
    },
};