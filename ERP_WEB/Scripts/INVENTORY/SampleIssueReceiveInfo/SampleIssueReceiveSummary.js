var SampleIssueReceiveSummaryManager = {
    PendingSampleIssueReceiveGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + "/api/SampleIssueReceive/GetAllSampleIssueGridForIssueReceive/" + $.trim(userId),
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
    SampleIssueReceiveGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/SampleIssueReceive/GetAllSampleIssueReceiveGrid/' + userId,
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
                    id: "ReceiveId",
                    fields: {
                        ReceiveDate: {
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

var SampleIssueReceiveSummaryHelper = {
    InitSampleIssueReceiveSummary: function () {
        SampleIssueReceiveSummaryHelper.GenerateSampleIssuePendingReceiveGrid();
        SampleIssueReceiveSummaryHelper.LoadPendingSampleIssueReceiveGridData();
        SampleIssueReceiveSummaryHelper.GenerateSampleIssueReceiveGrid();
        SampleIssueReceiveSummaryHelper.LoadSampleIssueReceiveGridData();
    },
    GenerateSampleIssuePendingReceiveGrid: function () {
        $("#grdPendingSampleIssueList").kendoGrid({
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
                        name: "edit", text: "Acknowledge", iconClass: "k-icon k-i-check-circle", className: "k-success", click: SampleIssueReceiveSummaryHelper.ClickEventForReceive
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
        var grid = $("#grdPendingSampleIssueList").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divSummary").hide();
            $("#divDetails").show();
            SampleIssueReceiveDetailsHelper.FillSampleIssueMasterForm(selectedItem);
        }
    },
    LoadPendingSampleIssueReceiveGridData: function () {
        var search = $("#search").val();
        var grid = $("#grdPendingSampleIssueList").data("kendoGrid");
        var data = SampleIssueReceiveSummaryManager.PendingSampleIssueReceiveGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },

    GenerateSampleIssueReceiveGrid: function () {
        $("#grdSampleIssueReveiveSummary").kendoGrid({
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
                        name: "edit", text: "View", iconClass: "k-icon k-i-eye", className: "k-success", click: SampleIssueReceiveSummaryHelper.ClickEventForEdit
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
        var grid = $("#grdSampleIssueReveiveSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").hide();
            $("#divSummary").hide();
            $("#divDetails").show();
            SampleIssueReceiveDetailsHelper.FillSampleIssueReceiveMasterForm(selectedItem);
        }
    },
    LoadSampleIssueReceiveGridData: function () {
        var grid = $("#grdSampleIssueReveiveSummary").data("kendoGrid");
        var data = SampleIssueReceiveSummaryManager.SampleIssueReceiveGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    }
};