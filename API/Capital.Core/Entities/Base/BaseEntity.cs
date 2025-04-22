namespace Capital.Core.Entities.Base;

public abstract class BaseEntity
{
    public Guid Id{ get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime? UpdatedTime { get; set; }
    public bool isDeleted { get; set; }
    public bool isUpdated { get; set; }
}

