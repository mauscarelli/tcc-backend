/* eslint-disable no-undef */
const getBtn = document.getElementById('loginbtn')
const postBtn = document.getElementById('post-btn')

const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)

    xhr.responseType = 'json'

    if (data) {
      xhr.setRequestHeader('Content-Type', 'application/json')
    }

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response)
      } else {
        resolve(xhr.response)
      }
    }

    xhr.onerror = () => {
      reject(new Error('Something went wrong!'))
    }

    xhr.send(JSON.stringify(data))
  })
  return promise
}

const login = () => {
  const username = document.getElementById('username')
  const password = document.getElementById('password')
  sendHttpRequest('GET', 'https://localhost:3000/user/login', { username, password }).then(responseData => {
    console.log(responseData)
  })
}

const sendData = () => {
  sendHttpRequest('POST', 'https://reqres.in/api/register', {
    email: 'eve.holt@reqres.in'
    // password: 'pistol'
  })
    .then(responseData => {
      console.log(responseData)
    })
    .catch(err => {
      console.log(err)
    })
}

getBtn.addEventListener('click', login)
