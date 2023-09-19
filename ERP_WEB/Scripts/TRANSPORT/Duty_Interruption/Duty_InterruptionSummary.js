var isAdmin = false;
var DutyInterruptionSummaryManager = {
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
                    url: _baseUrlTransport + '/api/DutyInterruption/GetAllGridData',
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
var DutyInterruptionSummaryHelper = {
    InitDutyInterruptionSummary: function () {
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        DutyInterruptionSummaryHelper.GenerateDutyInterruptionGrid();
    },

    GenerateDutyInterruptionGrid: function () {
        $("#grdDutyInterruptSummary").kendoGrid({
            dataSource: DutyInterruptionSummaryManager.gridDataSource(),
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
                { field: "DutyInterruptionId", hidden: true },
                { field: "VehicleName", title: "Vehicle", sortable: true },
                { field: "DriverName", title: "Driver", sortable: true },
                { field: "ProblemTypeName", title: "Problem", sortable: true },
                { field: "ProblemDetails", title: "Problem Details", sortable: true },
                { field: "NoticeDate", title: "Notice Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(NoticeDate), "dd-MM-yyyy") #' },
                { field: "WorkShop", title: "WorkShop", sortable: true },
                { field: "RepairDuration", title: "RepairDuration", sortable: true },               
                { field: "EstimatedReturnDate", title: "Estimated Return", sortable: true, template: '#= kendo.toString(kendo.parseDate(EstimatedReturnDate), "dd-MM-yyyy") #' },           
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: DutyInterruptionSummaryHelper.ClickEventForEditButton
                    }], /*hidden: !isAdmin,*/ title: "&nbsp;"
                },
                {
                    command: [
                        {
                            name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: DutyInterruptionSummaryHelper.ClickEventForDeleteButton
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
        var grid = $("#grdDutyInterruptSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");

            DutyInterruptionDetailsHelper.FillDutyInterruptionForm(selectedItem);
        }
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdDutyInterruptSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                selectedItem.IsDeleted = true;
                DutyInterruptionDetailsHelper.FillDutyInterruptionForm(selectedItem);
                DutyInterruptionDetailsManager.SaveDutyInterruptionDetails();
            } 
        } else {
            text = "Canceled!";
        }
    },


}