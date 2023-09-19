var _nRFQId = AjaxManager.DefaultGuidId(),
    _sActionMode = "",
    _supplierId = "",
    _selectedQuotDetail = null;

var PurQuotationRcvDetailManager = {
    Save(statusId) {
        var msg = "";
        var validator = $("#divQuotationRcvDetails").kendoValidator().data("kendoValidator");
        if (validator.validate()) {
            if (PurQuotationRcvDetailHelper.ValidateQuotationRcv()) {
                var obj = PurQuotationRcvDetailHelper.GetObject(statusId);
                if (PurQuotationRcvDetailHelper.IsValid(obj)) {
                    var jsonParam = JSON.stringify(obj);
                    var serviceUrl = _baseUrl + "/api/Quotations/CreateOrUpdateQuotation";
                    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
            }
        }        
            function onSuccess(jsonData) {
                if (jsonData.Success) {
                    $("#hdnQuotationId").val(jsonData.createOrUpdateQuotationDto.QuotationId);
                    $("#gridSupplierPurQuotationRcvSummary").data("kendoGrid").dataSource.read();
                    $("#gridPurQuotationRcvSummary").data("kendoGrid").dataSource.read();
                    $("#gridSizeColorBreakdown").data("kendoGrid").dataSource.read();
                    PurQuotationRcvDetailHelper.ResetBtnEvent();
                    AjaxManager.MsgBox('success', 'center', 'Success:', jsonData.Message,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                                $noty.close();
                            }
                        }]);
                    PurQuotationRcvDetailHelper.ShowSummary();
                }
                else {
                    AjaxManager.MsgBox('error', 'center', 'Error Message', jsonData.Message,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                                $noty.close();
                            }
                        }]);                    
                }
            }
            function onFailed(error) {
                AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
    },
    gridDataSourceSupplier() {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/Quotations/GetQuotationSupplierAndUserWiseGridList/' + _nRFQId + '/' + CurrentUser.USERID,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    cache: false,
                    async: false
                },
                parameterMap(options) {
                    return JSON.stringify(options);
                }
            },
            batch: true,
            schema: {
                model: {
                    id: "QuotationId",
                    fields: {
                        StyleNo: { editable: false },
                        ItemName: { editable: false },
                        ItemDesc: { editable: false },
                        StatusName: { editable: false },
                        QuotationDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        ValidityDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        PossibleETD: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
}

var PurQuotationRcvDetailHelper = {
    Init() {
        $("#pnlUl").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        UtilityHelper.InitDatePicker("dtValidityDate");
        UtilityHelper.InitDatePicker("dtPossibleETD");
        PurQuotationRcvDetailHelper.InitCombos();
        PurQuotationRcvDetailHelper.InitGrid();
        PurQuotationRcvDetailHelper.InitBtnEvents();
        MerchantHelper.GenerateCurrencyCombo("cboCurrency");
    },
    InitBtnEvents() {
        $("#btnSave").click(function () {
            PurQuotationRcvDetailManager.Save("09072453-b187-41da-bd49-e8fa7eac4fb2");
        });
        $("#btnBack").click(function () {
            PurQuotationRcvDetailHelper.ShowSummary();
        });
        $("#btnReset").click(function () {
            PurQuotationRcvDetailHelper.ResetBtnEvent();
        });
        $("#cboPaymentTerms").change(function () {
            var currentValue = $("#cboPaymentTerms").data("kendoComboBox").value();
            if (currentValue === "5bb21d9c-0869-45d7-999e-ae8231799cf5") {
                $("#cboTenure").data("kendoComboBox").select(0);
                $("#cboTenure").data("kendoComboBox").enable(false);
            }
            else {
                $("#cboTenure").data("kendoComboBox").enable(true);
            }
        });

    },
    ResetBtnEvent() {
        _sActionMode = "Add";
        PurQuotationRcvDetailHelper.ResetForm();
        if (_selectedQuotDetail != null) {
            _selectedQuotDetail.QuotationDetailsId = AjaxManager.DefaultGuidId();
            _selectedQuotDetail.SupplierId = AjaxManager.DefaultGuidId();
            _selectedQuotDetail.SupplierName = "";
        }
    },
    InitCombos() {
        $("#cboSupplier").kendoComboBox({
            placeholder: "--Select Supplier--",
            dataValueField: "SupplierId",
            dataTextField: "SupplierName",
            dataSource: [],
            index: 0,
            suggest: true,
            filter: "contains",
            change: function () {
                var supplierId = $("#cboSupplier").data("kendoComboBox").value();
                if (typeof supplierId === "undefined") supplierId = _supplierId;
                if (supplierId.length > 0 && supplierId != AjaxManager.DefaultGuidId()) {
                    var quotationDetailId = _selectedQuotDetail == null || typeof _selectedQuotDetail.QuotationDetailsId === "undefined" ? AjaxManager.DefaultGuidId() : _selectedQuotDetail.QuotationDetailsId;
                    var sizeColorBreakdowns = ApiManager.GetList(_baseUrl + "/api/Quotations/GetSizeColorBreakDownByRFQ/" + _nRFQId + "/" + supplierId + "/" + CurrentUser.USERID + "/" + quotationDetailId);
                    if (sizeColorBreakdowns.Message == null) {
                        PurQuotationRcvDetailHelper.LoadSizeColorBreakdown(sizeColorBreakdowns.GetSizeColorBreakDownByRFQVms);
                    } else {
                        AjaxManager.MsgBox('error', 'center', 'Error', sizeColorBreakdowns.Message,
                            [{
                                addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                                    $noty.close();
                                }
                            }]);
                        return false;
                    }
                } else {
                    PurQuotationRcvDetailHelper.LoadSizeColorBreakdown([]);
                }
            }
        });

        var oPaymentTerms = ApiManager.GetList(_baseUrl + "/api/CmnPaymentTerms/all");
        if (oPaymentTerms.length > 0) {
            oPaymentTerms.unshift({
                PaymentTermsId: AjaxManager.DefaultGuidId(),
                PaymentTermsName: "--Select Payment Terms--"
            });
        }
        $("#cboPaymentTerms").kendoComboBox({
            placeholder: "--Select Payment Terms--",
            dataValueField: "PaymentTermsId",
            dataTextField: "PaymentTermsName",
            dataSource: oPaymentTerms,
            index: 0,
            suggest: true,
            filter: "contains",
            change: function () {

            }
        });

        var oTenures = ApiManager.GetList(_baseUrl + "/api/CmnTenures/all");
        if (oTenures.length > 0) {
            oTenures.unshift({
                TenureId: AjaxManager.DefaultGuidId(),
                TenureName: "--Select Tenure--"
            });
        }
        $("#cboTenure").kendoComboBox({
            placeholder: "--Select Tenure--",
            dataValueField: "TenureId",
            dataTextField: "TenureName",
            dataSource: oTenures,
            index: 0,
            suggest: true,
            filter: "contains",
            change: function () {

            }
        });

        var oShipmentTerms = ApiManager.GetList(_baseUrl + "/api/CmnShipmentTerm/all");
        if (oShipmentTerms.length > 0) {
            oShipmentTerms.unshift({
                ShipmentTermsId: AjaxManager.DefaultGuidId(),
                ShipmentTermsName: "--Select Shipment Terms--"
            });
        }
        $("#cboShipmentTerms").kendoComboBox({
            placeholder: "--Select Shipment Terms--",
            dataValueField: "ShipmentTermsId",
            dataTextField: "ShipmentTermsName",
            dataSource: oShipmentTerms,
            index: 0,
            suggest: true,
            filter: "contains",
            change: function () {

            }
        });
        var oLCOrBankCharge = ApiManager.GetList(_baseUrl + "/api/CmnLcOrBankCharge/all");
        if (oLCOrBankCharge.length > 0) {
            oLCOrBankCharge.unshift({
                LOBCId: AjaxManager.DefaultGuidId(),
                LOBCName: "--Select LC/Bank Charge--"
            });
        }
        $("#cboLCOrBankCharge").kendoComboBox({
            placeholder: "--Select LC/Bank Charge--",
            dataValueField: "LOBCId",
            dataTextField: "LOBCName",
            dataSource: oLCOrBankCharge,
            index: 0,
            suggest: true,
            filter: "contains",
            change: function () {

            }
        });
    },
    ResetForm() {
        $("#txtQuotationNo").val("");
        $("#gridSizeColorBreakdown").data("kendoGrid").dataSource.read();
        $("#dtValidityDate").data("kendoDatePicker").value(IkrHelper.GetResetDateKendo());
        $("#dtPossibleETD").data("kendoDatePicker").value(IkrHelper.GetResetDateKendo());
        $("#cboPaymentTerms").data("kendoComboBox").value(AjaxManager.DefaultGuidId());
        $("#cboTenure").data("kendoComboBox").value(AjaxManager.DefaultGuidId());
        $("#cboShipmentTerms").data("kendoComboBox").value(AjaxManager.DefaultGuidId());
        $("#cboLCOrBankCharge").data("kendoComboBox").value(AjaxManager.DefaultGuidId());
        $("#txtRemarks").val("");
        if (_sActionMode == "Add") PurQuotationRcvDetailHelper.LoadSuppliers();

        PurQuotationRcvDetailHelper.LoadSizeColorBreakdown([]);
        $("#gridSizeColorBreakdown").data("kendoGrid").dataSource.read();
    },
    ResetMaster() {
    },
    ResetMasterInfo() {
        _nRFQId = AjaxManager.DefaultGuidId();
        $("#hdnQuotationId").val(AjaxManager.DefaultGuidId());
        $("#cboSupplier").data("kendoComboBox").setDataSource([]);
        $("#cboSupplier").data("kendoComboBox").value("");
        $("#gridSupplierPurQuotationRcvSummary").data("kendoGrid").dataSource.data([]);
    },
    LoadSuppliers() {
        var methodName = _sActionMode == "Add" ? "GetSupplierByRFQ" : "EditSupplierByRFQ";
        if (_nRFQId != AjaxManager.DefaultGuidId()) {
            var suppliersObj = ApiManager.GetList(_baseUrl + "/api/Quotations/" + methodName + "/" + _nRFQId + "/" + CurrentUser.USERID);
            var listName = methodName == "GetSupplierByRFQ" ? "GetSupplierByRFQVms" : "editSupplierByRFQVms";

            if (suppliersObj.Message == null) {
                suppliersObj = suppliersObj[listName];
                suppliersObj.unshift({
                    SupplierId: AjaxManager.DefaultGuidId(),
                    SupplierName: "--Select Supplier--"
                });
                $("#cboSupplier").data("kendoComboBox").setDataSource(suppliersObj);
                $("#cboSupplier").data("kendoComboBox").select(0);

            } else {
                $("#cboSupplier").data("kendoComboBox").setDataSource([]);
                $("#cboSupplier").data("kendoComboBox").value("");
            }
        }
    },
   
    InitGrid() {
        $("#gridSizeColorBreakdown").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: false,
            sortable: false,
            columns: [
                { field: "ItemName", title: "Item", sortable: true },
                { field: "ItemSizeName", title: "Size", sortable: true },
                { field: "ItemColorName", title: "Color", sortable: true },
                { field: "Quantity", title: "Quantity", sortable: true },
                { field: "BOMRate", title: "BOM Rate", sortable: true },
                { field: "Rate", title: "Rate", sortable: true, editor: UtilityHelper.NumericTextBoxEditor4 }
            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {
              

                //for (var i = 0; i < detailRows.length; i++) {
                //    var detailGrid = $(detailRows[i]).find(".k-grid").data("kendoGrid");
                //    var data = detailGrid.dataSource.view();
                //}
            },
        });
        $("#gridSupplierPurQuotationRcvSummary").kendoGrid({
            dataSource: PurQuotationRcvDetailManager.gridDataSourceSupplier(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: [
                { field: "SupplierName", title: "Supplier", sortable: true },
                { field: "QuotationNo", title: "Quotation No", sortable: true },
                { field: "ValidityDate", title: "Validity Date", sortable: true, template: '#=kendo.toString(ValidityDate==null?"-":ValidityDate,"dd-MMM-yyyy")#' },
                { field: "PossibleETD", title: "Possible ETD", sortable: true, template: '#=kendo.toString(PossibleETD==null?"-":PossibleETD,"dd-MMM-yyyy")#' },
                { field: "TenureName", title: "Tenure", sortable: true },
                { field: "ShipmentTermsName", title: "Shipment Terms", sortable: true },
                { field: "PaymentTermsName", title: "Payment Terms", sortable: true },
                {
                    command: [{
                        name: "Edit", text: "Negotiate", iconClass: "k-icon k-i-edit", className: "k-success", click: PurQuotationRcvDetailHelper.ReadSelectedRow
                    }
                    ], title: "&nbsp;"
                }],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ReadSelectedRow(e) {
        _sActionMode = "Edit";
        _selectedQuotDetail = null;

        e.preventDefault();
        var grid = $("#gridPurQuotationRcvSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);

        $("#hdnQuotationId").val(AjaxManager.DefaultGuidId());

        if (selectedItem != null) {
            _nRFQId = selectedItem.RFQId;
            _supplierId = selectedItem.SupplierId;
            selectedItem = ApiManager.GetList(_baseUrl + "/api/Quotations/GetquotationDetailByQuotationDetailId/" + selectedItem.QuotationDetailsId);
            selectedItem = typeof selectedItem !== "undefined" ? selectedItem.Result[0] : null;
            _selectedQuotDetail = selectedItem;
            PurQuotationRcvDetailHelper.SetInformations(selectedItem);
            if (selectedItem != null) $("#cboSupplier").data("kendoComboBox").value(selectedItem.SupplierId);
        }
    },
    SetInformations(selectedItem) {
        PurQuotationRcvDetailHelper.ResetForm();
        if (selectedItem != null && typeof selectedItem !== "undefined") {
            _selectedQuotDetail = selectedItem;

            PurQuotationRcvDetailHelper.LoadSuppliers();
            $("#hdnQuotationId").val(selectedItem.QuotationId);

            $("#txtQuotationNo").val(selectedItem.QuotationNo);
            $("#dtValidityDate").data("kendoDatePicker").value(selectedItem.ValidityDate);
            $("#dtPossibleETD").data("kendoDatePicker").value(selectedItem.PossibleETD);
            $("#cboPaymentTerms").data("kendoComboBox").value(selectedItem.PaymentTermsId);
            if (selectedItem.PaymentTermsId == "5bb21d9c-0869-45d7-999e-ae8231799cf5") {
                $("#cboTenure").data("kendoComboBox").select(0);
                $("#cboTenure").data("kendoComboBox").enable(false);
            }
            else {
                $("#cboTenure").data("kendoComboBox").enable(true);                
            }
            $("#cboTenure").data("kendoComboBox").value(selectedItem.TenureId);
            $("#cboShipmentTerms").data("kendoComboBox").value(selectedItem.ShipmentTermsId);
            $("#cboLCOrBankCharge").data("kendoComboBox").value(selectedItem.LOBCId);
            $("#txtRemarks").val(selectedItem.Remarks);
            $("#cboCurrency").data("kendoComboBox").value(selectedItem.CurrencyId);

            if (_nRFQId != "" && _nRFQId != AjaxManager.DefaultGuidId()) {
                var datas = PurQuotationRcvDetailManager.gridDataSourceSupplier();
                $("#gridSupplierPurQuotationRcvSummary").data("kendoGrid").setDataSource(datas);
            }
            if (typeof selectedItem.SupplierId !== "undefined") {
                var quotationDetailId = _selectedQuotDetail == null || typeof _selectedQuotDetail.QuotationDetailsId === "undefined" ? AjaxManager.DefaultGuidId() : _selectedQuotDetail.QuotationDetailsId;
                var sizeColorBreakdowns = ApiManager.GetList(_baseUrl + "/api/Quotations/GetSizeColorBreakDownByRFQ/" + _nRFQId + "/" + selectedItem.SupplierId + "/" + CurrentUser.USERID + "/" + quotationDetailId);
                if (sizeColorBreakdowns.Message == null) {
                    PurQuotationRcvDetailHelper.LoadSizeColorBreakdown(sizeColorBreakdowns.GetSizeColorBreakDownByRFQVms);
                }
            }
        }
    },
    LoadSizeColorBreakdown(list) {
        var gridDataSource = new kendo.data.DataSource({
            data: list,
            schema: {
                model: {
                    fields: {
                        ItemName: { editable: false },
                        ItemSizeName: { editable: false },
                        ItemColorName: { editable: false },
                        Quantity: { editable: false },
                        BOMRate: { editable: false },
                        Rate: { editable: true, type: "number", validation: { min: 0 } },
                    }
                }
            }
        });
        var gridSizeColorBreakdown = $("#gridSizeColorBreakdown").data("kendoGrid");
        gridSizeColorBreakdown.setDataSource(gridDataSource);
    },
    ShowSummary() {
        $("#divQuotationRcvSummary").show();
        $("#divQuotationRcvDetails").hide();
    },
    ShowDetail() {
        $("#divQuotationRcvSummary").hide();
        $("#divQuotationRcvDetails").show();
    },
    GetObject(statusId) {
        var obj = {
            QuotationId: $.trim($("#hdnQuotationId").val()),
            RFQId: _nRFQId,
            StatusId: statusId,
            UserId: CurrentUser.USERID,
            PurQuotationDetails: PurQuotationRcvDetailHelper.GetPurQuotationDetails()
        }
        return obj;
    },
    GetPurQuotationDetails() {
        var objList = [];
        var selectedItem = _selectedQuotDetail;
        if (selectedItem != null) {
            objList.push({
                QuotationDetailsId: AjaxManager.DefaultGuidId(),// selectedItem.QuotationDetailsId,
                QuotationId: $.trim($("#hdnQuotationId").val()),
                QuotationNo: $.trim($("#txtQuotationNo").val()),
                QuotationDate: new Date(),
                ValidityDate: $("#dtValidityDate").data("kendoDatePicker").value(),
                PossibleETD: $("#dtPossibleETD").data("kendoDatePicker").value(),
                SupplierId: $("#cboSupplier").data("kendoComboBox").value(),
                PaymentTermsId: $("#cboPaymentTerms").data("kendoComboBox").value(),
                ShipmentTermsId: $("#cboShipmentTerms").data("kendoComboBox").value(),
                TenureId: $("#cboTenure").data("kendoComboBox").value(),
                CurrencyId: $("#cboCurrency").data("kendoComboBox").value(),
                IsNominated: false,
                OriginCountryId: selectedItem.OriginCountryId,
                MinimumQty: selectedItem.MinimumQty,
                QuotedValue: selectedItem.QuotedValue,
                TAXAmount: selectedItem.TAXAmount,
                TotalAmount: selectedItem.TotalAmount,
                LOBCId: $("#cboLCOrBankCharge").data("kendoComboBox").value(),
                IsTaxDeductedAtSource: false,
                IsTaxRebate: false,
                IsTaxExempted: false,
                IsDisCountPercent: false,
                IsSampleRequired: false,
                Remarks: $.trim($("#txtRemarks").val()),
                PurQuotationSizeColorBreakdowns: PurQuotationRcvDetailHelper.GetPurQuotationSizeColorBreakdowns()
            });
        }
        return objList;
    },
    CheckValueValidity(value, valueType) {
        if (value == null || typeof value === "undefined") {
            if (valueType == "GUID") return AjaxManager.DefaultGuidId();
            if (value == "INT") return 0;
        }
        return value;
    },
    GetPurQuotationSizeColorBreakdowns() {
        var tempList = [];
        var gridList = $("#gridSizeColorBreakdown").data("kendoGrid").dataSource.data();
        gridList.map(x => {
            tempList.push({
                QuotationSCBId: AjaxManager.DefaultGuidId(), //x.QuotationSCBId == null || typeof x.QuotationSCBId === "undefined" ? AjaxManager.DefaultGuidId() : x.QuotationSCBId,
                QuotationDetailsId: x.QuotationDetailsId,
                ItemId: x.ItemId,
                ItemBrandId: x.ItemBrandId,
                ItemModelId: x.ItemModelId,
                ItemColorId: x.ItemColorId,
                ItemSizeId: x.ItemSizeId,
                Quantity: x.Quantity,
                BOMRate: x.BOMRate,
                Rate: x.Rate
            });
        });
        return tempList;
    },
    IsValid(obj) {
        var isValidInfo = true;
        obj.PurQuotationDetails.map(x => {
            if (isValidInfo) {
                x.PurQuotationSizeColorBreakdowns.map(y => {
                    if (y.Rate > y.BOMRate && isValidInfo) {
                        isValidInfo = false;
                        AjaxManager.MsgBox('error', 'center', 'Error', "Rate cannot be greater than BOM Rate",
                            [{
                                addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                                    $noty.close();
                                }
                            }]);
                    }
                });
            }
        });
        return isValidInfo;
    },
    ValidateQuotationRcv: function () {
        var res = true;
        var ssupplier = $("#cboSupplier").data("kendoComboBox");
        //var supplier = ("#cboSupplier").data("kendoComboBox");
        if (ssupplier.value() === "" || ssupplier.value() == AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboSupplier", "error", "up", 1500, "Required");
            res = false;
        }
        var qquotationNo = $("#txtQuotationNo").val();
        if (qquotationNo === "" || qquotationNo === null) {
            AjaxManager.NotifyMsg("txtQuotationNo", "error", "left", 1500, "Required");
            res = false;
        }
        var tenor = $("#cboTenure").data("kendoComboBox");
        var paymentTerm = $("#cboPaymentTerms").data("kendoComboBox").value();

        if (paymentTerm === "" || paymentTerm === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboPaymentTerms", "error", "right", 1500, "Required");
            res = false;
        }
        if (paymentTerm.toUpperCase() != "5BB21D9C-0869-45D7-999E-AE8231799CF5") {
            if (tenor.value() === "" || tenor.value() === AjaxManager.DefaultGuidId()) {
                AjaxManager.NotifyMsg("cboTenure", "error", "up", 1500, "Required Tenor");
                res = false;
            }      
            
        }
        var bank = $("#cboLCOrBankCharge").data("kendoComboBox").value();
        if (bank === "" || bank === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboLCOrBankCharge", "error", "right", 1500, "Required");
            res = false;
        }
        var shipmentTerm = $("#cboShipmentTerms").data("kendoComboBox").value();
        if (shipmentTerm === "" || shipmentTerm === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboShipmentTerms", "error", "right", 1500, "Required");
            res = false;
        }
        
        return res;
    }

}