var _totalSuppliers = 1,
    _rfqId = AjaxManager.DefaultGuidId();

var PurRFQSummaryManager = {
    gridDataSource() {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/PurRFQ/GetRFQGrid/' + CurrentUser.USERID,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    cache: false,
                    async: false
                },
                parameterMap(options) {
                    return JSON.stringify(options);
                }
            },
            batch: true,
            schema: {
                model: {
                    id: "PurRFQId",
                    fields: {
                        RFQNo: { editable: false },
                        StatusName: { editable: false },
                        RFQDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
    CompleteRFQ(sRFQId) {
        var obj = {
            RFQId: sRFQId,
            UserId: CurrentUser.USERID
        }
        var jsonParam = JSON.stringify(obj);
        var serviceUrl = _baseUrl + "/api/PurRFQ/CompleteRFQ";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                $("#grdPurRFQSummary").data("kendoGrid").dataSource.read();
                AjaxManager.MsgBox('success', 'center', 'Mail Sent', "Request sent successfully for quotation",
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
            }

            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', jsonData,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                        $noty.close();
                    }
                }]);
        }
    },
    Save(emailObjs) {
        if (emailObjs.length > 0) {
            var jsonParam = JSON.stringify(emailObjs);
            var serviceUrl = _baseUrl + "/api/PurRFQ/SendEmail";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
            function onSuccess(jsonData) {
                if (jsonData.Success) {
                    AjaxManager.MsgBox('success', 'center', 'Success:', jsonData.Message,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                                $noty.close();
                                EmailHelper.CloseMail();
                                location.reload();
                            }
                        }]);
                }
                else {
                    AjaxManager.MsgBox('error', 'center', 'Error1', jsonData.Message,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                                $noty.close();
                            }
                        }]);
                }
            }
            function onFailed(error) {
                AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
    },
};
var PurRFQSummaryHelper = {
    Init() {
        PurRFQSummaryHelper.GeneratePurRFQGrid();
        PurRFQSummaryHelper.InitEmailBtn();
    },
    GeneratePurRFQGrid() {
        $("#grdPurRFQSummary").kendoGrid({
            dataSource: PurRFQSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: [
                { field: "RFQNo", title: "RFQ No", sortable: true },
                { field: "RFQDate", title: "RFQ Date", sortable: true, template: '#=kendo.toString(RFQDate==null?"-":RFQDate,"dd-MMM-yyyy")#' },
                { field: "StatusName", title: "Status", sortable: true },
                {
                    command: [
                    //{
                    //    name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: PurRFQSummaryHelper.GridItemEdit
                    //},
                    {
                        name: "sendMail", text: "Send Mail", iconClass: "k-icon k-i-email", className: "k-success", click: PurRFQSummaryHelper.SendMail
                    }
                        //{
                        //name: "delete", text: "Delete", iconClass: "k-icon k-i-trash", className: "k-success", click: PurRFQSummaryHelper.GridItemRemove
                        //}
                    ], title: "Action"
                }],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    SetTermsAndConditions(termsAndConditions) {
        var text = "Terms & Condition:";
        text += " LineNew ";
        var count = 0;
        termsAndConditions.map(x => {
            count++;
            text += " LineNew ";
            text += count + ". " + x.FirstLabel + " : " + x.SecondLabel;
        });
        return text;
    },
    GetMailBodyText(termsAndConditions) {
        var bodyText = "";
        bodyText += "Dear Sir,";
        bodyText += " LineNew ";
        bodyText += "Please see the below price quotation for your kind information.";
        bodyText += " LineNew LineNew ";
        bodyText += PurRFQSummaryHelper.SetTermsAndConditions(termsAndConditions);
        return bodyText;
    },
    GetMailBasicText(basicInfoObj) {
        var style1 = "border: 1px solid #ddd;padding: 8px; line-height: 1.42857143; vertical-align: top;font-weight: bold; text-align: right; width: 150px !important;background-color: aliceblue;";
        var style2 = "border: 1px solid #ddd;padding: 8px; line-height: 1.42857143; vertical-align: top;";

        var text = "<table class='otherMailTags' style='margin-top:10px;border: 1px solid #ddd;width: 100%; max-width: 100%; margin-bottom: 20px;border-spacing: 0; border-collapse: collapse;'>";

        text += "<tr>";
        text += "<td style='" + style1 + "'>Procurement Concern:</td>";
        text += "<td style='" + style2 + "'>" + basicInfoObj.ProcurementConcernName + "</td>";
        text += "<td style='" + style1 + "'>RFQ No.:</td>";
        text += "<td style='" + style2 + "'>" + basicInfoObj.QuotationNo + "</td>";
        text += "</tr>";

        text += "<tr>";
        text += "<td style='" + style1 + "'>Cell Phone No.:</td>";
        text += "<td style='" + style2 + "'>" + basicInfoObj.MobileNo + "</td>";
        text += "<td style='" + style1 + "'>Date:</td>";
        text += "<td style='" + style2 + "'>" + basicInfoObj.QuotationDate + "</td>";
        text += "</tr>";

        text += "<tr>";
        text += "<td style='" + style1 + "'>Email ID:</td>";
        text += "<td style='" + style2 + "'>" + basicInfoObj.EmailId + "</td>";
        text += "<td style='" + style1 + "'>Buyer Name:</td>";
        text += "<td style='" + style2 + "'>" + basicInfoObj.BuyerName + "</td>";
        text += "</tr>";

        text += "<tr>";
        text += "<td style='" + style1 + "'></td>";
        text += "<td style='" + style2 + "'></td>";
        text += "<td style='" + style1 + "'>Production Unit:</td>";
        text += "<td style='" + style2 + "'>" + basicInfoObj.ProductionUnitName + "</td>";
        text += "</tr>";

        text += "</table>";
        return text;
    },
    GetMailHtmlTable( rfqDetails, supplierId )
    {
        var styleTh = "text-align: center; vertical-align: middle;border-top: 0;background-color: #286090 !important; color: #ffffff;border-bottom-width: 2px;border: 1px solid #ddd; padding: 8px; line-height: 1.42857143;";
        var styleTd = "vertical-align: middle;border: 1px solid #ddd;padding: 8px; line-height: 1.42857143;font-size: 11px !important;border: 1px solid #dee2e6;";

        var text = "<table class='customTable otherMailTags' style='margin-top:10px;border: 1px solid #ddd;width: 100%; max-width: 100%; margin-bottom: 20px;border-spacing: 0; border-collapse: collapse;'>";

        text += "<thead>";
        text += "<tr>";
        text += "<th style='" + styleTh + "'>SL</th>";
        text += "<th style='" + styleTh + "'>Items</th>";
        text += "<th style='" + styleTh + "'>Item Descriptions</th>";
        text += "<th style='" + styleTh + "'>Qty</th>";
        text += "<th style='" + styleTh + "'>UOM</th>";
        text += "<th style='" + styleTh + "'>Unit Price</th>";
        text += "<th style='" + styleTh + "'>Total Price</th>";
        text += "<th style='" + styleTh + "'>Delivery Lead Time</th>";
        text += "<th style='" + styleTh + "'>Remarks</th>";
        text += "</tr>";
        text += "</thead>";

        text += "<tbody>";
        var count = 0;
        rfqDetails.map(x => {
            var unitPrice = 0;
            if (x.SupplierId === supplierId) {
                count++;
                text += "<tr>";
                text += "<td style='text-align:center;" + styleTd + "'>" + count + "</td>";
                text += "<td style='" + styleTd + "'>" + x.ItemName + "</td>";
                text += "<td style='" + styleTd + "'>" + x.ItemDesc + "</td>";
                text += "<td style='text-align:right;" + styleTd + "'>" + x.DmndQty + "</td>";
                text += "<td style='" + styleTd + "'>" + x.UOMName + "</td>";
                text += "<td style='text-align:right;" + styleTd + "'>" + x.CostingRate + "</td>";
                text += "<td style='text-align:right;" + styleTd + "'>" + (x.DmndQty * x.CostingRate).toFixed(4) + "</td>";
                text += "<td style='" + styleTd + "'>-</td>";
                text += "<td style='" + styleTd + "'>-</td>";
                text += "</tr>";
            }
        });
        text += "</tbody>";

        text += "</table>";
        return text;
    },
    GetSendBtn() {
        var text = "<div class='otherMailTags' style='margin-top:10px;'>";
        text += "<button class='btn btn-primary btnSendSingleMail' style='float: right;'><i class='fas fa-paper-plane'></i> Send Single Mail</button>";
        text += "</div>";
        return text;
    },
    GetRFQ(selectedItem) {
        var oRFQ = ApiManager.GetList(_baseUrl + "/api/PurRFQ/GetRFQMasterDetailsByRFQId/" + selectedItem.RFQId);
        if (oRFQ == null || typeof oRFQ === "undefined") return null;
        return oRFQ;
    },
    SendMail(e) {
        _rfqId = AjaxManager.DefaultGuidId();

        e.preventDefault();
        var grid = $("#grdPurRFQSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);

        var oRFQ = selectedItem == null ? null : PurRFQSummaryHelper.GetRFQ(selectedItem);
        EmailHelper.OpenMail();

        if (oRFQ != null) {
            _rfqId = oRFQ.RFQId;
           
            oRFQ.Suppliers = IkrHelper.SortArray(oRFQ.Suppliers, "SupplierName");

            var suppliers = oRFQ.Suppliers;
            _totalSuppliers = suppliers.length;
            EmailHelper.GenerateTabs(suppliers.length, suppliers, "SupplierName");
            var tabIndex = 0;
            suppliers.map(x => {
                tabIndex++;
                var supplierId = x.SupplierId;
                var emails = x.SupplierContact.map(x => x.Email);
                EmailHelper.MailTo(tabIndex, emails);
                EmailHelper.MailCC(tabIndex, []);
                EmailHelper.MailBCC(tabIndex, []);

                var mobileNo = oRFQ.User==null?"":  oRFQ.User.PhoneNo == null ? "" : oRFQ.User.PhoneNo,

                    emailId = oRFQ.User == null ? "" :oRFQ.User.EmailAddress == null ? "" : oRFQ.User.EmailAddress,
                    buyerName = oRFQ.BuyerName,
                    productionUnitName = oRFQ.ProductionUnitName == null ? "" : oRFQ.ProductionUnitName;

                var basicInfoObj = {
                    ProcurementConcernName: CurrentUser.USERNAME,
                    QuotationNo: oRFQ.RFQNo,
                    MobileNo: mobileNo,
                    QuotationDate: IkrHelper.DateFormat(oRFQ.RFQDate),
                    EmailId: emailId,
                    BuyerName: buyerName,
                    ProductionUnitName: productionUnitName
                };
                EmailHelper.MailBodyHtmlContentBeforeTextarea(tabIndex, PurRFQSummaryHelper.GetMailBasicText(basicInfoObj), ".inputBodyMail");

                var termsAndConditions = [{
                    FirstLabel: "Quantity",
                    SecondLabel: "As Per Approval"
                }, {
                    FirstLabel: "Delivery Term",
                    SecondLabel: "Ex-Works"
                }, {
                    FirstLabel: "Payment Mode",
                    SecondLabel: "90 Days LC"
                }, {
                    FirstLabel: "Ship Mode",
                    SecondLabel: "Sea/Air"
                }, {
                    FirstLabel: "Country of Origin",
                    SecondLabel: "China"
                }, {
                    FirstLabel: "Vat & AIT",
                    SecondLabel: "Deduct Vat & AIT for domestic vendor for cash and check payment."
                }, {
                    FirstLabel: "Price Validity",
                    SecondLabel: "30 Days"
                }];
                EmailHelper.MailBody( tabIndex, PurRFQSummaryHelper.GetMailBodyText( termsAndConditions ) );
                debugger;
                EmailHelper.MailBodyHtmlContentAfterTextarea( tabIndex, PurRFQSummaryHelper.GetMailHtmlTable( oRFQ.Details, supplierId ) );
                if (_totalSuppliers > 1) EmailHelper.MailBodyHtmlContentAfterTextarea(tabIndex, PurRFQSummaryHelper.GetSendBtn());

                var emailObjs = [];
                var parent = $(".tab" + tabIndex);
                parent.find(".btnSendSingleMail").click(function () {
                    var emailObj = PurRFQSummaryHelper.GetSingleSupplierMailInfo(tabIndex);
                    if (!emailObj) {
                        emailObjs = [];
                        return false;
                    }
                    emailObjs.push(emailObj);
                    PurRFQSummaryManager.Save(emailObjs);
                });
            });
        }

        if (_totalSuppliers > 1) $("#btnMailSend span").text("Send Bulk Mail");

        /*$("#btnMailSend").unbind();
        $("#btnMailSend").click(function () {
            if (selectedItem != null) {
                if (selectedItem.StatusId == "bacf60b6-8f31-42a9-8f65-14876cabc1ad") {
                    AjaxManager.MsgBox('warning', 'center', 'Message', "RFQ status already completed",
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                                $noty.close();
                            }
                        }]);
                    return false;
                }

                AjaxManager.MsgBox('warning', 'center', 'Please Confirm', "Confirm send mail ? (RFQ status will complete)",
                    [{
                        addClass: 'btn btn-primary',
                        text: 'Yes',
                        onClick: function ($noty) {
                            $noty.close();
                            PurRFQSummaryManager.CompleteRFQ(selectedItem.RFQId);
                            EmailHelper.CloseMail();
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
        });*/
    },
    GridItemEdit(e) {
        e.preventDefault();
        var grid = $("#grdPurRFQSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        debugger;
        if (selectedItem != null) {
            //$("#btnSave").text(" Update");
            //$("#btnSave").addClass("fa fa-save");

            $("#divRFQDetails").show();
            $("#divRFQSummary").hide();
            //PurRFQDetailHelper.ShowDetail();
            if (selectedItem.StatusId == "bacf60b6-8f31-42a9-8f65-14876cabc1ad") {
                $("#btnSave").hide();
            }
            else {
                $("#btnSave").show();
            }
            PurRFQDetailHelper.ResetForm();
            PurRFQDetailHelper.SetInformations(selectedItem);
        }
    },
    GridItemRemove(e) {
        e.preventDefault();
        var grid = $("#grdPurRFQSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
        }
    },
    InitEmailBtn() {
        $("#btnMailSend").click(function () {
            var emailObjs = [],
                index = 1;
            while (index <= _totalSuppliers) {
                var emailObj = PurRFQSummaryHelper.GetSingleSupplierMailInfo(index);
                if (!emailObj) {
                    emailObjs = [];
                    return false;
                }
                emailObjs.push(emailObj);
                index++;
            }
            PurRFQSummaryManager.Save(emailObjs);
        });
    },
    GetSingleSupplierMailInfo(index) {
        var emailObj = null;

        var parent = $(".tab" + index),
            mails = [],
            toMails = [],
            ccMails = [],
            bccMails = [];

        mails = (parent.find(".inputToMail").val()).split(";");
        mails.map(x => {
            if (x.trim().length > 0 && IkrHelper.IsValidEmail(x)) toMails.push(x);
        });
        mails = (parent.find(".inputCCMail").val()).split(";");
        mails.map(x => {
            if (x.trim().length > 0 && IkrHelper.IsValidEmail(x)) ccMails.push(x);
        });
        mails = (parent.find(".inputBCCMail").val()).split(";");
        mails.map(x => {
            if (x.trim().length > 0 && IkrHelper.IsValidEmail(x)) bccMails.push(x);
        });

        var exactStyle = parent.find(".inputBodyMail").attr("style");
        var newStyle = exactStyle.replace("border: solid 1px #000;", "").replace("width: 100%;", "");
        parent.find(".inputBodyMail").attr("style", newStyle);
        var emailBody = parent.find(".divBodyMain")[0].outerHTML;
        emailBody = emailBody.replace('<button class="btn btn-primary btnSendSingleMail" style="float: right;"><i class="fas fa-paper-plane"></i> Send Single Mail</button>', "")
        emailBody = emailBody.replace('contentEditable="true"',"");
        parent.find(".inputBodyMail").attr("style", exactStyle);
        
        emailObj = {
            To: toMails,
            CC: ccMails,
            BCC: bccMails,
            Subject: parent.find(".inputSubjectMail").val(),
            Content: emailBody,
            EmpId: CurrentUser.EMPNO,
            RFQId: _rfqId
        };
        if (_rfqId == "" || _rfqId == AjaxManager.DefaultGuidId()) {
            alert("Invalid RFQ");
            emailObj = null;
            return false;
        }
        if (emailObj.To.length == 0) {
            var supplierName = parent.find(".tabInfo").text();
            alert("Give 'To' mail id of supplier : " + supplierName);
            emailObj = null;
            return false;
        }
        if (emailObj.Subject.trim().length == 0) {
            var supplierName = parent.find(".tabInfo").text();
            alert("Give subject of supplier : " + supplierName);
            emailObj = null;
            return false;
        }
        return emailObj;
    }
};