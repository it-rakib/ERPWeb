
var DeedList = [];
var isDelete = false;

var FileLocationDetailsManager = {
    SaveFileLocationDetails: function () {
        var msg = "";
        if (FileLocationDetailsHelper.ValidateForm()) {
            var createOrUpdateFileLocationCommand = FileLocationDetailsHelper.CreateFileLocationObject();
            var jsonParam = JSON.stringify(createOrUpdateFileLocationCommand);
            var serviceUrl = _baseUrlLand + "/api/FileLocation/CreateOrUpdateFileLocation";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdFileLocationMasterSummary").data("kendoGrid").dataSource.read();
                            $("#divFileLocationSummary").show();
                            $("#divFileLocationDetails").hide();
                            FileLocationDetailsHelper.ClearFullForm();
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
    GetAllFileCode() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/FileCode/all");
        return list == null ? [] : list;
    },
    GetFileNoListByFileCodeId: function (fileCodeId) {
        var objFileNo = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/FileNo/fileNoList/" + fileCodeId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objFileNo = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objFileNo;
    },
    GetAllAlmirahNoList() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/AlmirahNo/all");
        return list == null ? [] : list;
    },
    GetAllRackNoListByAlmirahId: function (almirahId) {
        var objRackNo = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/RackNo/rackNoList/" + almirahId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objRackNo = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objRackNo;
    },
    GetAllDeedNoList() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/LandMaster/allDeedNoList");
        return list == null ? [] : list;
    },
    GetAllFileLocationDetailListByFileLocationMasterId: function (fileLocationMasterId) {
        var objFileInfo = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/FileLocation/fileLocationDetails/" + fileLocationMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objFileInfo = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objFileInfo;
    },
    GetAllFileLocationDetailList: function () {
        var objFileInfo = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/FileLocation/fileLocationDetailList";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objFileInfo = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objFileInfo;
    },
}

var FileLocationDetailsHelper = {
    InitFileLocationDetails: function () {
        $("#btnAddNew").click(function () {
            $("#divFileLocationSummary").hide();
            $("#divFileLocationDetails").show();
            FileLocationDetailsHelper.ClearFullForm();
        });
        $("#btnSubmitApplication").click(function() {
            FileLocationDetailsManager.SaveFileLocationDetails();
        });
        $("#btnCancelApplication").click(function () {
            $("#divFileLocationSummary").show();
            $("#divFileLocationDetails").hide();
            FileLocationDetailsHelper.ClearFullForm();
        });

        $("#btnAddDeed").click(function () {
            if ($("#btnAddDeed").text() === "Add Deed") {
                FileLocationDetailsHelper.AddToListDeed();
            } else {
                FileLocationDetailsHelper.UpdateToListDeed();
            }
        });

        FileLocationDetailsHelper.LoadFileCodeCombo("cmbFileCode");
        FileLocationDetailsHelper.LoadFileNoCombo("cmbFileNo");
        FileLocationDetailsHelper.LoadAlmirahCombo("cmbAlmirahNo");
        FileLocationDetailsHelper.LoadRackCombo("cmbRackNo");
        FileLocationDetailsHelper.LoadDeedNoMultiColumnComboBox("cmbDeedNo");

        $("#cmbFileCode").change(function () {
            FileLocationDetailsHelper.ChangeEventOfFileCodeCombo();
        });
        $("#cmbAlmirahNo").change(function () {
            FileLocationDetailsHelper.ChangeEventOfAlmirahCombo();
        });
    },
    
    CreateFileLocationObject: function () {
        debugger;
        var obj = new Object();
        if (isDelete == true) {
            obj.IsDeleted = true;
        }
        obj.FileLocationMasterId = $("#hdnFileLocationMasterId").val();
        obj.FileCodeInfoId = $("#cmbFileCode").data("kendoComboBox").value();
        obj.FileNoInfoId = $("#cmbFileNo").data("kendoComboBox").value();
        obj.AlmirahNoInfoId = $("#cmbAlmirahNo").data("kendoComboBox").value();
        obj.RackNoInfoId = $("#cmbRackNo").data("kendoComboBox").value();
        obj.Remarks = $("#txtRemarks").val();
        obj.CreatedBy = CurrentUser.USERID;
        obj.UpdatedBy = CurrentUser.USERID;
        obj.FileLocationDetails = FileLocationDetailsHelper.CreateFileLocationDetails();
        return obj;
    },
    CreateFileLocationDetails: function () {
        var fileLocationDetailGrid = $("#grdFileLocationDetail").data("kendoGrid");
        var data = fileLocationDetailGrid.dataSource.data();
        $.each(data, function (i, item) {
            data[i].FileLocationDetailId = AjaxManager.DefaultGuidId();
            data[i].FileLocationMasterId = AjaxManager.DefaultGuidId();
        });
        return data;
    },

    LoadFileCodeCombo(cmbFileCode) {
        UtilityHelper.LoadCombo(cmbFileCode, "FileCodeInfoId", "FileCodeInfoName", FileLocationDetailsManager.GetAllFileCode(), "--Select File Code--");
    },
    LoadFileNoCombo(cmbFileNo) {
        UtilityHelper.LoadCombo(cmbFileNo, "FileNoInfoId", "FileNoInfoName", [], "--Select File No--");
    },
    LoadAlmirahCombo(cmbAlmirahNo) {
        UtilityHelper.LoadCombo(cmbAlmirahNo, "AlmirahNoInfoId", "AlmirahNoInfoName", FileLocationDetailsManager.GetAllAlmirahNoList(), "--Select Almirah/Shelf No--");
    },
    LoadRackCombo(cmbRackNo) {
        UtilityHelper.LoadCombo(cmbRackNo, "RackNoInfoId", "RackNoInfoName", [], "--Select Rack No--");
    },
    LoadDeedNoMultiColumnComboBox(cmbDeedNo) {
        $("#" + cmbDeedNo).kendoMultiColumnComboBox({
            dataSource: FileLocationDetailsManager.GetAllDeedNoList(),
            dataTextField: "DeedNo",
            dataValueField: "LandMasterId",
            columns: [
                { field: "DeedNo", title: "Deed No", width: 100 },
                { field: "EntryDate", title: "Date", width: 150, format: "{0: yyyy-MM-dd}", value: new Date() },
                //{ field: "SubRegOfficeId", hidden: true },
                { field: "SubRegOfficeName", title: "Sub-Register Office", width: 180 },
                { field: "TotalLandAmount", title: "Total Area of Land (Decimal)", width: 100 },
            ],
            filter: "startswith",
            filterFields: ["DeedNo"],
            placeholder: "---Select Deed No---",
            height: 300
        });
    },

    ChangeEventOfFileCodeCombo: function () {
        var fileCodeId = $("#cmbFileCode").data("kendoComboBox").value();
        var data = FileLocationDetailsManager.GetFileNoListByFileCodeId(fileCodeId);
        var fileNoCombo = $("#cmbFileNo").data("kendoComboBox");
        fileNoCombo.value("");
        fileNoCombo.text("");
        fileNoCombo.setDataSource(data);
    },
    ChangeEventOfAlmirahCombo: function () {
        var almirahId = $("#cmbAlmirahNo").data("kendoComboBox").value();
        var data = FileLocationDetailsManager.GetAllRackNoListByAlmirahId(almirahId);
        var rackNoCombo = $("#cmbRackNo").data("kendoComboBox");
        rackNoCombo.value("");
        rackNoCombo.text("");
        rackNoCombo.setDataSource(data);
    },

    AddToListDeed: function () {
        
        var deedNoCombo = $("#cmbDeedNo").data("kendoMultiColumnComboBox");
        
        var fileLocationDetailGrid = $("#grdFileLocationDetail").data("kendoGrid");

        if (deedNoCombo.value() !== "") {
            var gridData = fileLocationDetailGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                var landMasterId = deedNoCombo.value();
                if (itm.LandMasterId === landMasterId) {
                    AjaxManager.NotifyMsg("btnAddDeed", "error", "right", 1500, "Already Added!");
                    return;
                }
            }

            var obj = new Object();
            obj.FileLocationDetailId = AjaxManager.DefaultGuidId();
            obj.FileLocationMasterId = AjaxManager.DefaultGuidId();
            obj.LandMasterId = deedNoCombo.value();
            obj.DeedNo = deedNoCombo.text();

            DeedList.push(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: DeedList,
                schema: {
                    model: {
                        fields: {
                            Edit: {
                                editable: false
                            }
                        }
                    }
                }
            });
            fileLocationDetailGrid.setDataSource(gridDataSource);
            FileLocationDetailsHelper.ClearDeedForm();
        } else {
            if (deedNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbDeedNo", "error", "right", 1500, "Required");
            }
        }
    },
    ClearDeedForm: function () {
        $("#cmbDeedNo").data("kendoMultiColumnComboBox").value("");
    },
    UpdateToListDeed: function () {

        var deedNoCombo = $("#cmbDeedNo").data("kendoMultiColumnComboBox");
        var grid = $("#grdFileLocationDetail").data("kendoGrid");
        var selectedItem = grid.dataItem(grid.select());

        if (deedNoCombo.value() !== "") {
            var obj = new Object();
            obj.FileLocationDetailId = selectedItem.FileLocationDetailId !== AjaxManager.DefaultGuidId() ? selectedItem.FileLocationDetailId : AjaxManager.DefaultGuidId();
            obj.FileLocationMasterId = selectedItem.FileLocationMasterId !== AjaxManager.DefaultGuidId() ? selectedItem.FileLocationMasterId : AjaxManager.DefaultGuidId();
            obj.LandMasterId = deedNoCombo.value();
            obj.DeedNo = deedNoCombo.text();

            for (var i = 0; i < DeedList.length; i++) {
                if (DeedList[i].FileLocationDetailId === selectedItem.FileLocationDetailId) {
                    DeedList.splice(i, 1);
                    break;
                }
            }

            DeedList.push(obj);
            selectedItem.set('FileLocationDetailId', obj.FileLocationDetailId);
            selectedItem.set('FileLocationMasterId', obj.FileLocationMasterId);
            selectedItem.set('LandMasterId', obj.LandMasterId);
            selectedItem.set('DeedNo', obj.DeedNo);

            $("#btnAddDeed").text("Add Deed");
            $("#btnAddDeed").addClass("fas fa-arrow-down");
            FileLocationDetailsHelper.ClearDeedForm();
        }
        else {
            if (deedNoCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbDeedNo", "error", "right", 1500, "Required");
            }
        }
    },
    FillDeedDetailForm: function (obj) {
        $("#btnAddDeed").text("Update Deed");
        $("#btnAddDeed").addClass("fa fa-edit");

        $("#cmbDeedNo").data("kendoMultiColumnComboBox").value(obj.LandMasterId);
        $("#cmbDeedNo").data("kendoMultiColumnComboBox").text(obj.DeedNo);
    },

    FillFileLocationMasterForm: function (obj) {
        
        $("#hdnFileLocationMasterId").val(obj.FileLocationMasterId);

        $("#cmbFileCode").data("kendoComboBox").value(obj.FileCodeInfoId);
        FileLocationDetailsHelper.ChangeEventOfFileCodeCombo();
        $("#cmbFileNo").data("kendoComboBox").value(obj.FileNoInfoId);
        $("#cmbAlmirahNo").data("kendoComboBox").value(obj.AlmirahNoInfoId);
        FileLocationDetailsHelper.ChangeEventOfAlmirahCombo();
        $("#cmbRackNo").data("kendoComboBox").value(obj.RackNoInfoId);
        $("#txtRemarks").val(obj.Remarks);
        if (obj.IsDeleted == true) {
            isDelete = obj.IsDeleted;
        }

        //Deed Info Grid
        FileLocationDetailsHelper.LoadFileLocationDetailGrid(obj.FileLocationMasterId);
    },
    LoadFileLocationDetailGrid: function (fileLocationMasterId) {
        // File Location Details
        var fileLocationDetailObjs = FileLocationDetailsManager.GetAllFileLocationDetailListByFileLocationMasterId(fileLocationMasterId);

        var fileLocationDetailGrid = $("#grdFileLocationDetail").data("kendoGrid");
        
        var gridDataSource = new kendo.data.DataSource({
            data: fileLocationDetailObjs,
            schema: {
                model: {
                    fields: {
                    }
                }
            }
        });
        fileLocationDetailGrid.setDataSource(gridDataSource);
        DeedList = fileLocationDetailObjs; 
    },

    ValidateForm: function () {
        var res = true;

        var fileCodeValue = $("#cmbFileCode").data("kendoComboBox").value();
        if (fileCodeValue === "" || fileCodeValue === undefined) {
            AjaxManager.NotifyMsg("cmbFileCode", "error", "right", 1500, "Required");
            res = false;
        }

        var fileNoValue = $("#cmbFileNo").data("kendoComboBox").value();
        if (fileNoValue === "" || fileNoValue === undefined) {
            AjaxManager.NotifyMsg("cmbFileNo", "error", "right", 1500, "Required");
            res = false;
        }

        var almirahNoValue = $("#cmbAlmirahNo").data("kendoComboBox").value();
        if (almirahNoValue === "" || almirahNoValue === undefined) {
            AjaxManager.NotifyMsg("cmbAlmirahNo", "error", "right", 1500, "Required");
            res = false;
        }

        var rackNoValue = $("#cmbRackNo").data("kendoComboBox").value();
        if (rackNoValue === "" || rackNoValue === undefined) {
            AjaxManager.NotifyMsg("cmbRackNo", "error", "right", 1500, "Required");
            res = false;
        }

        //Deed List if empty
        if (DeedList.length <= 0) {
            AjaxManager.NotifyMsg("btnAddDeed", "error", "right", 1500, "Deed Info Required!");
            AjaxManager.NotifyMsg("btnSubmitApplication", "error", "left", 1500, "Deed Info Required!");
            res = false;
        }
        
        //var landDetailList = FileLocationDetailsManager.GetAllFileLocationDetailList();
        //for (var i = 0; i < landDetailList.length; i++) {
        //    var exist = landDetailList[i];

        //    var fileLocationDetailGrid = $("#grdFileLocationDetail").data("kendoGrid");
        //    var gridData = fileLocationDetailGrid.dataSource.data();
        //    for (var i = 0; i < gridData.length; i++) {
        //        var itm = gridData[i];
        //        if (itm.LandMasterId === exist.LandMasterId) {
        //            AjaxManager.NotifyMsg("btnSubmitApplication", "error", "left", 1500, "Deed Already Exist in Other File!");
        //            res = false;
        //            return;
        //        }
        //    }
        //}
        
        return res;
    },
    ClearFullForm: function () {
        $("#btnSubmitApplication").text("Submit");
        $("#btnSubmitApplication").addClass("glyphicon glyphicon-floppy-disk");

        $("#btnAddDeed").text("Add Deed");
        $("#btnAddDeed").addClass("fas fa-arrow-down");

        DeedList = [];
        $("#hdnFileLocationMasterId").val("00000000-0000-0000-0000-000000000000");
        $("#cmbFileCode").data("kendoComboBox").value("");
        $("#cmbFileNo").data("kendoComboBox").value("");
        $("#cmbAlmirahNo").data("kendoComboBox").value("");
        $("#cmbRackNo").data("kendoComboBox").value("");
        $("#cmbDeedNo").data("kendoMultiColumnComboBox").value("");
        $("#grdFileLocationDetail").data("kendoGrid").dataSource.data([]);
        $("#txtRemarks").val("");
    }
}
