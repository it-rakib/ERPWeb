var isAdmin = false;
var DriverPerformanceSummaryManager = {
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
                    url: _baseUrlTransport + '/api/DriverPerformance/GetAllGridData',
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
var DriverPerformanceSummaryHelper = {
    InitDriverPerformanceSummary: function () {

        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        DriverPerformanceSummaryHelper.GenerateDriverPerformanceGrid();
    },

    GenerateDriverPerformanceGrid: function () {
        $("#grdDriverPerformanceSummary").kendoGrid({
            dataSource: DriverPerformanceSummaryManager.gridDataSource(),
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
                { field: "DriverPerformanceId", hidden: true },
                { field: "DriverName", title: "Driver", sortable: true },
                { field: "SalaryStatusName", title: "Salary Status", sortable: true },
                { field: "OtStatusName", title: "Over Time", sortable: true },
                { field: "OverTimePayment", title: "OT Payment", sortable: true },
                { field: "PerformanceBonus", title: "Performance Bonus", sortable: true },
                { field: "PenaltyReason", title: "Penalty Reason", sortable: true },
                { field: "PenaltyAmount", title: "Penalty Amount", sortable: true },                
                { field: "PenaltyDate", title: "Penalty Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(PenaltyDate), "dd-MM-yyyy") #' },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: DriverPerformanceSummaryHelper.ClickEventForEditButton
                    }], /*hidden: !isAdmin,*/ title: "&nbsp;"
                },
                {
                    command: [
                        {
                            name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: DriverPerformanceSummaryHelper.ClickEventForDeleteButton
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
        var grid = $("#grdDriverPerformanceSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");

            DriverPerformanceDetailsHelper.FillDriverPerformanceForm(selectedItem);
        }
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdDriverPerformanceSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                selectedItem.IsDeleted = true;
                DriverPerformanceDetailsHelper.FillDriverPerformanceForm(selectedItem);
                DriverPerformanceDetailsManager.SaveVehiclePerformanceDetails();
            } 
        } else {
            text = "Canceled!";
        }
    },


}