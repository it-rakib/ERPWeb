var files = [];

var ContractInfoManager = {
    //Sales Contract

    SaveContractDetails: function () {
        debugger;
        var msg = "";
        var validator = $("#divContact").kendoValidator().data("kendoValidator"), status = $(".status");
        if (validator.validate()) {
            if (ContractInfoHelper.ValidateContractForm()) {
                var contractObj = ContractInfoHelper.CreateContractObject();
                var jsonParam = JSON.stringify(contractObj);
                if (contractObj.Scno != null) {
                    var serviceUrl = _baseUrl + "/api/ComSalesContract/CreateUpdateComSalesContract";
                    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                } else {
                    AjaxManager.MsgBox('warning', 'center', 'Required', "Please Input Sales Contract / LC No!",
                    [{
                        addClass: 'btn btn-primary', text: 'OK', onClick: function ($noty) {
                            $noty.close();
                            $("#txtContractNo").focus();
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
                            ContractSummaryHelper.LoadContractGridDataSource();
                            ContractInfoHelper.ClearForm();
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
    gridDataSourcePO: function (scid) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/PurchaseOrders/GetPOGridDataBySCId/' + scid,  // PO Grid Url
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
                    id: "Scid",
                    fields: {
                        Scid: { editable: false },
                        Scno: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },

    // BBLC Grid
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
                    url: _baseUrl + '/api/ComSalesContract/GetB2BLCGridDataSCId/?searchkey=' + $.trim(search),  // BBLC Grid Url
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
                    id: "Scid",
                    fields: {
                        Scid: { editable: false },
                        Scno: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSourceB2B;
    },
}

var ContractInfoHelper = {
    Init() {
        ContractInfoHelper.InitModal();
        ContractInfoHelper.InitCombos();
        ContractInfoHelper.GenerateDatePicker();
        ContractInfoHelper.GenerateNumericTextBox();
        ContractInfoHelper.GeneratePOGrid();
        ContractInfoHelper.LoadPODataSource();
        //ContractInfoHelper.GenerateGroupLcB2BGrid();
        //ContractInfoHelper.LoadB2BDataSource();
        $("#tabstrip").kendoTabStrip({
            animation: {
                open: { effects: "fadeIn"}
            }
        } );
        if ( $( "#hdnSCId" ).val() == "00000000-0000-0000-0000-000000000000" )
        {
           
            $( "#DocumentFileUpload" ).hide();

        }
        $("#parentSC").hide();
        $("#pnlMasterInfo").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        $("#btnSearchContact").click(function () {
            $("#divSCModal").data("kendoWindow").open().center();
            //ContractSummaryHelper.GenerateContractGrid();
            ContractSummaryHelper.LoadContractGridDataSource();
        });
        $("#btnContractorLC").click(function () {
            $("#divSCLCModal").data("kendoWindow").open().center();
            //ContractLCSummaryHelper.InitContractLCSummary();
            ContractLCSummaryHelper.LoadDataSource();
        });
        $('#txtSrcContact').on('input', function (e) {
            ContractInfoHelper.LoadPODataSource();
        });
        $("#btnSave").click(function () {
            var SCNO = $("#txtContractNo").val();
            if (SCNO != "") {
                ContractInfoManager.SaveContractDetails();
            } else {
                AjaxManager.MsgBox('warning', 'center', 'Please Confirm', "Please give all required information.",
                    [{
                        addClass: 'btn btn-primary',
                        text: 'OK',
                        onClick: function ($noty) {
                            $noty.close();
                            $("#txtContractNo").focus();
                        }
                    }])
            }
        });
        $("#btnClearAll").click(function () {
            //ContractInfoHelper.ClearForm();
            //location.reload(true);
            window.location.reload(true);
        });

        $("#cboBeneficiary,#cboOpeningBank,#cboRcvThrough,#cboLienBank,#cboTradeTerms,#cboPayTerm,#cboShipmentMode,#cboConsignee,#cboNotifyParty,#cboBuyer").kendoComboBox({
            autoWidth: true,
        });

        $("#cboSCType").change(function () {
            ContractInfoHelper.ChangeEventSCTypeCombo();
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
    ChangeEventSCTypeCombo: function () {
        var type = $("#cboSCType").data("kendoComboBox").dataItem();
        type = type == null || typeof type === "undefined" ? AjaxManager.DefaultGuidId() : type;
        if (kendo.toString(type.SctypeId).toUpperCase() == "29DE0A9B-0C42-4EB2-BDB0-5D06873439A2") {
            $("#parentSC").show();
            $("#lblSCorLCNo").html("LC No");
            $("#lblSCorLCDate").html("LC Date");
        } else {
            $("#hdnParentSCId").val("");
            $("#txtSrcContractorLC").val("");
            $("#parentSC").hide();
            $("#lblSCorLCNo").html("Sales Contract No");
            $("#lblSCorLCDate").html("SC Date");
        }
    },
    InitCombos() {
        $(".hiddenId").val(AjaxManager.DefaultGuidId());
        MerchantHelper.LoadScTypeCombo("cboSCType");
        MerchantHelper.LoadCompanyCombo("cboBeneficiary");
        MerchantHelper.LoadBankCombo("cboOpeningBank");
        MerchantHelper.LoadBankCombo("cboRcvThrough");
        MerchantHelper.LoadBuyerCombo("cboBuyer");
        MerchantHelper.LoadBankCombo("cboLienBank");
        MerchantHelper.GenerateCurrencyCombo("cboCurrency");
        MerchantHelper.LoadShipmentModeCombo("cboShipmentMode");
        MerchantHelper.LoadScForCombo("cboSCFor");
        MerchantHelper.LoadShipmentTermsCombo("cboTradeTerms");
        MerchantHelper.LoadPaymentTermCombo("cboPayTerm");
        MerchantHelper.LoadConsigneeCombo("cboConsignee");
        MerchantHelper.LoadCompanyCombo("cboNotifyParty");
    },
    GenerateDatePicker: function () {
        $("#dtSCDate,#dtLienDate,#dtShipDate,#dtExpiryDate").kendoDatePicker({
            value: new Date(),
            format: "dd-MMM-yyyy"
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtSCOpeningValue").kendoNumericTextBox({
            format: "#.####",
            min: 0,
            decimals: 4,
            change: function () {
                ContractInfoHelper.FillSCCurrentValue();
            }
        });
        $("#txtSCCurrentValue").kendoNumericTextBox({
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
            min: 0,
            //decimals: 4
        });
        $("#txtMaxImportLimit").kendoNumericTextBox({
            format: "#.####",
            min: 0,
            decimals: 4
        });
    },
    FillSCCurrentValue: function () {
        var SCOpen = IkrHelper.EmptyThenZero($("#txtSCOpeningValue").data("kendoNumericTextBox").value());
        $("#txtSCCurrentValue").data("kendoNumericTextBox").value(SCOpen);
        $("#txtPreSCAmt").data("kendoNumericTextBox").value(SCOpen);
    },

    CreateContractObject: function (ContractObj) {
        var obj = new Object();
        obj.Scid = $("#hdnSCId").val();
        obj.ContractId = $("#hdnContractId").val() == AjaxManager.DefaultGuidId() ? "" : $("#hdnContractId").val();
        obj.Scno = $("#txtContractNo").val();
        obj.Scdate = $("#dtSCDate").data("kendoDatePicker").value();
        obj.SctypeId = UtilityHelper.EmptyThenDefaultGuidId($("#cboSCType").data("kendoComboBox").value());
        obj.BuyerId = UtilityHelper.EmptyThenDefaultGuidId($("#cboBuyer").data("kendoComboBox").value());
        obj.Beneficiary = $("#cboBeneficiary").data("kendoComboBox").value() == "" ? 0 : $("#cboBeneficiary").data("kendoComboBox").value();
        obj.OpenBankId = UtilityHelper.EmptyThenDefaultGuidId($("#cboOpeningBank").data("kendoComboBox").value());
        obj.LienBankId = UtilityHelper.EmptyThenDefaultGuidId($("#cboLienBank").data("kendoComboBox").value());
        obj.LienDate = $("#dtLienDate").data("kendoDatePicker").value();
        obj.ReceiveThrough = UtilityHelper.EmptyThenDefaultGuidId($("#cboRcvThrough").data("kendoComboBox").value());
        obj.CurrencyId = $("#cboCurrency").data("kendoComboBox").value();
        obj.Scvalue = $("#txtSCCurrentValue").val();
        obj.ScopeningValue = $("#txtSCOpeningValue").val();
        obj.Tolerance = $("#txtTolerance").val() == "" ? 0 : $("#txtTolerance").val();
        obj.IsProvisionIsProvision = $("#chkIsProvision").is(":checked");
        obj.FreightAmount = $("#txtFreightAmt").val() == "" ? 0 : $("#txtFreightAmt").val();
        obj.ShipDate = $("#dtShipDate").data("kendoDatePicker").value();
        obj.ExpDate = $("#dtExpiryDate").data("kendoDatePicker").value();
        obj.ShipmentTermsId = UtilityHelper.EmptyThenDefaultGuidId($("#cboTradeTerms").data("kendoComboBox").value());
        obj.PayTermsId = UtilityHelper.EmptyThenDefaultGuidId($("#cboPayTerm").data("kendoComboBox").value());
        obj.SightDays = $("#txtTenor").val();
        obj.ShipmentModeId = UtilityHelper.EmptyThenDefaultGuidId($("#cboShipmentMode").data("kendoComboBox").value());
        obj.ConsigneeId = UtilityHelper.EmptyThenDefaultGuidId($("#cboConsignee").data("kendoComboBox").value());
        obj.NotifyParty = $("#cboNotifyParty").data("kendoComboBox").value() == "" ? 0 : $("#cboNotifyParty").data("kendoComboBox").value();        
        obj.ScforId = UtilityHelper.EmptyThenDefaultGuidId($("#cboSCFor").data("kendoComboBox").value());
        obj.MaxImportLimit = $("#txtMaxImportLimit").val() == "" ? 0 : $("#txtMaxImportLimit").val();
        obj.CommercialRef = $("#txtCommercialRef").val();
        obj.Remarks = $("#txtRemarks").val();
        obj.CreatedBy = CurrentUser.USERID;
        obj.ParentId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnParentSCId").val());
        return obj;
    },
    FillContractForm: function (obj, isEdit) {
        debugger;
        if (isEdit) {
            $("#cboSCType").data("kendoComboBox").enable(false);
            //$("#btnSave").attr("disabled", "disabled");
            $("#btnSave").text("Update");
            $("#btnSave").addClass("fa fa-save");
            //$("#btnSave").addClass("fa fa-pencil").text("Update");
        } else {
            $("#cboSCType").data("kendoComboBox").enable(true);
            //$("#btnSave").removeAttr('disabled');
            $("#btnSave").text("Save");
            $("#btnSave").addClass("fa fa-save");
        }
        $("#txtSrcContact").val(obj.ContractId);
        $("#hdnContractId").val(obj.ContractId);
        $("#hdSCId").val(obj.Scid);
        $("#hdnSCId").val(obj.Scid);
        $("#txtContractNo").val(obj.Scno);
        $("#dtSCDate").data("kendoDatePicker").value(obj.Scdate);
        $("#cboSCType").data("kendoComboBox").value(obj.SctypeId);
        $("#cboBuyer").data("kendoComboBox").value(obj.BuyerId);
        $("#cboBeneficiary").data("kendoComboBox").value(obj.Beneficiary);
        $("#cboOpeningBank").data("kendoComboBox").value(obj.OpenBankId);
        $("#cboLienBank").data("kendoComboBox").value(obj.LienBankId);
        $("#dtLienDate").data("kendoDatePicker").value(obj.LienDate);
        $("#cboRcvThrough").data("kendoComboBox").value(obj.ReceiveThrough);
        $("#cboCurrency").data("kendoComboBox").value(obj.CurrencyId);
        $("#txtSCOpeningValue").data("kendoNumericTextBox").value(obj.ScopeningValue);
        $("#txtSCCurrentValue").data("kendoNumericTextBox").value(obj.Scvalue);
        $("#txtTolerance").data("kendoNumericTextBox").value(obj.Tolerance);
        if (obj.IsActive == true) {
            $("#chkIsProvision").prop('checked', true)
        } else {
            $("#chkIsProvision").prop('checked', false)
        };
        $("#txtFreightAmt").data("kendoNumericTextBox").value(obj.FreightAmount);
        $("#dtShipDate").data("kendoDatePicker").value(obj.ShipDate);
        $("#dtExpiryDate").data("kendoDatePicker").value(obj.ExpDate);
        $("#cboTradeTerms").data("kendoComboBox").value(obj.ShipmentTermsId);
        $("#cboPayTerm").data("kendoComboBox").value(obj.PayTermsId);
        $("#txtTenor").data("kendoNumericTextBox").value(obj.SightDays);
        $("#cboShipmentMode").data("kendoComboBox").value(obj.ShipmentModeId);
        $("#cboConsignee").data("kendoComboBox").value(obj.ConsigneeId);
        $("#cboNotifyParty").data("kendoComboBox").value(obj.NotifyParty);
        $("#cboSCFor").data("kendoComboBox").value(obj.ScforId);
        $("#txtMaxImportLimit").data("kendoNumericTextBox").value(obj.MaxImportLimit);
        $("#txtCommercialRef").val(obj.CommercialRef);
        $("#txtRemarks").val(obj.Remarks);

        $("#txtPreSCAmt").data("kendoNumericTextBox").value(obj.Scvalue);
        $("#dtPreShipDate").data("kendoDatePicker").value(obj.ShipDate);
        $( "#dtPreExpDate" ).data( "kendoDatePicker" ).value( obj.ExpDate );
        $( "#DocumentFileUpload" ).show();
        files = obj.FilesVm;
        ContractInfoHelper.LoadFile();
    },
    FillContractFormByParent: function (obj) {
        $("#hdnParentSCId").val(obj.Scid);
        $("#txtSrcContractorLC").val(obj.ContractId);
        //$("#cboSCType").data("kendoComboBox").value(obj.SctypeId);
        //$("#txtContractNo").val(obj.Scno);
        $("#dtSCDate").data("kendoDatePicker").value(obj.Scdate);
        $("#cboBuyer").data("kendoComboBox").value(obj.BuyerId);
        $("#cboBeneficiary").data("kendoComboBox").value(obj.Beneficiary);
        $("#cboOpeningBank").data("kendoComboBox").value(obj.OpenBankId);
        $("#cboLienBank").data("kendoComboBox").value(obj.LienBankId);
        $("#dtLienDate").data("kendoDatePicker").value(obj.LienDate);
        $("#cboRcvThrough").data("kendoComboBox").value(obj.ReceiveThrough);
        $("#cboCurrency").data("kendoComboBox").value(obj.CurrencyId);
        $("#txtSCOpeningValue").data("kendoNumericTextBox").value(obj.ScopeningValue);
        $("#txtSCCurrentValue").data("kendoNumericTextBox").value(obj.Scvalue);
        $("#txtTolerance").data("kendoNumericTextBox").value(obj.Tolerance);
        if (obj.IsActive == true) {
            $("#chkIsProvision").prop('checked', true)
        } else {
            $("#chkIsProvision").prop('checked', false)
        };
        $("#txtFreightAmt").data("kendoNumericTextBox").value(obj.FreightAmount);
        $("#dtShipDate").data("kendoDatePicker").value(obj.ShipDate);
        $("#dtExpiryDate").data("kendoDatePicker").value(obj.ExpDate);
        $("#cboTradeTerms").data("kendoComboBox").value(obj.ShipmentTermsId);
        $("#cboPayTerm").data("kendoComboBox").value(obj.PayTermsId);
        $("#txtTenor").data("kendoNumericTextBox").value(obj.SightDays);
        $("#cboShipmentMode").data("kendoComboBox").value(obj.ShipmentModeId);
        $("#cboConsignee").data("kendoComboBox").value(obj.ConsigneeId);
        $("#cboNotifyParty").data("kendoComboBox").value(obj.NotifyParty);
        $("#cboSCFor").data("kendoComboBox").value(obj.ScforId);
        $("#txtMaxImportLimit").data("kendoNumericTextBox").value(obj.MaxImportLimit);
        $("#txtCommercialRef").val(obj.CommercialRef);
        $("#txtRemarks").val(obj.Remarks);
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#parentSC").hide();
        $("#hdnSCId").val(AjaxManager.DefaultGuidId());
        $("#hdnParentSCId").val("");
        $("#txtSrcContractorLC").val("");
        $("#txtContractNo").val("");
        $("#cboSCType").data("kendoComboBox").value("");
        $("#dtSCDate").data("kendoDatePicker").value("");
        $("#cboBuyer").data("kendoComboBox").value("");
        $("#cboBeneficiary").data("kendoComboBox").value("");
        $("#cboOpeningBank").data("kendoComboBox").value("");
        $("#cboLienBank").data("kendoComboBox").value("");
        $("#dtLienDate").data("kendoDatePicker").value("");
        $("#cboRcvThrough").data("kendoComboBox").value("");
        $("#cboCurrency").data("kendoComboBox").value("");
        $("#txtSCOpeningValue").data("kendoNumericTextBox").value("");
        $("#txtSCCurrentValue").data("kendoNumericTextBox").value("");
        $("#txtTolerance").data("kendoNumericTextBox").value("");
        $("#chkIsProvision").prop('checked', false);
        $("#txtFreightAmt").data("kendoNumericTextBox").value("");
        $("#dtShipDate").data("kendoDatePicker").value("");
        $("#dtExpiryDate").data("kendoDatePicker").value("");
        $("#cboTradeTerms").data("kendoComboBox").value("");
        $("#cboPayTerm").data("kendoComboBox").value("");
        $("#txtTenor").data("kendoNumericTextBox").value("");
        $("#cboShipmentMode").data("kendoComboBox").value("");
        $("#cboConsignee").data("kendoComboBox").value("");
        $("#cboNotifyParty").data("kendoComboBox").value("");
        $("#cboSCFor").data("kendoComboBox").value("");
        $("#txtMaxImportLimit").data("kendoNumericTextBox").value("");
        $("#txtCommercialRef").val("");
        $("#txtRemarks").val("");
        files = [];
        ContractInfoHelper.LoadFile();
        //ContractInfoHelper.Init();
    },

    GeneratePOGrid: function () {
        $("#gridPOList").kendoGrid({
            dataSource: [], //ContractInfoManager.gridDataSourcePO(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: [
                { field: "StyleId", hidden: true },
                { field: "Scid", hidden: true },
                { field: "ContractId", title: "Contract ID", sortable: true },
                { field: "Scno", title: "SC No", sortable: true },
                { field: "StyleNo", title: "Style No", sortable: true },
                { field: "Pono", title: "PO No", sortable: true },
                { field: "CreatedAt", title: "Po Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(CreatedAt), "dd-MMM-yyyy") #' },
                { field: "ShipmentDate", title: "Shipment Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(ShipmentDate), "dd-MMM-yyyy") #' },
                { field: "CutOffDate", title: "Cut Off Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(CutOffDate), "dd-MMM-yyyy") #' },
                { field: "ReceivedDate", title: "Received Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(ReceivedDate), "dd-MMM-yyyy") #' },
                { field: "OrderQty", title: "Order Qty", sortable: true },
                { field: "OrderValue", title: "Order Value", sortable: true },
                { field: "Beneficiary", title: "Beneficiary", sortable: true },
                //{
                //    command: [{
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success" /*, click: ContractInfoHelper.ClickEventForEditButtonPO*/
                //    }], title: "Action &nbsp;"
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadPODataSource: function () {
        var scid = $("#hdnSCId").val();
        var grid = $("#gridPOList").data("kendoGrid");
        var data = ContractInfoManager.gridDataSourcePO(scid);
        grid.setDataSource(data);
    },

    GenerateGroupLcB2BGrid: function () {
        $("#gridBBLcInfo").kendoGrid({
            dataSource: [], //ContractInfoManager.gridDataSourceBBLC(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: [
                { field: "StyleID", hidden: true },
                { field: "BBLCID", hidden: true },
                { field: "SCId", hidden: true },
                { field: "ContractId", title: "Contract ID", sortable: true },
                { field: "Scno", title: "SC NO", sortable: true },
                //{ field: "GroupCode", title: "Group Code", sortable: true },
                { field: "Bblcno", title: "BBLC No", sortable: true },
                { field: "ScopeningValue", title: "LC Amount", sortable: true },
                { field: "CurrentBblcamount", title: "BBLC Amount", sortable: true },
                //{ field: "DistributionAmt", title: "Distribution Amount", sortable: true },
                //{
                //    command: [{
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success" /*, click: ContractInfoHelper.ClickEventForEditButtonBBLC*/
                //    }], title: "Action &nbsp;"
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadB2BDataSource: function () {
        var search = $("#txtSrcContact").val();
        var grid = $("#gridBBLcInfo").data("kendoGrid");
        var data = ContractInfoManager.gridDataSourceBBLC(search);
        grid.setDataSource(data);
    },

    InitModal() {
        $("#divSCModal").kendoWindow({
            title: "Sales Contract List",
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

        $("#btnSCModalClose").click(function () {
            $("#divSCModal").data("kendoWindow").close();
        });

        $("#divSCLCModal").kendoWindow({
            title: "Sales Contract and LC Summary",
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

        $("#btnSCLCModalClose").click(function () {
            $("#divSCLCModal").data("kendoWindow").close();
        });
    },

    ValidateContractForm: function () {
        var res = true;
        var scNo = $("#txtContractNo").val();
        var scDate = $("#dtSCDate").data("kendoDatePicker");
        var shipDate = $("#dtShipDate").data("kendoDatePicker");
        var expireDate = $("#dtExpiryDate").data("kendoDatePicker");
        var obCombo = $("#cboOpeningBank").data("kendoComboBox");
        var lbToCombo = $("#cboLienBank").data("kendoComboBox");
        var buyerCombo = $("#cboBuyer").data("kendoComboBox");
        var openingValue = $("#txtSCOpeningValue").val();
        var recieveThrough = $("#cboRcvThrough").data("kendoComboBox");
        var shipmentMode = $("#cboShipmentMode").data("kendoComboBox");
        var incoTerm = $("#cboTradeTerms").data("kendoComboBox");
        var payTerm = $("#cboPayTerm").data("kendoComboBox");
        var tolerance = $("#txtTolerance").val();
        //var beneficiaryCombo = $("#cboBeneficiary").data("kendoComboBox");
        //var consigneeCombo = $("#cboConsignee").data("kendoComboBox");
        //var maxImportLimit = $("#txtMaxImportLimit").val();

        if (scNo === "" || scNo === null) {
            AjaxManager.NotifyMsg("txtContractNo", "error", "right", 1500, "Required SCNo");
            res = false;
        }
        if (scDate.value() === "" || scDate.value() === null) {
            AjaxManager.NotifyMsg("dtSCDate", "error", "right", 1500, "Required SCDate");
            res = false;
        }
        if (shipDate.value() === "" || shipDate.value() === null) {
            AjaxManager.NotifyMsg("dtShipDate", "error", "right", 1500, "Required ShipDate");
            res = false;
        }
        if (expireDate.value() === "" || expireDate.value() === null) {
            AjaxManager.NotifyMsg("dtExpiryDate", "error", "right", 1500, "Required Expiry Date");
            res = false;
        }
        if (obCombo.value() === "" || obCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboOpeningBank", "error", "right", 1500, "Required Opening Bank");
            res = false;
        }
        if (lbToCombo.value() === "" || lbToCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboLienBank", "error", "right", 1500, "Required Lien Bank");
            res = false;
        }
        //if (maxImportLimit === "" || maxImportLimit === null || maxImportLimit === 0) {
        //    AjaxManager.NotifyMsg("txtMaxImportLimit", "error", "bottom", 1500, "Max Limit Can't be zero");
        //    res = false;
        //}
        if (buyerCombo.value() === "" || buyerCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboBuyer", "error", "right", 1500, "Required Buyer");
            res = false;
        }
        if (recieveThrough.value() === "" || recieveThrough.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboRcvThrough", "error", "right", 1500, "Required Recieve Through");
            res = false;
        }
        if (openingValue === "" || openingValue === "0") {
            AjaxManager.NotifyMsg("txtSCOpeningValue", "error", "right", 1500, "Required Opening Value");
            res = false;
        }
        if (shipmentMode.value() === "" || shipmentMode.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboShipmentMode", "error", "right", 1500, "Required Shipment Mode");
            res = false;
        }
        if (incoTerm.value() === "" || incoTerm.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboTradeTerms", "error", "right", 1500, "Required Inco Term");
            res = false;
        }
        if (payTerm.value() === "" || payTerm.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboPayTerm", "error", "right", 1500, "Required Pay Term");
            res = false;
        }
        if (tolerance === "" || tolerance === "0") {
            AjaxManager.NotifyMsg("txtTolerance", "error", "right", 1500, "Required Tolerence%");
            res = false;
        }
        //if (beneficiaryCombo.value() === "" || beneficiaryCombo.value() === AjaxManager.DefaultGuidId()) {
        //    AjaxManager.NotifyMsg("beneficiaryCombo", "error", "right", 1500, "Required Beneficiary");
        //    res = false;
        //}
        //if (consigneeCombo.value() === "" || consigneeCombo.value() === AjaxManager.DefaultGuidId()) {
        //    AjaxManager.NotifyMsg("consigneeCombo", "error", "right", 1500, "Required Consignee");
        //    res = false;
        //}
        return res;
    },

    LoadFile: function () {
        debugger;
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