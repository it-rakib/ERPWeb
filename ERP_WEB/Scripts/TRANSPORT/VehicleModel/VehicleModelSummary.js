var isAdmin = false;
var ModelSummaryManager = {
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
                    url: _baseUrlTransport + "/api/VehicleModel/GetAllGridData",
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
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
}
var ModelSummaryHelper = {
    InitModelSummary: function () {
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);

        ModelSummaryHelper.GenerateModelGrid();
    },

    GenerateModelGrid: function () {
        $("#grdModelSummary").kendoGrid({
            dataSource: ModelSummaryManager.gridDataSource(),
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
                fields: ["ModelName"]
            },
            columns: [
                { field: "ModelId", hidden: true, width: 10 },
                { field: "ModelName", title: "Model", sortable: true, width: 20 },
                { field: "VehicleBrandName", title: "Brand Name", width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: ModelSummaryHelper.ClickEventForEditButton
                    }
                    ], title: "&nbsp;", width: 10
                },
                {
                    command: [
                        {
                            name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: ModelSummaryHelper.ClickEventForDeleteButton
                        }
                    ], hidden: !isAdmin, title: "&nbsp;", width: 10
                }
                //{
                //    command: [{
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: ModelSummaryHelper.ClickEventForEditButton
                //    }], width: 10
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdModelSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            ModelDetailsHelper.FillModelForm(selectedItem);
        }
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        let text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdModelSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                $("#btnSave").text("Delete");
                
                selectedItem.IsDeleted = true;
                ModelDetailsHelper.FillModelForm(selectedItem);
                debugger;
                ModelDetailsManager.SaveModelDetails();
            }
        } else {
            text = "Canceled!";
        }
    }

}