var _style = {
    IsWashing: false,
    IsEmbroidery: false,
    IsPrinting: false
};

var _colors = [],
    _sizes = [];

var SmHelper = {
    Init() {
        SmHelper.ShowSummary();
        $("#pnlMaster").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        StyleInfoHelper.Init();
        SmHelper.InitCombos();
        SSCIHelper.InitUploadEvents();
        SmHelper.InitBtn();
        StyleSummaryHelper.InitStyleSummary();
        //DocumentHelper.InitDoc();
    },
    InitBtn() {
        $("#btnSave").click(function () {
            debugger;
            var statusId = $("#cboStatus").data("kendoComboBox").value();
            var parentId = $("#cboStyleSearch").data("kendoMultiColumnComboBox").value();

            if ((parentId == null || parentId == "" || parentId == AjaxManager.DefaultGuidId())
                && (statusId == "c600cf8c-9927-49bc-970b-dc9f5d73a371" ||
                    statusId == "115d25d2-7608-4c9e-bf4d-3ca689383d58")) {
                AjaxManager.MsgBox('warning', 'center', 'Please Confirm', "Is there any projected or master style? If yes, please select projected or master style style.",
                    [{
                        addClass: 'btn btn-primary',
                        text: 'Yes',
                        onClick: function ($noty) {
                            $noty.close();
                            $("#txtSearchKey").focus();
                        }
                    },
                    {
                        addClass: 'btn',
                        text: 'No',
                        onClick: function ($noty) {
                            $noty.close();
                            var validator = $("#divStyleDetails").kendoValidator().data("kendoValidator");
                            //var validator = $("#divStyleDetails").kendoValidator().data("kendoValidator");
                            if (validator.validate()) {
                                if (SmHelper.ValidateStyleForm()) {
                                    debugger;
                                    var model = SmHelper.GetStyleObj();
                                    var serviceUrl = _baseUrl + "/api/Styles/AddStyle";
                                    AjaxManager.SendJsonApiForImage(serviceUrl, model, onSuccess, onFailed);
                                }
                                }
                                    function onSuccess(jsonData) {
                                        jsonData = jsonData.responseJSON;
                                        if (jsonData.Success) {
                                            AjaxManager.MsgBox('success', 'center', 'Success Message', jsonData.Message,
                                                [{
                                                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                                        $noty.close();
                                                        SmHelper.ResetForm();
                                                        SmHelper.ShowSummary();
                                                    }
                                                }]);
                                        } else {
                                            AjaxManager.MsgBox('error', 'center', 'Error Message', jsonData.Message,
                                                [{
                                                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                                        $noty.close();
                                                    }
                                                }]);
                                        }

                                    }
                                    function onFailed(error) {
                                        AjaxManager.MsgBox('error', 'center', 'Error: ', error.statusText,
                                            [{
                                                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                                    $noty.close();
                                                }
                                            }]);
                                    }
                        }
                    }]);
            } else {
                debugger;
                var validator = $("#divStyleDetails").kendoValidator().data("kendoValidator");
                //var validator = $("#divStyleDetails").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    if (SmHelper.ValidateStyleForm()) {
                        debugger;
                        var model = SmHelper.GetStyleObj();
                        var serviceUrl = _baseUrl + "/api/Styles/AddStyle";
                        AjaxManager.SendJsonApiForImage(serviceUrl, model, onSuccess, onFailed);
                    }
                }
                        function onSuccess(jsonData) {
                            jsonData = jsonData.responseJSON;
                            if (jsonData.Success) {
                                AjaxManager.MsgBox('success', 'center', 'Success Message', jsonData.Message,
                                    [{
                                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                            $noty.close();
                                            SmHelper.ResetForm();
                                            SmHelper.ShowSummary();
                                        }
                                    }]);
                            } else {
                                AjaxManager.MsgBox('error', 'center', 'Error Message', "Please give all required information.",
                                    [{
                                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                            $noty.close();
                                        }
                                    }]);
                            }
                        }
                        function onFailed(error) {

                        }                   
                
            }
        });
        $("#btnBack").click(function () {
            SmHelper.ResetForm();
            SmHelper.ShowSummary();
        });
        $("#btnAddNew").click(function () {
            SmHelper.ResetForm();
            SmHelper.ShowDetail();
        });
    },
    GetStyleObj() {        
        var parentId = $("#cboStyleSearch").data("kendoMultiColumnComboBox").value();
        parentId = parentId == null || typeof parentId === "undefined" ? AjaxManager.DefaultGuidId() : parentId;

        var model = new FormData();

        var s = $("#hdnStyleId").val();
        model.append('StyleId', $.trim($("#hdnStyleId").val()));
        model.append('StyleNo', $.trim($("#txtStyleNo").val()));
        model.append('StatusId', $("#cboStatus").data("kendoComboBox").value());
        model.append('UserId', CurrentUser.USERID);

        model.append('ProtoNo', $.trim($("#txtProtoNo").val()));
        model.append('AgentId', $("#cboAgent").data("kendoComboBox").value());
        model.append('BrandId', $("#cboBrand").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cboBrand").data("kendoComboBox").value());
        model.append('BuyerId', $("#cboBuyer").data("kendoComboBox").value());
        model.append('DepartmentId', $("#cboDepartment").data("kendoComboBox").value());

        model.append('IsWashing', _style.IsWashing);
        model.append('IsEmbroidery', _style.IsEmbroidery);
        model.append('IsPrinting', _style.IsPrinting);

        model.append('ProductId', $("#cboProduct").data("kendoComboBox").value());
        model.append('ProductCategoryId', $("#cboProductCategory").data("kendoComboBox").value());
        model.append('ProductTypeId', $("#cboProductType").data("kendoComboBox").value());
        model.append('Remarks', $.trim($("#txtRemarks").val()));
        model.append('Instructions', $.trim($("#txtInstructions").val()));
        model.append('FactoryId', $("#cboCompany").data("kendoComboBox").value());
        model.append('Year', $("#cboYear").data("kendoComboBox").value());
        model.append('ParentId', parentId);


        /*--------Image_Upload----------*/

        var imgFrontPart = null;
        var frontimg = $('#imgFrontPart').attr('src');
        if (frontimg !== "../Images/clickHereToUpload.png") {
            imgFrontPart = new URL(frontimg);
        }
        var imgBackPart = null;
        var backimg = $('#imgBackPart').attr('src');
        if (backimg !== "../Images/clickHereToUpload.png") {
            imgBackPart = new URL(backimg);
        }        

        var filePart = null;
        debugger;
        var frontfile = $('#txtFiles').attr('src');
        if (frontfile !== undefined) {
            filePart = new URL(frontfile);
        }


        var documents = [];
        if (_files.FrontPart != null) {
            documents.push({
                DocId: _files.FrontDocId,
                DocTypeId: _files.FrontDocTypeId,
                DocFile: _files.FrontPart[0].files[0],
                StyleDetailId: $.trim($("#hdnStyleDetailId").val())
            });
        }
        else {
            if (imgFrontPart != null) {
                documents.push({
                    DocId: AjaxManager.DefaultGuidId(),
                    DocTypeId: _files.FrontDocTypeId,
                    DocFilenameWithPath: imgFrontPart.pathname,
                    StyleDetailId: $.trim($("#hdnStyleDetailId").val())
                });
            }
        }

        // Check This Out
        if (_files.BackPart != null) {
            documents.push({
                DocId: _files.BackDocId,
                DocTypeId: _files.BackDocTypeId,
                DocFile: _files.BackPart[0].files[0],
                StyleDetailId: $.trim($("#hdnStyleDetailId").val())
            });
        }
        else {
            if (imgBackPart != null) {
                documents.push({
                    DocId: AjaxManager.DefaultGuidId(),
                    DocTypeId: _files.BackDocTypeId,
                    DocFilenameWithPath: imgBackPart.pathname,
                    StyleDetailId: $.trim($("#hdnStyleDetailId").val())
                });
            }
        }

        if (_files.FilePart != null) {
            debugger;
            documents.push({
                DocId: _files.DocumentId,
                DocTypeId: "b36d8ac6-6b33-4067-befc-644a5fc1296e",
                //DocTypeId: _files.FileTypeId,
                DocFile: _files.FilePart[0].files[0],
                StyleDetailId: $.trim($("#hdnStyleDetailId").val())
            });
        }
        else {
            if (filePart != null) {
                documents.push({                    
                    DocId: AjaxManager.DefaultGuidId(),
                    DocTypeId: "b36d8ac6-6b33-4067-befc-644a5fc1296e",
                    //DocTypeId: _files.FileTypeId,
                    DocFilenameWithPath: filePart.pathname,
                    StyleDetailId: $.trim($("#hdnStyleDetailId").val())
                });
            }

        }
        var index = 0;
        var obj;
        if (documents.length > 0) {
            for (obj of documents) {
                if (obj["DocFile"] != null) {
                    model.append("Documents[" + index + "].DocId", obj["DocId"]);
                    model.append("Documents[" + index + "].DocTypeId", obj["DocTypeId"]);
                    model.append("Documents[" + index + "].DocFile", obj["DocFile"]);
                    model.append("Documents[" + index + "].StyleDetailId", obj["StyleDetailId"]);
                    index++;
                }
                else {
                    model.append("Documents[" + index + "].DocId", obj["DocId"]);
                    model.append("Documents[" + index + "].DocTypeId", obj["DocTypeId"]);
                    model.append("Documents[" + index + "].DocFilenameWithPath", obj["DocFilenameWithPath"]);
                    model.append("Documents[" + index + "].StyleDetailId", obj["StyleDetailId"]);
                    index++;
                }
            }
        }
        

        var styleDetails = [
            {
                StyleId: $.trim($("#hdnStyleId").val()),
                StyleDetailId: $.trim($("#hdnStyleDetailId").val()),
                Year: $("#cboYear").data("kendoComboBox").value(),
                SeasonId: $("#cboSeason").data("kendoComboBox").value(),
                VendorId: $("#cboVendor").data("kendoComboBox").value(),
                FactoryId: $("#cboCompany").data("kendoComboBox").value(),
                StyleColors: SmHelper.GetColors(),
                StyleSizes: SmHelper.GetSizes()
            }
        ];
        index = 0;
        var cIndex = 0,
            sIndex = 0;
        for (obj of styleDetails) {
            model.append("StyleDetails[" + index + "].StyleId", obj["StyleId"]);
            model.append("StyleDetails[" + index + "].StyleDetailId", obj["StyleDetailId"]);
            model.append("StyleDetails[" + index + "].Year", obj["Year"]);
            model.append("StyleDetails[" + index + "].SeasonId", obj["SeasonId"]);
            model.append("StyleDetails[" + index + "].VendorId", obj["VendorId"]);
            model.append("StyleDetails[" + index + "].FactoryId", obj["FactoryId"]);

            for (var cObj of obj.StyleColors) {
                model.append("StyleDetails[" + index + "].StyleColors[" + cIndex + "].ColorId", cObj["ColorId"]);
                model.append("StyleDetails[" + index + "].StyleColors[" + cIndex + "].StyleDetailId", cObj["StyleDetailId"]);
                model.append("StyleDetails[" + index + "].StyleColors[" + cIndex + "].StyleColorId", cObj["StyleColorId"]);
                cIndex++;
            }
            for (var sObj of obj.StyleSizes) {
                model.append("StyleDetails[" + index + "].StyleSizes[" + sIndex + "].SizeId", sObj["SizeId"]);
                model.append("StyleDetails[" + index + "].StyleSizes[" + sIndex + "].StyleDetailId", sObj["StyleDetailId"]);
                model.append("StyleDetails[" + index + "].StyleSizes[" + sIndex + "].StyleSizeId", sObj["StyleSizeId"]);
                sIndex++;
            }
            index++;
        }
        return model;
    },
    GetColors() {
        var colors = [];
        $("#tblColor tbody tr").each(function () {
            colors.push({
                ColorId: $(this).attr("ColorId"),
                StyleDetailId: $("#hdnStyleDetailId").val(),
                StyleColorId: $(this).attr("StyleColorId")
            });
        });
        return colors;
    },
    GetSizes() {
        var sizes = [];
        $("#tblSize tbody tr").each(function () {
            sizes.push({
                SizeId: $(this).attr("SizeId"),
                StyleDetailId: $("#hdnStyleDetailId").val(),
                StyleSizeId: $(this).attr("StyleSizeId")
            });
        });
        return sizes;
    },
    ValidateStyleForm: function () {
        var res = true;
        var status = $("#cboStatus").data("kendoComboBox");
        var buyer = $("#cboBuyer").data("kendoComboBox");
        var brand = $("#cboBrand").data("kendoComboBox");
        var sStyleNo = $("#txtStyleNo").val();
        var categpory = $("#cboProductCategory").data("kendoComboBox");
        var product = $("#cboProduct").data("kendoComboBox");
        var productType = $("#cboProductType").data("kendoComboBox");
        var vendor = $("#cboVendor").data("kendoComboBox");
        var season = $("#cboSeason").data("kendoComboBox");
        if (sStyleNo === "" || sStyleNo === null) {
            AjaxManager.NotifyMsg("txtStyleNo", "error", "right", 1500, "Required");
            res = false;
        }
        if (status.value() === "" || status.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboStatus", "error", "right", 1500, "Required");
            res = false;
        }
        if (buyer.value() === "" || buyer.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboBuyer", "error", "right", 1500, "Required");
            res = false;
        }
        if (brand.value() === "" || brand.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboBrand", "error", "right", 1500, "Required");
            res = false;
        }
        if (categpory.value() === "" || categpory.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboProductCategory", "error", "right", 1500, "Required");
            res = false;
        }
        if (product.value() === "" || product.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboProduct", "error", "right", 1500, "Required");
            res = false;
        }
        if (productType.value() === "" || productType.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboProductType", "error", "right", 1500, "Required");
            res = false;
        }
        if (vendor.value() === "" || vendor.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboVendor", "error", "right", 1500, "Required");
            res = false;
        }
        if (season.value() === "" || season.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboSeason", "error", "right", 1500, "Required");
            res = false;
        }
        return res;
    },

    InitCombos() {
        _colors = ApiManager.GetList(_baseUrl + "/api/CmnColors/all");
        $("#cboColor").kendoComboBox({
            placeholder: "--Select Color--",
            dataValueField: "ColorId",
            dataTextField: "ColorName",
            dataSource: _colors,
            suggest: true,
            filter: "contains",
            change: function () {
                var selectedItem = {
                    ColorId: $("#cboColor").data("kendoComboBox").value(),
                    ColorName: $("#cboColor").data("kendoComboBox").text(),
                    StyleColorId: AjaxManager.DefaultGuidId()
                }
                if (!UtilityHelper.IsNullOrEmpty(selectedItem.ColorId)) SmHelper.AddColor(selectedItem);
                SmHelper.ResetColor();
            }
        });

        _sizes = ApiManager.GetList(_baseUrl + "/api/CmnSizes/all");
        $("#cboSize").kendoComboBox({
            placeholder: "--Select Size--",
            dataValueField: "SizeId",
            dataTextField: "SizeName",
            dataSource: _sizes,
            suggest: true,
            filter: "contains",
            change: function () {
                var selectedItem = {
                    SizeId: $("#cboSize").data("kendoComboBox").value(),
                    SizeName: $("#cboSize").data("kendoComboBox").text(),
                    StyleSizeId: AjaxManager.DefaultGuidId()
                }
                if (!UtilityHelper.IsNullOrEmpty(selectedItem.SizeId)) SmHelper.AddSize(selectedItem);
                SmHelper.ResetSize();
            }
        });

        $("#cboStyleSearch").kendoMultiColumnComboBox({
            dataSource: [],
            dataTextField: "StyleNo",
            dataValueField: "StyleDetailId",
            columns: [
                { field: "StatusName", title: "Status", width: 100 },
                { field: "StyleNo", title: "Style No", width: 200 },
                { field: "BuyerName", title: "Buyer", width: 200 },
                { field: "BrandName", title: "Brand", width: 200 },
                { field: "DepartmentName", title: "Department", width: 200 },
                { field: "SeasonName", title: "Season", width: 200 },
                { field: "Year", title: "Year", width: 80 }
            ],
            filter: "startswith",
            filterFields: ["StyleNo"],
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            index: 0,
            placeholder: "--Select Master / Projected Style--",
            change: function () {
                var buyerId = $("#cboBuyer").data("kendoComboBox").value();
                var brandId = $("#cboBrand").data("kendoComboBox").value();
                if ($.trim(buyerId).length == 0 && $.trim(brandId).length == 0) {
                    var styleDetailId = $("#cboStyleSearch").data("kendoMultiColumnComboBox").value();
                    var styleDetail = MerchantManager.GetStyleDetailById(styleDetailId);
                    var style = MerchantManager.GetStyleById(styleDetail.StyleId);

                    SSCIHelper.ResetFileDocPaths();

                    var docs = styleDetail.StyleDocuments;
                    $.map(docs, function (doc) {
                        var path = _baseUrl + "/" + doc.DocFilenameWithPath;
                        $("img[docType='" + doc.DocTypeId + "']").attr("src", path);
                        if (doc.DocTypeId == _files.FrontDocTypeId) _files.FrontDocPath = path;
                        else if (doc.DocTypeId == _files.BackDocTypeId) _files.BackDocPath = path;
                    });

                    style["StyleDetails"] = [];
                    style.StyleDetails.push(styleDetail);

                    style = JSON.stringify(style);

                    var docs = styleDetail.StyleDocuments;
                    $.map(docs, function (doc) {
                        style = style.split(doc.DocId).join(AjaxManager.DefaultGuidId());
                    });

                    var colors = styleDetail.StyleColors;
                    $.map(colors, function (color) {
                        style = style.split(color.StyleColorId).join(AjaxManager.DefaultGuidId());
                    });
                    SmHelper.ResetColor();

                    var sizes = styleDetail.StyleSizes;
                    $.map(sizes, function (size) {
                        style = style.split(size.StyleSizeId).join(AjaxManager.DefaultGuidId());
                    });
                    SmHelper.ResetSize();

                    style = style.split(styleDetailId).join(AjaxManager.DefaultGuidId());
                    style = style.split(styleDetail.StyleId).join(AjaxManager.DefaultGuidId());
                    style = JSON.parse(style);
                    console.log(style);

                    SmHelper.FillStyleForm(style, false);
                }
            }
        });

        $("#btnSearchStyle").click(function () {
            SmHelper.LoadStyle();
        });
        $('#txtSearchKey').keypress(function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode === 13) {
                SmHelper.LoadStyle();
            }
        });
    },
    LoadStyle() {
        SmHelper.ResetStyleSearch();
        var searchValue = $("#txtSearchKey").val();
        var data = MerchantManager.GetAllStyleWithStatus(searchValue);
        data.unshift(UtilityUnShift.GetUnshiftForStyleSearch());
        $("#cboStyleSearch").data("kendoMultiColumnComboBox").setDataSource(data);
    },
    AddColor(selectedItem) {
        $("#tblColor tbody").append("<tr ColorId='" + selectedItem.ColorId + "' StyleColorId='" + selectedItem.StyleColorId + "' ><td>" + selectedItem.ColorName + "</td><td><span class='btnRemoveColor' style='cursor: pointer;' title='Remove'>X</span></td></tr>");
        $("#tblColor tbody tr[ColorId='" + selectedItem.ColorId + "'] .btnRemoveColor").click(function () {
            $("#tblColor tbody tr[ColorId='" + selectedItem.ColorId + "']").remove();
            SmHelper.ResetColor();
        });
    },
    ResetColor() {
        $("#cboColor").data("kendoComboBox").setDataSource([]);
        var newColors = [],
            alreadyUsedColors = [];
        $("#tblColor tbody tr").each(function () {
            alreadyUsedColors.push($(this).attr("ColorId"));
        });
        $.map(_colors, function (color) {
            if (!alreadyUsedColors.includes(color.ColorId)) newColors.push(color);
        });
        $("#cboColor").data("kendoComboBox").setDataSource(newColors);
        $("#cboColor").data("kendoComboBox").value("");
    },
    AddSize(selectedItem) {
        $("#tblSize tbody").append("<tr SizeId='" + selectedItem.SizeId + "' StyleSizeId='" + selectedItem.StyleSizeId + "' ><td>" + selectedItem.SizeName + "</td><td><span class='btnRemoveSize' style='cursor: pointer;' title='Remove'>X</span></td></tr>");
        $("#tblSize tbody tr[SizeId='" + selectedItem.SizeId + "'] .btnRemoveSize").click(function () {
            $("#tblSize tbody tr[SizeId='" + selectedItem.SizeId + "']").remove();
            SmHelper.ResetSize();
        });
    },
    ResetSize() {
        $("#cboSize").data("kendoComboBox").setDataSource([]);
        var newSizes = [],
            alreadyUsedSizes = [];
        $("#tblSize tbody tr").each(function () {
            alreadyUsedSizes.push($(this).attr("SizeId"));
        });
        $.map(_sizes, function (size) {
            if (!alreadyUsedSizes.includes(size.SizeId)) newSizes.push(size);
        });
        $("#cboSize").data("kendoComboBox").setDataSource(newSizes);
        $("#cboSize").data("kendoComboBox").value("");
    },
    FillStyleForm: function (obj, isEdit) {

        SSCIHelper.ResetFile();
        SSCIHelper.SetDefaultImage();
        $("#hdnStyleId").val(obj.StyleId);
        $("#txtStyleNo").val(obj.StyleNo);
        $("#hdnCreateDate").val(obj.CreatedAt);

        _style.IsWashing = obj.IsWashing;
        _style.IsEmbroidery = obj.IsEmbroidery;
        _style.IsPrinting = obj.IsPrinting;

        $("#cboStatus").data("kendoComboBox").value(obj.StatusId);

        var date = (new Date()).toISOString().split('T')[0];
        var days = daysdifference(obj.CreatedAt, date);
        function daysdifference(firstDate, secondDate) {
            var startDay = new Date(firstDate);
            var endDay = new Date(secondDate);
            var millisBetween = startDay.getTime() - endDay.getTime();
            var days = millisBetween / (1000 * 3600 * 24);
            return Math.round(Math.abs(days));
        }

        if (isEdit && days >= 7) {
            $("#txtStyleNo").attr('disabled', 'disabled');
            $("#btnSave").text("Update");
        } else {
            $("#txtStyleNo").removeAttr('disabled');
            $("#btnSave").text("Save");
        }
        $("#txtProtoNo").val(obj.ProtoNo);
        $("#cboAgent").data("kendoComboBox").value(obj.AgentId);
        $("#cboBuyer").data("kendoComboBox").value(obj.BuyerId);

        StyleInfoHelper.LoadBrands();
        $("#cboBrand").data("kendoComboBox").value(obj.BrandId);
        StyleInfoHelper.LoadDepartments();
        $("#cboDepartment").data("kendoComboBox").value(obj.DepartmentId);
        $("#txtInstructions").val(obj.Instructions);
        $("#cboProduct").data("kendoComboBox").value(obj.ProductId);
        $("#cboProductType").data("kendoComboBox").value(obj.ProductTypeId);

        $("#cboProductCategory").data("kendoComboBox").value(obj.ProductCategoryId);
        $("#txtRemarks").val(obj.Remarks);        

        var styleDetail = obj.StyleDetails[0];
        $("#hdnStyleDetailId").val(styleDetail.StyleDetailId);

        $("#cboCompany").data("kendoComboBox").value(styleDetail.FactoryId);
        $("#cboYear").data("kendoComboBox").value(styleDetail.Year);
        $("#cboSeason").data("kendoComboBox").value(styleDetail.SeasonId);
        $("#cboVendor").data("kendoComboBox").value(styleDetail.VendorId);

        $("#tblColor tbody, #tblSize tbody").empty();

        SmHelper.ResetStyleSearch();

        if (obj.ParentId != null && obj.ParentId != AjaxManager.DefaultGuidId) {
            var data = MerchantManager.GetAllStyleWithStatus(obj.ParentId);
            var cboStyle = $("#cboStyleSearch").data("kendoMultiColumnComboBox");
            cboStyle.setDataSource(data);
            cboStyle.value(obj.ParentId == AjaxManager.DefaultGuidId() ? "" : obj.ParentId);
        }

        styleDetail = MerchantManager.GetStyleDetailById(styleDetail.StyleDetailId);
        var isUndefined = false;
        if (typeof styleDetail === "undefined") {
            styleDetail = obj.StyleDetails[0];
            isUndefined = true;
        }

        if (styleDetail != null) {
            var colors = styleDetail.StyleColors;
            $.map(colors, function (color) {
                SmHelper.AddColor(color);
            });
            SmHelper.ResetColor();

            var sizes = styleDetail.StyleSizes;
            $.map(sizes, function (size) {
                SmHelper.AddSize(size);
            });
            SmHelper.ResetSize();

            var docs = styleDetail.StyleDocuments;
            //Fixed It
            debugger;
            $.map(docs, function (doc) {
                if (!isUndefined) {
                    var path = _baseUrl + "/" + doc.DocFilenameWithPath;
                    $("img[docType='" + doc.DocTypeId + "']").attr("src", path);
                    if (doc.DocTypeId == _files.FrontDocTypeId) _files.FrontDocId = doc.DocId;
                    else if (doc.DocTypeId == _files.BackDocTypeId) _files.BackDocId = doc.DocId;
                    else if (doc.DocTypeId == _files.FileTypeId) _files.DocumentId = doc.DocId;
                } else {
                    if (doc.DocTypeId == _files.FrontDocTypeId) {
                        _files.FrontDocId = doc.DocId;
                        $("img[docType='" + doc.DocTypeId + "']").attr("src", _files.FrontDocPath);
                    }
                    else if (doc.DocTypeId == _files.BackDocTypeId) {
                        _files.BackDocId = doc.DocId;
                        $("img[docType='" + doc.DocTypeId + "']").attr("src", _files.BackDocPath);
                    }
                    //else if (doc.DocTypeId == "b36d8ac6-6b33-4067-befc-644a5fc1296e") {
                    //    _files.DocumentId = doc.DocId;
                    //    //$("#txtFiles").val(_files.FilePath);
                    //    $("img[docType='" + doc.DocTypeId + "']").attr("src", _files.FilePath);
                    
                }
                $("#txtFiles").val(_files.FilePath);
            });
            $("#btnSave").text(" Update");
            $("#btnSave").addClass("fa fa-save");
        }
    },
    ResetStyleSearch() {
        var cboStyle = $("#cboStyleSearch").data("kendoMultiColumnComboBox");
        cboStyle.value("");
        cboStyle.setDataSource([]);
        cboStyle.select(0);
    },
    ResetForm() {
        $("#btnSave").text(" Save").addClass("fa fa-save");
        SSCIHelper.ResetFileParts();
        _style = {
            IsWashing: false,
            IsEmbroidery: false,
            IsPrinting: false
        };

        var newGuid = AjaxManager.DefaultGuidId();
        $("#hdnStyleId").val(newGuid);
        $("#txtStyleNo").val("");

        $("#cboStatus").data("kendoComboBox").value("");

        $("#txtProtoNo").val("");

        $("#cboAgent").data("kendoComboBox").value("");
        $("#cboBuyer").data("kendoComboBox").value("");

        $("#cboBrand").data("kendoComboBox").setDataSource([]);
        $("#cboBrand").data("kendoComboBox").value("");

        $("#cboDepartment").data("kendoComboBox").setDataSource([]);
        $("#cboDepartment").data("kendoComboBox").value("");

        $("#txtInstructions").val("");

        $("#cboProduct").data("kendoComboBox").value("");
        $("#cboProductType").data("kendoComboBox").value("");
        $("#cboProductCategory").data("kendoComboBox").value("");

        $("#txtRemarks").val("");

        $("#txtSearchKey").val("");
        SmHelper.ResetStyleSearch();

        $("#hdnStyleDetailId").val(newGuid);
        $("#cboCompany").data("kendoComboBox").value("");
        $("#cboYear").data("kendoComboBox").value(2022);
        $("#cboSeason").data("kendoComboBox").value("");
        $("#cboVendor").data("kendoComboBox").value("");
        $("#tblColor tbody, #tblSize tbody").empty();
        $("#cboColor").data("kendoComboBox").setDataSource(_colors);
        $("#cboSize").data("kendoComboBox").setDataSource(_sizes);

        SSCIHelper.SetDefaultImage();

        $("#grdStyleSummary").data("kendoGrid").dataSource.read();
    },
    ShowSummary() {
        $("#divStyleDetails").hide();
        $("#divStyleSummary").show();
    },
    ShowDetail() {
        $("#divStyleDetails").show();
        $("#divStyleSummary").hide();
    },
    GetProductByCategoryId: function (productCategoryId) {
        var objProduct = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/MerchProducts/product/" + productCategoryId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objProduct = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objProduct;
    },
}

var StyleInfoHelper = {
    Init() {
        StyleInfoHelper.InitCombos();
    },
    InitCombos() {
        $(".hiddenId").val(AjaxManager.DefaultGuidId());

        MerchantHelper.LoadStatusCombo("cboStatus", 1);
        MerchantHelper.LoadProductCategoryCombo("cboProductCategory");
        MerchantHelper.LoadProductCombo("cboProduct");
        MerchantHelper.LoadProductTypeCombo("cboProductType");
        MerchantHelper.LoadAgentCombo("cboAgent");
        MerchantHelper.LoadSeasonCombo("cboSeason");
        MerchantHelper.LoadYearCombo("cboYear");
        MerchantHelper.LoadVendorCombo("cboVendor");
        MerchantHelper.LoadCompanyCombo("cboCompany");

        var buyers = ApiManager.GetList(_baseUrl + "/api/Buyers/all");
        $("#cboBuyer").kendoComboBox({
            placeholder: "--Select Buyer--",
            dataValueField: "BuyerId",
            dataTextField: "BuyerName",
            dataSource: buyers,
            suggest: true,
            filter: "contains",
            change: function () {
                StyleInfoHelper.LoadBrands();
                StyleInfoHelper.LoadDepartments();
            }
        });
        $("#cboBrand").kendoComboBox({
            placeholder: "--Select Brand--",
            dataValueField: "BrandId",
            dataTextField: "BuyerBrandName",
            dataSource: [],
            suggest: true,
            filter: "contains",
            change: function () {
                StyleInfoHelper.LoadDepartments();
            }
        });
        $("#cboDepartment").kendoComboBox({
            placeholder: "--Select Department--",
            dataValueField: "DepartmentId",
            dataTextField: "BuyerDepartmentName",
            dataSource: [],
            suggest: true,
            filter: "contains",
            change: function () {

            }
        });
        $("#cboProductCategory").change(function () {
            StyleInfoHelper.ChangeEventOfCategoryCombo();
        });

    },
    LoadBrands() {
        // $("#cboBrand").data("kendoComboBox").setDataSource([]);
        $("#cboBrand").data("kendoComboBox").text("");
        var buyerId = $("#cboBuyer").data("kendoComboBox").value(),
            brands = [];
        if (!UtilityHelper.IsNullOrEmpty(buyerId)) {
            brands = ApiManager.GetList(_baseUrl + "/api/BuyerBrands/brands/" + buyerId);
            brands.unshift({
                BrandId: "",
                BuyerBrandName: "--Select Brand--"
            });
            $("#cboBrand").data("kendoComboBox").setDataSource(brands);
        }
    },
    LoadDepartments() {
        //$("#cboDepartment").data("kendoComboBox").setDataSource([]);
        $("#cboDepartment").data("kendoComboBox").text("");
        var brandId = $("#cboBrand").data("kendoComboBox").value(),
            departments = [];
        if (!UtilityHelper.IsNullOrEmpty(brandId)) {
            departments = ApiManager.GetList(_baseUrl + "/api/BrandDepartments/department/" + brandId);
            departments.unshift({
                DepartmentId: "",
                BuyerDepartmentName: "--Select Department--"
            });
            $("#cboDepartment").data("kendoComboBox").setDataSource(departments);
        }
    },
    ChangeEventOfCategoryCombo: function () {
        var productCategoryId = $("#cboProductCategory").data("kendoComboBox").value();
        var data = SmHelper.GetProductByCategoryId(productCategoryId);
        var productCombo = $("#cboProduct").data("kendoComboBox");
        productCombo.value("");
        productCombo.text("");
        productCombo.setDataSource(data);
    },
}