var FabricTypeSummaryManager = {
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
                    url: _baseUrl + '/api/MerchantFabricTypes/GetAllGridData',
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
var FabricTypeSummaryHelper = {
    InitFabricTypeSummary: function () {
        FabricTypeSummaryHelper.GenerateFabricTypeGrid();
    },
    GenerateFabricTypeGrid: function () {
        $("#grdFabricTypeSummary").kendoGrid({
            dataSource: FabricTypeSummaryManager.gridDataSource(),
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
                fields: ["FabricType"]
            },
            columns: [
                { field: "FabricTypeId ", hidden: true, width: 10 },
                { field: "FabricType ", title: "Fabric Type ", sortable: true, width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: FabricTypeSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdFabricTypeSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            FabricTypeDetailsHelper.FillFabricTypeForm(selectedItem);
        }
    },
}