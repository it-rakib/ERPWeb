var isAdmin = false;
var CourtInfoSummaryManager = {
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
                    url: _baseUrlLegal + '/api/Court/GetAllGridData',
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
var CourtInfoSummaryHelper = {
    InitCourtSummary: function () {

        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        CourtInfoSummaryHelper.GenerateCourtGrid();
    },

    GenerateCourtGrid: function () {
        $("#grdCourtInfoSummary").kendoGrid({
            dataSource: CourtInfoSummaryManager.gridDataSource(),
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
                fields: ["CourtName"]
            },
            columns: [
                { field: "CourtId", hidden: true },
                { field: "CourtName", title: "Court", sortable: true },
                { field: "CourtNo", title: "Court No", sortable: true },
                { field: "Email", title: "Email", sortable: true },
                { field: "Phone", title: "Phone", sortable: true },                
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "JurisdictionName", title: "Jurisdiction", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: CourtInfoSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdCourtInfoSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
    
            CourtDetailsHelper.FillCourtForm(selectedItem);
        }
    }


}