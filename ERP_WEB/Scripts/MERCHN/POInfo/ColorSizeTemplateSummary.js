var size = {};
var addColumnBtn = 0;
var colorList;
var styleList;
var ErrorList = [];
var QuantityRateError = [];

var ColorSizeTemplateSummaryManager = {
    GetTemplateSizeByStyleDetails: function (value) {
        
        var styleDetails = value;
        var objColor = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/POSizeBreakdownTemplate/GetPOSizeColorBreakDownTempByStyleDetailId/" + styleDetails ;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objColor = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objColor;
    },
    GetAllSizeGridData: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            transport: {
                read: {
                    url: _baseUrl + '/api/CmnSizes/GetAllGridData',
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            schema: {
                model: {
                    id: "SizeId"
                },
                data: "Items", total: "TotalCount"
            },

        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetStyleDeatilsDropdown: function () {
        var objStyle = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/Styles/GetStyleDropdownForPo";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objStyle = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objStyle;
    },
    NewSavePOInfo: function () {
        if (PODetailsHelper.ValidateForm()) {
            debugger;
            var command = ColorSizeTemplateSummaryHelper.NewCreatePOInfoObject();
            if (ErrorList.length > 0) {
                for (var i = 0; i < ErrorList.length; i++) {
                    AjaxManager.MsgBox('error', 'center', 'Error1', ErrorList[i],
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
                }
            }
            else if (QuantityRateError.length > 0) {
                AjaxManager.MsgBox('information', 'center', 'Are You Confirm to Save this information ?', "In Table Quantity are Missing in Some Row. For Further Check Click No. To Save Click Yes.",
                    [{
                        addClass: 'btn btn-primary',
                        text: 'Yes',
                        onClick: function ($noty) {
                            $noty.close();
                            var jsonParam = JSON.stringify(command);
                            var serviceUrl = _baseUrl + "/api/PurchaseOrders/CreateOrUpdatePurchaseOrder";
                            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                        }
                    },
                    {
                        addClass: 'btn',
                        text: 'No',
                        onClick: function ($noty) {
                            $noty.close();

                        }
                    }]);
            }
            else {
                var jsonParam = JSON.stringify(command);
                var serviceUrl = _baseUrl + "/api/PurchaseOrders/CreateOrUpdatePurchaseOrder";
                AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
            }
            ErrorList = [];
            QuantityRateError = [];
        }
        function onSuccess(jsonData) {
            var msg = jsonData.Message;
            if (jsonData.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#hdnPOId").val(jsonData.createPurchaseOrderDto.Poid);
                            $("#txtPONo").val(jsonData.createPurchaseOrderDto.Pono);

                        }
                    }]);
                location.reload();
            }

            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', jsonData.Message,
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

var ColorSizeTemplateSummaryHelper = {
    InitColorSizTemplateeSummary: function () {
        ColorSizeTemplateSummaryHelper.ShowInitailTable();

        colorList = MerchantManager.GetAllColor();
        ColorSizeTemplateSummaryHelper.GenerateColorsCombo("cmbColor1_1");

        ColorSizeTemplateSummaryHelper.GenerateStyleMultiColumnComboBoxForPo("cmbStyle1_1");
        styleList = ColorSizeTemplateSummaryManager.GetStyleDeatilsDropdown();
        ColorSizeTemplateSummaryHelper.LoadStyleCombo("cmbStyle1_1");

        $('.btnNewStyle').click(function () {

            var tableId = $('#container table:last').
                attr('id');
            var tableIndex = tableId.split('_');


            var initialTable = ColorSizeTemplateSummaryHelper.InitailTableStructure();
            $("#container").find(".btnNewStyle").before(initialTable);

            
            var totalTable = parseInt(tableIndex[1]) + 1;  //$(`#container table`).length;
            debugger;

            //var lastTableId = $('#container table:last').attr('id');
            //var split_id = lastTableId.split('_');
            //var tableIndex = parseInt(split_id[1]) + 1;
            $('#container table:last').
                attr('id', 'table_' + totalTable);

            $('#container table:last').find(`#cmbColor1_1`).attr('id', `cmbColor${totalTable}_1`);
            $('#container table:last').find(`input[name$="cmbColor1_1"]`).attr('name', `cmbColor${totalTable}_1`);

            $('#container table:last').find(`#cmbStyle1_1`).attr('id', `cmbStyle${totalTable}_1`);
            $('#container table:last').find(`input[name$="cmbStyle1_1"]`).attr('name', `cmbStyle${totalTable}_1`);
            ColorSizeTemplateSummaryHelper.ColorAndStyleDropDown(totalTable);
            // var x = $(this).closest('table').prev().prev().attr('id','table_2');
            //ColorSizeTemplateSummaryHelper.AddNewTable(this);

            //$('#container table:last').find(`.btnNewTemplate`).after(`<button class="k-button-danger" style="min-width:20px"  onClick="ColorSizeTemplateSummaryHelper.RemoveTable(this)"><span class="glyphicon glyphicon-trash"></span></button>`);
            $('#container table:last').find(`.removeTable`).after(`<button class="k-button-danger btn-md" style="min-width:20px"  onClick="ColorSizeTemplateSummaryHelper.RemoveTable(this)" data-toggle="tooltip" data-placement="right" title="Remove Table"><span class="glyphicon glyphicon-remove-circle"></span></button>`);

        });
        //$('.newSave').click(function () {
        //    var table = {};
        //    var ListOfTable = [];
        //    var tbody = {};
        //    tbody.ListOfTBody = [];
        //    $.each($("#container table"), function () {
        //        var tableId = this.id;
        //        $.each($(`#${tableId} tbody`), function () {
        //            var tbodyId = this.id;
        //            
        //            var tbodyRow = {};
        //            var tableIndex = tableId.split('_');
        //            var tbodyIndex = tbodyId.split('_');

        //            //tbodyRow.StyleId = $(`#${tableId} #${tbodyId} .cmbStyles`).val();
        //            //tbodyRow.ColorId = $(`#${tableId} #${tbodyId} .cmbColors`).val();
        //            //tbodyRow.ColorId = $(`#${tableId} #${tbodyId} #cmbColor${tableId}_${tbodyId}`).value;
        //            tbodyRow.StyleId = $(`#cmbStyle${tableIndex[1]}_${tbodyIndex[1]}`).data("kendoMultiColumnComboBox").value();
        //            tbodyRow.ColorId = $(`#cmbColor${tableIndex[1]}_${tbodyIndex[1]}`).data("kendoComboBox").value();
        //            tbodyRow.TotalQtyInRow = UtilityHelper.IsNaN(parseFloat($(`#${tableId} #${tbodyId} #sizeTr`).find(`#totalQty`).text()));
        //            tbodyRow.AvgRateInRow = UtilityHelper.IsNaN(parseFloat($(`#${tableId} #${tbodyId} #sizeTr`).find(`#avgRate`).text()));
        //            var ListOfSizeQTYRate = [];
        //            var sizeHeadTrLength = $(`#${tableId} #sizeHeadTr th`).length;
        //            for (var i = 0; i < sizeHeadTrLength; i++) {
        //                objSizeQTYRate = {};
        //                objSizeQTYRate.SizeId = $(`#${tableId} #sizeHeadTr th:eq( ${i} ) lable`).attr('value');

        //                var id = $(`#${tableId} #sizeHeadTr th:eq( ${i} )`).attr('id');

        //                //objSizeQTYRate.Qty = $(`#${tableId} #${tbodyId} #sizeTr td`).find(`.sizeHeadTr${id}`).val();
        //                objSizeQTYRate.Qty = UtilityHelper.IsNaN(parseFloat($(`#${tableId} #${tbodyId} #sizeTr td`).find(`.sizeHeadTr${id}`).val()));
        //                objSizeQTYRate.Rate = UtilityHelper.IsNaN(parseFloat($(`#${tableId} #${tbodyId} #rateTr td`).find(`.rate${id}`).val()));
        //                ListOfSizeQTYRate.push(objSizeQTYRate);
        //            }
        //            tbodyRow.ListOfSizeQTYRate = ListOfSizeQTYRate;
        //            tbody.ListOfTBody.push(tbodyRow);
        //            console.log("tbody = ", tbody);
        //            //var sizeTrLength = $(`#${tbodyId} #sizeTr td`).length;
        //        });
        //        //TransactionCreateVM.AccountId = $(this).find('td:eq(0)').text();
        //        //ListOfTable.push(table);
        //    });
        //});

        ColorSizeTemplateSummaryHelper.InitModal();
        ColorSizeTemplateSummaryHelper.SizeListLoad();
        $('input[type="checkbox"]').click(function (ev) {
            
            if (ev.target.checked) {

                size = {};
                size.id = ev.target.id;
                size.value = ev.target.value;
                console.log(ev.target);
                console.log(size, 'size');
            } else {
                size = {};
            }
            $('input[type="checkbox"]').not(this).prop('checked', false);
        });
        //ColorSizeTemplateSummaryHelper.GenerateStyleCombo("cmbStyles");
    },
    SizeModal: function () {
        $("#divSizeModal").data("kendoWindow").open().center();
    },
    InitModal() {
        $("#divSizeModal").kendoWindow({
            title: "Size List",
            resizeable: true,
            scrollable: false,
            width: "80%",
            actions: ["Close"],
            modal: true,
            animation: {
                close: {
                    effects: "fade:out"
                }
            }
        });

        $("#btnSizeModalClose").click(function () {
            $("#divSizeModal").data("kendoWindow").close();
        });
        $("#btnSizeInColumn").click(function () {
            
            if (size.value.length >= 0) {
                //var tableId = $('.sizeButton').closest('table').attr('id');
                var sizeExist = false;
                var tr = $('.sizeButton').closest('#sizeHeadTr').children().find('lable').length;
                
                $('.sizeButton').closest('#sizeHeadTr').children().find('lable').each(function () {
                    
                    var value = $(this).attr('value');
                    if (size.value === value) {
                        console.log($(this).attr('value'));
                        console.log(size.value);
                        sizeExist = true;
                        return sizeExist;
                    }

                });
                if (sizeExist === false) {
                    
                    $('.sizeButton').parent().attr('value', size.value);
                    $('.sizeButton').before(size.id);
                    $('.sizeButton').remove();
                    addColumnBtn = 0;
                    $("#divSizeModal").data("kendoWindow").close();
                }
                else {
                    AjaxManager.MsgBox('error', 'center', 'Alert', "The Size Is  Already Exists!",
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
                }

            }
        });
    },
    SizeListLoad: function () {
        var list = ColorSizeTemplateSummaryManager.GetAllSizeGridData();
        for (var value of list._data) {
            $('#sizeList')
                .append(`<div class="col-md-3"><input type="checkbox" id="${value.SizeName}" name="${value.SizeId}" value="${value.SizeId}">
                                               <label for="${value.SizeId}">${value.SizeName}</label>
                         </div>`);
        }
    },
    GenerateColorsCombo: function (identity) {
        var objColor = colorList;
        //var obj = new Object();
        //obj.ColorName = "---Select---";
        //obj.ColorId = AjaxManager.DefaultGuidId();
        //objColor.unshift(obj);
        $("#" + identity).kendoComboBox({
            placeholder: "--Select Color--",
            dataValueField: "ColorId",
            dataTextField: "ColorName",
            dataSource: objColor,
            //index: 0,
            suggest: true,
            filter: "contains",
        });
    },

    TotalQty: function (e) {
        var sum = 0;
        var tableId = e.closest('table').id;
        var sizeTr = e.closest('tr').id;
        var tbody = e.closest('tbody').id;
        var leng = $(`#${tableId} #${tbody} #${sizeTr} td`).length - 5;
        //var tbody = $(`#${sizeTr}`).parents();

        var idArry = [];
        $(`#${tableId} #${tbody} #${sizeTr} td input[class*="sizeHeadTr"]`).each(function () {
            var className = $(this).attr('class');
            var split_id = className.split('sizeHeadTr');
            var index = parseInt(split_id[1]);
            idArry.push(index);

        });
        for (var i = 0; i < idArry.length; i++) {
            var convertToNumber = UtilityHelper.IsNaN(parseInt($(`#${tableId} #${tbody} #${sizeTr} .sizeHeadTr${idArry[i]}`).val()))
            sum += convertToNumber;
        }
        $(`#${tableId} #${tbody} #${sizeTr} #totalQty`).html(sum);

        var totalSum = 0;
        $.each($("#container table tbody"), function () {
            var totalOrder = UtilityHelper.IsNaN(parseFloat($(this).find(`#totalQty`).text()));
            totalSum += totalOrder;
            $("#txtOrderQty").data("kendoNumericTextBox").value(totalSum);

        });
    },
    AvgRate: function (e) {
        var sum = 0;
        var tableId = e.closest('table').id;
        var sizeTr = e.closest('tr').id;
        var tbody = e.closest('tbody').id;
        // 
        var prevTr = $(`#${tableId} #${tbody} #${sizeTr}`).prev('tr').attr('id');

        var leng = $(`#${tableId} #${tbody} #${sizeTr} td`).length - 1;

        var idArry = [];
        $(`#${tableId} #${tbody} #${sizeTr} td input`).each(function () {
            var className = $(this).attr('class');
            var split_id = className.split('rate');
            var index = parseInt(split_id[1]);
            idArry.push(index);

        });
        for (var i = 0; i < idArry.length; i++) {
            var convertToNumber = UtilityHelper.IsNaN(parseFloat($(`#${tableId} #${tbody} #${sizeTr} .rate${idArry[i]}`).val()))
            sum += convertToNumber;
        }
        $(`#${tableId} #${tbody} #${prevTr} #avgRate`).html((sum / leng).toFixed(4));
    },
    InitailTableStructure: function () {
        var tableStructure = `     <div class="table-responsive">
                                    <table class="table-bordered" id="table_1">
                                        <thead>
                                            <tr class="mainHeadTr">
                                                <th rowspan="2" style="vertical-align : middle;text-align:center; padding: 5px 35px">Style</th>
                                                <th rowspan="2" style="vertical-align: middle; text-align: center; padding: 5px 35px;">Color</th>
                                                <th id="colSpan" style="vertical-align: middle; text-align: center; padding: 5px 35px;">Size

                                                </th>
                                                <th rowspan="2" style="vertical-align: middle; text-align: center; padding: 5px 15px;">Total Qty</th>
                                                <th rowspan="2" style="vertical-align: middle; text-align: center; padding: 5px 15px;">AVG Rate</th>
                                                <th rowspan="2" class="removeTable" style="vertical-align: middle; text-align: center; padding: 5px 15px;">Action
                                                    <button class="k-button-success " type="button" onClick="ColorSizeTemplateSummaryHelper.AddRowInSameTable(this)"><span class="glyphicon glyphicon-plus"></span> Color</button>

</th>
                                            </tr>
                                            <tr id="sizeHeadTr">
                                            </tr>
                                        </thead>
                                        <tbody id="mainTable_1">
                                            <tr id="sizeTr">

                                                <td>
                                                   <input type="text" style="width: 135px; height: 28px;" name="cmbStyle1_1" id="cmbStyle1_1"  onchange="ColorSizeTemplateSummaryHelper.ChangeStyle(this)"/>
                                                </td>
                                                <td>
                                                   <input type="text" style="width: 135px; height: 28px;" name="cmbColor1_1" id="cmbColor1_1" />
                                                </td>
                                                <td rowspan="2" id="qtyRate"></td>
                                                <td rowspan="2" id="totalQty" style="vertical-align : middle;text-align:center;"></td>
                                                <td rowspan="2" id="avgRate" style="vertical-align : middle;text-align:center;"></td>
                                                <td rowspan="2" style="vertical-align : middle;text-align:center;">
                                                    <span class="btnNewTemplate"></span>
                                                </td>
                                            </tr>
                                            <tr id="rateTr">
                                                <td colspan="2" class="text-center" style="vertical-align : middle;text-align:center; padding: 5px 35px">Rate</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <br />`;
        return tableStructure;
        //                                                    <button class="k-button-success btnNewTemplate" type="button" onClick="ColorSizeTemplateSummaryHelper.AddRowInSameTable(this)"><span class="glyphicon glyphicon-plus"></span> Color</button>

    },
    ShowInitailTable: function () {
        var initialTable = ColorSizeTemplateSummaryHelper.InitailTableStructure();
        //$("#container").append(initialTable);
        $("#container").find(".btnNewStyle").before(initialTable);

    },
    RemoveRow: function (e) {
        
        var tableId = e.closest('table').id;
        var split_id = tableId.split('_');
        var tableIndex = parseInt(split_id[1]);

        var currentTBody = $(`#${tableId} tbody`).length;
        if (currentTBody > 1) {
            e.closest("tbody").remove();

            var totalTBody = $(`#${tableId} tbody`).length;
            if (totalTBody === 1) {

                var tbodyId = $(`#${tableId} tbody`).attr('id');
                var split_tbodyId = tbodyId.split('_');
                var tbodyIndex = parseInt(split_tbodyId[1]);
                $(`#cmbStyle${tableIndex}_${tbodyIndex}`).data("kendoMultiColumnComboBox").readonly(false);
            }
        }
        else {
            AjaxManager.MsgBox('error', 'center', 'Alert', "Last Row Can Not Remove. Add New Row Than Remove This Row",
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
        var totalSum = 0;
        $.each($("#container table tbody"), function () {
            var totalOrder = UtilityHelper.IsNaN(parseFloat($(this).find(`#totalQty`).text()));
            totalSum += totalOrder;
            $("#txtOrderQty").data("kendoNumericTextBox").value(totalSum);

        });
    },
    RemoveTable: function (e) {
        var tableId = e.closest('table').id;
        $(`#${tableId}`).next('br').remove();
        e.closest("table").remove();

        var totalSum = 0;
        $.each($("#container table tbody"), function () {
            var totalOrder = UtilityHelper.IsNaN(parseFloat($(this).find(`#totalQty`).text()));
            totalSum += totalOrder;
            $("#txtOrderQty").data("kendoNumericTextBox").value(totalSum);

        });
    },
    RemoveColumn: function (e) {
        var tableId = e.closest("table").id;
        var buttonId = e.id;
        var split_id = buttonId.split('_');
        var index = parseInt(split_id[1]);

        var parentValue = $(`#${tableId} #${buttonId}`).parent().attr('value');
        if (parentValue === undefined)
            addColumnBtn = 0;
        //$(`#${tableId} #sizeHeadTr`).children(`th:eq(${index - 1})`).remove();
        $(`#${tableId} #${buttonId}`).closest('th').remove();
        // var x = $(`#${tableId} .mainHeadTr #colSpan`).val();

        var setSizeLenth = parseInt($(`#${tableId} .mainHeadTr #colSpan`).attr("colspan")) - 1;
        $(`#${tableId} .mainHeadTr #colSpan`).attr("colspan", setSizeLenth);

        $(`#${tableId} tbody`).each(function () {
            
            //$('#sizeTr').children(`td:eq(${index + 1})`).remove();
            //$('#rateTr').children(`td:eq(${index})`).remove();
            var quan = $(this).find(`#sizeTr .sizeHeadTr${index}`);
            var rate = $(this).find(`#rateTr .rate${index}`);
            //var quan = $('#sizeTr').children(`td:eq(${index + 1})`);
            quan.closest('td').remove();
            //var rate = $('#rateTr').children(`td:eq(${index})`);
            rate.closest('td').remove();
            if (setSizeLenth === 0) {
                $(`#${tableId} tbody #totalQty`).before(`<td rowspan="2" id="qtyRate"></td>`);
            }
        });

        var totalSum = 0;
        $.each($("#container table tbody"), function () {
            var totalOrder = UtilityHelper.IsNaN(parseFloat($(this).find(`#totalQty`).text()));
            totalSum += totalOrder;
            $("#txtOrderQty").data("kendoNumericTextBox").value(totalSum);

        });
    },
    
    //AddRowInSameTable: function (e) {
        
    //    var tableId = e.closest('table').id;
    //    var split_id = tableId.split('_');
    //    var tableIndex = parseInt(split_id[1]);

    //    //new
    //    var lastTbodyId = $(`#${tableId} tbody:last-child`).attr('id');
    //    var split_lastTbodyId = lastTbodyId.split('_');
    //    var lastTbodyIndex = parseInt(split_lastTbodyId[1]);
    //    var tbodyIndex = lastTbodyIndex + 1;
    //    //new

    //   // var tbodyIndex = $(`#${tableId} tbody`).length + 1;
       
    //    var tbody = e.closest('tbody');
    //    var cloneTbody = $(tbody).clone();

    //    var previousTbody = $(`#${tableId} #${tbody.id}`);
    //    previousTbody.find(".btnNewTemplate").before(`<button class="k-button-danger" type="button" onClick="ColorSizeTemplateSummaryHelper.RemoveRow(this)"><span class="glyphicon glyphicon-trash"></span> Remove</button>`);
    //    previousTbody.find(".btnNewTemplate").remove();

    //    cloneTbody.attr('id', 'mainTable_' + tbodyIndex);
    //    //cloneTbody.find(`.cmbStyles option[value=${preSelectedStyleValue}]`).attr('selected', 'selected');
    //    //cloneTbody.find(".cmbStyles").attr("disabled", true);
    //    $(cloneTbody).insertAfter(tbody);

    //    //$("select", `#${tableId} #${tbody.id}`).attr("disabled", true);

    //    cloneTbody.find(`#cmbColor${tableIndex}_${tbodyIndex - 1}`).attr('id', `cmbColor${tableIndex}_` + tbodyIndex);
    //    cloneTbody.find(`input[name$="cmbColor${tableIndex}_${tbodyIndex - 1}"]`).attr('name', `cmbColor${tableIndex}_` + tbodyIndex);

    //    var preSelectedStyleValue = $(`#cmbStyle${tableIndex}_${tbodyIndex - 1}`).data("kendoMultiColumnComboBox").value();
    //    $(`#cmbStyle${tableIndex}_${tbodyIndex - 1}`).data("kendoMultiColumnComboBox").readonly(true);

    //    cloneTbody.find(`#cmbStyle${tableIndex}_${tbodyIndex - 1}`).attr('id', `cmbStyle${tableIndex}_` + tbodyIndex);
    //    cloneTbody.find(`input[name$="cmbStyle${tableIndex}_${tbodyIndex - 1}"]`).attr('name', `cmbStyle${tableIndex}_` + tbodyIndex);

    //    //$(`#cmbColor_${tbodyIndex}`).data("kendoComboBox").setDataSource(colorList);
    //    $(`#cmbColor${tableIndex}_${tbodyIndex - 1}`).data("kendoComboBox").readonly(true);

    //    $(`#cmbColor${tableIndex}_${tbodyIndex}`).kendoComboBox({
    //        placeholder: "--Select Color--",
    //        dataValueField: "ColorId",
    //        dataTextField: "ColorName",
    //        dataSource: colorList,
    //        //index: 0,
    //        suggest: true,
    //        filter: "contains",

    //        change: function (e) {
    //            var selectedColorValue = this.value();
                
    //            var tbodyLen = $(`#${tableId} tbody`).length;
    //            var i = 0;
    //            $.each($(`#${tableId} tbody`), function () {
                    
    //                i++;
    //                var tbodyId = $(this).attr('id');
    //                var splitTbody_id = tbodyId.split('_');
    //                var tbodyNum = parseInt(splitTbody_id[1]);

    //                var colorValue = $(`#cmbColor${tableIndex}_${tbodyNum}`).data("kendoComboBox").value();
    //                if (colorValue === selectedColorValue && tbodyLen != i) {
    //                     AjaxManager.MsgBox('error', 'center', 'Alert', "The Color Is  Already Exists!",
    //                        [{
    //                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
    //                                $noty.close();
    //                            }
    //                         }]);
    //                    //$(`#cmbColor${tableIndex}_${tbodyIndex}`).data("kendoComboBox").value(AjaxManager.DefaultGuidId());
    //                    $(`#cmbColor${tableIndex}_${tbodyIndex}`).data("kendoComboBox").value("");
    //                    return false;
    //                }

    //            });
    //            // Use the value of the widget
    //        }
    //    });
    //    //$(`#cmbColor${tableIndex}_${tbodyIndex}`).data("kendoComboBox").value(AjaxManager.DefaultGuidId());
    //    $(`#cmbColor${tableIndex}_${tbodyIndex}`).data("kendoComboBox").value("");

    //    $(`#cmbStyle${tableIndex}_${tbodyIndex}`).kendoMultiColumnComboBox({
    //        placeholder: "---Select Style---",
    //        filter: "contains",
    //        filterFields: ["StyleNo"],
    //        dataTextField: "StyleNo",
    //        dataValueField: "StyleDetailId",
    //        dataSource: styleList,
    //        columns: [
    //            { field: "StyleNo", title: "Style No", width: 120 },
    //            { field: "BuyerName", title: "Buyer", width: 120 },
    //            { field: "BrandName", title: "Brand", width: 120 },
    //            { field: "DepartmentName", title: "Department", width: 120 },
    //            { field: "SeasonName", title: "Season", width: 100 },
    //            { field: "Year", title: "Year", width: 80 },
    //            { field: "StatusName", title: "Status", width: 100 },
    //            { field: "Fob", hidden: true, title: "FOB", width: 100 },
    //        ],
    //        //change: ColorSizeTemplateSummaryHelper.ChangeStyle(this),
    //        footerTemplate: 'Total #: instance.dataSource.total() # items found',
    //        //index: 0,
    //        //placeholder: "---Select Style---",
    //        height: 400

    //    });
    //    $(`#cmbStyle${tableIndex}_${tbodyIndex}`).data("kendoMultiColumnComboBox").value(preSelectedStyleValue);
    //    $(`#cmbStyle${tableIndex}_${tbodyIndex}`).data("kendoMultiColumnComboBox").readonly(true);

    //    var totalSum = 0;
    //    $.each($("#container table tbody"), function () {
    //        var totalOrder = UtilityHelper.IsNaN(parseFloat($(this).find(`#totalQty`).text()));
    //        totalSum += totalOrder;
    //        $("#txtOrderQty").data("kendoNumericTextBox").value(totalSum);

    //    });
    //    //  $(`#cmbColor_${index}`).data("kendoComboBox").setDataSource(colorList);
    //    //    ColorSizeTemplateSummaryHelper.GenerateColorsCombo(`cmbColor_${index}`);
    //},
    AddRowInSameTable: function (e) {
        
        var tableId = e.closest('table').id;
        var split_id = tableId.split('_');
        var tableIndex = parseInt(split_id[1]);

        //new
        var lastTbodyId = $(`#${tableId} tbody:last-child`).attr('id');
        var split_lastTbodyId = lastTbodyId.split('_');
        var lastTbodyIndex = parseInt(split_lastTbodyId[1]);
        var tbodyIndex = lastTbodyIndex + 1;
        //new
        debugger
       // var tbodyIndex = $(`#${tableId} tbody`).length + 1;

        var tbody = '#' + lastTbodyId;
        var cloneTbody = $(`#${tableId} ${tbody}`).clone();

        var previousTbody = $(`#${tableId} ${tbody}`);
        previousTbody.find(".btnNewTemplate").before(`<button class="k-button-danger" type="button" onClick="ColorSizeTemplateSummaryHelper.RemoveRow(this)"><span class="glyphicon glyphicon-trash"></span> Remove</button>`);
        previousTbody.find(".btnNewTemplate").remove();
        cloneTbody.find(".btnNewTemplate").before(`<button class="k-button-danger" type="button" onClick="ColorSizeTemplateSummaryHelper.RemoveRow(this)"><span class="glyphicon glyphicon-trash"></span> Remove</button>`);
        cloneTbody.find(".btnNewTemplate").remove();

        cloneTbody.attr('id', 'mainTable_' + tbodyIndex);
        //cloneTbody.find(`.cmbStyles option[value=${preSelectedStyleValue}]`).attr('selected', 'selected');
        //cloneTbody.find(".cmbStyles").attr("disabled", true);
        $(cloneTbody).insertAfter(`#${tableId} ${tbody}`);

        //$("select", `#${tableId} #${tbody.id}`).attr("disabled", true);

        cloneTbody.find(`#cmbColor${tableIndex}_${tbodyIndex - 1}`).attr('id', `cmbColor${tableIndex}_` + tbodyIndex);
        cloneTbody.find(`input[name$="cmbColor${tableIndex}_${tbodyIndex - 1}"]`).attr('name', `cmbColor${tableIndex}_` + tbodyIndex);

        var preSelectedStyleValue = $(`#cmbStyle${tableIndex}_${tbodyIndex - 1}`).data("kendoMultiColumnComboBox").value();
        $(`#cmbStyle${tableIndex}_${tbodyIndex - 1}`).data("kendoMultiColumnComboBox").readonly(true);

        cloneTbody.find(`#cmbStyle${tableIndex}_${tbodyIndex - 1}`).attr('id', `cmbStyle${tableIndex}_` + tbodyIndex);
        cloneTbody.find(`input[name$="cmbStyle${tableIndex}_${tbodyIndex - 1}"]`).attr('name', `cmbStyle${tableIndex}_` + tbodyIndex);

        //$(`#cmbColor_${tbodyIndex}`).data("kendoComboBox").setDataSource(colorList);
        $(`#cmbColor${tableIndex}_${tbodyIndex - 1}`).data("kendoComboBox").readonly(true);

        $(`#cmbColor${tableIndex}_${tbodyIndex}`).kendoComboBox({
            placeholder: "--Select Color--",
            dataValueField: "ColorId",
            dataTextField: "ColorName",
            dataSource: colorList,
            //index: 0,
            suggest: true,
            filter: "contains",

            change: function (e) {
                var selectedColorValue = this.value();
                
                var tbodyLen = $(`#${tableId} tbody`).length;
                var i = 0;
                $.each($(`#${tableId} tbody`), function () {
                    
                    i++;
                    var tbodyId = $(this).attr('id');
                    var splitTbody_id = tbodyId.split('_');
                    var tbodyNum = parseInt(splitTbody_id[1]);

                    var colorValue = $(`#cmbColor${tableIndex}_${tbodyNum}`).data("kendoComboBox").value();
                    if (colorValue === selectedColorValue && tbodyLen != i) {
                         AjaxManager.MsgBox('error', 'center', 'Alert', "The Color Is  Already Exists!",
                            [{
                                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                    $noty.close();
                                }
                             }]);
                        //$(`#cmbColor${tableIndex}_${tbodyIndex}`).data("kendoComboBox").value(AjaxManager.DefaultGuidId());
                        $(`#cmbColor${tableIndex}_${tbodyIndex}`).data("kendoComboBox").value("");
                        return false;
                    }

                });
                // Use the value of the widget
            }
        });
        //$(`#cmbColor${tableIndex}_${tbodyIndex}`).data("kendoComboBox").value(AjaxManager.DefaultGuidId());
        $(`#cmbColor${tableIndex}_${tbodyIndex}`).data("kendoComboBox").value("");

        $(`#cmbStyle${tableIndex}_${tbodyIndex}`).kendoMultiColumnComboBox({
            placeholder: "---Select Style---",
            filter: "contains",
            filterFields: ["StyleNo"],
            dataTextField: "StyleNo",
            dataValueField: "StyleDetailId",
            dataSource: styleList,
            columns: [
                { field: "StyleNo", title: "Style No", width: 120 },
                { field: "BuyerName", title: "Buyer", width: 120 },
                { field: "BrandName", title: "Brand", width: 120 },
                { field: "DepartmentName", title: "Department", width: 120 },
                { field: "SeasonName", title: "Season", width: 100 },
                { field: "Year", title: "Year", width: 80 },
                { field: "StatusName", title: "Status", width: 100 },
                { field: "Fob", hidden: true, title: "FOB", width: 100 },
            ],
            //change: ColorSizeTemplateSummaryHelper.ChangeStyle(this),
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            //index: 0,
            //placeholder: "---Select Style---",
            height: 400

        });
        $(`#cmbStyle${tableIndex}_${tbodyIndex}`).data("kendoMultiColumnComboBox").value(preSelectedStyleValue);
        $(`#cmbStyle${tableIndex}_${tbodyIndex}`).data("kendoMultiColumnComboBox").readonly(true);

        var totalSum = 0;
        $.each($("#container table tbody"), function () {
            var totalOrder = UtilityHelper.IsNaN(parseFloat($(this).find(`#totalQty`).text()));
            totalSum += totalOrder;
            $("#txtOrderQty").data("kendoNumericTextBox").value(totalSum);

        });
        //  $(`#cmbColor_${index}`).data("kendoComboBox").setDataSource(colorList);
        //    ColorSizeTemplateSummaryHelper.GenerateColorsCombo(`cmbColor_${index}`);
    },
    AddColumnInSameTable: function (e) {
        
        if (addColumnBtn === 0) {
            addColumnBtn = 1;
            var tableId = e.closest('table').id;

            var setSizeLenth = parseInt($(`#${tableId} .mainHeadTr #colSpan`).attr("colspan")) + 1;
            $(`#${tableId} .mainHeadTr #colSpan`).attr("colspan", setSizeLenth);

            var x = $(`#${tableId} #sizeHeadTr th:last`);
            var setId = parseInt($(`#${tableId} #sizeHeadTr th:last`)[0].id) + 1;

            x.after(`<th id="${setId}" style="width: 70px; height: 28px;">
                    <lable style="display: block;text-align: center;">
                                <button class="text-white bg-success sizeButton" onclick="ColorSizeTemplateSummaryHelper.SizeModal()" type="button">+</button>
                                <button class="close" id="removeCol_${setId}" onClick="ColorSizeTemplateSummaryHelper.RemoveColumn(this)"></button>
                    </lable>
                </th>`);
            /* $(`#${tableId} #sizeHeadTr`).append("<th>");*/
            //$(`#${tableId} #sizeHeadTr>th:last`).html('aa');
            $(`#${tableId} tbody`).each(function () {
                $(this).find('#sizeTr #totalQty').before(`<td>
                                            <input type="number" placeholder="QTY" style="width: 70px; height: 28px;" name="sizeHeadTr${setId}" class="sizeHeadTr${setId}" onclick="ColorSizeTemplateSummaryHelper.TotalQty(this)" onkeyup="ColorSizeTemplateSummaryHelper.TotalQty(this)" />
                                        </td>`)
                $(this).find('#rateTr td:last').after(`<td><input type="number" placeholder="Rate" style="width: 70px; height: 28px;" name="rate${setId}" class="rate${setId}" onclick="ColorSizeTemplateSummaryHelper.AvgRate(this)" onkeyup="ColorSizeTemplateSummaryHelper.AvgRate(this)"/></td>`)
            });
        }
        else {
            AjaxManager.MsgBox('warning', 'center', 'Alert', "Please Set Size In Previously Created Column!",
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }

    },
    ChangeStyle: function (e) {
        var StyleDetailId = e.value;
        var table = e.closest('table').id;
        var tbody = e.closest('tbody').id;
        var tableLenght = $("#container table").length;

        debugger;
        var tableIds = $.map($('#container div > table'), table => parseInt(table.id.split('_')[1]));
        console.log("table", tableIds);


        for (var i = 0; i < tableIds.length; i++) {
            debugger;
            var id = $(`#table_${tableIds[i]}`).attr('id');
            var x = $(`#cmbStyle${tableIds[i]}_1`).data("kendoMultiColumnComboBox").value();

            if (table !== id && x === StyleDetailId) {
                return AjaxManager.MsgBox('warning', 'center', 'Alert', "Style Alreay Selected",
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
        if (table === 'table_1') {
            ColorSizeTemplateSummaryHelper.GenerateSizeTemplate(StyleDetailId, table, tbody);
            ColorSizeTemplateSummaryHelper.LoadLeadTimeComboNew();
        }
        else {
            var firststyleDetailsId = $('#cmbStyle1_1').data("kendoMultiColumnComboBox").value();
            var previousStyleDetails = styleList.filter(x => x.StyleDetailId == firststyleDetailsId)[0];
            var currentStyleDetails = styleList.filter(x => x.StyleDetailId == StyleDetailId)[0];
            if ( previousStyleDetails.BuyerName !== currentStyleDetails.BuyerName
                || previousStyleDetails.BrandName !== currentStyleDetails.BrandName
                || previousStyleDetails.DepartmentName !== currentStyleDetails.DepartmentName
                || previousStyleDetails.SeasonName !== currentStyleDetails.SeasonName
                || previousStyleDetails.Year !== currentStyleDetails.Year
                || previousStyleDetails.StatusName !== currentStyleDetails.StatusName) {

                return AjaxManager.MsgBox('warning', 'center', 'Alert', "Please Select Same Buyer,Brand,Dept,Season,Year & Status",
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
            }
            else {
                ColorSizeTemplateSummaryHelper.GenerateSizeTemplate(StyleDetailId, table, tbody);
            }
        }

    },
    GenerateSizeTemplate: function (StyleDetailId, table, tbody) {
        
        if (StyleDetailId !== "" && StyleDetailId !== "00000000-0000-0000-0000-000000000000") {

            //var thead = e.closest('thead tr').id;
            var rate = styleList.filter(x => x.StyleDetailId == StyleDetailId)[0].Fob;
            var poWiseSizeList = ColorSizeTemplateSummaryManager.GetTemplateSizeByStyleDetails(StyleDetailId);
            if (poWiseSizeList.length > 0) {
                var tdLangthInSizeTr = $(`#${table} thead #sizeHeadTr th`).length;
                if (tdLangthInSizeTr > 0) {
                    $(`#${table} #sizeHeadTr`).children('th').remove();
                    for (var i = 1; i <= tdLangthInSizeTr; i++) {
                        $(`#${table} #sizeTr`).children('td').eq(2).remove();
                        $(`#${table} #rateTr`).children('td').eq(1).remove();
                    }
                }
                var sizeLenth = poWiseSizeList.length;
                //            var tbodyIdName = $(this).closest('tbody');
                var haveSizeButton = $(`#${table} .mainHeadTr #colSpan`).find('button');
                if (haveSizeButton.length === 0) {
                    $(`#${table} .mainHeadTr #colSpan`).append(`<button class="k-button-success" type="button" onClick="ColorSizeTemplateSummaryHelper.AddColumnInSameTable(this)">
                    <span class= "glyphicon glyphicon-plus" ></span >
                    </button >`);
                }

                $(`#${table} .mainHeadTr #colSpan`).attr("colspan", sizeLenth);
                for (let i = 0; i < sizeLenth; i++) {
                    $(`#${table} #sizeHeadTr`).append(`<th id="${i + 1}" style="width: 70px; height: 28px;"><lable style="display: block;text-align: center;" value='${poWiseSizeList[i].SizeId}'>${poWiseSizeList[i].SizeName} <button class="close" id="removeCol_${i + 1}" onClick="ColorSizeTemplateSummaryHelper.RemoveColumn(this)"></button></lable></th>`);
                    $(`#${table} #${tbody} #qtyRate`).remove();
                    $(`#${table} #${tbody} #totalQty`).before(`<td>
                                            <input type="number" placeholder="QTY" style="width: 70px; height: 28px;" name="sizeHeadTr${i + 1}" class="sizeHeadTr${i + 1}" onclick="ColorSizeTemplateSummaryHelper.TotalQty(this)" onkeyup="ColorSizeTemplateSummaryHelper.TotalQty(this)" />
                                        </td>`);
                    $(`#${table} #${tbody} #rateTr`).append(`<td><input type="number" value=${rate} placeholder="Rate" style="width: 70px; height: 28px;" name="rate${i + 1}" class="rate${i + 1}" onclick="ColorSizeTemplateSummaryHelper.AvgRate(this)" onkeyup="ColorSizeTemplateSummaryHelper.AvgRate(this)"/></td>`);
                }

                $(`#${table} #${tbody} #avgRate`).html((rate).toFixed(4));
                $(".btnNewStyle").show();

            }
            else {
                AjaxManager.MsgBox('warning', 'center', 'Alert', "Please Set PO Template First!",
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
        else {
            AjaxManager.MsgBox('warning', 'center', 'Alert', "Please Select A Valid Style!",
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    },
    ColorAndStyleDropDown: function (tableIndex) {
        $(`#cmbColor${tableIndex}_1`).kendoComboBox({
            //placeholder: "--Select--",
            dataValueField: "ColorId",
            dataTextField: "ColorName",
            dataSource: colorList,
            index: 0,
            suggest: true,
            filter: "contains",
        });

        $(`#cmbStyle${tableIndex}_1`).kendoMultiColumnComboBox({
            placeholder: "---Select Style---",
            filter: "contains",
            filterFields: ["StyleNo"],
            dataTextField: "StyleNo",
            dataValueField: "StyleDetailId",
            dataSource: styleList,
            columns: [
                { field: "StyleNo", title: "Style No", width: 120 },
                { field: "BuyerName", title: "Buyer", width: 120 },
                { field: "BrandName", title: "Brand", width: 120 },
                { field: "DepartmentName", title: "Department", width: 120 },
                { field: "SeasonName", title: "Season", width: 100 },
                { field: "Year", title: "Year", width: 80 },
                { field: "StatusName", title: "Status", width: 100 },
            ],
            //change: ColorSizeTemplateSummaryHelper.ChangeStyle(this),

            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            //index: 0,
            height: 250

        });
    },
    LoadStyleCombo: function (id) {
        var cboStyle = $("#" + id).data("kendoMultiColumnComboBox");
        //var obj = new Object();
        //obj.StyleNo = "---Select---";
        //obj.StyleDetailId = AjaxManager.DefaultGuidId();
        //obj.BuyerName = "";
        //obj.BrandName = "";
        //obj.DepartmentName = "";
        //obj.SeasonName = "";
        //obj.Year = "";
        //obj.StatusName = "";
        //obj.Fob = "";

        //styleList.unshift(obj);

        cboStyle.setDataSource(styleList);
       // cboStyle.select(0);
    },
    LoadLeadTimeComboNew: function () {
        var styleInfo = $("#cmbStyle1_1").data("kendoMultiColumnComboBox").dataItem();
        var buyerId = styleInfo.BuyerId;
        var brandId = styleInfo.BrandId;
        var deptId = styleInfo.DepartmmentId === null ? AjaxManager.DefaultGuidId() : styleInfo.DepartmmentId;
        var data = MerchantManager.GetAllLeadTime(buyerId, brandId, deptId);
        if (data !== "") {
            var leadTimeCombo = $("#cmbLeadTime").data("kendoComboBox");
            var leadTimeComboData = leadTimeCombo.dataSource.data();
            data.map(y => {
                var leadTime = leadTimeComboData.find(x => x.LeadTimeId === y.LeadTimeId);
                if (leadTime == null || typeof leadTime === "undefined") leadTimeComboData.push(y);
            });
            leadTimeCombo.setDataSource(leadTimeComboData);
        }
    },
    
    GenerateStyleMultiColumnComboBoxForPo: function (ctrlId) {
        $("#" + ctrlId).kendoMultiColumnComboBox({
            placeholder: "---Select Style---",
            dataSource: [],
            dataTextField: "StyleNo",
            dataValueField: "StyleDetailId",
            columns: [
                { field: "StyleNo", title: "Style No", width: 120 },
                { field: "BuyerName", title: "Buyer", width: 120 },
                { field: "BrandName", title: "Brand", width: 120 },
                { field: "DepartmentName", title: "Department", width: 120 },
                { field: "SeasonName", title: "Season", width: 100 },
                { field: "Year", title: "Year", width: 80 },
                { field: "StatusName", title: "Status", width: 100 },
            ],
            //change: ColorSizeTemplateSummaryHelper.ChangeStyle(this),
            filter: "contains",
            filterFields: ["StyleNo"],
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
           // index: 0,
            height: 250

        });
    },
    NewCreatePOInfoObject: function () {
        var obj = new Object();
        obj.Poid = $("#hdnPOId").val();
        obj.Pono = $("#txtPONo").val();
        var parentPoId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbParentPO").data("kendoComboBox").value());
        obj.ParentPoid = parentPoId;
        obj.StatusId = $("#cmbPOType").data("kendoComboBox").value();
        obj.ReceivedDate = $("#txtReceiveDate").data("kendoDatePicker").value();
        obj.CmnShipmentModeId = $("#cmbShipmentMode").data("kendoComboBox").value();
        obj.ShipmentDate = $("#txtShipmentDate").data("kendoDatePicker").value();
        obj.CutOffDate = $("#txtCuttoffDate").data("kendoDatePicker").value();
        obj.OrderQty = IkrHelper.EmptyThenZero($("#txtOrderQty").data("kendoNumericTextBox").value());
        obj.LeadTimeId = $("#cmbLeadTime").data("kendoComboBox").value();
        obj.CountryId = $("#cmbCountry").data("kendoComboBox").value();
        obj.Scid = $("#cmbContactOrLC").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cmbContactOrLC").data("kendoComboBox").value();
        obj.UserId = CurrentUser.USERID;
        obj.PurchaseOrderDetails = ColorSizeTemplateSummaryHelper.NewCreatePODetailsObject();
        obj.PosizeColorBreakdowns = ColorSizeTemplateSummaryHelper.NewCreateColorSizeBreakdownObject();
        
        return obj;
    },
    NewCreatePODetailsObject: function () {
        var styleDetailsList = [];
        $.each($("#container table"), function () {
            var tableId = this.id;
            $.each($(`#${tableId} tbody`), function () {
                var tbodyId = this.id;
                var tableIndex = tableId.split('_');
                var tbodyIndex = tbodyId.split('_');
                var styleDetailsId = $(`#cmbStyle${tableIndex[1]}_${tbodyIndex[1]}`).data("kendoMultiColumnComboBox").value();
                ColorId = $(`#cmbColor${tableIndex[1]}_${tbodyIndex[1]}`).data("kendoComboBox").value();
                if (styleDetailsId != "00000000-0000-0000-0000-000000000000" && styleDetailsId != "" && ColorId != "00000000-0000-0000-0000-000000000000" && ColorId != "") {
                    styleDetailsList.push(styleDetailsId);
                }
            });
        });
        var uniqueStyleDetails = styleDetailsList.filter((x, i, a) => a.indexOf(x) == i)
        var poDetailsList = [];
        for (var i = 0; i < uniqueStyleDetails.length; i++) {
            var obj = new Object();
            obj.Poid = $("#hdnPOId").val();
            obj.StyleDetailId = uniqueStyleDetails[i];;
            poDetailsList.push(obj);
        }
        return poDetailsList;
    },
    NewCreateColorSizeBreakdownObject: function () {
        var ListOfTBody = [];
        $.each($("#container table"), function () {
            var tableId = this.id;
            $.each($(`#${tableId} tbody`), function () {
                var tbodyId = this.id;
                debugger
                var tableIndex = tableId.split('_');
                var tbodyIndex = tbodyId.split('_');
                StyleDetailId = $(`#cmbStyle${tableIndex[1]}_${tbodyIndex[1]}`).data("kendoMultiColumnComboBox").value();
                ColorId = $(`#cmbColor${tableIndex[1]}_${tbodyIndex[1]}`).data("kendoComboBox").value();
               // TotalQtyInRow = UtilityHelper.IsNaN(parseFloat($(`#${tableId} #${tbodyId} #sizeTr`).find(`#totalQty`).text()));
               // AvgRateInRow = UtilityHelper.IsNaN(parseFloat($(`#${tableId} #${tbodyId} #sizeTr`).find(`#avgRate`).text()));
                var sizeHeadTrLength = $(`#${tableId} #sizeHeadTr th`).length;
                if (StyleDetailId != "00000000-0000-0000-0000-000000000000" && StyleDetailId != "" && ColorId != "00000000-0000-0000-0000-000000000000" && ColorId != "") {
                    for (var i = 0; i < sizeHeadTrLength; i++) {
                        var id = $(`#${tableId} #sizeHeadTr th:eq( ${i} )`).attr('id');
                        var size = $(`#${tableId} #sizeHeadTr th:eq( ${i} ) lable`).attr('value');
                        if (size === undefined)
                            return ErrorList.push(`Size Is Not Define At Table ${tableIndex[1]} !`);

                        var quantity = UtilityHelper.IsNaN(parseFloat($(`#${tableId} #${tbodyId} #sizeTr td`).find(`.sizeHeadTr${id}`).val()));
                        var rate = UtilityHelper.IsNaN(parseFloat($(`#${tableId} #${tbodyId} #rateTr td`).find(`.rate${id}`).val()));
                        if (quantity !== 0 && rate !== 0) {
                            objSizeQTYRate = {};
                            objSizeQTYRate.SizeId = size;


                            objSizeQTYRate.Quantity = quantity;
                            objSizeQTYRate.UnitPrice = rate;

                            objSizeQTYRate.StyleDetailId = StyleDetailId;
                            objSizeQTYRate.ColorId = ColorId;
                            ListOfTBody.push(objSizeQTYRate);
                        }
                        else if (quantity === 0 && rate === 0) { 
                            continue;
                        }
                        else {
                            QuantityRateError.push(`Quantity Or Rate Only One Of Them Given In Row ${tbodyIndex[1]} At Table ${tableIndex[1]} !`);
                        }
                    }
                }
                else {
                    ErrorList.push(`Style Or Color Not Selected In Row ${tbodyIndex[1]} At Table ${tableIndex[1]} !`);
                    return false;
                }
            });
        });
        var colorSizeList = [];
        for (var i = 0; i < ListOfTBody.length; i++) {
            var detailsData = ListOfTBody[i];
            var obj = new Object();
            obj.Poid = $("#hdnPOId").val();
            obj.UnitPrice = detailsData.UnitPrice;
            obj.ColorId = detailsData.ColorId;
            obj.SizeId = detailsData.SizeId;
            obj.Quantity = detailsData.Quantity;
            obj.StyleDetailId = detailsData.StyleDetailId;
            colorSizeList.push(obj);
        }
        return colorSizeList;
    },
    //RestPODetailsForm: function () {
    //    size = {};
    //    addColumnBtn = 0;
    //    $("#hdnPOId").val(AjaxManager.DefaultGuidId());
    //    $("#txtPONo").val("");
    //    $("#cmbPOType").data("kendoComboBox").value("");
    //    $("#cmbParentPO").data("kendoComboBox").value("");
    //    $("#txtReceiveDate").data("kendoDatePicker").value("");
    //    $("#cmbShipmentMode").data("kendoComboBox").value("");
    //    $("#txtShipmentDate").data("kendoDatePicker").value("");
    //    $("#txtCuttoffDate").data("kendoDatePicker").value("");
    //    $("#txtOrderQty").data("kendoNumericTextBox").value("");
    //    $("#cmbCountry").data("kendoComboBox").value("");
    //    $("#cmbLeadTime").data("kendoComboBox").value("");
    //    $("#grdPOHistorySummary").data("kendoGrid").dataSource.data([]);

    //    $.each($("#container table"), function () {
    //        

    //        var tableId = this.id;
    //        if (tableId !== 'table_1') {
    //            $(this).remove();
    //        }
    //        else {
    //            $("#cmbStyle1_1").data("kendoMultiColumnComboBox").value("");
    //            $("#cmbColor1_1").data("kendoComboBox").value("");
    //            //$('#table_1 .mainHeadTr th').eq(2).remove('th');
    //            //$('#table_1 .mainHeadTr th').eq(2).append('<th id="colSpan" style="vertical-align: middle; text-align: center; padding: 5px 35px;">Size</th >');

    //            //$('#table_1 thead #sizeHeadTr').remove('tr');


    //            $('#totalQty').html("");
    //            $('#avgRate').html("");
    //        }
    //    });
    //    

    //    //crate new HTML
    //},
}