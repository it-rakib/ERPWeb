
var UserDetailsManager = {
    SaveUserPermission: function () {
        var validator = $("#divUserDetails").kendoValidator().data("kendoValidator"),
         status = $(".status");

        if (validator.validate()) {
            var userObject = UserDetailsHelper.CreateUserObj();
            var usrObj = JSON.stringify(userObject);
            var objUserMenuList = JSON.stringify(gbSelectiveMenuArray);
            var objRemovedMenuList = JSON.stringify(gbRemovedMenuArray);
            var objUserReportList = JSON.stringify(gbSelectiveReportArray);
            var objRemovedReportList = JSON.stringify(gbRemovedReportArray);
            var jsonParam = 'usrObj:' + usrObj + ',objUserMenuList:' + objUserMenuList + ',objRemovedMenuList:' + objRemovedMenuList + ',objUserReportList:' + objUserReportList + ',objRemovedReportList:' + objRemovedReportList;
            var serviceUrl = "../User/SaveUserPermission/";
            AjaxManager.SendJson2(serviceUrl, jsonParam, onSuccess, onFailed);
        } else {
            var tabToActivate = $("#tab1");
            $("#tabstrip").kendoTabStrip().data("kendoTabStrip").activateTab(tabToActivate);
        }

        function onSuccess(jsonData) {
            if (jsonData == "Success") {
                var conversationId = $("#hdnUserId").val();
                var message = "";
                if (conversationId == "0") {
                    message = "Saved Successfully";
                } else {
                    message = "Updated Successfully";
                }
                AjaxManager.MsgBox('success', 'center', 'Success:', message,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            gbSelectiveMenuArray = [];
                            gbRemovedMenuArray = [];
                            gbSelectiveReportArray = [];
                            gbRemovedReportArray = [];

                            $("#gridMenuPermission").data("kendoGrid").dataSource.read();
                            var usergrid=$("#grdUserSummary").data("kendoGrid");
                            $("#gridMenuPermission thead input:checkbox").prop("checked", false);

                            //grid row selected
                            var models = usergrid.dataSource.data();
                            var model = models[models.length - 1];
                            var lastRowUid = model.uid;
                            var row = usergrid.table.find("[data-uid=" + lastRowUid + "]");
                            usergrid.select(row);

                            $("#gridReportPermission").data("kendoGrid").dataSource.read();

                        }
                    }]);
            }
            else if (jsonData === "Exists") {
                AjaxManager.MsgBox('warning', 'center', 'Already Exists:', 'Already Exist !',
                      [{
                          addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                              $noty.close();
                          }
                      }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error', jsonData,
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

    GetAllModule: function (projectId) {
        var objModule = "";
        var jsonParam = "";
        var serviceUrl = "../Module/SelectModule/?projectId=" + projectId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objModule = jsonData;
        }
        function onFailed(jqXHR, textStatus, errorThrown) {
            window.alert(errorThrown);
        }
        return objModule;
    }
};

var UserDetailsHelper = {
    InitUserDetails: function () {
        smsCommonHelper.GenerateUserBlankCombo("cmbUser");
        UserDetailsHelper.createTab();
        UserDetailsHelper.GenerateModuleCombo();
        SystemCommonHelper.GenerateUserTypeCombo("cmbUserType");
        SystemCommonHelper.GenerateUserLevelCombo("cmbUserLevel");
        $("#btnSaveUser").click(function () {
            UserDetailsManager.SaveUserPermission();
        });
        $("#btnClear").click(function () {
            UserDetailsHelper.ClearForm();
        });

        UserAccessPermissionHelper.InitUserAccessPermission();

        UserDetailsHelper.GenerateMenuCombo();

        $("#cmbProjectName").change(function() {
            UserDetailsHelper.ChangeEventProjectCombo();
        });

        $("#cmbModuleName").change(function () {
            UserDetailsHelper.ChangeEventModuleCombo();
        });
    },

    createTab: function () {
        $("#tabstrip").kendoTabStrip({});
    },

    CreateUserObj: function () {
        var obj = new Object();
        obj.UserId = $("#hdnUserId").val();
        obj.EmpId = $("#txtUserId").val();
        obj.UserName = $("#txtUserName").val();
        obj.UsrPass = $("#txtNewPassword").val();
        obj.UsrDesig = $("#txtDesig").val();
        obj.UserType = $("#cmbUserType").data("kendoComboBox").value();
        obj.UserLevel = $("#cmbUserLevel").data("kendoComboBox").value();
        return obj;
    },
    ClearForm: function () {
        gbSelectiveMenuArray = [];
        gbRemovedMenuArray = [];
        gbSelectiveReportArray = [];
        gbRemovedReportArray = [];
        $("#hdnUserId").val("0");
        $("#txtUserId").val("");
        $("#txtUserName").val("");
        $("#txtDesig").val("");
        $("#txtNewPassword").val("");
        $("#cmbUserType").data("kendoComboBox").value("");
        $("#cmbUserLevel").data("kendoComboBox").value("");
        $("#gridMenuPermission").data("kendoGrid").dataSource.read();
        $("#gridMenuPermission tbody input:checkbox").removeAttr("checked", this.checked);
        $("#divUserDetails > form").kendoValidator();
        $("#divUserDetails").find("span.k-tooltip-validation").hide();
        var status = $(".status");
        status.text("").removeClass("invalid");
    },
    GenerateModuleCombo: function () {
        var module = []; // UserDetailsManager.GetAllModule();
        var obj = new Object();
        obj.ModuleName = "All";
        obj.ModuleId = 0;
        module.unshift(obj);
        $("#cmbModuleName").kendoComboBox({
            placeholder: "Select Module...",
            dataTextField: "ModuleName",
            dataValueField: "ModuleId",
            dataSource: module,
            index: 0,
            suggest: true,
            filter: "contains",
            change: function () {
                var value = this.value();
                    var entityGrid = $("#grdUserSummary").data("kendoGrid");
                    var selectedItem = entityGrid.dataItem(entityGrid.select());
                    if (selectedItem != null) {
                        var projectId = $("#cmbProjectName").data("kendoComboBox").value();
                        if (projectId > 0) {
                            var data = menuPermissionSummaryManager.gridDataSource(selectedItem.USERID, projectId, parseInt(value));
                            $("#gridMenuPermission").data("kendoGrid").setDataSource(data);
                        } else {
                            $("#gridMenuPermission").data("kendoGrid").setDataSource([]);
                        }
                     
                    }
            }
        });
    },
    GenerateMenuCombo: function () {
        var menuList = [
            { MenuId: 1101, MenuName: "Employee Attendance Report" },
            { MenuId: 2107, MenuName: "Payroll Report" }
        ];
        var obj = new Object();
        obj.MenuName = "All";
        obj.MenuId = 0;
        menuList.unshift(obj);
        $("#cmbMenuName").kendoComboBox({
            placeholder: "Select Menu...",
            dataTextField: "MenuName",
            dataValueField: "MenuId",
            dataSource: menuList,
            index: 0,
            suggest: true,
            filter: "contains"
        });
    },
    ChangeEventProjectCombo:function() {
        var projectId = $("#cmbProjectName").data("kendoComboBox").value();
        var moduleCombo = $("#cmbModuleName").data("kendoComboBox");
        var moduleData = UserDetailsManager.GetAllModule(projectId);
        moduleCombo.value("");
        moduleCombo.text("");
        
        $("#gridMenuPermission").data("kendoGrid").dataSource.data([]);

        var obj = new Object();
        obj.ModuleName = "All";
        obj.ModuleId = 0;
        moduleData.unshift(obj);
        moduleCombo.setDataSource(moduleData);

        UserDetailsHelper.ChangeEventModuleCombo();
    },
    ChangeEventModuleCombo: function () {
        var moduleId = $("#cmbModuleName").data("kendoComboBox").value();
        var entityGrid = $("#grdUserSummary").data("kendoGrid");
        var selectedItem = entityGrid.dataItem(entityGrid.select());
        if (selectedItem != null) {
            var projectId = $("#cmbProjectName").data("kendoComboBox").value();
            moduleId = moduleId === "" ? "0" : moduleId;
            if (projectId > 0 ) {
                var data = menuPermissionSummaryManager.gridDataSource(selectedItem.USERID, projectId, moduleId);
                $("#gridMenuPermission").data("kendoGrid").setDataSource(data);
            } else {
                $("#gridMenuPermission").data("kendoGrid").setDataSource([]);
            }
        }
    }
}