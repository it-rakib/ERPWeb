var _style = {
    IsWashing: false,
    IsEmbroidery: false,
    IsPrinting: false
};

var _colors = [],
    _sizes = [];

var SmARHelper = {
    Init() {
        SmARHelper.ShowSummary();
        $("#pnlMaster").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        StyleInfoHelper.Init();
        SmARHelper.InitCombos();
        SSCIHelper.InitUploadEvents();
        SmARHelper.InitBtn();
        StyleARSummaryHelper.InitStyleSummary();
    },
    InitBtn() {
        $("#btnApprove").click(function () {
           // var statusId = $("#cboStatus").data("kendoComboBox").value();
            //var parentId = $("#cboStyleSearch").data("kendoMultiColumnComboBox").value();
            
            var obj = SmARHelper.GetStyleARObj("720B6821-33A4-4B97-982A-8CC8B787513D");
            var jsonParam = JSON.stringify(obj);
            var serviceUrl = _baseUrl + "/api/Styles/CreateAcknowledgement";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                function onSuccess(jsonData) {
                   // jsonData = jsonData;
                    if (jsonData.Success) {
                        AjaxManager.MsgBox('success', 'center', 'Success Message', jsonData.Message,
                            [{
                                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                    $noty.close();
                                    SmARHelper.ResetForm();
                                    SmARHelper.ShowSummary();
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
                debugger;   
                    AjaxManager.MsgBox('error', 'center', 'Error: ', error.statusText,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
                }
            
        });
        $("#btnReject").click(function () {
           // var statusId = $("#cboStatus").data("kendoComboBox").value();
            //var parentId = $("#cboStyleSearch").data("kendoMultiColumnComboBox").value();
            debugger;
            var obj = SmARHelper.GetStyleARObj("3CEB6E53-4CF8-4C46-A0B0-03195CF1C34A");
            var jsonParam = JSON.stringify(obj);
            var serviceUrl = _baseUrl + "/api/Styles/CreateAcknowledgement";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                function onSuccess(jsonData) {
                    jsonData = jsonData.responseJSON;
                    if (jsonData.Success) {
                        AjaxManager.MsgBox('success', 'center', 'Success Message', jsonData.Message,
                            [{
                                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                    $noty.close();
                                    SmARHelper.ResetForm();
                                    SmARHelper.ShowSummary();
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

                }
            
        });

        $("#btnBack").click(function () {
            SmARHelper.ResetForm();
            SmARHelper.ShowSummary();
        });
        $("#btnAddNew").click(function () {
            SmARHelper.ResetForm();
            SmARHelper.ShowDetail();
        });
    },
    GetStyleARObj(value) {
      
        var obj = new Object();
        obj.CommentId = AjaxManager.DefaultGuidId();
        obj.StatusId = value;
        obj.StyleId = $("#hdnStyleId").val();
        obj.Comments = $("#txtComment").val();
        obj.UserId = CurrentUser.USERID;
        obj.POId = AjaxManager.DefaultGuidId();
        obj.BuyerCostingId = AjaxManager.DefaultGuidId();

       


        return obj;
    },
    GetStyleObj() {

        var parentId = $("#cboStyleSearch").data("kendoMultiColumnComboBox").value();
        parentId = parentId == null || typeof parentId === "undefined" ? AjaxManager.DefaultGuidId() : parentId;

        var model = new FormData();
        model.append('StyleId', $.trim($("#hdnStyleId").val()));
        model.append('StyleNo', $.trim($("#txtStyleNo").val()));
        model.append('StatusId', $("#cboStatus").data("kendoComboBox").value());
        model.append('UserId', CurrentUser.USERID);
        //model.append('CreatedAt', $.trim($("#hdnCreateDate").val()));

        model.append('ProtoNo', $.trim($("#txtProtoNo").val()));
        model.append('AgentId', $("#cboAgent").data("kendoComboBox").value());
        model.append('BrandId', $("#cboBrand").data("kendoComboBox").value());
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


        console.log(imgFrontPart.pathname + "\t" + imgBackPart);
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
        var index = 0;
        var details;
        if (documents.length > 0) {
            for (details of documents) {
                if (details["DocFile"] != null) {
                    model.append("Documents[" + index + "].DocId", details["DocId"]);
                    model.append("Documents[" + index + "].DocTypeId", details["DocTypeId"]);
                    model.append("Documents[" + index + "].DocFile", details["DocFile"]);
                    model.append("Documents[" + index + "].StyleDetailId", details["StyleDetailId"]);
                    index++;
                }
                else {
                    model.append("Documents[" + index + "].DocId", details["DocId"]);
                    model.append("Documents[" + index + "].DocTypeId", details["DocTypeId"]);
                    model.append("Documents[" + index + "].DocFilenameWithPath", details["DocFilenameWithPath"]);
                    model.append("Documents[" + index + "].StyleDetailId", details["StyleDetailId"]);
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
                StyleColors: SmARHelper.GetColors(),
                StyleSizes: SmARHelper.GetSizes()
            }
        ];
        index = 0;
        var cIndex = 0,
            sIndex = 0;
        for (details of styleDetails) {
            model.append("StyleDetails[" + index + "].StyleId", details["StyleId"]);
            model.append("StyleDetails[" + index + "].StyleDetailId", details["StyleDetailId"]);
            model.append("StyleDetails[" + index + "].Year", details["Year"]);
            model.append("StyleDetails[" + index + "].SeasonId", details["SeasonId"]);
            model.append("StyleDetails[" + index + "].VendorId", details["VendorId"]);
            model.append("StyleDetails[" + index + "].FactoryId", details["FactoryId"]);

            for (var cObj of details.StyleColors) {
                model.append("StyleDetails[" + index + "].StyleColors[" + cIndex + "].ColorId", cObj["ColorId"]);
                model.append("StyleDetails[" + index + "].StyleColors[" + cIndex + "].StyleDetailId", cObj["StyleDetailId"]);
                model.append("StyleDetails[" + index + "].StyleColors[" + cIndex + "].StyleColorId", cObj["StyleColorId"]);
                cIndex++;
            }
            for (var sObj of details.StyleSizes) {
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
                if (!UtilityHelper.IsNullOrEmpty(selectedItem.ColorId)) SmARHelper.AddColor(selectedItem);
                SmARHelper.ResetColor();
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
                if (!UtilityHelper.IsNullOrEmpty(selectedItem.SizeId)) SmARHelper.AddSize(selectedItem);
                SmARHelper.ResetSize();
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
            index: 1,
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
                    SmARHelper.ResetColor();

                    var sizes = styleDetail.StyleSizes;
                    $.map(sizes, function (size) {
                        style = style.split(size.StyleSizeId).join(AjaxManager.DefaultGuidId());
                    });
                    SmARHelper.ResetSize();

                    style = style.split(styleDetailId).join(AjaxManager.DefaultGuidId());
                    style = style.split(styleDetail.StyleId).join(AjaxManager.DefaultGuidId());
                    style = JSON.parse(style);
                    console.log(style);

                    SmARHelper.FillStyleForm(style, false);
                }
            }
        });

        $("#btnSearchStyle").click(function () {
            SmARHelper.LoadStyle();
        });
        $('#txtSearchKey').keypress(function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode === 13) {
                SmARHelper.LoadStyle();
            }
        });
    },
    LoadStyle() {
        SmARHelper.ResetStyleSearch();
        var searchValue = $("#txtSearchKey").val();
        var data = MerchantManager.GetAllStyleWithStatus(searchValue);
        data.unshift(UtilityUnShift.GetUnshiftForStyleSearch());
        $("#cboStyleSearch").data("kendoMultiColumnComboBox").setDataSource(data);
    },
    AddColor(selectedItem) {
        $("#tblColor tbody").append("<tr ColorId='" + selectedItem.ColorId + "' StyleColorId='" + selectedItem.StyleColorId + "' ><td>" + selectedItem.ColorName + "</td><td><span class='btnRemoveColor' style='cursor: pointer;' title='Remove'>X</span></td></tr>");
        $("#tblColor tbody tr[ColorId='" + selectedItem.ColorId + "'] .btnRemoveColor").click(function () {
            $("#tblColor tbody tr[ColorId='" + selectedItem.ColorId + "']").remove();
            SmARHelper.ResetColor();
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
            SmARHelper.ResetSize();
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
        $("#txtStyleNo").text(obj.StyleNo);
        $("#hdnCreateDate").val(obj.CreatedAt);

        _style.IsWashing = obj.IsWashing;
        _style.IsEmbroidery = obj.IsEmbroidery;
        _style.IsPrinting = obj.IsPrinting;

        $("#cboStatus").data("kendoComboBox").value(obj.StatusId);
        $("#lblStatus").text($("#cboStatus").data("kendoComboBox").text());

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
        $("#txtProtoNo").text(obj.ProtoNo);
        $("#cboAgent").data("kendoComboBox").value(obj.AgentId);
        $("#lblAgent").text($("#cboAgent").data("kendoComboBox").text());
        $("#cboBuyer").data("kendoComboBox").value(obj.BuyerId);
        $("#lblBuyer").text($("#cboBuyer").data("kendoComboBox").text());
        StyleInfoHelper.LoadBrands();
        $("#cboBrand").data("kendoComboBox").value(obj.BrandId);
        $("#lblBrand").text($("#cboBrand").data("kendoComboBox").text());
        StyleInfoHelper.LoadDepartments();
        $("#cboDepartment").data("kendoComboBox").value(obj.DepartmentId);
        $("#lblDepartment").text($("#cboDepartment").data("kendoComboBox").text());
        $("#txtInstructions").text(obj.Instructions);
        $("#cboProduct").data("kendoComboBox").value(obj.ProductId);
        $("#lblProduct").text($("#cboProduct").data("kendoComboBox").text());
        $("#cboProductType").data("kendoComboBox").value(obj.ProductTypeId);
        $("#lblProductType").text($("#cboProductType").data("kendoComboBox").text());

        $("#cboProductCategory").data("kendoComboBox").value(obj.ProductCategoryId);
        $("#lblProductCategory").text($("#cboProductCategory").data("kendoComboBox").text());
        $("#txtRemarks").text(obj.Remarks);

        var styleDetail = obj.StyleDetails[0];
        $("#hdnStyleDetailId").val(styleDetail.StyleDetailId);

        $("#cboCompany").data("kendoComboBox").value(styleDetail.FactoryId);
        $("#lblCompany").text($("#cboCompany").data("kendoComboBox").text());
        $("#cboYear").data("kendoComboBox").value(styleDetail.Year);
        $("#lblYear").text($("#cboYear").data("kendoComboBox").text());
        $("#cboSeason").data("kendoComboBox").value(styleDetail.SeasonId);
        $("#lblSeason").text($("#cboSeason").data("kendoComboBox").text());
        $("#cboVendor").data("kendoComboBox").value(styleDetail.VendorId);
        $("#lblVendor").text($("#cboVendor").data("kendoComboBox").text());
        $("#projected").text(obj.ParentId);

        $("#tblColor tbody, #tblSize tbody").empty();

        // SmARHelper.ResetStyleSearch();
        if (obj.ParentId != null && obj.ParentId != AjaxManager.DefaultGuidId) {
            var data = MerchantManager.GetAllStyleWithStatus(obj.ParentId);
            var cboStyle = $("#cboStyleSearch").data("kendoMultiColumnComboBox");
            cboStyle.setDataSource(data);
            cboStyle.value(obj.ParentId == AjaxManager.DefaultGuidId() ? "" : obj.ParentId);
            $("#projected").text(cboStyle.text());
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
                SmARHelper.AddColor(color);
            });
            SmARHelper.ResetColor();

            var sizes = styleDetail.StyleSizes;
            $.map(sizes, function (size) {
                SmARHelper.AddSize(size);
            });
            SmARHelper.ResetSize();

            var docs = styleDetail.StyleDocuments;
            $.map(docs, function (doc) {
                if (!isUndefined) {
                    var path = _baseUrl + "/" + doc.DocFilenameWithPath;
                    $("img[docType='" + doc.DocTypeId + "']").attr("src", path);
                    if (doc.DocTypeId == _files.FrontDocTypeId) _files.FrontDocId = doc.DocId;
                    else if (doc.DocTypeId == _files.BackDocTypeId) _files.BackDocId = doc.DocId;
                } else {
                    if (doc.DocTypeId == _files.FrontDocTypeId) {
                        _files.FrontDocId = doc.DocId;
                        $("img[docType='" + doc.DocTypeId + "']").attr("src", _files.FrontDocPath);
                    }
                    else if (doc.DocTypeId == _files.BackDocTypeId) {
                        _files.BackDocId = doc.DocId;
                        $("img[docType='" + doc.DocTypeId + "']").attr("src", _files.BackDocPath);
                    }
                }
            });
        }
        //$('input[type="text"], textarea,select').each(function () {
        //    $(this).attr('readonly', 'readonly');
        //});
        //$('.comboBox').each(function () {
        //    $(this).attr('readonly', 'readonly');
        //});


        //$('.comboBox').attr('disabled', true);
    },
    ResetStyleSearch() {

        var cboStyle = $("#cboStyleSearch").data("kendoMultiColumnComboBox");
        cboStyle.value("");
        cboStyle.setDataSource([]);
        cboStyle.select(0);
    },
    ResetForm() {
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
        SmARHelper.ResetStyleSearch();

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
        var data = SmARHelper.GetProductByCategoryId(productCategoryId);
        var productCombo = $("#cboProduct").data("kendoComboBox");
        productCombo.value("");
        productCombo.text("");
        productCombo.setDataSource(data);
    },
}