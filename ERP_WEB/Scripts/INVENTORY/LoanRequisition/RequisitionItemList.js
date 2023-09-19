var LoanRequisitionItemListManager = {
    GetItemListForLoanReqByStyleDetailsAndStoreId: function (styleDetailId, storeId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/LoanRequisition/GetStoreItemListByStyleAndStoreId/" + styleDetailId + "/" + storeId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objItem = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objItem;
    },
    GetLoanReqDetailsByReqId: function (requisitionId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/LoanRequisition/GetLoanReqDetailsByReqId/" + requisitionId;
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

var LoanRequisitionItemListHelper = {
    InitRequisitionItemList: function () {
        LoanRequisitionItemListHelper.GenerateItemGrid();
    },
    GenerateItemGrid: function () {
        $("#grdRequisitionItemSummary").kendoGrid({
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
                { field: "RequisitionId", hidden: true },
                { field: "RequisitionDetailsId", hidden: true },
                { field: "StyleId", hidden: true },
                { field: "StyleDetailId", hidden: true },
                { field: "ItemId", hidden: true },
                { field: "ItemName", title: "Item", editable: false },
                { field: "ColorId", hidden: true },
                { field: "ColorName", title: "Color", editable: false },
                { field: "SizeId", hidden: true },
                { field: "SizeName", title: "Size", editable: false },
                { field: "UOMId", hidden: true },
                { field: "UOMName", title: "Unit", editable: false },
                { field: "Rate", title: "Rate", editable: false },
                { field: "StoreRcvQty", title: "Store Rcv Qty", editable: false, hidden: true },
                { field: "BalanceQty", title: "Balance Qty", editable: false },
                { field: "PrevRequiredQty", title: "Prev Req. Qty", editable: false },
                { field: "RequiredQty", title: "Requisition Qty", editor: LoanRequisitionItemListHelper.NumericTextBoxEditor, editable: false },
                { field: "Remarks", title: "Remarks", editable: false }
            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {
                var rows = e.sender.content.find('tr');
                var balanceQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "BalanceQty" + "]").index();
                var requiredQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "RequiredQty" + "]").index();
                var remarksIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "Remarks" + "]").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdRequisitionItemSummary thead tr");
                    if (!dataItem.name) {
                        tableHeadRow.find('th:eq(' + requiredQtyIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('editable');
                    } else {
                        tableHeadRow.find('th:eq(' + requiredQtyIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('non-editable');
                    }
                    var balance = dataItem.get("BalanceQty");
                    var prevRequisition = dataItem.get("PrevRequiredQty");
                    var row1 = e.sender.tbody.find("[data-uid='" + dataItem.uid + "']");
                    if (balance === 0) {
                        row1.addClass("complete");
                    }
                    if (prevRequisition > 0) {
                        row1.addClass("pending");
                    }
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
    LoadRequisitionItemListGrid: function (obj) {
        if (obj !== null) {
            $("#hdnStyleId").val(obj.StyleId);
            $("#hdnStyleDetailsId").val(obj.StyleDetailId);
            $("#txtSrcStyle").val(obj.StyleNo);
            $("#hdnRequisitionId").val(obj.RequisitionId);
            var storeId = $("#cmbStoreTo").data("kendoComboBox").value();
            var grid = $("#grdRequisitionItemSummary").data("kendoGrid");
            grid.dataSource.data([]);
            var itemList = LoanRequisitionItemListManager.GetItemListForLoanReqByStyleDetailsAndStoreId(obj.StyleDetailId,storeId);
            var gridDataSource = new kendo.data.DataSource({
                data: itemList,
                schema: {
                    model: {
                        fields: {
                            Remarks: { editable: true },
                            RequiredQty: { editable: true },
                            PrevRequiredQty: { editable: false },
                            BalanceQty: { editable: false },
                            TotalRcvQty: { editable: false },
                            StoreRcvQty: { editable: false },
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
                    if (e.field === "RequiredQty") {
                        if (obj.RequiredQty > obj.BalanceQty) {
                            e.items[0].RequiredQty = obj.BalanceQty;
                            AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Requisition Qty can't greater than Balance Qty",
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