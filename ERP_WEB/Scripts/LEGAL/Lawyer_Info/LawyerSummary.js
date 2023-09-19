var isAdmin = false;
var LawyerSummaryManager = {
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
                    url: _baseUrlLegal + '/api/LawyerInfo/GetAllGridData',
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
var LawyerSummaryHelper = {
    InitLawyerSummary: function () {

        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        LawyerSummaryHelper.GenerateLawyerGrid();
        //var dataSource = LawyerSummaryManager.gridDataSource();
        //var grid = $("#grdOppositeSummary").data('kendoGrid');
        //grid.setDataSource(dataSource);
    },

    GenerateLawyerGrid: function () {
        $("#grdLawyerSummary").kendoGrid({
            dataSource: LawyerSummaryManager.gridDataSource(),
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
                fields: ["LawyerName"]
            },
            columns: [
                { field: "LawyerId", hidden: true },
                { field: "LawyerName", title: "Lawyer", sortable: true },
                { field: "Email", title: "Email", sortable: true },
                { field: "ContactNo", title: "Phone", sortable: true },
                { field: "LawyerAddress", title: "Address", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LawyerSummaryHelper.ClickEventForEditButton
                    }], hidden: !isAdmin, title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdLawyerSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            LawyerDetailsHelper.FillLawyerForm(selectedItem);
        }
    }
}