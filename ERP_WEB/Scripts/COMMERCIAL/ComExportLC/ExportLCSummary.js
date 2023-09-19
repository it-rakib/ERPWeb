var ExportLCSummaryManager = {
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
                    url: _baseUrl + '/api/ComExportLc/GetAllGridData',
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
var ExportLCSummaryHelper = {
    InitExportLCSummary: function () {
        //ExportLCSummaryHelper.GenerateExportLCGrid();
    },
    GenerateExportLCGrid: function () {
        $("#grdExportLCSummary").kendoGrid({
            dataSource: ExportLCSummaryManager.gridDataSource(),
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
                fields: ["Scno"]
            },
            columns: [
                { field: "Lcid", hidden: true },
                { field: "TempLcid", title: "LC ID", sortable: true },
                { field: "Lcno", title: "LC No", sortable: true },
                { field: "Lcdate", title: "LC Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(Lcdate), "dd-MMM-yyyy") #' },
                { field: "BuyerName", title: "Buyer", sortable: true },
                { field: "OpenBankName", title: "Open Bank", sortable: true },
                { field: "LienBankName", title: "Lien Bank", sortable: true },
                { field: "RcvThroughBank", title: "Rcv Through", sortable: true },
                { field: "BeneficiaryName", title: "Beneficiary", sortable: true }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });

        $("#grdExportLCSummary").on("dblclick", "tr.k-state-selected", function () {
            var grid = $("#grdExportLCSummary").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if (selectedItem != null) {
                    ExportLCInfoHelper.FillExportLCForm(selectedItem, true);
                    ExportLCAmendmentHelper.LoadAmendmentGrid(selectedItem.Lcid)
                    $("#divLCModal").data("kendoWindow").close();
                }
            }
        });
    },
}