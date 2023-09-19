var UomSummaryManager = {
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
                    url: _baseUrl + '/api/CmnUoms/GetAllGridData',
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
var UomSummaryHelper = {
    InitUomSummary: function () {
        UomSummaryHelper.GenerateUomGrid();
    },
    GenerateUomGrid: function () {
        $("#grdUomSummary").kendoGrid({
            dataSource: UomSummaryManager.gridDataSource(),
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
                fields: ["Uomname"]
            },
            columns: [
                { field: "Uomid", hidden: true },
                { field: "Uomname", title: "Uom Name", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: UomSummaryHelper.ClickEventForEditButton
                    }], title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    ClickEventForEditButton: function (e) {
        debugger;
        e.preventDefault();
        var grid = $("#grdUomSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            UomDetailsHelper.FillUomForm(selectedItem);
        }
    }
}