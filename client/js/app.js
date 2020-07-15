import { Form } from './form';
import { List } from './list';
import { resetForm } from './reset-form'

const formNode = document.querySelector('#form');

new Form(formNode);

// ---------------------------------------------------

const createBtnNode = document.querySelector('#createBtn')
createBtnNode.addEventListener('click', () => {
  formNode.setAttribute('data-method', 'POST')
  resetForm(formNode)
  
  $('#formModal').modal('show')
})


const listNode = document.querySelector('#list');

fetch('/api/data', { method: 'GET' })
  .then(function(response) {
    return response.json()
  })  
  .then(function(data) {    
    new List(listNode, data.list)
  })
  .catch(function(error) {
    console.error(error)
  });
