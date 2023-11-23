import * as Yup from 'yup'
export const RegisterSchema = Yup.object({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(6).trim(),
    name: Yup.string().required().min(4).trim()
})