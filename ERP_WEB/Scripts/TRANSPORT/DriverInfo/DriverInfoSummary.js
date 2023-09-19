var isAdmin = false;
var DriverInfoSummaryManager = {
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
                    url: _baseUrlTransport + '/api/Driver/GetAllGridData',
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
var DriverInfoSummaryHelper = {
    InitDriverSummary: function () {

        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        DriverInfoSummaryHelper.GenerateDriverGrid();
    },

    GenerateDriverGrid: function () {
        $("#grdDriverInfoSummary").kendoGrid({
            dataSource: DriverInfoSummaryManager.gridDataSource(),
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
                { field: "DriverId", hidden: true },
                { field: "DriverName", title: "Driver", sortable: true },
                { field: "EmpId", hidden: true },
                { field: "EmpName", title: "Employee", sortable: true },
                { field: "ManualId", title: "Manual Id", sortable: true },
                { field: "LicenseNumber", title: "License Number", sortable: true },
                { field: "WorkTime", title: "Work Time", sortable: true, template: '#= kendo.toString(kendo.parseDate(WorkTime), "h:mm tt") #' },               
                { field: "LicenseTypeName", title: "License Type", sortable: true },
                { field: "LicenseIssueDate", title: "License Issue Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(LicenseIssueDate), "dd-MM-yyyy") #'},
                { field: "LicenseExpiredDate", title: "License Expired Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(LicenseExpiredDate), "dd-MM-yyyy") #' },
                { field: "DutyTypeId", hidden: true },
                { field: "DutyTypeName", title: "Duty Type", sortable: true },
                { field: "DriverExperience", title: "Driver Experience", sortable: true },
                { field: "DriverContact", title: "DriverContact", sortable: true },
                
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: DriverInfoSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdDriverInfoSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");

            DriverInfoDetailsHelper.FillDriverForm(selectedItem);
        }
    }


}