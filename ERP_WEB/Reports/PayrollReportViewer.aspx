<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PayrollReportViewer.aspx.cs" Inherits="ERP_WEB.Reports.PayrollReportViewer" %>

<%@ Register TagPrefix="CR" Namespace="CrystalDecisions.Web" Assembly="CrystalDecisions.Web, Version=13.0.2000.0, Culture=neutral, PublicKeyToken=692fbea5521e1304" %>


<script src="../Scripts/jquery-1.8.2.min.js"></script>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
    <title></title>
    <link href="../Views/../Images/HG.png" rel="shortcut icon" type="image/x-icon" />
    <script type="text/javascript">
        function Print() {
            var dvReport = document.getElementById("dvReport");
            var frame1 = dvReport.getElementsByTagName("iframe")[0];
            if (navigator.appName.indexOf("Internet Explorer") != -1) {
                frame1.name = frame1.id;
                window.frames[frame1.id].focus();
                window.frames[frame1.id].print();
            }
            else {
                var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
                frameDoc.print();
            }
        }
    </script>


</head>

<body>
    <form id="form1" runat="server">
        <%--   <div id="dvReport">
         <input type="button" id="btnPrint" value="Print to Printer" class="k-button" onclick="Print()" />
             
        <hr/>--%>
        <div class="row">
              <div class="col-md-2">
                </div>
            <div class="col-md-8" align="center">
                <CR:CrystalReportViewer ID="CrystalReportViewer" runat="server" AutoDataBind="true" />
                <%-- <CR:CrystalReportViewer ID="CrystalReportViewer" runat="server" HasPrintButton="True"  AutoDataBind="true" EnableParameterPrompt="False" EnableDatabaseLogonPrompt="False" EnableTheming="False" HasCrystalLogo="False" HasRefreshButton="True" HasToggleParameterPanelButton="False" Height="50px" ShowAllPageIds="True" ToolPanelView="None" Width="350px" OnUnload="CrystalReportViewer_Unload" HasDrillUpButton="False" HyperlinkTarget="" EnableDrillDown="False" HasDrilldownTabs="False" PrintMode="ActiveX" />--%>
            </div>
              <div class="col-md-2">
                </div>
        </div>
        <%--  </div>--%>
    </form>
</body>

</html>
