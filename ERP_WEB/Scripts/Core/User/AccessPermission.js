
var UserAccessPermissionManager = {
    SaveAccessPermission: function () {
        var accessObj = UserAccessPermissionHelper.CreateAccessPermissionObject();
        if (accessObj.MenuId > 0 && accessObj.UserId > 0) {
            var objAccess = JSON.stringify(accessObj);
            var jsonParam = 'objAccess:' + objAccess;
            var serviceUrl = "../Menu/SaveAccessPermission/";
            AjaxManager.SendJson2(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            var msg = "";
            if (accessObj.AccessPermissionId === "0") {
                msg = "Save Successfully";
            } else {
                msg = "Update Successfully";
            }
            if (jsonData.ReturnStatus === "Success") {
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#hdnAccessPermissionId").val(jsonData.AccessPermissionId);
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', jsonData,
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
};

var UserAccessPermissionHelper = {
    InitUserAccessPermission:function() {
        $("#divUserAccessPopup").kendoWindow({
            title: "Access Permission",
            resizeable: false,
            width: "40%",
            actions: ["Maximize", "Close"],
            modal: true,
            visible: false
        });

        $("#btnSaveAccessPermission").click(function () {
            UserAccessPermissionManager.SaveAccessPermission();
        });


    },

    FillAccessPermissionForm: function (objMenu) {
        var userAccess = HrmCommonManager.GetUserAccessPermissionByUser(objMenu.MenuPath, $("#hdnUserId").val());
        debugger;
        $("#lblMenuName").val(objMenu.MenuName);
        $("#hdnMenuId").val(objMenu.MenuId);
        if (userAccess.AccessPermissionId > 0) {
            $("#hdnAccessPermissionId").val(userAccess.AccessPermissionId);
            if (userAccess.CanInsert == 1) {
                $("#chkCanInsert").prop('checked', 'checked');
            } else {
                $("#chkCanInsert").removeAttr('checked', 'checked');
            }
            if (userAccess.CanEdit == 1) {
                $("#chkCanEdit").prop('checked', 'checked');
            } else {
                $("#chkCanEdit").removeAttr('checked', 'checked');
            }
            if (userAccess.CanDelete == 1) {
                $("#chkCanDelete").prop('checked', 'checked');
            } else {
                $("#chkCanDelete").removeAttr('checked', 'checked');
            }
            if (userAccess.CanView == 1) {
                $("#chkCanView").prop('checked', 'checked');
            } else {
                $("#chkCanView").removeAttr('checked', 'checked');
            }
        } else {
           
            $("#hdnAccessPermissionId").val("0");
            $("#chkCanInsert").removeAttr('checked', 'checked');
            $("#chkCanEdit").removeAttr('checked', 'checked');
            $("#chkCanDelete").removeAttr('checked', 'checked');
            $("#chkCanView").removeAttr('checked', 'checked');
        }

    },

    CreateAccessPermissionObject:function() {
        var obj = new Object();
        obj.AccessPermissionId = $("#hdnAccessPermissionId").val();
        obj.UserId = $("#hdnUserId").val();
        obj.MenuId = $("#hdnMenuId").val();
        obj.CanInsert = $("#chkCanInsert").is(":checked") == true ? 1 : 0;
        obj.CanEdit = $("#chkCanEdit").is(":checked") == true ? 1 : 0;
        obj.CanDelete = $("#chkCanDelete").is(":checked") == true ? 1 : 0;
        obj.CanView = $("#chkCanView").is(":checked") == true ? 1 : 0;
        return obj;

    }
};