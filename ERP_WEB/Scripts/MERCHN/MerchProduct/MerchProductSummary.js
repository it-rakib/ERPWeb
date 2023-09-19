var MerchProductSummaryManager = {
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
                    url: _baseUrl + '/api/MerchProducts/GetAllGridData',
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


var MerchProductSummaryHelper = {
    InitMerchProductSummary: function () {
        MerchProductSummaryHelper.GenerateMerchProductGrid();
    },
    GenerateMerchProductGrid: function () {
        $("#grdProductSummary").kendoGrid({
            dataSource: MerchProductSummaryManager.gridDataSource(),
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
                fields: ["ProductName"]
            },
            columns: [
                { field: "ProductId", hidden: true, width: 10 },
                { field: "ProductName", title: "Product Name", sortable: true, width: 20 },
                { field: "ProductCategoryName", title: "Category Name", editor: MerchProductSummaryHelper.GenerateMerchProductCombo, sortable: true, width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: MerchProductSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdProductSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            MerchProductDetailsHelper.FillMerchProductForm(selectedItem);
        }
    },
}