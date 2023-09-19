var gbUnSelectedBBLC = [];
var gbSelectedBBLC = [];
var files = [];
var UDInfoManager = {
    dataForBySCId: function (scId) {
        debugger;
        var objComp = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + '/api/ComUd/GetComUdByScId?id='+scId;
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
    gridDataSource: function ()
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
                    url: _baseUrl + '/api/ComSalesContract/GetAllGridData',
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

                },
                data: "Items", total: "TotalCount"
            }
        } );
        return gridDataSource;
    },
    BBLCComboDataSource: function () {
        debugger;
        var bblcCombodata = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/ComBackToBack";
        AjaxManager.GetJsonResult( serviceUrl, jsonParam, false, false, onSuccess, onFailed );
        function onSuccess( jsonData )
        {
            bblcCombodata = jsonData;
        }
        function onFailed( error )
        {
            window.alert( error.statusText );
        }
        return bblcCombodata;
    },
    Save: function () {
          
        var msg = "";
        var command = UDInfoHelper.CreateObj();
        var jsonParam = JSON.stringify( command );
        var serviceUrl = _baseUrl + "/api/ComUd/CreateUpdateComUD";
        //var serviceUrl = _baseUrl + "/api/ComSalesContract/CreateUpdateComSalesContract";
        AjaxManager.PostJsonApi( serviceUrl, jsonParam, onSuccess, onFailed );
        function onSuccess( jsonData )
        {
            if ( jsonData.Success )
            {
               
                msg = jsonData.Message;
                AjaxManager.MsgBox( 'success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ( $noty )
                        {
                            $noty.close();
                            UDSummaryHelper.InitUDSummary();
                            //$("#grdAgentSummary").data("kendoGrid").dataSource.read();          // #grdAgentSummary" Need To be Changed
                            UDInfoHelper.ClearForm();
                           
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
   
}
var UDInfoHelper = {
    Init()
    {
        //UDInfoHelper.LoadFile();
        UDInfoHelper.InitModal();
        UDInfoHelper.InitCombos();
        UDInfoHelper.GenerateDatePicker();
        UDInfoHelper.GenerateNumericTextBox();
       // UDInfoHelper.LoadBBLCCombo();
        UDInfoHelper.GenerateMultiColumnComboBox();
        $( "#pnlMaster,#pnlMaster2" ).kendoPanelBar( {
            expandMode: "multiple",
            expanded: true
        } );
        $( "#btnSaveUDInfo" ).click( function () {
            debugger;
            var udno = $( "#txtUDNo" ).val();
            var scno = $( "#lblSCNo" ).val();
            var udQty = $( "#txtUdQty" ).val();
            if ( !MenuManager.IsStringEmpty( udno ) && MenuManager.IsValidGuiId( scno ) && !MenuManager.IsStringEmpty( udQty ) )
           {
               UDInfoManager.Save();
           } else {
               AjaxManager.MsgBox( 'warning', 'center', 'Warning:', "Can't save data. please must give Udno, UdQty and scno",
                   [{
                       addClass: 'btn btn-primary', text: 'Ok', onClick: function ( $noty )
                       {
                           $noty.close();
                          

                       }
                   }] );
           }
            


        } );
        $( "#btnClearAll" ).click( function ()
        {
            UDInfoHelper.ClearForm();
        } );

       
        $( "#btnSearchSC" ).click( function ()
        {
            
            $( "#divSCModal" ).data( "kendoWindow" ).open().center();
            
            UDInfoHelper.LoadSCCombo();
        } );
        $( "#btnSearchUD" ).click( function ()
        {

            $( "#divUDModal" ).data( "kendoWindow" ).open().center();
            //UDInfoHelper.GenerateMultiColumnComboBox();
            UDSummaryHelper.LoadDataList();
        } );


    },
    LoadSCCombo: function ()
    {
        //var data = UDInfoManager.BBLCComboDataSource();
        ////data.unshift( UtilityUnShift.GetUnshiftBBLCComboGridSearch() );
        //var bblcId = $( "#txtBBLCId" ).data( "kendoMultiColumnComboBox" );
        //bblcId.value( "" );
        //bblcId.setDataSource( data );
        //bblcId.select( 0 );
        //bblcId.list.width( "70%" );

        var grid = $( "#grdScContactSummary" ).data( "kendoGrid" );
        var data = UDInfoManager.gridDataSource();
        grid.setDataSource( data );
    },
    GenerateMultiColumnComboBox: function ( ctrlId )
    {
        $( "#grdScContactSummary" ).kendoGrid( {
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
        } );

        $( "#grdScContactSummary" ).on( "dblclick", "tr.k-state-selected", function ()
        {
            
            //debugger;
            var grid = $( "#grdScContactSummary" ).data( "kendoGrid" );
            if ( grid.select().length > 0 )
            {
                var selectedItem = grid.dataItem( grid.select() );
                if ( selectedItem != null )
                {
                   // UDInfoHelper.ClearForm();
                    $( "#divSCModal" ).data( "kendoWindow" ).close();
                    $( "#hdnSCId" ).val( selectedItem.Scid );
                    $( "#lblSCNo" ).val( selectedItem.Scno );
                   
                    var data = UDInfoManager.dataForBySCId( selectedItem.Scid );
                    //debugger;
                    
                    
                    if ( data.length > 0 )
                    {
                        UDInfoHelper.ClearForm();
                        UDInfoHelper.FillForm(data[0]);
                    } else {
                        UDBBLCHelper.LoadDataListinUnattached( selectedItem.Scid );
                        UDInfoHelper.cleargrid( "gridAttachedBBLCList" );
                    }
                    
                

                    
                }
            }
        } );
        

       
    },
    InitCombos()
    {
     
        MerchantHelper.LoadSCCombo( "txtSCId" );
        //UDInfoHelper.GenerateMultiColumnComboBox( "txtBBLCId" );


    },
    ClearForm: function ()
    {
       

        $( "#hdnUDId" ).val( "00000000-0000-0000-0000-000000000000" );
         $( "#txtUDNo" ).val("");
         $( "#txtUdQty" ).val( "" );
         $( "#txtUDDate" ).data( "kendoDatePicker" ).value("");
         $( "#hdnSCId" ).val( "00000000-0000-0000-0000-000000000000" );
         $( "#lblSCNo" ).val( "" );
      //   $( "#txtSCId" ).data( "kendoComboBox" ).value("");
       // $( "#txtBBLCRevDate" ).data( "kendoDatePicker" ).value("");
         $( "#textPaperReqDate" ).data( "kendoDatePicker" ).value("");
         $( "#textPaperRecDate" ).data( "kendoDatePicker" ).value("");
        $("#txtBGMEASUBDate").data("kendoDatePicker").value("");

         gbUnSelectedBBLC = [];
         gbSelectedBBLC = [];
         files = [];
         UDInfoHelper.cleargrid( "gridUnattachedBBLCList" );
         UDInfoHelper.cleargrid( "gridAttachedBBLCList" );
        $("#btnSaveUDInfo").text("Save");
        $("#btnSaveUDInfo").addClass("fa fa-save");
        // $( "#txtUdDelayReason" ).val("");
        UDInfoHelper.LoadFile();
    },
    cleargrid:function(gridname) {
        var grid = $( "#"+gridname ).data( 'kendoGrid' );

        grid.dataSource.data( [] );
        grid.setDataSource( [] );
    },
    GenerateDatePicker: function ()
    {
        $( "#txtUDDate,#textPaperRecDate,#textPaperReqDate,#txtBBLCRevDate,#txtBGMEASUBDate" ).kendoDatePicker( {
            value: new Date(),
            format: "dd-MMM-yyyy"
        } );
    },
    GenerateNumericTextBox: function ()
    {
        $( "#txtBBLCAmt" ).kendoNumericTextBox( {
            format: "#.####",
            min: 0,
            decimals: 4
        } );
        $( "#txtTolerance" ).kendoNumericTextBox( {
            format: "#.##",
            min: 0,
            decimals: 2
        } );
        $( "#txtFreightAmt" ).kendoNumericTextBox( {
            format: "#.####",
            min: 0,
            decimals: 4
        } );
        $( "#txtTenor" ).kendoNumericTextBox( {
            format: "#",
            min: 0
            //decimals: 4
        } );
        $( "#txtMaxImportLimit" ).kendoNumericTextBox( {
            format: "#.####",
            min: 0,
            decimals: 4
        } );

        $( "#txtDocPresentDays" ).kendoNumericTextBox( { format: "#", min: 0 } ).css( "width", "100%" );

    },
    CreateObj:function() {
        debugger;
        var obj = new Object();
        obj.Udid = $( "#hdnUDId" ).val();
        obj.Udno = $( "#txtUDNo" ).val();
        obj.UdQty = $( "#txtUdQty" ).val();
        obj.Uddate = $( "#txtUDDate" ).data( "kendoDatePicker" ).value();
        
        obj.Scid = $( "#hdnSCId" ).val();
       // obj.Scid = $( "#txtSCId" ).data( "kendoComboBox" ).value();
      //  obj.BblcreceivDate = $( "#txtBBLCRevDate" ).data( "kendoDatePicker" ).value();
        obj.PaperRequsitionDate = $( "#textPaperReqDate" ).data( "kendoDatePicker" ).value();
        obj.PaperReceiveDate = $( "#textPaperRecDate" ).data( "kendoDatePicker" ).value();
        obj.BgmeasubmissionDate = $( "#txtBGMEASUBDate" ).data( "kendoDatePicker" ).value();
      //  obj.UddelayReason = $( "#txtUdDelayReason" ).val();
        obj.CreateBy = CurrentUser.USERID;
        var model = [];
        console.log(gbSelectedBBLC);
        for ( var i = 0; i < gbSelectedBBLC.length; i++ )
        {
            var m = new Object();
            m.Bblcid = gbSelectedBBLC[i].Bblcid;
            m.Scid = obj.Scid;
            m.Udid = obj.Udid;
            m.Udbblcid = AjaxManager.DefaultGuidId();
            model.push( m );
        }
        obj.UdbblCollection = model;
        obj.DocumentVms = files;
        return obj;

    },
    InitModal() {
        $( "#divSCModal,#divUDModal" ).kendoWindow( {
            title: "",
            resizeable: true,
            scrollable: false,
            width: "80%",
            actions: ["Close"],
            modal: true,
            animation: {
                close: {
                    effects: "fade:out"
                }
            }
        });

        $( "#btnclose" ).click( function ()
        {
            $( "#divBBModal,#divUDModal" ).data( "kendoWindow" ).close();
        });
    },
    FillForm: function ( obj )
    {
       
        debugger;
        console.log( gbSelectedBBLC );
        $( "#btnSaveUDInfo" ).text("Update" );
        $( "#hdnUDId" ).val( obj.Udid );
        $( "#hdnSCId" ).val( obj.Scid );
        $( "#txtUDNo" ).val( obj.Udno );
        $( "#txtUdQty" ).val( obj.UdQty );
        
        $( "#txtUDDate" ).data( "kendoDatePicker" ).value( obj.Uddate );
        
        $( "#lblSCNo" ).val( obj.ScNo );
        //   $( "#txtSCId" ).data( "kendoComboBox" ).value("");
        // $( "#txtBBLCRevDate" ).data( "kendoDatePicker" ).value("");
        $( "#textPaperReqDate" ).data( "kendoDatePicker" ).value( obj.PaperRequsitionDate );
        $( "#textPaperRecDate" ).data( "kendoDatePicker" ).value( obj.PaperReceiveDate );
        $( "#txtBGMEASUBDate" ).data( "kendoDatePicker" ).value( obj.BgmeasubmissionDate );
        UDBBLCHelper.LoadDataListinUnattached( obj.Scid );
        UDBBLCHelper.LoadDataListinAttached( obj.UdBBLCVmlist );

        files = obj.FilesVm;
        UDInfoHelper.LoadFile();

    },
    LoadFile: function ()
    {
        var uploadWidget = $( "#files" ).getKendoUpload();

        // You won't need to clear the files as the Upload DOM is entirely removed
        // uploadWidget.clearAllFiles();

        var uploaderOptions = uploadWidget.options;
        uploaderOptions.files = files;

        uploadWidget.destroy();

        // Get reference to the 'files' <input> element and its .k-upload parent
        var uploadInput = $( "#files" );
        var wrapper = uploadInput.parents( '.k-upload' );
        // Remove the .k-upload from the DOM
        wrapper.remove();
        // Re-append the 'files' <input> to the DOM
        $( '#divFileUpload' ).append( uploadInput );

        uploadWidget = $( "#files" ).kendoUpload( uploaderOptions ).data( "kendoUpload" );
    },
}