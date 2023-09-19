
var OwnerSummaryManager = {
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
                    url: _baseUrlLand + '/api/OwnerInfo/GetAllGridData',
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
    DeleteOwnerInfo: function (id) {
        debugger;
        var dltDataSource = new kendo.data.DataSource({
            type: "json",
            //serverPaging: true,
            //serverSorting: true,
            //serverFiltering: true,
            //allowUnsort: true,
            //pageSize: 10,
            transport: {
                destroy: {
                    url: _baseUrlLand + '/api/OwnerInfo/' + id,
                    type: "DELETE",
                    dataType: "json",
                    contentType: "application/json;",
                    cache: false,
                    async: false
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            batch: true
        });
        debugger;
        return dltDataSource;
    }
}

var OwnerSummaryHelper = {
    InitOwnerSummary: function () {
        OwnerSummaryHelper.GenerateOwnerGrid();
    },
    GenerateOwnerGrid: function () {
        $("#grdOwnerSummary").kendoGrid({
            dataSource: OwnerSummaryManager.gridDataSource(),
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
                fields: ["OwnerInfoName"]
            },
            columns: [
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Owner Name", sortable: true },
                { field: "Status", title: "Status", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: OwnerSummaryHelper.ClickEventForEditButton
                    },
                        {
                            name: "delete", text: "", iconClass: "k-icon k-i-delete", className: "k-danger", click: OwnerSummaryHelper.ClickEventForDeleteButton
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
        var grid = $("#grdOwnerSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            OwnerDetailsHelper.FillOwnerForm(selectedItem);
        }
    },
    ClickEventForDeleteButton: function (e) {
        debugger;
        e.preventDefault();
        let text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdOwnerSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                $("#btnSave").text("Delete");
                OwnerDetailsHelper.FillOwnerFormDelete(selectedItem);
                OwnerDetailsManager.SaveOwnerDetails();
            }
        } else {
            text = "Canceled!";
        }

    }
}