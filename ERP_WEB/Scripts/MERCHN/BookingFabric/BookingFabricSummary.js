var BookingFabricSummaryManager = {
    gridDataSource: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            // groupPaging: true,
            // serverGrouping: true,
            // serverAggregates: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/MerchBookings/GetAllFabricBookingGrid',
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json;",
                    cache: false,
                    async: false
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            group: [
              {
                  field: "StyleNo",
                  dir: "asc", aggregates: [
                      { field: "BookQty", aggregate: "sum" },
                      { field: "Rate", aggregate: "average" },
                      { field: "BookingValue", aggregate: "sum" },
                      { field: "TotalReqQty", aggregate: "average" },
                      { field: "BookingPercent", aggregate: "sum" },
                      { field: "ExcessPercent", aggregate: "sum" }
                  ]
              },
              //{
              //    field: "BookingDate",
              //    dir: "asc", aggregates: [
              //        { field: "BookQty", aggregate: "sum" },
              //        { field: "Rate", aggregate: "average" },
              //        { field: "BookingValue", aggregate: "sum" },
              //        { field: "TotalReqQty", aggregate: "average" },
              //        { field: "BookingPercent", aggregate: "sum" },
              //        { field: "ExcessPercent", aggregate: "sum" }]
              //}, {
              //    field: "SupplierName",
              //    dir: "asc", aggregates: [
              //        { field: "BookQty", aggregate: "sum" },
              //        { field: "Rate", aggregate: "average" },
              //        { field: "BookingValue", aggregate: "sum" },
              //        { field: "TotalReqQty", aggregate: "average" },
              //        { field: "BookingPercent", aggregate: "sum" },
              //        { field: "ExcessPercent", aggregate: "sum" }
              //    ]
              //},
              //{
              //    field: "ItemName",
              //    dir: "asc", aggregates: [
              //        { field: "BookQty", aggregate: "sum" },
              //        { field: "Rate", aggregate: "average" },
              //        { field: "BookingValue", aggregate: "sum" },
              //        { field: "TotalReqQty", aggregate: "average" },
              //        { field: "BookingPercent", aggregate: "sum" },
              //        { field: "ExcessPercent", aggregate: "sum" }
              //    ]
              //}

            ],
            aggregate: [
                { field: "BookQty", aggregate: "sum" },
                { field: "Rate", aggregate: "average" },
                { field: "BookingValue", aggregate: "sum" },
                { field: "TotalReqQty", aggregate: "average" },
                { field: "BookingPercent", aggregate: "sum" },
                { field: "ExcessPercent", aggregate: "sum" }
            ],
            batch: true,
            schema: {
                model: {
                    id: "StyleId",
                    fields: {
                        styleId: { editable: false },
                        styleNo: { type: "string", validation: { required: true } },
                        BookingDate: {
                            type: "date",
                            editable: false
                        },
                        ETA: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        ETD: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                    }

                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
    gridDataSource2: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/MerchBookings/GetAllFabricBookingGrid',
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json;",
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
                        styleNo: { type: "string", validation: { required: true } },
                        BookingDate: {
                            type: "date",
                            editable: false
                        },
                        ETA: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        ETD: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                    }

                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
};

var BookingFabricSummaryHelper = {
    InitBookingFabricSummary: function () {
        BookingFabricSummaryHelper.GenerateBookingFabricGrid();
        // BookingFabricSummaryHelper.GenerateBookingFabricParentGrid();
        // BookingFabricSummaryHelper.LoadBookingFabricParentGrid();
    },
    GenerateBookingFabricGrid: function () {
        $("#grdBookingFabricSummary").kendoGrid({
            dataSource: BookingFabricSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            groupable: false,
            toolbar: ["search"],
            search: {
                fields: ["StyleNo"]
            },
            columns: [
                { field: "BookingId", hidden: true },
                { field: "BookingNo", title: "BookingNo", sortable: true, },
                //{ field: "BookingDate", title: "BookingDate", hidden: true, sortable: true, template: '#=kendo.toString(BookingDate==null?"":BookingDate,"dd-MMM-yyyy")#', groupHeaderTemplate: 'Booking Date: #=kendo.toString(data.value,"dd-MMM-yyyy")#' },
                { field: "BookingDate", title: "BookingDate", hidden: false, sortable: true, template: '#=kendo.toString(BookingDate==null?"":BookingDate,"dd-MMM-yyyy")#'},
                //{ field: "ETA", title: "ETA", sortable: true, template: '#=kendo.toString(ETA==null?"":ETA,"dd-MMM-yyyy")#' },
                //{ field: "ETD", title: "ETD", sortable: true, template: '#=kendo.toString(ETD==null?"":ETD,"dd-MMM-yyyy")#' },
                { field: "StyleNo", title: "StyleNo", hidden: true, sortable: true, groupHeaderTemplate: 'Style No: #=data.value #' },
                //{ field: "BuyerName", title: "BuyerName", sortable: true },
                //{ field: "BrandName", title: "BrandName", sortable: true },
                //{ field: "DepartmentName", title: "Department", sortable: true },
                //{ field: "SeasonName", title: "Season", sortable: true },
                //{ field: "Year", title: "Year", sortable: true },
                { field: "ItemName", title: "Item", sortable: true },
                { field: "ColorName", title: "Color", sortable: true },

                {
                    field: "UOMName", title: "Unit", sortable: true,
                    groupFooterTemplate: "#= kendo.toString(data.value,'dd-MMM-yyyy') # Total:"
                },
                {
                    field: "ExcessPercent", title: "Excess (%)", sortable: true,
                    aggregates: ["sum"],
                    groupFooterTemplate: "#=kendo.format('{0:N2}',sum)#%"
                },
                {
                    field: "BookingPercent", title: "Booking (%)", sortable: true, template: "#= BookingPercent#%",
                    aggregates: ["sum"],
                    groupFooterTemplate: "#=kendo.format('{0:N2}',sum)#%"
                },
                {
                    field: "TotalReqQty", title: "Total Req Qty", sortable: true,
                    aggregates: ["average"],
                    groupFooterTemplate: "#=kendo.format('{0:n2}',average)#"
                },
                {
                    field: "BookQty", title: "Book Qty", sortable: true,
                    aggregates: ["sum"],
                    // footerTemplate: "Total: #= kendo.format('{0:N0}',sum)#",
                    groupFooterTemplate: "#=kendo.format('{0:N2}',sum)#"
                },
                {
                    field: "Rate", title: "Rate", sortable: true, aggregates: ["average"],
                    groupFooterTemplate: "#=kendo.format('{0:N2}',average)#"
                },
                {
                    field: "BookingValue", title: "Value", sortable: true, aggregates: ["sum"],
                    groupFooterTemplate: "#=kendo.format('{0:N2}',sum)#"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },

    GenerateBookingFabricParentGrid: function () {
        $("#grdBookingFabricSummary2").kendoGrid({
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
                { field: "BookingId", hidden: true },
                { field: "BookingDate", title: "BookingDate", hidden: true, sortable: true },
                //{ field: "ETA", title: "ETA", sortable: true, template: '#=kendo.toString(ETA==null?"":ETA,"dd-MMM-yyyy")#' },
                //{ field: "ETD", title: "ETD", sortable: true, template: '#=kendo.toString(ETD==null?"":ETD,"dd-MMM-yyyy")#' },
                { field: "StyleNo", title: "StyleNo", hidden: true, sortable: true },
                //{ field: "BuyerName", title: "BuyerName", sortable: true },
                //{ field: "BrandName", title: "BrandName", sortable: true },
                //{ field: "DepartmentName", title: "Department", sortable: true },
                //{ field: "SeasonName", title: "Season", sortable: true },
                //{ field: "Year", title: "Year", sortable: true },
                //{ field: "ItemName", title: "ItemName", sortable: true },
                //{ field: "ColorName", title: "ColorName", sortable: true },
                { field: "BookingValue", title: "Value", sortable: true },
                { field: "UOMName", title: "Unit", sortable: true },
                { field: "ExcessPercent", title: "Excess (%)", sortable: true },
                { field: "BookingPercent", title: "Booking (%)", sortable: true },
                { field: "TotalReqQty", title: "Total Req Qty", sortable: true },
                {
                    field: "BookQty", title: "Book Qty", sortable: true
                },
                { field: "Rate", title: "Rate", sortable: true }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadBookingFabricParentGrid: function () {
        var grid = $("#grdBookingFabricSummary2").data("kendoGrid");
        var data = BookingFabricSummaryManager.gridDataSource2();


        grid.setDataSource(data);
        debugger;
        var dataList = data._data;
        var fabBookList = [];
        for (var i = 0; i < dataList.length; i++) {
            var paretData = dataList[i];
            var obj = new Object();
            obj.StyleNo = paretData.BookingId;
            obj.FabSuppList = BookingFabricSummaryHelper.CrateFabStyleList(obj.SupplierId, dataList);
            fabBookList.push(obj);
        }

        var bb = fabBookList;
    },
    CrateFabStyleList: function (suppId, data) {
        var fabSuppList = [];
        for (var i = 0; i < data.length; i++) {

        }

        return fabStyleList;
    }
};

