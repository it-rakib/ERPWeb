<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReportViewerRDLC.aspx.cs" Inherits="ERP_WEB.Reports.ReportViewerRDLC" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>


<link href="../Content/bootstrap.min.css" rel="stylesheet" />

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="../Images/HG.PNG" rel="shortcut icon" type="image/x-icon" />
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
            <div class="row">
                <div class="col-md-1">
                </div>
                <div class="col-md-9" align="left">
                    <rsweb:ReportViewer ID="rdlcReportViewer" runat="server" DocumentMapWidth="100%" SizeToReportContent="True" ShowRefreshButton="true"></rsweb:ReportViewer>
                </div>
                <div class="col-md-2">
                </div>
            </div>
        </div>
    </form>
</body>
</html>
