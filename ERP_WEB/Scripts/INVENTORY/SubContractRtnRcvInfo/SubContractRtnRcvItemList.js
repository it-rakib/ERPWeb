var RtnRcvItemListManager = {
    GetSubContractRtnRcvDetailsByReceiveId: function (receiveId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/SubContractRtnRcv/GetSubContractRtnRcvDetailsByReceiveId/" + receiveId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objItem = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objItem;
    },
    GetSubContractRtnDetailsItemByIssueId: function (issueId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/SubContractRtnRcv/GetSubContractRtnDetailsByIssueId/" + issueId;
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

var RtnRcvItemListHelper = {
    InitRtnRcvItemList: function () {
        RtnRcvItemListHelper.GenerateItemGrid();
    },
    GenerateItemGrid: function () {
        $("#grdSubContractRtnRcvItemList").kendoGrid({
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
                { field: "ReceiveId", hidden: true },
                { field: "ReceiveDetailsId", hidden: true },
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
                { field: "TotalRcvQty", title: "Receive Qty", editable: false },
                { field: "TotalRtnQty", title: "Return Qty", editable: false },
                { field: "BalanceQty", title: "Balance Qty", editable: false },
                { field: "PrevRcvQty", title: "Prev Rcv Qty", editable: false },
                { field: "ReceiveQty", title: "Rtn Rcv Qty", editable: false },
                { field: "ItemRemarks", title: "Remarks", editable: false }
            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {
                var rows = e.sender.content.find('tr');
                var rcvQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ReceiveQty" + "]").index();
                var remarksIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ItemRemarks" + "]").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdSubContractRtnRcvItemList thead tr");
                    if (!dataItem.name) {
                        //tableHeadRow.find('th:eq(' + rcvQtyIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('editable');
                    } else {
                        //tableHeadRow.find('th:eq(' + rcvQtyIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('non-editable');
                    }
                    // dataItem.set("ReceiveQty", dataItem.IssueQty);
                });
            },
            edit: function (e) {
                if ((e.model.IssueQty - e.model.ReceiveQty) === 0) {
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
    LoadReturnItemListGridByIssueId: function (obj) {
        if (obj !== null) {
            $("#hdnStyleId").val(obj.StyleId);
            $("#hdnStyleDetailsId").val(obj.StyleDetailId);
            $("#txtSrcStyle").val(obj.StyleNo);
            $("#hdnRequisitionId").val(obj.RequisitionId);
            $("#txtSrcRequisition").val(obj.RequisitionNo);
            $("#hdnIssueId").val(obj.IssueId === "" || obj.IssueId === "undefined" ? AjaxManager.DefaultGuidId() : obj.IssueId);
            var grid = $("#grdSubContractRtnRcvItemList").data("kendoGrid");
            grid.dataSource.data([]);
            var itemList = RtnRcvItemListManager.GetSubContractRtnDetailsItemByIssueId(obj.IssueId);
            var gridDataSource = new kendo.data.DataSource({
                data: itemList,
                schema: {
                    model: {
                        fields: {
                            ItemRemarks: { editable: true },
                            ReceiveQty: { editable: false },
                            PrevRcvQty: { editable: false },
                            BalanceQty: { editable: false },
                            TotalRtnQty: { editable: false },
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
                    if (e.field === "ReceiveQty") {
                        if (obj.ReceiveQty > obj.TotalRtnQty) {
                            e.items[0].ReceiveQty = obj.TotalRtnQty;
                            AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Receive Qty can't greater than Return Qty",
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