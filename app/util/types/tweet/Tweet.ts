export type TweetLikes = {
    id: string,
    userId: string
}

export type TweetRetweets = {
    id: string,
    user: {
        id: string,
        username: string | null,
        name: string,
        image: string
    }
}

export type Poster = {
    id: string,
    name: string,
    image: string | null,
    username: string
}

export type Tweet = {
    id: string,
    content: string | null,
    postedBy: string,
    repliedTo: string | null,
    retweetFrom: string | null,
    createdAt: string,
    post: Tweet | null,
    data: Tweet | null
    user: Poster,
    likes: TweetLikes[],
    retweets: TweetRetweets[]
}

