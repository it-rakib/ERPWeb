var validationSuccess = $("#validation-success");
var ItemGroupDetailsManager = {
    SaveItemGroupDetails: function () {
        var msg = "";
        var objItemGroup = ItemGroupDetailsHelper.CreateItemGroupObject();
        var jsonParam = JSON.stringify(objItemGroup);
        var serviceUrl = _baseUrl + "/api/MerchItemGroups/CreateUpdateMerchItemGroup";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdItemGroupSummary").data("kendoGrid").dataSource.read();
                            ItemGroupDetailsHelper.ClearForm();
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
var ItemGroupDetailsHelper = {
    InitItemGroupDetails: function () {

        $("#btnSave").click(function () {
            ItemGroupDetailsManager.SaveItemGroupDetails();
        });

        $("#btnClearAll").click(function () {
            ItemGroupDetailsHelper.ClearForm();
        });
    },
    FillItemGroupForm: function (obj) {
        $("#hdnItemGroupId").val(obj.ItemGroupId);
        $("#txtItemGroupName").val(obj.GroupName);
        if (obj.IsDirectBooking == true) {
            $("#txtIsDirectBooking").prop('checked', true)
        } else {
            $("#txtIsDirectBooking").prop('checked', false)
        }
    },

    CreateItemGroupObject: function (itemGroupObj) {
        var obj = new Object();
        obj.ItemGroupId = $("#hdnItemGroupId").val();
        obj.GroupName = $("#txtItemGroupName").val().trim();
        obj.IsDirectBooking = $("#txtIsDirectBooking").is(":checked");
        
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnItemGroupId").val("00000000-0000-0000-0000-000000000000");
        $("#txtItemGroupName").val("");
        $("#txtIsDirectBooking").prop('checked', false);
    }
};