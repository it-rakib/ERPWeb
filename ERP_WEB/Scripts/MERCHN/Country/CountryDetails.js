var validationSuccess = $("#validation-success");
var CountryDetailsManager = {
    SaveCountryDetails: function () {
        var msg = "";
        var objCountry = CountryDetailsHelper.CreateCountryObject();
        var jsonParam = JSON.stringify(objCountry);
        var serviceUrl = _baseUrl + "/api/Countries/CreateUpdateCountry";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdCountrySummary").data("kendoGrid").dataSource.read();
                            CountryDetailsHelper.ClearForm();
                        }
                    }]);
            }
            else {
                msg = jsonData.Message;
                AjaxManager.MsgBox('error', 'center', 'Error1', msg, [{
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
var CountryDetailsHelper = {
    InitCountryDetails: function () {
        $("#btnSave").click(function () {
            CountryDetailsManager.SaveCountryDetails();
        });
        $("#btnClearAll").click(function () {
            CountryDetailsHelper.ClearForm();
        });
    },
    FillCountryForm: function (obj) {
        $("#hdnCountryId").val(obj.CountryId);
        $("#txtCountryName").val(obj.CountryName);
        $("#txtCountryShort").val(obj.CountryShort);
        $("#txtCountryCode").val(obj.CountryCode);
    },
    CreateCountryObject: function () {
        var obj = new Object();
        obj.CountryId = $("#hdnCountryId").val();
        obj.CountryName = $("#txtCountryName").val().trim();
        obj.CountryShort = $("#txtCountryShort").val().trim();
        obj.CountryCode = $("#txtCountryCode").val().trim();
        return obj;
    },
    ClearForm: function () {

        $("#btnSave").text("Save");
        $("#hdnCountryId").val("00000000-0000-0000-0000-000000000000");
        $("#txtCountryName").val("");
        $("#txtCountryShort").val("");
        $("#txtCountryCode").val("");
    }
};