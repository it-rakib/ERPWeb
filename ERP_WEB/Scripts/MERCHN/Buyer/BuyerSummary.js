var BuyerSummaryManager = {
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
                    url: _baseUrl + '/api/Buyers/GetAllGridData',
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
        return gridDataSource;
    },
}
var BuyerSummaryHelper = {
    InitBuyerSummary: function () {
        BuyerSummaryHelper.GenerateBuyerGrid();
    },

    GenerateBuyerGrid: function () {
        $("#grdBuyerSummary").kendoGrid({
            dataSource: BuyerSummaryManager.gridDataSource(),
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
                fields: ["BuyerName"]
            },
            columns: [
                { field: "BuyerId", hidden: true, width:10 },
                { field: "BuyerName", title: "Buyer Name", sortable: true, width: 20 },
                { field: "BuyerShortName", title: "Buyer Short Name", sortable: true, width: 20  },
                { field: "CountryName", title: "Country Name", editor: BuyerSummaryHelper.GenerateCountryCombo, sortable: true, width: 20 },
                { field: "IsActive", title: "Is Active", width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: BuyerSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdBuyerSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            BuyerDetailsHelper.FillBuyerForm(selectedItem);
        }
    },

}