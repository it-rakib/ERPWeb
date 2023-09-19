var isDateField = [];

$(document).ready(function () {
   // TestHelper.LoadTestCombo();
    TestHelper.GenerateDynamicGrid();
});

var TestMangaer = {
        GetDynamicGridData: function () {
            var gridDataSource = new kendo.data.DataSource({
                type: "json",
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                allowUnsort: true,
                pageSize: 10,
                transport: {
                    read: {
                        url: _baseUrl + '/api/BuyerCosting/GetAllGridData',
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
                        id: "StyleId",
                        fields: {
                            styleId: { editable: false },
                            styleNo: { type: "string", validation: { required: true } }
                        }
                    },
                    data: "Items", total: "TotalCount"
                }
            });
            return gridDataSource;
        },

    GetAllData:function() {
        var data = {
            columns: [
               "ProductID",
               "ProductName",
               "UnitsInStock",
               "OrderDate",
               "Discontinued"
            ],
            data: [
               {
                   ProductID: 1,
                   ProductName: "Chai",
                   UnitPrice: 18,
                   UnitsInStock: 39,
                   Discontinued: false,
                   OrderDate: "1996-07-03T21:00:00.000Z"
               },
               {
                   ProductID: 2,
                   ProductName: "Chang",
                   UnitPrice: 19,
                   UnitsInStock: 17,
                   Discontinued: false,
                   OrderDate: "1996-07-04T21:00:00.000Z"
               },
               {
                   ProductID: 3,
                   ProductName: "Aniseed Syrup",
                   UnitPrice: 10,
                   UnitsInStock: 13,
                   Discontinued: false,
                   OrderDate: "1996-07-01T21:00:00.000Z"
               },
               {
                   ProductID: 4,
                   ProductName: "Chef Anton's Cajun Seasoning",
                   UnitPrice: 22,
                   UnitsInStock: 53,
                   Discontinued: false,
                   OrderDate: "1996-07-01T21:00:00.000Z"
               },
               {
                   ProductID: 5,
                   ProductName: "Chef Anton's Gumbo Mix",
                   UnitPrice: 21.35,
                   UnitsInStock: 0,
                   Discontinued: true,
                   OrderDate: "1996-07-10T21:00:00.000Z"
               },
               {
                   ProductID: 6,
                   ProductName: "Grandma's Boysenberry Spread",
                   UnitPrice: 25,
                   UnitsInStock: 120,
                   Discontinued: false,
                   OrderDate: "1996-07-07T21:00:00.000Z"
               },
               {
                   ProductID: 7,
                   ProductName: "Uncle Bob's Organic Dried Pears",
                   UnitPrice: 30,
                   UnitsInStock: 15,
                   Discontinued: false,
                   OrderDate: "1996-07-08T21:00:00.000Z"
               },
               {
                   ProductID: 8,
                   ProductName: "Northwoods Cranberry Sauce",
                   UnitPrice: 40,
                   UnitsInStock: 6,
                   Discontinued: false,
                   OrderDate: "1996-07-08T21:00:00.000Z"
               },
               {
                   ProductID: 9,
                   ProductName: "Mishi Kobe Niku",
                   UnitPrice: 97,
                   UnitsInStock: 29,
                   Discontinued: true,
                   OrderDate: "1996-07-08T21:00:00.000Z"
               },
               {
                   ProductID: 10,
                   ProductName: "Ikura",
                   UnitPrice: 31,
                   UnitsInStock: 31,
                   Discontinued: false,
                   OrderDate: "1996-07-18T21:00:00.000Z"
               },
               {
                   ProductID: 11,
                   ProductName: "Queso Cabrales",
                   UnitPrice: 21,
                   UnitsInStock: 22,
                   Discontinued: false,
                   OrderDate: "1996-07-12T21:00:00.000Z"
               },
               {
                   ProductID: 12,
                   ProductName: "Queso Manchego La Pastora",
                   UnitPrice: 38,
                   UnitsInStock: 86,
                   Discontinued: false,
                   OrderDate: "1996-07-24T21:00:00.000Z"
               }
            ]
        }

        return data;
    }
};

var TestHelper = {
    LoadTestCombo: function () {
        $("#cmbTest").kendoComboBox({
            placeholder: "Select",
            dataTextField: "TypeName",
            dataValueField: "TypeId",
            autoBind: false,
            minLength: 3,
            dataSource: {
                type: "GET",
                serverFiltering: true,
                transport: {
                    read: {
                        url: "../Test/FilterData",
                        data: function (e) {
                            debugger;
                            var filterText = $("#cmbTest").kendoComboBox();
                            return { text: filterText }
                        }
                    }
                }
            },
            index: 0,
            suggest: true,
            filter: "contains"
        });
    },

    GenerateDynamicGrid: function () {
        debugger;
        var response = TestMangaer.GetAllData();

        var model = TestHelper.GenerateModel(response);
        var columns = TestHelper.GenerateColumns(response);

        var grid = $("#gridDynamic").kendoGrid({
            dataSource: {
                transport: {
                    read: function (options) {
                        options.success(response.data);
                    }
                },
                pageSize: 5,
                schema: {
                    model: model
                }
            },
            columns: columns,
            pageable: true,
            editable: true
        });

    },


    GenerateColumns: function (response) {
        var columnNames = response["columns"];
        return columnNames.map(function (name) {
            return { field: name, format: (isDateField[name] ? "{0:D}" : "") };
        });
    },

    GenerateModel: function (response) {
        var sampleDataItem = response["data"][0];
        var model = {};
        var fields = {};
        for (var property in sampleDataItem) {
            if (property.indexOf("ID") !== -1) {
                model["id"] = property;
            }
            var propType = typeof sampleDataItem[property];
            if (propType === "number") {
                fields[property] = {
                    type: "number",
                    validation: {
                        required: true
                    }
                };
                if (model.id === property) {
                    fields[property].editable = false;
                    fields[property].validation.required = false;
                }
            } else if (propType === "boolean") {
                fields[property] = {
                    type: "boolean"
                };
            } else if (propType === "string") {
                var parsedDate = kendo.parseDate(sampleDataItem[property]);
                if (parsedDate) {
                    fields[property] = {
                        type: "date",
                        validation: {
                            required: true
                        }
                    };
                    isDateField[property] = true;
                } else {
                    fields[property] = {
                        validation: {
                            required: true
                        }
                    };
                }
            } else {
                fields[property] = {
                    validation: {
                        required: true
                    }
                };
            }
        }
        model.fields = fields;
        return model;
    }

};