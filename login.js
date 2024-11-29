document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registroForm = document.getElementById('registro-form');

    // LocalStorage para usuarios
    function guardarUsuario(usuario) {
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuarios.push(usuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    function obtenerUsuarios() {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find(user => user.email === email && user.password === password);

        if (usuario) {
            alert('Login exitoso');
            localStorage.setItem('usuarioActual', JSON.stringify(usuario));
            if (usuario.role === 'comprador') {
                window.location.href = 'compra.html';
            } else if (usuario.role === 'vendedor') {
                window.location.href = 'venta.html';
            }
        } else {
            alert('Email o contraseña incorrectos');
        }
    });

    registroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('registro-email').value;
        const password = document.getElementById('registro-password').value;
        const role = document.getElementById('registro-rol').value;
        const nuevoUsuario = { email, password, role };
        guardarUsuario(nuevoUsuario);
        alert('Registro exitoso');
        window.location.href = 'login.html';
    });
});
