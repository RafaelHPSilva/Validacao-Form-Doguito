import { validaInput } from './validacao-data.js'

const inputs = document.querySelectorAll('input')
inputs.forEach(input => {

  if (input.dataset.tipo === 'preco') {
    SimpleMaskMoney.setMask(input, {
      prefix: 'R$',
      suffix: '',
      fixed: true,
      fractionDigits: 2,
      decimalSeparator: ',',
      thousandsSeparator: '.',
      cursor: 'end'
    })
  }
    
  input.addEventListener('blur', evento => {
    validaInput(evento.target)
  })
})
