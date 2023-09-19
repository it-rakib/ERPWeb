var menuDetailsManager = {
    SaveMenuInformation: function () {
        if (menuDetailsHelper.validator()) {
            var objMenu = menuDetailsHelper.CreateMenuInformationForSaveData();
            var objMenuInfo = JSON.stringify(objMenu).replace(/&/g, "^").replace(/'/g, "\\'");
            var jsonParam = 'menu:' + objMenuInfo;
            var serviceUrl = "../Menu/SaveMenu/";
            AjaxManager.SendJson2(serviceUrl, jsonParam, onSuccess, onFailed);

        }
        function onSuccess(jsonData) {
            if (jsonData == "Success") {
                AjaxManager.MsgBox('success', 'center', 'Success:', 'Menu Saved Successfully',
                   [{
                       addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                           $noty.close();
                           $("#gridMenu").data("kendoGrid").dataSource.read();
                           $("#gridMenuSorting").data("kendoGrid").dataSource.read();
                       }
                   }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Failed', jsonData,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
            }
        }

        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Failed', error.statusText,
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
    },
    
    GetAllMenuByModuleId: function (moduleId) {
        var jsonParam = "moduleId=" + moduleId;
        var serviceUrl = "../Menu/GetMenuByModuleId/";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            var objmenuData = new Object();
            objmenuData = jsonData;
            $("#cmbParentMennu").kendoComboBox({
                placeholder: "Select Parent Menu...",
                dataTextField: "MenuName",
                dataValueField: "MenuId",
                dataSource: objmenuData,
                change: function () {

                    if (this.value() == this.text()) {
                        this.value('');

                    }  
                }
            });
        }
        function onFailed(jqXHR, textStatus, errorThrown) {
            window.alert(errorThrown);
        }
    },

};

var menuDetailsHelper = {
    InitMenuDetails:function() {
        SystemCommonHelper.GenerateProjectCombo("cmbProjectName");
        menuDetailsHelper.GenerateModuleCombo("cmbModuleName");
        $("#cmbProjectName").change(function () {
            menuDetailsHelper.ChangeEventProjectCombo("cmbProjectName", "cmbModuleName");
        });
        $("#cmbModuleName").change(function () {
            menuDetailsHelper.changeModuleName();
        });
        $("#btnSave").click(function () {
            menuDetailsManager.SaveMenuInformation();
        });
        $("#btnClearAll").click(function () {
            menuDetailsHelper.clearMenuForm();
        });
       
        $("#btnSaveSortOrder").click(function() {
             MenuSortingHelper.UpdateMenuSorting();
        });

    },
    
    validator: function () {
        var data = [];
        var validator = $("#menuDetailsDiv").kendoValidator().data("kendoValidator"),
            status = $(".status");
        if (validator.validate()) {
            
            var moduleId = $("#cmbModuleName").val();
            var comboboxforModule = $("#cmbModuleName").data("kendoComboBox");
            var moduleName = comboboxforModule.text();
            if (moduleId == moduleName) {
                status.text("Oops! Module Name is invalid.").addClass("invalid");
                $("#cmbModuleName").val("");
                return false;
            }

            //var chkspMnName = AjaxManager.checkSpecialCharacters("txtMenuName");
            //if(!chkspMnName) {
            //    status.text("Oops! There is invalid data in the form.").addClass("invalid");
            //    return false;
            //}
           

            status.text("").addClass("valid");
            return true;
        } else {
            status.text("Oops! There is invalid data in the form.").addClass("invalid");
            return false;
        }
    },
    
    clearMenuForm: function () {
        $("#hdMenuId").val("0");
        $("#hdSorOrder").val("0");
        $("#cmbModuleName").data('kendoComboBox').value("");
        $("#txtMenuName").val("");
        $("#txtMenuPath").val("");
        $('.chkBox').attr('checked', false);
        $("#cmbParentMennu").data("kendoComboBox").value("");
        $("#cmbProjectName").data('kendoComboBox').value("");
        $("#menuDetailsDiv > form").kendoValidator();
        $("#menuDetailsDiv").find("span.k-tooltip-validation").hide();
        var status = $(".status");

        status.text("").removeClass("invalid");

    },
    
    CreateMenuInformationForSaveData: function () {
        var objMenu = new Object();
        objMenu.MenuId = $("#hdMenuId").val();
        objMenu.MenuName = $("#txtMenuName").val();
        objMenu.ProjectId = $("#cmbProjectName").data('kendoComboBox').value();
        objMenu.ModuleId = $("#cmbModuleName").data('kendoComboBox').value();
        objMenu.MenuPath = $("#txtMenuPath").val();
        objMenu.ParentMenu = $("#cmbParentMennu").data('kendoComboBox').value();
        if ($("#chkIsQuickLink").is(':checked') == true) {
            objMenu.ToDo = 1;
        }
        else {
            objMenu.ToDo = 0;
        }
        objMenu.SortOrder = $("#hdSorOrder").val();
        return objMenu;
    },
    
    FillMenuDetailsInForm: function (objMenu) {
        menuDetailsHelper.clearMenuForm();
        $('#hdMenuId').val(objMenu.MenuId);
        $('#hdSorOrder').val(objMenu.SortOrder);
        $("#txtMenuName").val(objMenu.MenuName);
        $("#cmbProjectName").data("kendoComboBox").value(objMenu.ProjectId);
        menuDetailsHelper.ChangeEventProjectCombo("cmbProjectName", "cmbModuleName");
        var cmbModule = $("#cmbModuleName").data("kendoComboBox");
        if (objMenu.ModuleId != 0) {
            cmbModule.value(objMenu.ModuleId);
            menuDetailsManager.GetAllMenuByModuleId(objMenu.ModuleId);
        }
        $("#txtMenuPath").val(objMenu.MenuPath);
        $("#cmbParentMennu").data("kendoComboBox").value(objMenu.ParentMenu == "0" ? "" : objMenu.ParentMenu);
        
        if (objMenu.ToDo == 1) {
            $("#chkIsQuickLink").prop("checked", true);
        }
        else {
            $("#chkIsQuickLink").attr("checked", false);
        }

    },
    
    changeModuleName: function () {
        var moduleId = $("#cmbModuleName").val();
        var comboboxforModule = $("#cmbModuleName").data("kendoComboBox");
        var moduleName = comboboxforModule.text();
        if (moduleId == moduleName) {
            return false;
        }
        var combobox = $("#cmbParentMennu").data("kendoComboBox");
        combobox.value("");
        combobox.destroy();
        menuDetailsManager.GetAllMenuByModuleId(moduleId);
    },

    GenerateModuleCombo: function (identity) {
        var module = []; // UserDetailsManager.GetAllModule();
        var obj = new Object();
        obj.ModuleName = "---Select Module--";
        obj.ModuleId = 0;
        module.unshift(obj);
        $("#" + identity).kendoComboBox({
            placeholder: "Select Module...",
            dataTextField: "ModuleName",
            dataValueField: "ModuleId",
            dataSource: module,
            index: 0,
            suggest: true,
            filter: "contains"
        });
    },

    ChangeEventProjectCombo: function (projectComboname,moduleComboname) {
        var projectId = $("#" + projectComboname).data("kendoComboBox").value();
        var moduleCombo = $("#" + moduleComboname).data("kendoComboBox");
        var moduleData = menuDetailsManager.GetAllModule(projectId);
        moduleCombo.value("");
        moduleCombo.text("");
        var obj = new Object();
        obj.ModuleName = "---Select Module ---";
        obj.ModuleId = 0;
        moduleData.unshift(obj);
        moduleCombo.setDataSource(moduleData);

    }
};
