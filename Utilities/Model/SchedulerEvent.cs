using System;

namespace AUtilities.Model
{
    public class SchedulerEvent
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string StartTimezone { get; set; }
        public string EndTimezone { get; set; }
        public int RecurrenceId { get; set; }
        public string RecurrenceRule { get; set; }
        public string RecurrenceException { get; set; }
        public bool IsAllDay { get; set; }


    }
}
