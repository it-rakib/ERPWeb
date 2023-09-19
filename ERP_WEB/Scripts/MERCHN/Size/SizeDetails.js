var validationSuccess = $("#validation-success");
var SizeDetailsManager = {
    SaveSizeDetails: function () {
        var msg = "";
        var objSize = SizeDetailsHelper.CreateSizeObject();
        var jsonParam = JSON.stringify(objSize);
        var serviceUrl = _baseUrl + "/api/CmnSizes/CreateUpdateCmnSize";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdSizeSummary").data("kendoGrid").dataSource.read();
                            SizeDetailsHelper.ClearForm();
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

    }
};

var SizeDetailsHelper = {
    InitSizeDetails: function () {
        $("#btnSave").click(function () {
            SizeDetailsManager.SaveSizeDetails();

        });

        $("#btnClearAll").click(function () {
            SizeDetailsHelper.ClearForm();
        });
    },

    FillSizeForm: function (obj) {
        $("#hdnSizeId").val(obj.SizeId);
        $("#txtSizeName").val(obj.SizeName);
    },

    CreateSizeObject: function () {
        var obj = new Object();
        obj.SizeId = $("#hdnSizeId").val();
        obj.SizeName = $("#txtSizeName").val().trim();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnSizeId").val("00000000-0000-0000-0000-000000000000");
        $("#txtSizeName").val("");
    }
};
