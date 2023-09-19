var BrandSummaryManager = {
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
                    url: _baseUrl + "/api/BuyerBrands/GetAllGridData",
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
var BrandSummaryHelper = {
    InitBrandSummary: function () {
        BrandSummaryHelper.GenerateBrandGrid();
    },

    GenerateBrandGrid: function () {
        $("#grdBrandSummary").kendoGrid({
            dataSource: BrandSummaryManager.gridDataSource(),
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
                fields: ["BrandName"]
            },
            columns: [
                { field: "BrandId", hidden: true, width: 10 },
                { field: "BrandName", title: "Buyer Brand Name", sortable: true, width: 20 },
                { field: "BuyerName", title: "Buyer Name", width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: BrandSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdBrandSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            BrandDetailsHelper.FillBrandForm(selectedItem);
        }
    },

}