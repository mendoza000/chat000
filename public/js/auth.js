const miForm = document.querySelector('form');
const formData = {}

const url = ( window.location.hostname.includes('localhost') )
        ? 'http://localhost:8080/api/auth/'
        : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

miForm.addEventListener('submit', async event => {
    
    event.preventDefault()
    for(elem of miForm.elements) {
        if (elem.name.length > 0) {
            formData[elem.name] = elem.value
        }
    }

    const resp = await fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    const { token } = await resp.json()
    localStorage.setItem('token', token)
    window.location.pathname = './chat.html'

});