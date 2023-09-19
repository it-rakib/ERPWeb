var validationSuccess = $("#validation-success");
var CurrencyDetailsManager = {
    SaveCurrencyDetails: function () {
        var msg = "";
            var objCurrency = CurrencyDetailsHelper.CreateCurrencyObject();
            var jsonParam = JSON.stringify(objCurrency);
            var serviceUrl = _baseUrl + "/api/CmnCurrency/CreateUpdateCmnCurrency";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
            function onSuccess(jsonData) {
                if (jsonData.Success) {
                    msg = jsonData.Message;
                    AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                                $("#grdCurrencySummary").data("kendoGrid").dataSource.read();
                                CurrencyDetailsHelper.ClearForm();
                            }
                        }]);
                }
                else {
                    msg = jsonData.Message;
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
var CurrencyDetailsHelper = {
    InitCurrencyDetails: function () {
        $("#btnSave").click(function () {
            CurrencyDetailsManager.SaveCurrencyDetails();
        });

        $("#btnClearAll").click(function () {
            CurrencyDetailsHelper.ClearForm();
        });
    },
    FillCurrencyForm: function (obj) {
        $("#hdnCurrencyId").val(obj.CurrencyId);
        $("#txtCurrencyName").val(obj.CurrencyName);
        $("#txtCurrencyCode").val(obj.CurrencyCode);
        $("#txtCurrenceySymbol").val(obj.CurrenceySymbol);
        $("#numOrderSl").val(obj.OrderSl);
    },

    CreateCurrencyObject: function (currencyObj) {
        var obj = new Object();
        obj.CurrencyId = $("#hdnCurrencyId").val();
        obj.CurrencyName = $("#txtCurrencyName").val().trim();
        obj.CurrencyCode = $("#txtCurrencyCode").val().trim();
        obj.CurrenceySymbol = $("#txtCurrenceySymbol").val();
        obj.OrderSl = $("#numOrderSl").val();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnCurrencyId").val("00000000-0000-0000-0000-000000000000");
        $("#txtCurrencyName").val("");
        $("#txtCurrencyCode").val("");
        $("#txtCurrenceySymbol").val("");
        $("#numOrderSl").val("");
    }
};