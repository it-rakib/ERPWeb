var IssueItemListManager = {
    GetSampleRequetionByRequisitionId: function (requisitionId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/SampleIssue/GetSampleReqByRequisitionId/" + requisitionId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objItem = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objItem;
    },
    GetSampleIssueDetailsByIssueId: function (issueId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/SampleIssue/GetSampleIssueDetailsByIssueId/" + issueId;
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

var IssueItemListHelper = {
    InitIssueItemList: function () {
        IssueItemListHelper.GenerateItemGrid();
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
    GenerateItemGrid: function ()  {
        $("#grdSampleIssueItemList").kendoGrid({
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
                { field: "TotalRcvQty", title: "MRR Qty", editable: false },
                { field: "RequiredQty", title: "Requisition Qty", editable: false },
                { field: "BalanceQty", title: "Current Balance", editable: false },
                { field: "PrevIssueQty", title: "Prev Issue Qty", editable: false },
                { field: "IssueQtyPrev", hidden: true },
                { field: "IssueQty", title: "Issue Qty", editor: IssueItemListHelper.NumericTextBoxEditor, editable: false },
                { field: "ItemRemarks", title: "Remarks", editable: false }
            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {
                var rows = e.sender.content.find('tr');
                var balanceQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "BalanceQty" + "]").index();
                var issueQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "IssueQty" + "]").index();
                var remarksIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "Remarks" + "]").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdSampleIssueItemList thead tr");
                    if (!dataItem.name) {
                        tableHeadRow.find('th:eq(' + issueQtyIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('editable');
                    } else {
                        tableHeadRow.find('th:eq(' + issueQtyIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('non-editable');
                    }
                    var balance = dataItem.get("BalanceQty");
                    var prevIssue = dataItem.get("PrevIssueQty");
                    var row1 = e.sender.tbody.find("[data-uid='" + dataItem.uid + "']");
                    if (balance === 0) {
                        row1.addClass("complete");
                    }
                    if (prevIssue > 0) {
                        row1.addClass("pending");
                    }
                });
            },
            edit: function (e) {
                if (e.model.BalanceQty === 0) {
                    this.closeCell();
                }
            },
        });
    },
    LoadSampleIssueGridByRequisition: function (obj) {
        if (obj !== null) {
            $("#hdnRequisitionId").val(obj.RequisitionId);
            $("#hdnRequisitionDetailsId").val(obj.RequisitionDetailsId);
            $("#txtSrcRequisition").val(obj.RequisitionNo);
            $("#hdnStyleId").val(obj.StyleId);
            $("#hdnStyleDetailsId").val(obj.StyleDetailsId);
            $("#txtSrcStyle").val(obj.StyleNo);
            $("#cmbToStore").data("kendoComboBox").value(obj.StoreFromId);
            $("#hdnIssueId").val(obj.IssueId === "" || obj.IssueId === "undefined" ? AjaxManager.DefaultGuidId() : obj.IssueId);
            var grid = $("#grdSampleIssueItemList").data("kendoGrid");
            grid.dataSource.data([]);
            var itemList = IssueItemListManager.GetSampleRequetionByRequisitionId(obj.RequisitionId);
            var gridDataSource = new kendo.data.DataSource({
                data: itemList,
                schema: {
                    model: {
                        fields: {
                            ItemRemarks: { editable: true },
                            IssueQty: { editable: true },
                            PrevIssueQty: { editable: false },
                            BalanceQty: { editable: false },
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
                    if (e.field === "IssueQty") {
                        if (obj.IssueQty > obj.BalanceQty) {
                            e.items[0].IssueQty = obj.BalanceQty;
                            AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Issue Qty can't greater than Current Balance",
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