
var CmnMouzaSummaryManager = {
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
                    url: _baseUrlLand + '/api/CmnMouza/GetAllGridData',
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
    }
}
var CmnMouzaSummaryHelper = {
    InitCmnMouzaSummary: function () {
        CmnMouzaSummaryHelper.GenerateCmnMouzaGrid();
    },
    GenerateCmnMouzaGrid: function () {
        $("#grdCmnMouzaSummary").kendoGrid({
            dataSource: CmnMouzaSummaryManager.gridDataSource(),
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
                fields: ["MouzaName"]
            },
            columns: [
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza Name", sortable: true },
                { field: "UpozilaName", title: "Upozila", sortable: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "DivisionName", title: "Division", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: CmnMouzaSummaryHelper.ClickEventForEditButton
                    }], title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdCmnMouzaSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            CmnMouzaDetailsHelper.FillCmnMouzaForm(selectedItem);
        }
    }
}