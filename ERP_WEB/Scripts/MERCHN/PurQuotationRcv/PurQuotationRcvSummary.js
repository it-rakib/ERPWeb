var PurQuotationRcvSummaryManager = {
    gridDataSource() {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/Quotations/GetQuotationGridList/' + CurrentUser.USERID,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    cache: false,
                    async: false
                },
                parameterMap(options) {
                    return JSON.stringify(options);
                }
            },
            batch: true,
            schema: {
                model: {
                    id: "QuotationId",
                    fields: {
                        StyleNo: { editable: false },
                        ItemDesc: { editable: false },
                        StatusName: { editable: false },
                        QuotationDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        RFQDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
    CloseQuotation(quotationId) {
        var obj = {
            QuotationId: quotationId,
            UserId: CurrentUser.USERID
        }
        var jsonParam = JSON.stringify(obj);
        var serviceUrl = _baseUrl + "/api/Quotations/ClosePurQuotation";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                $("#hdnQuotationId").val(jsonData.createOrUpdateQuotationDto.QuotationId);
                $("#gridPurQuotationRcvSummary").data("kendoGrid").dataSource.read();

                AjaxManager.MsgBox('success', 'center', 'Success:', jsonData.Message,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', jsonData.Message,
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
    },
};
var PurQuotationRcvSummaryHelper = {
    Init() {
        PurQuotationRcvSummaryHelper.GeneratePurQuotationRcvGrid();
    },
    GeneratePurQuotationRcvGrid() {
        $("#gridPurQuotationRcvSummary").kendoGrid({
            dataSource: PurQuotationRcvSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: [
                { field: "RFQNo", title: "RFQ", sortable: true, width: 20 },
                { field: "RFQDate", title: "RFQ Date", sortable: true, width: 20, template: '#= kendo.toString(kendo.parseDate(RFQDate==null?"":RFQDate), "yyyy/MM/dd") #'},
                { field: "DemandNo", title: "Demand No", sortable: true, width: 20 },
                { field: "DemandDate", title: "Demand Date", sortable: true, width: 20, template: '#= kendo.toString(kendo.parseDate(DemandDate==null?"":DemandDate), "yyyy/MM/dd") #' },
               // { field: "StatusName", title: "Status", sortable: true, width: 20 },
                { field: "RFQSupplierCount", title: "Quotation / RFQ", sortable: true, width: 20 },
                {
                    field: "Action", width: 20,
                    command: [
                        {
                            name: "Edit", text: "Add Quotation", iconClass: "k-icon k-i-plus", className: "k-success", click: PurQuotationRcvSummaryHelper.AddQuotation
                        },
                        {
                            name: "QuotationComplete", text: "Complete Quotation", iconClass: "k-icon k-i-check", className: "k-success", click: PurQuotationRcvSummaryHelper.QuotationComplete
                        }
                    ], title: "&nbsp;"
                }],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    AddQuotation(e) {
        PurQuotationRcvDetailHelper.ResetMasterInfo();
        _nRFQId = AjaxManager.DefaultGuidId();
        var grid1 = $("#gridSupplierPurQuotationRcvSummary").data("kendoGrid");
        grid1.setDataSource([]);
        $("#hdnQuotationId").val(AjaxManager.DefaultGuidId());
        $("#hdnQuotationDetailsId").val(AjaxManager.DefaultGuidId());

        e.preventDefault();
        var grid = $("#gridPurQuotationRcvSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            _sActionMode = "Add";
            _nRFQId = selectedItem.RFQId;
            PurQuotationRcvDetailHelper.SetInformations(selectedItem);
            PurQuotationRcvDetailManager.gridDataSourceSupplier();
            PurQuotationRcvDetailHelper.ShowDetail();
        }
    },
    QuotationComplete(e) {
        debugger;
        e.preventDefault();
        var grid = $("#gridPurQuotationRcvSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);

        if (selectedItem != null) {
            if (selectedItem.StatusId == "e4a675ef-28b2-40e6-ac37-1af566db74d5") {
                AjaxManager.MsgBox('error', 'center', 'Error1', "Already Completed",
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
                return false;
            }
        }

        AjaxManager.MsgBox('warning', 'center', 'Please Confirm', "Confirm Quotation Complete ?",
            [{
                addClass: 'btn btn-primary',
                text: 'Yes',
                onClick: function ($noty) {
                    $noty.close();
                    if (selectedItem != null) PurQuotationRcvSummaryManager.CloseQuotation(selectedItem.QuotationId);
                }
            },
            {
                addClass: 'btn',
                text: 'No',
                onClick: function ($noty) {
                    $noty.close();
                }
            }]);
    },
    //GridItemRemove(e) {
    //    e.preventDefault();
    //    var grid = $("#gridPurQuotationRcvSummary").data("kendoGrid");
    //    var tr = $(e.currentTarget).closest("tr");
    //    var selectedItem = this.dataItem(tr);
    //    grid.select(tr);
    //    if (selectedItem != null) {
    //        grid.dataSource.remove(selectedItem);
    //    }
    //},
};