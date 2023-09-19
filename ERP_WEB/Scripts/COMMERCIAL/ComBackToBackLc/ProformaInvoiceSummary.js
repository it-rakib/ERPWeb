
var PIInfoSummaryBBManager = {
    gridDataSource: function ( supplierId )
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
                    url: _baseUrl + '/api/ProformaInvoice/GetAllPIGridBySupplierAsync?supplierId=' + $.trim( supplierId ),
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
};

var PIInfoSummaryBBHelper = {
    InitPIInfoSummaryBB: function ()
    {
        PIInfoSummaryBBHelper.GeneratePISummaryGrid();
        PIInfoSummaryBBHelper.GenerateSelectedPISummaryGrid();
        $( "#gridPIList" ).show();
    },
    GenerateSelectedPISummaryGrid: function ()
    {
        $( "#gridSelectedPIList" ).kendoGrid( {
            dataSource: [],
            pageable: {
              
               
               
                
                pageSize:5
            },
            
            
            //noRecords: {
            //    template: "<label>NO DATA FOUND</label>"
            //},
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "PIId", hidden: true },
                { field: "PINo", title: "PI No", width: "25%", sortable: true, headerAttributes: { "class": "k-text-center" }, attributes: { "class": "k-text-center" } },
                { field: "PIDate", title: "PI Date", width: "20%", sortable: true,headerAttributes: { "class": "k-text-center" }, attributes: { "class": "k-text-center" }, template: '#=kendo.toString(PIDate==null?"":PIDate,"dd-MMM-yyyy")#' },
              //  { field: "SupplierName", title: "Style No", width: 40, sortable: true },
                { field: "PaymentTermName", title: "Pay. Term", width: "30%", sortable: true, headerAttributes: { "class": "k-text-center" }, attributes: { "class": "k-text-center" } },
                { field: "TotalAmount", title: "Amt", width: "20%", sortable: true, headerAttributes: { "class": "k-text-center" }, attributes: { "class": "k-text-center" } },
                { field: "CurrencyCode", title: "Currency", width: "15%", sortable: true, headerAttributes: { "class": "k-text-center" }, attributes: { "class": "k-text-center" } },
                // { field: "Edit", title: "Action", filterable: false, width: 15, template: '<button type="button" class="btn glyphicon glyphicon-trash" value="Edit" id="btnEdit" onClick="PIInfoSummaryBBHelper.ClickEventForEditButton(event)" ></button>', sortable: false }

                {
                    command: [{
                        name: "Remove", text: "", iconClass: "k-icon k-i-close-outline k-i-x-outline k-i-error", className: "btn glyphicon glyphicon-trash", click: PIInfoSummaryBBHelper.ClickEventForRemoveButton
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
                fields: ["PINo"]
            }
        } );
    },
    GeneratePISummaryGrid: function ()
    {
        $( "#gridPIList" ).kendoGrid( {
            dataSource: [],
            pageable: {
               
              
                pageSize:5
            },
           
            
            //noRecords: {
            //    template: "<label>NO DATA FOUND</label>"
            //},
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "PIId", hidden: true },
                { field: "PINo", title: "PI No", width: "25%", sortable: true },
                { field: "PIDate", title: "PI Date", width: "20%", sortable: true, template: '#=kendo.toString(PIDate==null?"":PIDate,"dd-MMM-yyyy")#' },
                //{ field: "SupplierName", title: "Style No", width: 30, sortable: true },
                { field: "PaymentTermName", title: "Pay. Term", width: "30%", sortable: true },
                { field: "TotalAmount", title: "Amt", width: "20%", sortable: true },
                { field: "CurrencyCode", title: "Currency", width: "15%", sortable: true },


                {
                    command: [{
                        name: "Add",text:"", iconClass: "k-icon k-i-plus", className: "k-success", click: PIInfoSummaryBBHelper.ClickEventForAddButton
                    }], width: "12%", title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            toolbar: ["search"],
            search: {
                fields: ["PINo"]
            }
        } );
    },
    ClickEventForRemoveButton: function ( e )
    {
          
        e.preventDefault();;
        var gridSelected = $( "#gridSelectedPIList" ).data( "kendoGrid" );
        var tr = $( e.currentTarget ).closest( "tr" );
        var bbAmount = $( "#txtBBLCAmt" ).data( "kendoNumericTextBox" ).value();
        var selectedItem = this.dataItem( tr );
        gridSelected.select( tr );
        if ( selectedItem != null ) {
             
            gbUnSelectedPi.push( selectedItem );
            gridSelected.dataSource.remove( selectedItem );
            var grid = $( "#gridPIList" ).data( "kendoGrid" );
            if ( bbAmount != "" && bbAmount != null )
            {
                var m = kendo.parseFloat( bbAmount ) - selectedItem.TotalAmount;
                $( "#txtBBLCAmt" ).data( "kendoNumericTextBox" ).value( m );
            } else
            {
                $( "#txtBBLCAmt" ).data( "kendoNumericTextBox" ).value( "" );
            }
            var totalamn = kendo.parseFloat( $( "#lblBBLCUsed" ).text() );
            var lblBblcLimit = kendo.parseFloat( $( "#lblBBLCLimit" ).text() );
            var lblScAmt = kendo.parseFloat( $( "#lblSCAmt" ).text() );
            var total = Math.round( totalamn - selectedItem.TotalAmount );
            var lblBblcLimitPer = kendo.parseFloat( $( "#lblBBLCLimitPercentage" ).text() );
            var lblBblcUsedPercentage = Math.round(( total * 100 ) / lblScAmt );
            $( "#lblBBLCUsed" ).text( total );
            $( "#lblBBLCUsedPercentage" ).text( lblBblcUsedPercentage );
            $( "#lblBalance" ).text( Math.round( lblBblcLimit - total ) );
            $( "#lblBalancePercentage" ).text( lblBblcLimitPer - lblBblcUsedPercentage );
            grid.setDataSource( gbUnSelectedPi );
            for ( var i = 0; i < gbSelectedPi.length; i++ )
            {
                if ( gbSelectedPi[i].PIId === selectedItem.PIId )
                {
                    gbSelectedPi.splice( i, 1 );
                    break;
                }
            }

        }
    },
    ClickEventForAddButton: function ( e ) {
         
        e.preventDefault();
        var grid = $( "#gridPIList" ).data( "kendoGrid" );
        var tr = $( e.currentTarget ).closest( "tr" );
        var bbAmount = $( "#txtBBLCAmt" ).data( "kendoNumericTextBox" ).value();
        var selectedItem = this.dataItem( tr );
        grid.select( tr );
        if ( selectedItem != null )
        {
            var totalamn = kendo.parseFloat( $( "#lblBBLCUsed" ).text() );
            var lblBblcLimit = kendo.parseFloat( $( "#lblBBLCLimit" ).text() );
            var lblScAmt = kendo.parseFloat( $( "#lblSCAmt" ).text() );
            var lblBblcLimitPer = kendo.parseFloat( $( "#lblBBLCLimitPercentage" ).text() );
            var total = Math.round( selectedItem.TotalAmount + totalamn );
            var lblBblcUsedPercentage = Math.round(( total * 100 ) / lblScAmt );
            var checkdata = $( "#cboPayTerm" ).data( "kendoComboBox" ).value();
            if ( total > lblBblcLimit )
            {
                AjaxManager.MsgBox( 'warning', 'center', 'Warning:', "Sorry, unable to add this PI, it's exceeded the limit",
                    [
                        {
                            addClass: 'btn btn-success glyphicon glyphicon-ok',
                            text: 'Yes',
                            onClick: function ( $noty )
                            {
                                $noty.close();

                            }
                        }

                    ] );
            } else
            {

                if ( selectedItem.PaymentTermId !== checkdata )
                {
                    AjaxManager.MsgBox( 'warning', 'center', 'Warning:', "Are you sure you want to add different payment type PI",
                    [
                        {
                            addClass: 'btn btn-success glyphicon glyphicon-ok',
                            text: 'Yes',
                            onClick: function ( $noty )
                            {
                                $noty.close();

                                $( "#lblBBLCUsed" ).text( total );
                                $( "#lblBBLCUsedPercentage" ).text( lblBblcUsedPercentage );
                                $( "#lblBalance" ).text( Math.round( lblBblcLimit - total ) );
                                $( "#lblBalancePercentage" ).text( lblBblcLimitPer - lblBblcUsedPercentage );

                                gbSelectedPi.push( selectedItem );
                                grid.dataSource.remove( selectedItem );
                                var gridSelected = $( "#gridSelectedPIList" ).data( "kendoGrid" );
                                 
                                if ( bbAmount != "" && bbAmount != null )
                                {
                                    var m = kendo.parseFloat( bbAmount ) + selectedItem.TotalAmount;

                                    $( "#txtBBLCAmt" ).data( "kendoNumericTextBox" ).value( m );
                                } else
                                {

                                    $( "#txtBBLCAmt" ).data( "kendoNumericTextBox" ).value( selectedItem.TotalAmount );
                                }

                                gridSelected.setDataSource( gbSelectedPi );
                                for ( var i = 0; i < gbUnSelectedPi.length; i++ )
                                {
                                    if ( gbUnSelectedPi[i].PIId === selectedItem.PIId )
                                    {
                                        gbUnSelectedPi.splice( i, 1 );
                                        break;
                                    }
                                }
                            }
                        },
                         {
                             addClass: 'btn btn-danger glyphicon glyphicon-remove',
                             text: 'No',
                             onClick: function ( $noty )
                             {
                                 $noty.close();

                             }
                         }

                    ] );
                } else
                {
                    $( "#lblBBLCUsed" ).text( total );
                    $( "#lblBBLCUsedPercentage" ).text( lblBblcUsedPercentage );
                    $( "#lblBalance" ).text( Math.round( lblBblcLimit - total ) );
                    $( "#lblBalancePercentage" ).text( lblBblcLimitPer - lblBblcUsedPercentage );
                    gbSelectedPi.push( selectedItem );
                    grid.dataSource.remove( selectedItem );
                    var gridSelected = $( "#gridSelectedPIList" ).data( "kendoGrid" );
                     
                    if ( bbAmount != "" && bbAmount != null )
                    {
                        var m = kendo.parseFloat( bbAmount ) + selectedItem.TotalAmount;
                        $( "#txtBBLCAmt" ).data( "kendoNumericTextBox" ).value( m );
                    } else
                    {
                        $( "#txtBBLCAmt" ).data( "kendoNumericTextBox" ).value( selectedItem.TotalAmount );
                    }
                    gridSelected.setDataSource( gbSelectedPi );
                    for ( var i = 0; i < gbUnSelectedPi.length; i++ )
                    {
                        if ( gbUnSelectedPi[i].PIId === selectedItem.PIId )
                        {
                            gbUnSelectedPi.splice( i, 1 );
                            break;
                        }
                    }
                }

              

            }
         


        }
    },

    LoadGridDatainUnattached: function ( supplierId ) {
         

        var grid = $( "#gridPIList" ).data( "kendoGrid" );
        var data = PIInfoSummaryBBManager.gridDataSource( supplierId );
        grid.setDataSource( data );
        var gg = data._data;
        $.each( data._data, function ( i, item )
        {
              
            gbUnSelectedPi.push( data._data[i] );
        } );
    },
    LoadSavedPiData: function ( Item ) {
         
        var grid = $( "#gridPIList" ).data( "kendoGrid" );
        var gridSelected = $( "#gridSelectedPIList" ).data( "kendoGrid" );
        if ( Item != null )
        {
            $.each( Item, function ( i, item )
            {
                  
                for ( var j = 0; j < gbUnSelectedPi.length; j++ )
                {
                     
                    if ( gbUnSelectedPi[j].PIId === Item[i].Piid )
                    {
                        gbSelectedPi.push( gbUnSelectedPi[j] );
                        grid.dataSource.remove( gbUnSelectedPi[j] );
                        gbUnSelectedPi.splice( j, 1 );
                        break;
                    }
                }


                gridSelected.setDataSource( gbSelectedPi );

            } );

        }

    }
};