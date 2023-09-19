var CommercialInvoiceInfoManager = {
    SaveInvoiceDetails: function () {
        var msg = "";
        debugger;
        var validator = $("#divComInvoice").kendoValidator().data("kendoValidator");
        if (validator.validate()) {
            if (CommercialInvoiceInfoHelper.ValidateInvoiceForm()) {
                var objInvoice = CommercialInvoiceInfoHelper.CreateInvoiceObject();
                var jsonParam = JSON.stringify(objInvoice);
                if (objInvoice.InvoiceNo != null) {
                    var serviceUrl = _baseUrl + "/api/CommercialInvoice/CreateOrUpdateComInvoice";
                    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                }
                else {
                    AjaxManager.MsgBox('warning', 'center', 'Required', "Please Input Invoice No!",
                        [{
                            addClass: 'btn btn-primary', text: 'OK', onClick: function ($noty) {
                                $noty.close();
                                $("#txtInvoiceNo").focus();
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
                            CommercialInvoiceInfoHelper.ClearForm();
                            CommercialInvoiceInfoHelper.GeneratePIItemListGrid();
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
    BBLCComboDataSource: function () {
        var bblcCombodata = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/ComBackToBack";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            bblcCombodata = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return bblcCombodata;
    },
    gridDataSourcePIItemList: function (bblcid) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            // groupPaging: true,
            // serverGrouping: true,
            // serverAggregates: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/CommercialInvoice/GetPIByBBLCIdGrid/' + bblcid,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json;",
                    cache: false,
                    async: false
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            group: [
                {
                    field: "Pino",
                    dir: "asc", aggregates: [
                        { field: "ItemQuantity", aggregate: "sum" },
                        { field: "UnitPrice", aggregate: "average" },
                        { field: "Amount", aggregate: "sum" }
                    ]
                }

            ],
            aggregate: [
                { field: "ItemQuantity", aggregate: "sum" },
                { field: "UnitPrice", aggregate: "average" },
                { field: "Amount", aggregate: "sum" }
            ],
            batch: true,
            schema: {
                model: {
                    id: "Piid",
                    fields: {
                        piid: { editable: false },
                        pino: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    }
}

var CommercialInvoiceInfoHelper = {
    Init() {
        CommercialInvoiceInfoHelper.InitModal();
        CommercialInvoiceInfoHelper.InitCombos();
        CommercialInvoiceInfoHelper.GenerateDatePicker();
        CommercialInvoiceInfoHelper.GenerateNumericTextBox();
        CommercialInvoiceInfoHelper.LoadBBLCCombo();
        CommercialInvoiceInfoHelper.GeneratePIItemListGrid();

        $("#pnlMaster").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        $("#btnSearchInvoice").click(function () {
            CommercialInvoiceSummaryHelper.GenerateCommercialInvoiceGrid();
            $("#divCIModal").data("kendoWindow").open().center();
        });
        $("#cboCompany,#cboCurrency,#cboSupplier,#cboTradeTerm,#cboPayTerm,#cboBBLc,#cboDocStatus,#cboShipmentMode,#cboCountry,#cboPortOfDischarge,#cboPortOfLoading,#cboLTAgent,#cboClearningAgent,#cboETADestPort").kendoComboBox({
            autoWidth: true,
        });
        $("#btnSave").click(function () {
            CommercialInvoiceInfoManager.SaveInvoiceDetails();
            //var CINO = $("#txtInvoiceNo").val();
            //if (CINO != "") {
            //    CommercialInvoiceInfoManager.SaveInvoiceDetails();
            //} else {
            //    AjaxManager.MsgBox('error', 'center', 'Required', "Please give all required information.",
            //        [{
            //            addClass: 'btn btn-primary',
            //            text: 'OK',
            //            onClick: function ($noty) {
            //                $noty.close();
            //                $("#txtInvoiceNo").focus();
            //            }
            //        }])
            //}
        });
        $("#btnClearAll").click(function () {
            CommercialInvoiceInfoHelper.ClearForm();
        });
        $("#cboBBLcGrid").change(function () {
            CommercialInvoiceInfoHelper.LoadePIItemGrid();
        });
        $("#cboPayTerm").change(function () {
            var currentValue = $("#cboPayTerm").data("kendoComboBox").value();
            if (currentValue === "5bb21d9c-0869-45d7-999e-ae8231799cf5") {
                $("#txtPayTermDays").data("kendoNumericTextBox").value("");
                $("#txtPayTermDays").data("kendoNumericTextBox").enable(false);
            }
            else {
                $("#txtPayTermDays").data("kendoNumericTextBox").enable(true);
            }
        });
    },
    InitCombos() {
        $(".hiddenId").val(AjaxManager.DefaultGuidId());
        MerchantHelper.LoadCompanyCombo("cboCompany");
        MerchantHelper.GenerateCurrencyCombo("cboCurrency");
        MerchantHelper.LoadSupplierCombo("cboSupplier");
        MerchantHelper.LoadShipmentTermsCombo("cboTradeTerm");
        MerchantHelper.LoadPaymentTermCombo("cboPayTerm");
        MerchantHelper.LoadDocStatusCombo("cboDocStatus");
        MerchantHelper.LoadShipmentModeCombo("cboShipmentMode");
        MerchantHelper.LoadCountryCombo("cboCountry");
        MerchantHelper.LoadPortCombo("cboPortOfloading");
        MerchantHelper.LoadPortCombo("cboPortOfDischarge");
        MerchantHelper.LoadAgentCombo("cboLTAgent");
        MerchantHelper.LoadAgentCombo("cboClearningAgent");
        MerchantHelper.LoadPortCombo("cboETADestPort");
        CommercialInvoiceInfoHelper.GenerateMultiColumnComboBox("cboBBLcGrid");
    },
    GenerateMultiColumnComboBox: function (ctrlId) {
        $("#" + ctrlId).kendoMultiColumnComboBox({
            dataSource: [],
            dataTextField: "Bblcno",
            dataValueField: "Bblcid",
            columns: [
                //{ field: "Bblcid", hidden: true },
                { field: "BblctempId", title: "BBLc ID",},
                { field: "Bblcno", title: "BBLc No",},
                { field: "SupplierName", title: "Supplier",},
                { field: "OpenBankName", title: "Open Bank",},
                //{ field: "AdvisingBankName", title: "Advising Bank", width: 200 },
                { field: "SupplierBankName", title: "Supplier Bank", width: 200 },
                { field: "BbCurrancyName", title: "Currancy", width: 200 },
                //{ field: "TradeTermName", title: "Ship Terms", width: 80 },
                //{ field: "PaymentTermName", title: "Pay Terms", width: 200 },
                //{ field: "PortOfLoadingName", title: "Port of Loading", width: 200 },
                //{ field: "PortOfDischargeName", title: "Port of Discharge", width: 200 },
            ],
            filter: "contains",
            filterFields: ["BblctempId", "Bblcno", "SupplierName", "CompanyName", "OpenBankName"],
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            index: 0,
            placeholder: "--Select BBLc No--",
            height: 400
        });
    },
    LoadBBLCCombo: function () {
        var data = CommercialInvoiceInfoManager.BBLCComboDataSource();
        data.unshift(UtilityUnShift.GetUnshiftBBLCComboGridSearch());        
        var bblcId = $("#cboBBLcGrid").data("kendoMultiColumnComboBox");
        bblcId.value("");
        bblcId.setDataSource(data);
        bblcId.select(0);
        bblcId.list.width("60%");
    },

    GenerateDatePicker: function () {
        $("#dtInvoiceDate,#dtBondDate,#dtIPDate,#dtBillofEntryDate,#dtBLDate,#dtVoyageDate,#dtBankRefDate,#dtCompanyAcptDate,#dtBankAcptDate,#dtMaturityDate,#dtDocRcvDate,#dtGoodsRcvDate,#dtDocHandoverDate,#dtETAPortDate,#dtETAinHouseDate").kendoDatePicker({
            value: new Date(),
            format: "dd-MMM-yyyy"
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtInvoiceValue,#txtExRate,#txtAcceptedValue,#txtDiscAmount").kendoNumericTextBox({
            format: "#.####",
            min: 0,
            decimals: 4
        });
        $("#txtPayTermDays").kendoNumericTextBox({ format: "#", min: 0 });
        //$( "#txtPayTermDays" ).kendoNumericTextBox( { format: "#", min: 0 } ).css( "width", "100%" );
    },
    GenerateCombo: function (identity) {
        var objDocStatus = [
            { TypeId: 1, TypeName: "Original" },
            { TypeId: 2, TypeName: "Non Nego" }
        ];

        $("#" + identity).kendoComboBox({
            placeholder: "-- Select --",
            dataTextField: "TypeName",
            dataValueField: "TypeId",
            //dataSource: objPurposeType,
            index: 0
        });
        var combobox = $("#" + identity).data("kendoComboBox");
        if (identity === "cboDocStatus") {
            combobox.setDataSource(objDocStatus);
        }
    },
    InitModal() {
        $("#divCIModal").kendoWindow({
            title: "Double click on a row for edit",
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
        $('#divCIModal').parent().find('k-window-titlebar').css('backgroundColor', 'red');

        $("#btnCIModalClose").click(function () {
            $("#divCIModal").data("kendoWindow").close();
        });
    },

    CreateInvoiceObject: function (objInvoice) {
        var obj = new Object();
        obj.Ciid = $("#hdnCIID").val();
        obj.InvoiceId = $("#hdnInvoiceId").val() == "00000000-0000-0000-0000-000000000000" ? "" : $("#hdnInvoiceId").val();
        obj.InvoiceNo = $("#txtInvoiceNo").val();
        obj.InvoiceDate = $("#dtInvoiceDate").data("kendoDatePicker").value();
        obj.InvoiceValue = $("#txtInvoiceValue").data("kendoNumericTextBox").value() == "" ? 0 : $("#txtInvoiceValue").data("kendoNumericTextBox").value();
        obj.CompanyId = $("#cboCompany").data("kendoComboBox").value() == "" ? 0 : $("#cboCompany").data("kendoComboBox").value();
        obj.CurrencyId = $("#cboCurrency").data("kendoComboBox").value();
        obj.ExRate = $("#txtExRate").data("kendoNumericTextBox").value() == "" ? 0 : $("#txtExRate").data("kendoNumericTextBox").value();
        obj.SupplierId = $("#cboSupplier").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboSupplier").data("kendoComboBox").value();
        obj.ShipmentTermsId = $("#cboTradeTerm").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboTradeTerm").data("kendoComboBox").value();
        obj.PaymentTermsId = $("#cboPayTerm").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboPayTerm").data("kendoComboBox").value();
        obj.PayTermDays = $("#txtPayTermDays").data("kendoNumericTextBox").value() == "" ? 0 : $("#txtPayTermDays").data("kendoNumericTextBox").value();
        obj.BondNo = $("#txtBondNo").val();
        obj.BondDate = $("#dtBondDate").data("kendoDatePicker").value();
        obj.Bblcid = $("#cboBBLcGrid").data("kendoMultiColumnComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboBBLcGrid").data("kendoMultiColumnComboBox").value();
        obj.RegNo = $("#txtRegNo").val();
        obj.DocStatusId = $("#cboDocStatus").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboDocStatus").data("kendoComboBox").value();
        obj.Ipno = $("#txtIPNo").val();
        obj.Ipdate = $("#dtIPDate").data("kendoDatePicker").value();
        obj.CmnShipmentModeId = $("#cboShipmentMode").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboShipmentMode").data("kendoComboBox").value();
        obj.BillOfEntry = $("#txtBillofEntry").val();
        obj.BillOfEntryDate = $("#dtBillofEntryDate").data("kendoDatePicker").value();
        obj.Blno = $("#txtBLNo").val();
        obj.Bldate = $("#dtBLDate").data("kendoDatePicker").value();
        obj.CountryId = $("#cboCountry").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboCountry").data("kendoComboBox").value();
        obj.VesselName = $("#txtVesselName").val();
        obj.EtainHouse = $("#dtETAinHouseDate").data("kendoDatePicker").value();
        obj.VoyageDate = $("#dtVoyageDate").data("kendoDatePicker").value();
        obj.PortOfLoadingId = $("#cboPortOfloading").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboPortOfloading").data("kendoComboBox").value();
        obj.PortOfDischargeId = $("#cboPortOfDischarge").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboPortOfDischarge").data("kendoComboBox").value();
        obj.LocalTransporterAgentId = $("#cboLTAgent").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboLTAgent").data("kendoComboBox").value();
        obj.BankRefNo = $("#txtBankRefNo").val();
        obj.BankRefDate = $("#dtBankRefDate").data("kendoDatePicker").value();
        obj.CompanyAcptDate = $("#dtCompanyAcptDate").data("kendoDatePicker").value();
        obj.BankAcptDate = $("#dtBankAcptDate").data("kendoDatePicker").value();
        obj.AcceptanceValue = $("#txtAcceptedValue").data("kendoNumericTextBox").value() == "" ? 0 : $("#txtAcceptedValue").data("kendoNumericTextBox").value();
        obj.MaturityDate = $("#dtMaturityDate").data("kendoDatePicker").value();
        obj.DocRecDate = $("#dtDocRcvDate").data("kendoDatePicker").value();
        obj.GoodsRecDate = $("#dtGoodsRcvDate").data("kendoDatePicker").value();
        obj.ClearingAgentId = $("#cboClearningAgent").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboClearningAgent").data("kendoComboBox").value();
        obj.DocHandOverDate = $("#dtDocHandoverDate").data("kendoDatePicker").value();
        obj.EtaportDate = $("#dtETAPortDate").data("kendoDatePicker").value();
        obj.EtadestPortId = $("#cboETADestPort").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboETADestPort").data("kendoComboBox").value();
        obj.CustomHscode = $("#txtCustHDCode").val();
        obj.Remarks = $("#txtRemarks").val();
        obj.DiscountAmount = $("#txtDiscAmount").data("kendoNumericTextBox").value() == "" ? 0 : $("#txtDiscAmount").data("kendoNumericTextBox").value();
        obj.IsFabric = $("#chkFabric").is(":checked");
        obj.IsTrims = $("#chkTrims").is(":checked");
        obj.IsChemical = $("#chkChemical").is(":checked");
        obj.IsOthers = $("#chkOthers").is(":checked");
        obj.IsDocReceiveComplete = $("#chkDocRcvC").is(":checked");
        obj.IsMaterialReceived = $("#chkMaterialRcv").is(":checked");
        obj.IsCiclose = $("#chkCIClose").is(":checked");
        obj.CreatedBy = CurrentUser.USERID;
        return obj;
    },
    FillInvoiceForm: function (obj, isEdit) {
        if (isEdit) {
            //$("#btnSave").attr("disabled", "disabled");
            $("#btnSave").text("Update");
            $("#btnSave").addClass("fa fa-save");
            //$("#btnSave").addClass("fa fa-pencil").text("Update");
        } else {
            //$("#btnSave").removeAttr('disabled');
            $("#btnSave").text("Save");
            $("#btnSave").addClass("fa fa-save");
            //$("#btnSave").addClass("k-button-success").text("Save");
        }

        $("#txtSrcCIID").val(obj.InvoiceId);
        $("#hdnCIID").val(obj.Ciid);
        $("#hdnInvoiceId").val(obj.InvoiceId);
        $("#txtInvoiceNo").val(obj.InvoiceNo);
        $("#dtInvoiceDate").data("kendoDatePicker").value(obj.InvoiceDate);
        $("#txtInvoiceValue").data("kendoNumericTextBox").value(obj.InvoiceValue);
        $("#cboCompany").data("kendoComboBox").value(obj.CompanyId == "00000000-0000-0000-0000-000000000000" ? "" : obj.CompanyId);
        $("#cboCurrency").data("kendoComboBox").value(obj.CurrencyId == "00000000-0000-0000-0000-000000000000" ? "" : obj.CurrencyId);
        $("#txtExRate").data("kendoNumericTextBox").value(obj.ExRate);
        $("#cboSupplier").data("kendoComboBox").value(obj.SupplierId == "00000000-0000-0000-0000-000000000000" ? "" : obj.SupplierId);
        $("#cboTradeTerm").data("kendoComboBox").value(obj.ShipmentTermsId == "00000000-0000-0000-0000-000000000000" ? "": obj.ShipmentTermsId);
        $("#cboPayTerm").data("kendoComboBox").value(obj.PaymentTermsId == "00000000-0000-0000-0000-000000000000" ? "" : obj.PaymentTermsId);
        $("#txtPayTermDays").data("kendoNumericTextBox").value(obj.PayTermDays);
        $("#txtBondNo").val(obj.BondNo);
        $("#dtBondDate").data("kendoDatePicker").value(obj.BondDate);
        $("#cboBBLcGrid").data("kendoMultiColumnComboBox").value(obj.Bblcid == "00000000-0000-0000-0000-000000000000" ? "" : obj.Bblcid);
        CommercialInvoiceInfoHelper.LoadePIItemGrid();
        $("#txtRegNo").val(obj.RegNo);
        $("#cboDocStatus").data("kendoComboBox").value(obj.DocStatusId == "00000000-0000-0000-0000-000000000000" ? "" : obj.DocStatusId);
        $("#txtIPNo").val(obj.Ipno);
        $("#dtIPDate").data("kendoDatePicker").value(obj.Ipdate);
        $("#cboShipmentMode").data("kendoComboBox").value(obj.CmnShipmentModeId == "00000000-0000-0000-0000-000000000000" ? "" : obj.CmnShipmentModeId);
        $("#txtBillofEntry").val(obj.BillOfEntry);
        $("#dtBillofEntryDate").data("kendoDatePicker").value(obj.BillOfEntryDate);
        $("#txtBLNo").val(obj.Blno);
        $("#dtBLDate").data("kendoDatePicker").value(obj.Bldate);
        $("#cboCountry").data("kendoComboBox").value(obj.CountryId == "00000000-0000-0000-0000-000000000000" ? "" : obj.CountryId);
        $("#txtVesselName").val(obj.VesselName);
        $("#dtETAinHouseDate").data("kendoDatePicker").value(obj.EtainHouse);
        $("#dtVoyageDate").data("kendoDatePicker").value(obj.VoyageDate);
        $("#cboPortOfloading").data("kendoComboBox").value(obj.PortOfLoadingId == "00000000-0000-0000-0000-000000000000" ? "" : obj.PortOfLoadingId);
        $("#cboPortOfDischarge").data("kendoComboBox").value(obj.PortOfDischargeId == "00000000-0000-0000-0000-000000000000" ? "" : obj.PortOfDischargeId);
        $("#cboLTAgent").data("kendoComboBox").value(obj.LocalTransporterAgentId == "00000000-0000-0000-0000-000000000000" ? "" : obj.LocalTransporterAgentId);
        $("#txtBankRefNo").val(obj.BankRefNo);
        $("#dtBankRefDate").data("kendoDatePicker").value(obj.BankRefDate);
        $("#dtCompanyAcptDate").data("kendoDatePicker").value(obj.CompanyAcptDate);
        $("#dtBankAcptDate").data("kendoDatePicker").value(obj.BankAcptDate);
        $("#txtAcceptedValue").data("kendoNumericTextBox").value(obj.AcceptanceValue);
        $("#dtMaturityDate").data("kendoDatePicker").value(obj.MaturityDate);
        $("#dtDocRcvDate").data("kendoDatePicker").value(obj.DocRecDate);
        $("#dtGoodsRcvDate").data("kendoDatePicker").value(obj.GoodsRecDate);
        $("#cboClearningAgent").data("kendoComboBox").value(obj.ClearingAgentId == "00000000-0000-0000-0000-000000000000" ? "" : obj.ClearingAgentId);
        $("#dtDocHandoverDate").data("kendoDatePicker").value(obj.DocHandOverDate);
        $("#dtETAPortDate").data("kendoDatePicker").value(obj.EtaportDate);
        $("#cboETADestPort").data("kendoComboBox").value(obj.EtadestPortId == "00000000-0000-0000-0000-000000000000" ? "" : obj.EtadestPortId);
        $("#txtCustHDCode").val(obj.CustomHscode);
        $("#txtRemarks").val(obj.Remarks);
        $("#txtDiscAmount").data("kendoNumericTextBox").value(obj.DiscountAmount);
        if (obj.IsFabric == true) {
            $("#chkFabric").prop('checked', true)
        } else {
            $("#chkFabric").prop('checked', false)
        };
        if (obj.IsTrims == true) {
            $("#chkTrims").prop('checked', true)
        } else {
            $("#chkTrims").prop('checked', false)
        };
        if (obj.IsChemical == true) {
            $("#chkChemical").prop('checked', true)
        } else {
            $("#chkChemical").prop('checked', false)
        };
        if (obj.IsOthers == true) {
            $("#chkOthers").prop('checked', true)
        } else {
            $("#chkOthers").prop('checked', false)
        };
        if (obj.IsDocReceiveComplete == true) {
            $("#chkDocRcvC").prop('checked', true)
        } else {
            $("#chkDocRcvC").prop('checked', false)
        };
        if (obj.IsMaterialReceived == true) {
            $("#chkMaterialRcv").prop('checked', true)
        } else {
            $("#chkMaterialRcv").prop('checked', false)
        };
        if (obj.IsCiclose == true) {
            $("#chkCIClose").prop('checked', true)
        } else {
            $("#chkCIClose").prop('checked', false)
        };
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnCIID").val("00000000-0000-0000-0000-000000000000");
        $("#txtSrcCIID").val("");
        $("#hdnInvoiceId").val("");
        $("#txtInvoiceNo").val("");
        $("#dtInvoiceDate").data("kendoDatePicker").value("");
        $("#txtInvoiceValue").data("kendoNumericTextBox").value("");
        $("#cboCompany").data("kendoComboBox").value("");
        $("#cboCurrency").data("kendoComboBox").value("");
        $("#txtExRate").data("kendoNumericTextBox").value("");
        $("#cboSupplier").data("kendoComboBox").value("");
        $("#cboTradeTerm").data("kendoComboBox").value("");
        $("#cboPayTerm").data("kendoComboBox").value("");
        $("#txtPayTermDays").data("kendoNumericTextBox").value("");
        $("#txtBondNo").val("");
        $("#dtBondDate").data("kendoDatePicker").value("");
        $("#cboBBLcGrid").data("kendoMultiColumnComboBox").value("");
        $("#txtRegNo").val("");
        $("#cboDocStatus").data("kendoComboBox").value("");
        $("#txtIPNo").val("");
        $("#dtIPDate").data("kendoDatePicker").value("");
        $("#cboShipmentMode").data("kendoComboBox").value("");
        $("#txtBillofEntry").val("");
        $("#dtBillofEntryDate").data("kendoDatePicker").value("");
        $("#txtBLNo").val("");
        $("#dtBLDate").data("kendoDatePicker").value("");
        $("#cboCountry").data("kendoComboBox").value("");
        $("#txtVesselName").val("");
        $("#dtETAinHouseDate").data("kendoDatePicker").value("");
        $("#dtVoyageDate").data("kendoDatePicker").value("");
        $("#cboPortOfloading").data("kendoComboBox").value("");
        $("#cboPortOfDischarge").data("kendoComboBox").value("");
        $("#cboLTAgent").data("kendoComboBox").value("");
        $("#txtBankRefNo").val("");
        $("#dtBankRefDate").data("kendoDatePicker").value("");
        $("#dtCompanyAcptDate").data("kendoDatePicker").value("");
        $("#dtBankAcptDate").data("kendoDatePicker").value("");
        $("#txtAcceptedValue").data("kendoNumericTextBox").value("");
        $("#dtMaturityDate").data("kendoDatePicker").value("");
        $("#dtDocRcvDate").data("kendoDatePicker").value("");
        $("#dtGoodsRcvDate").data("kendoDatePicker").value("");
        $("#cboClearningAgent").data("kendoComboBox").value("");
        $("#dtDocHandoverDate").data("kendoDatePicker").value("");
        $("#dtETAPortDate").data("kendoDatePicker").value("");
        $("#cboETADestPort").data("kendoComboBox").value("");
        $("#txtCustHDCode").val("");
        $("#txtRemarks").val("");
        $("#txtDiscAmount").data("kendoNumericTextBox").value("");
        $("#chkFabric").prop('checked', false);
        $("#chkTrims").prop('checked', false);
        $("#chkChemical").prop('checked', false);
        $("#chkOthers").prop('checked', false);
        $("#chkDocRcvC").prop('checked', false);
        $("#chkMaterialRcv").prop('checked', false);
        $("#chkCIClose").prop('checked', false);
        //CommercialInvoiceInfoHelper.Init();
    },

    GeneratePIItemListGrid: function () {
        $("#grdPIItemList").kendoGrid({
            dataSource: [],
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            groupable: false,
            toolbar: ["search"],
            search: {
                fields: ["Pino"]
            },
            columns: [
                { field: "Bblcid", hidden: true },
                { field: "Piid", hidden: true },
                { field: "ItemName", title: "Item Name", sortable: true },
                { field: "Pino", title: "PI No",hidden: true, sortable: true, groupHeaderTemplate: 'PI No: #=data.value #' },
                {
                    field: "Uomname", title: "Unit", sortable: true,
                    groupFooterTemplate: "Sub Total:" //#= kendo.toString(data.value) # Total:
                },
                {
                    field: "ItemQuantity", title: "CI Qty", sortable: true,
                    aggregates: ["sum"], groupFooterTemplate: "#=kendo.format('{0:N2}',sum)#"
                },
                {
                    field: "UnitPrice", title: "CI Rate", sortable: true,
                    aggregates: ["average"], groupFooterTemplate: "#=kendo.format('{0:N2}',average)#"
                },
                {
                    field: "Amount", title: "CI Amount", sortable: true,
                    aggregates: ["sum"], groupFooterTemplate: "#=kendo.format('{0:N2}',sum)#"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadePIItemGrid: function () {
        var bBLcId = $("#cboBBLcGrid").data("kendoMultiColumnComboBox").value();
        if (bBLcId !== "") {
            var data = CommercialInvoiceInfoManager.gridDataSourcePIItemList(bBLcId);
            var grid = $("#grdPIItemList").data("kendoGrid");
            grid.setDataSource(data);
        }        
    },
    ValidateInvoiceForm: function () {
        var res = true;
        var ComInvoiceNo = $("#txtInvoiceNo").val();
        var company = $("#cboCompany").data("kendoComboBox");
        var supplier = $("#cboSupplier").data("kendoComboBox");
        var tradeTerm = $("#cboTradeTerm").data("kendoComboBox");
        var shipmentMode = $("#cboShipmentMode").data("kendoComboBox");
        var portOfLoading = $("#cboPortOfloading").data("kendoComboBox");
        var portOfDeschargeing = $("#cboPortOfDischarge").data("kendoComboBox");
        var transectionAgent = $("#cboLTAgent").data("kendoComboBox");
        var ClearingAgent = $("#cboClearningAgent").data("kendoComboBox");
        var eTAPortDate = $("#dtETAPortDate").data("kendoDatePicker");
        var destinationPort = $("#cboETADestPort").data("kendoComboBox");
        var paymentTerm = $("#cboPayTerm").data("kendoComboBox").value();
        var b2bNo = $("#cboBBLcGrid").data("kendoMultiColumnComboBox");
        var country = $("#cboCountry").data("kendoComboBox");
        var vessselName = $("#txtVesselName").val();
        var docStatus = $("#cboDocStatus").data("kendoComboBox");
        var tenor = $("#txtPayTermDays").val();

        if (ComInvoiceNo === "" || ComInvoiceNo === 0) {
            AjaxManager.NotifyMsg("txtInvoiceNo", "error", "right", 1500, "Required Invoice No");
            res = false;
        }
        if (company.value() === "" || company.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboCompany", "error", "right", 1500, "Required Company");
            res = false;
        }
        if (supplier.value() === "" || supplier.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboSupplier", "error", "right", 1500, "Required Supplier");
            res = false;
        }
        if (tradeTerm.value() === "" || tradeTerm.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboTradeTerm", "error", "right", 1500, "Required Trade Term");
            res = false;
        }
        if (shipmentMode.value() === "" || shipmentMode.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboShipmentMode", "error", "right", 1500, "Required Shipment Mode");
            res = false;
        }
        if (portOfLoading.value() === "" || portOfLoading.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboPortOfloading", "error", "right", 1500, "Required Port of Loading");
            res = false;
        }
        if (portOfDeschargeing.value() === "" || portOfDeschargeing.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboPortOfDischarge", "error", "right", 1500, "Required Port Of Discharge");
            res = false;
        }
        //if (transectionAgent.value() === "" || transectionAgent.value() === AjaxManager.DefaultGuidId()) {
        //    AjaxManager.NotifyMsg("cboLTAgent", "error", "right", 1500, "Required TransecTion Agent");
        //    res = false;
        //}
        //if (ClearingAgent.value() === "" || ClearingAgent.value() === AjaxManager.DefaultGuidId()) {
        //    AjaxManager.NotifyMsg("cboClearningAgent", "error", "right", 1500, "Required Clearing Agent");
        //    res = false;
        //}
        if (eTAPortDate.value() === "" || eTAPortDate.value() === null) {
            AjaxManager.NotifyMsg("dtETAPortDate", "error", "right", 1500, "Required ETA Port Date");
            res = false;
        }
        if (destinationPort.value() === "" || destinationPort.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboETADestPort", "error", "right", 1500, "Required Destination Port");
            res = false;
        }
        if (paymentTerm.toUpperCase() != "5BB21D9C-0869-45D7-999E-AE8231799CF5") {
            if (tenor === "" || tenor === null) {
                AjaxManager.NotifyMsg("txtPayTermDays", "error", "up", 1500, "Required Days");
                res = false;
            }
        }
        if (b2bNo.value() === "" || b2bNo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboBBLcGrid", "error", "right", 1500, "Required B2B No");
            res = false;
        }
        if (country.value() === "" || country.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboCountry", "error", "right", 1500, "Required Country");
            res = false;
        }
        if (vessselName === "" || vessselName === null) {
            AjaxManager.NotifyMsg("txtVesselName", "error", "right", 1500, "Required Vessel Name");
            res = false;
        }
        if (docStatus.value() === "" || docStatus.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboDocStatus", "error", "right", 1500, "Required Doc Status");
            res = false;
        }
        return res;
    }
}