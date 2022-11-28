
'use strict'

const inputElement = document.getElementById("input");
const salvar = document.getElementById('salvar')
const edit = document.querySelector('#tableTarefa>tbody')
const delete_Tarefa = document.getElementById('delete-tarefa')


// CRUD
const getLocalStorage = () => JSON.parse(localStorage.getItem('listaTarefas')) ?? []
const setLocalStorage = (listaTarefas) => localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas))


const createTarefa = () => {

  if (inputElement.value.length < 3) {
    alert("Sua tarefa precisa ter pelo menos 3 letras!");
  } else {
    const listaTarefas = getLocalStorage()
    const tarefa = inputElement.value;
    listaTarefas.push(tarefa)
    inputElement.value = '';
    setLocalStorage(listaTarefas)
    updateTable()
  }
}

const readTarefa = () => getLocalStorage()

const deleteTarefa = (index) => {
  const listaTarefas = readTarefa()
  listaTarefas.splice(index, 1)
  setLocalStorage(listaTarefas)
}

// INTERAÇÃO COM O LAYOUT

const createRow = (inputElement, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
  <td>${inputElement}</td>
  <td>
  <button type="button" class="button red" id="delete-${index}" >Excluir</button>
  </td>`

  edit.appendChild(newRow)
}


const clearTable = () => {
  const rows = document.querySelectorAll('#tableTarefa>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
  const listaTarefas = readTarefa()
  clearTable()
  listaTarefas.forEach(createRow)
}

updateTable()


const editDelete = (event) => {
  if (event.target.type == 'button') {

    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editTarefa(index)
    } else {
      const tarefa = readTarefa()[index]
      const response = confirm(`Deseja realmente excluir a tarefa: "${tarefa}"?`)
      if (response) {
        deleteTarefa(index)
        updateTable()
      }
    }
  }
}

updateTable()

// EVENTOS
salvar.addEventListener('click', createTarefa)
edit.addEventListener('click', editDelete)
