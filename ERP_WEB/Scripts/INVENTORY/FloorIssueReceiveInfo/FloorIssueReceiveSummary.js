var FloorIssueReceiveSummaryManager = {
    PendingIssueReceiveGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + "/api/FloorIssueReceive/GetFloorIssueGridForFloorReceive/" + $.trim(userId),
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
    IssueReceiveGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/FloorIssueReceive/GetAllFloorReceiveInfoGrid/' + userId,
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
                    id: "StoreIssueReceiveId",
                    fields: {
                        StoreIssueReceiveDate: {
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

var FloorIssueReceiveSummaryHelper = {
    InitFloorIssueReceiveSummary: function () {
        FloorIssueReceiveSummaryHelper.GenerateIssuePendingReceiveGrid();
        FloorIssueReceiveSummaryHelper.LoadPendingIssueReceiveGridDataSource();
        FloorIssueReceiveSummaryHelper.GenerateFloorIssueReceiveGrid();
        FloorIssueReceiveSummaryHelper.LoadIssueReceiveGridDataSource();
    },
    GenerateIssuePendingReceiveGrid: function () {
        $("#grdPendingFloorIssueList").kendoGrid({
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
                { field: "IssueNo", title: "Issue No", sortable: true },
                { field: "IssueDate", title: "Issue Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(IssueDate==null?"":IssueDate), "dd-MMM-yyyy") #' },
                { field: "StyleNo", title: "Style No", sortable: true },
                { field: "RequisitionNo", title: "Requisition No", sortable: true },
                { field: "StoreFromName", title: "Store From", sortable: true },
                { field: "StoreToName", title: "Store To", sortable: true },
                { field: "Remarks", title: "Remarks", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Acknowledge", iconClass: "k-icon k-i-check-circle", className: "k-success", click: FloorIssueReceiveSummaryHelper.ClickEventForReceive
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
        var grid = $("#grdPendingFloorIssueList").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divFloorIssueReceiveSummary").hide();
            $("#divFloorIssueReceiveDetails").show();
            FloorIssueReceiveDetailsHelper.FillIssueMasterForm(selectedItem);
        }
    },
    LoadPendingIssueReceiveGridDataSource: function () {
        var search = $("#search").val();
        var grid = $("#grdPendingFloorIssueList").data("kendoGrid");
        var data = FloorIssueReceiveSummaryManager.PendingIssueReceiveGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    GenerateFloorIssueReceiveGrid: function () {
        $("#grdFloorReveiveSummary").kendoGrid({
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
                { field: "ReceiveNo", title: "Issue Receive No", sortable: true },
                { field: "ReceiveDate", title: "Receive Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(ReceiveDate==null?"":ReceiveDate), "dd-MMM-yyyy") #' },
                { field: "StyleNo", title: "Style No", sortable: true },
                { field: "IssueNo", title: "Issue No", sortable: true },
                { field: "RequisitionNo", title: "Requisition No", sortable: true },
                { field: "StoreFromName", title: "Store From", sortable: true },
                { field: "StoreToName", title: "Store To", sortable: true },
                { field: "Remarks", title: "Remarks", sortable: true },
                {
                    command: [{
                        name: "edit", text: "View", iconClass: "k-icon k-i-eye", className: "k-success", click: FloorIssueReceiveSummaryHelper.ClickEventForEdit
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
        var grid = $("#grdFloorReveiveSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").hide();
            $("#divFloorIssueReceiveSummary").hide();
            $("#divFloorIssueReceiveDetails").show();
            FloorIssueReceiveDetailsHelper.FillFloorIssueReceiveMasterForm(selectedItem);
        }
    },
    LoadIssueReceiveGridDataSource: function () {
        var grid = $("#grdFloorReveiveSummary").data("kendoGrid");
        var data = FloorIssueReceiveSummaryManager.IssueReceiveGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    }
};