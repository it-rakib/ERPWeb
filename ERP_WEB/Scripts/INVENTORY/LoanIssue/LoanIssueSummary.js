var LoanIssueSummaryManager = {
    PendingLoanRequisitionGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/LoanIssue/GetLoanRequisitionGridForLoanIssue/' + $.trim(userId),
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
                    id: "RequisitionId",
                    fields: {
                        RequisitionId: { editable: false },
                        RequisitionNo: { type: "string", validation: { required: true } },
                        RequisitionDate: { type: "date", editable: false }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
    LoanIssueGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/LoanIssue/GetAllLoanIssueInfoGrid/' + userId,
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
                        }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    }
};

var LoanIssueSummaryHelper = {
    InitLoanIssueSummary: function () {
        LoanIssueSummaryHelper.GenerateRequisitionPendingGrid();
        LoanIssueSummaryHelper.LoadRequisitionDataSource();
        LoanIssueSummaryHelper.GenerateLoanIssueGrid();
        LoanIssueSummaryHelper.LoadGridData();
    },
    GenerateRequisitionPendingGrid: function () {
        $("#grdPendingLoanRequisitionList").kendoGrid({
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
                { field: "RequisitionId", hidden: true },
                { field: "RequisitionNo", title: "Requisition No", width: 15, sortable: true },
                { field: "RequisitionDate", title: "Requisition Date", width: 15, sortable: true, template: '#= kendo.toString(kendo.parseDate(RequisitionDate==null?"":RequisitionDate), "dd-MMM-yyyy") #' },
                { field: "StoreFromId", hidden: true },
                { field: "StoreFrom", title: "Store From", width: 20, sortable: true },
                { field: "StoreToId", hidden: true },
                { field: "StoreTo", title: "Store To", width: 15, sortable: true },
                { field: "StyleId", hidden: true },
                { field: "StyleDetailsId", hidden: true },
                { field: "StyleNo", title: "Style", width: 15, sortable: true },
                { field: "Remarks", title: "Remarks", width: 10, sortable: true },
                {
                    command: [{
                        name: "edit", text: "Issue", iconClass: "k-icon k-i-arrow-down", className: "k-success", click: LoanIssueSummaryHelper.ClickEventForIssued
                    }], width: 10, title: "Action &nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            toolbar: ["search"],
            search: {
                fields: ["RequisitionNo"]
            }
        });

        $("#grdPendingLoanRequisitionList").on("dblclick", "tr.k-state-selected", function () {
            var grid = $("#grdPendingLoanRequisitionList").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if (selectedItem != null) {
                    $("#divLoanIssueSummary").hide();
                    $("#divLoanIssueDetails").show();
                    LoanIssueDetailsHelper.FillLoanIssueMasterFormByRequisition(selectedItem);
                }
            }
        });
    },
    LoadRequisitionDataSource: function () {
        var grid = $("#grdPendingLoanRequisitionList").data("kendoGrid");
        var data = LoanIssueSummaryManager.PendingLoanRequisitionGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    ClickEventForIssued: function (e) {
        e.preventDefault();
        var grid = $("#grdPendingLoanRequisitionList").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divSummary").hide();
            $("#divDetails").show();
            LoanIssueDetailsHelper.FillLoanIssueMasterFormByRequisition(selectedItem);
        }
    },

    GenerateLoanIssueGrid: function () {
        $("#grdLoanIssueSummary").kendoGrid({
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
                { field: "Remarks", title: "Remarks", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LoanIssueSummaryHelper.ClickEventForEditButton
                    }], title: "Action &nbsp;"
                }],
            editable: false,
            selectable: "row",
            navigatable: true,
            toolbar: ["search"],
            search: {
                fields: ["IssueNo"]
            }
        });
    },
    LoadGridData: function () {
        var grid = $("#grdLoanIssueSummary").data("kendoGrid");
        var gridData = LoanIssueSummaryManager.LoanIssueGridDataSource(CurrentUser.USERID);
        grid.setDataSource(gridData);
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdLoanIssueSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            if (selectedItem.IsReceived === true) {
                $("#btnSave").hide();
                $("#lblMessage").text("Already Received! Can't Update Now.");
            } else {
                $("#lblMessage").text("");
                $("#btnSave").show();
            }
            $("#divSummary").hide();
            $("#divDetails").show();
            LoanIssueDetailsHelper.FillLoanIssueMasterForm(selectedItem);
        }
    }
};