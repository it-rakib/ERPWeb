var _nRFQId = AjaxManager.DefaultGuidId(),
    _isReportingUser = false,
    _oCsDetails = [],
    _isForward = true;

var PurCSDetailManager = {
    QuotationDetailList: function (qutation) {
        var qutationDetailList = '';
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/Quotations/GetQuotationDetailsByQuotationId/" + qutation;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            qutationDetailList = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        debugger;
        return qutationDetailList;
    },
    QuotationColorSizeBreakList: function (qutationDeatilsId) {
        var qutationColorSizeList = '';
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/Quotations/GetQuotationSCBDByQuotationDetailsId/" + qutationDeatilsId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            qutationColorSizeList = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        debugger;
        return qutationColorSizeList;
    },
    Save() {
        debugger;
        if (PurCSDetailHelper.CheckValidation()) {
            var obj = PurCSDetailHelper.GetObject();
            if (obj.PurCsdetails.length == 0) {
                AjaxManager.MsgBox('error', 'center', 'Error1', "Select supplier(s)",
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
                return false;
            }
            var jsonParam = JSON.stringify(obj);
            var serviceUrl = _baseUrl + "/api/PurCSs/CreateOrUpdateCS";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
            function onSuccess(jsonData) {
                if (jsonData.Success) {
                    $("#hdnCSId").val(jsonData.createOrUpdateCSDto.CSId);
                    $("#txtCSNo").val(jsonData.createOrUpdateCSDto.CSNo);
                    $("#gridPurCSSummary").data("kendoGrid").dataSource.read();
                    PurCSDetailHelper.LoadQuotations();

                    AjaxManager.MsgBox('success', 'center', 'Success:', jsonData.Message,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                                $noty.close();
                            }
                        }]);
                    PurCSDetailHelper.Reset();
                    PurCSDetailHelper.ShowSummary();
                }
                else {
                    AjaxManager.MsgBox('error', 'center', 'Error1', jsonData.Message,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                                $noty.close();
                            }
                        }]);
                }
            }
            function onFailed(error) {
                AjaxManager.MsgBox('error', 'center', 'Error', 'Allocated Percent cant be empty !',
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
    },
    Return() {
        debugger;
        var csId = $.trim($("#hdnCSId").val());
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/PurCSs/ReturnCS/" + csId;
        //var serviceUrl = _baseUrl + "/api/PurCSs/CreateOrUpdateCS/" + $.trim($("#hdnCSId").val());
        AjaxManager.DeleteJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                PurCSDetailHelper.ShowSummary();
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', jsonData.Message,
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
    },
    GridDataSource: function (itemId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/PurCSs/GetCSItemHistoryGridByItemId/' + itemId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            schema: {
                data: "Items", total: "TotalCount",
                model: {
                    fields: {
                        Work_Date: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        }
                    }
                },
            }
        });
        return gridDataSource;
    }
}

var PurCSDetailHelper = {
    Init() {
        
        _isReportingUser = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        _isForward = ApiManager.GetList(_baseUrl + "/api/PurCSs/GetIsCSForward/" + CurrentUser.EMPNO).Result.IsCSForward;
        if (_isForward) {
            $(".btnSave").text("Forward");
            $(".saveIcon").removeClass("fa-save").addClass("fa-forward");
        } else {
            $(".btnSave").text("Approve");
            if (!$(".saveIcon").hasClass("fa-save")) $(".saveIcon").addClass("fa-save");
        }
        if (_isReportingUser) {
            $("#btnReturn").show();
            $("#btnAddNew").hide();
        } else {
            $("#btnReturn").hide();
            $("#btnAddNew").show();
        }

        $("#hdnCSId").val(AjaxManager.DefaultGuidId());
        $("#pnlUl").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        PurCSDetailHelper.InitCombos();
        PurCSDetailHelper.InitGrid();
        PurCSDetailHelper.InitBtnEvents();
        PurCSDetailHelper.InitOthers();
    },
    InitBtnEvents() {
        $("#btnSave").click(function () {
            PurCSDetailManager.Save();
        });
        $("#btnReturn").click(function () {
            //PurCSDetailHelper.Return();
            PurCSDetailManager.Return();
        });
        $("#btnBack").click(function () {
            PurCSDetailHelper.ShowSummary();
        });
        $("#btnAddNew").click(function () {
            PurCSDetailHelper.Reset();
            PurCSDetailHelper.ShowDetail();
        });
    },
    Return() {
        debugger;
        var csId = $.trim($("#hdnCSId").val());
        if (csId == "" || csId == AjaxManager.DefaultGuidId) {
            AjaxManager.MsgBox('error', 'center', 'Error', "Unsaved CS",
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                        $noty.close();
                    }
                }]);
            return false;
        }
        //Ratin
    },
    InitCombos() {
        var oForwardPersons = ApiManager.GetList(_baseUrl + "/api/Organograms/GetAllSupervisorByEmpId/" + CurrentUser.EMPNO).Result;
        $("#cboForwardPersons").kendoComboBox({
            placeholder: "--Select Forward To--",
            dataValueField: "UserId",
            dataTextField: "Name",
            dataSource: oForwardPersons,
            index: 0,
            suggest: true,
            filter: "contains",
            change: function () {

            }
        });
        if (oForwardPersons.length == 0) $(".divForwardedPersion").hide();
    },
    InitGrid() {
        $("#gridQuotation").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: false,
            sortable: false,
            columns: [
                { field: "RFQNo", title: "RFQ No", sortable: true },
                { field: "StyleNo", title: "Style", sortable: true },
                //{ field: "ItemName", title: "Item", sortable: true },
                {
                    field: "Action", title: "Edit", filterable: false, width: 160, command: [{
                        name: "loadSupplier", text: "Load Quotations", iconClass: "k-icon k-i-arrow-right", className: "k-danger", click: PurCSDetailHelper.LoadDetails
                    }]
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {

            },
            dataBinding: function (e) {

            }
        });
        PurCSDetailHelper.LoadQuotations();
    },
    InitOthers() {
        $("#divModal").kendoWindow({
            title: "Item CS History",
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
        $("#gridItemHistory").kendoGrid({
            dataSource: [],
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: PurCSDetailHelper.GenerateColumns(),
            editable: false,
            navigatable: true,
            selectable: "row",
            scrollable: true
        });
        $("#btnModalClose").click(function () {
            $("#divModal").data("kendoWindow").close();
        });
    },
    GenerateColumns() {
        return columns = [
            { field: "ItemName", title: "Item", editable: false },
            //{ field: "DemandPercent", title: "Demand %", editable: false },
            //{ field: "DemandQty", title: "Demand Qty", editable: false },
            { field: "RFQNo", title: "RFQ No", editable: false },
            { field: "CSNo", title: "CS No", editable: false },
            { field: "CSDate", title: "CS Date", editable: false, template: '#=kendo.toString(kendo.parseDate(CSDate)==null?"":kendo.parseDate(CSDate),"dd-MMM-yyyy")#' },
            { field: "SelectedPercent", title: "Selected %", editable: false },
            { field: "ColorName", title: "Color", editable: false },
            { field: "SizeName", title: "Size", editable: false },
            { field: "SupplierName", title: "Supplier", editable: false },
            { field: "Quantity", title: "Qty", editable: false },
            { field: "Rate", title: "Rate", editable: false }
        ];
    },
    LoadGridItemHistory(itemId) {
        var grid = $("#gridItemHistory").data("kendoGrid");
        var data = PurCSDetailManager.GridDataSource(itemId);
        grid.setDataSource(data);
    },
    LoadQuotations() {
        
        PurCSDetailHelper.Reset();
        var oQuotations = ApiManager.GetList(_baseUrl + "/api/Quotations/GetPendingQuotationForCS/" + CurrentUser.USERID);
        if (oQuotations != null && oQuotations.Success) oQuotations = oQuotations.Result;
        else oQuotations = [];
        PurCSDetailHelper.LoadGridQuotation(oQuotations);
    },
    Reset() {
        _nRFQId = AjaxManager.DefaultGuidId();
        $("#txtCSNo").val("");
        $("#hdnCSId").val(AjaxManager.DefaultGuidId());
        $("#tblSupplierInfo thead #tr1 .thSupplierName").remove();
        $("#tblSupplierInfo thead #tr2 th").remove();
        $("#tblSupplierInfo tbody tr").remove();
    },
    GenerateRightGrid(selectedItem, userId, approvarId) {
        
        _isReportingUser = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        if (_isReportingUser) {
            $("#btnReturn").show();
            $("#btnAddNew").hide();
        } else {
            $("#btnReturn").hide();
            $("#btnAddNew").show();
        }

        _isForward = ApiManager.GetList(_baseUrl + "/api/PurCSs/GetIsCSForward/" + CurrentUser.EMPNO).Result.IsCSForward;
        if (_isForward) {
            $(".btnSave").text("Forward");
            $(".saveIcon").removeClass("fa-save").addClass("fa-forward");
        } else {
            $(".btnSave").text("Approve");
            if (!$(".saveIcon").hasClass("fa-save")) $(".saveIcon").addClass("fa-save");
        }

        if (selectedItem != null) {
            _nRFQId = selectedItem.RFQId;
            debugger;

            var quotations = ApiManager.GetList(_baseUrl + "/api/Quotations/GetPendingQuotationDetailsByRFQForCS/" + selectedItem.RFQId + "/" + userId + "/" + approvarId);
          
            //if (IkrHelper.HasExpectedValue(quotations)) quotations = quotations.Result;
            //else quotations = [];

            quotations = quotations.Result;

            PurCSDetailHelper.ResetItemTables();
            quotations = IkrHelper.SortArray(quotations, "ItemName");
            quotations.map(quotation => {
                PurCSDetailHelper.CreateItemTable(quotation.ItemId);
                PurCSDetailHelper.GenerateItemTableHeader(quotation);
                PurCSDetailHelper.GenerateItemTableBody(quotation);
                PurCSDetailHelper.GenerateItemPerRow(quotation);
                PurCSDetailHelper.GenerateItemRemarkRow(quotation);
            });
        }
    },
    ResetItemTables() {
        $(".itemTable,.itemTableSpacer5").remove();
    },

    CreateItemTable(itemId) {
        var sTemp = "<table itemId='" + itemId + "' class='table-striped table-bordered itemTable customTable'></table>";
        sTemp += " <div class='spacer5 itemTableSpacer5'></div>";
        $(".divItem").append(sTemp);
    },
    GenerateItemTableHeader(quotation) {
        var sTemp = "<thead style='text-align: center;'></thead>";
        $("table[itemId=" + quotation.ItemId + "]").append(sTemp);
        var sTemp = "<tbody></tbody>";
        $("table[itemId=" + quotation.ItemId + "]").append(sTemp);

        sTemp = "<tr class='tr1'>";
        sTemp += "<th rowspan='2' style='vertical-align: middle; text-align: center;width:60px !important;'>SL #</th>";
        sTemp += "<th rowspan='2' style='vertical-align: middle; text-align: center;width:140px !important;'>Item</th>";

        var tempSuppliers = quotation.Suppliers;
        var tempSupplierIds = $.distinct(tempSuppliers.map(x => x.SupplierId));
        var suppliers = [];
        var qutationIdTake; //new
        tempSupplierIds.map(supplierId => {
           
            var itemSizeColorBreakDowns = [];
            var supplierList = quotation.Suppliers.filter(x => x.SupplierId == supplierId);
            supplierList.map(y => {
              
                qutationIdTake = y.QuotationId;//new
                y.ItemSizeColorBreakDowns.map(z => {
                   
                    var isc = itemSizeColorBreakDowns.find(x => x.ItemSizeId == z.ItemSizeId);
                    if (isc == null || typeof isc === "undefined") {
                        itemSizeColorBreakDowns.push(z);
                    }
                });
            });
            suppliers.push({
                SupplierId: supplierId,
                SupplierName: tempSuppliers.find(x => x.SupplierId == supplierId).SupplierName,
                QuotationId: qutationIdTake,//new
                ItemSizeColorBreakDowns: itemSizeColorBreakDowns
            });
        });
        suppliers = IkrHelper.SortArray(suppliers, "SupplierName");

        var defaultGuid = AjaxManager.DefaultGuidId();
        var sTemp2 = "<tr class='tr2'>";
        suppliers.map(supplier => {
            var colspan = supplier.ItemSizeColorBreakDowns.length;
            colspan = colspan == 0 ? 1 : colspan;
            sTemp += "<th colspan=" + colspan + " style='vertical-align: middle; text-align: center;width:200px !important;'><input class='chkSuppiler' type='checkbox' item-id=" + quotation.ItemId + " s-id=" + supplier.SupplierId + " qd-id=" + supplier.QuotationId + " style='float: left;' /> " + supplier.SupplierName + "</th>";

            supplier.ItemSizeColorBreakDowns = IkrHelper.SortArray(supplier.ItemSizeColorBreakDowns, "ItemSizeName");
            supplier.ItemSizeColorBreakDowns.map(iscbd => {
                //sTemp2 += "<th ItemSize style='vertical-align: middle; text-align: center;width:200px !important;' s-id=" + supplier.SupplierId + " scbd-id=" + iscbd.QuotationSCBId + ">" + iscbd.ItemSizeName + "</th>";
                sTemp2 += "<th ItemSize style='vertical-align: middle; text-align: center;width:200px !important;' s-id=" + supplier.SupplierId + " scbd-id=" + iscbd.ItemSizeId + " supplierItem_id=" + supplier.SupplierId + quotation.ItemId +">" + iscbd.ItemSizeName + "</th>";
            });
        });
        sTemp += "</tr>";
        sTemp2 += "</tr>";

        $("table[itemId=" + quotation.ItemId + "] thead").append(sTemp);
        $("table[itemId=" + quotation.ItemId + "] thead").append(sTemp2);

    },
    GenerateItemTableBody(quotation) {
        var sTemp = "<tr>";
        sTemp += "<td rowSpan=3 style='vertical-align: middle; text-align: center;width:60px !important;'>1</td>";
        sTemp += "<td rowSpan=3 style='vertical-align: middle; text-align: center;width:140px !important;'><span class='spnItem' style='cursor: pointer; text-decoration: underline; color: blue;' title='Click for previous records' i-id='" + quotation.ItemId + "'>" + quotation.ItemName + "</span></td>";

        var tempSuppliers = quotation.Suppliers;
        var tempSupplierIds = $.distinct(tempSuppliers.map(x => x.SupplierId));
        var suppliers = [];
        tempSupplierIds.map(supplierId => {
            var itemSizeColorBreakDowns = [];
            var supplierList = quotation.Suppliers.filter(x => x.SupplierId == supplierId);
            supplierList.map(y => {
                y.ItemSizeColorBreakDowns.map(z => {
                    var isc = itemSizeColorBreakDowns.find(x => x.ItemSizeId == z.ItemSizeId);
                    if (isc == null || typeof isc === "undefined") {
                        itemSizeColorBreakDowns.push(z);
                    }
                });
            });
            suppliers.push({
                SupplierId: supplierId,
                SupplierName: tempSuppliers.find(x => x.SupplierId == supplierId).SupplierName,
                ItemSizeColorBreakDowns: itemSizeColorBreakDowns
            });
        });
        suppliers = IkrHelper.SortArray(suppliers, "SupplierName");

        suppliers.map(supplier => {
            var itemSizeColorBreakDowns = [];
            var supplierWiseList = quotation.Suppliers.filter(x => x.SupplierId == supplier.SupplierId);
            supplierWiseList.map(x => {
                itemSizeColorBreakDowns = [...itemSizeColorBreakDowns, ...x.ItemSizeColorBreakDowns];
            });
            itemSizeColorBreakDowns = IkrHelper.SortArray(itemSizeColorBreakDowns, "ItemSizeName");
            var finalRate = 0,
                quotationDetailsId = AjaxManager.DefaultGuidId(),
                rates = [];
            var itemSizes = $.distinct(itemSizeColorBreakDowns.map(x => x.ItemSizeName));
            itemSizes = itemSizes.sort();
            itemSizes.map(x => {
                var totalSizeBreakDownCount = 0;
                var sizeWiseList = itemSizeColorBreakDowns.filter(y => y.ItemSizeName == x);
                sizeWiseList.map(z => {
                    totalSizeBreakDownCount++;
                    if (!z.IsDisabled) {
                        finalRate = "<span>" + z.Rate + "</span>";
                        quotationDetailsId = z.QuotationDetailsId;
                        // $(".chkSuppiler[item-id=" + quotation.ItemId + "][s-id=" + supplier.SupplierId + "][scbd-id=" + z.QuotationSCBId + "]").attr("qd-id", quotationDetailsId);
                        $(".chkSuppiler[item-id=" + quotation.ItemId + "][s-id=" + supplier.SupplierId + "][scbd-id=" + z.ItemSizeId + "]").attr("qd-id", quotationDetailsId);
                    }
                    else {
                        rates.push("<del>" + z.Rate + "</del>");
                    }
                    if (totalSizeBreakDownCount == sizeWiseList.length) {
                        rates.push(finalRate);
                        rates = rates.join("</br>");
                        rateValue = rates;
                    } else {
                        rateValue = z.Rate;
                    }
                    if (totalSizeBreakDownCount == sizeWiseList.length) {
                        sTemp += "<td style='vertical-align: middle; text-align: center;width:200px !important;'>" + rateValue + "</td>";
                        rates = [];
                    }
                });
            });
        });
        sTemp += "</tr>";
        $("table[itemId=" + quotation.ItemId + "] tbody").append(sTemp);
        $(".spnItem[i-id=" + quotation.ItemId + "]").click(function () {
            PurCSDetailHelper.LoadGridItemHistory(quotation.ItemId);
            //$("#gridItemHistory").data("kendoGrid").dataSource.read();
            $("#divModal").data("kendoWindow").open().center();
        });
    },
    GenerateItemPerRow(quotation) {
        debugger;
        var sTemp = "<tr>";

        var tempSuppliers = quotation.Suppliers;
        var tempSupplierIds = $.distinct(tempSuppliers.map(x => x.SupplierId));
        var suppliers = [];
        tempSupplierIds.map(supplierId => {
            var itemSizeColorBreakDowns = [];
            var supplierList = quotation.Suppliers.filter(x => x.SupplierId == supplierId);
            supplierList.map(y => {
                y.ItemSizeColorBreakDowns.map(z => {
                    var isc = itemSizeColorBreakDowns.find(x => x.ItemSizeId == z.ItemSizeId);
                    if (isc == null || typeof isc === "undefined") {
                        itemSizeColorBreakDowns.push(z);
                    }
                });
            });
            suppliers.push({
                SupplierId: supplierId,
                SupplierName: tempSuppliers.find(x => x.SupplierId == supplierId).SupplierName,
                ItemSizeColorBreakDowns: itemSizeColorBreakDowns
            });
        });
        suppliers = IkrHelper.SortArray(suppliers, "SupplierName");

        suppliers.map(supplier => {
            var itemSizeColorBreakDowns = [];
            var supplierWiseList = quotation.Suppliers.filter(x => x.SupplierId == supplier.SupplierId);
            supplierWiseList.map(x => {
                itemSizeColorBreakDowns = [...itemSizeColorBreakDowns, ...x.ItemSizeColorBreakDowns];
            });
            itemSizeColorBreakDowns = IkrHelper.SortArray(itemSizeColorBreakDowns, "ItemSizeName");
            var itemSizes = $.distinct(itemSizeColorBreakDowns.map(x => x.ItemSizeName));
            itemSizes = itemSizes.sort();
            itemSizes.map(x => {
                var totalSizeBreakDownCount = 0;
                var sizeWiseList = itemSizeColorBreakDowns.filter(y => y.ItemSizeName == x);
                var quotationSCBId = AjaxManager.DefaultGuidId();
                sizeWiseList.map(z => {
                    //if (!z.IsDisabled) quotationSCBId = z.QuotationSCBId;
                    if (!z.IsDisabled) quotationSCBId = z.ItemSizeId;
                    totalSizeBreakDownCount++;
                    //debugger;
                    if (totalSizeBreakDownCount == sizeWiseList.length) { //!=
                        //sTemp += "<td style='vertical-align: middle; text-align: center;padding: 0px;width:200px !important;'><input type='text' class='txtPer form-control' scbd-id=" + quotationSCBId + " item-id=" + quotation.ItemId + " s-id=" + supplier.SupplierId + " style='width:100%;text-align:center;' placeholder='" + supplier.SupplierName + " Allocated Percentage' /></td>";
                        sTemp += "<td style='vertical-align: middle; text-align: center;padding: 0px;width:200px !important;'><input type='text' class='txtPer form-control' scbd-id=" + quotationSCBId + " item-id=" + quotation.ItemId + " s-id=" + supplier.SupplierId + " style='width:100%;text-align:center;' placeholder='" + supplier.SupplierName + " Allocated Percentage' /></td>";
                    }
                });
            });
        });
        sTemp += "</tr>";
        $("table[itemId=" + quotation.ItemId + "] tbody").append(sTemp);
    },
    GenerateItemRemarkRow(quotation) {
        var sTemp = "<tr>";

        var tempSuppliers = quotation.Suppliers;
        var tempSupplierIds = $.distinct(tempSuppliers.map(x => x.SupplierId));
        var suppliers = [];
        tempSupplierIds.map(supplierId => {
            var itemSizeColorBreakDowns = [];
            var supplierList = quotation.Suppliers.filter(x => x.SupplierId == supplierId);
            supplierList.map(y => {
                y.ItemSizeColorBreakDowns.map(z => {
                    var isc = itemSizeColorBreakDowns.find(x => x.ItemSizeId == z.ItemSizeId);
                    if (isc == null || typeof isc === "undefined") {
                        itemSizeColorBreakDowns.push(z);
                    }
                });
            });
            suppliers.push({
                SupplierId: supplierId,
                SupplierName: tempSuppliers.find(x => x.SupplierId == supplierId).SupplierName,
                ItemSizeColorBreakDowns: itemSizeColorBreakDowns
            });
        });
        suppliers = IkrHelper.SortArray(suppliers, "SupplierName");

        suppliers.map(supplier => {
            var itemSizeColorBreakDowns = [];
            var supplierWiseList = quotation.Suppliers.filter(x => x.SupplierId == supplier.SupplierId);
            supplierWiseList.map(x => {
                itemSizeColorBreakDowns = [...itemSizeColorBreakDowns, ...x.ItemSizeColorBreakDowns];
            });
            itemSizeColorBreakDowns = IkrHelper.SortArray(itemSizeColorBreakDowns, "ItemSizeName");
            var itemSizes = $.distinct(itemSizeColorBreakDowns.map(x => x.ItemSizeName));
            itemSizes = itemSizes.sort();
            itemSizes.map(x => {
                var totalSizeBreakDownCount = 0;
                var sizeWiseList = itemSizeColorBreakDowns.filter(y => y.ItemSizeName == x);
                var quotationSCBId = AjaxManager.DefaultGuidId();
                sizeWiseList.map(z => {
                    //if (!z.IsDisabled) quotationSCBId = z.QuotationSCBId;
                    if (!z.IsDisabled) quotationSCBId = z.ItemSizeId;
                    totalSizeBreakDownCount++;
                    if (totalSizeBreakDownCount == sizeWiseList.length) { //!=
                        sTemp += "<td style='vertical-align: middle; text-align: center;padding: 0px;width:200px !important;'><input type='text' class='txtRemark form-control' scbd-id=" + quotationSCBId + " item-id=" + quotation.ItemId + " s-id=" + supplier.SupplierId + " style='width:100%;' placeholder='Remarks' /></td>";
                    }
                });
            });
        });
        sTemp += "</tr>";
        $("table[itemId=" + quotation.ItemId + "] tbody").append(sTemp);
    },

    LoadDetails(e) {
        PurCSDetailHelper.Reset();
        e.preventDefault();
        var gridQuotation = $("#gridQuotation").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        gridQuotation.select(tr);
        PurCSDetailHelper.GenerateRightGrid(selectedItem, CurrentUser.USERID, 0);
    },
    LoadGridQuotation(list) {
        var gridDataSource = new kendo.data.DataSource({
            data: list,
            schema: {
                model: {
                    fields: {
                        RFQDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: true
                        },
                    }
                }
            }
        });
        var gridQuotation = $("#gridQuotation").data("kendoGrid");
        gridQuotation.setDataSource(gridDataSource);
    },
    ShowSummary() {
        $("#divPurCSSummary").show();
        $("#divPurCSDetails").hide();
    },
    ShowDetail() {
        $("#divPurCSSummary").hide();
        $("#divPurCSDetails").show();
    },
    GetObject() {
        var isChanged = true;
        var csiId = $.trim($("#hdnCSId").val());
        var obj = {
            CSId: $.trim($("#hdnCSId").val()),
            CSNo: $.trim($("#txtCSNo").val()),
            RFQId: _nRFQId,
            UserId: CurrentUser.USERID,
            //IsApproved: _isReportingUser ? true : false,
            IsApproved: _isReportingUser ? true : false,
            IsChanged: isChanged,
            PurCsdetails: PurCSDetailHelper.GetPurCSDetails(),
            PurCSApproves: {
                PurCSApproveId: AjaxManager.DefaultGuidId(),
                CSId: $.trim($("#hdnCSId").val()),                
                ApproverBy: _isForward ? 0 : CurrentUser.USERID,
                IsApproved: _isForward ? false : true,
                IsForward: _isForward ? true : false,
                ForwardedTo: _isForward ? $("#cboForwardPersons").data("kendoComboBox").value() : 0,
                ForwardedBy: _isForward ? CurrentUser.USERID : 0
            }
        }
        return obj;
    },
    GetPurCSDetails() {
        var csDetails = [],
            csId = $.trim($("#hdnCSId").val()),
            defaultGuidId = AjaxManager.DefaultGuidId();
        //debugger;
        $('.chkSuppiler:checked').each(function () {
            debugger;
            var supplierId = $(this).attr("s-id");
            var itemId = $(this).attr("item-id");
            var quotationDetailsId = $(this).attr("qd-id");//NEW

            $("th[supplierItem_id=" + supplierId + itemId +"][s-id=" + supplierId + "]").each(function () {
               // debugger;
                var itemSizeId = $(this).attr("scbd-id");
                var percentage = $(".txtPer[item-id=" + itemId + "][s-id=" + supplierId + "][scbd-id=" + itemSizeId + "]").val();
                var remark = $(".txtRemark[item-id=" + itemId + "][s-id=" + supplierId + "][scbd-id=" + itemSizeId + "]").val();

                //var percentage = $(".txtPer[item-id=" + itemId + "][s-id=" + supplierId + "]").val();
                //var remark = $(".txtRemark[scbd-id=" + scbdId + "]").val();



                //var perce = $(`.txtPer`).attr({ 'scbd-id': scbdId,'item-id':itemId,'s-id' :supplierId}).val();
                //var rem = $(`.txtRemark`).attr({ 'scbd-id': scbdId, 'item-id': itemId, 's-id': supplierId}).val();

                // var quotationDetailId = $(this).attr("qd-id");
                var quotationDetailList = PurCSDetailManager.QuotationDetailList(quotationDetailsId);

                var quotationDetailBySupplier = quotationDetailList.find(x => x.SupplierId === supplierId);
                //debugger;
                var quotationColorSizeBreak = PurCSDetailManager.QuotationColorSizeBreakList(quotationDetailBySupplier.QuotationDetailsId);
                var quotationColorSizeBreakByItem = quotationColorSizeBreak.filter(x => x.ItemId == itemId && x.ItemSizeId === itemSizeId);
                for (var i = 0; i < quotationColorSizeBreakByItem.length; i++) {
                    var quotationColorSizeBreakDeatils = quotationColorSizeBreakByItem[i];
                    var quotationDetailId = quotationColorSizeBreakDeatils.QuotationDetailsId;
                    var colorSizeId = quotationColorSizeBreakDeatils.QuotationScbid;

                    var csDetail = {
                        CSDetailsId: defaultGuidId,
                        CSId: csId,
                        //QuotationDetailId: quotationDetailId,
                        QuotationDetailId: quotationDetailId,
                        //QuotationSCBId: scbdId,//new
                        QuotationSCBId: colorSizeId,//new
                        //ItemId: itemId,
                        ItemId: itemId,
                        IsSelected: true,
                        Comments: remark,
                        SelectedPercent: parseFloat(percentage),
                        IsApprove: _isForward ? false : true
                    };
                    csDetails.push(csDetail);
                }
            });
        });
        return csDetails;
    },
    SetInfo(selectedItem) {
        
        $("#hdnCSId").val(selectedItem.CSId);
        $("#txtCSNo").val(selectedItem.CSNo);
    },
    CheckCSSuppliers(selectedItem) {
        _oCsDetails = [];
        if (_nRFQId != null && _nRFQId != AjaxManager.DefaultGuidId()) {
            var oDetails = ApiManager.GetList(_baseUrl + "/api/PurCSs/GetCSDetailByRFQId/" + _nRFQId + "/" + selectedItem.CSBy);
            if (oDetails != null && oDetails.Success) _oCsDetails = oDetails.Result;
        }
        console.log(_oCsDetails);
        if (_oCsDetails != null && _oCsDetails.length > 0) {
            _oCsDetails.map(function (oCsDetail) {
                $(".chkSuppiler[s-id=" + oCsDetail.SupplierId + "][item-id=" + oCsDetail.ItemId + "]")
                    .attr("checked", true)
                    .attr("csd-id", oCsDetail.CSDetailsId)
                    .attr("qd-id", oCsDetail.QuotationDetailId)
                    .attr("hasValue", true);

                $( ".txtPer[s-id=" + oCsDetail.SupplierId + "][item-id=" + oCsDetail.ItemId + "][scbd-id=" + oCsDetail.ItemSizeId + "]" ).val( oCsDetail.SelectedPercent );
                $( ".txtRemark[s-id=" + oCsDetail.SupplierId + "][item-id=" + oCsDetail.ItemId + "][scbd-id=" + oCsDetail.ItemSizeId + "]" ).val( oCsDetail.Comments );
            });
        }
    },
    CheckValidation() {
        //var totalPercentage = 0;
        //$(".chkSuppiler").each(function () {
        //    var supplierId = $(this).attr("s-id");
        //    if (this.checked) {
        //        totalPercentage += parseInt(IkrHelper.EmptyThenZero($(".txtPercentage[s-id=" + supplierId + "]").val()));
        //    } else {
        //        $(".txtPercentage[s-id=" + supplierId + "]").val("");
        //    }
        //});
        //if (totalPercentage != 100) {
        //    AjaxManager.MsgBox('error', 'center', 'Error', "Total percentage must be 100 (Current total percentage is " + totalPercentage + ")",
        //        [{
        //            addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
        //                $noty.close();
        //            }
        //        }]);
        //    return false;
        //}
        return true;
    }
}