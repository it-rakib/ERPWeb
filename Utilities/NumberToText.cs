using System;
using System.Text;

namespace AUtilities
{
    public class NumberToText
    {
        /// <summary>
        /// Translate Amount(Number) to words 
        /// </summary>
        /// <param name="number">Number</param>
        /// <returns>Translated Word</returns>
        public static string GetWordOfNumber(long number)
        {
            try
            {
                var wordNumber = new StringBuilder();
                string[] tens;
                string[] ones;
                var powers = GetWords(out tens, out ones);

                if (number == 0 || number < 0) { return "0"; }
                if (number < 0)
                {
                    wordNumber.Append("Negative ");
                    number = -number;
                }

                var groupedNumber = GroupedNumber(number);
                for (int i = 3; i >= 0; i--)
                {
                    long group = groupedNumber[i];
                    GetWordForValue(@group, wordNumber, ones, i, powers, tens);
                }

                return wordNumber.ToString().Trim();
            }
            catch (Exception)
            {
                throw new Exception("Error in Creating Text ! Try again");
            }
        }

        private static void GetWordForValue(long @group, StringBuilder wordNumber, string[] ones, int i, string[] powers, string[] tens)
        {
            try
            {
                if (@group >= 100)
                {
                    wordNumber.Append(ones[@group / 100 - 1] + " Hundred ");
                    @group %= 100;

                    if (@group == 0 && i > 0)
                        wordNumber.Append(powers[i - 1]);
                }

                if (@group >= 20)
                {
                    if ((@group % 10) != 0)
                        wordNumber.Append(tens[@group / 10 - 2] + " " + ones[@group % 10 - 1] + " ");
                    else
                        wordNumber.Append(tens[@group / 10 - 2] + " ");
                }
                else if (@group > 0)
                    wordNumber.Append(ones[@group - 1] + " ");

                if (@group != 0 && i > 0)
                    wordNumber.Append(powers[i - 1]);
            }
            catch (Exception)
            {
                throw new Exception("Error, Getting Text of Number!");
            }
        }

        private static long[] GroupedNumber(long number)
        {
            try
            {
                var groupedNumber = new long[] { 0, 0, 0, 0 };
                int groupIndex = 0;

                while (number > 0)
                {
                    groupedNumber[groupIndex++] = number % 1000;
                    number /= 1000;
                }
                return groupedNumber;
            }
            catch (Exception)
            {
                throw new Exception("Error, Grouping Number!");
            }
        }

        private static string[] GetWords(out string[] tens, out string[] ones)
        {
            try
            {
                var powers = new string[] { "Thousand ", "Million ", "Billion " };
                tens = new string[] { "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };
                ones = new string[]
                                {
                                    "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
                                    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
                                };
                return powers;
            }
            catch (Exception)
            {
                throw new Exception("Error, Gettings words!");
            }
        }


        //Amount In Word
        public static string InWords(double inputValue, string beforeDecimal, string afterDecimal)
        {
            int commaCount = 0, digitCount = 0;
            string sign = "", takaWords = "", numStr = "", taka = "", paisa = "", pow = "";
            string[] pows = new string[3] { "Crore", "Thousand", "Lakh" };

            if (inputValue < 0)
            {
                sign = "Minus";
                inputValue = Math.Abs(inputValue);
            }

            numStr = inputValue.ToString("0.00");
            paisa = HundredWords(Convert.ToInt32(Right(numStr, 2)));

            if (paisa != "")
            {
                paisa = paisa.Substring(0, 1).ToUpper() + paisa.Substring(1);
                paisa = afterDecimal + " " + paisa;
            }

            numStr = Left(numStr, numStr.Length - 3);
            taka = HundredWords(Convert.ToInt32(Right(numStr, 3)));

            if (numStr.Length <= 3)
            {
                numStr = "";
            }
            else
            {
                numStr = Left(numStr, numStr.Length - 3);
            }

            commaCount = 1;
            if (numStr != "")
            {
                do
                {
                    if (commaCount % 3 == 0)
                    {
                        digitCount = 3;
                    }
                    else
                    {
                        digitCount = 2;
                    }

                    pow = HundredWords(Convert.ToInt32(Right(numStr, digitCount)));
                    if (pow != "")
                    {
                        if (Convert.ToString(inputValue).Length > 10)
                        {
                            //pow = pow + " " + pows.GetValue(commaCount % 3) + " crore ";//By Abdullah
                            pow = pow + " " + pows.GetValue(commaCount % 3);
                        }
                        else
                        {
                            pow = pow + " " + pows.GetValue(commaCount % 3);
                        }
                    }
                    if (taka != "")
                    {
                        if (pow != "")
                        {
                            pow = pow + " ";
                        }
                    }

                    taka = pow + taka;
                    if (numStr.Length <= digitCount)
                    {
                        numStr = "";
                    }
                    else
                    {
                        numStr = Left(numStr, numStr.Length - digitCount);
                    }
                    commaCount = commaCount + 1;

                }
                while (numStr != "");
            }

            if (taka != "")
            {
                taka = taka.Substring(0, 1).ToUpper() + taka.Substring(1);
                taka = taka + " " + beforeDecimal;
            }
            takaWords = taka;

            if (takaWords != "")
            {
                if (paisa != "")
                {
                    takaWords = takaWords + " And ";
                }
            }
            takaWords = takaWords + paisa;

            if (takaWords == "")
            {
                takaWords = beforeDecimal + " Zero";
            }
            takaWords = sign + takaWords + " Only";
            return takaWords;
        }

        private static string HundredWords(int inputValue)
        {
            string hundredWords = "", numStr = "", pos1 = "", pos2 = "", pos3 = "";
            string[] digits = new string[10] { "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine" };
            string[] teens = new string[10] { "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen" };
            string[] tens = new string[10] { "", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };

            numStr = Right(inputValue.ToString("000"), 3);
            if (Left(numStr, 1) != "0")
            {
                pos1 = digits.GetValue(Convert.ToInt32(Left(numStr, 1))) + " Hundred";
            }
            else
            {
                pos1 = "";
            }

            numStr = Right(numStr, 2);
            if (Left(numStr, 1) == "1")
            {
                pos2 = Convert.ToString(teens.GetValue(Convert.ToInt32(Right(numStr, 1))));
                pos3 = "";
            }
            else
            {
                pos2 = Convert.ToString(tens.GetValue(Convert.ToInt32(Left(numStr, 1))));
                pos3 = Convert.ToString(digits.GetValue(Convert.ToInt32(Right(numStr, 1))));
            }
            hundredWords = pos1;
            if (hundredWords != "")
            {
                if (pos2 != "")
                {
                    hundredWords = hundredWords + " ";
                }
            }
            hundredWords = hundredWords + pos2;

            if (hundredWords != "")
            {
                if (pos3 != "")
                {
                    hundredWords = hundredWords + " ";
                }
            }
            hundredWords = hundredWords + pos3;

            return hundredWords;
        }

        #region Left/Right/Mid  function
        public static string Left(string intputString, int Length)
        {
            string retStr = "";
            if (Length < intputString.Length)
            {
                retStr = intputString.Substring(0, Length);
            }
            else
            {
                retStr = intputString;
            }
            return retStr;
        }
        public static string Right(string intputString, int Length)
        {
            string retStr = "";
            if (Length < intputString.Length && Length > 0)
            {
                retStr = intputString.Substring((intputString.Length - Length), Length);
            }
            else
            {
                retStr = intputString;
            }
            return retStr;
        }
        public static string Mid(string intputString, int Start, int Length)
        {
            string retStr = "";

            if ((Start + Length) < intputString.Length)
            {
                retStr = intputString.Substring(Start, Length);
            }
            else if (Start < intputString.Length)
            {
                retStr = intputString.Substring(Start);
            }
            else
            {
                retStr = intputString;
            }
            return retStr;
        }
        public static string Mid(string intputString, int Start)
        {
            string retStr = "";

            if (Start < intputString.Length)
            {
                retStr = intputString.Substring(Start);
            }
            else
            {
                retStr = intputString;
            }
            return retStr;
        }
        #endregion

    }
}
