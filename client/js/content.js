import {List} from './list';

export class Content {
  constructor(content, item) {
    this.item = item
    this.content = content
    
    this._init()
  }

  _init() {
    this._render()
  }

  _clear() {
    this.content.innerHTML = "";
  }

  _createEditButton(id) {
    const btnNode = document.createElement('button')
    btnNode.classList.value = 'btn btn-warning mt-auto';
    btnNode.textContent = 'Edit';
    btnNode.setAttribute('data-id', id);
    
    btnNode.addEventListener('click', this._clickEditBtn)

    return btnNode;
  }

  _clickEditBtn(event) {
    const id = event.currentTarget.getAttribute('data-id')
    
    const form = document.querySelector('#form')
    const titleField = form.querySelector('[name="title"]')
    const contentField = form.querySelector('[name="content"]')
    const idField = form.querySelector('[name="id"]')
    const dateField = form.querySelector('[name="date"]')
    
    form.setAttribute('data-method', 'PUT')    

    fetch( '/api/data', { method: 'GET' })
      .then(function(response) {
        return response.json()
      })
      .then(function(dataObj) {
        dataObj.list.forEach(function(item) {
          
          if(item.id == id) {
            titleField.value = item.title;
            contentField.value = item.content;
            idField.value = item.id;
            dateField.value = item.date;
                      
            $('#formModal').modal('show')
          } 
        })      
      })
      .catch((error) => console.error(error))     
  }

  _createDeleteButton(id) {
    const btnDeleteNode = document.createElement('button')
    btnDeleteNode.classList.value = 'btn btn-danger ml-2'
    btnDeleteNode.textContent = 'Delete'
    btnDeleteNode.setAttribute('data-id', id)

    btnDeleteNode.addEventListener('click', this._deletePost)

    return btnDeleteNode
  }

  _deletePost() {
    const id = event.currentTarget.getAttribute('data-id')
    const isConfirm = confirm('Вы точно хотите удалить пост?')

    if (!isConfirm) return
    
    fetch( `/api/data/${id}`, { method: 'DELETE' })
      .then(function(response) {
        return response.json()
      })
      .then(function(dataObj) {
        const content = document.querySelector('#content')
        content.innerHTML = "";      

        new List(document.querySelector('#list'), dataObj.list);           
      })
      .catch((error) => console.error(error))
  }

  _render(item) {
    const btnEdit = this._createEditButton(this.item.id)    
    const btnDelete = this._createDeleteButton(this.item.id)
    
    const template = `
      <h3>${this.item.title}</h3>
      <h6 class="text-muted">${this.item.date}</h6>
      <p>${this.item.content}</p>
    `
    this._clear()  
    this.content.innerHTML = this.content.innerHTML + template;

    const btnWrap = document.createElement('div')
    btnWrap.classList.value = 'mt-auto'
    btnWrap.append(btnEdit, btnDelete)
    this.content.append(btnWrap)
  }

}