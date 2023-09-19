var SupplierSummaryManager = {
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
                    url: _baseUrl + '/api/Suppliers/GetAllSupplierGrid',
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
                        
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
}
var SupplierSummaryHelper = {
    InitSupplierSummary: function () {
        SupplierSummaryHelper.GenerateSupplierGrid();
    },
    GenerateSupplierGrid: function () {
        $("#grdSupplierSummary").kendoGrid({
            dataSource: SupplierSummaryManager.gridDataSource(),
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
                fields: ["SupplierName"]
            },
            columns: [
                { field: "SupplierId", hidden: true, width: 10 },
                { field: "SupplierName", title: "Supplier Name", sortable: true, width: 20 },
                { field: "SupplierShortName", title: "Supplier Short Name", sortable: true, width: 20 },
                { field: "CountryName", title: "Country Name", editor: SupplierSummaryHelper.GenerateCountryCombo, sortable: true, width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: SupplierSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdSupplierSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            SupplierDetailsHelper.FillSupplierForm(selectedItem);
        }
    },
}