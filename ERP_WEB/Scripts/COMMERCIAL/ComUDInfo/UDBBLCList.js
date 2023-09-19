
var UDBBLCManager = {
    gridDataSource: function ( scId )
    {
        var gridDataSource = new kendo.data.DataSource( {
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/ComBackToBack/GetAllBBLCGridByScAsync?scId=' + $.trim( scId ),
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json;",
                    cache: false,
                    async: false
                },
                parameterMap: function ( options )
                {
                    return JSON.stringify( options );
                }
            },
            batch: true,
            schema: {
                model: {
                    fields: {
                        PIDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        }

                    }
                },
                data: "Items", total: "TotalCount"
            }
        } );
        return gridDataSource;
    },
}
var UDBBLCHelper = {
    InitUDBBLC: function ()
    {
        UDBBLCHelper.GenerateUnattachedBBLCGrid();
        UDBBLCHelper.GenerateAttachedBBLCGrid();
        //UDBBLCHelper.LoadDataList();
    },
    GenerateUnattachedBBLCGrid: function () {
       
        $( "#gridUnattachedBBLCList" ).kendoGrid( {
            dataSource: [],
            pageable: {
                pageSize: 5
            },

            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "Bblcid", hidden: true },
                { field: "Bblcno", title: "BBLC No", sortable: true },
                

                { field: "Bblcdate", title: "BBLC Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(Bblcdate), "dd-MMM-yyyy") #' },
                { field: "Bbamount", title: "BBLC Amt", sortable: true },
               // { field: "Scid", hidden: true },
               // { field: "ScNo", title: "Supplier Name", sortable: true },
               
              
                //{ field: "PaperRequsitionDate", title: "Paper Req. Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(PaperRequsitionDate), "dd-MMM-yyyy") #' },
              //  { field: "PaperReceiveDate", title: "Paper Rec. Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(PaperReceiveDate), "dd-MMM-yyyy") #' },
              //  { field: "BgmeasubmissionDate", title: "BGMEA Sub. Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(BgmeasubmissionDate), "dd-MMM-yyyy") #' },
              {
                  command: [{
                      name: "Add", text: "", iconClass: "k-icon k-i-plus", className: "k-success", click: UDBBLCHelper.ClickEventForAddButton
                  }], width: "12%", title: "&nbsp;"
              }

            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            toolbar: ["search"],
            search: {
                fields: ["Bblcno"]
            }
        } );

        //$( "#grdUDBBLC" ).on( "dblclick", "tr.k-state-selected", function ()
        //{
              
        //    var grid = $( "#grdUDBBLC" ).data( "kendoGrid" );
        //    if ( grid.select().length > 0 )
        //    {
        //        var selectedItem = grid.dataItem( grid.select() );
        //        if ( selectedItem != null )
        //        {
        //            $( "#divUDModal" ).data( "kendoWindow" ).close();
        //            UDInfoHelper.FillForm( selectedItem );
                
                    
        //        }
        //    }
        //} );
    },
    GenerateAttachedBBLCGrid: function ()
    {
        $( "#gridAttachedBBLCList" ).kendoGrid( {
            dataSource: [],
            pageable: {
                pageSize: 5
            },

            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "Bblcid", hidden: true },
                { field: "Bblcno", title: "BBLC No", sortable: true },


                { field: "Bblcdate", title: "BBLC Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(Bblcdate), "dd-MMM-yyyy") #' },
                { field: "Bbamount", title: "BBLC Amt", sortable: true },
               // { field: "Scid", hidden: true },
               // { field: "ScNo", title: "Supplier Name", sortable: true },


                //{ field: "PaperRequsitionDate", title: "Paper Req. Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(PaperRequsitionDate), "dd-MMM-yyyy") #' },
              //  { field: "PaperReceiveDate", title: "Paper Rec. Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(PaperReceiveDate), "dd-MMM-yyyy") #' },
              //  { field: "BgmeasubmissionDate", title: "BGMEA Sub. Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(BgmeasubmissionDate), "dd-MMM-yyyy") #' },
              {
                  command: [{
                      name: "Remove", text: "", iconClass: "k-icon k-i-close-outline k-i-x-outline k-i-error", className: "btn glyphicon glyphicon-trash", click: UDBBLCHelper.ClickEventForRemoveButton
                      // name: "destroy", className: "btn glyphicon glyphicon-trash", click: PIInfoSummaryBBHelper.ClickEventForEditButton
                  }], width: "12%", title: "&nbsp;"
              }

            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            toolbar: ["search"],
            search: {
                fields: ["Bblcno"]
            }
        } );

        //$( "#grdUDBBLC" ).on( "dblclick", "tr.k-state-selected", function ()
        //{
              
        //    var grid = $( "#grdUDBBLC" ).data( "kendoGrid" );
        //    if ( grid.select().length > 0 )
        //    {
        //        var selectedItem = grid.dataItem( grid.select() );
        //        if ( selectedItem != null )
        //        {
        //            $( "#divUDModal" ).data( "kendoWindow" ).close();
        //            UDInfoHelper.FillForm( selectedItem );
                
                    
        //        }
        //    }
        //} );
    },

    ClickEventForRemoveButton: function ( e )
    {

        e.preventDefault();;
        var gridSelected = $( "#gridAttachedBBLCList" ).data( "kendoGrid" );
        var tr = $( e.currentTarget ).closest( "tr" );
       
        var selectedItem = this.dataItem( tr );
        gridSelected.select( tr );
        if ( selectedItem != null )
        {

            gbUnSelectedBBLC.push( selectedItem );
            gridSelected.dataSource.remove( selectedItem );
            var grid = $( "#gridUnattachedBBLCList" ).data( "kendoGrid" );
          
            grid.setDataSource( gbUnSelectedBBLC );
            for ( var i = 0; i < gbSelectedBBLC.length; i++ )
            {
                if ( gbSelectedBBLC[i].PIId === selectedItem.PIId )
                {
                    gbSelectedBBLC.splice( i, 1 );
                    break;
                }
            }

        }
    },
    ClickEventForAddButton: function ( e )
    {

        e.preventDefault();
        var grid = $( "#gridUnattachedBBLCList" ).data( "kendoGrid" );
        var tr = $( e.currentTarget ).closest( "tr" );
       
        var selectedItem = this.dataItem( tr );
        grid.select( tr );
        if ( selectedItem != null )
        {
            gbSelectedBBLC.push( selectedItem );
            grid.dataSource.remove( selectedItem );
            var gridSelected = $( "#gridAttachedBBLCList" ).data( "kendoGrid" );

                               
            gridSelected.setDataSource( gbSelectedBBLC );
            for ( var i = 0; i < gbUnSelectedBBLC.length; i++ )
            {
                if ( gbUnSelectedBBLC[i].PIId === selectedItem.PIId )
                {
                    gbUnSelectedBBLC.splice( i, 1 );
                    break;
                }
            }
        }
        console.log(gbSelectedBBLC);
    },
    LoadDataListinUnattached: function (scId) {
        debugger;
        var grid = $( "#gridUnattachedBBLCList" ).data( "kendoGrid" );
        var data = UDBBLCManager.gridDataSource( scId );
        grid.setDataSource( data );
        var gg = data._data;
        $.each( data._data, function ( i, item )
        {

            gbUnSelectedBBLC.push( data._data[i] );
        } );

    },
    LoadDataListinAttached: function ( Item ) {
        debugger;
        var grid = $( "#gridUnattachedBBLCList" ).data( "kendoGrid" );
        var gridSelected = $( "#gridAttachedBBLCList" ).data( "kendoGrid" );
        if ( Item != null )
        {
            $.each( Item, function ( i, item )
            {

                for ( var j = 0; j < gbUnSelectedBBLC.length; j++ ) {
                    debugger;

                    if ( gbUnSelectedBBLC[j].Bblcid === Item[i].Bblcid )
                    {
                        gbSelectedBBLC.push( gbUnSelectedBBLC[j] );
                        grid.dataSource.remove( gbUnSelectedBBLC[j] );
                        gbUnSelectedBBLC.splice( j, 1 );
                        break;
                    }
                }


                gridSelected.setDataSource( gbSelectedBBLC );

            } );

        }
    }

}

 