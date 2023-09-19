
var menuSummaryManager = {
    gridDataSource: function (projId, moduleId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: '../Menu/GetMenuSummary?projId=' + projId + "&moduleId=" + moduleId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                update: {
                    url: '../Menu/GetMenuSummary/',
                    dataType: "json"
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            schema: { data: "Items", total: "TotalCount" }
        });
        return gridDataSource;
    }
};


var menuSummaryHelper = {
    InitMenuSummary:function() {
        SystemCommonHelper.GenerateProjectCombo("cmbProjectName1");
        SystemCommonHelper.GenerateProjectCombo("cmbProjectName2");
        menuDetailsHelper.GenerateModuleCombo("cmbModuleName1");
        menuDetailsHelper.GenerateModuleCombo("cmbModuleName2");
        menuSummaryHelper.GenerateMenuGrid();
        menuSummaryHelper.LoadMenuGrid();


        $("#cmbProjectName1").change(function () {
            menuDetailsHelper.ChangeEventProjectCombo("cmbProjectName1", "cmbModuleName1");
            menuSummaryHelper.LoadMenuGrid();
        });
        $("#cmbProjectName2").change(function () {
            menuDetailsHelper.ChangeEventProjectCombo("cmbProjectName2", "cmbModuleName2");
           
        });
        $("#cmbModuleName1").change(function () {
            menuSummaryHelper.LoadMenuGrid();
        });
    },
    GenerateMenuGrid: function () {
        $("#gridMenu").kendoGrid({
            dataSource:[],// menuSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: menuSummaryHelper.GenerateMenuColumns(),
            editable: false,
            //editable: "inline",
            navigatable: true,
            selectable: "row",
            dataBound: function () {
                var dataView = this.dataSource.view();
                for (var i = 0; i < dataView.length; i++) {
                    var uid = dataView[i].uid;
                    if (dataView[i].ParentMenu === 0) {
                        $("#gridMenu tbody").find("tr[data-uid=" + uid + "]").css("background-color", "#179E79");
                        $("#gridMenu tbody").find("tr[data-uid=" + uid + "]").css("color", "#ffffff");
                    }
                }
            }
         
        });
    },

    GenerateMenuColumns: function () {
        return columns = [
            { field: "MenuName", title: "Menu Name", width: 130 },
            { field: "ParentMenuName", title: "Parent Menu", hidden: false, width: 130, sortable: false },
            { field: "ModuleName", title: "Module", width: 130 },
            { field: "ProjectName", title: "Project", width: 130 },
            { field: "MenuId", hidden: true },
            { field: "ModuleId", hidden: true },
            { field: "MenuPath", hidden: true },
            { field: "ParentMenu", hidden: true },
            { field: "ToDo", hidden: true },
            { field: "SortOrder", hidden: true },
           // { command: { text: "View", click: menuSummaryHelper.clickEventForEditButton }, iconClass: "k-icon k-i-hyperlink-open", className: "k-primary", title: "", width: 60 },
            { field: "Action", title: "Action", filterable: false, width: 60, command: [{
              name: "edit", text: "", iconClass: "k-icon k-i-edit", className: "k-success", click: menuSummaryHelper.clickEventForEditButton}], sortable: false
            }
        ];
    },

    clickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#gridMenu").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            menuDetailsHelper.FillMenuDetailsInForm(selectedItem);
        }
    },

    LoadMenuGrid: function () {
        var projId = $("#cmbProjectName1").data('kendoComboBox').value();
        var moduleId = $("#cmbModuleName1").data('kendoComboBox').value();

        var menuList = menuSummaryManager.gridDataSource(projId, moduleId);
        var grid = $("#gridMenu").data("kendoGrid");
        grid.setDataSource(menuList);
    }
};

