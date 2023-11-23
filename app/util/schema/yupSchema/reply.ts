import * as Yup from 'yup'
export const ReplySchema = Yup.object({
    content: Yup.string().required().trim(),
    repliedTo: Yup.string().required()
}) 