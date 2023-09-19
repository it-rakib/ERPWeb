var isAdmin = false;
var ExpenseSummaryManager = {
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
                    url: _baseUrlLegal + '/api/Expense/GetAllGridData',
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

                },
                data: "Items", total: "TotalCount"
            },
            aggregate: [
                { field: "Amount", aggregate: "sum" }
            ]
        });
        
        return gridDataSource;
    },
}
var ExpenseSummaryHelper = {
    InitExpenseSummary: function () {
        
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        ExpenseSummaryHelper.GenerateExpenseGrid();
    },

    GenerateExpenseGrid: function () {
        $("#grdExpenseSummary").kendoGrid({
            dataSource: ExpenseSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            toolbar: ["search"],
            search: {
                fields: ["RegNo"]
            },
            columns: [
                { field: "ExpenseId", hidden: true },
                { field: "FileMasterId", hidden: true },
                { field: "ExpenseDate", title: "Expense Date", template: '#= kendo.toString(kendo.parseDate(ExpenseDate), "dd-MM-yyyy") #' },
                { field: "ExpenseName", title: "Expense" },
                { field: "CaseNo", title: "Case No" },
                { field: "CourtName", title: "Court" },
                { field: "FileTypeName", title: "FileType" },
                { field: "Amount", title: "Expense Amnt", sortable: true, title: "Expense Amount", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: ExpenseSummaryHelper.ClickEventForEditButton
                    }], hidden: !isAdmin, title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdExpenseSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            //$("#divExpenseSummary").hide();
            //$("#divExpenseDetails").show();
            
            ExpenseDetailsHelper.FillExpenseForm(selectedItem);
        }
    }


}