var FileCodeSummaryManager = {
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
                    url: _baseUrlLand + '/api/FileCode/GetAllGridData',
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

var FileCodeSummaryHelper = {
    InitFileCodeSummary: function () {
        FileCodeSummaryHelper.GenerateFileCodeGrid();
    },
    GenerateFileCodeGrid: function () {
        $("#grdFileCodeSummary").kendoGrid({
            dataSource: FileCodeSummaryManager.gridDataSource(),
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
                fields: ["FileCodeInfoName"]
            },
            columns: [
                { field: "FileCodeInfoId", hidden: true },
                { field: "FileCodeInfoName", title: "Name", sortable: true },
                { field: "FileCodeInfoFullName", title: "FullName", sortable: true },
                { field: "IsActive", title: "Is Active", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: FileCodeSummaryHelper.ClickEventForEditButton
                    },
                        {
                            name: "delete", text: "", iconClass: "k-icon k-i-delete", className: "k-danger", click: FileCodeSummaryHelper.ClickEventForDeleteButton
                        }
                    ], title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdFileCodeSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            FileCodeDetailsHelper.FillFileCodeForm(selectedItem);
        }
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        let text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdFileCodeSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                $("#btnSave").text("Delete");
                FileCodeDetailsHelper.FillFileCodeDeleteForm(selectedItem);
                FileCodeDetailsManager.SaveFileCodeDetails();
            }  
        } else {
            text = "Canceled!";
        }
    }
}