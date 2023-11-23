export type Notification = {
    "id": string,
    "userFrom": string,
    "userTo": string,
    "type": string,
    "opened": boolean,
    "DestinationUser": NotificationUser,
    "OriginUser": NotificationUser
}

export type NotificationUser = {
        "id": string,
        "name": string,
        "image": string | null,
        "username": string | null,
}