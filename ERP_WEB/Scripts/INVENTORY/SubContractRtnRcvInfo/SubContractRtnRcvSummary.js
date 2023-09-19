var SubContractRtnRcvSummaryManager = {
    PendingSubContractRtnRcvGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + "/api/SubContractRtnRcv/GetSubContractReturnGridForSubContractRtnRcv/" + $.trim(userId),
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
    },
    SubContractRtnRcvGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/SubContractRtnRcv/GetAllSubContractRtnRcvGrid/' + userId,
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

var SubContractRtnRcvSummaryHelper = {
    InitSubContractRtnRcvSummary: function () {
        SubContractRtnRcvSummaryHelper.GenerateIssuePendingReceiveGrid();
        SubContractRtnRcvSummaryHelper.LoadPendingSubContractRtnRcvGridDataSource();
        SubContractRtnRcvSummaryHelper.GenerateSubContractRtnRcvGrid();
        SubContractRtnRcvSummaryHelper.LoadSubContractRtnRcvGridDataSource();
    },
    GenerateIssuePendingReceiveGrid: function () {
        $("#grdPendingSubContractReturnList").kendoGrid({
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
            toolbar: ["search"],
            search: {
                fields: ["IssueNo"]
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
                        name: "edit", text: "Acknowledge", iconClass: "k-icon k-i-check-circle", className: "k-success", click: SubContractRtnRcvSummaryHelper.ClickEventForReceive
                    }], title: "Action &nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadPendingSubContractRtnRcvGridDataSource: function () {
        var search = $("#search").val();
        var grid = $("#grdPendingSubContractReturnList").data("kendoGrid");
        var data = SubContractRtnRcvSummaryManager.PendingSubContractRtnRcvGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    ClickEventForReceive: function (e) {
        e.preventDefault();
        var grid = $("#grdPendingSubContractReturnList").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divSummary").hide();
            $("#divDetails").show();
            SubContractRtnRcvDetailsHelper.FillReturnMasterForm(selectedItem);
        }
    },

    GenerateSubContractRtnRcvGrid: function () {
        $("#grdSubContractRtnRcvSummary").kendoGrid({
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
            toolbar: ["search"],
            search: {
                fields: ["ReceiveNo"]
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
                        name: "edit", text: "View", iconClass: "k-icon k-i-eye", className: "k-success", click: SubContractRtnRcvSummaryHelper.ClickEventForEdit
                    }], title: "Action &nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadSubContractRtnRcvGridDataSource: function () {
        var grid = $("#grdSubContractRtnRcvSummary").data("kendoGrid");
        var data = SubContractRtnRcvSummaryManager.SubContractRtnRcvGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    ClickEventForEdit: function (e) {
        e.preventDefault();
        var grid = $("#grdSubContractRtnRcvSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").hide();
            $("#divSummary").hide();
            $("#divDetails").show();
            SubContractRtnRcvDetailsHelper.FillSubContractRtnRcvMasterForm(selectedItem);
        }
    }
};