namespace AUtilities.Model
{
    public class ChartEntity
    {
        public string label { get; set; }
        public decimal data { get; set; }
        public string dataWithLabel { get; set; }
        public string color { get; set; }
        public string GetDataWithLabel()
        {
            dataWithLabel = label + " : " + data;
            return dataWithLabel;
        }
    }
}
