namespace Entities.HRM
{
    public class ReturnMessage
    {
        public string Message { get; set; }
        public bool Result { get; set; }

        public bool IsSalaryStopped { get; set; }
        public bool IsIncrementStopped { get; set; }
        public bool IsSuppliStopped { get; set; }

    }
}
