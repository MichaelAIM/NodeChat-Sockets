//referencias html
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const btnSalir   = document.querySelector('#btnSalir');
const ulMensajes = document.querySelector('#ulMensajes');

const url = 'http://localhost:8080/api/auth/';

let usuario = null;
let socket = null;

// validar el token del localstorage
const validacionJWT = async() => {

    const token = localStorage.getItem('token') || '';
    if(token.length <= 10){
        window.location = 'index.html';
        throw new Error(' No existe token valido');
    }

    await axios.get(url,{ headers:{ 'x-token':token }}).then( resp => {
        const { usuario: userBD, token: tokenBD } = resp.data;
        localStorage.setItem('token',tokenBD);
        usuario = userBD;

    }).catch(console.warn());
    document.title = usuario.nombre;

    await conectarSockets();

}

const conectarSockets = async() => {
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('sockets online');
    });

    socket.on('disconnect', () => {
        console.log('sockets offline');
    });
    
    socket.on('usuarios-activos', dibujarUsuarios);
    
    socket.on('recibir-mensaje', dibujarMensajes);
    
    socket.on('mensaje-privado', (payload) => {
        console.log(payload);
    });
}

const dibujarUsuarios = (usuarios = [] ) => {

    let userHtml = '';
    usuarios.forEach( ( { nombre, uid } ) => {
        userHtml += `
        <li class="mb-2">
        <p class="text-success"> ${nombre} </p>
        <span class="fs-6 text-muted"> ${uid} </span>
        </li>
        `;
    });
    ulUsuarios.innerHTML = userHtml;
}

const dibujarMensajes = (mensajes = [] ) => {

    let mensajeHtml = '';
    
    mensajes.forEach( ( { nombre, mensaje } ) => {
        mensajeHtml += `
        <li class="mb-2">
        <span class="text-primary"> ${ nombre }: </span>
        <span> ${ mensaje } </span>
        </li>
        `;
    });
    
    ulMensajes.innerHTML = mensajeHtml;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if (keyCode !== 13) { return; }
    if (mensaje.length === 0) { return; }
    socket.emit('enviar-mensaje', { uid, mensaje } );
    txtMensaje.value = '';
});



const main = async() => {
    //Validar JWT
    await validacionJWT();
} 

main();