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
    }
};

var ConsignmentSummaryHelper = {
    InitConsignmentSummary: function () {
        $("#popupConsignmentSearch").kendoWindow({
            title: " CONSIGNMENT SUMMARY",
            resizeable: false,
            width: "60%",
            actions: ["Pin", "Refresh", "Maximize", "Close"],
            modal: true,
            visible: false
        });
        ConsignmentSummaryHelper.GenerateInventoryReceiveGrid();

        $("#btnSearchConsignInfo").click(function () {
            $("#popupConsignmentSearch").data("kendoWindow").open().center();
        });
        $("#grdConsignmentSummary").on("dblclick", "tr.k-state-selected", function () {
            var entityGrid = $("#grdConsignmentSummary").data("kendoGrid");
            var selectedItem = entityGrid.dataItem(entityGrid.select());
            if (selectedItem != null) {
                $("#popupConsignmentSearch").data("kendoWindow").close();
                ConsignmentSummaryHelper.FillConsignmentInfo(selectedItem);
            }
        });
   
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
            columns: [
                { field: "ConsignmentId", hidden: true },
                { field: "ConsignmentNo", title: "Consignment No", sortable: true },
                { field: "ConsignmentDate", title: "Consignment Date", sortable: true, template: '#=kendo.toString(ConsignmentDate==null?"":ConsignmentDate,"dd-MMM-yyyy")#' },
                { field: "DeliveryChallanNo", title: "Challan No", sortable: true },
                { field: "DeliveryChallanDate", title: "Challan Date", sortable: true, template: '#=kendo.toString(DeliveryChallanDate==null?"":DeliveryChallanDate,"dd-MMM-yyyy")#' },
                { field: "ComInvoiceNo", title: "Invoice No", sortable: true },
                { field: "ComInvoiceDate", title: "Invoice Date", sortable: true, template: '#=kendo.toString(ComInvoiceDate==null?"":ComInvoiceDate,"dd-MMM-yyyy")#' },
                { field: "SupplierName", title: "Supplier", sortable: true },
                { field: "VehicleNo", title: "VehicleNo", sortable: true },
                {
                    command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-arrow-down", className: "k-success", click: ConsignmentSummaryHelper.ClickEventForEditButton
                    }], title: "Action &nbsp;"
                }],
            toolbar: [{ name: "search", text: "Search By Consignment No" }],
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
            $("#popupConsignmentSearch").data("kendoWindow").close();
            ConsignmentSummaryHelper.FillConsignmentInfo(selectedItem);
        }
    },
    FillConsignmentInfo: function (obj) {
        $("#hdnConsignmentId").val(obj.ConsignmentId);
        $("#txtConsignmentNo").val(obj.ConsignmentNo);
        $("#txtGrnNo").val(obj.Grnno);
        $("#txtGrnDate").data("kendoDatePicker").value(obj.Grndate);
        $("#cmbSupplier").data("kendoComboBox").value(obj.SupplierId);
        $("#txtChallanNo").val(obj.DeliveryChallanNo);
        $("#txtChallanDate").data("kendoDatePicker").value(obj.DeliveryChallanDate);
        $("#txtVehicleNo").val(obj.VehicleNo);
        $("#txtGateEntryNo").val(obj.GateEntryNo);
        $("#txtGateEntryDate").data("kendoDatePicker").value(obj.GateEntryDate);
        $("#txtWayBillNo").val(obj.WayBillNo);
        $("#txtInvoiceNo").val(obj.ComInvoiceNo);
        $("#txtInvoiceDate").data("kendoDatePicker").value(obj.ComInvoiceDate);
    }
};