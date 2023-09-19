var MerchFabricCompositionSummaryManager = {
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
                    url: _baseUrl + '/api/MerchFabricComposition/GetAllGridData',
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
var MerchFabricCompositionSummaryHelper = {
    InitFabricCompositionSummary: function () {
        MerchFabricCompositionSummaryHelper.GenerateMerchFabricCompositionGrid();
    },
    GenerateMerchFabricCompositionGrid: function () {
        $("#grdFabricCompositionSummary").kendoGrid({
            dataSource: MerchFabricCompositionSummaryManager.gridDataSource(),
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
                fields: ["CompositionName"]
            },
            columns: [
                { field: "FabricCompositionId", hidden: true, width: 10 },
                { field: "CompositionName", title: "Composition Name", sortable: true, width: 20 },
                { field: "FabricType", title: "Fabric Type", editor: MerchFabricCompositionSummaryHelper.GenerateFabricTypeCombo, sortable: true, width: 20 },
                //{ field: "IsActive", title: "Is Active", width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: MerchFabricCompositionSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdFabricCompositionSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            MerchFabricCompositionDetailsHelper.FillFabricCompositionForm(selectedItem);
        }
    },
}