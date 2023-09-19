
var CmnUpozilaSummaryManager = {
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
                    url: _baseUrlLand + '/api/CmnUpozila/GetAllGridData',
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

var CmnUpozilaSummaryHelper = {
    InitCmnUpozilaSummary: function () {
        CmnUpozilaSummaryHelper.GenerateCmnUpozilaGrid();
    },
    GenerateCmnUpozilaGrid: function () {
        $("#grdCmnUpozilaSummary").kendoGrid({
            dataSource: CmnUpozilaSummaryManager.gridDataSource(),
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
                fields: ["UpozilaName"]
            },
            columns: [
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upozila", sortable: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "DivisionName", title: "Division", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: CmnUpozilaSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdCmnUpozilaSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            CmnUpozilaDetailsHelper.FillCmnUpozilaForm(selectedItem);
        }
    }
}