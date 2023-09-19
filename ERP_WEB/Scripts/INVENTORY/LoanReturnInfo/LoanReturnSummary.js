var LoanReturnSummaryManager = {
    LoanReturnGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/LoanReturn/GetAllLoanReturnInfoGrid/' + userId,
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

var LoanReturnSummaryHelper = {
    InitLoanReturnSummary: function () {
        LoanReturnSummaryHelper.GenerateLoanReturnGrid();
        LoanReturnSummaryHelper.LoadLoanReturnGridDataSource();
    },
    GenerateLoanReturnGrid: function () {
        $("#grdLoanReturnSummary").kendoGrid({
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
                { field: "Remarks", title: "Remarks", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LoanReturnSummaryHelper.ClickEventForEdit
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
    LoadLoanReturnGridDataSource: function () {
        var grid = $("#grdLoanReturnSummary").data("kendoGrid");
        var data = LoanReturnSummaryManager.LoanReturnGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    ClickEventForEdit: function (e) {
        e.preventDefault();
        var grid = $("#grdLoanReturnSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            if (selectedItem.IsReceived === true) {
                $("#btnSave").hide();
                $("#lblMessage").text("This is already Received!");
            } else {
                $("#lblMessage").text("");
                $("#btnSave").show();
            }
            $("#divSummary").hide();
            $("#divDetails").show();
            LoanReturnDetailsHelper.FillLoanReturnMasterForm(selectedItem);
        }
    }
};