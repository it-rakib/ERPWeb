var SizeSummaryManager = {
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
                    url: _baseUrl + '/api/CmnSizes/GetAllGridData',
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
                    fields: {
                        SizeName: { type: "string" }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
}

var SizeSummaryHelper = {
    InitSizeSummary: function () {
        SizeSummaryHelper.GenerateSizeGrid();
    },

    GenerateSizeGrid: function () {
        $("#grdSizeSummary").kendoGrid({
            dataSource: SizeSummaryManager.gridDataSource(),
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
                fields: ["SizeName"]
            },
            columns: [
                { field: "SizeId", hidden: true },
                { field: "SizeName", title: "Size Name", sortable: true },
                 {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: SizeSummaryHelper.ClickEventForEditButton
                     }]
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },


    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdSizeSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            SizeDetailsHelper.FillSizeForm(selectedItem);
        }
    },
}