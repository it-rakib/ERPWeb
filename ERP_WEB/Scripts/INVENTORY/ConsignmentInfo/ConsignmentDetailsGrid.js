var gbDetailsGridList = [];
var gbTotalQuantity = 0;
var ConsignmentDetailsGridSummaryManager = {

};
var ConsignmentDetailsGridSummaryHelper = {
    InitConsignmentDetailsGridSummary: function () {
        MerchantHelper.LoadMerchItemCombo("cmbItem");
        MerchantHelper.LoadPackageTypeCombo("cmbPackType");
        ConsignmentDetailsGridSummaryHelper.GenerateNumericTextBox();
        ConsignmentDetailsGridSummaryHelper.GenerateConsignmentDetailsGrid();
        $("#btnAdd").click(function () {
            ConsignmentDetailsGridSummaryHelper.AddToList();
            ConsignmentDetailsGridSummaryHelper.ClearFormField();
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtQuantity").kendoNumericTextBox({ format: "#", min: 0 });
    },
    GenerateConsignmentDetailsGrid: function () {
        $("#grdConsignmentDetailsGridSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "ConsignmentId", hidden: true, width: 20 },
                { field: "ConsignmentDetailsId", hidden: true, width: 20 },
                { field: "TruckNo", title: "Truck No", width: 100 },
                { field: "ItemId", hidden: true, width: 20 },
                { field: "ItemName", title: "Item", width: 100 },
                { field: "PackTypeId", hidden: true, width: 20 },
                { field: "PackTypeName", title: "Pack Type", width: 100 },
                { field: "Quantity", title: "Quantity", width: 100 },
                {
                    field: "IsReceived", title: "Remove", filterable: false, width: 100, command: [{
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger",
                        visible: function (data) { return data.IsReceived === false },
                         click: ConsignmentDetailsGridSummaryHelper.ClickEventForDeleteButton
                    }]
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },

    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var grid = $("#grdConsignmentDetailsGridSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < gbDetailsGridList.length; i++) {
                if (gbDetailsGridList[i].ItemId === selectedItem.ItemId && gbDetailsGridList[i].PackTypeId === selectedItem.PackTypeId) {
                    gbTotalQuantity = gbTotalQuantity - selectedItem.Quantity;
                    gbDetailsGridList.splice(i, 1);
                    break;
                }
            }
            ConsignmentDetailsGridSummaryHelper.CalculateQty();
        }
    },

    AddToList: function () {
        var consignmentid = $("#hdnConsignmentId").val();
        var consignmentdetailsid = $("#hdnConsignmentDetailsId").val();
        var truckNo = $("#txtTruckNo").val();
        var itemCombo = $("#cmbItem").data("kendoComboBox");
        var packTypeCombo = $("#cmbPackType").data("kendoComboBox");
        var quantity = $("#txtQuantity").data("kendoNumericTextBox").value();
        var gridView = $("#grdConsignmentDetailsGridSummary").data("kendoGrid");

        if (truckNo !== "" && itemCombo.value() !== "" && packTypeCombo.value() !== "" && quantity > 0) {
            var gridData = gridView.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itempackType = gridData[i];
                //var truck = truckNo;
                var itemId = itemCombo.value();
                var packTypeId = packTypeCombo.value();
                if (itempackType.TruckNo === truckNo && itempackType.ItemId === itemId && itempackType.PackTypeId === packTypeId) {
                    AjaxManager.NotifyMsg("btnAdd", "error", "bottom", 1500, "This Truck No & Item & Pack Type Already Added");
                    return;
                }
            }

            var obj = new Object();
            obj.ConsignmentDetailsId = UtilityHelper.EmptyThenDefaultGuidId(consignmentdetailsid);
            obj.ConsignmentId = UtilityHelper.EmptyThenDefaultGuidId(consignmentid);
            obj.TruckNo = truckNo;
            obj.ItemId = itemCombo.value();
            obj.ItemName = itemCombo.text();
            obj.PackTypeId = packTypeCombo.value();
            obj.PackTypeName = packTypeCombo.text();
            obj.Quantity = quantity;
            gbTotalQuantity += quantity;
         
            gbDetailsGridList.push(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: gbDetailsGridList,
                schema: {
                    model: {
                        fields: {
                            Edit: {
                                editable: false
                            }
                        }
                    }
                }
            });
            gridView.setDataSource(gridDataSource);
            ConsignmentDetailsGridSummaryHelper.CalculateQty();
        }
        else {
            if (truckNo === "") {
                AjaxManager.NotifyMsg("txtTruckNo", "error", "bottom", 1500, "Required");
            }
            if (itemCombo.value() === "0") {
                AjaxManager.NotifyMsg("cmbItem", "error", "bottom", 1500, "Required");
            }
            if (packTypeCombo.value() === "0") {
                AjaxManager.NotifyMsg("cmbPackType", "error", "bottom", 1500, "Required");
            }
            if (quantity == null) {
                AjaxManager.NotifyMsg("txtQuantity", "error", "bottom", 1500, "Required");
            }
        }
    },
    CalculateQty: function () {
        //$("#").data("kendoNumericTextBox").value(gbTotalQuantity);
    },
    ClearFormField: function () {
        //$("#txtTruckNo").val("");
        $("#cmbItem").data("kendoComboBox").value("");
        $("#cmbPackType").data("kendoComboBox").value("");
        $("#txtQuantity").data("kendoNumericTextBox").value("");
    }
};