import {List} from './list';

import {resetForm} from './reset-form'
import { Content } from './content';

export class Form {
  constructor(form) {
    this.form = form
    this.idField = document.querySelector('[name="id"]')
    this.dateField = document.querySelector('[name="date"]')
    this.listContainer = document.querySelector('#list')
    this.content = document.querySelector('#content')
   
    this.btnSend = document.querySelector('[type="submit"]')
    
    this.handleSubmit = this._submit.bind(this)
    this._init()
  }

  _init() {
    this.btnSend.addEventListener('click', this.handleSubmit)
  }

  _addZero(num) {
    let parsedNum = num;

    return  parsedNum < 10 ? "0" + parsedNum: parsedNum;
  }

  _buildDate(date) {
    let day = this._addZero(date.getDate());   
    let month = this._addZero(date.getMonth() + 1);
    let year = date.getFullYear();

    let hours = this._addZero(date.getHours());
    let minutes = this._addZero(date.getMinutes());
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;  
  }

  _setMetaData(id, date) {
    if (this.idField.value && this.dateField.value) return;

    this.idField.value = id;
    this.dateField.value = date;    
  }  

   _submit() {
    event.preventDefault()

    const currentMethod = this.form.getAttribute('data-method')
       
    if(!this.form.checkValidity()) {
      this.form.classList.add('invalid')
    } else {
      this.form.classList.remove('invalid')

      const currentDate = new Date()
      this._setMetaData(currentDate.getTime(), this._buildDate(currentDate))
      
      const formData = new FormData(this.form) 
      const dataForm = {}   

      for (const [name, value] of formData) {
          dataForm[name] = value
      }
      
      this._send(dataForm, currentMethod) 

      resetForm(this.form)
      
      $('#formModal').modal('hide')        
    }
  }

  _send(data, method) {
    let url = 'api/data';

    if (method == 'PUT') url = url + `/${data.id}`;
    
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(data),
    })
      .then(function(response) {
        return response.json()
      })
      .then(function(dataObj) {
        new List(document.querySelector('#list'), dataObj.list)

        if (method == 'PUT') {
          const id = document
            .querySelector('button[data-id]')
            .getAttribute('data-id')
                    
          dataObj.list.forEach(item => {
            if (id == item.id) {
              new Content(document.querySelector('#content'), item)              
            }
          });                
        }      
      })
      .catch((error) => console.error(error))
  }

}
