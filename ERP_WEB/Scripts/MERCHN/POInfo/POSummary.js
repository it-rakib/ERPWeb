var POInfoSummaryManager = {
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
                    url: _baseUrl + '/api/PurchaseOrders/GetPurchaseOrderMaster',
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
                        ReceivedDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        ShipmentDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        CutOffDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
};

var POInfoSummaryHelper = {
    InitPOInfoSummary: function () {
        POInfoSummaryHelper.GeneratePOSummaryGrid();
    },
    GeneratePOSummaryGrid: function () {
        $("#grdPOSummary").kendoGrid({
            dataSource:POInfoSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: [
                { field: "Poid", hidden: true, width: 40 },
                { field: "Pono", title: "PO No", sortable: true, width: 50 },
                { field: "ReceivedDate", title: "Receive Date", width: 30, sortable: true, template: '#=kendo.toString(ReceivedDate==null?"":ReceivedDate,"dd-MMM-yyyy")#' },
                { field: "ShipmentDate", title: "Shipment Date", width: 30, sortable: true, template: '#=kendo.toString(ShipmentDate==null?"":ShipmentDate,"dd-MMM-yyyy")#' },
                { field: "ModeName", title: "Shipment Mode", width: 50, sortable: true },
                { field: "CutOffDate", title: "Cuttoff Date", width: 30, sortable: true, template: '#=kendo.toString(CutOffDate==null?"":CutOffDate,"dd-MMM-yyyy")#' },
                { field: "OrderQty", title: "Order Qty", width: 20, sortable: true },
                { field: "StatusName", title: "PO Type", sortable: true, width: 30 },
                //{
                //    command: [{
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: POInfoSummaryHelper.ClickEventForEditButton
                //    }], width: 20, title: "&nbsp;"
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            toolbar: ["search"],
            search: {
                fields: ["Pono"]
            }
        });
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdPOSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divPODetails").show();
            $("#divPOSummary").hide();
            PODetailsHelper.FillPODetailsForm(selectedItem);
        }
    }
};