
var BookingAccessoriesDetailsManager = {
    SaveAccessoriesBookingInfo: function () {
        debugger;
        var bookingObj = BookingAccessoriesDetailsHelper.CreateBookingAccessoriesInfoObject();
        if (BookingAccessoriesDetailsHelper.ValidateForm()) {
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
        }
        function onSuccess(jsonData) {
            var msg = "";
            if (bookingObj.BookingId === AjaxManager.DefaultGuidId()) {
                msg = "Save Successfully";
            } else {
                msg = "Update Successfully";
            }
            if (jsonData.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            TrimsAccesoriesSummaryHelper.LoadTrimsAccessoriesGridData(gbStyleList);
                            location.reload();
                        }
                    }]);

                $("#divBookingAccessoriesDetails").hide();
                $("#divBookingAccessoriesSummary").show();
                var grid = $("#grdBookingAccessoriesSummary").data("kendoGrid");
                grid.refresh();
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
            AjaxManager.MsgBox('error', 'center', 'Error', 'Selected Items Excess and Booking percent Cant be empty!',
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
        }
    },
};

var BookingAccessoriesDetailsHelper = {
    InitBookingAccessoriesDetails: function () {
        $("#pnlBookingAccessories").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        MerchantHelper.GenerateStyleMultiColumnComboBox("cboStyle");
        BookingAccessoriesDetailsHelper.LoadSupplierCombo("cmbSupplier");
        MerchantHelper.GenerateCurrencyCombo("cmbCurrency");
        StyleSummaryHelper.InitStyleSummary();
        TrimsAccesoriesSummaryHelper.InitTrimsAccesoriesSummary();
        BookingAccessoriesDetailsHelper.GenerateDatePicker();


        $("#btnAddNew").click(function () {
            $("#divBookingAccessoriesDetails").show();
            $("#divBookingAccessoriesSummary").hide();
        });
        $("#btnClose").click(function () {
            $("#divBookingAccessoriesDetails").hide();
            $("#divBookingAccessoriesSummary").show();
        });

        //Style
        $("#txtSearchKey").keypress(function (event) {
            if (event.keyCode === 13) {
                BookingAccessoriesDetailsHelper.LoadStyleCombo();
            }
        });
        $("#btnSearchStyle").click(function () {
            BookingAccessoriesDetailsHelper.LoadStyleCombo();
        });
        $("#btnSaveBookingAccessories").click(function () {
            BookingAccessoriesDetailsManager.SaveAccessoriesBookingInfo();
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
            value: new Date()
        });
        $("#txtETA").kendoDatePicker({
            format: "dd-MMM-yyyy",
            value: new Date()
        });
    },
    CreateBookingAccessoriesInfoObject: function () {
        var obj = new Object();
        obj.BookingId = AjaxManager.DefaultGuidId();
        obj.BookingDate = $("#txtBookingDate").data("kendoDatePicker").value();
        obj.Eta = $("#txtETA").data("kendoDatePicker").value();
        obj.Etd = $("#txtETD").data("kendoDatePicker").value();
        obj.CurrencyId = $("#cmbCurrency").data("kendoComboBox").value();
        obj.CreatedPcIp = "";
        obj.UserId = CurrentUser.USERID;
        obj.MerchBookingDetails = BookingAccessoriesDetailsHelper.CreateTrimsAccessoriesList();
        return obj;

    },
    CreateTrimsAccessoriesList: function () {
        var fabCompList = [];
        var itemGrid = $("#grdTrimsAndAccessories").data("kendoGrid");
        var gridData = itemGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var fabCompData = gridData[i];
            for (var j = 0; j < gbSelectiveArray.length; j++) {
                var arrayData = gbSelectiveArray[j];
                if (fabCompData.ItemId === arrayData.ItemId && fabCompData.StyleDetailId === arrayData.StyleDetailId && fabCompData.ItemColorId === arrayData.ItemColorId && fabCompData.ItemSizeId === arrayData.ItemSizeId && fabCompData.CmnUoms.UOMId === arrayData.CmnUoms.UOMId) {
                    var obj = new Object();
                    obj.BookingId = UtilityHelper.EmptyThenDefaultGuidId(fabCompData.BookingId);
                    obj.BookingDetailId = UtilityHelper.EmptyThenDefaultGuidId(fabCompData.BookingDetailId);
                    obj.StyleDetailId = fabCompData.StyleDetailId;
                    obj.SupplierId = $("#cmbSupplier").data("kendoComboBox").value();
                    obj.OrderQty = fabCompData.OrderQty;
                    obj.ItemId = fabCompData.ItemId;
                    obj.SizeId = fabCompData.ItemSizeId;
                    obj.ColorId = fabCompData.ItemColorId;
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
    
    ValidateForm: function () {
        var res = true;
        var currencyCombo = $("#cmbCurrency").data("kendoComboBox");
        if (currencyCombo.value() === "") {
            AjaxManager.NotifyMsg("cmbCurrency", "error", "right", 1500, "Required");
            res = false;
        }
        var supplierCombo = $("#cmbSupplier").data("kendoComboBox");
        if (supplierCombo.value() === "" || supplierCombo.value()===AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbSupplier", "error", "right", 1500, "Required");
            res = false;
        }
        var bookDate = $("#txtBookingDate").data("kendoDatePicker");
        if (bookDate.value() === "" || bookDate.value() === undefined || bookDate.value() === null) {
            AjaxManager.NotifyMsg("txtETD", "error", "top", 1500, "Required");
            res = false;
        }

        var eta = $("#txtETA").data("kendoDatePicker");
        if (eta.value() === "" || eta.value() === undefined || eta.value() === null) {
            AjaxManager.NotifyMsg("txtETA", "error", "top", 1500, "Required");
            res = false;
        }

        var etd = $("#txtETD").data("kendoDatePicker");
        if (etd.value() === "" || etd.value() === undefined || etd.value() === null) {
            AjaxManager.NotifyMsg("txtETD", "error", "top", 1500, "Required");
            res = false;
        }
        return res;
    }
};