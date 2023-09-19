var FloorRtnRcvSummaryManager = {
    PendingRtnRcvGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + "/api/FloorRtnRcv/GetFloorReturnGridForFloorRtnRcv/" + $.trim(userId),
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
                    id: "IssueId",
                    fields: {
                        IssueDate: {
                            type: "date", editable: false
                        },
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
    FloorRtnRcvGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/FloorRtnRcv/GetAllFloorRtnRcvGrid/' + userId,
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
                    id: "StoreRtnRcvId",
                    fields: {
                        StoreRtnRcvDate: {
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

var FloorRtnRcvSummaryHelper = {
    InitFloorRtnRcvSummary: function () {
        FloorRtnRcvSummaryHelper.GenerateIssuePendingReceiveGrid();
        FloorRtnRcvSummaryHelper.LoadPendingRtnRcvGridDataSource();
        FloorRtnRcvSummaryHelper.GenerateFloorRtnRcvGrid();
        FloorRtnRcvSummaryHelper.LoadRtnRcvGridDataSource();
    },
    GenerateIssuePendingReceiveGrid: function () {
        $("#grdPendingFloorReturnList").kendoGrid({
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
                { field: "IssueId", hidden: true },
                { field: "IssueNo", title: "Return No", sortable: true },
                { field: "IssueDate", title: "Return Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(IssueDate==null?"":IssueDate), "dd-MMM-yyyy") #' },
                { field: "StyleNo", title: "Style No", sortable: true },
                //{ field: "RequisitionNo", title: "Requisition No", sortable: true },
                { field: "StoreFromName", title: "Store From", sortable: true },
                { field: "StoreToName", title: "Store To", sortable: true },
                { field: "Remarks", title: "Remarks", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Receive", iconClass: "k-icon k-i-check-circle", className: "k-success", click: FloorRtnRcvSummaryHelper.ClickEventForReceive
                    }], title: "Action &nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForReceive: function (e) {
        e.preventDefault();
        var grid = $("#grdPendingFloorReturnList").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divSummary").hide();
            $("#divDetails").show();
            FloorRtnRcvDetailsHelper.FillReturnMasterForm(selectedItem);
        }
    },
    LoadPendingRtnRcvGridDataSource: function () {
        var search = $("#search").val();
        var grid = $("#grdPendingFloorReturnList").data("kendoGrid");
        var data = FloorRtnRcvSummaryManager.PendingRtnRcvGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    GenerateFloorRtnRcvGrid: function () {
        $("#grdFloorRtnRcvSummary").kendoGrid({
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
                { field: "ReceiveId", hidden: true },
                { field: "IssueId", hidden: true },
                { field: "ReceiveNo", title: "Return Receive No", sortable: true },
                { field: "ReceiveDate", title: "Receive Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(ReceiveDate==null?"":ReceiveDate), "dd-MMM-yyyy") #' },
                { field: "StyleNo", title: "Style No", sortable: true },
                { field: "IssueNo", title: "Return No", sortable: true },
                //{ field: "RequisitionNo", title: "Requisition No", sortable: true },
                { field: "StoreFromName", title: "Store From", sortable: true },
                { field: "StoreToName", title: "Store To", sortable: true },
                { field: "Remarks", title: "Remarks", sortable: true },
                {
                    command: [{
                        name: "edit", text: "View", iconClass: "k-icon k-i-eye", className: "k-success", click: FloorRtnRcvSummaryHelper.ClickEventForEdit
                    }], title: "Action &nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForEdit: function (e) {
        e.preventDefault();
        var grid = $("#grdFloorRtnRcvSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").hide();
            $("#divSummary").hide();
            $("#divDetails").show();
            FloorRtnRcvDetailsHelper.FillFloorRtnRcvMasterForm(selectedItem);
        }
    },
    LoadRtnRcvGridDataSource: function () {
        var grid = $("#grdFloorRtnRcvSummary").data("kendoGrid");
        var data = FloorRtnRcvSummaryManager.FloorRtnRcvGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    }
};