var isAdmin = false;
var ConditionSummaryManager = {
    gridDataSource: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlTransport + '/api/VehicleCondition/GetAllGridData',
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json;",
                    cache: false,
                    async: false
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            batch: true,
            schema: {
                model: {
                    fields: {
                        //BuyerName: { type: "string" },
                        //CountryName: {
                        //    defaultValue: { CountryId: 0, CountryName: "---Select---" }
                        //}
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        debugger;
        return gridDataSource;
    },
}
var ConditionSummaryHelper = {
    InitConditionSummary: function () {
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        ConditionSummaryHelper.GenerateConditionGrid();
    },

    GenerateConditionGrid: function () {
        $("#grdConditionSummary").kendoGrid({
            dataSource: ConditionSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            toolbar: ["search"],
            search: {
                fields: ["VehicleConditionName"]
            },
            columns: [
                { field: "VehicleConditionId", hidden: true },
                { field: "VehicleConditionName", title: "Vehicle Condition", sortable: true },
                { field: "IsDeleted", title: "Is Deleted", hidden: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: ConditionSummaryHelper.ClickEventForEditButton
                    }
                    ], title: "&nbsp;"
                },
                {
                    command: [
                        {
                            name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: ConditionSummaryHelper.ClickEventForDeleteButton
                        }
                    ], hidden: !isAdmin, title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdConditionSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            ConditionDetailsHelper.FillConditionForm(selectedItem);
        }
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        let text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdConditionSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                $("#btnSave").text("Delete");
                selectedItem.IsDeleted = true;
                ConditionDetailsHelper.FillConditionForm(selectedItem);
                ConditionDetailsManager.SaveConditionDetails();
            }
        } else {
            text = "Canceled!";
        }
    }

}