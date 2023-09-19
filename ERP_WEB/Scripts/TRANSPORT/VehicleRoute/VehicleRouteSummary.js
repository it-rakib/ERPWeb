var isAdmin = false;
var RouteSummaryManager = {
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
                    url: _baseUrlTransport + '/api/VehicleRoute/GetAllGridData',
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
var RouteSummaryHelper = {
    InitRouteSummary: function () {

        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        RouteSummaryHelper.GenerateRouteGrid();
    },

    GenerateRouteGrid: function () {
        $("#grdRouteSummary").kendoGrid({
            dataSource: RouteSummaryManager.gridDataSource(),
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
                { field: "VehicleRouteId", hidden: true },
                { field: "VehicleRouteName", title: "Route", sortable: true },
                { field: "Destination", title: "Destination", sortable: true },
                { field: "StartPoint", title: "Start Point", sortable: true },
                { field: "Description", title: "Description", sortable: true },
                { field: "IsActive", title: "Is Active", sortable: true },

                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: RouteSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdRouteSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            RouteDetailsHelper.FillRouteForm(selectedItem);
        }
    }


}