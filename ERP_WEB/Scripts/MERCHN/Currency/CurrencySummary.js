var CurrencySummaryManager = {
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
                    url: _baseUrl + '/api/CmnCurrency/GetAllGridData',
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
var CurrencySummaryHelper = {
    InitCurrencySummary: function () {
        CurrencySummaryHelper.GenerateCurrencyGrid();
    },

    GenerateCurrencyGrid: function () {
        $("#grdCurrencySummary").kendoGrid({
            dataSource: CurrencySummaryManager.gridDataSource(),
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
                fields: ["CurrencyName"]
            },
            columns: [
                { field: "CurrencyId", hidden: true },
                { field: "CurrencyName", title: "Currency Name", sortable: true },
                { field: "CurrencyCode", title: "Currency Code", sortable: true },
                { field: "CurrenceySymbol", title: "Currencey Symbol", sortable: true },
                { field: "OrderSl", title: "Order Sl", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: CurrencySummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdCurrencySummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            CurrencyDetailsHelper.FillCurrencyForm(selectedItem);
        }
    }
}