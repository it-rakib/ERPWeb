var POPackingDetailsManager = {
    GetStyleNoByPoId: function (id) {
        var styleDetails = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/PurchaseOrders/GetStyleByPOId/" + id;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            styleDetails = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return styleDetails;
    },
    GetPOWiseColorSizeBreakdownByPOId: function (id) {
        var list = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/PurchaseOrders/GetPOColorSizeBreakDown/" + id;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            list = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return list;
    },
    SavePOPackingInfo: function () {
        //debugger;
        if (POPackingDetailsHelper.ValidateForm()) {
            var createOrUpdatePOPackingCommand = POPackingDetailsHelper.CreatePOPackingObject();
            var jsonParam = JSON.stringify(createOrUpdatePOPackingCommand);
            var serviceUrl = _baseUrl + "/api/POPackingList/CreateUpdatePOPackingList";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            var msg = jsonData.Message;
            if (jsonData.Success) {
                var summary = POPackingSummaryManager.gridDataSource();
                var grid = $("#grdPOPackingSummary").data("kendoGrid");
                grid.setDataSource(summary);
                $("#divPOPackingDetails").hide();
                $("#divPOPackingSummary").show();

                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            //$("#hdnPOPackingId").val(jsonData.packingDto.PopackingId);
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    },
};

var POPackingDetailsHelper = {
    InitPOPackingDetails: function () {
        $("#poPackingInfo").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        $("#btnAddNewPOPacking").click(function () {
            POPackingDetailsHelper.ResetForm();
            $("#divPOPackingDetails").show();
            $("#divPOPackingSummary").hide();
        });
        $("#btnBack").click(function () {
            $("#divPOPackingDetails").hide();
            $("#divPOPackingSummary").show();
        });
        $("#btnSavePOPackingInfo").click(function () {
            POPackingDetailsManager.SavePOPackingInfo();
        });
        $("#cmbPO").change(function () {
            var poId = $("#cmbPO").data("kendoComboBox").value();
            debugger;
            console.log(typeof poId);
            if (poId !== "" && poId !== undefined) {
                $("#cmbStyle").data("kendoComboBox").value("");

                var dataSource = POPackingDetailsManager.GetStyleNoByPoId(poId);
                var combobox = $("#cmbStyle").data("kendoComboBox");
                combobox.setDataSource(dataSource);
                //debugger;
                var sizeColorBreak = POPackingDetailsManager.GetPOWiseColorSizeBreakdownByPOId(poId);
                var gridData = POPackingDetailsHelper.SetPOPackingListSchema(sizeColorBreak);
                var grid = $("#grdPOPackingList").data("kendoGrid");
                grid.setDataSource(gridData);
            }
        });

        POPackingDetailsHelper.GenerateNumericTextBox();
        MerchantHelper.LoadPOConfirmCombo("cmbPO");
        $("#cmbPackingType").kendoComboBox({
            dataSource: [
                { Type: "Assort", Name: "Assort" },
                { Type: "Solid", Name: "Solid" }
            ],
            dataTextField: "Name",
            dataValueField: "Type",
            placeholder: "--Packing Type--",
            filter: "contains",
        });
        $("#cmbStyle").kendoComboBox({
            dataTextField: "StyleNo",
            dataValueField: "StyleDetailId",
            placeholder: "--Select Style--",
            filter: "contains",
        });
        $("#grdPOPackingList").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "Poid", hidden: true },
                { field: "ColorId", hidden: true },
                { field: "SizeId", hidden: true },
                { field: "ColorName", title: "Color Name", editable: isEditable, width: 18, sortable: true },
                { field: "SizeName", title: "Size Name", editable: isEditable, width: 18, sortable: true },
                { field: "QuantityPerCarton", title: "Qty Per Ctn", width: 18, sortable: true, editor: POPackingDetailsHelper.NumericTextBoxEditor },

            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            scrollable: false
        });
        function isEditable(e) {
            var dataSource = $("#grdPOPackingList").data("kendoGrid").dataSource;
            var defaultValue = "00000000-0000-0000-0000-000000000000";
            if (e.Poid === defaultValue)
                return e.Poid;
        }
    },
    ResetForm: function () {
        $("#cmbPO").data("kendoComboBox").value("");
        $("#cmbStyle").data("kendoComboBox").value("");
        $("#cmbPackingType").data("kendoComboBox").value("");
        $("#txtDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtPackPerCarton").data("kendoNumericTextBox").value("");

        $("#grdPOPackingList").data("kendoGrid").dataSource.data([]);
    },
    SetPOPackingListSchema: function (data) {
        var gridData = new kendo.data.DataSource({
            data: data,
            schema: {
                model: {
                    fields: {
                        QuantityPerCarton: {
                            defaultValue: 0
                        },
                    }
                }
            },
            //change: function (e) {
            //    e.preventDefault();
            //    if (e.action === "itemchange") {
            //        var obj = e.items[0];

            //        debugger;
            //        if (e.field === "UnitPrice" || e.field === "ItemQty") {
            //            PIProductInfoHelper.CalculationTotalInvoiceValue();

            //            //item ItemQty undefine 
            //            //e.items[0].UnitPrice = kendo.parseFloat(obj.UnitPrice);
            //            //e.items[0].ItemQty = kendo.parseFloat(obj.ItemQty);
            //            //e.items[0].ItemAmount = kendo.parseFloat(e.items[0].UnitPrice * e.items[0].ItemQty);
            //        }
            //    }
            //}
        });
        return gridData;
    },
    GenerateNumericTextBox: function () {
        $("#txtPackPerCarton").kendoNumericTextBox({
            format: "n2", min: 0, decimals: 2,
            change: function () {
            }
        });
    },
    NumericTextBoxEditor: function (container, options) {
        $('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoNumericTextBox({
                format: "n4",
                decimals: 2,
                // min: 0
            });
    },
    CreatePOPackingObject: function () {
        //debugger;
        var obj = new Object();
        obj.PopackingId = $("#hdnPOPackingId").val();
        obj.Poid = $("#cmbPO").data("kendoComboBox").value();
        obj.StyleDetailsId = $("#cmbStyle").data("kendoComboBox").value();
        obj.Packingtype = $("#cmbPackingType").data("kendoComboBox").value();
        obj.PcsPerCarton = $("#txtPackPerCarton").data("kendoNumericTextBox").value();

       // obj.CreatedBy = CurrentUser.USERID;
        obj.PopackingListDetails = POPackingDetailsHelper.CreatePoPackingListObject();
        return obj;
    },
    CreatePoPackingListObject: function () {
        var popackingList = [];
        var grid = $("#grdPOPackingList").data("kendoGrid");
        var gridData = grid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var list = gridData[i];
            var obj = new Object();
            obj.PopackingDetailsId = AjaxManager.DefaultGuidId();
            obj.PopackingId = $("#hdnPOPackingId").val();
            obj.ColorId = list.ColorId;
            obj.SizeId = list.SizeId;
            obj.Quantity = list.QuantityPerCarton;
            //obj.CreatedBy = CurrentUser.USERID;
            //create validation Function and check
            popackingList.push(obj);
        }
        return popackingList;
    },
    ValidateForm: function () {
        var res = true;
        //debugger;
        var po = $("#cmbPO").data("kendoComboBox");
        if (po.value() === "" || po.value() === undefined) {
            AjaxManager.NotifyMsg("cmbPO", "error", "right", 1500, "Required");
            res = false;
        }
        var style = $("#cmbStyle").data("kendoComboBox");
        if (style.value() === "" || style.value() === undefined) {
            AjaxManager.NotifyMsg("cmbStyle", "error", "right", 1500, "Required");
            res = false;
        }
        var packingType = $("#cmbPackingType").data("kendoComboBox");
        if (packingType === "" || packingType === undefined || packingType === null) {
            AjaxManager.NotifyMsg("cmbPackingType", "error", "right", 1500, "Required");
            res = false;
        }
        var perCarton = $("#txtPackPerCarton").data("kendoNumericTextBox").value();
        if (perCarton === "" || perCarton === undefined || perCarton === null) {
            AjaxManager.NotifyMsg("txtPackPerCarton", "error", "right", 1500, "Required");
            res = false;
        }
        return res;
    }
};