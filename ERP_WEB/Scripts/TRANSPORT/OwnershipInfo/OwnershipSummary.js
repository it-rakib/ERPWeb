var isAdmin = false;
var OwnershipSummaryManager = {
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
                    url: _baseUrlTransport + '/api/VehicleOwnership/GetAllGridData',
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
                        //BuyerName: { type: "string" },
                        //CountryName: {
                        //    defaultValue: { CountryId: 0, CountryName: "---Select---" }
                        //}
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        debugger;
        return gridDataSource;
    },
}
var OwnershipSummaryHelper = {
    InitOwnershipSummary: function () {
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        OwnershipSummaryHelper.GenerateOwnershipGrid();
    },

    GenerateOwnershipGrid: function () {
        $("#grdOwnershipSummary").kendoGrid({
            dataSource: OwnershipSummaryManager.gridDataSource(),
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
                fields: ["RtacircleOfficeName"]
            },
            columns: [
                { field: "OwnerShipId", hidden: true},
                { field: "OwnerShipName", title: "OwnerShip Name", sortable: true},
                { field: "IsDeleted", title: "Is Deleted", hidden: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: OwnershipSummaryHelper.ClickEventForEditButton
                    }
                    ], title: "&nbsp;"
                },
                {
                    command: [
                        {
                            name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: OwnershipSummaryHelper.ClickEventForDeleteButton
                        }
                    ], hidden: !isAdmin, title: "&nbsp;"
                }
                //{
                //    command: [{
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: OwnershipSummaryHelper.ClickEventForEditButton
                //    },
                //    {
                //        name: "delete", text: "", iconClass: "k-icon k-i-delete", className: "k-danger", click: OwnershipSummaryHelper.ClickEventForDeleteButton
                //    }

                //    ], width: 10
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdOwnershipSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            OwnershipDetailsHelper.FillOwnershipForm(selectedItem);
        }
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        let text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdOwnershipSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                $("#btnSave").text("Delete");
                selectedItem.IsDeleted = true;
                OwnershipDetailsHelper.FillOwnershipForm(selectedItem);
                OwnershipDetailsManager.SaveOwnershipDetails();
            }
        } else {
            text = "Canceled!";
        }
    }

}