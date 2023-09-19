var ExportInvoiceSummaryManager = {
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
                    url: _baseUrl + '/api/ComExportInvoice/GetAllExportInvoiceGridAsync',
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
                        InvoiceDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        }

                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
};

var ExportInvoiceSummaryHelper = {
    InitExportInvoiceSummary: function () {
        ExportInvoiceSummaryHelper.GenerateExportInvoiceSummaryGrid();
    },
    GenerateExportInvoiceSummaryGrid: function () {
        $("#grdExportInvoiceSummary").kendoGrid({
            dataSource: ExportInvoiceSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "ExportInvoiceId", hidden: true },
                { field: "InvoiceNo", title: "Invoice No", width: 40, sortable: true },
                { field: "InvoiceDate", title: "Invoice Date", width: 40, sortable: true, template: '#=kendo.toString(InvoiceDate==null?"":InvoiceDate,"dd-MMM-yyyy")#' },
                { field: "InvoiceQuantity", title: "Invoice Quantity", width: 40, sortable: true },
                { field: "InvoiceValue", title: "Invoice Value", width: 40, sortable: true },
                //{
                //    command: [{
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: ExportInvoiceSummaryManager.ClickEventForEditButton
                //    }], width: 20, title: "&nbsp;"
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            toolbar: ["search"],
            search: {
                fields: ["InvoiceNo"]
            }
        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdExportInvoiceSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divExportInvoiceDetails").show();
            $("#divExportInvoiceSummary").hide();
            //PIDetailsHelper.FillPIDetailsForm(selectedItem);
        }
    }
};