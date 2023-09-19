var ComGroupLcSummaryManager = {
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
                    url: _baseUrl + '/api/ComGroupLc/GetAllGridData',
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
        return gridDataSource;
    },
}
var ComGroupLcSummaryHelper = {
    InitComGroupLcSummary: function () {
        ComGroupLcSummaryHelper.GenerateComGroupLcGrid();
    },

    GenerateComGroupLcGrid: function () {
        $("#grdComGroupLcSummary").kendoGrid({
            dataSource: ComGroupLcSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            //toolbar: ["search"],
            //search: {
            //    fields: ["CompanyName"]
            //},
            columns: [
                { field: "GroupLcid", hidden: true, width: 10 },

                { field: "CompanyName", title: "Company Name", sortable: true, width: 20 },
                { field: "BuyerName", title: "Buyer Name", sortable: true, width: 20 },
                { field: "GroupAmount", title: "Group Amount", sortable: true, width: 20 },
                { field: "UsedAmount", title: "Used Amount", sortable: true, width: 20 },
                //{ field: "CompanyIdentered", title: "Company Identered", sortable: true, width: 20 },
                //{ field: "CompanyIdlastUpdated", title: "CompanyId lastUpdated", sortable: true, width: 20 },
                { field: "IsAllBuyer", title: "Is AllBuyer", width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: ComGroupLcSummaryHelper.ClickEventForEditButton
                    }], width: 10
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdComGroupLcSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            ComGroupLcDetailsHelper.FillComGroupLcForm(selectedItem);
        }
    },

}