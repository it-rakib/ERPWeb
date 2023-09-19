var ContractSummaryManager = {
    gridListDataSource: function ()
    {

        var objComp = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + '/api/ComSalesContract/all';
        window.AjaxManager.GetJsonResult( serviceUrl, jsonParam, false, false, onSuccess, onFailed );

        function onSuccess( jsonData )
        {
            objComp = jsonData;
        }
        function onFailed( error )
        {
            window.alert( error.statusText );
        }
        return objComp;
    },
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
                    url: _baseUrl + '/api/ComSalesContract/GetAllGridData',
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
var ContractSummaryHelper = {
    InitContractSummary: function () {
        ContractSummaryHelper.GenerateContractGrid();
        //ContractSummaryHelper.LoadContractGridDataSource();
    },
    GenerateContractGrid: function () {
        $("#grdScContactSummary").kendoGrid({
            dataSource: [],
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
                fields: ["Scno"]
            },
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

        $("#grdScContactSummary").on("dblclick", "tr.k-state-selected", function () {
            //debugger;
            var grid = $("#grdScContactSummary").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if ( selectedItem != null )
                {
                    var data = ContractSummaryManager.gridListDataSource();
                    for ( var i = 0; i < data.length; i++ )
                    {
                        if ( data[i].Scid === selectedItem.Scid ) {
                            selectedItem.FilesVm = data[i].FilesVm;
                            break;
                        }
                    }
                    ContractInfoHelper.FillContractForm( selectedItem, true );
                    

                    ContractInfoHelper.LoadPODataSource(selectedItem.Scid);
                    ContractAmendmentHelper.LoadAmendmentGrid(selectedItem.Scid);
                    $("#divSCModal").data("kendoWindow").close();
                }
            }
        });
    },
    LoadContractGridDataSource: function () {
        var grid = $("#grdScContactSummary").data("kendoGrid");
        var data = ContractSummaryManager.gridDataSource();
        grid.setDataSource( data );


        //var data = ContractSummaryManager.gridListDataSource();
        
        //var grid = $( "#grdScContactSummary" ).data( "kendoGrid" );

        //var gridDataSource = new kendo.data.DataSource( {
        //    data: data,
        //    pageSize: 10,


        //} );


        //grid.setDataSource( gridDataSource );
    },
}