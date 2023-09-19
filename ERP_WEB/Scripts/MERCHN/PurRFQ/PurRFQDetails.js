var PurRFQDetailManager = {
    Save() {
        debugger;
        var obj = PurRFQDetailHelper.GetObject();
        var jsonParam = JSON.stringify(obj);
        var serviceUrl = _baseUrl + "/api/PurRFQ/CreateOrUpdateRFQ";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            var msg = "";
            if (obj.RFQId === AjaxManager.DefaultGuidId()) {
                msg = jsonData.Message;
            } else {
                msg = jsonData.Message;
            }
            if (jsonData.Success) {
                $("#hdnRFQId").val(jsonData.createOrUpdateRFQDto.RFQId);
                $("#txtRFQNo").val(jsonData.createOrUpdateRFQDto.RFQNo);
                $("#grdPurRFQSummary").data("kendoGrid").dataSource.read();

                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
                PurRFQDetailHelper.ShowSummary();
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
    },
    GetRFQDetailsByRFQId: function (RFQId) {
        var objRFQDetails = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/PurRFQ/GetRFQMasterDetailsByRFQId/" + $.trim(RFQId);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objRFQDetails = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        debugger;
        return objRFQDetails;
    },
    GetPurRfqSupplierByRfqId: function (RFQId) {
        var objRFQSuppliers = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/PurRfqSupplier/" + $.trim(RFQId);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objRFQSuppliers = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        debugger;
        return objRFQSuppliers;
    }
}

var PurRFQDetailHelper = {
    Init() {
        $("#pnlUl").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        UtilityHelper.InitDatePicker("dtRFQDate");
        PurRFQDetailHelper.InitGrid();
        PurRFQDetailHelper.InitBtnEvents();
    },
    InitBtnEvents() {
        $("#btnSave").click(function () {
            PurRFQDetailManager.Save();
        });
        $("#btnBack").click(function () {
            PurRFQDetailHelper.ResetForm();
            PurRFQDetailHelper.ShowSummary();
        });
        $("#btnAddNew").click(function () {
            PurRFQDetailHelper.ResetForm();
            PurRFQDetailHelper.ShowDetail();
        });
    },
    ResetForm() {
        $("#hdnRFQId").val(AjaxManager.DefaultGuidId());
        $("#txtRFQNo").val("");
        $("#dtRFQDate").data("kendoDatePicker").value(kendo.parseDate(new Date(), "dd-MMM-yyyy"));
        PurRFQDetailHelper.ResetSuppliers();
        PurRFQDetailHelper.LoadDemandGrid();
        PurRFQDetailHelper.LoadGridSelectedItems([]);
    },
    LoadDemandGrid() {
        var demands = ApiManager.GetList(_baseUrl + "/api/PurRFQ/GetPendingDemandList/" + CurrentUser.USERID);
        PurRFQDetailHelper.LoadGridDemandItems(demands);
    },
    InitGrid() {
        $("#gridDemandItems").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            pageable: {
                refresh: false,
                serverPaging: false,
                serverFiltering: false,
                serverSorting: false
            },
            dataSource: [],
            groupable: true,
            filterable: false,
            sortable: false,
            toolbar: ["search"],
            search: {
                fields: ["DemandNo"]
            },
            resizable: true,
            reorderable: true,
            columns: [
                { field: "DemandNo", title: "Demand No", width: 40, sortable: true },
                { field: "DemandDate", title: "Demand Date", width: 40, sortable: true, template: '#=kendo.toString(DemandDate==null?"":DemandDate,"dd-MMM-yyyy")#' },
                { field: "DueDate", title: "Due Date", width: 40, sortable: true, template: '#=kendo.toString(DueDate==null?"":DueDate,"dd-MMM-yyyy")#' },
                { field: "ItemName", title: "Item", width: 40, sortable: true },
                { field: "ItemDesc", title: "Item Desc", width: 40, sortable: true },
                { field: "DemandQty", title: "DemandQty", width: 40, sortable: true },
                { field: "BuyerName", title: "Buyer", width: 40, sortable: true },
                {
                    field: "Action", title: "Action", filterable: false, width: 60, command: [{
                        name: "addToList", text: "Add to list", iconClass: "k-icon k-i-arrow-right", className: "k-danger", click: PurRFQDetailHelper.SelectItem
                    }]
                }],
            editable: false,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {

            },
            dataBinding: function (e) {

            }
        });

        $("#gridSelectedItems").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: false,
            sortable: false,
            columns: [
                { field: "DemandNo", title: "Demand No", sortable: true },
                { field: "ItemName", title: "Item", sortable: true },
                { field: "ItemDesc", title: "Item Desc", sortable: true },
                { field: "DemandQty", title: "DemandQty", sortable: true },
                {
                    field: "Action", title: "Action", filterable: false, width: 160, command: [{
                        name: "delete", text: "Remove", iconClass: "k-icon k-i-delete", className: "k-danger", click: PurRFQDetailHelper.RemoveSelectedItem
                    }]
                }],
            editable: false,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {

            },
            dataBinding: function (e) {

            }
        });
    },
    LoadGridDemandItems(list) {
        var gridDataSource = new kendo.data.DataSource({
            data: list,
            pageSize: 10,
            schema: {
                model: {
                    fields: {
                        DemandDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        DueDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        }
                    }
                }
            }
        });
        var gridDemandItems = $("#gridDemandItems").data("kendoGrid");
        gridDemandItems.setDataSource(gridDataSource);
    },
    LoadGridSelectedItems(list) {
        var gridDataSource = new kendo.data.DataSource({
            data: list
        });
        var gridSelectedItems = $("#gridSelectedItems").data("kendoGrid");
        gridSelectedItems.setDataSource(gridDataSource);
    },
    SelectItem(e) {
        debugger;
        e.preventDefault();
        var gridDemandItems = $("#gridDemandItems").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        gridDemandItems.select(tr);
        if (selectedItem != null) {
            var selectedItems = $("#gridSelectedItems").data("kendoGrid").dataSource.data();
            var suppliers = MerchantManager.GetSupplierByItemId(selectedItem.ItemId);
            if (suppliers.length == 0) {
                AjaxManager.MsgBox('warning', 'center', 'Warning Message', selectedItem.ItemName + " has no supplier.",
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
                return false;
            }
            selectedItems.push(selectedItem);
            PurRFQDetailHelper.LoadGridSelectedItems(selectedItems);
            gridDemandItems.dataSource.remove(selectedItem);

            suppliers.map(x => {
                var hasSupplier = $("#divSupplier").find(".diParent[s-id=" + x.SupplierId + "]");
                if (hasSupplier == null || typeof hasSupplier === "undefined" || hasSupplier.length == 0) PurRFQDetailHelper.DisplaySupplier(x);
            });
        }
    },
    DisplaySupplier(supplier) {
        $("#divSupplier").append(`<div class="col-md-6 col-xs-12 diParent" rfq-s-id=` + AjaxManager.DefaultGuidId() + ` s-id="` + supplier.SupplierId + `">
                                    <div class="col-md-12">
                                        <input class="chkSupplier" type="checkbox" style='margin-right:4px;' />
                                        <label class="spnSupplierName" style='margin-top:7px;'>`+ supplier.SupplierName + `</label>
                                    </div>
                                </div>
        `);
    },
    RemoveSelectedItem(e) {
        e.preventDefault();
        var gridSelectedItems = $("#gridSelectedItems").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        gridSelectedItems.select(tr);
        if (selectedItem != null) {
            gridSelectedItems.dataSource.remove(selectedItem);
            var selectedItems = $("#gridDemandItems").data("kendoGrid").dataSource.data();
            selectedItems.unshift(selectedItem);
            PurRFQDetailHelper.LoadGridDemandItems(selectedItems);
            PurRFQDetailHelper.ResetSuppliers();
        }
    },
    ResetSuppliers() {
        var items = $("#gridSelectedItems").data("kendoGrid").dataSource.data();
        if (items.length == 0) $("#divSupplier").empty();
    },
    CalculateTotal() {

    },
    ShowSummary() {
        $("#divRFQSummary").show();
        $("#divRFQDetails").hide();
    },
    ShowDetail() {
        $("#divRFQSummary").hide();
        $("#divRFQDetails").show();
    },
    GetObject() {
        var obj = {
            RFQId: $.trim($("#hdnRFQId").val()),
            RFQNo: $.trim($("#txtRFQNo").val()),
            RFQDate: $("#dtRFQDate").data("kendoDatePicker").value(),
            UserId: CurrentUser.USERID,
            PurRFQDetails: PurRFQDetailHelper.GetRFQDetails(),
            PurRFQSuppliers: PurRFQDetailHelper.GetSuppliers()
        }
        return obj;
    },
    GetRFQDetails() {
        var oRFQDetails = [];
        var selectedItems = $("#gridSelectedItems").data("kendoGrid").dataSource.data();
        selectedItems.map(x => {
            oRFQDetails.push({
                RFQDetailsId: x.RFQDetailsId !== "undefined"
                    && x.RFQDetailsId != null
                    && x.RFQDetailsId.length > 0 ? x.RFQDetailsId : AjaxManager.DefaultGuidId(),
                RFQId: $.trim($("#hdnRFQId").val()),
                DemandDetailsId: x.DemandDetailsId,
                DmndQty: x.DmndQty,
                IsDeleted: false
            });
        });
        return oRFQDetails;
    },
    GetSuppliers() {
        var suppliers = [];
        $("#divSupplier").find(".chkSupplier:checked").each(function () {
            var suppilerId = $(this).closest(".diParent").attr("s-id");
            suppliers.push({
                RFQSupplierId: $(this).closest(".diParent").attr("rfq-s-id"),
                RFQId: $.trim($("#hdnRFQId").val()),
                SupplierId: suppilerId,
                IsDeleted: false
            });
        });
        return suppliers;
    },
    SetInformations: function (obj) {
        debugger;
        //var pRfqObj = PurRFQDetailManager.GetRFQDetailsByRFQId(obj.RFQId);
            $("#hdnRFQId").val(obj.RFQId);
            $("#txtRFQNo").val(obj.RFQNo);
            $("#dtRFQDate").data("kendoDatePicker").value(obj.RFQDate);
            PurRFQDetailHelper.FillRFQDetails(obj.RFQId);
            PurRFQDetailHelper.FillSuppliers(obj.RFQId)          
    },
    FillRFQDetails: function (RFQId) {
        debugger;
        var gridSelectedItems = $("#gridSelectedItems").data("kendoGrid");
        var gridData = PurRFQDetailManager.GetRFQDetailsByRFQId(RFQId);
        var gridList = gridData.Details;
        oRFQDetails = gridList;
        gridSelectedItems.setDataSource(gridList);
    },
    FillSuppliers: function (RFQId) {
        debugger;
        $("#divSupplier").find("input[type='checkbox']").prop('checked', false);
        var suppliers = PurRFQDetailManager.GetPurRfqSupplierByRfqId(RFQId);
        suppliers.map(x => {
            $("#divSupplier").find("input[type=''checkbox][s-id='" + x.SupplierId + "']").prop('checked', true);
            $("#divSupplier").find("input[type='checkbox'][s-id='" + x.SupplierId + "']").attr("rfq-s-id", x.RFQSupplierId);
        });
    }
}