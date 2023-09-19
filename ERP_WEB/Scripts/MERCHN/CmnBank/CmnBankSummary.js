var CmnBankSummaryManager = {
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
                    url: _baseUrl + '/api/CmnBank/GetAllGridData',
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
var CmnBankSummaryHelper = {
    InitBankSummary: function () {
        CmnBankSummaryHelper.GenerateCmnBankGrid();
    },

    GenerateCmnBankGrid: function () {
        $("#grdBankSummary").kendoGrid({
            dataSource: CmnBankSummaryManager.gridDataSource(),
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
                fields: ["BankName"]
            },
            columns: [
                { field: "BankID", hidden: true, width: 10 },
                { field: "BankName", title: "Bank Name", sortable: true, width: 20 },
                { field: "BranchName", title: "Branch Name", sortable: true, width: 20 },
                { field: "Address1", title: "Address 1", sortable: true, width: 20 },
                { field: "Address2", title: "Address 2", sortable: true, width: 20 },
                { field: "Address3", title: "Address 3", sortable: true, width: 20 },
                { field: "PhoneNo", title: "Phone No", sortable: true, width: 20 },
                { field: "FaxNo", title: "Fax No", sortable: true, width: 20 },
                { field: "Email", title: "Email", sortable: true, width: 20 },
                { field: "ContractPerson", title: "ContractPerson", sortable: true, width: 20 },
                { field: "IsFacilityOptional", title: "Is FacilityOptional", width: 20 },
                { field: "Remarks", title: "Remarks", width: 20 },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: CmnBankSummaryHelper.ClickEventForEditButton
                    }], width: 10
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },

    ClickEventForEditButton: function (e) {
        debugger;
        e.preventDefault();
        var grid = $("#grdBankSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            CmnBankDetailsHelper.FillBankForm(selectedItem);
        }
    },

}