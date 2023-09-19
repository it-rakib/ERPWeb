
var ColorSummaryManager = {
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
                    url: _baseUrl + '/api/CmnColors/GetAllGridData',
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
                    ColorName: { type: "string" },
                    ColorCode: {type: "string"}
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },


}

var ColorSummaryHelper = {
    InitColorSummary: function () {
        ColorSummaryHelper.GenerateColorGrid();
    },

    GenerateColorGrid: function () {
        $("#grdColorSummary").kendoGrid({
            dataSource: ColorSummaryManager.gridDataSource(),
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
                fields: ["ColorName"]
            },
            columns: [
                { field: "ColorId", hidden: true },
                { field: "ColorName", title: "Color Name", sortable: true },
                { field: "ColorCode", title: "Color Code", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: ColorSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdColorSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            ColorDetailsHelper.FillColorForm(selectedItem);
        }
    }
}