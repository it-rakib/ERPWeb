var ExportLCInfoManager = {
    //Export LC
    SaveExportLCDetails: function () {
        debugger;
        var msg = "";
        debugger;
        var createExportLCCommand = ExportLCInfoHelper.CreateExportLCObject();
        var jsonParam = JSON.stringify(createExportLCCommand);
        var serviceUrl = _baseUrl + "/api/ComExportLc/CreateUpdateComExportLc";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            ExportLCSummaryHelper.GenerateExportLCGrid();
                            ExportLCInfoHelper.ClearForm();
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

    //PO Grid
    gridDataSourcePO: function (lcid) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/PurchaseOrders/GetPOGridDataByLCId/' + lcid,  // PO Grid Url
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
                    id: "Lcid",
                    fields: {
                        Lcid: { editable: false },
                        Lcno: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },

    // BBLC Information Grid
    gridDataSourceBBLC: function (search) {
        var gridDataSourceB2B = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/ComExportLC/GetAllB2BLCGridData/?searchkey=' + $.trim(search),  // BBLC Grid Url
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
                    id: "Lcid",
                    fields: {
                        Lcid: { editable: false },
                        Lcno: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSourceB2B;
    },
}

var ExportLCInfoHelper = {
    Init() {
        ExportLCInfoHelper.InitModal();
        ExportLCInfoHelper.InitCombos();
        ExportLCInfoHelper.GenerateDatePicker();
        ExportLCInfoHelper.GenerateNumericTextBox();
        ExportLCInfoHelper.GeneratePOGrid();
        ExportLCInfoHelper.LoadPODataSource();
        //ExportLCInfoHelper.GenerateGroupLcB2BGrid();
        //ExportLCInfoHelper.LoadB2BDataSource();

        $("#pnlMaster").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        $("#btnSearchLC").click(function () {
            $("#divLCModal").data("kendoWindow").open().center();
            ExportLCSummaryHelper.GenerateExportLCGrid();
        });
        $('#txtSrcLC').on('input', function (e) {
            ExportLCInfoHelper.LoadPODataSource();
        });
        $("#btnSave").click(function () {
            debugger;
            var LCNO = $("#txtLCNo").val();
            if (LCNO != "") {
                ExportLCInfoManager.SaveExportLCDetails();
            } else {
                AjaxManager.MsgBox('warning', 'center', 'Please Confirm', "Please give all required information.",
                    [{
                        addClass: 'btn btn-primary',
                        text: 'OK',
                        onClick: function ($noty) {
                            $noty.close();
                            $("#txtLCNo").focus();
                        }
                    }])
            }
        });
        $("#btnClearAll").click(function () {
            //ExportLCInfoHelper.ClearForm();
            //location.reload(true);
            window.location.reload(true);
        });
        $("#cboSC,#cboShipmentMode,#cboBeneficiary,#cboOpeningBank,#cboRcvThrough,#cboLienBank,#cboTradeTerms,#cboIncoTermPlace,#cboPayTerm,#cboConsignee,#cboNotifyParty,#cboDestination,#cboPortOfLoading,#cboBuyer").kendoComboBox({
            autoWidth: true,
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
        MerchantHelper.LoadCompanyCombo("cboBeneficiary");
        MerchantHelper.LoadBankCombo("cboOpeningBank");
        MerchantHelper.LoadBankCombo("cboRcvThrough");
        MerchantHelper.LoadSaleContractCombo("cboSC");
        MerchantHelper.LoadBuyerCombo("cboBuyer");
        MerchantHelper.LoadBankCombo("cboLienBank");
        MerchantHelper.GenerateCurrencyCombo("cboCurrency");
        MerchantHelper.LoadShipmentModeCombo("cboShipmentMode");
        MerchantHelper.LoadScForCombo("cboLCFor");
        MerchantHelper.LoadShipmentTermsCombo("cboTradeTerms");
        MerchantHelper.LoadPortCombo("cboIncoTermPlace");
        MerchantHelper.LoadPaymentTermCombo("cboPayTerm");
        MerchantHelper.LoadConsigneeCombo("cboConsignee");
        MerchantHelper.LoadCompanyCombo("cboNotifyParty");
        MerchantHelper.LoadCountryCombo("cboDestination");
        MerchantHelper.LoadPortCombo("cboPortOfLoading");
    },
    GenerateDatePicker: function () {
        $("#dtLCDate,#dtLienDate,#dtShipDate,#dtExpiryDate").kendoDatePicker({
            value: new Date(),
            format: "dd-MMM-yyyy"
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtLCOpeningValue").kendoNumericTextBox({
            format: "#.####",
            min: 0,
            decimals: 4,
            change: function () {
                ExportLCInfoHelper.FillLCCurrentValue();
            }
        });
        $("#txtLCCurrentValue,#txtFreightAmt,#txtMaxImportLimit").kendoNumericTextBox({
            format: "#.####",
            min: 0,
            decimals: 4
        });
        $("#txtTolerance").kendoNumericTextBox({
            format: "#.##",
            min: 0,
            decimals: 2
        });
        $("#txtTenor").kendoNumericTextBox({
            format: "#",
            min: 0
        });
    },
    FillLCCurrentValue: function () {
        var LCOpen = IkrHelper.EmptyThenZero($("#txtLCOpeningValue").data("kendoNumericTextBox").value());
        $("#txtLCCurrentValue").data("kendoNumericTextBox").value(LCOpen);
        $("#txtPreSCAmt").data("kendoNumericTextBox").value(LCOpen);
    },

    CreateExportLCObject: function (ExportLCObj) {
        debugger;
        var obj = new Object();
        obj.Lcid = $("#hdnLCId").val();
        obj.TempLCId = $("#hdnTempLCId").val() == "00000000-0000-0000-0000-000000000000" ? "" : $("#hdnTempLCId").val();
        obj.Lcno = $("#txtLCNo").val();
        obj.Lcdate = $("#dtLCDate").data("kendoDatePicker").value();
        obj.ScId = $("#cboSC").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboSC").data("kendoComboBox").value();
        obj.BuyerId = $("#cboBuyer").data("kendoComboBox").value();
        obj.Beneficiary = $("#cboBeneficiary").data("kendoComboBox").value() == "" ? 0 : $("#cboBeneficiary").data("kendoComboBox").value();
        obj.OpenBankId = $("#cboOpeningBank").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboOpeningBank").data("kendoComboBox").value();
        obj.LienBankId = $("#cboLienBank").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboLienBank").data("kendoComboBox").value();
        obj.LienDate = $("#dtLienDate").data("kendoDatePicker").value();
        obj.ReceiveThrough = $("#cboRcvThrough").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboRcvThrough").data("kendoComboBox").value();
        obj.CurrencyId = $("#cboCurrency").data("kendoComboBox").value();
        obj.Lcvalue = $("#txtLCCurrentValue").val();
        obj.LcopeningValue = $("#txtLCOpeningValue").val();
        obj.Tolerance = $("#txtTolerance").val() == "" ? 0 : $("#txtTolerance").val();
        obj.FreightAmount = $("#txtFreightAmt").val() == "" ? 0 : $("#txtFreightAmt").val();
        obj.ShipDate = $("#dtShipDate").data("kendoDatePicker").value();
        obj.ExpDate = $("#dtExpiryDate").data("kendoDatePicker").value();
        obj.ShipmentTermsId = $("#cboTradeTerms").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboTradeTerms").data("kendoComboBox").value();
        obj.IncoTermPlaceId = $("#cboIncoTermPlace").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboIncoTermPlace").data("kendoComboBox").value();
        obj.PayTermsId = $("#cboPayTerm").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboPayTerm").data("kendoComboBox").value();
        obj.SightDays = $("#txtTenor").val() == "" ? 0 : $("#txtTenor").val();
        //obj.SightDays = $("#txtTenor").data("kendoNumericTextBox").value() == "" ? 0 : $("#txtTenor").data("kendoNumericTextBox").value();
        obj.ShipmentModeId = $("#cboShipmentMode").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboShipmentMode").data("kendoComboBox").value();
        obj.ConsigneeId = $("#cboConsignee").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboConsignee").data("kendoComboBox").value();
        obj.NotifyParty = $("#cboNotifyParty").data("kendoComboBox").value() == "" ? 0 : $("#cboNotifyParty").data("kendoComboBox").value();
        obj.DestinationId = $("#cboDestination").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboDestination").data("kendoComboBox").value();
        obj.PortOfLoadingId = $("#cboPortOfLoading").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboPortOfLoading").data("kendoComboBox").value();
        obj.LcforId = $("#cboLCFor").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboLCFor").data("kendoComboBox").value();
        obj.MaxImportLimit = $("#txtMaxImportLimit").val() == "" ? 0 : $("#txtMaxImportLimit").val();
        obj.CommercialRef = $("#txtCommercialRef").val();
        obj.Remarks = $("#txtRemarks").val();
        obj.CreatedBy = CurrentUser.USERID;
        return obj;
    },
    FillExportLCForm: function (obj, isEdit) {
        if (isEdit) {
            $("#btnSave").attr("disabled", "disabled");
            $("#btnSave").addClass("fa fa-pencil").text("Update");
        } else {
            $("#btnSave").removeAttr('disabled');
            $("#btnSave").addClass("k-button-success").text("Save");
        }
        $("#txtSrcLC").val(obj.TempLcid);
        $("#hdnTempLCId").val(obj.TempLcid);
        $("#hdLCId").val(obj.Lcid);
        $("#hdnLCId").val(obj.Lcid);
        $("#txtLCNo").val(obj.Lcno);
        $("#dtLCDate").data("kendoDatePicker").value(obj.Lcdate);
        $("#cboSC").data("kendoComboBox").value(obj.ScId);
        $("#cboBuyer").data("kendoComboBox").value(obj.BuyerId);
        $("#cboBeneficiary").data("kendoComboBox").value(obj.Beneficiary);
        $("#cboOpeningBank").data("kendoComboBox").value(obj.OpenBankId);
        $("#cboLienBank").data("kendoComboBox").value(obj.LienBankId);
        $("#dtLienDate").data("kendoDatePicker").value(obj.LienDate);
        $("#cboRcvThrough").data("kendoComboBox").value(obj.ReceiveThrough);
        $("#cboCurrency").data("kendoComboBox").value(obj.CurrencyId);
        $("#txtLCOpeningValue").data("kendoNumericTextBox").value(obj.LcopeningValue);
        $("#txtLCCurrentValue").data("kendoNumericTextBox").value(obj.Lcvalue);
        $("#txtTolerance").data("kendoNumericTextBox").value(obj.Tolerance);
        $("#txtFreightAmt").data("kendoNumericTextBox").value(obj.FreightAmount);
        $("#dtShipDate").data("kendoDatePicker").value(obj.ShipDate);
        $("#dtExpiryDate").data("kendoDatePicker").value(obj.ExpDate);
        $("#cboTradeTerms").data("kendoComboBox").value(obj.ShipmentTermsId);
        $("#cboIncoTermPlace").data("kendoComboBox").value(obj.IncoTermPlaceId);
        $("#cboPayTerm").data("kendoComboBox").value(obj.PayTermsId);
        $("#txtTenor").data("kendoNumericTextBox").value(obj.SightDays);
        $("#cboShipmentMode").data("kendoComboBox").value(obj.ShipmentModeId);
        $("#cboConsignee").data("kendoComboBox").value(obj.ConsigneeId);
        $("#cboNotifyParty").data("kendoComboBox").value(obj.NotifyParty);
        $("#cboDestination").data("kendoComboBox").value(obj.DestinationId);
        $("#cboPortOfLoading").data("kendoComboBox").value(obj.PortOfLoadingId);
        $("#cboLCFor").data("kendoComboBox").value(obj.LcforId);
        $("#txtMaxImportLimit").data("kendoNumericTextBox").value(obj.MaxImportLimit);
        $("#txtCommercialRef").val(obj.CommercialRef);
        $("#txtRemarks").val(obj.Remarks);

        $("#txtPreSCAmt").data("kendoNumericTextBox").value(obj.Lcvalue);
        $("#dtPreShipDate").data("kendoDatePicker").value(obj.ShipDate);
        $("#dtPreExpDate").data("kendoDatePicker").value(obj.ExpDate);
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnLCId").val("00000000-0000-0000-0000-000000000000");
        $("#txtLCNo").val("");
        $("#cboSC").data("kendoComboBox").value("");
        $("#dtLCDate").data("kendoDatePicker").value("");
        $("#cboBuyer").data("kendoComboBox").value("");
        $("#cboBeneficiary").data("kendoComboBox").value("");
        $("#cboOpeningBank").data("kendoComboBox").value("");
        $("#cboLienBank").data("kendoComboBox").value("");
        $("#dtLienDate").data("kendoDatePicker").value("");
        $("#cboRcvThrough").data("kendoComboBox").value("");
        $("#cboCurrency").data("kendoComboBox").value("");
        $("#txtLCOpeningValue").data("kendoNumericTextBox").value("");
        $("#txtLCCurrentValue").data("kendoNumericTextBox").value("");
        $("#txtTolerance").data("kendoNumericTextBox").value("");
        $("#txtFreightAmt").data("kendoNumericTextBox").value("");
        $("#dtShipDate").data("kendoDatePicker").value("");
        $("#dtExpiryDate").data("kendoDatePicker").value("");
        $("#cboTradeTerms").data("kendoComboBox").value("");
        $("#cboIncoTermPlace").data("kendoComboBox").value("");
        $("#cboPayTerm").data("kendoComboBox").value("");
        $("#txtTenor").data("kendoNumericTextBox").value("");
        $("#cboShipmentMode").data("kendoComboBox").value("");
        $("#cboConsignee").data("kendoComboBox").value("");
        $("#cboNotifyParty").data("kendoComboBox").value("");
        $("#cboDestination").data("kendoComboBox").value("");
        $("#cboPortOfLoading").data("kendoComboBox").value("");
        $("#cboLCFor").data("kendoComboBox").value("");
        $("#txtMaxImportLimit").data("kendoNumericTextBox").value("");
        $("#txtCommercialRef").val("");
        $("#txtRemarks").val("");
    },

    GeneratePOGrid: function () {
        $("#gridPOList").kendoGrid({
            dataSource: [], //ExportLCInfoManager.gridDataSourcePO(),
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
                { field: "Lcid", hidden: true },
                { field: "TempLCId", title: "LC ID", sortable: true },
                { field: "Lcno", title: "LC No", sortable: true },
                { field: "ContractId", title: "Contract Id", sortable: true },
                { field: "Scno", title: "SC No", sortable: true },
                { field: "CreatedAt", title: "LC Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(CreatedAt), "dd-MMM-yyyy") #' },
                { field: "ShipmentDate", title: "Shipment Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(ShipmentDate), "dd-MMM-yyyy") #' },
                { field: "CutOffDate", title: "Cut Off Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(CutOffDate), "dd-MMM-yyyy") #' },
                { field: "ReceivedDate", title: "Received Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(ReceivedDate), "dd-MMM-yyyy") #' },
                { field: "OrderQty", title: "Order Qty", sortable: true },
                { field: "OrderValue", title: "Order Value", sortable: true },
                { field: "Beneficiary", title: "Beneficiary", sortable: true },
                //{
                //    command: [{
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success" /*, click: ExportLCInfoHelper.ClickEventForEditButtonPO*/
                //    }], title: "Action &nbsp;"
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadPODataSource: function () {
        var lcid = $("#hdnLCId").val();
        var grid = $("#gridPOList").data("kendoGrid");
        var data = ExportLCInfoManager.gridDataSourcePO(lcid);
        grid.setDataSource(data);
    },

    //GenerateGroupLcB2BGrid: function () {
    //    $("#gridBBLcInfo").kendoGrid({
    //        dataSource: [], //ExportLCInfoManager.gridDataSourceBBLC(),
    //        pageable: {
    //            refresh: true,
    //            serverPaging: true,
    //            serverFiltering: true,
    //            serverSorting: true
    //        },
    //        filterable: true,
    //        sortable: true,
    //        columns: [
    //            { field: "BBLCID", hidden: true },
    //            { field: "LCId", hidden: true },
    //            { field: "TempLCId", title: "LC ID", sortable: true },
    //            { field: "Lcno", title: "LC NO", sortable: true },
    //            //{ field: "GroupCode", title: "Group Code", sortable: true },
    //            { field: "Bblcno", title: "BBLC No", sortable: true },
    //            { field: "ScopeningValue", title: "LC Amount", sortable: true },
    //            { field: "CurrentBblcamount", title: "BBLC Amount", sortable: true },
    //            //{ field: "DistributionAmt", title: "Distribution Amount", sortable: true },
    //            //{
    //            //    command: [{
    //            //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success" /*, click: ExportLCInfoHelper.ClickEventForEditButtonBBLC*/
    //            //    }], title: "Action &nbsp;"
    //            //}
    //        ],
    //        editable: false,
    //        selectable: "row",
    //        navigatable: true
    //    });
    //},
    //LoadB2BDataSource: function () {
    //    var search = $("#txtSrcLC").val();
    //    var grid = $("#gridBBLcInfo").data("kendoGrid");
    //    var data = ExportLCInfoManager.gridDataSourceBBLC(search);
    //    grid.setDataSource(data);
    //},

    InitModal() {
        $("#divLCModal").kendoWindow({
            title: "Export LC List",
            resizeable: true,
            scrollable: false,
            width: "80%",
            actions: ["Close"],
            modal: true,
            animation: {
                close: {
                    effects: "fade:out"
                },
            }
        });

        $("#btnLCModalClose").click(function () {
            $("#divLCModal").data("kendoWindow").close();
        });
    },

}