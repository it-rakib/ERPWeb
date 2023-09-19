var RequisitionListSearchManager = {
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
                    //url: _baseUrl + '/api/Styles/GetConfirmStyleForInvIssueGrid/?searchText=' + $.trim(search),
                    url: _baseUrl + '/api/InvIssue/GetRequisitionGridForIssue/'+ $.trim(userId),
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
                        RequisitionNo: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    }
};

var RequisitionListSearchHelper = {
    InitRequisitionListSearch: function () {
        RequisitionListSearchHelper.GenerateRequisitionSummaryGrid();

        $('#txtRequisitionNo').on('input', function (e) {
            RequisitionListSearchHelper.LoadDataSource();
        });
        $("#popupRequisitionSearch").kendoWindow({
            title: "Pending Requisition List",
            resizeable: true,
            width: "60%",
            actions: ["Pin", "Refresh", "Maximize", "Close"],
            modal: true,
            visible: false
        });
        $("#btnSearchRequisition").click(function () {
            RequisitionListSearchHelper.LoadDataSource();
            $("#popupRequisitionSearch").data("kendoWindow").open().center();
        });
        $("#btnClose").click(function () {
            $("#popupRequisitionSearch").data("kendoWindow").close();
        });
    },
    GenerateRequisitionSummaryGrid: function () {
        $("#grdRequisitionSummary").kendoGrid({
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
                //{ field: "PIId", hidden: true },
                //{ field: "PINo", title: "PI No", width: 10, sortable: true },
                { field: "Remarks", title: "Remarks", width: 10, sortable: true },
                {
                    command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-arrow-down", className: "k-success", click: RequisitionListSearchHelper.ClickEventForSelectButton
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
        
        $("#grdRequisitionSummary").on("dblclick", "tr.k-state-selected", function () {
            var grid = $("#grdRequisitionSummary").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if (selectedItem != null) {
                    IssueItemListHelper.LoadIssueItemListGridByRequisition(selectedItem);
                    $("#popupRequisitionSearch").data("kendoWindow").close();
                }
            }
        });
    },
    LoadDataSource: function () {
        var requisitionNo = $("#txtRequisitionNo").val();
        var storeId = $("#cmbFromStore").data("kendoComboBox").value();
        var grid = $("#grdRequisitionSummary").data("kendoGrid");
        var data = RequisitionListSearchManager.gridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    ClickEventForSelectButton: function (e) {
        e.preventDefault();
        var grid = $("#grdRequisitionSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            IssueItemListHelper.LoadIssueItemListGridByRequisition(selectedItem);
            $("#popupRequisitionSearch").data("kendoWindow").close();  
        }
    }
};