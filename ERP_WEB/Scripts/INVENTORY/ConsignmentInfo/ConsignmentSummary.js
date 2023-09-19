var ConsignmentSummaryManager = {
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
                    url: _baseUrl + '/api/Consignment/GetAllConsignmentGrid/' + userId,
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

var ConsignmentSummaryHelper = {
    InitConsignmentSummary: function () {
        ConsignmentSummaryHelper.GenerateInventoryReceiveGrid();
    },
    GenerateInventoryReceiveGrid: function () {
        $("#grdConsignmentSummary").kendoGrid({
            dataSource: ConsignmentSummaryManager.gridDataSource(CurrentUser.USERID),
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
                { field: "VehicleNo", title: "VehicleNo", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: ConsignmentSummaryHelper.ClickEventForEditButton
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
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdConsignmentSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            if (selectedItem.IsReceived === true) {
                $("#btnSave").hide();
                $("#btnAdd").hide();
                $("#lblMessage").text("Already Received! Can't update Now.");
            } else {
                $("#lblMessage").text("");
                $("#btnSave").show();
                $("#btnAdd").show();
            }
            $("#divConsignmentSummary").hide();
            $("#divConsignmentDetails").show();
            ConsignmentDetailsHelper.FillConsignmentMasterForm(selectedItem);
        }
    }
};