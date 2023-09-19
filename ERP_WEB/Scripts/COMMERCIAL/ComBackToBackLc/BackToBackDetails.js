var gbBBLCSummList = [];
var gbUnSelectedPi = [];
var gbSelectedPi = [];
var files = [];
var BackToBackInfoManager = {
    SaveBackToBackDetails: function () {

        var msg = "";
        var validator = $("#divBackToBack").kendoValidator().data("kendoValidator");
        if (validator.validate()) {
            if (BackToBackInfoHelper.ValidateBacktoBackForm()) {
                var btbObj = BackToBackInfoHelper.CreateB2BObj();
                var jsonParam = JSON.stringify(btbObj);
                if (btbObj.Bblcno != null) {
                    var serviceUrl = _baseUrl + "/api/ComBackToBack/CreateUpdateComB2BLC";
                    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                }
                else {
                    AjaxManager.MsgBox('warning', 'center', 'Required', "Please Input BacktoBack No!",
                        [{
                            addClass: 'btn btn-primary', text: 'OK', onClick: function ($noty) {
                                $noty.close();
                                $("#txtBBLCNo").focus();
                            }
                        }]);
                }
            }
        }
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            //ContractSummaryHelper.LoadContractGridDataSource();
                            BackToBackInfoHelper.ClearForm();
                        }
                    }]);
            }
            else {
                msg = jsonData.Message;
                AjaxManager.MsgBox('error', 'center', 'Error1', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);

        }
    },

}
var BackToBackInfoHelper = {
    Init() {
        //ContactInfoHelper.InitModal();
        BackToBackInfoHelper.InitModal();
        BackToBackInfoHelper.InitCombos();
        BackToBackInfoHelper.GenerateDatePicker();
        BackToBackInfoHelper.GenerateNumericTextBox();
        //ContactInfoHelper.GeneratePOGrid();
        //ContactInfoHelper.GenerateGroupLcB2BGrid();
        if ($("#hdnBBLCId").val() == "00000000-0000-0000-0000-000000000000") {
            $( "#divAmendment" ).hide();
            $( "#DocumentFileUpload" ).hide();

        }
        $("#pnlMaster").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        $("#pnlMaster2").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });

        //$("#txtSrcContact").keypress(function (e) { 
        //    if (event.keyCode == 13) {

        //    }
        //});
        $("#btnSearchBBLC").click(function () {
            // BackToBackInfoHelper.ClearForm();

            BBLCSummaryHelper.InitBBLCSummary();
            gbBBLCSummList = [];
            $("#divBBModal").data("kendoWindow").open().center();

            BBLCSummaryHelper.LoadDataList();
        });
        $("#btnSave").click(function () {
            BackToBackInfoManager.SaveBackToBackDetails();
        });
        $("#btnClearAll").click(function () {
            BackToBackInfoHelper.ClearForm();
        });

        $("#cboSCNo").change(function () {

            var data = MerchantManager.GetSC();
            console.log(data);
            var scid = $("#cboSCNo").data("kendoComboBox").value();

            $.each(data, function (i, item) {

                if (data[i].Scid === scid) {
                    var totalamn = 0.0;
                    var lblBblcLimit = Math.round(data[i].Scvalue * data[i].MaxImportLimit / 100);
                    $("#lblSCAmt").text(data[i].Scvalue);
                    $("#cboBBLCCurrency").data("kendoComboBox").value(data[i].CurrencyId);
                    $("#cboOpenBank").data("kendoComboBox").value(data[i].OpenBankId);
                    $("#cboCompany").data("kendoComboBox").value(data[i].Beneficiary);

                    $("#lblCompany").text($("#cboCompany").data("kendoComboBox").text());
                    $("#lblSCValue").text(data[i].Scvalue);
                    $("#lblBBLCLimit").text(lblBblcLimit);
                    $("#lblBBLCLimitPercentage").text(data[i].MaxImportLimit);
                    var allb2BList = BBLCSummaryManager.gridDataSource();
                    $.each(allb2BList, function (i, item) {

                        if (allb2BList[i].Scid === scid) {
                            totalamn += allb2BList[i].Bbamount;
                        }
                    });
                    var lblBblcUsedPercentage = Math.round((totalamn * 100) / data[i].Scvalue);

                    $("#lblBBLCUsed").text(Math.round(totalamn));
                    $("#lblBBLCUsedPercentage").text(Math.round(lblBblcUsedPercentage));
                    $("#lblBalance").text(Math.round(lblBblcLimit - totalamn));
                    $("#lblBalancePercentage").text(Math.round(data[i].MaxImportLimit - lblBblcUsedPercentage));

                    $("#SummaryTblbblc").show();

                    $("#lblCurrancy").text($("#cboBBLCCurrency").data("kendoComboBox").text());

                }
            });
        });

        $("#cboSupplier").change(function () {

            console.log(gbUnSelectedPi);
            var supplierId = $("#cboSupplier").data("kendoComboBox").value();
            if (supplierId !== "") {
                PIInfoSummaryBBHelper.LoadGridDatainUnattached(supplierId);
            } else {
                $("#gridPIList").data("kendoGrid").dataSource.data([]);
                gbUnSelectedPi = [];
            }


        });
        $("#cboPayTerm").change(function () {
            var currentValue = $("#cboPayTerm").data("kendoComboBox").value();
            if (currentValue === "5bb21d9c-0869-45d7-999e-ae8231799cf5") {
                $("#txtTenor").data("kendoNumericTextBox").value("");
                $("#txtTenor").data("kendoNumericTextBox").enable(false);
            }
            else {
                $("#txtTenor").data("kendoNumericTextBox").enable(true);
            }
        });



    },
    InitCombos() {
        $(".hiddenId").val(AjaxManager.DefaultGuidId());
        // BackToBackInfoHelper.GenerateCombo( "cboPurpose" );
        BackToBackInfoHelper.GenerateCombo("cboNature");
        BackToBackInfoHelper.GenerateCombo("cboLCType");
        BackToBackInfoHelper.GenerateCombo("cboLCfor");
        MerchantHelper.LoadBankCombo("cboOpenBank");
        MerchantHelper.GenerateCurrencyCombo("cboBBLCCurrency");
        MerchantHelper.LoadCountryCombo("cboExpiryPlc");
        MerchantHelper.LoadBankCombo("cboAdvisingBank");
        MerchantHelper.LoadSupplierCombo("cboSupplier");
        MerchantHelper.LoadBankCombo("cboSupplierBank");
        MerchantHelper.LoadShipmentTermsCombo("cboTradeTerm");
        //MerchantHelper.LoadScTypeCombo("cboNature");
        MerchantHelper.LoadPortCombo("cboPortOfloading");
        MerchantHelper.LoadPortCombo("cboPortOfDischarge");
        MerchantHelper.LoadPaymentTermCombo("cboPayTerm");
        MerchantHelper.LoadCompanyCombo("cboCompany");
        MerchantHelper.LoadMaturityTypeCombo("cboMaturitydt");
        MerchantHelper.LoadSCCombo("cboSCNo");

        var dropdownlist = $("#cboSupplier").data("kendoComboBox");
        dropdownlist.list.width("auto");
        dropdownlist = $("#cboExpiryPlc").data("kendoComboBox");
        dropdownlist.list.width("auto");
        dropdownlist = $("#cboTradeTerm").data("kendoComboBox");
        dropdownlist.list.width("auto");

    },
    ClearForm: function () {



        $("#hdnBBLCId").val("00000000-0000-0000-0000-000000000000");
        $("#txtBBLCId").val("");

        $("#txtBBLCNo").val("");
        $("#BBLCDate").data("kendoDatePicker").value("");
        $("#cboLCType").data("kendoComboBox").value("");
        $("#cboSCNo").data("kendoComboBox").value("");
        $("#cboOpenBank").data("kendoComboBox").value("");
        $("#cboAdvisingBank").data("kendoComboBox").value("");
        $("#cboSupplier").data("kendoComboBox").value("");
        $("#cboSupplierBank").data("kendoComboBox").value("");
        $("#txtBBLCAmt").data("kendoNumericTextBox").value("");
        $("#cboBBLCCurrency").data("kendoComboBox").value("");
        $("#cboPayTerm").data("kendoComboBox").value("");
        $("#cboCompany").data("kendoComboBox").value("");
        // $( "#cboPurpose" ).data( "kendoComboBox" ).value( "" );
        $("#ltShipDate").data("kendoDatePicker").value("");
        $("#lCExpiryDate").data("kendoDatePicker").value("");
        $("#cboExpiryPlc").data("kendoComboBox").value("");
        $("#txtShippingMrk").val("");
        $("#txtTenor").data("kendoNumericTextBox").value("");
        $("#txtCoverNote").val("");

        $("#cboTradeTerm").data("kendoComboBox").value("");
        $("#cboNature").data("kendoComboBox").value("");
        $("#cboMaturitydt").data("kendoComboBox").value("");
        $("#cboPortOfloading").data("kendoComboBox").value("");
        $("#cboPortOfDischarge").data("kendoComboBox").value("");
        $("#txtTolerance").data("kendoNumericTextBox").value("");
        $("#txtDocPresentDays").data("kendoNumericTextBox").value("");
        $("#txtLCAFno").val("");
        $("#txtHSCode").val("");
        $("#cboLCfor").data("kendoComboBox").value("");
        $("#chkInvCreate").prop('checked', false);



        $("#chkDomestic").prop('checked', false);


        $("#chkPartialShipment").prop('checked', false);


        $("#txtRemarks").val("");
        $("#txtComRef").val("");
        $("#lblSCAmt").text("");
        $("#lblCurrancy").text("");
        gbSelectedPi = [];
        gbUnSelectedPi = [];


        gbBBLCSummList = [];
        files = [];

        $("#grdBBLCSummary").data("kendoGrid").dataSource.data([]);
        $("#gridSelectedPIList").data("kendoGrid").dataSource.data([]);
        $("#gridPIList").data("kendoGrid").dataSource.data([]);
        $("#gridAmendment").data("kendoGrid").dataSource.data([]);
        BackToBackInfoHelper.LoadFile();

        $("#divAmendment").hide();
        $( "#DocumentFileUpload" ).hide();
        $("#SummaryTblbblc").hide();
    },
    GenerateDatePicker: function () {
        $("#BBLCDate,#ltShipDate,#lCExpiryDate,#applicationDate,#uDDate").kendoDatePicker({
            value: new Date(),
            format: "dd-MMM-yyyy"
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtBBLCAmt").kendoNumericTextBox({
            format: "#.####",
            min: 0,
            decimals: 4
        });
        $("#txtTolerance").kendoNumericTextBox({
            format: "#.##",
            min: 0,
            decimals: 2
        });
        $("#txtFreightAmt").kendoNumericTextBox({
            format: "#.####",
            min: 0,
            decimals: 4
        });
        $("#txtTenor").kendoNumericTextBox({
            format: "#",
            min: 0
            //decimals: 4
        });
        $("#txtMaxImportLimit").kendoNumericTextBox({
            format: "#.####",
            min: 0,
            decimals: 4
        });

        $("#txtDocPresentDays").kendoNumericTextBox({ format: "#", min: 0 }).css("width", "100%");

    },
    GenerateCombo: function (identity) {
        var objPurposeType = [
            { TypeId: 1, TypeName: "Material" },
            { TypeId: 2, TypeName: "Service" }
        ];

        var objNatureType = [
            { TypeId: 1, TypeName: "Pre-Procurement" },
            { TypeId: 2, TypeName: "Post-Procurement" }
        ];
        var objLCType = [
            { TypeId: 1, TypeName: "BB-LC" },
            { TypeId: 2, TypeName: "Import-LC" },
            { TypeId: 3, TypeName: "TT" }

        ];
        var objLcFor = [
            { TypeId: 1, TypeName: "Accessories" },
            { TypeId: 2, TypeName: "Fabric" },
            { TypeId: 3, TypeName: "Garments" },
            { TypeId: 4, TypeName: "Yarn" }

        ];




        $("#" + identity).kendoComboBox({
            placeholder: "Select",
            dataTextField: "TypeName",
            dataValueField: "TypeId",
            //dataSource: objPurposeType,
            index: 0
        });
        var combobox = $("#" + identity).data("kendoComboBox");


        if (identity === "cboNature") {
            combobox.setDataSource(objNatureType);
        }
        if (identity === "cboLCType") {
            combobox.setDataSource(objLCType);
        }

        if (identity === "cboLCfor") {
            combobox.setDataSource(objLcFor);
        }


    },
    CreateB2BObj: function (BackToBackObj) {

        var obj = new Object();
        obj.Bblcid = $("#hdnBBLCId").val();
        obj.BblctempId = $("#txtBBLCId").val();
        if (obj.BblctempId === "") {
            var date = new Date();

            var str = date.getFullYear() + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + ((date.getDate() > 8) ? (date.getDate()) : ('0' + (date.getDate()))) + ((date.getHours() > 8) ? (date.getHours()) : ('0' + (date.getHours()))) + ((date.getMinutes() > 8) ? (date.getMinutes()) : ('0' + (date.getMinutes()))) + ((date.getSeconds() > 8) ? (date.getSeconds()) : ('0' + (date.getSeconds())));
            obj.BblctempId = str;
            $("#txtBBLCId").val(str);
        }
        obj.Bblcno = $("#txtBBLCNo").val();
        obj.Bblcdate = $("#BBLCDate").data("kendoDatePicker").value();
        obj.LctypeId = $("#cboLCType").data("kendoComboBox").value();
        obj.Scid = $("#cboSCNo").data("kendoComboBox").value();
        obj.OpenBankId = $("#cboOpenBank").data("kendoComboBox").value();
        obj.AdvisingBankId = $("#cboAdvisingBank").data("kendoComboBox").value();
        obj.SupplierId = $("#cboSupplier").data("kendoComboBox").value();
        obj.SupplierBankId = $("#cboSupplierBank").data("kendoComboBox").value();
        obj.Bbamount = $("#txtBBLCAmt").val();
        obj.BbcurrancyId = $("#cboBBLCCurrency").data("kendoComboBox").value();
        obj.PaymentTermId = $("#cboPayTerm").data("kendoComboBox").value();
        obj.CompanyId = $("#cboCompany").data("kendoComboBox").value();
        //    obj.PurposeId = $( "#cboPurpose" ).data( "kendoComboBox" ).value();
        obj.LatestShipDate = $("#ltShipDate").data("kendoDatePicker").value();
        obj.LcexpiryData = $("#lCExpiryDate").data("kendoDatePicker").value();
        obj.ExpiryPlaceId = $("#cboExpiryPlc").data("kendoComboBox").value();
        obj.ShippingMark = $("#txtShippingMrk").val();
        obj.Tenor = $("#txtTenor").val();
        if (obj.Tenor == null || obj.Tenor == "") {
            obj.Tenor = 0;
        };
        obj.CoverNoteNo = $("#txtCoverNote").val();

        obj.TradeTermId = $("#cboTradeTerm").data("kendoComboBox").value();
        obj.NatureTypeId = $("#cboNature").data("kendoComboBox").value();
        obj.LcmaturityId = $("#cboMaturitydt").data("kendoComboBox").value();
        obj.PortOfLoadingId = $("#cboPortOfloading").data("kendoComboBox").value();
        obj.PortOfDischargeId = $("#cboPortOfDischarge").data("kendoComboBox").value();
        obj.Tolerance = $("#txtTolerance").val();
        obj.DocPresentDays = $("#txtDocPresentDays").val();
        obj.Lcafno = $("#txtLCAFno").val();
        obj.Hscode = $("#txtHSCode").val();
        obj.LcforId = $("#cboLCfor").data("kendoComboBox").value();
        obj.IsInvCreateComplete = $("#chkInvCreate").is(":checked");
        obj.IsDomestic = $("#chkDomestic").is(":checked");
        obj.IsPartialShipmentAllowed = $("#chkPartialShipment").is(":checked");

        obj.Remarks = $("#txtRemarks").val();
        obj.Comreferance = $("#txtComRef").val();

        var model = [];
        for (var i = 0; i < gbSelectedPi.length; i++) {
            var m = new Object();
            m.Piid = gbSelectedPi[i].PIId;
            m.Bblcid = obj.Bblcid;
            m.Bblcpiid = AjaxManager.DefaultGuidId();
            model.push(m);
        }
        obj.Combblcpis = model;
        return obj;

    },
    InitModal() {
        $("#divBBModal").kendoWindow({
            title: "BBLC List",
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

        $("#btnBBLCClose").click(function () {
            $("#divBBModal").data("kendoWindow").close();
        });
    },
    FillForm: function (obj, isEdit) {
        //if ( isEdit )
        //{
        //    $( "#btnSave" ).attr( "disabled", "disabled" );
        //    $( "#btnSave" ).addClass( "fa fa-pencil" ).text( "Update" );
        //} else
        //{
        //    $( "#btnSave" ).removeAttr( 'disabled' );
        //    $( "#btnSave" ).addClass( "k-button-success" ).text( "Save" );
        //}

        $("#hdnBBLCId").val(obj.Bblcid);
        $("#txtBBLCId").val(obj.BblctempId);

        $("#txtBBLCNo").val(obj.Bblcno);
        $("#BBLCDate").data("kendoDatePicker").value(obj.Bblcdate);
        $("#cboLCType").data("kendoComboBox").value(obj.LctypeId);
        $("#cboSCNo").data("kendoComboBox").value(obj.Scid);
        $("#cboOpenBank").data("kendoComboBox").value(obj.OpenBankId);
        $("#cboAdvisingBank").data("kendoComboBox").value(obj.AdvisingBankId);
        $("#cboSupplier").data("kendoComboBox").value(obj.SupplierId);
        $("#cboSupplierBank").data("kendoComboBox").value(obj.SupplierBankId);
        $("#txtBBLCAmt").data("kendoNumericTextBox").value(obj.Bbamount);
        $("#txtPreSCAmt").data("kendoNumericTextBox").value(obj.Bbamount);
        $("#cboBBLCCurrency").data("kendoComboBox").value(obj.BbcurrancyId);
        $("#cboPayTerm").data("kendoComboBox").value(obj.PaymentTermId);
        $("#cboCompany").data("kendoComboBox").value(obj.CompanyId);
        $("#lblCompany").text($("#cboCompany").data("kendoComboBox").text());
        //   $( "#cboPurpose" ).data( "kendoComboBox" ).value( obj.PurposeId );
        $("#ltShipDate").data("kendoDatePicker").value(obj.LatestShipDate);
        $("#dtPreShipDate").data("kendoDatePicker").value(obj.LatestShipDate);
        $("#dtCurShipDate").data("kendoDatePicker").value(obj.LatestShipDate);
        $("#lCExpiryDate").data("kendoDatePicker").value(obj.LcexpiryData);
        $("#dtPreExpDate").data("kendoDatePicker").value(obj.LcexpiryData);
        $("#dtCurExpDate").data("kendoDatePicker").value(obj.LcexpiryData);
        $("#cboExpiryPlc").data("kendoComboBox").value(obj.ExpiryPlaceId);
        $("#txtShippingMrk").val(obj.ShippingMark);
        $("#txtTenor").data("kendoNumericTextBox").value(obj.Tenor);
        $("#txtCoverNote").val(obj.CoverNoteNo);

        $("#cboTradeTerm").data("kendoComboBox").value(obj.TradeTermId);
        $("#cboNature").data("kendoComboBox").value(obj.NatureTypeId);
        $("#cboMaturitydt").data("kendoComboBox").value(obj.LcmaturityId);
        $("#cboPortOfloading").data("kendoComboBox").value(obj.PortOfLoadingId);
        $("#cboPortOfDischarge").data("kendoComboBox").value(obj.PortOfDischargeId);
        $("#txtTolerance").data("kendoNumericTextBox").value(obj.Tolerance);
        $("#txtDocPresentDays").data("kendoNumericTextBox").value(obj.DocPresentDays);
        $("#txtLCAFno").val(obj.Lcafno);
        $("#txtHSCode").val(obj.Hscode);
        $("#cboLCfor").data("kendoComboBox").value(obj.LcforId);


        if (obj.IsInvCreateComplete == true) {
            $("#chkInvCreate").prop('checked', true);
        } else {
            $("#chkInvCreate").prop('checked', false);
        }
        if (obj.IsDomestic == true) {
            $("#chkDomestic").prop('checked', true);
        } else {
            $("#chkDomestic").prop('checked', false);
        }
        if (obj.IsPartialShipmentAllowed == true) {
            $("#chkPartialShipment").prop('checked', true);
        } else {
            $("#chkPartialShipment").prop('checked', false);
        }

        $("#txtRemarks").val(obj.Remarks);
        $("#txtComRef").val(obj.Comreferance);

        PIInfoSummaryBBHelper.LoadGridDatainUnattached(obj.SupplierId);
        PIInfoSummaryBBHelper.LoadSavedPiData(obj.BBLCPIVMs);



        var data = MerchantManager.GetSC();


        for (var i = 0; i < data.length; i++) {

            //if ( data[i].Scid === obj.Scid )
            //{

            //    $( "#lblSCAmt" ).text( data[i].Scvalue );
            //    $( "#lblCurrancy" ).text( $( "#cboBBLCCurrency" ).data( "kendoComboBox" ).text() );
            //    break;

            //}
            if (data[i].Scid === obj.Scid) {
                $("#SummaryTblbblc").show();
                var totalamn = 0.0;
                var lblBblcLimit = Math.round(data[i].Scvalue * data[i].MaxImportLimit / 100);
                $("#lblSCAmt").text(data[i].Scvalue);
                $("#cboBBLCCurrency").data("kendoComboBox").value(data[i].CurrencyId);
                $("#cboOpenBank").data("kendoComboBox").value(data[i].OpenBankId);
                $("#lblSCValue").text(data[i].Scvalue);
                $("#lblBBLCLimit").text(lblBblcLimit);
                $("#lblBBLCLimitPercentage").text(data[i].MaxImportLimit);
                var allb2BList = BBLCSummaryManager.gridDataSource();
                $.each(allb2BList, function (j, item) {

                    if (allb2BList[j].Scid === obj.Scid) {
                        totalamn += allb2BList[j].Bbamount;
                    }
                });
                var lblBblcUsedPercentage = Math.round((totalamn * 100) / data[i].Scvalue);

                $("#lblBBLCUsed").text(Math.round(totalamn));
                $("#lblBBLCUsedPercentage").text(lblBblcUsedPercentage);
                $("#lblBalance").text(Math.round(lblBblcLimit - totalamn));
                $("#lblBalancePercentage").text(data[i].MaxImportLimit - lblBblcUsedPercentage);


                $("#lblCurrancy").text($("#cboBBLCCurrency").data("kendoComboBox").text());
                break;

            }

            //if ( data[i].Scid === scid )
            //{


            //}
        }
        // BBLCAmendmentHelper.LoadAmendmentData( obj.BblcAmendmentVm );

        if ($("#txtBBLCNo").val() !== "" && $("#hdnBBLCId").val() !== null) {
            BBLCAmendmentHelper.LoadAmendmentData(obj.BbLcAmendments);
            $("#divAmendment").show();
            $( "#DocumentFileUpload" ).show();
        }
        files = obj.FilesVm;
        BackToBackInfoHelper.LoadFile();

    },
    LoadFile:function() {
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
    ValidateBacktoBackForm: function () {
        debugger;

        var res = true;
        var importLcNo = $("#txtBBLCNo").val();
        var importLcDate = $("#BBLCDate").data("kendoDatePicker");
        var lcFor = $("#cboLCfor").data("kendoComboBox");
        var latestShipDate = $("#ltShipDate").data("kendoDatePicker");
        var lcExpireDate = $("#lCExpiryDate").data("kendoDatePicker");
        var expiryplace = $("#cboExpiryPlc").data("kendoComboBox");
        var advisingBank = $("#cboAdvisingBank").data("kendoComboBox");
        var supplier = $("#cboSupplier").data("kendoComboBox");
        var supplierBank = $("#cboSupplierBank").data("kendoComboBox");
        var tradeTerm = $("#cboTradeTerm").data("kendoComboBox");
        var portOfLoading = $("#cboPortOfloading").data("kendoComboBox");
        var portOfDischarge = $("#cboPortOfDischarge").data("kendoComboBox");
        var hSCode = $("#txtHSCode").val();
        var nature = $("#cboNature").data("kendoComboBox");
        var tenor = $("#txtTenor").val();
        var lcType = $("#cboLCType").data("kendoComboBox");
        var scNo = $("#cboSCNo").data("kendoComboBox");
        var paymentTerm = $("#cboPayTerm").data("kendoComboBox").value();
        var lcType = $("#cboLCType").data("kendoComboBox");
        var scNo = $("#cboSCNo").data("kendoComboBox");
        var docPresentDays = $("#txtDocPresentDays").val();

        if (paymentTerm.toUpperCase() != "5BB21D9C-0869-45D7-999E-AE8231799CF5") {
            if (tenor === "" || tenor === null) {
                AjaxManager.NotifyMsg("txtTenor", "error", "up", 1500, "Required Tenor");
                res = false;
            }
        }
        if (lcFor.value() === "" || lcFor.value === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboLCfor", "error", "right", 1500, "Required Lc For");
            res = false;
        }

        if (latestShipDate.value() === "" || latestShipDate.value === null) {
            AjaxManager.NotifyMsg("ltShipDate", "error", "right", 1500, "Required Latest ShipDate");
            res = false;
        }
        if (lcExpireDate.value() === "" || lcExpireDate.value === null) {
            AjaxManager.NotifyMsg("lCExpiryDate", "error", "right", 1500, "Required LC Expired Date");
            res = false;
        }
        if (expiryplace.value() === "" || expiryplace.value === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboLCfor", "error", "right", 1500, "Required Expiry Place");
            res = false;
        }
        if (advisingBank.value() === "" || advisingBank.value === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboAdvisingBank", "error", "right", 1500, "Required Advising Bank");
            res = false;
        }
        if (supplier.value() === "" || supplier.value === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboSupplier", "error", "right", 1500, "Required Supplier");
            res = false;
        }
        if (supplierBank.value() === "" || supplierBank.value === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboSupplierBank", "error", "right", 1500, "Required Supplier Bank");
            res = false;
        }
        if (tradeTerm.value() === "" || tradeTerm.value === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboTradeTerm", "error", "right", 1500, "Required Trade Term");
            res = false;
        }
        if (portOfLoading.value() === "" || portOfLoading.value === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboPortOfloading", "error", "right", 1500, "Required Port Of Loading");
            res = false;
        }
        if (portOfDischarge.value() === "" || portOfDischarge.value === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboPortOfDischarge", "error", "right", 1500, "Required Port Of Discharge");
            res = false;
        }
        if (hSCode === "" || hSCode === null) {
            AjaxManager.NotifyMsg("txtHSCode", "error", "right", 1500, "Required HS");
            res = false;
        }
        if (nature.value() === "" || nature.value === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboNature", "error", "right", 1500, "Required Nature");
            res = false;
        }
        if (importLcNo === "" || importLcNo === null) {
            AjaxManager.NotifyMsg("txtBBLCNo", "error", "right", 1500, "Required ImportLc");
            res = false;
        }
        if (importLcDate.value() === "" || importLcDate.value === null) {
            AjaxManager.NotifyMsg("BBLCDate", "error", "right", 1500, "Required BBLC Date");
            res = false;
        }
        if (lcType.value() === "" || lcType.value === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboLCType", "error", "right", 1500, "Required LC Type");
            res = false;
        }
        if (scNo.value() === "" || scNo.value === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboSCNo", "error", "right", 1500, "Required Sc No");
            res = false;
        }
        if (docPresentDays === "" || docPresentDays.value === null) {
            AjaxManager.NotifyMsg("txtDocPresentDays", "error", "right", 1500, "Required DocPresent Days");
            res = false;
        }
        return res;
    }
}