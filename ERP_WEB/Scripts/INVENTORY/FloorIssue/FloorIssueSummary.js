var FloorIssueSummaryManager = {
    PendingFloorRequisitionGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/FloorIssue/GetFloorRequisitionGridForFloorIssue/' + $.trim(userId),
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
    FloorIssueGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/FloorIssue/GetAllFloorIssueInfoGrid/'+ userId,
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

var FloorIssueSummaryHelper = {
    InitFloorIssueSummary: function () {
        FloorIssueSummaryHelper.GenerateRequisitionPendingGrid();
        FloorIssueSummaryHelper.LoadRequisitionDataSource();
        FloorIssueSummaryHelper.GenerateFloorIssueGrid();
        FloorIssueSummaryHelper.LoadGridData();
    },
    GenerateRequisitionPendingGrid: function () {
        $("#grdPendingFloorRequisitionList").kendoGrid({
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
                        name: "edit", text: "Issue", iconClass: "k-icon k-i-arrow-down", className: "k-success", click: FloorIssueSummaryHelper.ClickEventForIssued
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

        $("#grdPendingFloorRequisitionList").on("dblclick", "tr.k-state-selected", function () {
            var grid = $("#grdPendingFloorRequisitionList").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if (selectedItem != null) {
                    $("#divFloorIssueSummary").hide();
                    $("#divFloorIssueDetails").show();
                    FloorIssueDetailsHelper.FillFloorIssueMasterFormByRequisition(selectedItem);
                }
            }
        });
    },
    LoadRequisitionDataSource: function () {
        var grid = $("#grdPendingFloorRequisitionList").data("kendoGrid");
        var data = FloorIssueSummaryManager.PendingFloorRequisitionGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    ClickEventForIssued: function (e) {
        e.preventDefault();
        var grid = $("#grdPendingFloorRequisitionList").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divFloorIssueSummary").hide();
            $("#divFloorIssueDetails").show();
            FloorIssueDetailsHelper.FillFloorIssueMasterFormByRequisition(selectedItem);
        }
    },

    GenerateFloorIssueGrid: function () {
        $("#grdFloorIssueSummary").kendoGrid({
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
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: FloorIssueSummaryHelper.ClickEventForEditButton
                    }], title: "Action &nbsp;"
                }],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadGridData: function () {
        var grid = $("#grdFloorIssueSummary").data("kendoGrid");
        var gridData = FloorIssueSummaryManager.FloorIssueGridDataSource(CurrentUser.USERID);
        grid.setDataSource(gridData);
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdFloorIssueSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            if (selectedItem.IsReceived === true) {
                $("#btnSave").hide();
                $("#lblMessage").text("Already Received! Can't update Now.");
            } else {
                $("#lblMessage").text("");
                $("#btnSave").show();
            }
            $("#divFloorIssueSummary").hide();
            $("#divFloorIssueDetails").show();
            FloorIssueDetailsHelper.FillFloorIssueMasterForm(selectedItem);
        }
    }
};