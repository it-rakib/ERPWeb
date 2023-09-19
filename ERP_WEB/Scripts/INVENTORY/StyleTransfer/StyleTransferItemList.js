var StyleTransferItemListManager = {
    GetStoreRcvDetailsByStyleAndStoreId: function (fromStyleDetailsId, storeId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/StyleTransfer/GetStoreRcvDetailsByStyleAndStoreId/" + fromStyleDetailsId + "/" + storeId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objItem = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objItem;
    },
    GetStyleTransferOutDetailsBySTOutId: function (sTOutId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/StyleTransfer/GetStyleTransferOutDetailsBySTOutId/" + $.trim(sTOutId);
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

var StyleTransferItemListHelper = {
    InitStyleTransferItemList: function () {
        StyleTransferItemListHelper.GenerateItemGrid();
    },
    GenerateItemGrid: function () {
        $("#grdStyleTransferItemList").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: true,
            sortable: false,
            toolbar: ["search"],
            search: {
                fields: ["ItemName"]
            },
            columns: [
                { field: "STOutId", hidden: true },
                { field: "STOutDetailsId", hidden: true },
                { field: "FromStyleId", hidden: true },
                { field: "FromStyleDetailsId", hidden: true },
                { field: "ToStyleId", hidden: true },
                { field: "ToStyleDetailsId", hidden: true },
                { field: "ItemId", hidden: true },
                { field: "ItemName", title: "Item", editable: false },
                { field: "ColorId", hidden: true },
                { field: "ColorName", title: "Color", editable: false },
                { field: "SizeId", hidden: true },
                { field: "SizeName", title: "Size", editable: false },
                { field: "UOMId", hidden: true },
                { field: "UOMName", title: "Unit", editable: false },
                { field: "Rate", title: "Rate", editable: false },
                { field: "TotalRcvQty", title: "Available Qty", editable: false },
                { field: "BalanceQty", title: "Balance Qty", editable: false },
                { field: "PrevSTOutQty", title: "Prev Transfer Qty", editable: false },
                { field: "STOutQtyPrev", hidden: true },
                { field: "STOutQty", title: "Transfer Qty", editor: StyleTransferItemListHelper.NumericTextBoxEditor, editable: false },
                { field: "ItemRemarks", title: "Remarks", editable: false }
            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {
                var rows = e.sender.content.find('tr');
                var sTOutQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "STOutQty" + "]").index();
                var remarksIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ItemRemarks" + "]").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdStyleTransferItemList thead tr");
                    if (!dataItem.name) {
                        tableHeadRow.find('th:eq(' + sTOutQtyIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('editable');
                    } else {
                        tableHeadRow.find('th:eq(' + sTOutQtyIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('non-editable');
                    }
                    var balance = dataItem.get("BalanceQty");
                    var prevTransfer = dataItem.get("PrevSTOutQty");
                    var row1 = e.sender.tbody.find("[data-uid='" + dataItem.uid + "']");
                    //if (balance === 0) {
                    //    row1.addClass("complete");
                    //}
                    //if (prevTransfer > 0) {
                    //    row1.addClass("pending");
                    //}
                });
            },
            edit: function (e) {
                if (e.model.BalanceQty === 0) {
                    this.closeCell();
                }
            }
        });
    },
    NumericTextBoxEditor: function (container, options) {
        $('<input name="' + options.field + '"/>')
         .appendTo(container)
         .kendoNumericTextBox({
             format: "n4",
             decimals: 4,
             min: 0
         });
    },
    SetToStyleTransferDetails: function(objToSto) {
        if (objToSto !== null) {
            $("#hdnToStyleId").val(objToSto.ToStyleId);
            $("#hdnToStyleDetailsId").val(objToSto.ToStyleDetailsId);
            $("#txtToStyleNo").val(objToSto.ToStyleNo);
        }
    },
    LoadStyleTransferItemListGridByStyle: function (obj) {
        if (obj !== null) {
            $("#hdnFromStyleId").val(obj.FromStyleId);
            $("#hdnFromStyleDetailsId").val(obj.FromStyleDetailsId);
            $("#txtFromStyleNo").val(obj.FromStyleNo);
            //StyleTransferItemListHelper.SetToStyleTransferDetails(obj);
            $("#hdnSTOutId").val(obj.STOutId === "" || obj.STOutId === "undefined" ? AjaxManager.DefaultGuidId() : obj.STOutId);
            var storeId = $("#cmbFromStore").data("kendoComboBox").value();
            var grid = $("#grdStyleTransferItemList").data("kendoGrid");
            grid.dataSource.data([]);
            var itemList = StyleTransferItemListManager.GetStoreRcvDetailsByStyleAndStoreId(obj.FromStyleDetailsId, storeId);
            var gridDataSource = new kendo.data.DataSource({
                data: itemList,
                schema: {
                    model: {
                        fields: {
                            ItemRemarks: { editable: true },
                            STOutQty: { editable: true },
                            PrevSTOutQty: { editable: false },
                            BalanceQty: { editable: false },
                            TotalRcvQty: { editable: false },
                            Rate: { editable: false },
                            UOMName: { editable: false },
                            ColorName: { editable: false },
                            SizeName: { editable: false },
                            ItemName: { editable: false }
                        }
                    }
                }
            });
            grid.setDataSource(gridDataSource);
            grid.dataSource.bind("change", function (e) {
                if (e.action === "itemchange") {
                    var obj = e.items[0];
                    if (e.field === "STOutQty") {
                        if (obj.STOutQty > obj.BalanceQty) {
                            e.items[0].STOutQty = obj.BalanceQty;
                            AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Transfer Qty can't greater than Current Balance",
                            [
                                {
                                    addClass: 'btn btn-primary',
                                    text: 'OK',
                                    onClick: function ($noty) {
                                        $noty.close();
                                    }
                                }
                            ]);
                            return;
                        }
                    }
                }
            });
        }
    }
};