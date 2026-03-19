using Capital.Core.Entities.Base;

namespace Capital.Core.Entities;

public enum EReactionType
{
    Like = 1,
    Dislike = 2
}

public class ReviewReaction : BaseEntity
{
    public int ReviewId { get; set; }
    public Review Review { get; set; } = null!;

    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;

    public EReactionType ReactionType { get; set; }
}
