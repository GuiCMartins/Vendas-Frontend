import * as Yup from 'yup'

export const ValidationSchema = Yup.object().shape({
    cliente: Yup.object().nullable(true).required('Campo obrigatório!!!'),
    itens: Yup.array().min(1, 'Deve conter pelo menos um produto!!!'),
    formaPagamento: Yup.string().trim().required('Campo obrigatório!!!')
})