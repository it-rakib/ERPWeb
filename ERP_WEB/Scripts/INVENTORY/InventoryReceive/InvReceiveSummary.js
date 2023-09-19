var InvReceiveSummaryManager = {
    gridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/InvMRR/GetAllMrrInfo/' + $.trim(userId),
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
                    id: "StyleId",
                    fields: {
                        MRRDate: {
                            type: "date", editable: false
                        },
                        DeliveryChallanDate: {
                            type: "date", editable: false
                        },
                        ComInvoiceDate: {
                            type: "date", editable: false
                        }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    }
};

var InvReceiveSummaryHelper = {
    InitInvReceiveSummary: function () {
        InvReceiveSummaryHelper.GenerateInventoryReceiveGrid();
    },
    GenerateInventoryReceiveGrid: function () {
        $("#grdInvReceiveSummary").kendoGrid({
            dataSource: InvReceiveSummaryManager.gridDataSource(CurrentUser.USERID),
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
                { field: "MRRId", hidden: true },
                { field: "ConsignmentId", hidden: true },
                { field: "MRRNo", title: "MRR No", sortable: true },
                { field: "PINo", title: "PI No", sortable: true },
                { field: "ConsignmentNo", title: "Consignment No", sortable: true },
                { field: "MRRDate", title: "MRR Date", sortable: true, template: '#=kendo.toString(MRRDate==null?"":MRRDate,"dd-MMM-yyyy")#' },
                { field: "DeliveryChallanNo", title: "Challan No", sortable: true },
                { field: "DeliveryChallanDate", title: "Challan Date", sortable: true, template: '#=kendo.toString(DeliveryChallanDate==null?"":DeliveryChallanDate,"dd-MMM-yyyy")#' },
                { field: "ComInvoiceNo", title: "Invoice No", sortable: true },
                { field: "ComInvoiceDate", title: "Invoice Date", sortable: true, template: '#=kendo.toString(ComInvoiceDate==null?"":ComInvoiceDate,"dd-MMM-yyyy")#' },
                { field: "SupplierName", title: "Supplier", sortable: true },
                { field: "VehicleNo", title: "VehicleNo", sortable: true },
                { field: "LocationName", title: "Store Location", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: InvReceiveSummaryHelper.ClickEventForEditButton
                    }], title: "Action &nbsp;"
                }],
            toolbar: [{ name: "search", text: "Search By MRR No"}],
            search: {
                fields: ["MRRNo"]
            },
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdInvReceiveSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            //$("#btnSaveMrr").text(" Update");
            //$("#btnSaveMrr").addClass("fa fa-save");

            $("#divRcvSummary").hide();
            $("#divRcvDetails").show();
            InvReceiveDetailsHelper.FillMRRMasterForm(selectedItem);
        }

    }
};