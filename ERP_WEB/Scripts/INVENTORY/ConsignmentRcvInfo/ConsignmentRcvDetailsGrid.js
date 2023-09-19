var gbDetailsGridList = [];
var gbTotalQuantity = 0;
var ConsignmentRcvDetailsGridSummaryManager = {

};
var ConsignmentRcvDetailsGridSummaryHelper = {
    InitConsignmentRcvDetailsGridSummary: function () {
        ConsignmentRcvDetailsGridSummaryHelper.GenerateConsignmentDetailsGrid();
    },
    GenerateConsignmentDetailsGrid: function () {
        $("#grdConsignmentRcvDetailsGrid").kendoGrid({
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
                { field: "Quantity", title: "Quantity", width: 100 }//,
                //{
                //    field: "Action", title: "Remove", filterable: false, width: 100, command: [{
                //        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: ConsignmentRcvDetailsGridSummaryHelper.ClickEventForDeleteButton
                //    }]
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    }
};