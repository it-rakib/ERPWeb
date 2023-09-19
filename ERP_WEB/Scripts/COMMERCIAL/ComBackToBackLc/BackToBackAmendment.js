var StaticBBLCId;

var BBLCAmendmentManager = {
    AmendgridDataSource: function ( id ) {
          
        var gridDataSource = new kendo.data.DataSource( {
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 3,
            transport: {
                read: {
                    url: _baseUrl + "/api/ComBackToBack/GetComB2BLcAmendmentById/?id=" +$.trim(id), // Change This
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
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
                    id: "AmendId",
                    fields: {
                        styleId: { editable: false },
                        styleNo: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        } );
        return gridDataSource;
    },
    SaveAmendmentDetails: function () {
          
        var msg = "";
        var command = BBLCAmendmentHelper.CreateAmendmentObject();
        var jsonParam = JSON.stringify( command );
        console.log(jsonParam);
        var serviceUrl = _baseUrl + "/api/ComBackToBack/CreateUpdateComB2BlcAmendment";
        AjaxManager.PostJsonApi( serviceUrl, jsonParam, onSuccess, onFailed );
        function onSuccess( jsonData ) {
              
            if ( jsonData.Success )
            {
                msg = jsonData.Message;
                AjaxManager.MsgBox( 'success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ( $noty ) {
                              
                           
                            BBLCAmendmentHelper.LoadAmendmentGrid( command.Bblcid );
                            BBLCAmendmentHelper.ClearForm( command );
                            $noty.close();
                        }
                    }] );
            }
            else
            {
                msg = jsonData.Message;
                AjaxManager.MsgBox( 'error', 'center', 'Error1', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ( $noty )
                        {
                            $noty.close();
                        }
                    }] );
            }
        }
        function onFailed( error )
        {
            AjaxManager.MsgBox( 'error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ( $noty )
                    {
                        $noty.close();
                    }
                }] );
        }
    },

    LastInsertAmendmentDataSource: function ( ScId )
    {
        var lastInsertAmendment = ApiManager.GetList( _baseUrl + '/api/ComSalesContractAmendment/GetLastInsertedAmendmentByScId/' + ScId );
        return lastInsertAmendment;
    }
};

var BBLCAmendmentHelper = {
    InitBBLCAmendment: function ()
    {
        BBLCAmendmentHelper.GenerateDatePicker();
        BBLCAmendmentHelper.GenerateNumericTextBox();
        BBLCAmendmentHelper.GenerateAmendmentGrid();
        $( "#btnSaveAmendment" ).click( function ()
        {
            BBLCAmendmentManager.SaveAmendmentDetails();
            //BBLCAmendmentManager.LoadAmendmentGrid( StaticScId );
        } );
    },
    LoadAmendmentGrid( id )
    { //Change Parameter
          
        var data = BBLCAmendmentManager.AmendgridDataSource( id );
        $( "#gridAmendment" ).data( "kendoGrid" ).setDataSource( data );
        //var grid = $( "#gridAmendment" ).data( "kendoGrid" ).dataSource.data().length;
        //if ( grid > 0 )
        //{
        //    var lastinsertamend = BBLCAmendmentManager.LastInsertAmendmentDataSource( scid );
        //    $( "#txtSCOpeningValue" ).data( "kendoNumericTextBox" ).readonly();
        //    $( "#txtSCCurrentValue" ).data( "kendoNumericTextBox" ).readonly();
        //    if ( lastinsertamend.TotalAmt > 0 )
        //    {
        //        $( "#txtPreSCAmt" ).data( "kendoNumericTextBox" ).value( lastinsertamend.TotalAmt );
        //    }
        //    if ( lastinsertamend.PreShipDate != null )
        //    {
        //        $( "#dtPreShipDate" ).data( "kendoDatePicker" ).value( lastinsertamend.CurShipDate );
        //    }
        //    if ( lastinsertamend.PreExpDate != null )
        //    {
        //        $( "#dtPreExpDate" ).data( "kendoDatePicker" ).value( lastinsertamend.CurExpDate );
        //    }

        //}
    },
    GenerateAmendmentGrid: function ()
    {
        $( "#gridAmendment" ).kendoGrid( {
            
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

                { field: "AmendID", hidden: true },
                { field: "AmendmentDate", title: "Amendment <br/>Date", editable: false, width: 20, template: '#= kendo.toString(kendo.parseDate(AmendmentDate==null?"":AmendmentDate), "dd-MMM-yyyy") #' },
                { field: "AmendmentNo", title: "Amendment No", editable: false, sortable: true, width: 20 },
                { field: "PreBblcamount", title: "Previous <br/>Amount", editable: false, sortable: true, width: 20 },
                { field: "ChangeBblcamountBy", title: "Changed <br/>By", editable: false, sortable: true, width: 20 },
                { field: "CurrentBblcamount", title: "Current <br/>Amount", editable: false, sortable: true, width: 20 },
                { field: "PreShipDate", title: "Previous <br/>Ship Date", editable: false, sortable: true, width: 20, template: '#= kendo.toString(kendo.parseDate(PreShipDate==null?"":PreShipDate), "dd-MMM-yyyy") #' },
                { field: "CurrentShipDate", title: "Changed <br/>To", editable: false, sortable: true, width: 20, template: '#= kendo.toString(kendo.parseDate(CurrentShipDate==null?"":CurrentShipDate), "dd-MMM-yyyy") #' },
                { field: "PreExpiryDate", title: "Previous <br/>Expire Date", editable: false, sortable: true, width: 20, template: '#= kendo.toString(kendo.parseDate(PreExpiryDate==null?"":PreExpiryDate), "dd-MMM-yyyy") #' },
                { field: "CurrentExpiryDate", title: "Changed <br/>To", editable: false, sortable: true, width: 20, template: '#= kendo.toString(kendo.parseDate(CurrentExpiryDate==null?"":CurrentExpiryDate), "dd-MMM-yyyy") #' },
                { field: "Remarks", title: "Remarks", editable: false, sortable: true, width: 20 }
            ],
            editable: false,
            
            navigatable: true,
            scrollable: true
           
        } );
    },
    InputDatepickerEditor: function ( container, options )
    {
        $( '<input name="' + options.field + '"/>' )
            .appendTo( container )
            .kendoDatePicker( {
                format: "dd-MMM-yyyy"
            } );
    },
    GenerateDatePicker: function ()
    {
        $( "#dtAmendDate,#dtPreShipDate,#dtCurShipDate,#dtPreExpDate,#dtCurExpDate" ).kendoDatePicker( {
            value: new Date(),
            format: "dd-MMM-yyyy"
        } );
    },
    GenerateNumericTextBox: function ()
    {
        $( "#txtPreSCAmt" ).kendoNumericTextBox( {
            format: "#.####",
            min: 0,
            decimals: 4,
            change: function ()
            {
                BBLCAmendmentHelper.CalculateTotalAmount();
            }
        } );
        $( "#txtCurSCAmt" ).kendoNumericTextBox( {
            format: "#.####",
            //min: 0,
            decimals: 4,
            change: function ()
            {
                BBLCAmendmentHelper.CalculateTotalAmount();
            }
        } );
        $( "#txtTotalAmt" ).kendoNumericTextBox( {
            format: "#.####",
            //min: 0,
            decimals: 4
        } );
    },
    CalculateTotalAmount: function ()
    {
        var pre = IkrHelper.EmptyThenZero( $( "#txtPreSCAmt" ).data( "kendoNumericTextBox" ).value() );
        var cur = IkrHelper.EmptyThenZero( $( "#txtCurSCAmt" ).data( "kendoNumericTextBox" ).value() );
        var totalAmount = 0;
        if ( Math.sign( cur ) > 0 )
        {
            totalAmount = ( pre + cur );
        } else
        {
            totalAmount = ( pre + cur );
        }
        $( "#txtTotalAmt" ).data( "kendoNumericTextBox" ).value( totalAmount );
    },
    InitModalEvents: function ( nRowIndex )
    {
        $( "#dtAmendDate" + nRowIndex ).keyup( function ( event )
        {
            var keyCode = ( event.keyCode ? event.keyCode : event.which );
            if ( keyCode == 13 )
            {
                var nMaxRow = $( "#tblBBLCAmendment tbody tr" ).length;
                if ( nRowIndex == nMaxRow )
                {
                    //ContactAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //$("#dtAmendDate" + (nRowIndex + 1)).focus();
                }
            } else if ( keyCode == 40 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#dtAmendDate" + ( nIndex + 1 ) ).focus();
            } else if ( keyCode == 38 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#dtAmendDate" + ( nIndex - 1 ) ).focus();
            } else if ( keyCode == 39 )
            {
                $( "#txtPreSCAmt" + nRowIndex ).focus();
            } else if ( keyCode == 37 )
            {

            }
        } );
        $( "#txtPreSCAmt" + nRowIndex ).keyup( function ( event )
        {
            var keyCode = ( event.keyCode ? event.keyCode : event.which );
            if ( keyCode == 13 )
            {
                var nMaxRow = $( "#tblBBLCAmendment tbody tr" ).length;
                if ( nRowIndex == nMaxRow )
                {
                    //ContactAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //$("#txtPreSCAmt" + (nRowIndex + 1)).focus();
                }
            } else if ( keyCode == 40 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#txtPreSCAmt" + ( nIndex + 1 ) ).focus();
            } else if ( keyCode == 38 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#txtPreSCAmt" + ( nIndex - 1 ) ).focus();
            } else if ( keyCode == 39 )
            {
                $( "#txtCurSCAmt" + nRowIndex ).focus();
            } else if ( keyCode == 37 )
            {
                $( "#dtAmendDate" + nRowIndex ).focus();
            }
        } );
        $( "#txtCurSCAmt" + nRowIndex ).keyup( function ( event )
        {
            var keyCode = ( event.keyCode ? event.keyCode : event.which );
            if ( keyCode == 13 )
            {
                var nMaxRow = $( "#tblBBLCAmendment tbody tr" ).length;
                if ( nRowIndex == nMaxRow )
                {
                    // ContactAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    // $("#txtCurSCAmt" + (nRowIndex + 1)).focus();
                }
            } else if ( keyCode == 40 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#txtCurSCAmt" + ( nIndex + 1 ) ).focus();
            } else if ( keyCode == 38 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#txtCurSCAmt" + ( nIndex - 1 ) ).focus();
            } else if ( keyCode == 39 )
            {
                $( "#txtTotalAmt" + nRowIndex ).focus();
            } else if ( keyCode == 37 )
            {
                $( "#txtPreSCAmt" + nRowIndex ).focus();
            }
        } );
        $( "#txtTotalAmt" + nRowIndex ).keyup( function ( event )
        {
            var keyCode = ( event.keyCode ? event.keyCode : event.which );
            if ( keyCode == 13 )
            {
                var nMaxRow = $( "#tblBBLCAmendment tbody tr" ).length;
                if ( nRowIndex == nMaxRow )
                {
                    //  ContactAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //  $("#txtTotalAmt" + (nRowIndex + 1)).focus();
                }
            } else if ( keyCode == 40 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#txtTotalAmt" + ( nIndex + 1 ) ).focus();
            } else if ( keyCode == 38 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#txtTotalAmt" + ( nIndex - 1 ) ).focus();
            } else if ( keyCode == 39 )
            {
                $( "#dtPreShipDate" + nRowIndex ).focus();
            } else if ( keyCode == 37 )
            {
                $( "#txtCurSCAmt" + nRowIndex ).focus();
            }
        } );
        $( "#dtPreShipDate" + nRowIndex ).keyup( function ( event )
        {
            var keyCode = ( event.keyCode ? event.keyCode : event.which );
            if ( keyCode == 13 )
            {
                var nMaxRow = $( "#tblBBLCAmendment tbody tr" ).length;
                if ( nRowIndex == nMaxRow )
                {
                    //  ContactAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //  $("#dtPreShipDate" + (nRowIndex + 1)).focus();
                }
            } else if ( keyCode == 40 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#dtPreShipDate" + ( nIndex + 1 ) ).focus();
            } else if ( keyCode == 38 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#dtPreShipDate" + ( nIndex - 1 ) ).focus();
            } else if ( keyCode == 39 )
            {
                $( "#dtCurShipDate" + nRowIndex ).focus();
            } else if ( keyCode == 37 )
            {
                $( "#txtTotalAmt" + nRowIndex ).focus();
            }
        } );
        $( "#dtCurShipDate" + nRowIndex ).keyup( function ( event )
        {
            var keyCode = ( event.keyCode ? event.keyCode : event.which );
            if ( keyCode == 13 )
            {
                var nMaxRow = $( "#tblBBLCAmendment tbody tr" ).length;
                if ( nRowIndex == nMaxRow )
                {
                    //  ContactAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //  $("#dtCurShipDate" + (nRowIndex + 1)).focus();
                }
            } else if ( keyCode == 40 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#dtCurShipDate" + ( nIndex + 1 ) ).focus();
            } else if ( keyCode == 38 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#dtCurShipDate" + ( nIndex - 1 ) ).focus();
            } else if ( keyCode == 39 )
            {
                $( "#dtPreExpDate" + nRowIndex ).focus();
            } else if ( keyCode == 37 )
            {
                $( "#dtPreShipDate" + nRowIndex ).focus();
            }
        } );
        $( "#dtPreExpDate" + nRowIndex ).keyup( function ( event )
        {
            var keyCode = ( event.keyCode ? event.keyCode : event.which );
            if ( keyCode == 13 )
            {
                var nMaxRow = $( "#tblBBLCAmendment tbody tr" ).length;
                if ( nRowIndex == nMaxRow )
                {
                    //   ContactAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //   $("#dtPreExpDate" + (nRowIndex + 1)).focus();
                }
            } else if ( keyCode == 40 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#dtPreExpDate" + ( nIndex + 1 ) ).focus();
            } else if ( keyCode == 38 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#dtPreExpDate" + ( nIndex - 1 ) ).focus();
            } else if ( keyCode == 39 )
            {
                $( "#dtCurExpDate" + nRowIndex ).focus();
            } else if ( keyCode == 37 )
            {
                $( "#dtCurShipDate" + nRowIndex ).focus();
            }
        } );
        $( "#dtCurExpDate" + nRowIndex ).keyup( function ( event )
        {
            var keyCode = ( event.keyCode ? event.keyCode : event.which );
            if ( keyCode == 13 )
            {
                var nMaxRow = $( "#tblBBLCAmendment tbody tr" ).length;
                if ( nRowIndex == nMaxRow )
                {
                    //  ContactAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //  $("#dtCurExpDate" + (nRowIndex + 1)).focus();
                }
            } else if ( keyCode == 40 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#dtCurExpDate" + ( nIndex + 1 ) ).focus();
            } else if ( keyCode == 38 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#dtCurExpDate" + ( nIndex - 1 ) ).focus();
            } else if ( keyCode == 39 )
            {
                $( "#txtAmendRemarks" + nRowIndex ).focus();
            } else if ( keyCode == 37 )
            {
                $( "#dtPreExpDate" + nRowIndex ).focus();
            }
        } );
        $( "#txtAmendRemarks" + nRowIndex ).keyup( function ( event )
        {
            var keyCode = ( event.keyCode ? event.keyCode : event.which );
            if ( keyCode == 13 )
            {
                var nMaxRow = $( "#tblBBLCAmendment tbody tr" ).length;
                if ( nRowIndex == nMaxRow )
                {
                    // ContactAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    // $("#txtAmendRemarks" + (nRowIndex + 1)).focus();
                }
            } else if ( keyCode == 40 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#txtAmendRemarks" + ( nIndex + 1 ) ).focus();
            } else if ( keyCode == 38 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#txtAmendRemarks" + ( nIndex - 1 ) ).focus();
            } else if ( keyCode == 39 )
            {
                $( "#btnRemoveRow" + nRowIndex ).focus();
            } else if ( keyCode == 37 )
            {
                $( "#dtCurExpDate" + nRowIndex ).focus();
            }
        } );
        $( "#btnSaveAmendment" + nRowIndex ).keyup( function ( event )
        {
            var keyCode = ( event.keyCode ? event.keyCode : event.which );
            if ( keyCode == 13 )
            {
                ContactAmendmentHelper.SaveAmendMentAction( nRowIndex );
            } else if ( keyCode == 40 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#btnSaveAmendment" + ( nIndex + 1 ) ).focus();
            } else if ( keyCode == 38 )
            {
                var nIndex = parseInt( $( this ).closest( ".trParent" ).attr( "RowIndex" ) );
                $( "#btnSaveAmendment" + ( nIndex - 1 ) ).focus();
            } else if ( keyCode == 39 )
            {

            } else if ( keyCode == 37 )
            {
                $( "#txtAmendRemarks" + nRowIndex ).focus();
            }
        } );
        $( "#btnSaveAmendment" + nRowIndex ).click( function ()
        {
              
            if ( nRowIndex > 0 )
            {
                ContactAmendmentHelper.SaveAmendMentAction( nRowIndex );
            } else
            {
                function onFailed( error )
                {
                    AjaxManager.MsgBox( 'error', 'center', 'Alert', 'No Row Added Yet. Press ENTER to add new row.',
                    [
                        {
                            addClass: 'btn btn-primary',
                            text: 'Ok',
                            onClick: function ( $noty )
                            {
                                $noty.close();
                            }
                        }
                    ] );
                }
            }
        } );
    },
    CreateAmendmentObject: function ( amendmentObj ) {
          
        var obj = new Object();
        obj.AmendId = $( "#hdnAmendId" ).val();
        obj.Bblcid = $( "#hdnBBLCId" ).val();
        obj.AmendmentDate = $( "#dtAmendDate" ).data( "kendoDatePicker" ).value();
        obj.PreBblcamount = $( "#txtPreSCAmt" ).data( "kendoNumericTextBox" ).value();

        obj.ChangeBblcamountBy = $( "#txtCurSCAmt" ).data( "kendoNumericTextBox" ).value();
        if (obj.ChangeBblcamountBy) {
            obj.CurrentBblcamount = $("#txtTotalAmt").data("kendoNumericTextBox").value();
        } else {
            obj.CurrentBblcamount = $( "#txtPreSCAmt" ).data( "kendoNumericTextBox" ).value();
        }
        
        obj.PreShipDate = $( "#dtPreShipDate" ).data( "kendoDatePicker" ).value();
        obj.CurrentShipDate = $( "#dtCurShipDate" ).data( "kendoDatePicker" ).value();
        obj.PreExpiryDate = $( "#dtPreExpDate" ).data( "kendoDatePicker" ).value();
        obj.CurrentExpiryDate = $( "#dtCurExpDate" ).data( "kendoDatePicker" ).value();
        obj.Remarks = $( "#txtAmendRemarks" ).val();
        obj.AmendmentNo = $( "#txtAmendmentNo" ).val();
        return obj;
    },
    ClearForm: function ( obj )
    {
        $( "#hdnAmendId" ).val( "00000000-0000-0000-0000-000000000000" );
        //$("#hdSCId").val("00000000-0000-0000-0000-000000000000");
        $( "#dtAmendDate" ).data( "kendoDatePicker" ).value( "" );
        $( "#txtPreSCAmt" ).data( "kendoNumericTextBox" ).value( obj.CurrentBblcamount );
        $( "#txtCurSCAmt" ).data( "kendoNumericTextBox" ).value( "" );
        $( "#txtTotalAmt" ).data( "kendoNumericTextBox" ).value( "" );
        $( "#dtPreShipDate" ).data( "kendoDatePicker" ).value( obj.CurrentShipDate );
        $( "#dtCurShipDate" ).data( "kendoDatePicker" ).value( "" );
        $( "#dtPreExpDate" ).data( "kendoDatePicker" ).value( obj.CurrentExpiryDate );
        $( "#dtCurExpDate" ).data( "kendoDatePicker" ).value( "" );
        $( "#txtAmendRemarks" ).val( "" );
        $( "#txtAmendmentNo" ).val( "" );
        $( "#lCExpiryDate" ).data( "kendoDatePicker" ).value( obj.CurrentExpiryDate ); $( "#ltShipDate" ).data( "kendoDatePicker" ).value( obj.CurrentShipDate ); $( "#txtBBLCAmt" ).data( "kendoNumericTextBox" ).value( obj.CurrentBblcamount );

    },
    LoadAmendmentData: function ( data )
    {
          
        var grid = $( "#gridAmendment" ).data( "kendoGrid" );
        var gridDataSource = new kendo.data.DataSource( {
            data: data,
            pageSize: 5
            //total:data.legnth
        } );

       
 //var gridDataSource = new kendo.data.DataSource( {
 //           //serverPaging: true,
 //           //serverSorting: true,
 //           //serverFiltering: true,
 //           //allowUnsort: true,
           
            
 //           schema: {
 //               data: function(result) {
 //                      
 //                   return result.data || result;
 //               },
 //               total: function(result) {
 //                     
 //                   var data = this.data(result);
 //                   return data ? data.length : 0;
 //               }
 //           }, pageSize: 3,
 //           transport: {
 //        read: {
 //            //url: "/echo/json/", //using jsfiddle echo service to simulate JSON endpoint
 //            dataType: "json",
 //            //type: "POST",
 //            data: {
 //                // /echo/json/ echoes the JSON which you pass as an argument
 //                json: JSON.stringify( { data: data1 } )
 //            }
 //        }
 //    }

 //} );


        grid.setDataSource( gridDataSource );
    }
}