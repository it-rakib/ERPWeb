var gbSelectiveArray = [];
var FabricCompositionSummaryManager = {
    GetFabricCompositionData: function (styleDetailsList, supplierId) {
        debugger;
        var pofabCompData = [];
        var jsonParam = JSON.stringify(styleDetailsList);
        var serviceUrl = _baseUrl + "/api/BOM/GetFabricCompositionByStyleDetailId/" + supplierId;
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            pofabCompData = jsonData.Result;
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
        }

        return pofabCompData;
    },
    GetFabSubGridData: function (styleDetailId, itemId, colorId) {
        var objsubGrid = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/MerchBookings/GetNestedDataByStyleItemAndColorWise/" + styleDetailId + "/" + itemId + "/" + colorId ;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objsubGrid = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objsubGrid;
    }
};
var FabricCompositionSummaryHelper = {
    InitFabricCompositionSummary: function () {
        FabricCompositionSummaryHelper.GenerateFabricCompositionGrid();
        FabricCompositionSummaryHelper.FabCompositionGridChangeEvent();

        $("#cmbSupplier").change(function () {
            FabricCompositionSummaryHelper.LoadFabricCompositionGridData();
        });
    },
    GenerateFabricCompositionGrid: function () {
        $("#grdFabricComposition").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "check_row", title: "", width: 10, filterable: false, sortable: false, template: '#= FabricCompositionSummaryHelper.CheckedData(data) #', headerTemplate: "<input type='checkbox' id='checkAll'/>" },
                { field: "BookingDetailId", hidden: true, width: 20 },
                { field: "BookingId", hidden: true, width: 20 },
                { field: "StyleDetailId", hidden: true, width: 20 },
                { field: "StyleNo", title: "Style No", width: 20 },
                { field: "ItemName", title: "Item Name", width: 20 },
                { field: "ColorId", hidden: true, width: 20 },
                { field: "ColorName", title: "Color Name", width: 20 },
                { field: "FabricCompositionId", hidden: true },
                { field: "CompositionName", title: "Composition", width: 20 },
                { field: "FabricCode", title: "Item Ref.", width: 20 },
                { field: "Consumption", title: "Consumption", width: 20 },
                { field: "OrderQty", title: "Gmt. Order Qty", width: 20 },
                { field: "TotalReqQty", title: "Total Req Qty", width: 20 },
                { field: "BalanceQty", title: "Balance Qty", width: 20 },
                { field: "BookQty", title: "Prev Book Qty", width: 20 },
                { field: "PrevExcessPercent", title: "Prev Ex (%)", width: 20 },
                { field: "BookingPercent", title: "Prev Book (%)", width: 20 },
                { field: "ExcessPercentObj", title: "Excess (%)", width: 20, editor: FabricCompositionSummaryHelper.ExcessDropDownEditor, template: "#=ExcessPercentObj.ExcessPercent1#" },
                { field: "NewBookingPercent", title: "Booking (%)", width: 20 },
                { field: "NewBookQty", title: "Book Qty", width: 20 },
                { field: "Rate", title: "Rate", width: 20 },
                { field: "BookingValue", title: "Booking Value", width: 20 },
                { field: "ItemId", title: "ItemId", hidden: true, width: 20 },
                { field: "CmnUoms", title: "Unit", width: 20, editor: FabricCompositionSummaryHelper.UnitDropDownEditor, template: "#=CmnUoms.UOMName#" }
                //{
                //    field: "Action", title: "Edit", filterable: false, width: 10, command: [{
                //        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: FabricCompositionSummaryHelper.ClickEventForDeleteButton
                //    }]
                //}
            ],
            // reorderable: true,
            editable: true,
            selectable: "row",
            navigatable: true,
           // detailInit: FabricCompositionSummaryHelper.detailInit,
            dataBound: function (e) {
                var rows = e.sender.content.find('tr');
                var bookingPercentIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "NewBookingPercent" + "]").index();
                var excessPercentIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ExcessPercentObj" + "]").index();
                //var consumptionIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "Consumption" + "]").index();
                var unitIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "CmnUoms" + "]").index();
                var bookingQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "NewBookQty" + "]").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdFabricComposition thead tr");
                    if (!dataItem.name) {
                       
                        tableHeadRow.find('th:eq(' + excessPercentIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + bookingPercentIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + unitIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + bookingQtyIndex + ')').addClass('editable');

                        $(row).children('td:eq(' + excessPercentIndex + ')').addClass('editable-cell');
                        $(row).children('td:eq(' + bookingPercentIndex + ')').addClass('editable-cell');
                        $(row).children('td:eq(' + unitIndex + ')').addClass('editable-cell');
                        $(row).children('td:eq(' + bookingQtyIndex + ')').addClass('editable-cell');

                        //var units = dataItem.get("ExcessPercentObj");
                        //var cell = row.children().eq(columnIndex);
                        //cell.addClass(FabricCompositionSummaryHelper.getColorClass(units));

                    } else {
                        //$(row).children('td:eq(' + bookingPercentIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + excessPercentIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + bookingPercentIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + unitIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + bookingQtyIndex + ')').addClass('non-editable');
                    }
                });
            },


        });
    },
    getColorClass(units) {
        //if (units < 5) {
        //    return "critical";
        //} else if (units < 10) {
        //    return "warning";
        //} else {
        //    return "ok";
        //}

        return "editable";
    },
    CheckedData: function (data) {
        if (gbSelectiveArray.length > 0) {
            var result = gbSelectiveArray.filter(function (obj) {
                return obj.StyleDetailId===data.StyleDetailId && obj.ItemId === data.ItemId && obj.FabricCompositionId === data.FabricCompositionId && obj.ItemColorId === data.ItemColorId;
            });
            if (result.length > 0) {
                return '<input id="check_row" class="check_row" type="checkbox" checked="checked"/>';
            }
            else {
                if (data.BookingId > 0) {
                    gbSelectiveArray.push(data);
                    return '<input id="check_row" class="check_row" type="checkbox" checked="checked"/>';
                } else {
                    return '<input id="check_row" class="check_row" type="checkbox"/>';
                }
            }
        }
        else {
            if (data.BookingId > 0) {
                gbSelectiveArray.push(data);
                return '<input id="check_row" class="check_row" type="checkbox" checked="checked"/>';
            } else {
                return '<input id="check_row" class="check_row" type="checkbox"/>';
            }
        }
    },

    FabCompositionGridChangeEvent: function () {
        $("#grdFabricComposition").on("click", ".check_row", function (e) {
            var $cb = $(this);
            var gridSummary = $("#grdFabricComposition").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            gridSummary.select(tr);
            var selectedItem = gridSummary.dataItem(gridSummary.select());
            var dataItem = gridSummary.dataItem($(this).closest('tr'));
            if ($cb.is(":checked")) {
                if (selectedItem != null) {
                    gbSelectiveArray.push(selectedItem);
                }
            } else {
                for (var j = 0; j < gbSelectiveArray.length; j++) {
                    if (gbSelectiveArray[j].ItemId == dataItem.ItemId) {
                        gbSelectiveArray.splice(j, 1);
                        break;
                    }
                }
            }
        });//Indivisual row selection

        $('#grdFabricComposition').on('change', '#checkAll', function (e) {
            gbSelectiveArray = [];
            var gridSummary = $("#grdFabricComposition").data("kendoGrid");
            var selectAll = document.getElementById("checkAll");
            if (selectAll.checked == true) {
                $("#grdFabricComposition tbody input:checkbox").prop("checked", this.checked);
                $("#grdFabricComposition table tr").addClass('k-state-selected');
                var gridData = gridSummary.dataSource.data();
                for (var i = 0; i < gridData.length; i++) {
                    var obj = gridData[i];
                    gbSelectiveArray.push(obj);
                }
            }
            else {
                $("#grdFabricComposition tbody input:checkbox").prop("checked", false);
                $("#grdFabricComposition table tr").removeClass('k-state-selected');
                gbSelectiveArray = [];
            }
        });// All Row Selection 

    },

    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var grid = $("#grdStyleSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < gbStyleList.length; i++) {
                if (gbStyleList[i].StyleDetailId == selectedItem.StyleDetailId) {
                    gbStyleList.splice(i, 1);
                    break;
                }
            }
        }
    },

    LoadFabricCompositionGridData: function () {
        debugger;
        var supplierId = $("#cmbSupplier").data("kendoComboBox").value();

        var styleIds = gbStyleList.map(x => x.StyleDetailId);
        var fabCompGrid = $("#grdFabricComposition").data("kendoGrid");
        var fabCompData = FabricCompositionSummaryManager.GetFabricCompositionData(styleIds, supplierId);

        if (fabCompData != null) {
            fabCompData.map(x => x.ExcessPercentObj = {
                ExcessPercent: x.ExcessPercentObj.ExcessPercent == null ? 0 : x.ExcessPercentObj.ExcessPercent,
                ExcessPercent1: x.ExcessPercentObj.ExcessPercent1 == null ? "--Select--" : x.ExcessPercentObj.ExcessPercent1 + "%"
            });

            fabCompData.map(x=> x.CmnUoms = {
                UOMId: x.CmnUoms.UOMId == null ? AjaxManager.DefaultGuidId() : x.CmnUoms.UOMId,
                UOMName: x.CmnUoms.UOMName == null ? "--Select--" : x.CmnUoms.UOMName
            });
        }
       
        var gridDataSource = new kendo.data.DataSource({
            data: fabCompData,
            schema: {
                model: {
                    fields: {
                        check_row: {
                            editable: false
                        },
                        StyleNo: { editable: false },
                        ItemName: { editable: false },
                        CompositionName: { editable: false },
                        OrderQty: { editable: false },
                        ColorName: { editable: false },
                        TotalReqQty: { editable: false },
                        PrevTotalReqQty: { editable: false },
                        BookingPercentage: { editable: false },
                        Rate: { editable: false },
                        BookingValue: { editable: false },
                        BookingPercent: { editable: false },
                        BalanceQty: { editable: false },
                        PrevExcessPercent: { editable: false },
                        FabricCode: { editable: false },
                        Consumption: { editable: false, type: "number", validation: { min: 0 } },
                        NewBookingPercent: { editable: true, type: "number", validation: { min: 0 } },
                        NewBookQty: { editable: true, type: "number", validation: { min: 0 } },
                        BookQty: { editable: false },
                        BookingDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #'
                        },
                        CmnUoms: {
                            defaultValue: { UOMId: AjaxManager.DefaultGuidId(), UOMName: "---Select---" }
                        },
                        ExcessPercentObj: {
                            defaultValue: { ExcessPercent: 0, ExcessPercent1: "---Select---" }
                        },

                    }
                }
            }
        });

        fabCompGrid.setDataSource(gridDataSource);

        fabCompGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (obj.ExcessPercentObj === null) {
                    e.items[0].ExcessPercentObj = {
                        ExcessPercent: 0, ExcessPercent1: "--Select--"
                    }
                }
                if (e.field === "ExcessPercentObj" || e.field === "NewBookingPercent") {
                    e.items[0].NewBookQty = ((kendo.parseFloat(obj.TotalReqQty) * (kendo.parseFloat(obj.NewBookingPercent) + kendo.parseFloat(obj.ExcessPercentObj.ExcessPercent))) / 100).toFixed(4);
                    e.items[0].BookingValue = (kendo.parseFloat(obj.NewBookQty) * kendo.parseFloat(obj.Rate)).toFixed(4);
                    fabCompGrid.refresh();
                }
                if (e.field === "NewBookQty") {
                    e.items[0].NewBookingPercent = (((kendo.parseFloat(obj.NewBookQty) / kendo.parseFloat(obj.TotalReqQty)) * 100) - kendo.parseFloat(obj.ExcessPercentObj.ExcessPercent)).toFixed(4);
                    e.items[0].BookingValue = (kendo.parseFloat(obj.NewBookQty) * kendo.parseFloat(obj.Rate)).toFixed(4);
                    fabCompGrid.refresh();
                }
            }
        });

    },

    detailInit: function (e) {
        $("<div/>").appendTo(e.detailCell).kendoGrid({
            dataSource: FabricCompositionSummaryHelper.GenerateFabSubGridDataSource(e.data),
            scrollable: false,
            sortable: false,
            pageable: false,
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "ItemName", title: "Item Name", width: 20 },
                { field: "ColorName", title: "Color Name", width: 20 },
               // { field: "OrderQty", title: "Order Qty", width: 20 },
                { field: "TotalReqQty", title: "Total Req Qty", width: 20 },
                { field: "BalanceQty", title: "Balance Qty", width: 20 },
                { field: "BookQty", title: "Prev Book Qty", width: 20 },
                { field: "ExcessPercent", title: "Prev Excess (%)", width: 20 },
                { field: "BookingPercent", title: "Prev Book (%)", width: 20 },
                { field: "BookingValue", title: "Booking Value", width: 20 }
            ]
        });
    },

    GenerateFabSubGridDataSource: function (obj) {
        debugger;
        var data = FabricCompositionSummaryManager.GetFabSubGridData(obj.StyleDetailId, obj.ItemId, obj.ColorId);
        var gridDataSource = new kendo.data.DataSource({
            data: data,
           // aggregate: [{ field: "Rate", aggregate: "average" }, { field: "ItemQty", aggregate: "sum" }, { field: "Value", aggregate: "sum" }],
            schema: {
                model: {
                    BuyerCostingFabTrimsId: "BuyerCostingFabTrimsId",
                    fields: {
                        GmtColorName: { editable: false },
                        GmtSizeName: { editable: false },
                        ItemColorName: { editable: false },
                        ItemSizeName: { editable: false },
                        GmtQty: { editable: false },
                        Consumption: { editable: false, type: "number" },
                        ExcessPercent: { editable: true, type: "number" },
                        ItemQty: { editable: false, type: "number" },
                        Rate: { editable: true, type: "number" },
                        Value: { editable: false },
                        ItemColor: {
                            defaultValue: { ColorId: AjaxManager.DefaultGuidId(), ColorName: "---Select---" }
                        },
                        ItemSize: {
                            defaultValue: { SizeId: AjaxManager.DefaultGuidId(), SizeName: "---Select---" }
                        }
                    }
                }
            }
        });
        return gridDataSource;
    },

    UnitDropDownEditor: function (container, options) {
        var data = MerchantManager.GetUoM();
        $('<input data-text-field="UOMName" data-value-field="UOMId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                optionLabel: '--Select--',
                dataSource: data,
                placeholder: "--Select--",
                index: 0
            });
    },
    ExcessDropDownEditor: function (container, options) {
        var data = MerchantManager.LoadExccessPercentData();
        $('<input data-text-field="ExcessPercent1" data-value-field="ExcessPercent" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                optionLabel: '--Select--',
                dataSource: data,
                placeholder: "--Select--",
                index: 0
            });
    },




};