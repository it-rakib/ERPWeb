var ContractLCSummaryManager = {
    gridDataSource: function (search) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/ComSalesContract/GetParentSCforLCGridWithSearch?searchkey=' + $.trim(search),
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
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
                    id: "Scid",
                    fields: {
                        Scid: { editable: false },
                        Scno: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
};

var ContractLCSummaryHelper = {
    InitContractLCSummary: function () {
        ContractLCSummaryHelper.GenerateContractLCGrid();
        //ContractLCSummaryHelper.LoadDataSource();
        $('#search').on('input', function (e) {
            ContractLCSummaryHelper.LoadDataSource();
        });
    },
    GenerateContractLCGrid: function () {
        $("#gridContractLCSummary").kendoGrid({
            dataSource: [],
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: [
                { field: "Scid", hidden: true },
                { field: "ContractId", title: "Contract ID", sortable: true },
                { field: "Scno", title: "Contract No", sortable: true },
                { field: "Scdate", title: "SC Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(Scdate), "dd-MMM-yyyy") #' },
                { field: "BuyerName", title: "Buyer", sortable: true },
                { field: "OpenBankName", title: "Open Bank", sortable: true },
                { field: "LienBankName", title: "Lien Bank", sortable: true },
                { field: "RcvThroughBank", title: "Rcv Through", sortable: true },
                { field: "BeneficiaryName", title: "Beneficiary", sortable: true },
                { field: "SCTypeName", title: "SC Type", sortable: true }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });

        $("#gridContractLCSummary").on("dblclick", "tr.k-state-selected", function () {
            debugger;
            var grid = $("#gridContractLCSummary").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if (selectedItem != null) {
                    ContractInfoHelper.FillContractFormByParent(selectedItem);
                    $("#divSCLCModal").data("kendoWindow").close();
                }
            }
        });
    },
    LoadDataSource: function () {
        var search = $("#search").val();      
        var grid = $("#gridContractLCSummary").data("kendoGrid");
        var data = ContractLCSummaryManager.gridDataSource(search);
        grid.setDataSource(data);
    },    
};