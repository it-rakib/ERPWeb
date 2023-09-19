var BrandDepartmentSummaryManager = {
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
                    url: _baseUrl + '/api/BrandDepartments/GetAllGridData',
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
                    //fields: {
                    //    BuyerName: { type: "string" },
                    //    CountryName: {
                    //        defaultValue: { CountryId: 0, CountryName: "---Select---" }
                    //    }
                    //}
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
}
var BrandDepartmentSummaryHelper = {
    InitBrandDepartmentSummary: function () {
        BrandDepartmentSummaryHelper.GenerateBrandDepartmentGrid();
    },
    GenerateBrandDepartmentGrid: function () {
        $("#grdDepartmentSummary").kendoGrid({
            dataSource: BrandDepartmentSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverpaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            selectable:"row",
            toolbar: ["search"],
            search: {
                fields: ["BuyerDepartmentName"]
            },
            columns: [
                { field: "DepartmentId ", hidden: true, width: 10 },
                { field: "BuyerName", title: "Buyer Name",sortable: true, width: 20 },
                { field: "BrandName", title: "Brand Name", sortable: true, width: 20 },
                { field: "BuyerDepartmentName ", title: "Department Name", sortable: true, width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: BrandDepartmentSummaryHelper.ClickEventForEditButton
                    }], width: 10
                }
            ]
        });
    },

        ClickEventForEditButton: function (e) {
        e.preventDefault();
            var grid = $("#grdDepartmentSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            BrandDepartmentDetailsHelper.FillBrandDepartmentForm(selectedItem);
        }
    },
}