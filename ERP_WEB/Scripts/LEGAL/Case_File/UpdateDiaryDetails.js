var isAdmin = false;
var validationSuccess = $("#validation-success");
var UpdateDiaryDetailsManager = {
    gridDataSource: function (fileMasterId) {
        
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLegal + "/api/UpdateDiary/GetAllGridData/" + fileMasterId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json;",
                    cache: false,
                    async: false
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            batch: true,
            schema: {
                model: {

                },
                data: "Items", total: "TotalCount"
            }
        });
        
        return gridDataSource;
    },
    SaveUpdateDiaryDetails: function () {
        var msg = "";
        
        var objUpdateDiary = UpdateDiaryDetailsHelper.CreateUpdateDiaryObject();
        var jsonParam = JSON.stringify(objUpdateDiary);
        var serviceUrl = _baseUrlLegal + "/api/UpdateDiary/CreateUpdateDiary";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdUpdateDiarySummary").data("kendoGrid").dataSource.read();
                            //$("#divUpdateDiarySummary").show();
                            //$("#divUpdateDiaryDetails").hide();
                            $("#txtPreviousDate").data("kendoDatePicker").value("");
                            $("#txtPrvDatefr").val("");
                            $("#txtNextDate").data("kendoDatePicker").value("");
                            $("#txtNxtDatefr").val("");
                            $("#cmbStatus1").data("kendoComboBox").value("");
                            $("#txtStatusDate1").data("kendoDatePicker").value("");
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
    GetAllFiles: function (searchKey) {
        var objFile = "";
        var jsonParam = "";
        
        var serviceUrl = _baseUrlLegal + "/api/CaseFileMaster/" + $.trim(searchKey);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objFile = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objFile;
    },
    GetUpdateDiaryByCaseFileId: function (caseFileId) {
        var objCaseFile = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/CaseFileMaster/fileMasterByFileMasterId/" + $.trim(caseFileId);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objCaseFile = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objCaseFile;
    },
    GetStatus() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/Status/all");
        return list == null ? [] : list;
    }
};

var UpdateDiaryDetailsHelper = {
    InitUpdateDiaryDetails: function () {        
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        UpdateDiaryDetailsHelper.GenerateDatePicker();
        
        UpdateDiaryDetailsHelper.LoadStatusCombo("cmbStatus1");   

        //UpdateDiaryDetailsHelper.GenerateUpdateDiaryGrid();
       // UpdateDiaryDetailsHelper.GenerateMulticolumnComboBox("cboCaseFile");
        
        $("#btnUpdateSave").click(function () {
            
            UpdateDiaryDetailsManager.SaveUpdateDiaryDetails();
        });

        //$("#btnAddNew").click(function () {
        //    $("#divUpdateDiarySummary").hide();
        //    $("#divUpdateDiaryDetails").show();
        //    UpdateDiaryDetailsHelper.ClearForm();
        //});
        //$("#btnSearchStyle").click(function () {
        //    //var searchKey = ("#txtSearchKey").val();
        //    UpdateDiaryDetailsHelper.GenerateMulticolumnCombo();
        //    //UpdateDiaryDetailsHelper.GetDataBySearchKey(searchKey);
        //});
        //$("#cboCaseFile").change(function () {
        //    var caseFileId = $("#cboCaseFile").data("kendoMultiColumnComboBox").value();
        //    UpdateDiaryDetailsHelper.FillDiaryByFileChange(caseFileId);
        //});

        $("#cmbStatus1").change(function () {
            
            var statusId = $("#cmbStatus1").data("kendoComboBox").value();
            if (statusId != 1) {
                $("#divStatus1").show();
                $("#txtNextDate").data("kendoDatePicker").enable(false);
                $("#txtNxtDatefr").prop("disabled", true);
            }
            else {
                $("#divStatus1").hide();
                $("#txtNextDate").data("kendoDatePicker").enable(true);
                $("#txtNxtDatefr").prop("disabled", false);
            }
        });

        $("#btnBack").click(function () {
            $("#divUpdateDiaryDetails").hide();
            $("#divCaseFile").show();
            $("#divCaseFileDetails").hide();
            $("#divCaseFileSummary").show();

            //UpdateDiaryDetailsHelper.ClearForm();
        });
        //$("#btnBack1").click(function () {
        //    $("#divUpdateDiaryDetails").hide();
        //    $("#divCaseFile").show();
        //    $("#divCaseFileDetails").hide();
        //    $("#divCaseFileSummary").show();

        //    //UpdateDiaryDetailsHelper.ClearForm();
        //});
    },
    GenerateUpdateDiaryGrid: function (fileMasterId) {
        $("#grdUpdateDiarySummary").kendoGrid({
            dataSource: UpdateDiaryDetailsManager.gridDataSource(fileMasterId),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            toolbar: ["search"],
            search: {
                fields: ["RegNo"]
            },
            columns: [
                { field: "DiaryId", hidden: true },
                { field: "FileMasterId", hidden: true },
                { field: "RegNo", title: "Reg No", hidden: true },
                { field: "PreviousDate", title: "Previous Date", template: '#= kendo.toString(kendo.parseDate(PreviousDate), "dd-MM-yyyy") #' },
                { field: "PreviousDateFor", title: "Previous Date For" },
                { field: "NextDate", title: "Next Date", template: '#= kendo.toString(kendo.parseDate(NextDate), "dd-MM-yyyy") #' },
                { field: "NextDateFor", title: "Next Date For" },
                { field: "StatusName", title: "Status" },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: UpdateDiaryDetailsHelper.ClickEventForEditButton
                    }], hidden: !isAdmin, title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdUpdateDiarySummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            $("#divUpdateDiarySummary").hide();
            $("#divUpdateDiaryDetails").show();
            
            UpdateDiaryDetailsHelper.FillUpdateDiaryForm(selectedItem);
        }
    },
    FillUpdateDiaryForm: function (obj) {
        
        $("#hdnUpdateDiaryId").val(obj.DiaryId);
        $("#hdnFileMasterId").val(obj.FileMasterId);
        $("#txtPreviousDate").data("kendoDatePicker").value(obj.PreviousDate);
        $("#txtPrvDatefr").val(obj.PreviousDateFor);
        $("#txtNextDate").data("kendoDatePicker").value(obj.NextDate);
        $("#txtNxtDatefr").val(obj.NextDateFor);
        $("#cmbStatus1").data("kendoComboBox").value(obj.StatusId);
        
        var statusValue = $("#cmbStatus1").data("kendoComboBox").value();
        if (statusValue == 1) {
            $("#divStatus1").hide();
            $("#txtNextDate").data("kendoDatePicker").enable(true);
            $("#txtNxtDatefr").prop("disabled", false);
        }
        else {
            $("#divStatus1").show();
            $("#txtStatusDate1").val(obj.StatusDate);
            $("#txtNextDate").data("kendoDatePicker").enable(false);
            $("#txtNxtDatefr").prop("disabled", true);
        }

        $("#txtStatusDate1").data("kendoDatePicker").value(obj.StatusDate);
        //if (obj.Status == true) {

        //    $("#chkIsPublish").prop('checked', true);

        //} else {

        //    $("#chkIsPublish").prop('checked', false);

        //};
        var bCostObj = UpdateDiaryDetailsManager.GetUpdateDiaryByCaseFileId(obj.FileMasterId);
        if (bCostObj != null) {
            var obj = bCostObj[0];
            //$("#hdnFileMasterId").val(obj.FileMasterId);
            $("#txtRegNo1").val(obj.RegNo);
            $("#txtCourt1").val(obj.CourtName);
            $("#txtCaseNo1").val(obj.CaseNo);
        }

    },

    CreateUpdateDiaryObject: function (UpdateDiaryObj) {
        
        var obj = new Object();
        obj.DiaryId = $("#hdnUpdateDiaryId").val();
        obj.FileMasterId = $("#hdnFileMasterId").val();
        obj.PreviousDate = kendo.toString($("#txtPreviousDate").data("kendoDatePicker").value());
        obj.PreviousDateFor = $("#txtPrvDatefr").val();
        obj.NextDate = $("#txtNextDate").data("kendoDatePicker").value() == null ? "" : kendo.toString($("#txtNextDate").data("kendoDatePicker").value());
        obj.NextDateFor = $("#txtNxtDatefr").val();
        obj.StatusId = $("#cmbStatus1").data("kendoComboBox").value();
        obj.StatusDate = kendo.toString($("#txtStatusDate1").data("kendoDatePicker").value()) == undefined ? "" : kendo.toString($("#txtStatusDate1").data("kendoDatePicker").value());
        obj.CreatedBy = CurrentUser.USERID;
        obj.UpdatedBy = CurrentUser.USERID;        
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnUpdateDiaryId").val("0");
        $("#hdnFileMasterId").val("0");
        $("#txtRegNo1").val("");
        $("#txtCourt1").val("");
        $("#txtCaseNo1").val("");
        $("#txtPreviousDate").data("kendoDatePicker").value("");
        $("#txtPrvDatefr").val("");
        $("#txtNextDate").data("kendoDatePicker").value("");
        $("#txtNxtDatefr").val("");
        $("#cmbStatus1").data("kendoComboBox").value("");
        $("#txtStatusDate1").data("kendoDatePicker").value("");
        //$("#txtSearchKey").val("");
        //$("#cboCaseFile").data("kendoMultiColumnComboBox").value("");
    },
    GenerateDatePicker: function () {
        
        $("#txtPreviousDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
        $("#txtNextDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: ""
        });
        $("#txtStatusDate1").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    GenerateMulticolumnComboBox: function (ctrlId) {
        $("#" + ctrlId).kendoMultiColumnComboBox({
            dataSource: [],
            dataTextField: "RegNo",
            dataValueField: "FileMasterId",
            columns: [
                { field: "RegNo", title: "Reg No", width: 120 },                
                { field: "CaseNo", title: "Case No", width: 120 },
                { field: "CourtName", title: "Court", width: 120 }
            ],
            filter: "startswith",
            filterFields: ["StyleNo"],
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            index: 0,
            placeholder: "---Select File---",
            height: 400

        });
    },
    GenerateMulticolumnCombo: function () {
        var searchKey = $("#txtSearchKey").val();
        if (searchKey !== "") {
            var data = UpdateDiaryDetailsManager.GetAllFiles(searchKey);
            data.unshift(UpdateDiaryDetailsHelper.GetUnshiftForFileSearch());
            var cboFile = $("#cboCaseFile").data("kendoMultiColumnComboBox");
            cboFile.value("");
            cboFile.setDataSource(data);
            cboFile.select(0);
        } else {
            AjaxManager.MsgBox('warning', 'center', 'Alert', "Please type some text to search file!",
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    },
    GetUnshiftForFileSearch() {
        return {
            FileMasterId: "",
            RegNo: "--Select File--",
            CaseNo: "",
            CourtName: ""
        };
    },
    FillDiaryByFileChange: function (caseFileId) {
        
        var bCostObj = UpdateDiaryDetailsManager.GetUpdateDiaryByCaseFileId(caseFileId);
        if (bCostObj != null) {
            var obj = bCostObj[0];
            $("#hdnFileMasterId").val(obj.FileMasterId);
            $("#txtRegNo1").val(obj.RegNo);
            $("#txtCourt1").val(obj.CourtName);
            $("#txtCaseNo1").val(obj.CaseNo);
        }
    },
    LoadStatusCombo: function (cmbStatus1) {
        UpdateDiaryDetailsHelper.LoadCombo(cmbStatus1, "StatusId", "StatusName", UpdateDiaryDetailsManager.GetStatus(), "--Select Status--");
    },
    LoadCombo(cboId, valueField, textField, dataList, placeholder) {
        if (cboId.trim() == "" || valueField.trim() == "" || textField.trim() == "") return null;
        dataList = dataList == "" ? [] : dataList;
        var obj = new Object();
        obj[valueField] = 0;
        obj[textField] = "---Select---";
        dataList.unshift(obj);
        $("#" + cboId).kendoComboBox({
            placeholder: placeholder,
            dataValueField: valueField,
            dataTextField: textField,
            dataSource: dataList,
            //index: 0,
            suggest: true,
            filter: "contains"
            //change: function () {

            //}
        });
    },
};