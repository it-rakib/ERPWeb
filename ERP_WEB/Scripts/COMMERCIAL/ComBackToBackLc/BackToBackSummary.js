var gbBBLCSummList = [];
var BBLCSummaryManager = {
    gridDataSource: function ()
    {
        
        var objComp = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + '/api/ComBackToBack';
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
}
var BBLCSummaryHelper = {
    InitBBLCSummary: function ()
    {
        BBLCSummaryHelper.GenerateBBLCGrid();
        BBLCSummaryHelper.LoadDataList();
    },
    GenerateBBLCGrid: function ()
    {
        $( "#grdBBLCSummary" ).kendoGrid( {
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
                //fields: ["BblctempId"]
                fields: ["BblctempId", "Bblcno", "Bblcdate", "SupplierName"]
            },
            columns: [
                { field: "Bblcid", hidden: true },
                { field: "BblctempId", title: "BBLC ID", sortable: true },
                { field: "Bblcno", title: "BBLC No", sortable: true },
                { field: "Bblcdate", title: "BBLC Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(Bblcdate), "dd-MMM-yyyy") #' },
                { field: "SupplierName", title: "SupplierName", sortable: true }
              
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        } );

        $( "#grdBBLCSummary" ).on( "dblclick", "tr.k-state-selected", function () {
              
            var grid = $( "#grdBBLCSummary" ).data( "kendoGrid" );
            if ( grid.select().length > 0 )
            {
                var selectedItem = grid.dataItem( grid.select() );
                if ( selectedItem != null )
                {
                    //for ( var i = 0; i < gbBBLCSummList.length; i++ )
                    //{
                    //    if ( gbBBLCSummList[i].Bblcid === selectedItem.Bblcid )
                    //    {
                    //        selectedItem = gbBBLCSummList[i];
                    //        break;
                    //    }
                    //}
                    gbSelectedPi = [];
                    gbUnSelectedPi = [];
                     //PIInfoSummaryBBHelper.InitPIInfoSummaryBB();
                     $( "#gridSelectedPIList" ).data( "kendoGrid" ).dataSource.data( [] );
                     $( "#gridPIList" ).data( "kendoGrid" ).dataSource.data( [] );
                    
                    BackToBackInfoHelper.ClearForm();
                    $( "#divBBModal" ).data( "kendoWindow" ).close();
                    BackToBackInfoHelper.FillForm( selectedItem, true );
                   
                 //   ContractAmendmentHelper.LoadAmendmentGrid(selectedItem.Scid);
                    
                }
            }
        } );
    },
    LoadDataList: function () {
          

        var data = BBLCSummaryManager.gridDataSource();
        gbBBLCSummList = data;
        var grid = $( "#grdBBLCSummary" ).data( "kendoGrid" );

        var gridDataSource = new kendo.data.DataSource( {
            data: data,
            pageSize: 5,


        } );


        grid.setDataSource( gridDataSource );
       

    }
}

 