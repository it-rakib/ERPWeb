using System;
using System.Reflection;

namespace AUtilities
{
    public class QueryBuilder<T>
    {

        public static string QueryString(T objEntity, string tableName, string[] columns)
        {



            string rv = "";
            string str1 = "INSERT INTO " + tableName;
            foreach (var column in columns)
            {

                var properties = objEntity.GetType().GetProperties();
                foreach (var propertyInfo in properties)
                {

                    if (propertyInfo.Name.ToLower() == column.ToLower())
                    {
                        PropertyInfo prop = propertyInfo;

                        ValueChecker(prop, objEntity);


                        break;
                    }

                }


            }
            return rv;
        }

        private static dynamic ValueChecker(PropertyInfo prop, dynamic value)
        {
            switch (prop.PropertyType.Name)
            {
                case "Int32":
                    value = Convert.ToInt32(value);
                    break;

                case "Int64":
                    value = Convert.ToInt64(value);
                    break;

                case "Double":
                    value = Convert.ToDouble(value);
                    break;

                case "Decimal":
                    value = Convert.ToDecimal(value);
                    break;

                case "Single":
                    value = Convert.ToSingle(value);
                    break;

                case "String":
                    value = "'" + Convert.ToString(value) + "'";
                    break;

                case "Char":
                    value = Convert.ToChar(value);
                    break;

                case "Byte":
                    value = Convert.ToByte(value);
                    break;

                case "Boolean":
                    value = Convert.ToBoolean(value);
                    break;

                case "DateTime":
                    value = "'" + Convert.ToDateTime(value) + "'";
                    break;

            }
            return value;
        }
    }
}
