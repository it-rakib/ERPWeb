var checkedDatas = [];
var QCItemListManager = {
    GetQCItemInformation: function (piid, consignmentId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/InvQC/GetPIItemListByPIId/" + piid + "/" + consignmentId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objItem = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objItem;
    },
    GetQCDetailsItemByQCId: function (qcId) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/InvQC/GetQCDetailsItemByQCId/" + qcId;
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

var QCItemListHelper = {
    InitQCItemList: function () {
        QCItemListHelper.GenerateItemGrid();
        QCItemListHelper.ItemGridChangeEvent();
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
            scrollable: true,
            persistSelection: true,
            height: 500,
            columns: [
                { field: "BuyerId", hidden: true },
                { field: "BuyerName", title: "Buyer Name", editable: false },
                { field: "StyleDetailsId", hidden: true },
                { field: "StyleNo", title: "Style", editable: false },
                { field: "BookingDeatilsId", hidden: true },
                { field: "BookingId", hidden: true },
                { field: "BookingNo", title: "Booking No", editable: false },
                { field: "ItemId", hidden: true },
                { field: "ItemGroupId", hidden: true },
                { field: "ItemName", title: "Item", editable: false },
                { field: "ColorId", hidden: true },
                { field: "ColorName", title: "Color", editable: false },
                { field: "SizeId", hidden: true },
                { field: "SizeName", title: "Size", editable: false },
                { field: "UOMId", hidden: true },
                { field: "UOMName", title: "Unit", editable: false },
                { field: "UnitPrice", hidden: false },
                { field: "PIQty", title: "PI Qty", editable: false },
                { field: "PrevRcvQty", title: "Prev Rcv Qty", editable: false, hidden: true },
                { field: "ReceivedQty", title: "Rcv Qty", editable: false },
                { field: "PrevQCPQty", title: "Prev QC Qty", editable: false },
                { field: "QCPassQty", title: "Check Qty", editor: QCItemListHelper.RcvQtyNumericTextBoxEditor, editable: false },
                { field: "QCPassPercent", title: "Check %", editor: QCItemListHelper.RcvQtyNumericTextBoxEditor, editable: false },
                { field: "QCRejectQty", title: "Reject Qty", editor: QCItemListHelper.RcvQtyNumericTextBoxEditor, editable: false },
                { field: "QCRejectPercent", title: "Reject %", editor: QCItemListHelper.RcvQtyNumericTextBoxEditor, editable: false },
                { field: "ItemRemarks", title: "Remarks", editable: false },
                { field: "IsQCPass", filterable: false, sortable: false, template: '#= QCItemListHelper.CheckedQCPData(data) #', headerTemplate: "<input type='checkbox' id='checkAllQCP'/> Is QCPass" },
                { field: "IsReturn", filterable: false, sortable: false, template: '#= QCItemListHelper.CheckedReturnData(data) #', headerTemplate: "<input type='checkbox' name='checkAllReturn' id='checkAllReturn' disabled/> Is Return" },
                {
                    command: [{
                        name: "edit", text: "Cause", iconClass: "k-icon k-i-check-circle", className: "btn btn-danger", click: QCItemListHelper.ClickEventForCauseButton
                    }], title: "Reject / Return &nbsp;"
                }
            ],
            selectable: "row",
            editable: true,
            navigatable: true,
            dataBound: function (e) {
                var rows = e.sender.content.find('tr');
                var qcQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "QCPassQty" + "]").index();
                var rejectQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "QCRejectQty" + "]").index();
                var remarksIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ItemRemarks" + "]").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdReceivedItemSummary thead tr");
                    if (!dataItem.name) {
                        tableHeadRow.find('th:eq(' + qcQtyIndex + ')').addClass('editable');
                        $(row).children('td:eq(' + qcQtyIndex + ')').addClass('editable-cell');

                        tableHeadRow.find('th:eq(' + rejectQtyIndex + ')').addClass('editable');
                        $(row).children('td:eq(' + rejectQtyIndex + ')').addClass('editable-cell');

                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('editable');
                        $(row).children('td:eq(' + remarksIndex + ')').addClass('editable-cell');
                    } else {
                        tableHeadRow.find('th:eq(' + qcQtyIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + rejectQtyIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + remarksIndex + ')').addClass('non-editable');
                    }
                    var itemGroupId = dataItem.get("ItemGroupId");
                    var row = e.sender.tbody.find("[data-uid='" + dataItem.uid + "']");
                    if (itemGroupId === "138A3B7B-519E-4D58-8D5E-095B72CDA03A") {
                        //e.items[0].QCPassPercent = (((obj.QCPassQty / obj.ReceivedQty) * 100)).toFixed(2);
                        var rcvqty = dataItem.get("ReceivedQty");
                        var qCpQty = dataItem.get("QCPassQty");
                        row.model.QCPassPercent = ((qCpQty / rcvqty) * 100).toFixed(2);
                        if (row.model.QCPassPercent < 10) {
                            AjaxManager.MsgBox('warning', 'center', 'Required', "For febric QC can't be less than 10%",
                            [
                                {
                                    addClass: 'btn btn-success',
                                    text: 'OK',
                                    onClick: function ($noty) {
                                        $noty.close();
                                    }
                                }
                            ]);
                        }
                    }
                });
            },
            edit: function (e) {
                if (e.model.ReceivedQty === e.model.PrevQCPQty) {
                    this.closeCell();
                }
            }
        });
    },

    ClickEventForCauseButton: function (e) {
        e.preventDefault();
        var grid = $("#grdReceivedItemSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        var ds = grid.dataSource.view();
        grid.select(tr);
        if (selectedItem != null) {
            var selectedRow = grid.select();
            var index = selectedRow.index();
            var row = grid.table.find("tr[data-uid='" + ds[index].uid + "']");
            var chkboxQCP = $(row).find(".IsReturn");
            if (chkboxQCP.is(":checked")) {
                RejectOrReturnCauseHelper.FillCauseGrid(selectedItem);
                $("#popupROrRCause").data("kendoWindow").open().center();
            } else {
                AjaxManager.NotifyMsg("btnBackQCList", "error", "left", 1500, "Please Check Is Return First.");
            }
        }
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
    CheckedQCPData: function (data) {
        if (data.IsQCPass === true || data.PIQty === data.PrevQCPQty) {
            return '<input id="IsQCPass" class="IsQCPass" type="checkbox" name="check-QCP" checked="checked"/>';
        } else {
            return '<input id="IsQCPass" class="IsQCPass" type="checkbox"/>';
        }
    },
    CheckedReturnData: function (data) {
        if (data.IsReturn === true) {
            return '<input id="IsReturn" class="IsReturn" type="checkbox" name="check_Return" checked="checked"/>&nbsp;';
        } else {
            return '<input id="IsReturn" class="IsReturn" type="checkbox" name="check_Return"/>&nbsp;';
        }
    },
    ItemGridChangeEvent: function () {
        $('#grdReceivedItemSummary').on('change', '#checkAllQCP', function (e) {
            var selectAllQCP = document.getElementById("checkAllQCP");
            if (selectAllQCP.checked === true) {
                $('#grdReceivedItemSummary tbody input.IsQCPass').prop("checked", this.checked);
            }
            else {
                $('#grdReceivedItemSummary tbody input.IsQCPass').prop("checked", false);
            }
        });// Select All Row of Is QC Pass

        $('#grdReceivedItemSummary').on('change', '#checkAllReturn', function (e) {
            var selectAllReturn = document.getElementById("checkAllReturn");
            if (selectAllReturn.checked === true) {
                $('#grdReceivedItemSummary tbody input.IsReturn').prop("checked", this.checked);
            }
            else {
                $('#grdReceivedItemSummary tbody input.IsReturn').prop("checked", false);
            }
        });// Select All Row of Is Return
    },
    LoadQCItemListGrid: function (obj) {
        if (obj !== null && obj !== undefined) {
            $("#txtPINo").val(obj.PINo);
            $("#hdnPIId").val(obj.PIId);
            $("#txtConsignmentNo").val(obj.ConsignmentNo);
            $("#hdnConsignmentId").val(obj.ConsignmentId);
            var grid = $("#grdReceivedItemSummary").data("kendoGrid");
            grid.dataSource.data([]);
            var itemList = QCItemListManager.GetQCItemInformation(obj.PIId, obj.ConsignmentId);
            var itemObj = itemList[0];
            if (itemObj == null || typeof itemObj === "undefined") {
                $("#lblMessage").html("This PI Not Received Yet. Please Received First.").attr("style", "line-height: 20px; color: red; font-weight: bold; font-size: 18px !important;");
            }
            else {
                if (itemObj.IsTotalQCComplete === 1) {
                    $("#btnSaveQC").hide();
                    $("#lblMessage").html("This PI Item Already Quality Checked.");
                }
                else {
                    $("#btnSaveQC").show();
                    $("#lblMessage").html("");
                }
            }

            var gridDataSource = new kendo.data.DataSource({
                data: itemList,
                schema: {
                    model: {
                        fields: {
                            IsReturn: { editable: false },
                            IsQCPass: { editable: false },
                            ItemRemarks: { editable: true },
                            QCRejectPercent: { editable: false },
                            QCRejectQty: { editable: true },
                            QCPassPercent: { editable: false },
                            QCPassQty: { editable: true },
                            PrevQCPQty: { editable: false },
                            ReceivedQty: { editable: false },
                            PIQty: { editable: false },
                            BuyerName: { editable: false },
                            StyleNo: { editable: false },
                            BookingNo: { editable: false },
                            ItemName: { editable: false },
                            ColorName: { editable: false },
                            SizeName: { editable: false },
                            UOMName: { editable: false }
                        }
                    }
                }
            });
            grid.setDataSource(gridDataSource);
            grid.dataSource.bind("change", function (e) {
                if (e.action === "itemchange") {
                    var obj = e.items[0];
                    if (e.field === "QCPassQty") {
                        var prevQCPQty = UtilityHelper.ZeroIfNullorEmpty(obj.PrevQCPQty);
                        var qcQty = prevQCPQty + obj.QCPassQty;
                        if (qcQty > obj.ReceivedQty) {
                            e.items[0].QCPassQty = obj.ReceivedQty - prevQCPQty;
                        }
                        e.items[0].QCPassPercent = (((obj.QCPassQty / obj.ReceivedQty) * 100)).toFixed(2);
                        $("#grdReceivedItemSummary tbody").find("tr[data-uid='" + e.items[0].uid + "'] td:eq(22)").text(e.items[0].QCPassPercent);
                    }
                    else if (e.field === "QCPassPercent") {
                        e.items[0].QCPassQty = ((obj.ReceivedQty * obj.QCPassPercent / 100)).toFixed(2);
                        $("#grdReceivedItemSummary tbody").find("tr[data-uid='" + e.items[0].uid + "'] td:eq(21)").text(e.items[0].QCPassQty);
                    }
                    else if (e.field === "QCRejectQty") {
                        e.items[0].QCRejectPercent = (((obj.QCRejectQty / obj.ReceivedQty) * 100)).toFixed(2);
                        $("#grdReceivedItemSummary tbody").find("tr[data-uid='" + e.items[0].uid + "'] td:eq(24)").text(e.items[0].QCRejectPercent);
                    }
                    else if (e.field === "QCRejectPercent") {
                        e.items[0].QCRejectQty = ((obj.ReceivedQty * obj.QCRejectPercent / 100)).toFixed(2);
                        $("#grdReceivedItemSummary tbody").find("tr[data-uid='" + e.items[0].uid + "'] td:eq(23)").text(e.items[0].QCRejectQty);
                    }
                    //grid.refresh();
                }
            });
        }
    }
};