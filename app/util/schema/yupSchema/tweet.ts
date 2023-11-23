import * as Yup from 'yup'
export const TweetSchema = Yup.object({
    content: Yup.string().required().trim()
})