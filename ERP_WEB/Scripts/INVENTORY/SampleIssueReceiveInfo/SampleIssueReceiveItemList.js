var SampleIssueReceiveItemListManager = {
    GetSampleIssueReceiveDetailsByReceiveId: function (receiveId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/SampleIssueReceive/GetSampleIssueReceiveDetailsByReceiveId/" + receiveId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objItem = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objItem;
    },
    GetSampleIssueDetailsItemByIssueId: function (issueId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/SampleIssueReceive/GetSampleIssueDetailsItemByIssueId/" + issueId;
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

var SampleIssueReceiveItemListHelper = {
    InitSampleIssueReceiveItemList: function () {
        SampleIssueReceiveItemListHelper.GenerateItemGrid();
    },
    GenerateItemGrid: function () {
        $("#grdSampleIssueReceiveItemSummary").kendoGrid({
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
                { field: "TotalRcvQty", title: "MRR Qty", editable: false },
                { field: "RequiredQty", title: "Requisition Qty", editable: false },
                { field: "IssueQtyPrev", hidden: true },
                { field: "IssueQty", title: "Issue Qty", editable: false },
                { field: "ReceiveQty", title: "Receive Qty", editable: false },
                { field: "ItemRemarks", title: "Remarks", editable: false }
            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {
                var rows = e.sender.content.find('tr');
                var receiveQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ReceiveQty" + "]").index();
                var remarksIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "Remarks" + "]").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdSampleIssueReceiveItemSummary thead tr");
                    if (!dataItem.name) {
                        tableHeadRow.find('th:eq(' + receiveQtyIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('editable');
                    } else {
                        tableHeadRow.find('th:eq(' + receiveQtyIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('non-editable');
                    }
                   // dataItem.set("IssueReceiveQty", dataItem.IssueQty);
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
    LoadSampleIssueItemListGridByIssueId: function (obj) {
        if (obj !== null) {
            $("#hdnStyleId").val(obj.StyleId);
            $("#hdnStyleDetailsId").val(obj.StyleDetailId);
            $("#txtSrcStyle").val(obj.StyleNo);
            $("#hdnRequisitionId").val(obj.RequisitionId);
            $("#txtSrcRequisition").val(obj.RequisitionNo);
            $("#hdnIssueId").val(obj.IssueId === "" || obj.IssueId === "undefined" ? AjaxManager.DefaultGuidId() : obj.IssueId);
            var grid = $("#grdSampleIssueReceiveItemSummary").data("kendoGrid");
            grid.dataSource.data([]);
            var itemList = SampleIssueReceiveItemListManager.GetSampleIssueDetailsItemByIssueId(obj.IssueId);
            var gridDataSource = new kendo.data.DataSource({
                data: itemList,
                schema: {
                    model: {
                        fields: {
                            ItemRemarks: { editable: true },
                            ReceiveQty: { editable: false },
                            IssueQty: { editable: false },
                            PrevIssueQty: { editable: false },
                            RequiredQty: { editable: false },
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
                        if (obj.ReceiveQty > obj.IssueQty) {
                            e.items[0].ReceiveQty = obj.IssueQty;
                            AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Receive Qty can't greater than Issue Qty",
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