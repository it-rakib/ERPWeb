var ConsignmentRcvSummaryManager = {
    PendingConsignmentRcvGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/Consignment/GetConsignmentGridForReceive/' + $.trim(userId),
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
                    id: "ConsignmentId",
                    fields: {
                        ConsignmentDate: {
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
    },
    ConsignmentRcvGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/Consignment/GetAllConsignmentRcvGrid/' + $.trim(userId),
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

var ConsignmentRcvSummaryHelper = {
    InitConsignmentRcvSummary: function () {
        $("#pnlMasterInfo1").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        ConsignmentRcvSummaryHelper.GeneratePendingConsignmentRcvGrid();
        ConsignmentRcvSummaryHelper.LoadPendingConsignmentDataSource();

        ConsignmentRcvSummaryHelper.GenerateConsignmentRcvGrid();
        ConsignmentRcvSummaryHelper.LoadConsignmentRcvDataSource();
    },
    GeneratePendingConsignmentRcvGrid: function () {
        $("#grdPendingConsignmentList").kendoGrid({
            dataSource: [],
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
                { field: "ConsignmentId", hidden: true },
                { field: "ConsignmentNo", title: "Consignment No", sortable: true },
                { field: "ConsignmentDate", title: "Consignment Date", sortable: true, template: '#=kendo.toString(kendo.parseDate(ConsignmentDate==null?"":ConsignmentDate),"dd-MMM-yyyy")#' },
                { field: "DeliveryChallanNo", title: "Challan No", sortable: true },
                { field: "DeliveryChallanDate", title: "Challan Date", sortable: true, template: '#=kendo.toString(kendo.parseDate(DeliveryChallanDate==null?"":DeliveryChallanDate),"dd-MMM-yyyy")#' },
                { field: "ComInvoiceNo", title: "Invoice No", sortable: true },
                { field: "ComInvoiceDate", title: "Invoice Date", sortable: true, template: '#=kendo.toString(kendo.parseDate(ComInvoiceDate==null?"":ComInvoiceDate),"dd-MMM-yyyy")#' },
                { field: "SupplierName", title: "Supplier", sortable: true },
                { field: "VehicleNo", title: "Vehicle No", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Details", iconClass: "k-icon k-i-eye", className: "k-success", click: ConsignmentRcvSummaryHelper.ClickEventForDetailsButton
                    }], title: "Action &nbsp;"
                }],
            toolbar: [{ name: "search", text: "Search By Cons.t No"}],
            search: {
                fields: ["ConsignmentNo"]
            },
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadPendingConsignmentDataSource: function () {
        var grid = $("#grdPendingConsignmentList").data("kendoGrid");
        var data = ConsignmentRcvSummaryManager.PendingConsignmentRcvGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    ClickEventForDetailsButton: function (e) {
        e.preventDefault();
        var grid = $("#grdPendingConsignmentList").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divConsignmentRcvSummary").hide();
            $("#divConsignmentRcvDetails").show();
            ConsignmentRcvDetailsHelper.FillConsignmentRcvMasterForm(selectedItem);
        }
    },

    GenerateConsignmentRcvGrid: function () {
        $("#grdConsignmentRcvSummary").kendoGrid({
        dataSource: [],
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
            { field: "ConsignmentId", hidden: true },
            { field: "ConsignmentNo", title: "Consignment No", sortable: true },
            { field: "ConsignmentDate", title: "Consignment Date", sortable: true, template: '#=kendo.toString(kendo.parseDate(ConsignmentDate==null?"":ConsignmentDate),"dd-MMM-yyyy")#' },
            { field: "DeliveryChallanNo", title: "Challan No", sortable: true },
            { field: "DeliveryChallanDate", title: "Challan Date", sortable: true, template: '#=kendo.toString(kendo.parseDate(DeliveryChallanDate==null?"":DeliveryChallanDate),"dd-MMM-yyyy")#' },
            { field: "ComInvoiceNo", title: "Invoice No", sortable: true },
            { field: "ComInvoiceDate", title: "Invoice Date", sortable: true, template: '#=kendo.toString(kendo.parseDate(ComInvoiceDate==null?"":ComInvoiceDate),"dd-MMM-yyyy")#' },
            { field: "SupplierName", title: "Supplier", sortable: true },
            { field: "VehicleNo", title: "Vehicle No", sortable: true },
            {
                command: [{
                    name: "edit", text: "View", iconClass: "k-icon k-i-eye", className: "k-success", click: ConsignmentRcvSummaryHelper.ClickEventForDetailsButton
                }], title: "Action &nbsp;"
            }],
        toolbar: [{ name: "search", text: "Search By Cons.t No"}],
        search: {
            fields: ["ConsignmentNo"]
        },
        editable: false,
        selectable: "row",
        navigatable: true
    });
    },
    LoadConsignmentRcvDataSource: function () {
        var grid = $("#grdConsignmentRcvSummary").data("kendoGrid");
        var data = ConsignmentRcvSummaryManager.ConsignmentRcvGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    ClickEventForDetailButton: function (e) {
        e.preventDefault();
        var grid = $("#grdConsignmentRcvSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            if (selectedItem.IsReceived === true) {
                $("#btnReceive").hide();
                $("#lblMessage").text("Already Received! Can't update Now.");
            } else {
                $("#lblMessage").text("");
                $("#btnReceive").show();
            }
            $("#divConsignmentRcvSummary").hide();
            $("#divConsignmentRcvDetails").show();
            ConsignmentRcvDetailsHelper.FillConsignmentRcvMasterForm(selectedItem);
        }
    }
};