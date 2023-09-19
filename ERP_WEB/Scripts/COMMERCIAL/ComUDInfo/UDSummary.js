
var UDSummaryManager = {
    gridDataSource: function ()
    {
        
        var objComp = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + '/api/ComUd';
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
var UDSummaryHelper = {
    InitUDSummary: function ()
    {
        UDSummaryHelper.GenerateUDGrid();
        UDSummaryHelper.LoadDataList();
    },
    GenerateUDGrid: function ()
    {
        $( "#grdUDSummary" ).kendoGrid( {
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
                //fields: ["UDtempId"]
                fields: ["Udno", "ScNo", "BblcNo"]
            },
            columns: [
                
                { field: "Udid", hidden: true },
                { field: "Udno", title: "UD No", sortable: true },
                { field: "UdQty", title: "UD Qty", sortable: true },

                { field: "Uddate", title: "UD Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(Uddate), "dd-MMM-yyyy") #' },
                {
                    title: "SC detailes",
                    columns: [
                        { field: "Scid", hidden: true },
                { field: "ScNo", title: "SC No", sortable: true },
                    ]
                },

                
               
              
                { field: "PaperRequsitionDate", title: "Paper Req. Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(PaperRequsitionDate), "dd-MMM-yyyy") #' },
                { field: "PaperReceiveDate", title: "Paper Rec. Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(PaperReceiveDate), "dd-MMM-yyyy") #' },
                { field: "BgmeasubmissionDate", title: "BGMEA Sub. Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(BgmeasubmissionDate), "dd-MMM-yyyy") #' },


            ],
            editable: false,
            selectable: "row",
            navigatable: true
        } );

        $( "#grdUDSummary" ).on( "dblclick", "tr.k-state-selected", function ()
        {
            UDInfoHelper.ClearForm();
            var grid = $( "#grdUDSummary" ).data( "kendoGrid" );
            if ( grid.select().length > 0 )
            {
                var selectedItem = grid.dataItem( grid.select() );
                if ( selectedItem != null ) {
                    debugger;
                    $( "#divUDModal" ).data( "kendoWindow" ).close();
                    UDInfoHelper.FillForm( selectedItem );
                
                    
                }
            }
        } );
    },
    LoadDataList: function () {
          

        var data =  UDSummaryManager.gridDataSource();
        
        var grid = $( "#grdUDSummary" ).data( "kendoGrid" );
        var gridDataSource = new kendo.data.DataSource( {
            data: data,
            pageSize: 10


        } );


        grid.setDataSource( gridDataSource );
       

    }
}

 