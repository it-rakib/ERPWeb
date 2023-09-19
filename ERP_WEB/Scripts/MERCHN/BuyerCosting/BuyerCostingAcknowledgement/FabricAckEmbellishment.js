var FabricEmbellishmentSummaryManager = {
};
var FabricEmbellishmentSummaryHelper = {
    InitFabricEmbellishment:function() {
        FabricEmbellishmentSummaryHelper.GenerateFabricEmbGrid();
        FabricEmbellishmentSummaryHelper.LoadFabricEmbellishmentGridData(AjaxManager.DefaultGuidId());
    },
    GenerateFabricEmbGrid: function () {
        $("#grdFabricEmbSummary").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: false,
            sortable: false,
            columns: [
                { field: "CostingEmbId", hidden: true },
                { field: "EmbellishmentId", hidden: true },
                { field: "EmbellishmentName", title: "Embellishment Name" },
                { field: "Rate", title: "Rate",editable:false, editor: FabricEmbellishmentSummaryHelper.NumericTextBoxEditor, footerTemplate: "Total : <span id='spnTotalRate'></span>" }
            ],
            editable: false
          

        });
    },
    NumericTextBoxEditor: function (container, options) {
        $('<input name="' + options.field + '"/>')
         .appendTo(container)
         .kendoNumericTextBox({
             format: "n4",
             decimals: 4,
             min: 0,
             change: function () {
                 FabricEmbellishmentSummaryHelper.CalculateTotalEmbRate();
                 BuyerCostingHelper.CalculateTotalFOB();
             }
         });
    },
    LoadFabricEmbellishmentGridData: function (styleDetailId) {
        var fabEmbGrid = $("#grdFabricEmbSummary").data("kendoGrid");
        var fabEmbData = BuyerCostingManager.GetBuyerCostingEmbellishmentData(styleDetailId);
        var gridDataSource = new kendo.data.DataSource({
            data: fabEmbData,
            schema: {
                model: {
                    fields: {
                        check_row1: {
                            editable: false
                        },
                        Rate: {type:'number',decimals:4,format:"n4" },
                        WashTypeId: { editable: false }
                    }
                }
            }
        });
        fabEmbGrid.setDataSource(gridDataSource);
        FabricEmbellishmentSummaryHelper.CalculateTotalEmbRate();

        fabEmbGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange" && e.field === "Rate") {
                BuyerCostingHelper.CalculateTotalFOB();
            }
        });
    },
    CalculateTotalEmbRate: function () {
        var gridDataSource = $("#grdFabricEmbSummary").data("kendoGrid").dataSource.data();
        var totalEmbRate = 0;
        $.each(gridDataSource, function (index, model) {
            totalEmbRate += model.get("Rate");
        });
        $("#spnTotalRate").html(totalEmbRate.toFixed(4).toString());
    }
};