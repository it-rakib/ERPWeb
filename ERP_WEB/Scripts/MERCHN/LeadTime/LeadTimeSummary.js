var LeadTimeSummaryManager = {
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
                    url: _baseUrl + '/api/LeadTimes/GetAllGridData',
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
    }
}

var LeadTimeSummaryHelper = {
    InitLeadTimeSummary: function () {
        LeadTimeSummaryHelper.GenerateLeadTimeGrid();
    },
    GenerateLeadTimeGrid: function () {
        $("#grdLeadTimeSummary").kendoGrid({
            dataSource: LeadTimeSummaryManager.gridDataSource(),
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
                fields: ["LeadTimeName"]
            },
            columns: [
                { field: "LeadTimeId", hidden: true, width:10 },
                { field: "LeadTimeName", title: "Lead Time Name", sortable: true, width: 20 },
                { field: "BuyerId", hidden: true, width: 10 },
                { field: "BuyerName", title: "Buyer Name", sortable: true, width: 20 },
                { field: "BrandId", hidden: true, width: 10 },
                { field: "BrandName", title: "Brand Name", sortable: true, width: 20 },
                { field: "DepartmentId", hidden: true, width: 10 },
                { field: "DepartmentName", title: "Brand Name", sortable: true, width: 20 },
                { field: "IsActive", title: "Is Active", width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LeadTimeSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdLeadTimeSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            LeadTimeDetailsHelper.FillLeadTimeForm(selectedItem);
        }
    }
}