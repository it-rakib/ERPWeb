﻿using AUtilities;
using System;
using System.Collections.Generic;
using System.IO;

namespace DBManager
{
    public class UtilityCommon
    {
        public static string BuildWhereClause<T>(int index, string logic,
         AzFilter.GridFilter filter, List<object> parameters)
        {
            var entityType = (typeof(T));
            var property = entityType.GetProperty(filter.Field);
            switch (filter.Operator.ToLower())
            {
                case "eq":
                    parameters.Add(filter.Value.Trim());
                    return string.Format("Lower({0}) = '" + "{1}'",
                        filter.Field,
                        filter.Value.Trim().ToLower());
                case "neq":
                    parameters.Add(filter.Value.Trim());
                    return string.Format("Lower({0}) != '" + "{1}'",
                        filter.Field,
                        filter.Value.Trim().ToLower());
                case "gte":
                    parameters.Add(filter.Value.Trim());
                    return string.Format("{0} >= " + "{1}",
                        filter.Field,
                        filter.Value.Trim().ToLower());
                case "gt":
                    parameters.Add(filter.Value.Trim());
                    return string.Format("{0} > " + "{1}",
                        filter.Field,
                        filter.Value.Trim().ToLower());
                case "lte":
                    parameters.Add(filter.Value.Trim());
                    return string.Format("{0} <= " + "{1}",
                        filter.Field,
                        filter.Value.Trim().ToLower());
                case "lt":
                    if (typeof(DateTime).IsAssignableFrom(property.PropertyType))
                    {
                        parameters.Add(DateTime.Parse(filter.Value).Date);
                        return string.Format("EntityFunctions.TruncateTime(Lower({0})){1}@{2}",
                            filter.Field,
                            ToLinqOperator(filter.Operator),
                            filter.Value.Trim().ToLower());
                    }
                    if (typeof(int).IsAssignableFrom(property.PropertyType))
                    {
                        parameters.Add(int.Parse(filter.Value));
                        return string.Format("{0}{1} {2}",
                            filter.Field,
                            ToLinqOperator(filter.Operator),
                            filter.Value.Trim().ToLower());
                    }
                    parameters.Add(filter.Value);
                    return string.Format("Lower({0}){1}'{2}'",
                        filter.Field,
                        ToLinqOperator(filter.Operator),
                        filter.Value.Trim().ToLower());
                case "startswith":
                    parameters.Add(filter.Value.Trim());
                    return string.Format("Lower({0}) like '" + "{1}%'",
                        filter.Field,
                        filter.Value.Trim().ToLower());
                case "endswith":
                    parameters.Add(filter.Value.Trim());
                    return string.Format("Lower({0}) like '%" + "{1}'",
                        filter.Field,
                        filter.Value.Trim());
                case "contains":
                    parameters.Add(filter.Value);
                    return string.Format("Lower({0}) like '%" + "{1}%'",
                        filter.Field,
                        filter.Value.Trim().ToLower());
                case "doesnotcontain":
                    parameters.Add(filter.Value);
                    return string.Format("Lower({0}) not like '%" + "{1}%'",
                        filter.Field,
                        filter.Value.Trim().ToLower());


                default:
                    throw new ArgumentException(
                        "This operator is not yet supported for this Grid",
                        filter.Operator);
            }
        }

        public static string BuildWhereClause<T>(int index, string logic,
        AzFilter.AutoCompFilter filter, List<object> parameters)
        {
            var entityType = (typeof(T));

            var property = entityType.GetProperty(filter.field);


            switch (filter.@operator.ToLower())
            {
                case "eq":
                    parameters.Add(filter.value.Trim());
                    return string.Format("Lower({0}) = '" + "{1}'",
                        filter.field,
                        filter.value.Trim().ToLower());
                case "neq":
                    parameters.Add(filter.value.Trim());
                    return string.Format("Lower({0}) != '" + "{1}'",
                        filter.field,
                        filter.value.Trim().ToLower());
                case "gte":
                    parameters.Add(filter.value.Trim());
                    return string.Format("Lower({0}) >= '" + "{1}'",
                        filter.field,
                        filter.value.Trim().ToLower());
                case "gt":
                    parameters.Add(filter.value.Trim());
                    return string.Format("Lower({0}) > '" + "{1}'",
                        filter.field,
                        filter.value.Trim().ToLower());
                case "lte":
                    parameters.Add(filter.value.Trim());
                    return string.Format("Lower({0}) <= '" + "{1}%'",
                        filter.field,
                        filter.value.Trim().ToLower());
                case "lt":
                    if (typeof(DateTime).IsAssignableFrom(property.PropertyType))
                    {
                        parameters.Add(DateTime.Parse(filter.value).Date);
                        return string.Format("EntityFunctions.TruncateTime(Lower({0})){1}@{2}",
                            filter.field,
                            ToLinqOperator(filter.@operator),
                            filter.value.Trim().ToLower());
                    }
                    if (typeof(int).IsAssignableFrom(property.PropertyType))
                    {
                        parameters.Add(int.Parse(filter.value));
                        return string.Format("Lower({0}){1} '{2}'",
                            filter.field,
                            ToLinqOperator(filter.@operator),
                            filter.value.Trim().ToLower());
                    }
                    parameters.Add(filter.value);
                    return string.Format("Lower({0}){1}'{2}'",
                        filter.field,
                        ToLinqOperator(filter.@operator),
                        filter.value.Trim().ToLower());
                case "startswith":
                    parameters.Add(filter.value.Trim());
                    return string.Format("Lower({0}) like '" + "{1}%'",
                        filter.field,
                        filter.value.Trim().ToLower());
                case "endswith":
                    parameters.Add(filter.value.Trim());
                    return string.Format("Lower({0}) like '%" + "{1}'",
                        filter.field,
                        filter.value.Trim());
                case "contains":
                    parameters.Add(filter.value);
                    return string.Format("Lower({0}) like '%" + "{1}%'",
                        filter.field,
                        filter.value.Trim().ToLower());
                case "doesnotcontain":
                    parameters.Add(filter.value);
                    return string.Format("Lower({0}) not like '%" + "{1}%'",
                        filter.field,
                        filter.value.Trim().ToLower());


                default:
                    throw new ArgumentException(
                        "This operator is not yet supported for this Grid",
                        filter.@operator);
            }
        }
        public static string ToLinqOperator(string @operator)
        {
            switch (@operator.ToLower())
            {
                case "eq": return " = ";
                case "neq": return " != ";
                case "gte": return " >= ";
                case "gt": return " > ";
                case "lte": return " <= ";
                case "lt": return " < ";
                case "or": return " or ";
                case "and": return " and ";
                default: return null;
            }
        }
        public enum Status
        {
            Active = 1,
            Inactive = 0
        }


        public static Boolean IsFileExistInPath(string filePath)
        {
            try
            {
                return File.Exists(filePath);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}
