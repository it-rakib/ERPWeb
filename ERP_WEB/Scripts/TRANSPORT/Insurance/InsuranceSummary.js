var isAdmin = false;
var InsuranceSummaryManager = {
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
                    url: _baseUrlTransport + '/api/Insurance/GetAllGridData',
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
            }
        });

        return gridDataSource;
    },
}
var InsuranceSummaryHelper = {
    InitInsuranceSummary: function () {

        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        InsuranceSummaryHelper.GenerateInsuranceGrid();
    },

    GenerateInsuranceGrid: function () {
        $("#grdInsuranceSummary").kendoGrid({
            dataSource: InsuranceSummaryManager.gridDataSource(),
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
                fields: ["DriverName"]
            },
            columns: [
                { field: "InsuranceId", hidden: true },
                { field: "InsuranceCompanyName", title: "Company", sortable: true },
                { field: "VehicleName", title: "Vehicle", sortable: true },
                { field: "RecurringPeriodName", title: "Recurring Period", sortable: true },
                { field: "PolicyNumber", title: "Policy Number", sortable: true },
                { field: "ChargePayable", title: "Charge Payable", sortable: true },
                { field: "StartDate", title: "Start Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(StartDate), "dd-MM-yyyy") #' },
                { field: "EndDate", title: "End Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(EndDate), "dd-MM-yyyy") #' },
                { field: "RecurringDate", title: "Recurring Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(RecurringDate), "dd-MM-yyyy") #' },
                { field: "Deductable", title: "Deductable", sortable: true },
                { field: "Remarks", title: "Remarks", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: InsuranceSummaryHelper.ClickEventForEditButton
                    }], /*hidden: !isAdmin,*/ title: "&nbsp;"
                },
                {
                    command: [
                        {
                            name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: InsuranceSummaryHelper.ClickEventForDeleteButton
                        }
                    ], hidden: !isAdmin, title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdInsuranceSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");

            InsuranceDetailsHelper.FillInsuranceForm(selectedItem);
        }
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdInsuranceSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                selectedItem.IsDeleted = true;
                InsuranceDetailsHelper.FillInsuranceForm(selectedItem);
                InsuranceDetailsManager.SaveInsuranceDetails();
            }
        } else {
            text = "Canceled!";
        }
    },


}