var ConsignmentListManager = {
    GetConsignmentListbyPIId: function (piid) {
        var objItem = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/InvQC/GetConsignmentListbyPIId/" + piid;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objItem = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objItem;
    },
};

var ConsignmentListHelper = {
    InitConsignmentSummary: function () {
        $("#popupConsignmentList").kendoWindow({
            title: " CONSIGNMENT SUMMARY",
            resizeable: false,
            width: "60%",
            actions: ["Pin", "Refresh", "Maximize", "Close"],
            modal: true,
            visible: false
        });
        ConsignmentListHelper.GenerateConsignmentGrid();

        $("#btnSearchConsignmentInfo").click(function () {
            $("#popupConsignmentList").data("kendoWindow").open().center();
        });
        $("#gridConsignmentList").on("dblclick", "tr.k-state-selected", function () {
            var entityGrid = $("#gridConsignmentList").data("kendoGrid");
            var selectedItem = entityGrid.dataItem(entityGrid.select());
            if (selectedItem != null) {
                $("#popupConsignmentList").data("kendoWindow").close();
                //ConsignmentListHelper.FillConsignmentInfo(selectedItem);
                QCItemListHelper.LoadQCItemListGrid(selectedItem);
            }
        });
   
    },
    GenerateConsignmentGrid: function () {
        $("#gridConsignmentList").kendoGrid({
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
                { field: "PIId", hidden: true },
                { field: "ConsignmentId", hidden: true },
                { field: "ConsignmentNo", title: "Consignment No", sortable: true },
                { field: "ConsignmentDate", title: "Consignment Date", sortable: true, template: '#=kendo.toString(kendo.parseDate(ConsignmentDate==null?"":ConsignmentDate),"dd-MMM-yyyy")#' },
                { field: "DeliveryChallanNo", title: "Challan No", sortable: true },
                { field: "DeliveryChallanDate", title: "Challan Date", sortable: true, template: '#=kendo.toString(kendo.parseDate(DeliveryChallanDate==null?"":DeliveryChallanDate),"dd-MMM-yyyy")#' },
                { field: "ComInvoiceNo", title: "Invoice No", sortable: true },
                { field: "ComInvoiceDate", title: "Invoice Date", sortable: true, template: '#=kendo.toString(kendo.parseDate(ComInvoiceDate==null?"":ComInvoiceDate),"dd-MMM-yyyy")#' },
                { field: "SupplierName", title: "Supplier", sortable: true },
                { field: "VehicleNo", title: "VehicleNo", sortable: true },
                {
                    command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-arrow-down", className: "k-success", click: ConsignmentListHelper.ClickEventForEditButton
                    }], title: "Action &nbsp;"
                }],
            toolbar: [{ name: "search", text: "Search By Consignment No" }],
            search: {
                fields: ["ConsignmentNo"]
            },
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },

    LoadConsignmentGrid: function (obj) {
        if (obj !== null || obj !== undefined) {
            $("#txtPINo").val(obj.PINo);
            $("#hdnPIId").val(obj.PIId);
            $("#hdCPIId").val(obj.PIId);
            var grid = $("#gridConsignmentList").data("kendoGrid");
            var itemList = ConsignmentListManager.GetConsignmentListbyPIId(obj.PIId);
            var gridDataSource = new kendo.data.DataSource({
                data: itemList,
            });
            grid.setDataSource(gridDataSource);            
        }
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#gridConsignmentList").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#popupConsignmentList").data("kendoWindow").close();
            //ConsignmentListHelper.FillConsignmentInfo(selectedItem);
            QCItemListHelper.LoadQCItemListGrid(selectedItem);
        }
    },
    FillConsignmentInfo: function (obj) {
        $("#hdnConsignmentId").val(obj.ConsignmentId);
        $("#txtConsignmentNo").val(obj.ConsignmentNo);        
    }
};