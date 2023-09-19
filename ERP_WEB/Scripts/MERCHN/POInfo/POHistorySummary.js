
var POHistorySummaryManager = {
    GetPOHistoryData: function (styleDetailsList) {
        var poHistoryData = [];
        var jsonParam = JSON.stringify(styleDetailsList);
        var serviceUrl = _baseUrl + "/api/PurchaseOrders/GetNoOfPOCreatedByStyleDetailIdList";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            poHistoryData = jsonData;
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
        }

        return poHistoryData;
    }
};

var POHistorySummaryHelper = {
    InitPOHistorySummary: function () {
        POHistorySummaryHelper.GeneratePOHistorySummaryGrid();
    },
    GeneratePOHistorySummaryGrid: function () {
        //debugger;
        $("#grdPOHistorySummary").kendoGrid({
            dataSource:[],
            filterable: false,
            sortable: true,
            columns: [
                { field: "Poid", hidden: true, width: 10 },
                { field: "PONo", title: "PO No", sortable: true, width: 35, footerTemplate: "Total PO : <span id='TotalPOQty'></span>" },
                { field: "ShipmentDate", title: "Shipment Date", width: 25, sortable: true, template: '#=kendo.toString(ShipmentDate==null?"":ShipmentDate,"dd-MMM-yyyy")#' },
                { field: "ProjectedQty", title: "Projected Qty", width: 20, sortable: true, footerTemplate: "<span id='spnProjQty'></span>" },
                { field: "ConfirmQty", title: "Confirm Qty", width: 20, sortable: true, footerTemplate: "<span id='spnConfirmQty'></span>" },
                { field: "DPOQty", title: "DPO Qty", width: 20, sortable: true, footerTemplate: "<span id='spnDpoQty'></span>" }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            //dataBound: function () {
            //    var dataView = this.dataSource.view();
            //    for (var i = 0; i < dataView.length; i++) {
            //        var uid = dataView[i].uid;
            //        if (dataView[i].StatusId === "16715a94-073c-4503-83dd-1d558d6e8efd") {
            //            $("#grdPOHistorySummary tbody").find("tr[data-uid=" + uid + "]").css("background-color", "#179E79");
            //            $("#grdPOHistorySummary tbody").find("tr[data-uid=" + uid + "]").css("color", "#ffffff");
            //        }
            //        else if (dataView[i].StatusId === "3fa85f64-5717-4562-b3fc-2c963f66afa6") {
            //            $("#grdPOHistorySummary tbody").find("tr[data-uid=" + uid + "]").css("background-color", "#FC546B");
            //            $("#grdPOHistorySummary tbody").find("tr[data-uid=" + uid + "]").css("color", "#ffffff");
            //        }
            //        else if (dataView[i].StatusId.toLowerCase() === "53F78B22-BA53-4ADD-BED4-9768EBBCFB6B") {
            //            $("#grdPOHistorySummary tbody").find("tr[data-uid=" + uid + "]").css("background-color", "#48B5F7");
            //            $("#grdPOHistorySummary tbody").find("tr[data-uid=" + uid + "]").css("color", "#ffffff");
            //        }
            //    }
            //}

        });
    },

    LoadPOHistoryGrid: function (styleList) {
        var styleIds = styleList.map(x => x.StyleDetailId);
        var poHistoryData = POHistorySummaryManager.GetPOHistoryData(styleIds);
        var poHistoryGrid = $("#grdPOHistorySummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: poHistoryData,
            aggregate: [{ field: "ProjectedQty", aggregate: "sum" }, { field: "ConfirmQty", aggregate: "sum" }, { field: "DPOQty", aggregate: "sum" }],
            schema: {
                model: {
                    fields: {
                        ShipmentDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                    }
                }
            }
        });
        poHistoryGrid.setDataSource(gridDataSource);
        POHistorySummaryHelper.CalculatePOQty(gridDataSource);

        //Load Parent PO
        var masterPoList = poHistoryData.filter(x => x.StatusId === "3fa85f64-5717-4562-b3fc-2c963f66afa6");
        var parentPoCombo = $("#cmbParentPO").data("kendoComboBox");
        $("#cmbParentPO").data("kendoComboBox").value("");
        $("#cmbParentPO").data("kendoComboBox").text("");
        parentPoCombo.setDataSource(masterPoList);

    },
   
    CalculatePOQty: function (gridDataSource) {
        var dataSource = gridDataSource;
        var projQty = 0;
        var confirmQty = 0;
        var dpoQty = 0;
        var poQty = 0;
        $.each(dataSource.data(), function (index, model) {
            projQty += model.get("ProjectedQty");
            confirmQty += model.get("ConfirmQty");
            dpoQty += model.get("DPOQty");
            poQty += 1;
        });
        $("#spnProjQty").html(projQty.toString());
        $("#spnConfirmQty").html(confirmQty.toString());
        $("#spnDpoQty").html(dpoQty.toString());
        $("#TotalPOQty").html(poQty.toString());
    }

};