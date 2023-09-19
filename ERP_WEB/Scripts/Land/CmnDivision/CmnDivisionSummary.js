//
var CmnDivisionSummaryManager = {
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
                    url: _baseUrlLand + '/api/CmnDivision/GetAllGridData',
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

var CmnDivisionSummaryHelper = {
    InitCmnDivisionSummary: function () {
        CmnDivisionSummaryHelper.GenerateCmnDivisionGrid();
    },
    GenerateCmnDivisionGrid: function () {
        $("#grdCmnDivisionSummary").kendoGrid({
            dataSource: CmnDivisionSummaryManager.gridDataSource(),
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
                fields: ["DivisionName"]
            },
            columns: [
                { field: "DivisionId", hidden: true },
                { field: "DivisionName", title: "Division Name", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: CmnDivisionSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdCmnDivisionSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            CmnDivisionDetailsHelper.FillCmnDivisionForm(selectedItem);
        }
    }
}