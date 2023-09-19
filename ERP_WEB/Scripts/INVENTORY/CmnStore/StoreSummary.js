
var StoreSummaryManager = {
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
                    url: _baseUrl + '/api/CmnStore/GetAllGridData',
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
                    StoreName: { type: "string" },
                    StoreShortName: { type: "string" }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
};

var StoreSummaryHelper = {
    InitStoreSummary: function () {
        StoreSummaryHelper.GenerateStoreGrid();
    },
    GenerateStoreGrid: function () {
        $("#grdStoreSummary").kendoGrid({
            dataSource: StoreSummaryManager.gridDataSource(),
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
                fields: ["StoreName"]
            },
            columns: [
                { field: "StoreId", hidden: true },
                { field: "StoreName", title: "Store Name", sortable: true },
                { field: "StoreShortName", title: "Store Short Name", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: StoreSummaryHelper.ClickEventForEditButton
                    }], title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdStoreSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            StoreDetailsHelper.FillStoreForm(selectedItem);
        }
    }
};