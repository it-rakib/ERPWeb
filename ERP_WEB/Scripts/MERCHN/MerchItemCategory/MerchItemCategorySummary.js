var MerchItemCategorySummaryManager = {
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
                    url: _baseUrl + '/api/MerchItemCategories/GetAllGridData',
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
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
}
var MerchItemCategorySummaryHelper = {
    InitMerchItemCategorySummary: function () {
        MerchItemCategorySummaryHelper.GenerateMerchItemCategoryGrid();
    },
    GenerateMerchItemCategoryGrid: function () {
        $("#grdItemCategorySummary").kendoGrid({
            dataSource: MerchItemCategorySummaryManager.gridDataSource(),
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
                fields: ["CategoryName"]
            },
            columns: [
                { field: "ItemCategoryId", hidden: true, width: 10 },
                { field: "CategoryName", title: "Category Name", sortable: true, width: 20 },
                { field: "GroupName", title: "Group Name", editor: MerchItemCategorySummaryHelper.GenerateMerchItemCategoryCombo, sortable: true, width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: MerchItemCategorySummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdItemCategorySummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            MerchItemCategoryDetailsHelper.FillMerchItemCategoryForm(selectedItem);
        }
    },
}