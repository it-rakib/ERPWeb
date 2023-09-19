var MerchItemSummaryManager = {
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
                    url: _baseUrl + '/api/MerchItems/GetAllGridData',
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
                        ItemName: { type: "string" },
                        CategoryName: {
                            defaultValue: { ItemCategoryId: 0, CategoryName: "---Select---" }
                        }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
}
var MerchItemSummaryHelper = {
    InitMerchItemSummary: function () {
        MerchItemSummaryHelper.GenerateMerchItemGrid();
    },
    GenerateMerchItemGrid: function () {
        $("#grdItemSummary").kendoGrid({
            dataSource: MerchItemSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            selectable: "row",
            toolbar: ["search"],
            search: {
                fields: ["ItemName"]
            },
            columns: [
                { field: "ItemId", hidden: true, width: 10 },
                { field: "GroupName", title: "Group Name", sortable: true, width: 20 },
                { field: "CategoryName", title: "Category Name", sortable: true, width: 20 },
                { field: "ItemName", title: "Item Name", sortable: true, width: 20 },
                { field: "IsActive", title: "Is Active", width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: MerchItemSummaryHelper.ClickEventForEditButton
                    }], width: 10
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdItemSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            MerchItemDetailsHelper.FillMerchItemForm(selectedItem);
        }
    },
}