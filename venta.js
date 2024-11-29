document.addEventListener('DOMContentLoaded', () => {
    const listaMisProductos = document.getElementById('lista-mis-productos');
    const añadirProductoBtn = document.getElementById('añadir-producto');
    const totalVentas = document.getElementById('total-ventas');

    // Función para obtener el usuario actual
    function obtenerUsuarioActual() {
        return JSON.parse(localStorage.getItem('usuarioActual'));
    }

    // LocalStorage para mis productos
    function guardarMisProductos(misProductos) {
        const usuarioActual = obtenerUsuarioActual();
        localStorage.setItem(`misProductos_${usuarioActual.email}`, JSON.stringify(misProductos));
        cargarMisProductos();
    }

    function cargarMisProductos() {
        const usuarioActual = obtenerUsuarioActual();
        const misProductos = JSON.parse(localStorage.getItem(`misProductos_${usuarioActual.email}`)) || [];
        listaMisProductos.innerHTML = '';
        misProductos.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('col-md-12', 'item-producto');
            div.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">Precio: $${item.price}</p>
                        <button class="btn btn-danger" data-id="${item.id}">Eliminar</button>
                    </div>
                </div>
            `;
            listaMisProductos.appendChild(div);
        });
        cargarBalanceVentas();

        // Añadir eventos a los botones de eliminar después de cargar los productos
        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                eliminarDeMisProductos(id);
            });
        });
    }

    function cargarBalanceVentas() {
        const usuarioActual = obtenerUsuarioActual();
        const misProductos = JSON.parse(localStorage.getItem(`misProductos_${usuarioActual.email}`)) || [];
        let total = 0;
        misProductos.forEach(item => {
            total += item.price;
        });
        totalVentas.textContent = total.toFixed(2);
    }

    function añadirAMisProductos(title, price) {
        const usuarioActual = obtenerUsuarioActual();
        let misProductos = JSON.parse(localStorage.getItem(`misProductos_${usuarioActual.email}`)) || [];
        const id = new Date().getTime(); // Generar un ID único basado en el tiempo actual
        misProductos.push({ id, title, price });

        guardarMisProductos(misProductos);
    }

    function eliminarDeMisProductos(id) {
        const usuarioActual = obtenerUsuarioActual();
        let misProductos = JSON.parse(localStorage.getItem(`misProductos_${usuarioActual.email}`)) || [];
        misProductos = misProductos.filter(prod => prod.id !== id);

        guardarMisProductos(misProductos);
    }

    // Evento para añadir nuevos productos
    añadirProductoBtn.addEventListener('click', () => {
        const title = prompt('Nombre del producto:');
        const price = parseFloat(prompt('Precio del producto:'));

        if (title && price) {
            // Añadir producto a "Mis Productos"
            añadirAMisProductos(title, price);
        } else {
            alert('Datos del producto incompletos.');
        }
    });

    cargarMisProductos();
});
