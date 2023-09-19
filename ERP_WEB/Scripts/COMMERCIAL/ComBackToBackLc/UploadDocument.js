

var DocumentHelper = {
    InitDoc: function() {
        function onChange() {
            var upload = $("#files").getKendoUpload();
            upload.destroy();

            DocumentHelper.initUpload();
        }
        $("#fileTypes").kendoMultiSelect({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [
                { text: "jpg", value: "jpg" },
                { text: "pdf", value: "pdf" },
                { text: "docx", value: "docx" },
                { text: "xlsx", value: "xlsx" },
                { text: "xls", value: "xls" },
                { text: "zip", value: "zip" },
                { text: "txt", value: "txt" },
            ],
            value: ["jpg", "pdf", "docx", "xlsx", "xls", "zip", "txt"],
            change: onChange,
        });
        $("#limitUploadSize").change(function() {
            var upload = $("#files").getKendoUpload();
            upload.destroy();

            DocumentHelper.initUpload();
        } );

        DocumentHelper.initUpload();

       
    },
    initUpload () {
        var validation = {};
        var limitUploadSize = $("#limitUploadSize").prop("checked");
        var filetypes = $("#fileTypes").getKendoMultiSelect().value();
        if (limitUploadSize) {
            validation.maxFileSize = 4194304;
        }
        validation.allowedExtensions = filetypes;

        //function onSuccess(jsonData) {
        //    debugger;
        //    var obj = new Object();
        //    obj.FileName = jsonData.files[0].name;
        //    obj.FileExtension = jsonData.files[0].extension;
        //    obj.FileSize = jsonData.files[0].size;
        //    obj.FileUniqueName = jsonData.response.FileNameUniuqe;
        //    obj.ModuleMasterId = $( '#hdnBBLCId' ).val();
        //    obj.ModuleName = "BBLC";
        //    obj.ActionType = jsonData.response.ActionType;
        //    console.log( jsonData);
        //    console.log( obj );
        //    jsonData.files[0].fileUniq = jsonData.response.FileNameUniuqe;
        //    DocumentHelper.SaveDocumentDetails(obj);
        //    $( ".k-file-progress .file-wrapper .view-test" ).html( '<a href="../DocumentFile/' + obj.FileNameUniuqe + '" type="button" class="k-button "  target="_blank"><span class="k-button-icon k-icon k-i-eye" title="View"></span></a>' );

        //}
        //function onRemove(e) {
        //    debugger;
        //    //  var name = e.files[0].uid + "_" + e.files[0].name;
        //    e.files[0].name = e.files[0].fileUniq;
        //    console.log( e );
        //}
        //function onUpload( e ) {
        //    debugger;
        //    var files = e.files;
        //    // Check the extension of each file and abort the upload if it is not .jpg
        //    $.each( files, function ()
        //    {
        //        if ( ( this.extension != ".jpg" ) && ( this.extension != ".png" ) )
        //        {
        //            alert( "Only .jpg/.png files can be uploaded." );
                    
        //        }
        //    } );
        //}

        debugger;
       
        $( ".k-file" ).remove();

        $( "#files" ).kendoUpload( {
            success: function ( jsonData )
            {
                debugger;
                var obj = new Object();
                obj.FileName = jsonData.files[0].name;
                obj.FileExtension = jsonData.files[0].extension;
                obj.FileSize = jsonData.files[0].size;
                obj.FileUniqueName = jsonData.response.FileNameUniuqe;
                obj.ModuleMasterId = $( '#hdnBBLCId' ).val();
                obj.ModuleName = "BBLC";
                obj.ActionType = jsonData.response.ActionType;
                console.log( jsonData );
                console.log( obj );
                jsonData.files[0].fileUniq = jsonData.response.FileNameUniuqe;
               
                $( ".k-file-progress .file-wrapper .view-test" ).html( '<a href="../DocumentFile/' + obj.FileUniqueName + '" type="button" class="k-button "  target="_blank"><span class="k-button-icon k-icon k-i-eye" title="View"></span></a>' );
                DocumentHelper.SaveDocumentDetails( obj );
            },
            remove: function(e) {
                debugger;
                //  var name = e.files[0].uid + "_" + e.files[0].name;
                if (e.files !== undefined) {
                    e.files[0].name = e.files[0].fileUniq;
                    console.log( e );
                }
               
            },

            async: {
                        chunkSize: 11000, // bytes
                        saveUrl: "/Upload/chunksave",
                        removeUrl: "/Upload/remove",
                

                        autoUpload: true
                    },
           
                    template: kendo.template( $( '#fileTemplate' ).html() ),
                    files: files,
                    
                   
                    dropZone: ".dropZoneElement",
                    
                    

            
        } );

        


    },

    SaveDocumentDetails: function (obj)
    {

        var msg = "";
        var command = obj;
        var jsonParam = JSON.stringify( command );
        console.log( jsonParam );
        var serviceUrl = _baseUrl + "/api/CmnDocument/CreateUpdateCmnDocument";
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