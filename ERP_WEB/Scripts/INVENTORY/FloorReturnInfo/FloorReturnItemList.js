﻿var FloorReturnItemListManager = {
    GetFloorRcvInfoByStyleAndStoreId: function (styleDetailsId, storeId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/FloorReturn/GetFloorRcvInfoByStyleAndStoreId/" + styleDetailsId + "/" + storeId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objItem = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objItem;
    },
    GetFloorReturnDetailsItemByIssueId: function (issueId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/FloorReturn/GetFloorReturnDetailsByIssueId/" + issueId;
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

var FloorReturnItemListHelper = {
    InitFloorReturnItemList: function () {
        FloorReturnItemListHelper.GenerateItemGrid();
    },
    GenerateItemGrid: function () {
        $("#grdFloorReturnItemSummary").kendoGrid({
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
                { field: "IssueId", hidden: true },
                { field: "IssueDetailsId", hidden: true },
                { field: "StyleId", hidden: true },
                { field: "StyleDetailsId", hidden: true },
                { field: "ItemId", hidden: true },
                { field: "ItemName", title: "Item", editable: false },
                { field: "ColorId", hidden: true },
                { field: "ColorName", title: "Color", editable: false },
                { field: "SizeId", hidden: true },
                { field: "SizeName", title: "Size", editable: false },
                { field: "UOMId", hidden: true },
                { field: "UOMName", title: "Unit", editable: false },
                { field: "Rate", title: "Rate", editable: false },
                { field: "FloorRcvQty", title: "Receive Qty", editable: false },
                { field: "BalanceQty", title: "Remain Qty", editable: false },
                { field: "PrevReturnQty", title: "Prev Return Qty", editable: false },
                { field: "ReturnQty", title: "Return Qty", editable: false },
                { field: "ItemRemarks", title: "Remarks", editable: false }
            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {
                var rows = e.sender.content.find('tr');
                var returnQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ReturnQty" + "]").index();
                var remarksIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ItemRemarks" + "]").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdFloorReturnItemSummary thead tr");
                    if (!dataItem.name) {
                        tableHeadRow.find('th:eq(' + returnQtyIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('editable');
                    } else {
                        tableHeadRow.find('th:eq(' + returnQtyIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('non-editable');
                    }
                   // dataItem.set("ReturnQty", dataItem.IssueQty);
                });
            },
            edit: function (e) {
                if ((e.model.FloorRcvQty - e.model.ReturnQty) === 0) {
                    //this.closeCell();
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
    LoadReturnItemListGridByStyle: function (obj) {
        if (obj !== null) {
            $("#hdnStyleId").val(obj.StyleId);
            $("#hdnStyleDetailsId").val(obj.StyleDetailId);
            $("#txtSrcStyle").val(obj.StyleNo);
            $("#hdnRequisitionId").val(obj.RequisitionId);
            $("#hdnIssueId").val(obj.IssueId === "" || obj.IssueId === "undefined" ? AjaxManager.DefaultGuidId() : obj.IssueId);
            var storeId = $("#cmbFromStore").data("kendoComboBox").value();
            var grid = $("#grdFloorReturnItemSummary").data("kendoGrid");
            grid.dataSource.data([]);
            var itemList = FloorReturnItemListManager.GetFloorRcvInfoByStyleAndStoreId(obj.StyleDetailId,storeId);
            var gridDataSource = new kendo.data.DataSource({
                data: itemList,
                schema: {
                    model: {
                        fields: {
                            ItemRemarks: { editable: true },
                            ReturnQty: { editable: true },
                            PrevReturnQty: { editable: false },
                            BalanceQty: { editable: false },
                            FloorRcvQty: { editable: false },
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
                    if (e.field === "ReturnQty") {
                        if (obj.ReturnQty > obj.FloorRcvQty) {
                            e.items[0].ReturnQty = obj.FloorRcvQty;
                            AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Return Qty can't greater than Receive Qty",
                                [{
                                    addClass: 'btn btn-primary',
                                    text: 'OK',
                                    onClick: function ($noty) {
                                        $noty.close();
                                    }
                                }]);
                            return;
                        }
                    }
                }
            });
        }
    }
};