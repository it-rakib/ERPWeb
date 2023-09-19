var DemandDetailsManager = {
    SaveDemandInfo(statusId) {
        debugger;
        var msg = "";
        var validator = $("#divDemandDetails").kendoValidator().data("kendoValidator");
        if (validator.validate()) {
            if (DemandDetailsHelper.ValidateDemandForm()) {
                var obj = DemandDetailsHelper.GetObject(statusId);
                console.log(obj);
                var jsonParam = JSON.stringify(obj);
                if (obj.DemandDetails[0].StyleDetailId != null) {
                    var serviceUrl = _baseUrl + "/api/PurDemands/CreateOrUpdateDemand";
                    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                }
                else {
                    AjaxManager.MsgBox('warning', 'center', 'Required', "Please Select Style!",
                        [{
                            addClass: 'btn btn-primary', text: 'OK', onClick: function ($noty) {
                                $noty.close();
                                $("#txtInvoiceNo").focus();
                            }
                        }]);
                }

            }
            function onSuccess(jsonData) {
                if (obj.DemandId === AjaxManager.DefaultGuidId()) {
                    msg = jsonData.Message;
                } else {
                    msg = jsonData.Message;
                }
                if (jsonData.Success) {
                    $("#hdnDemandId").val(jsonData.createDemandDto.DemandId);
                    $("#txtDemandNo").val(jsonData.createDemandDto.DemandNo);
                    $("#grdDemandSummary").data("kendoGrid").dataSource.read();

                    AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                                $noty.close();
                            }
                        }]);
                    DemandDetailsHelper.ShowSummary();

                }
                else {
                    AjaxManager.MsgBox('error', 'center', 'Error1', msg,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                                $noty.close();
                            }
                        }]);
                }
            }
            function onFailed(error) {
                AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }

    },
    GetTrimsByStyleDetailId: function (styleDetailsList) {        
        var list = [];
        var jsonParam = JSON.stringify(styleDetailsList);
        var serviceUrl = _baseUrl + "/api/BOM/GetTrimsForDmndByStyleDetailIds";
        debugger;
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            list = jsonData;
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
        return list;
    },
};

var DemandDetailsHelper = {
    Init() {
        $(".hiddenId").val(AjaxManager.DefaultGuidId());
        DemandDetailsHelper.InitGrid();
        DemandDetailsHelper.ShowSummary();
        $("#pnlDemand").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        UtilityHelper.InitDatePicker("dtDemandDate");
        UtilityHelper.InitDatePicker("dtDueDate");
        MerchantHelper.GenerateStyleMultiColumnComboBox("cboStyleSearch");
        $("#cboStyleSearch").change(function () {
            debugger;
            var gridList = $("#grdDemandItems").data("kendoGrid").dataSource.data();
            var styleDetailId = $("#cboStyleSearch").data("kendoMultiColumnComboBox").value();
            if (styleDetailId.length == 0 || styleDetailId == AjaxManager.DefaultGuidId()) return;
            var objs = DemandDetailsManager.GetTrimsByStyleDetailId([styleDetailId]);
            if (UtilityHelper.HasError(objs)) return false;
            if (objs.Success) {
                objs = objs.Result;
                if (objs != null && objs.length > 0) {
                    objs = DemandDetailsHelper.SetOtherProperties(objs);
                    objs.map(x => {
                        var obj = gridList.find(y => y.StyleDetailId == x.StyleDetailId
                            && y.ItemId == x.ItemId
                            && y.ItemDesc == x.ItemDesc
                            && y.ItemSizeId == x.ItemSizeId
                            && y.ItemColorId == x.ItemColorId);
                        if (obj == null || typeof obj === "undefined") gridList.push(x);
                    });
                    DemandDetailsHelper.LoadDemandItemGrid(gridList);
                }
            }
        });
        DemandDetailsHelper.InitBtnEvents();       
    },
    LoadDemandItemGrid(list) {
        debugger;
        var gridDataSource = new kendo.data.DataSource({
            data: list,
            group: [
                {
                    field: "ItemName",
                    dir: "asc", aggregates: [
                        { field: "OrderQty", aggregate: "sum" },
                        { field: "TotalRequiredQty", aggregate: "sum" },
                        { field: "BalanceQty", aggregate: "sum" },
                        { field: "PrevDemandQty", aggregate: "sum" },
                        { field: "DemandQty", aggregate: "sum" }
                    ]
                },
            ],
            aggregate: [
                { field: "OrderQty", aggregate: "sum" },
                { field: "TotalRequiredQty", aggregate: "sum" },
                { field: "BalanceQty", aggregate: "sum" },
                { field: "PrevDemandQty", aggregate: "sum" },
                { field: "DemandQty", aggregate: "sum" }
            ],
            batch: true,
            //group: {
            //    field: "ItemName",
            //    dir: "asc",           },
            schema: {
                model: {
                    fields: {
                        StyleNo: { editable: false },
                        ItemName: { editable: false },
                        ItemDesc: { editable: false },
                        Consumption: { editable: false },
                        SizeName: { editable: false },
                        ItemSizeName: { editable: false },
                        ItemColorName: { editable: false },
                        OrderQty: { editable: false },
                        TotalRequiredQty: { editable: false },
                        BookingPercentage: { editable: false },
                        BalanceQty: { editable: false },
                        PrevDemandPer: { editable: false },
                        DemandPercent: {
                            editable: true, type: "number", validation: { min: 0 }, defaultValue: 100 },
                        PrevDemandQty: { editable: false },
                        DemandQty: { editable: true, type: "number", validation: { min: 0 } },
                        Rate: { editable: false },
                        CmnUoms: { editable: true },
                    }
                }
            }
        });
        var grdDemandItems = $("#grdDemandItems").data("kendoGrid");
        grdDemandItems.setDataSource(gridDataSource);
        DemandDetailsHelper.CalculateTotal();

        grdDemandItems.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "DemandQty") obj.DemandPercent = (((obj.DemandQty / obj.BalanceQty) * 100)).toFixed(2);
                else if (e.field === "DemandPercent") obj.DemandQty = ((obj.BalanceQty * obj.DemandPercent / 100)).toFixed(2);
                grdDemandItems.refresh();
                DemandDetailsHelper.CalculateTotal();
            }
        });
    },
    CalculateTotal() {
        var grdDemandItems = $("#grdDemandItems").data("kendoGrid");
        var gridItems = grdDemandItems.dataSource.data();
        var totalOrderQty = 0,
            totalReqQty = 0,
            totalBalance = 0,
            totalPrevDemandQty = 0,
            totalDemandQty = 0;
        gridItems.map(x => {
            totalOrderQty += isNaN(x.OrderQty) ? 0 : parseInt(x.OrderQty);
            totalReqQty += isNaN(x.TotalRequiredQty) ? 0 : parseInt(x.TotalRequiredQty);
            totalBalance += isNaN(x.BalanceQty) ? 0 : parseInt(x.BalanceQty);
            totalPrevDemandQty += isNaN(x.PrevDemandQty) ? 0 : parseInt(x.PrevDemandQty);
            totalDemandQty += isNaN(x.DemandQty)
                || x.DemandQty == null
                || typeof x.DemandQty === "undefined" ? 0 : parseInt(x.DemandQty);
        });
        $(".spnNumber").text("");

        $("#spnSumOrderQty").text(IkrHelper.KendoNumberFormat(totalOrderQty));
        $("#spnSumTotalRequiredQty").text(IkrHelper.KendoNumberFormat(totalReqQty));
        $("#spnSumBalanceQty").text(IkrHelper.KendoNumberFormat(totalBalance));
        $("#spnSumPrevDemandQty").text(IkrHelper.KendoNumberFormat(totalPrevDemandQty));
        $("#spnSumDemandQty").text(IkrHelper.KendoNumberFormat(totalDemandQty));
    },
    InitBtnEvents() {
        $("#txtSearchKey").keypress(function (event) {
            if (event.keyCode === 13) DemandDetailsHelper.LoadStyleCombo();
        });
        $("#btnSearchStyle").click(function () {
            DemandDetailsHelper.LoadStyleCombo();
        });
        $("#btnSaveSendToProcurement").click(function () {
            DemandDetailsManager.SaveDemandInfo("b4fb922a-ec21-4294-bf48-dd9983379615");
        });
        $("#btnSaveGenerated").click(function () {
            DemandDetailsManager.SaveDemandInfo("fcb65d38-eea2-4ed4-ae9a-371a63f23659");
        });
        $("#btnBack").click(function () {
            DemandDetailsHelper.ResetForm();
            DemandDetailsHelper.ShowSummary();
        });
        $("#btnAddNew").click(function () {
            DemandDetailsHelper.ResetForm();
            DemandDetailsHelper.ShowDetail();
        });
        //$('#expand').click(function (e) {
        //    var grid = $("#grdDemandItems").data("kendoGrid");
        //    $(".k-master-row").each(function (index) {
        //        grid.expandRow(this);
        //    });
        //})

        //$('#collapse').click(function (e) {
        //    var grid = $("#grdDemandItems").data("kendoGrid");
        //    $(".k-master-row").each(function (index) {
        //        grid.collapseRow(this);
        //    });
        //})
    },
    InitGrid() {
        $("#grdDemandItems").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: true,
            sortable: true,
            pageable: false,
            columns: [
                { field: "StyleNo", title: "Style No", width: 14 },
                { field: "ItemName", title: "Item Name", width: 14 },
                { field: "ItemDesc", title: "Item Desc", width: 14 },
                { field: "Consumption", title: "Consumption", width: 10 },
                { field: "ItemSizeName", title: "Item Size", width: 10 },
                { field: "ItemColorName", title: "Item Color", width: 10, groupFooterTemplate: "Total : " },
                /*{ field: "OrderQty", title: "Order Qty", width: 10, footerTemplate: "<span id='spnSumOrderQty' class='spnNumber'></span>", template: '#= kendo.toString(OrderQty, "n2")#' },*/
                {
                    field: "OrderQty", title: "Order Qty", width: 10,
                    aggregates: ["sum"],
                    groupFooterTemplate: "<span id='spnSumOrderQty' class='spnNumber'></span>",
                    groupFooterTemplate: "#=kendo.format('{0:N2}',sum)#"
                   // footerTemplate: "<span id='spnSumOrderQty' class='spnNumber'></span>",
                    //template: '#= kendo.toString(OrderQty, "n2")#'
                },
                //{ field: "TotalRequiredQty", title: "Req Item Qty", width: 10, footerTemplate: "<span id='spnSumTotalRequiredQty' class='spnNumber'></span>", template: '#= kendo.toString(TotalRequiredQty, "n2")#' },
                {
                    field: "TotalRequiredQty", title: "Req Item Qty", width: 10,
                    aggregates: ["sum"],
                    groupFooterTemplate: "<span id='spnSumTotalRequiredQty' class='spnNumber'></span>",
                    groupFooterTemplate: "#=kendo.format('{0:N2}',sum)#"
                },
                //{ field: "BalanceQty", title: "Balance Qty", width: 10, footerTemplate: "<span id='spnSumBalanceQty' class='spnNumber'></span>", template: '#= kendo.toString(BalanceQty, "n2")#' },
                {
                    field: "BalanceQty", title: "Balance Qty", width: 10,
                    aggregates: ["sum"],
                    groupFooterTemplate: "<span id='spnSumBalanceQty' class='spnNumber'></span>",
                    groupFooterTemplate: "#=kendo.format('{0:N2}',sum)#"
                },
                { field: "PrevDemandPer", title: "Prev Demand(%)", width: 10 },
                { field: "DemandPercent", title: "Demand (%)", width: 10 },
                //{ field: "PrevDemandQty", title: "Prev Demand", width: 10, footerTemplate: "<span id='spnSumPrevDemandQty' class='spnNumber'></span>" },
                {
                    field: "PrevDemandQty", title: "Prev Demand", width: 10,
                    aggregates: ["sum"],
                    groupFooterTemplate: "<span id='spnSumPrevDemandQty' class='spnNumber'></span>",
                    groupFooterTemplate: "#=kendo.format('{0:N2}',sum)#"
                },
                //{ field: "DemandQty", title: "Demand Qty", width: 10, footerTemplate: "<span id='spnSumDemandQty' class='spnNumber'></span>", template: '#= kendo.toString(DemandQty, "n2")#' },
                {
                    field: "DemandQty", title: "Demand Qty", width: 10,
                    aggregates: ["sum"],
                    groupFooterTemplate: "<span id='spnSumDemandQty' class='spnNumber'></span>",
                    groupFooterTemplate: "#=kendo.format('{0:N2}',sum)#"
                },
                { field: "Rate", title: "Avg Rate", width: 8 },
                { field: "CmnUoms", title: "Unit", width: 10, editor: DemandDetailsHelper.UnitDropDownEditor, template: "#=CmnUoms.UOMName#" },
                {
                    field: "Action", title: "Action", filterable: false, width: 10, command: [{
                        name: "delete1", text: "Remove", iconClass: "k-icon k-i-delete", className: "k-danger", click: DemandDetailsHelper.GridItemRemove
                    }]
                }],
            editable: true,
            selectable: "row",
            navigatable: true,
            mobile: true,
            resizable: true,
            footer: false,
            //groupable : false,
            groupable: {
                enabled: false,
                showFooter: false
            },
            //detailInit: detailInit,
            dataBound: function () {
                this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            dataBound: function (e) {
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
                var rows = e.sender.content.find('tr');
                var dqIndex = e.sender.wrapper.find(".k-grid-header [data-field='DemandQty']").index();
                var dpIndex = e.sender.wrapper.find(".k-grid-header [data-field='DemandPercent']").index();
                var uIndex = e.sender.wrapper.find(".k-grid-header [data-field='CmnUoms']").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdDemandItems thead tr");
                    debugger;
                    $(row).children('td:eq(' + dqIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + dpIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + uIndex + ')').addClass('editable-cell');

                    //if (!dataItem.name) {
                    if (!dataItem) {
                        tableHeadRow.find('th:eq(' + dqIndex + ')').removeClass('non-editable').addClass('editable');
                        tableHeadRow.find('th:eq(' + dpIndex + ')').removeClass('non-editable').addClass('editable');
                        tableHeadRow.find('th:eq(' + uIndex + ')').removeClass('non-editable').addClass('editable');
                    }
                    else {
                        tableHeadRow.find('th:eq(' + dqIndex + ')').removeClass('editable').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + dpIndex + ')').removeClass('editable').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + uIndex + ')').removeClass('editable').addClass('non-editable');
                    }
                    //debugger;
                    //var requiredQty = dataItem.get("TotalRequiredQty");
                    //var balanceQty = dataItem.get("BalanceQty");
                    //var row = e.sender.tbody.find("[data-uid='" + dataItem.uid + "']");
                    //var demandPercent = (((requiredQty / balanceQty) * 100)).toFixed(2);
                    //$("#grdDemandItems tbody").find("tr[data-uid='" + dataItem.uid + "'] td:eq(12)").text(requiredQty);
                    //$("#grdDemandItems tbody").find("tr[data-uid='" + dataItem.uid + "'] td:eq(10)").text(demandPercent);
                    //DemandDetailsHelper.CalculateTotal();

                });
            },
            dataBinding: function (e) {

            }
        });
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
    GridItemRemove(e) {
        e.preventDefault();
        var grid = $("#grdDemandItems").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) grid.dataSource.remove(selectedItem);
        DemandDetailsHelper.CalculateTotal();
    },
    ResetForm() {
        $("#txtSearchKey").val("");
        var cboStyleSearch = $("#cboStyleSearch").data("kendoMultiColumnComboBox");
        cboStyleSearch.value("");
        cboStyleSearch.setDataSource([]);
        cboStyleSearch.select(0);

        $("#hdnDemandId").val(AjaxManager.DefaultGuidId());
        $("#txtDemandNo").val("");
        $("#dtDemandDate").data("kendoDatePicker").value(kendo.parseDate(new Date(), "dd-MMM-yyyy"));
        $("#dtDueDate").data("kendoDatePicker").value(kendo.parseDate(new Date(), "dd-MMM-yyyy"));
        DemandDetailsHelper.LoadDemandItemGrid([]);
    },
    SetInformations(obj) {
        DemandDetailsHelper.ResetForm();

        $("#hdnDemandId").val(obj.DemandId);
        $("#txtDemandNo").val(obj.DemandNo);
        $("#dtDemandDate").data("kendoDatePicker").value(kendo.parseDate(obj.DemandDate, "dd-MMM-yyyy"));
        $("#dtDueDate").data("kendoDatePicker").value(kendo.parseDate(obj.DueDate, "dd-MMM-yyyy"));
        var gridList = ApiManager.GetList(_baseUrl + "/api/PurDemands/GetDemandDetailsByDemandId/" + obj.DemandId);
        gridList == null ? [] : gridList;
        DemandDetailsHelper.LoadDemandItemGrid(gridList);
        DemandDetailsHelper.ShowDetail();
    },
    ShowSummary() {
        $("#divDemandSummary").show();
        $("#divDemandDetails").hide();
    },
    ShowDetail() {
        $("#divDemandDetails").show();
        $("#divDemandSummary").hide();
    },
    LoadStyleCombo() {
        var searchKey = $("#txtSearchKey").val();
        if (searchKey !== "") {
            var data = MerchantManager.GetAllStyle(searchKey);
            var cboStyleSearch = $("#cboStyleSearch").data("kendoMultiColumnComboBox");
            cboStyleSearch.value("");
            if (data != null && data.length > 0) data.unshift(UtilityUnShift.GetUnshiftForStyleSearch());
            cboStyleSearch.setDataSource(data);
            cboStyleSearch.select(0);
        } else {
            AjaxManager.MsgBox('warning', 'center', 'Alert', "Please type some text to search style!",
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                        $noty.close();
                    }
                }]);
        }
    },
    GetObject(statusId) {
        var obj = {
            DemandId: $.trim($("#hdnDemandId").val()),
            DemandNo: $.trim($("#txtDemandNo").val()),
            DemandDate: $("#dtDemandDate").data("kendoDatePicker").value(),
            DueDate: $("#dtDueDate").data("kendoDatePicker").value(),
            StatusId: statusId,
            UserId: CurrentUser.USERID,
            DemandDetails: DemandDetailsHelper.GetDemandDetails()
        }
        return obj;
    },
    GetDemandDetails() {
        var demandDetails = [];
        var gridItems = $("#grdDemandItems").data("kendoGrid").dataSource.data();
        gridItems.map(x => {
            demandDetails.push({
                DemandDetailsId: x.DemandDetailsId !== "undefined"
                    && x.DemandDetailsId != null
                    && x.DemandDetailsId.length > 0 ? x.DemandDetailsId : AjaxManager.DefaultGuidId(),
                DemandId: $.trim($("#hdnDemandId").val()),
                StyleDetailId: x.StyleDetailId,
                ItemId: x.ItemId,
                ItemDesc: x.ItemDesc,
                ItemSizeId: x.ItemSizeId,
                ItemColorId: x.ItemColorId,
                DemandQty: x.DemandQty,
                UOMId: x.CmnUoms.UOMId,
                DemandPercent: x.DemandPercent
            });
        });
        return demandDetails;
    },
    SetOtherProperties(list) {
        list.map(x => {
            x["DemandQty"] = x["BalanceQty"];
            x["DemandPercent"] = 100;
        });
        return list;
    },
    ValidateDemandForm: function () {
        var res = true;
        var styleCombo = $("#cboStyleSearch").data("kendoMultiColumnComboBox");
        if (styleCombo.value() === "" || styleCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboStyleSearch", "error", "right", 1500, "Required Style");
            res = false;
        }
        //var search = $("#txtSearchKey").val();
        //if (search === "" || search === null) {
        //    AjaxManager.NotifyMsg("txtSearchKey", "error", "right", 1500, "Type here")
        //}
        return res;
    }
};