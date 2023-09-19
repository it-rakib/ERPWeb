
var PurSupplierItemSummaryManager = {
    gridDataSource: function (SupplierId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,

            serverSorting: true,

            serverFiltering: true,

            allowUnsort: true,

            pageSize: 10,

            transport: {
                read: {
                    url: _baseUrl + '/api/PurSupplierItem/GetAllGridData/?SupplierId=' + SupplierId,

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
                data: "Items", total: "TotalCount",
                model: {
                    fields: {
                        SupplierName: { type: "string" }
                    }
                },
            }
        });
        return gridDataSource;
    }
};
var PurSupplierItemSummaryHelper = {
    InitPurSupplierItemSummary: function () {
        PurSupplierItemSummaryHelper.GenerateSupplierGrid();
    },
    GenerateSupplierGrid: function () {
        $("#grdSupplierSummary").kendoGrid({
            dataSource: PurSupplierItemSummaryManager.gridDataSource(),
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
                fields: ["SupplierName"]
            },
            columns: PurSupplierItemSummaryHelper.GenerateSupplierColumns(),
            editable: false,
            navigatable: true,
            selectable: "row",
        });

    },
    GenerateSupplierColumns: function () {
        return columns = [
            
            { field: "SupplierName", title: "Suppliers", width: 60 },
            { field: "ItemName", title: "Items", width: 110 },
            {
                field: "Action", title: "Action", filterable: false, width: 20, command: [{
                    name: "edit", text: "", iconClass: "k-icon k-i-search", className: "k-success", click: PurSupplierItemSummaryHelper.clickEventForEditButton
                }], sortable: false
            }

        ];
    },
    clickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdSupplierSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#hdnSupplierId").val(selectedItem.SupplierId);
            var groupId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbItemGroup").data("kendoComboBox").value());
            var categoryId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbItemCategory").data("kendoComboBox").value());
            var data = PurSupplierItemPermissionSummaryManager.gridDataSource(selectedItem.SupplierId, groupId, categoryId);
            $("#gridSupplierPermission").data("kendoGrid").setDataSource(data);
        }

    },
}