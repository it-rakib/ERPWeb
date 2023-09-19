var checkedNodes = [];
var EmployeeTreeManager = {
    treeDataSource: function () {
        var treeDataSource = new window.kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: "/EmployeeBasic/GetEmployeeTreeResult",
                    dataType: "json",
                    contentType: "application/json"
                }
            },
            schema: {
                model: {
                    id: "id",
                    children: "items"
                }
            }
        });
        return treeDataSource;
    }
};

var EmployeeTreeHelper = {
    InitEmployeeTree: function () {
        EmployeeTreeHelper.GenerateEmployeeTree();
      
    },
    GenerateEmployeeTree: function () {
        var data = EmployeeTreeManager.treeDataSource();
        $("#trAllEmp").kendoTreeView({
            loadOnDemand: false,
            checkboxes: {
                // checkChildren: true
                checkParent: true
            },
            hasChildren: true,
            dataSource: data,
            dataBound: function (e) {
                var treeView = $('#trAllEmp').data('kendoTreeView');
                treeView.expand(".k-first");
            }
        });
    },
    GetAllCheckedItem: function () {
        checkedNodes = [];
        var treeView = $("#trAllEmp").data("kendoTreeView");
        EmployeeTreeHelper.checkedNodeIds(treeView.dataSource.view(), checkedNodes);
    },
    // function that gathers IDs of checked nodes
    checkedNodeIds: function (nodes, checkedNodes) {
        for (var i = 0; i < nodes.length; i++) {
            var obj = new Object();
            if (nodes[i].checked) {
                obj.id = nodes[i].id;
                obj.text = nodes[i].text;
                obj.Tag = nodes[i].Tag;
                obj.ParentIds = nodes[i].ParentIds;
                // EmployeeTreeHelper.getParentIds(nodes[i], checkedNodes);
                checkedNodes.push(obj);
            }
            if (nodes[i].hasChildren) {
                EmployeeTreeHelper.checkedNodeIds(nodes[i].children.view(), checkedNodes);
            }
        }
    },
    getParentIds: function (node, checkedNodes) {
        if (node.parent() && node.parent().parent() && checkedNodes.indexOf(node.parent().parent().id) === -1) {
            EmployeeTreeHelper.getParentIds(node.parent().parent(), checkedNodes);
            var obj = new Object();
            obj.id = node.parent().parent().id;
            obj.text = node.parent().parent().text;
            obj.Tag = node.parent().parent().Tag;
            checkedNodes.push(obj);
        }
    }
    



};