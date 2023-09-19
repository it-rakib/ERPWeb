var record = 0;
var ReceivedItemListManager = {
    GetReceivedItemInformation: function (piId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/InvMrr/GetAllPIItemInfoByPIId/" + piId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objItem = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objItem;
    },
    GetMRRDetailsItemByMrrId: function (mrrId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/InvMrr/GetMRRDetailsItemByMrrId/" + mrrId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objItem = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objItem;
    }
};

var ReceivedItemListHelper = {
    InitReceivedItemList: function () {
        ReceivedItemListHelper.GenerateItemGrid();
        ReceivedItemListHelper.RcvItemGridChangeEvent();
    },
    GenerateItemGrid: function () {
        $("#grdReceivedItemSummary").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: false,
            sortable: false,
            columns: [
                { title: "#", template: "<span class='row-number'></span>" ,width:10},
                { field: "StyleDetailId", hidden: true, width: 20 },
                { field: "StyleNo", title: "Style", editable: false, width: 20 },
                { field: "BookingNo", title: "Booking No", editable: false, width: 20 },
                { field: "ItemId", hidden: true, width: 20 },
                { field: "ItemName", title: "Item", editable: false, width: 20 },
                { field: "ColorId", hidden: true, width: 20 },
                { field: "ColorName", title: "Color", editable: false, width: 20 },
                { field: "SizeId", hidden: true, width: 20 },
                { field: "SizeName", title: "Size", editable: false, width: 20 },
                { field: "UOMId", hidden: true, width: 20 },
                { field: "UOMName", title: "Unit", editable: false, width: 20 },
                { field: "RequiredQty", title: "Required Qty", editable: false, width: 20 },
                { field: "BookQty", title: "Booking Qty", editable: false, width: 20 },
                { field: "PIQty", title: "PI Qty", editable: false, width: 20 },
                { field: "PrevReceivedQty", title: "Prev Rcv Qty", editable: false, width: 20 },
                { field: "ReceivedQty", title: "Receive Qty", editor: ReceivedItemListHelper.RcvQtyNumericTextBoxEditor, editable: false, width: 20 },
                { field: "Bin", title: "Bin", width: 14, editor: ReceivedItemListHelper.BinDropDownEditor, template: "#=Bin.BinNumber#" },
                { field: "Shelve", title: "Shelve", width: 15, editor: ReceivedItemListHelper.ShelvesDropDownEditor, template: "#=Shelve.ShelveNo#" },
                { field: "IsReceiveComplete", filterable: false, sortable: false, template: '#= ReceivedItemListHelper.CheckedData(data) #', headerTemplate: "<input type='checkbox' id='checkAll'/><label style='margin-left: 10px;'> Is Rcv. Complete</label>", width: 20 }
            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {
                record++;
                var rows = e.sender.content.find('tr');
                var rcvQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ReceivedQty" + "]").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdReceivedItemSummary thead tr");
                    if (!dataItem.name) {
                        tableHeadRow.find('th:eq(' + rcvQtyIndex + ')').addClass('editable');
                        $(row).children('td:eq(' + rcvQtyIndex + ')').addClass('editable-cell');
                    } else {
                        tableHeadRow.find('th:eq(' + rcvQtyIndex + ')').addClass('non-editable');
                    }

                    var rowLabel = $(this).find(".row-number");
                    $(rowLabel).html(index+1);

                });
            },
            edit: function (e) {
                if (e.model.IsReceiveComplete === true || e.model.PIQty === e.model.PrevReceivedQty) {
                    this.closeCell();
                }
            }
        });
    },
    BinDropDownEditor: function (container, options) {
        var data = MerchantManager.GetAllBin();
        var obj = new Object();
        obj.BinNumber = "--Select Bin--";
        obj.BinId = 0;
        data.unshift(obj);
        $('<input id="BinDropDown" data-text-field="BinNumber" data-value-field="BinId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: data,
                index: 0
            });
        var dropdownlist = $("#BinDropDown").data("kendoDropDownList");
        dropdownlist.list.width("auto");
    },
    ShelvesDropDownEditor: function (container, options) {
        var data = MerchantManager.GetAllShelves();
        var obj = new Object();
        obj.ShelveNo = "--Select Shelve--";
        obj.ShelveId = 0;
        data.unshift(obj);
        $('<input id="ShelveDropDown" data-text-field="ShelveNo" data-value-field="ShelveId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: data,
                index: 0
            });
        var dropdownlist = $("#ShelveDropDown").data("kendoDropDownList");
        dropdownlist.list.width("auto");
    },
    RcvQtyNumericTextBoxEditor: function (container, options) {
        $('<input name="' + options.field + '"/>')
         .appendTo(container)
         .kendoNumericTextBox({
             format: "n4",
             decimals: 4,
             min: 0
         });
    },
    CheckedData: function (data) {
        if (data.IsReceiveComplete === true || data.PIQty === data.PrevReceivedQty) {
            return '<input id="IsReceiveComplete" class="check_row" type="checkbox" checked="checked"/>';
        } else {
            return '<input id="IsReceiveComplete" class="check_row" type="checkbox"/>';
        }
    },
    RcvItemGridChangeEvent: function () {
        $('#grdReceivedItemSummary').on('change', '#checkAll', function (e) {
            var selectAll = document.getElementById("checkAll");
            if (selectAll.checked == true) {
                $("#grdReceivedItemSummary tbody input:checkbox").prop("checked", this.checked);
                //$("#grdReceivedItemSummary table tr").addClass('k-state-selected');
            }
            else {
                $("#grdReceivedItemSummary tbody input:checkbox").prop("checked", false);
                //$("#grdReceivedItemSummary table tr").removeClass('k-state-selected');
            }
        });// All Row Selection 
    },
    LoadReceivedItemListGrid: function (obj) {
        if (obj !== null && obj !== undefined) {
            $("#txtPINo").val(obj.PINo);
            $("#hdnPIId").val(obj.PIId);
            var grid = $("#grdReceivedItemSummary").data("kendoGrid");
            grid.dataSource.data([]);
            var itemList = ReceivedItemListManager.GetReceivedItemInformation(obj.PIId);
            var itemObj = itemList[0];

            //$("#cmbSupplier").data("kendoComboBox").value(itemObj.SupplierId);
            //$("#txtInvoiceNo").val(itemObj.ComInvoiceNo);
            //$("#txtInvoiceDate").data("kendoDatePicker").value(itemObj.ComInvoiceDate);

            if (itemObj.IsTotalRcvComplete === 1) {
                $("#btnSaveMrr").hide();
                $("#lblMessage").html("This PI already received");
            } else {
                $("#btnSaveMrr").show();
                $("#lblMessage").html("");
            }
            if (itemList != null) {
                itemList.map(x=> x.Bin = {
                    BinId: x.Bin.BinId == null ? 0 : x.Bin.BinId,
                    BinNumber: x.Bin.BinNumber == null ? "--Select Bin--" : x.Bin.BinNumber
                });
                itemList.map(x=> x.Shelve = {
                    ShelveId: x.Shelve.ShelveId == null ? 0 : x.Shelve.ShelveId,
                    ShelveNo: x.Shelve.ShelveNo == null ? "-Select Shelve-" : x.Shelve.ShelveNo
                });
            }

            var gridDataSource = new kendo.data.DataSource({
                data: itemList,
                schema: {
                    model: {
                        fields: {
                            IsRcvComplete: { editable: false},
                            ReceivedQty: { editable: true },
                            StyleNo: { editable: false },
                            ItemName: { editable: false },
                            ColorName: { editable: false },
                            SizeName: { editable: false },
                            UomName: { editable: false },
                            RequiredQty: { editable: false },
                            BookQty: { editable: false },
                            PIQty: { editable: false },
                            IsReceiveComplete: { editable: false },
                            PrevReceivedQty: { editable: false },
                            UOMName: { editable: false },
                            Bin: {
                                defaultValue: { BinId: 0, BinNumber: "--Select Bin--" },
                                editable:true
                            },
                            Shelve: {
                                defaultValue: { ShelveId: 0, ShelveNo: "-Select Shelve-" },
                                editable: true
                            }
                        }
                    }
                }
            });
            grid.setDataSource(gridDataSource);
            grid.dataSource.bind("change", function (e) {
                if (e.action === "itemchange") {
                    var obj = e.items[0];
                    if (e.field === "ReceivedQty") {
                        var prevRcvQty = UtilityHelper.ZeroIfNullorEmpty(obj.PrevReceivedQty);
                        var rcvQty = prevRcvQty + obj.ReceivedQty;
                        if (rcvQty > obj.PIQty) {
                            e.items[0].ReceivedQty = obj.PIQty - prevRcvQty;
                            return;
                        }
                    }
                }
            });
        }

    }
};