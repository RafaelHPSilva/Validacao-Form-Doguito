/* VALIDA TIPO INPUT */

export function validaInput(input) {
  const tipoDeInput = input.dataset.tipo // vai determinar o tipo de data atributes que queremos
  
  if (validadores[tipoDeInput]) {
    // Vai fazer a validaçao se no validadores se há algum data-tipo (data-tipo).
    validadores[tipoDeInput](input) //Se tiver vai executar os validadores (os inputs)
  }

if(input.validity.valid){
input.parentElement.classList.remove('input-container--invalido')
input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
}else
input.parentElement.classList.add('input-container--invalido')
input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagensDeErros(tipoDeInput, input)
}

const validadores = { // Array dos tipos de datasatributes de input
  dataNascimento: input => validaDataNascimento(input),
  cpf: input => validaCPF(input),
  cep: input => recuperarCEP(input)
}

const tiposDeErro = [
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'customError'
]
  
/* MENSAGENS DE ERROS */

const mensagensdeErro = {
  nome: {
    valueMissing:'Esse campo não pode ficar vazio.'
  },

 email:{
  valueMissing: 'Esse campo não pode ficar vazio.',
  typeMismatch:'Email inválido, por favor preencher conforme modelo.'
 },

 senha:{
  valueMissing: 'Esse campo não pode ficar vazio.',
  patternMismatch: 'Senha deve conter 6-12 cacteres, com apenas numeros e letras'
 },

 dataNascimento:{
  valueMissing: 'Esse campo não pode ficar vazio.',
  customError: 'Você precisa ser maior que 18 anos para cadastrar.'
 },

 cpf:{
  valueMissing: 'Esse campo não pode ficar vazio.',
  customError: 'CPF inválido, insira corretamente o número de seu CPF.'
 },

 cep:{
  valueMissing: 'Esse campo não pode ficar vazio.',
  patternMismatch: 'O CEP é inválido.',
  customError:"CEP não encontrado!"
 },

 logradouro:{
  valueMissing: 'Esse campo não pode ficar vazio.',
  
 },

 cidade:{
  valueMissing: 'Esse campo não pode ficar vazio.',
  
 },

 estado:{
  valueMissing: 'Esse campo não pode ficar vazio.',
  
 },
}
/* VALIDACAO DO CPF  */

function validaCPF(input) {
  const cpfFormatado = input.value.replace(/\D/g, '')
  let mensagem = ''

  if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado, multiplicador)) {
      mensagem = 'O CPF digitado não é válido.'
  }

  input.setCustomValidity(mensagem)
}

function checaCPFRepetido(cpf) {
  const valoresRepetidos = [
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999'
  ]
  let cpfValido = true

  valoresRepetidos.forEach(valor => {
      if(valor == cpf) {
          cpfValido = false
      }
  })

  return cpfValido
}

function checaEstruturaCPF(cpf) {
  const multiplicador = 10

  return checaDigitoVerificador(cpf, multiplicador)
}

function checaDigitoVerificador(cpf, multiplicador) {
  if(multiplicador >= 12) {
      return true
  }

  let multiplicadorInicial = multiplicador
  let soma = 0
  const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
  const digitoVerificador = cpf.charAt(multiplicador - 1)
  for(let contador = 0; multiplicadorInicial > 1 ; multiplicadorInicial--) {
      soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
      contador++
  }

  if(digitoVerificador == confirmaDigito(soma)) {
      return checaDigitoVerificador(cpf, multiplicador + 1)
  }

  return false
}

function confirmaDigito(soma) {
  return 11 - (soma % 11)
}

/* MENSAGEM DE ERRO CUSTOMIZADA */
function mostraMensagensDeErros(tipoDeInput,input) { // Precisa saber qual tipo que input e identificar quais inputs que temos
  let mensagem = ''
  tiposDeErro.forEach(erro => {
    if (input.validity[erro]) {
      mensagem = mensagensdeErro[tipoDeInput][erro]
    }
  });
  return mensagem
}

/* VALIDA SE A IDADE DO CLIENTE */

function validaDataNascimento(input) {
  const dataRecebida = new Date(input.value)
  let mensagem = ''

  if (!dataMaior18(dataRecebida)) {
    mensagem = 'Voce precisa ser maior que 18 anos para se cadastrar'
  }

  input.setCustomValidity(mensagem)
}

/* CALCULA IDADE */

function dataMaior18(data) {
  const dataAtual = new Date() //  será a data atual, quando estiver vazio
  const dataMais18 = new Date(
    data.getUTCFullYear() + 18,
    data.getUTCMonth(),
    data.getUTCDate()
    //Pegará a dataRecebida e somar mais 18anos.
  )

  return dataMais18 <= dataAtual // Se for maior do que a data do cadastro (atual), dará falso.
}

function recuperarCEP(input) {
  const cep = input.value.replace(/\D/g, '')
  const url = `https://viacep.com.br/ws/${cep}/json`
  const option = {
    method: 'GET',
    mode: 'cors',
    Headers: {
'content-type': 'application/json; charset = utf-8'
    }
  }
  if (!input.validity.valueMissing && !input.validity.patternMismatch) {
    fetch(url, option).then(
      response => response.json()
    )
    .then(
      data =>{
        if (data.error) {
          input.setCustomValidity('CEP não encontrado!')
          return
        }
          input.setCustomValidity('')
          preencheComCEP(input)
          return  
      }
    )
  }

}

function preencheComCEP(data) {
  const logradouro = document.querySelector('[data-tipo= "logradouro"]')
 logradouro.value = data.logradouro

  const cidade = document.querySelector('[data-tipo= "cidade"]')
  cidade.value = data.localidade

  const estado = document.querySelector('[data-tipo= "estado"]')
  estado.value = data.uf 
}