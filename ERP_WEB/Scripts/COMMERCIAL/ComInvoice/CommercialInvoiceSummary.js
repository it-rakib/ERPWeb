var CommercialInvoiceSummaryManager = {
    gridDataSourceCI: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/CommercialInvoice/GetAllImportInvoiceGridData',
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
var CommercialInvoiceSummaryHelper = {
    InitCommercialInvoiceSummary: function () {
        //CommercialInvoiceSummaryHelper.GenerateCommercialInvoiceGrid();
    },
    GenerateCommercialInvoiceGrid: function () {
        $("#grdCommercialInvoiceSummary").kendoGrid({
            dataSource: CommercialInvoiceSummaryManager.gridDataSourceCI(),
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
                fields: ["InvoiceNo"]
            },
            columns: [
                { field: "Ciid", hidden: true },
                { field: "Bblcid", hidden: true },
                { field: "InvoiceId", title: "Invoice ID", sortable: true },
                { field: "InvoiceNo", title: "Invoice No", sortable: true },
                { field: "InvoiceDate", title: "Invoice Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(InvoiceDate), "dd-MMM-yyyy") #' },
                { field: "InvoiceValue", title: "Invoice Value", sortable: true },
                { field: "SupplierName", title: "Supplier", sortable: true },
                { field: "BblctempId", title: "BBLCId", sortable: true },
                { field: "Bblcno", title: "BBLCNo", sortable: true },
                { field: "ShipmentModeName", title: "Shipment Mode", sortable: true },
                { field: "Blno", title: "BL No", sortable: true },
                { field: "BankRefNo", title: "Bank Ref No", sortable: true },
                { field: "CompanyAcptDate", title: "Acpt. Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(CompanyAcptDate), "dd-MMM-yyyy") #' },
                { field: "AcceptanceValue", title: "Acpt. Value", sortable: true },
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });

        $("#grdCommercialInvoiceSummary").on("dblclick", "tr.k-state-selected", function () {
            var grid = $("#grdCommercialInvoiceSummary").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if (selectedItem != null) {
                    CommercialInvoiceInfoHelper.FillInvoiceForm(selectedItem, true);
                    //CommercialInvoiceInfoHelper.LoadePIItemGrid();
                    $("#divCIModal").data("kendoWindow").close();
                }
            }
        });
    },
}