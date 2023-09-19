var SearchSummaryManager = {
    gridDataSource: function (search) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/Styles/GetAllSearchGridData/?searchkey=' + $.trim(search),
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    cache: false,
                    async: false
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            batch: true,
            schema: {
                model: {
                    id: "StyleId",
                    fields: {
                        styleId: { editable: false },
                        styleNo: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
    ListPOHistoryDataSource: function (Poid) {
        var listPOHistoryDataSource = ApiManager.GetList(_baseUrl + "/api/PurchaseOrders/GetPOHistory/" + Poid);
        return listPOHistoryDataSource;
    },
    ListPOMasterDataSource: function (Poid) {
        var listPoMasterDataSource = ApiManager.GetList(_baseUrl + "/api/PurchaseOrders/GetPOMaster/" + Poid);
        return listPoMasterDataSource;
    },
    ListStyleHistoryDataSource: function (styleId) {
        debugger;
        var listStyleDataSource = ApiManager.GetList(_baseUrl + "/api/Styles/GetStyleListById/" + styleId);
        return listStyleDataSource;
    },
    ListColorSizeDataSource: function (Poid) {
        debugger;
        var listPoColorSizeDataSource = ApiManager.GetList(_baseUrl + "/api/PurchaseOrders/GetPOColorSizeBreakDown/" + Poid);
        return listPoColorSizeDataSource;
    },
    ListSCDataSource: function (Poid) {
        var listSCDataSource = ApiManager.GetList(_baseUrl + "/api/ComSalesContract/GetSCByPOId/" + Poid);
        return listSCDataSource;
    }
};

var SearchSummaryHelper = {
    InitSearchSummary: function () {
        SearchSummaryHelper.InitModalList();
        SearchSummaryHelper.GenerateSearchGrid();
        SearchSummaryHelper.LoadDataSource();
        $('#search').on('input', function (e) {
            SearchSummaryHelper.LoadDataSource();
        });
    },
    GenerateSearchGrid: function () {
        $("#gridSearchSummary").kendoGrid({
            dataSource: [],
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: [
                { field: "StyleId", hidden: true },
                //{ field: "CreatedAt", hidden: true, template: '#= kendo.toString(kendo.parseDate(CreatedAt), "dd-MMM-yyyy") #' },
                { field: "StyleNo", title: "Style No", sortable: true, template: '<a href="javascript:void(0)" style="cursor: pointer; text-decoration: underline; color: blue; " title="Click for previous records" class="style-modal">#:StyleNo#</a>' },
                { field: "PONo", title: "PO No", sortable: true, template: '<a href="javascript:void(0)" style="cursor: pointer; text-decoration: underline; color: blue; " title="Click for previous records" class="po-modal">#:PONo==null?"":PONo#</a>' },
                { field: "StyleStatusName", title: "Status", sortable: true },
                { field: "ProductName", title: "Product Name", sortable: true },
                { field: "ProductTypeName", title: "Product Type", sortable: true },
                { field: "BuyerName", title: "Buyer", sortable: true },
                { field: "BrandName", title: "Brand", sortable: true },
                { field: "DepartmentName", title: "Department", sortable: true },
                { field: "AgentName", title: "Agent", sortable: true },
                //{
                //    command: [{
                //        name: "edit", text: "View", iconClass: "k-icon k-i-eye", className: "k-success", click: SearchSummaryHelper.ClickEventForEditButton
                //    }], title: "Action &nbsp;"
                //}
            ],
            editable: "popup",
            selectable: "row",
            navigatable: true,
            dataBound: function () {
            }
        });
        $("#gridSearchSummary").on("dblclick", "a.style-modal", function () {
            var gview = $("#gridSearchSummary").data("kendoGrid");
            var selectedItem = gview.dataItem($(this).closest("tr"));
            if (selectedItem != null) {
                //SearchSummaryHelper.LoadStyleHistorySelectedItems(selectedItem.StyleId);
                //$("#divStyleModal").data("kendoWindow").open().center();
                GlobalSearchDetailsHelper.ShowDetail();
                GlobalSearchDetailsHelper.FillStyleForm(selectedItem, true);
            }
        });
        $("#gridSearchSummary").on("dblclick", "a.po-modal", function () {
            var gview = $("#gridSearchSummary").data("kendoGrid");
            var selectedItem = gview.dataItem($(this).closest("tr"));
            if (selectedItem != null) {
                SearchSummaryHelper.LoadPOMasterSelectedItems(selectedItem.POId);
                SearchSummaryHelper.LoadPOHistorySelectedItems(selectedItem.POId);
                //SearchSummaryHelper.LoadPOColorSizeSelectedItems(selectedItem.POId);
                SearchSummaryHelper.LoadSalesContractSelectedItems(selectedItem.POId);
                $("#divPOModal").data("kendoWindow").open().center();
            }
        });

        $("#gridPOMaster").on("dblclick", "a.pocs-modal", function () {
            var gview = $("#gridPOMaster").data("kendoGrid");
            var selectedItem = gview.dataItem($(this).closest("tr"));
            if (selectedItem != null) {
                debugger;
                //SearchSummaryHelper.LoadPOMasterSelectedItems(selectedItem.POId);
                //SearchSummaryHelper.LoadPOHistorySelectedItems(selectedItem.POId);
                SearchSummaryHelper.LoadPOColorSizeSelectedItems(selectedItem.Poid);
                //SearchSummaryHelper.LoadSalesContractSelectedItems(selectedItem.POId);
                $("#divPOColorSizeModal").data("kendoWindow").open().center();
            }
        });
    },
    LoadDataSource: function () {
        var search = $("#search").val();
        var grid = $("#gridSearchSummary").data("kendoGrid");
        var data = SearchSummaryManager.gridDataSource(search);
        grid.setDataSource(data);
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#gridSearchSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            console.log(selectedItem);
            GlobalSearchDetailsHelper.ShowDetail();
            GlobalSearchDetailsHelper.FillStyleForm(selectedItem, true);
        }
    },

    InitModalList() {
        $("#divStyleModal").kendoWindow({
            title: "Style Details",
            resizeable: true,
            scrollable: false,
            width: "80%",
            actions: ["Close"],
            modal: true,
            animation: {
                close: {
                    effects: "fade:out"
                },
            }
        });
        $("#divPOColorSizeModal").kendoWindow({
            title: "PO Color Size Details",
            resizeable: true,
            scrollable: false,
            width: "80%",
            actions: ["Close"],
            modal: true,
            animation: {
                close: {
                    effects: "fade:out"
                },
            }
        });
        $("#gridStyleHistory").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: false,
            sortable: false,
            columns: [
                { field: "StyleId", hidden: true },
                { field: "StyleNo", title: "Style No", sortable: true },
                { field: "ProtoNo", title: "Proto No", sortable: true },
                { field: "ProductName", title: "Product Name", sortable: true },
                { field: "ProductTypeName", title: "Product Type", sortable: true },
                { field: "BuyerName", title: "Buyer", sortable: true },
                { field: "BrandName", title: "Brand", sortable: true },
                { field: "DepartmentName", title: "Department", sortable: true },
                { field: "AgentName", title: "Agent", sortable: true },
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {

            },
            dataBinding: function (e) {

            }
        });

        $("#btnStyleModalClose").click(function () {
            $("#divStyleModal").data("kendoWindow").close();
        });
        $("#btnPocsModalClose").click(function () {
            $("#divPOColorSizeModal").data("kendoWindow").close();
        });
        $("#divPOModal").kendoWindow({
            title: "Purchase Order Details",
            resizeable: true,
            scrollable: false,
            width: "80%",
            actions: ["Close"],
            modal: true,
            animation: {
                close: {
                    effects: "fade:out"
                },
            }
        });
        $("#gridPOMaster").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: false,
            sortable: false,
            columns: [
                { field: "Poid", hidden: true },
                //{ field: "Pono", title: "PO No", sortable: true },
                { field: "Pono", title: "PO No", sortable: true, template: '<a href="javascript:void(0)" style="cursor: pointer; text-decoration: underline; color: blue; " title="Click for PO Color Size Breakdown Records" class="pocs-modal">#:Pono==null?"":Pono#</a>' },
                { field: "StatusName", title: "PO Type", sortable: true },
                { field: "CountryName", title: "Ship Country", sortable: true },
                { field: "ShipmentDate", title: "Shipment Date", sortable: true, template: '#=kendo.toString(ShipmentDate==null?"":ShipmentDate,"dd-MMM-yyyy")#' },
                { field: "ReceivedDate", title: "Received Date", sortable: true, template: '#=kendo.toString(ReceivedDate==null?"":ReceivedDate,"dd-MMM-yyyy")#' },
                { field: "LeadTimeName", title: "LeadTime", sortable: true },
                { field: "ModeName", title: "Shipment Mode", sortable: true },
                { field: "CutOffDate", title: "CutOff Date", sortable: true, template: '#=kendo.toString(CutOffDate==null?"":CutOffDate,"dd-MMM-yyyy")#' },
                { field: "OrderQty", title: "OrderQty", sortable: true },
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {

            },
            dataBinding: function (e) {

            }
        });
        $("#gridPOHistory").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: false,
            sortable: false,
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
            dataBound: function (e) {

            },
            dataBinding: function (e) {

            }
        });
        $("#gridPOColorSize").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: false,
            sortable: false,
            columns: [
                { field: "PobreakdownId", hidden: true },
                { field: "Pono", title: "PO No", sortable: true, footerTemplate: "Total PO : <span id='TotalPOQty'></span>" },
                { field: "ColorName", title: "Color", sortable: true, },
                { field: "SizeName", title: "Size", sortable: true },
                { field: "Quantity", title: "Quantity", sortable: true, footerTemplate: "<span id='allQty'></span>" }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {

            },
            dataBinding: function (e) {

            }
        });
        $("#gridSalesContract").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: false,
            sortable: false,
            columns: [




                { field: "Scid", hidden: true },
                { field: "ContractId", title: "Contract ID", sortable: true },
                { field: "Scno", title: "Contract No", sortable: true },
                { field: "Scdate", title: "SC Date", sortable: true, template: '#=kendo.toString(Scdate==null?"":Scdate,"dd-MMM-yyyy")#' },
                { field: "BuyerName", title: "Buyer", sortable: true },
                { field: "OpenBankName", title: "Open Bank", sortable: true },
                { field: "LienBankName", title: "Lien Bank", sortable: true },
                { field: "RcvThroughBank", title: "Rcv Through", sortable: true },
                { field: "BeneficiaryName", title: "Beneficiary", sortable: true },
                { field: "SCTypeName", title: "SC Type", sortable: true },
                { field: "Scvalue", title: "SC Value", sortable: true }
                //{ field: "Scid", hidden: true },
                //{ field: "Scno", title: "SC No", sortable: true },
                //{ field: "ContractId", title: "Contract ID", sortable: true },
                //{ field: "Scdate", title: "SC Date", sortable: true, template: '#=kendo.toString(Scdate==null?"":Scdate,"dd-MMM-yyyy")#' },
                //{ field: "Pono", title: "PO No", sortable: true },
                //{ field: "ReceivedDate", title: "Received Date", sortable: true, template: '#=kendo.toString(ReceivedDate==null?"":ReceivedDate,"dd-MMM-yyyy")#' },
                //{ field: "ShipmentDate", title: "Shipment Date", sortable: true, template: '#=kendo.toString(ShipmentDate==null?"":ShipmentDate,"dd-MMM-yyyy")#' },
                //{ field: "CutOffDate", title: "Cut Off Date", sortable: true, template: '#=kendo.toString(CutOffDate==null?"":CutOffDate,"dd-MMM-yyyy")#' },
                //{ field: "OrderQty", title: "Order Qty", sortable: true },
                //{ field: "OrderValue", title: "Order Value", sortable: true },
                //{ field: "Beneficiary", title: "Beneficiary", sortable: true },
                //{ field: "StyleNo", title: "Style No", sortable: true },
                //{ field: "CreatedAt", title: "Po Date", sortable: true, template: '#=kendo.toString(CreatedAt==null?"":CreatedAt,"dd-MMM-yyyy")#' }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {

            },
            dataBinding: function (e) {

            }
        });
        $("#btnPOModalClose").click(function () {
            $("#divPOModal").data("kendoWindow").close();
        });
    },
    LoadStyleHistorySelectedItems(slist) {
        debugger;
        var lists = $("#gridStyleHistory").data("kendoGrid");
        var data = SearchSummaryManager.ListStyleHistoryDataSource(slist);
        lists.setDataSource(data);
    },
    LoadPOMasterSelectedItems(pomlist) {
        var lists = $("#gridPOMaster").data("kendoGrid");
        var poMasterData = SearchSummaryManager.ListPOMasterDataSource(pomlist);
        var gridDataSource = new kendo.data.DataSource({
            data: poMasterData,
            /*aggregate: [{ field: "ProjectedQty", aggregate: "sum" }, { field: "ConfirmQty", aggregate: "sum" }, { field: "DPOQty", aggregate: "sum" }],*/
            schema: {
                model: {
                    fields: {
                        ShipmentDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        ReceivedDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        CutOffDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                    }
                }
            }
        });
        lists.setDataSource(gridDataSource);
    },
    LoadPOHistorySelectedItems(polist) {
        var lists = $("#gridPOHistory").data("kendoGrid");
        var poHistoryData = SearchSummaryManager.ListPOHistoryDataSource(polist);
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
        lists.setDataSource(gridDataSource);
        SearchSummaryHelper.CalculatePOQty(gridDataSource);
    },
    LoadPOColorSizeSelectedItems(poCSlist) {
        debugger;

        var lists = $("#gridPOColorSize").data("kendoGrid");
        var poColorSizeData = SearchSummaryManager.ListColorSizeDataSource(poCSlist);
        var gridDataSource = new kendo.data.DataSource({
            data: poColorSizeData,
            aggregate: [{ field: "Quantity", aggregate: "sum" }],
            schema: {
                model: {
                }
            }
        });
        lists.setDataSource(gridDataSource);
        SearchSummaryHelper.CalculateColorSizeQty(gridDataSource);

        //var lists = $("#gridPOColorSize").data("kendoGrid");
        //var data = SearchSummaryManager.ListColorSizeDataSource(poCSlist);
        //lists.setDataSource(data);
    },
    LoadSalesContractSelectedItems(poSclist) {
        var lists = $("#gridSalesContract").data("kendoGrid");
        var scData = SearchSummaryManager.ListSCDataSource(poSclist);
        var gridDataSource = new kendo.data.DataSource({
            data: scData,
            schema: {
                model: {
                    fields: {
                        Scdate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        //CreatedAt: {
                        //    type: "date",
                        //    template: '#= kendo.toString("dd-MMM-yyyy") #',
                        //    editable: false
                        //},
                        //ShipmentDate: {
                        //    type: "date",
                        //    template: '#= kendo.toString("dd-MMM-yyyy") #',
                        //    editable: false
                        //},
                        //ReceivedDate: {
                        //    type: "date",
                        //    template: '#= kendo.toString("dd-MMM-yyyy") #',
                        //    editable: false
                        //},
                        //CutOffDate: {
                        //    type: "date",
                        //    template: '#= kendo.toString("dd-MMM-yyyy") #',
                        //    editable: false
                        //},
                    }
                }
            }
        });
        lists.setDataSource(gridDataSource);
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
    },
    CalculateColorSizeQty: function (gridDataSource) {
        var dataSource = gridDataSource;
        var allQty = 0;
        var poQty = 0;
        $.each(dataSource.data(), function (index, model) {
            allQty += model.get("Quantity");
            poQty += 1;
        });
        $("#allQty").html(allQty.toString());
        $("#TotalPOQty").html(poQty.toString());
    }
};