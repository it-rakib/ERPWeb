var POUsingFileUploadDetailsManager = {
    GetStyleDeatilsDropdown: function () {
        var objStyle = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/Styles/GetStyleDropdownForPo";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objStyle = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objStyle;
    },
    LoadStatusCombo(cboId, flagNo) {
        var allStatus = MerchantManager.GetStatuses(flagNo);
        var specificStatus = allStatus.filter(v => v.StatusId.toUpperCase() === '53F78B22-BA53-4ADD-BED4-9768EBBCFB6B' || v.StatusId.toUpperCase() === '3FA85F64-5717-4562-B3FC-2C963F66AFA6');
        UtilityHelper.LoadCombo(cboId, "StatusId", "StatusName", specificStatus, "--Select PO Status--");
    },
    SavePOInfo: function () {
        if (POUsingFileUploadDetailsHelper.ValidateForm()) {
            debugger;
            var command = POUsingFileUploadDetailsHelper.CreatePOInfoObject();
            debugger;
            var jsonParam = JSON.stringify(command);
            var serviceUrl = _baseUrl + "/api/PurchaseOrders/CreateUploadedFilePurchaseOrder";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {

            var msg = jsonData.Message;
            if (jsonData.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#AttachmentFile").val("");
                            $("#cmbStyle").data("kendoMultiColumnComboBox").value("");
                            $("#cmbStyle").data("kendoMultiColumnComboBox").text("");
                            $("#txtOrderQty").data("kendoNumericTextBox").value("");;

                            $("#cmbContactOrLC").data("kendoComboBox").value("");
                            $("#cmbContactOrLC").data("kendoComboBox").text("");

                            $("#cmbPOType").data("kendoComboBox").value("");
                            $("#cmbPOType").data("kendoComboBox").text("");
                            $("#uploadedFileData").data("kendoGrid").setDataSource([]);
                        }
                    }]);
            }

            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', jsonData.Message,
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
    
};

var POUsingFileUploadDetailsHelper = {
    Init: function () {
        $("#poFileUpload").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });

        POUsingFileUploadDetailsHelper.GenerateGrid();
        POUsingFileUploadDetailsHelper.GenerateNumericTextBox();
       // POUsingFileUploadDetailsHelper.GenerateDatePicker();
        POUsingFileUploadDetailsHelper.GenerateStyleMultiColumnComboBoxForPo("cmbStyle");
        POUsingFileUploadDetailsHelper.LoadStyleCombo("cmbStyle");
        POUsingFileUploadDetailsManager.LoadStatusCombo("cmbPOType", 2);
        //POUsingFileUploadDetailsHelper.GenerateShipmentModeCombo("cmbShipmentMode");
       // POUsingFileUploadDetailsHelper.GenerateParentPOCombo("cmbParentPO");
        MerchantHelper.GeneratePOCombo("cmbParentPO");
        //MerchantHelper.GenerateLeadTimeCombo("cmbLeadTime");
        MerchantHelper.LoadSaleContractCombo("cmbContactOrLC");

        $('#AttachmentFile').on("change", function () {
            var fileName = '';
            for (var i = 0; i < this.files.length; i++) {
                fileName += this.files[i].name + " ";
            }
        });

        $('#upload').on("click", function () {
            var id = $("#cmbStyle").data("kendoMultiColumnComboBox").value();
            if (id === "00000000-0000-0000-0000-000000000000") {
                return AjaxManager.NotifyMsg("cmbStyle", "error", "right", 1500, "Select Buyer, Brand, Department, Season, Year & Status!");
            }
            var input = $("#AttachmentFile").get(0);
            var files = input.files;
            if (files.length > 0) {
                var formData = new FormData();
                for (var i = 0; i != files.length; i++) {
                    formData.append('File', files[i]);
                }
                formData.append("id", id);
                //debugger;
                //var object = {};
                //formData.forEach(function (value, key) {
                //    object[key] = value;
                //});
                //var json = JSON.stringify(object);
                // debugger;
                $.ajax({
                    async: false,
                    type: "POST",
                    url: _baseUrl + "/api/PurchaseOrders/ReadPOUploadedFile/",

                    contentType: false,
                    processData: false,

                    data: formData,// { model: model },
                    success: function (data) {
                        // var setData = data.shift();
                        debugger;
                        var grid = $("#uploadedFileData").data("kendoGrid");
                        grid.dataSource.data([]);;
                        grid.setDataSource(data);
                        $("#txtOrderQty").data("kendoNumericTextBox").value(data[data.length - 1].TotalQty);
                    },
                    error: function (request, status, error) {
                        //debugger;
                        //alert(request.responseText);
                        AjaxManager.MsgBox('error', 'center', 'Error1', request.responseText,
                            [{
                                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                    $noty.close();
                                }
                            }]);
                    }
                });
            } else {
                return AjaxManager.NotifyMsg("AttachmentFile", "error", "right", 1500, "Choose A File Before Upload!")
                
            }
        });
       
        $('#export').on("click", function () {
            var workbook = new kendo.ooxml.Workbook({
                sheets: [
                    {
                        // The column settings (width).
                        columns: [
                            { width: 100 },
                            { width: 100 },
                            { width: 100 },
                            { width: 100 },
                            { width: 100 },
                            { width: 100 },//
                            //{ width: 100 },
                            { width: 100 },
                            { width: 100 },
                            { width: 150 },
                            { width: 150 },
                            { width: 150 },
                            { width: 100 },
                        ],
                        // Th title of the sheet.
                        title: "Final PO",
                        // The rows of the sheet.
                        rows: [
                            // The first row (header).
                            {
                                cells: [
                                    { value: "Style", textAlign: "center", background: "#FFFF00"},
                                    { value: "PO/DPO", textAlign: "center", background: "#FFFF00" },
                                    { value: "Color", textAlign: "center", background: "#FFFF00"},
                                    { value: "Unit Price", textAlign: "center", background: "#FFFF00"},
                                    { value: "Size", textAlign: "center", background: "#FFFF00"},
                                    { value: "Quantity", textAlign: "center", background: "#FFFF00" },//
                                    { value: "Ship Country", textAlign: "center", background: "#FFFF00" },
                                    { value: "Ship Mode", textAlign: "center", background: "#FFFF00" },
                                    { value: "Ship Date(M/D/Y)", textAlign: "center", background: "#FFFF00" },

                                    //{ value: "Contact / LC", textAlign: "center", background: "#FFFF00" },
                                    { value: "Receive Data(M/D/Y)", textAlign: "center", background: "#FFFF00"},
                                    { value: "Cuttoff Date(M/D/Y)", textAlign: "center", background: "#FFFF00" },
                                    { value: "Lead Time", textAlign: "center", background: "#FFFF00" },
                                ]
                            }
                           
                        ]
                    }
                ]
            });
            kendo.saveAs({
                dataURI: workbook.toDataURL(),
                fileName: "UploadPO.xlsx"
            });
        });
        $("#cmbPOType").change(function () {
            POUsingFileUploadDetailsHelper.ChangeEventForPOTypeCombo();
        });

        //$("#cmbStyle").change(function () {
        //    POUsingFileUploadDetailsHelper.LoadLeadTimeCombo();
        //});

        $("#btnSave").click(function () {
            POUsingFileUploadDetailsManager.SavePOInfo();
        });


    },
    GenerateNumericTextBox: function () {
        $("#txtOrderQty").kendoNumericTextBox({ format: "#", min: 0 });
    },
    GenerateDatePicker: function () {
        $("#txtReceiveDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtShipmentDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtCuttoffDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateStyleMultiColumnComboBoxForPo: function (ctrlId) {
        $("#" + ctrlId).kendoMultiColumnComboBox({
            dataSource: [],
            dataTextField: "StyleNo",
            dataValueField: "StyleDetailId",
            columns: [
                { field: "StyleNo", title: "Style No", width: 120 },
                { field: "BuyerName", title: "Buyer", width: 120 },
                { field: "BrandName", title: "Brand", width: 120 },
                { field: "DepartmentName", title: "Department", width: 120 },
                { field: "SeasonName", title: "Season", width: 100 },
                { field: "Year", title: "Year", width: 80 },
                { field: "StatusName", title: "Status", width: 100 },
            ],
            //change: ColorSizeTemplateSummaryHelper.ChangeStyle(this),
            filter: "startswith",
            filterFields: ["StyleNo"],
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            index: 0,
            placeholder: "---Select Style---",
            height: 250

        });
    },
    GenerateGrid() {
        $("#uploadedFileData").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            //noRecords: {
            //    template: "<label>NO DATA FOUND</label>"
            //},
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            
            columns: [
             //   { field: "BookingId", hidden: true },
                { field: "StyleDetailId", hidden: true },
                { field: "ColorId", hidden: true },
                { field: "SizeId", hidden: true },
                { field: "CountryId", hidden: true },
                { field: "ShipModeId", hidden: true },
                { field: "LeadTimeId", hidden: true },//
                { field: "Style", title: "Style No", width: 40, sortable: true },
                { field: "PO", title: "PO No", width: 40, sortable: true },
                { field: "Color", title: "Color No", width: 40, sortable: true },
                { field: "UnitPrice", title: "Unit Price", width: 40, sortable: true },
                { field: "size", title: "size", width: 40, sortable: true },
                { field: "Qunatity", title: "Qunatity", width: 40, sortable: true },
                { field: "ShipCountry", title: "Ship Country", width: 40, sortable: true },
                { field: "ShipmentMode", title: "Ship Mode", width: 40, sortable: true },
                { field: "ShipDate", title: "Ship Date", width: 40, sortable: true, },
                { field: "ReceiveData", title: "Receive Data", width: 40, sortable: true, format: "{0:MM/dd/yyyy}" },
                { field: "CuttoffDate", title: "Cuttoff Data", width: 40, sortable: true, format: "{0:MM/dd/yyyy}" },
                { field: "LeadTime", title: "Lead Time", width: 40, sortable: true },
                //{
                //    field: "Action", title: "Action", filterable: false, width: 60, command: [{
                //        name: "delete", text: "Remove", iconClass: "k-icon k-i-delete", className: "k-danger", click: PIDetailsHelper.ClickEventForDeleteButton
                //    }]
                //}
            ],
            pageable: {
                pageSize: 50
            },
            editable: false,
            //selectable: "row",
            //navigatable: true,
            //scrollable: false
        });

    },
    LoadStyleCombo: function (id) {
        var cboStyle = $("#" + id).data("kendoMultiColumnComboBox");
        var data = POUsingFileUploadDetailsManager.GetStyleDeatilsDropdown();

        var obj = new Object();
        obj.StyleNo = "---Select---";
        obj.StyleDetailId = AjaxManager.DefaultGuidId();
        obj.BuyerName = "";
        obj.BrandName = "";
        obj.DepartmentName = "";
        obj.SeasonName = "";
        obj.Year = "";
        obj.StatusName = "";
        obj.Fob = "";

        data.unshift(obj);

        cboStyle.setDataSource(data);
        cboStyle.select(0);
    },
    GenerateShipmentModeCombo: function (identity) {
        var objShipmentMode = MerchantManager.GetAllShipmentMode();
        var obj = new Object();
        obj.ModeName = "---Select---";
        obj.CmnShipmentModeId = "0";
        objShipmentMode.unshift(obj);
        $("#" + identity).kendoComboBox({
            placeholder: "Select",
            dataTextField: "ModeName",
            dataValueField: "CmnShipmentModeId",
            dataSource: objShipmentMode,
            index: 0,
            suggest: true,
            filter: "contains",
            change: function () {
                AjaxManager.isValidItem(identity, true);
            }
        });
    },
    //GenerateParentPOCombo: function (identity) {
    //    var objPoType = [];
    //    var obj = new Object();
    //    obj.Pono = "---Select---";
    //    obj.Poid = AjaxManager.DefaultGuidId();
    //    objPoType.unshift(obj);
    //    $("#" + identity).kendoComboBox({
    //        placeholder: "Select",
    //        dataTextField: "Pono",
    //        dataValueField: "Poid",
    //        dataSource: objPoType,
    //        index: 0,
    //        suggest: true,
    //        filter: "contains",
    //        change: function () {
    //            AjaxManager.isValidItem(identity, true);
    //        }
    //    });
    //},
    ChangeEventForPOTypeCombo: function () {
        $("#divParentPO").hide();
        $("#cmbParentPO").data("kendoComboBox").value("");
        $("#cmbParentPO").data("kendoComboBox").text("");
        var statusId = $("#cmbPOType").data("kendoComboBox").value();
        if (statusId.toUpperCase() === "53F78B22-BA53-4ADD-BED4-9768EBBCFB6B") {
            $("#divParentPO").show();
        } else {
            $("#divParentPO").hide();
        }
    },
    //LoadLeadTimeCombo: function () {
    //    var styleInfo = $("#cmbStyle").data("kendoMultiColumnComboBox").dataItem();
    //    var buyerId = styleInfo.BuyerId;
    //    var brandId = styleInfo.BrandId;
    //    var deptId = styleInfo.DepartmmentId;
    //    var data = MerchantManager.GetAllLeadTime(buyerId, brandId, deptId);
    //    var leadTimeCombo = $("#cmbLeadTime").data("kendoComboBox");
    //    var leadTimeComboData = leadTimeCombo.dataSource.data();
    //    data.map(y => {
    //        var leadTime = leadTimeComboData.find(x => x.LeadTimeId === y.LeadTimeId);
    //        if (leadTime == null || typeof leadTime === "undefined") leadTimeComboData.push(y);
    //    });
    //    leadTimeCombo.setDataSource(leadTimeComboData);
    //},
    CreatePOInfoObject: function () {
        var grid = $("#uploadedFileData").data("kendoGrid");
        var gridData = grid.dataSource.data();
        var obj = new Object();
        obj.Poid = AjaxManager.DefaultGuidId();
        obj.Pono = gridData[0].PO;
        var parentPoId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbParentPO").data("kendoComboBox").value());
        obj.ParentPoid = parentPoId;
        obj.Scid = UtilityHelper.EmptyThenDefaultGuidId($("#cmbContactOrLC").data("kendoComboBox").value());
        obj.StatusId = $("#cmbPOType").data("kendoComboBox").value();
        obj.OrderQty = IkrHelper.EmptyThenZero($("#txtOrderQty").data("kendoNumericTextBox").value());

        obj.ReceivedDate = gridData[0].ReceiveData;
        obj.CmnShipmentModeId = gridData[0].ShipModeId;
        obj.ShipmentDate = gridData[0].ShipDate;
        obj.CutOffDate = gridData[0].CuttoffDate;
        obj.LeadTimeId = gridData[0].LeadTimeId;
        obj.CountryId = gridData[0].CountryId;

        obj.UserId = CurrentUser.USERID;
        obj.UploadPurchaseOrderDetailCommand = POUsingFileUploadDetailsHelper.CreatePODetailsObject(gridData);
        obj.PoUploadsizeColorBreakdownCommand = POUsingFileUploadDetailsHelper.CreateColorSizeBreakdownObject(gridData);
        debugger

        return obj;
    },
    CreatePODetailsObject: function (gridData) {
        var poDetailsList = [];
        var uniqueStyleDetail = gridData.map(item => item.StyleDetailId)
            .filter((value, index, self) => self.indexOf(value) === index)
        for (var i = 0; i < uniqueStyleDetail.length; i++) {
            var obj = new Object();
            obj.Poid = AjaxManager.DefaultGuidId();
            obj.StyleDetailId = uniqueStyleDetail[i];
            poDetailsList.push(obj);
        }
        return poDetailsList;
    },
    CreateColorSizeBreakdownObject: function (gridData) {
        var colorSizeList = [];
        //var colorSizeGrid = $("#uploadedFileData").data("kendoGrid");
        //var gridData = colorSizeGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var detailsData = gridData[i];
            var obj = new Object();
            obj.Poid = AjaxManager.DefaultGuidId();
           // obj.Pono = detailsData.PO;
            obj.ColorId = detailsData.ColorId;
            obj.UnitPrice = detailsData.UnitPrice;
            obj.SizeId = detailsData.SizeId;
            obj.Quantity = detailsData.Qunatity;
            obj.StyleDetailId = detailsData.StyleDetailId;
            colorSizeList.push(obj);
        }
        return colorSizeList;
    },
    ValidateForm: function () {
        var res = true;
        var poType = $("#cmbPOType").data("kendoComboBox");
        if (poType.value() === "" || poType.value() === undefined) {
            AjaxManager.NotifyMsg("cmbPOType", "error", "right", 1500, "Required");
            res = false;
        }
        var SCLC = $("#cmbContactOrLC").data("kendoComboBox");
        if (SCLC.value() === "" || SCLC.value() === undefined) {
            AjaxManager.NotifyMsg("cmbContactOrLC", "error", "right", 1500, "Required");
            res = false;
        }
        var statusId = $("#cmbPOType").data("kendoComboBox").value();
        if (statusId === "53f78b22-ba53-4add-bed4-9768ebbcfb6b") {
            var parentPO = $("#cmbParentPO").data("kendoComboBox");
            if (parentPO.value() === "" || parentPO.value() === undefined || parentPO.value() === null) {
                AjaxManager.NotifyMsg("cmbParentPO", "error", "right", 1500, "Required");
                res = false;
            }
        }
        var orderQty = $("#txtOrderQty").val();
        if (orderQty === "" || orderQty === undefined || orderQty === null) {
            AjaxManager.NotifyMsg("txtOrderQty", "error", "right", 1500, "Required");
            res = false;
        }
        var grid = $("#uploadedFileData").data("kendoGrid");
        var gridData = grid.dataSource.data();
        if (gridData.length == 0) {
            AjaxManager.NotifyMsg("AttachmentFile", "error", "right", 1500, "Upload File Before!");
            res = false;
        }
        return res;
    }
};