var LoanIssueReceiveSummaryManager = {
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
                    url: _baseUrl + "/api/LoanIssueReceive/GetLoanIssueGridForLoanReceive/" + $.trim(userId),
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
                    url: _baseUrl + '/api/LoanIssueReceive/GetAllLoanReceiveInfoGrid/' + userId,
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

var LoanIssueReceiveSummaryHelper = {
    InitLoanIssueReceiveSummary: function () {
        LoanIssueReceiveSummaryHelper.GenerateIssuePendingReceiveGrid();
        LoanIssueReceiveSummaryHelper.LoadPendingIssueReceiveGridDataSource();
        LoanIssueReceiveSummaryHelper.GenerateLoanIssueReceiveGrid();
        LoanIssueReceiveSummaryHelper.LoadIssueReceiveGridDataSource();
    },
    GenerateIssuePendingReceiveGrid: function () {
        $("#grdPendingLoanIssueList").kendoGrid({
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
                        name: "edit", text: "Acknowledge", iconClass: "k-icon k-i-check-circle", className: "k-success", click: LoanIssueReceiveSummaryHelper.ClickEventForReceive
                    }], title: "Action &nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            toolbar: ["search"],
            search: {
                fields: ["IssueNo"]
            }
        });
    },
    ClickEventForReceive: function (e) {
        e.preventDefault();
        var grid = $("#grdPendingLoanIssueList").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divSummary").hide();
            $("#divDetails").show();
            LoanIssueReceiveDetailsHelper.FillIssueMasterForm(selectedItem);
        }
    },
    LoadPendingIssueReceiveGridDataSource: function () {
        var search = $("#search").val();
        var grid = $("#grdPendingLoanIssueList").data("kendoGrid");
        var data = LoanIssueReceiveSummaryManager.PendingIssueReceiveGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    GenerateLoanIssueReceiveGrid: function () {
        $("#grdLoanReveiveSummary").kendoGrid({
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
                        name: "edit", text: "View", iconClass: "k-icon k-i-eye", className: "k-success", click: LoanIssueReceiveSummaryHelper.ClickEventForEdit
                    }], title: "Action &nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            toolbar: ["search"],
            search: {
                fields: ["ReceiveNo"]
            }
        });
    },
    ClickEventForEdit: function (e) {
        e.preventDefault();
        var grid = $("#grdLoanReveiveSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").hide();
            $("#divSummary").hide();
            $("#divDetails").show();
            LoanIssueReceiveDetailsHelper.FillLoanIssueReceiveMasterForm(selectedItem);
        }
    },
    LoadIssueReceiveGridDataSource: function () {
        var grid = $("#grdLoanReveiveSummary").data("kendoGrid");
        var data = LoanIssueReceiveSummaryManager.IssueReceiveGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    }
};