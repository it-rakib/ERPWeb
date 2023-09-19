
var LeadTimeDetailsManager = {
    SaveLeadTimeDetails: function () {
        var msg = "";
        if (LeadTimeDetailsHelper.ValidateForm()) {
            var objLeadTime = LeadTimeDetailsHelper.CreateLeadTimeObject();
            var jsonParam = JSON.stringify(objLeadTime);
            var serviceUrl = _baseUrl + "/api/LeadTimes/CreateOrUpdateLeadTime";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdLeadTimeSummary").data("kendoGrid").dataSource.read();
                            LeadTimeDetailsHelper.ClearForm();
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
}

var LeadTimeDetailsHelper = {
    InitLeadTimeDetails: function () {
        var buyers = ApiManager.GetList(_baseUrl + "/api/Buyers/all");
        $("#cmbBuyer").kendoComboBox({
            placeholder: "--Select Buyer--",
            dataValueField: "BuyerId",
            dataTextField: "BuyerName",
            dataSource: buyers,
            suggest: true,
            filter: "contains",
            change: function () {
                LeadTimeDetailsHelper.LoadBrands();
                LeadTimeDetailsHelper.LoadDepartments();
            }
        });
        $("#cmbBrand").kendoComboBox({
            placeholder: "--Select Brand--",
            dataValueField: "BrandId",
            dataTextField: "BuyerBrandName",
            dataSource: [],
            suggest: true,
            filter: "contains",
            change: function () {
                LeadTimeDetailsHelper.LoadDepartments();
            }
        });
        $("#cmbDepartment").kendoComboBox({
            placeholder: "--Select Department--",
            dataValueField: "DepartmentId",
            dataTextField: "BuyerDepartmentName",
            dataSource: [],
            suggest: true,
            filter: "contains"
        });

        $("#btnSave").click(function () {
            LeadTimeDetailsManager.SaveLeadTimeDetails();
        });

        $("#btnClearAll").click(function () {
            LeadTimeDetailsHelper.ClearForm();
        });
    },

    LoadBrands() {
        $("#cmbBrand").data("kendoComboBox").text("");
        var buyerId = $("#cmbBuyer").data("kendoComboBox").value(),
            brands = [];
        if (!UtilityHelper.IsNullOrEmpty(buyerId)) {
            brands = ApiManager.GetList(_baseUrl + "/api/BuyerBrands/brands/" + buyerId);
            brands.unshift({
                BrandId: "",
                BuyerBrandName: "--Select Brand--"
            });
            $("#cmbBrand").data("kendoComboBox").setDataSource(brands);
        }
    },
    LoadDepartments() {
        $("#cmbDepartment").data("kendoComboBox").text("");
        var brandId = $("#cmbBrand").data("kendoComboBox").value(),
            departments = [];
        if (!UtilityHelper.IsNullOrEmpty(brandId)) {
            departments = ApiManager.GetList(_baseUrl + "/api/BrandDepartments/department/" + brandId);
            departments.unshift({
                DepartmentId: "",
                BuyerDepartmentName: "--Select Department--"
            });
            $("#cmbDepartment").data("kendoComboBox").setDataSource(departments);
        }
    },
    
    CreateLeadTimeObject: function () {
        var obj = new Object();
        obj.LeadTimeId = $("#hdnLeadTimeId").val();
        obj.LeadTimeName = $("#txtLeadTimeName").val().trim();
        obj.BuyerId = $("#cmbBuyer").data("kendoComboBox").value();

        var brandValue = $("#cmbBrand").data("kendoComboBox").value()
        obj.BrandId = brandValue === "" ? AjaxManager.DefaultGuidId() : $("#cmbBrand").data("kendoComboBox").value();

        var departmentValue = $("#cmbDepartment").data("kendoComboBox").value();
        obj.DepartmentId = departmentValue === "" ? AjaxManager.DefaultGuidId() : $("#cmbDepartment").data("kendoComboBox").value();
        obj.IsActive = $("#chkIsActive").is(":checked");
        return obj;
    },
    FillLeadTimeForm: function (obj) {
        $("#hdnLeadTimeId").val(obj.LeadTimeId);
        $("#txtLeadTimeName").val(obj.LeadTimeName);
        $("#cmbBuyer").data("kendoComboBox").value(obj.BuyerId);
        LeadTimeDetailsHelper.LoadBrands();
        $("#cmbBrand").data("kendoComboBox").value(obj.BrandId);
        LeadTimeDetailsHelper.LoadDepartments();
        $("#cmbDepartment").data("kendoComboBox").value(obj.DepartmentId);
        if (obj.IsActive === true) {
            $("#chkIsActive").prop('checked', true);
        } else {
            $("#chkIsActive").prop('checked', false);
        };
    },
    ClearForm: function () {
        $("#btnSave").text("Save");
        $("#hdnLeadTimeId").val("00000000-0000-0000-0000-000000000000");
        $("#txtLeadTimeName").val("");
        $("#cmbBuyer").data("kendoComboBox").value("");
        $("#cmbBrand").data("kendoComboBox").value("");
        $("#cmbDepartment").data("kendoComboBox").value("");
        $("#chkIsActive").prop('checked', false);
    },
    ValidateForm: function () {
        var res = true;

        var leadTimeName = $("#txtLeadTimeName").val();
        if (leadTimeName === "") {
            AjaxManager.NotifyMsg("txtLeadTimeName", "error", "right", 1500, "Required");
            res = false;
        }

        var cmnBuyer = $("#cmbBuyer").data("kendoComboBox");
        if (cmnBuyer.value() === "" || cmnBuyer.value() === undefined) {
            AjaxManager.NotifyMsg("cmbBuyer", "error", "right", 1500, "Required");
            res = false;
        }

        //var cmnBrand = $("#cmbBrand").data("kendoComboBox");
        //if (cmnBrand.value() === "" || cmnBrand.value() === undefined) {
        //    AjaxManager.NotifyMsg("cmbBrand", "error", "right", 1500, "Required");
        //    res = false;
        //}
        return res;
    }
}