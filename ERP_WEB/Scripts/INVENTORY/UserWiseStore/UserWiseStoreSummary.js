var UserWiseStoreSummaryManager = {
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


var UserWiseStoreSummaryHelper = {
    InitUserWiseStoreSummary: function () {
        UserWiseStoreSummaryHelper.GenerateUserGrid();
        $("#cmbUser").change(function () {
            UserWiseStoreSummaryHelper.LoadUserGrid();
        });
        $("#lblSearchUser").click(function () {
            UserWiseStoreSummaryHelper.LoadUserCombo();
        });
        $("#btnSearchUser").click(function () {
            UserWiseStoreSummaryHelper.LoadUserCombo();
        });
        $("#txtSrcUser").keypress(function (e) {
            if (event.keyCode == 13) {
                UserWiseStoreSummaryHelper.LoadUserCombo();
            }
        });
    },

    LoadUserGrid:function() {
        var usrId = $("#cmbUser").data("kendoComboBox").value();
        var data = UserWiseStoreSummaryManager.gridDataSource(usrId);
        $("#grdUserSummary").data("kendoGrid").setDataSource(data);
    },

    GenerateUserGrid: function () {
        $("#grdUserSummary").kendoGrid({
            dataSource: UserWiseStoreSummaryManager.gridDataSource(0),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: UserWiseStoreSummaryHelper.GenerateUserColumns(),
            editable: false,
            navigatable: true,
            selectable: "row"
        });
    },
    GenerateUserColumns: function () {
        return columns = [
                { field: "EMPID", title: "Emp ID", width: 60 },
                { field: "USERNAME", title: "Name", width: 100 },
                { field: "USRDESIG", title: "Designation", width: 100 },
               {
                   field: "Action", title: "Action", filterable: false, width: 60, command: [{
                       name: "edit", text: "", iconClass: "k-icon k-i-search", className: "k-success", click: UserWiseStoreSummaryHelper.clickEventForEditButton
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
            //var storeId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbStore").data("kendoComboBox").value());

            var data = UserStorePermissionSummaryManager.gridDataSource(selectedItem.USERID);
            $("#gridStorePermission").data("kendoGrid").setDataSource(data);
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
            UserWiseStoreSummaryHelper.LoadUserGrid();
        } else {
            //combo.text("");
            //combo.value("");
            //$("#grdUserSummary").data("kendoGrid").dataSource.data([]);
            AjaxManager.MsgBox('warning', 'center', 'Alert', "Please type some text to search user!",
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    }
}