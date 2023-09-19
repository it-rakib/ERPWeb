 
var BookingFabricDetailsManager = {
    SaveFabricBookingInfo: function () {
        debugger;
        var bookingObj = BookingFabricDetailsHelper.CreateBookingFabricInfoObject();
        if (bookingObj.MerchBookingDetails.length > 0) {
            var jsonParam = JSON.stringify(bookingObj);
            var serviceUrl = _baseUrl + "/api/MerchBookings/CreateOrUpdateFabricBooking";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        } else {
            AjaxManager.MsgBox('warning', 'center', 'Warning', "Please Select Fabric Booking Data",
                      [{
                          addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                              $noty.close();
                          }
                      }]);
        }
        function onSuccess(jsonData) {
            var msg = "";
            if (bookingObj.BookingId === AjaxManager.DefaultGuidId()) {
                msg = "Saved Successfully";
            } else {
                msg = "Update Successfully";
            }
            if (jsonData.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            FabricCompositionSummaryHelper.LoadFabricCompositionGridData(gbStyleList);
                            $("#divBookingFabricDetails").hide();
                            $("#divBookingFabricSummary").show();
                            location.reload();
                        }
                    }]);
            }

            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', jsonData,
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

var BookingFabricDetailsHelper = {
    InitBookingFabricDetails:function() {
        $("#pnlBookingFabric").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        MerchantHelper.GenerateStyleMultiColumnComboBox("cboStyle");
        BookingFabricDetailsHelper.LoadSupplierCombo("cmbSupplier");
        MerchantHelper.GenerateCurrencyCombo("cmbCurrency");
        StyleSummaryHelper.InitStyleSummary();
        FabricCompositionSummaryHelper.InitFabricCompositionSummary();
        BookingFabricDetailsHelper.GenerateDatePicker();

        $("#btnAddNew").click(function() {
            $("#divBookingFabricDetails").show();
            $("#divBookingFabricSummary").hide();
        });
        $("#btnClose").click(function () {
            $("#divBookingFabricDetails").hide();
            $("#divBookingFabricSummary").show();
        });

        //Style
        $("#txtSearchKey").keypress(function (event) {
            if (event.keyCode === 13) {
                BookingFabricDetailsHelper.LoadStyleCombo();
            }
        });
        $("#btnSearchStyle").click(function () {
            BookingFabricDetailsHelper.LoadStyleCombo();
        });
        $("#btnSaveBookingFabric").click(function () {
            BookingFabricDetailsManager.SaveFabricBookingInfo();
        });
    },
    LoadSupplierCombo(cboId) {
        UtilityHelper.LoadCombo(cboId, "SupplierId", "SupplierName", [], "--Select Supplier--");
    },
    LoadStyleCombo: function () {
        var searchKey = $("#txtSearchKey").val();
        if (searchKey !== "") {
            var data = MerchantManager.GetAllStyle(searchKey);
            var cboStyle = $("#cboStyle").data("kendoMultiColumnComboBox");
            cboStyle.value("");
            cboStyle.setDataSource(data);
            cboStyle.select(0);
        } else {
            AjaxManager.MsgBox('warning', 'center', 'Alert', "Please type some text to search style!",
                       [{
                           addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                               $noty.close();
                           }
                       }]);
        }
    },
    GenerateDatePicker: function () {
        $("#txtBookingDate").kendoDatePicker({
            format: "dd-MMM-yyyy",
            value: new Date()
        });
        $("#txtETD").kendoDatePicker({
            format: "dd-MMM-yyyy",
            value:new Date()
        });
        $("#txtETA").kendoDatePicker({
            format: "dd-MMM-yyyy",
            value: new Date()
        });
    },
    CreateBookingFabricInfoObject: function () {
        var obj = new Object();
        obj.BookingId = AjaxManager.DefaultGuidId();
        obj.BookingDate = $("#txtBookingDate").data("kendoDatePicker").value();
        obj.Eta = $("#txtETA").data("kendoDatePicker").value();
        obj.Etd = $("#txtETD").data("kendoDatePicker").value();
        obj.CreatedPcIp = "";
        obj.CurrencyId = $("#cmbCurrency").data("kendoComboBox").value();
        obj.UserId = CurrentUser.USERID;
        obj.MerchBookingDetails = BookingFabricDetailsHelper.CreateFabricCompositionList();
        return obj;

    },
    CreateFabricCompositionList:function() {
        var fabCompList = [];
        var itemGrid = $("#grdFabricComposition").data("kendoGrid");
        var gridData = itemGrid.dataSource.data();
      
        for (var i = 0; i < gridData.length; i++) {
            var fabCompData = gridData[i];
            for (var j = 0; j < gbSelectiveArray.length; j++) {
                var arrayData = gbSelectiveArray[j];
                if (fabCompData.ItemId === arrayData.ItemId && fabCompData.StyleDetailId === arrayData.StyleDetailId && fabCompData.ColorId === arrayData.ColorId && fabCompData.CmnUoms.UOMId === arrayData.CmnUoms.UOMId) {
                    var obj = new Object();
                    obj.BookingId =UtilityHelper.EmptyThenDefaultGuidId(fabCompData.BookingId);
                    obj.BookingDetailId =UtilityHelper.EmptyThenDefaultGuidId(fabCompData.BookingDetailId);
                    obj.StyleDetailId = fabCompData.StyleDetailId;
                    obj.SupplierId = $("#cmbSupplier").data("kendoComboBox").value();
                    obj.OrderQty = fabCompData.OrderQty;
                    obj.ItemId = fabCompData.ItemId;
                    obj.SizeId = null;
                    obj.ColorId = fabCompData.ColorId;
                    obj.BookingPercent = fabCompData.NewBookingPercent;
                    obj.BookingValue = fabCompData.BookingValue;
                    obj.Uomid = fabCompData.CmnUoms.UOMId;
                    obj.ExcessPercent = fabCompData.ExcessPercentObj.ExcessPercent;
                    obj.TotalReqQty = fabCompData.TotalReqQty;
                    obj.BookQty = fabCompData.NewBookQty;
                    obj.Rate = fabCompData.Rate;
                    fabCompList.push(obj);
                }
            }
        }
        return fabCompList;
    },
    ValidateForm:function() {
        
    }
};