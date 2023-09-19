
var UserSummaryManager = {
    gridDataSource: function (usrId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,

            serverSorting: true,

            serverFiltering: true,

            allowUnsort: true,

            pageSize: 10,

            transport: {
                read: {
                    url: '../User/GetUserSummary/?usrId=' + usrId,

                    type: "POST",

                    dataType: "json",

                    contentType: "application/json; charset=utf-8"
                },

                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            schema: {
                data: "Items", total: "TotalCount",
                model: {
                    fields: {
                        MeetingDate: {
                            type: "date",
                            template: '#= kendo.toString("MM/dd/yyyy") #'
                        },

                    }
                },
            }
        });
        return gridDataSource;
    }
};


var UserSummaryHelper = {
    InitUserSummary: function () {
        UserSummaryHelper.GenerateUserGrid();
        $("#cmbUser").change(function () {
            UserSummaryHelper.LoadUserGrid();
        });


        $("#lblSearchUser").click(function () {
            UserSummaryHelper.LoadUserCombo();
        });
        $("#btnSearchUser").click(function () {
            UserSummaryHelper.LoadUserCombo();
        });
        $("#txtSrcUser").keypress(function (e) {
            if (event.keyCode == 13) {
                UserSummaryHelper.LoadUserCombo();
            }
        });
    },

    LoadUserGrid:function() {
        var usrId = $("#cmbUser").data("kendoComboBox").value();
        var data = UserSummaryManager.gridDataSource(usrId);
        $("#grdUserSummary").data("kendoGrid").setDataSource(data);
    },

    GenerateUserGrid: function () {
        $("#grdUserSummary").kendoGrid({
            dataSource: UserSummaryManager.gridDataSource(0),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: UserSummaryHelper.GenerateUserColumns(),
            editable: false,
            navigatable: true,
            selectable: "row",
        });

    },
    GenerateUserColumns: function () {
        return columns = [
                { field: "EMPID", title: "Emp ID", width: 60 },
                { field: "USERNAME", title: "Name", width: 100 },
                { field: "USRDESIG", title: "Designation", width: 100 },
               // { field: "Edit", title: "Action", filterable: false, width: 60, template: '<button type="button" class="btn btn-default btn-sm" value="Edit" id="btnEdit" onClick="UserSummaryHelper.clickEventForEditButton()" ><span class="glyphicon glyphicon-edit"></span></button>', sortable: false }
               {
                   field: "Action", title: "Action", filterable: false, width: 60, command: [{
                       name: "edit", text: "", iconClass: "k-icon k-i-search", className: "k-success", click: UserSummaryHelper.clickEventForEditButton
                   }], sortable: false
               }

        ];
    },

    clickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdUserSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#hdnUserId").val(selectedItem.USERID);
            $("#txtUserId").val(selectedItem.EMPID);
            $("#txtUserName").val(selectedItem.USERNAME);
            $("#txtDesig").val(selectedItem.USRDESIG);
            $("#txtNewPassword").val(selectedItem.USRPASS);
            $("#txtReNewPass").val(selectedItem.USRPASS);
            $("#cmbUserType").data("kendoComboBox").value(selectedItem.USERTYPE);
            $("#cmbUserLevel").data("kendoComboBox").value(selectedItem.USERLEVELID);

            var moduleId = $("#cmbModuleName").data("kendoComboBox").value();

            //projectId get from global

            var projectId = $("#cmbProjectName").data("kendoComboBox").value();

            if (projectId > 0) {
                moduleId = moduleId === "" ? "0" : moduleId;
                var data = menuPermissionSummaryManager.gridDataSource(selectedItem.USERID, projectId, moduleId);
                $("#gridMenuPermission").data("kendoGrid").setDataSource(data);

                var menuId = $("#cmbMenuName").data("kendoComboBox").value();
                var data1 = reportPermissionSummaryManager.gridDataSource(selectedItem.USERID, projectId, menuId);
                $("#gridReportPermission").data("kendoGrid").setDataSource(data1);
            }
        }

    },
    clickEventForEditButton2: function () {
        var entityGrid = $("#grdUserSummary").data("kendoGrid");
        var selectedItem = entityGrid.dataItem(entityGrid.select());
        if (selectedItem != null) {
            $("#hdnUserId").val(selectedItem.USERID);
            $("#txtUserId").val(selectedItem.EMPID);
            $("#txtUserName").val(selectedItem.USERNAME);
            $("#txtDesig").val(selectedItem.USRDESIG);
            $("#txtNewPassword").val(selectedItem.USRPASS);
            $("#txtReNewPass").val(selectedItem.USRPASS);
            $("#cmbUserType").data("kendoComboBox").value(selectedItem.USERTYPE);
            $("#cmbUserLevel").data("kendoComboBox").value(selectedItem.USERLEVELID);

            var moduleId = $("#cmbModuleName").data("kendoComboBox").value();

            //projectId get from global

            var projectId = $("#cmbProjectName").data("kendoComboBox").value();
            debugger;
            if (projectId > 0) {
                moduleId = moduleId === "" ? "0" : moduleId;
                var data = menuPermissionSummaryManager.gridDataSource(selectedItem.USERID, projectId, moduleId);
                $("#gridMenuPermission").data("kendoGrid").setDataSource(data);

                var menuId = $("#cmbMenuName").data("kendoComboBox").value();
                var data1 = reportPermissionSummaryManager.gridDataSource(selectedItem.USERID, projectId, menuId);
                $("#gridReportPermission").data("kendoGrid").setDataSource(data1);
            }
        }
    },

    LoadUserCombo: function () {
        var searchText = $("#txtSrcUser").val();
        var combo = $("#cmbUser").data("kendoComboBox");
        if (searchText != "") {
            var data = smsCommonManager.GetAllUserDataBySearchKey(searchText);
            combo.text("");
            combo.value("");
            combo.setDataSource(data);
            combo.select(0);
            UserSummaryHelper.LoadUserGrid();
        } else {
            combo.text("");
            combo.value("");
            $("#grdUserSummary").data("kendoGrid").dataSource.data([]);
        }
    }
}