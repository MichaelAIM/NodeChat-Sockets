const form = document.querySelector('form');
const url = 'http://localhost:8080/api/auth/';
// const url = 'https://restserver-node-michael.herokuapp.com/api/auth/google';

form.addEventListener('submit', ev => {
 ev.preventDefault();
 const formData = {};

    for(let el of form.elements){
        if( el.name.length > 0 ){
            formData[el.name] = el.value;
        }
    }
    const body = JSON.stringify(formData);
    const headers = {'content-type': 'application/json' };
    axios.post(url+'login',body,{headers}).then( resp => {
        console.log(resp.data);
        localStorage.setItem('email',resp.data.usuario.correo);
        localStorage.setItem('token',resp.data.token);
        window.location = 'chat.html';
    }).catch(console.warn());
});

function handleCredentialResponse(response) {
    //Google Token 
    const body = {'id_token': response.credential};
    const headers = {
        'x-access-token': 'token-value',
        'content-type': 'application/json'
    }
    axios.post(url+'google',body,{headers}).then( resp => {
        console.log(resp.data);
        localStorage.setItem('email',resp.data.usuario.correo);
        localStorage.setItem('token',resp.data.token);
        window.location = 'chat.html';
    }).catch(console.warn());
}

const button = document.getElementById("google_signOut");
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke( localStorage.getItem( 'email' ), done => {
        localStorage.clear();
        location.reload();
    });
}