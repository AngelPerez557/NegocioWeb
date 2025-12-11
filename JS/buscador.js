/* ========================================
   BUSCADOR DE PRODUCTOS
   ========================================
   Archivo: buscador.js
   Descripción: Funcionalidad de búsqueda por nombre y precio
   ======================================== */

$(document).ready(function() {
    let todosLosProductos = [];
    let productosFiltrados = [];

    // Obtener referencia a los elementos del buscador
    const inputBuscador = $("#buscador-productos");
    const btnBuscar = inputBuscador.closest(".input-group").find(".btn");

    // Esperar a que se carguen los productos desde script.js
    function verificarProductos() {
        if (window.todosLosProductos && window.todosLosProductos.length > 0) {
            todosLosProductos = window.todosLosProductos;
            inicializarBuscador();
        } else {
            setTimeout(verificarProductos, 100);
        }
    }

    function inicializarBuscador() {
        console.log('Buscador inicializado con', todosLosProductos.length, 'productos');

        // Event listener para búsqueda en tiempo real (mientras escribe)
        inputBuscador.on("input", function() {
            buscarProductos();
        });

        // Event listener para el botón de búsqueda (opcional, ejecuta la búsqueda)
        btnBuscar.on("click", function(e) {
            e.preventDefault();
            buscarProductos();
        });

        // Event listener para búsqueda al presionar Enter
        inputBuscador.on("keypress", function(e) {
            if (e.which == 13) { // Enter key
                e.preventDefault();
                buscarProductos();
                return false;
            }
        });
    }

    function buscarProductos() {
        const termino = inputBuscador.val().trim().toLowerCase();

        if (termino === "") {
            // Si está vacío, mostrar todos los productos
            mostrarTodosProductos();
            return;
        }

        productosFiltrados = todosLosProductos.filter(function(producto) {
            const nombre = producto.nombre.toLowerCase();
            const categoria = (producto.categoria || "").toLowerCase();
            const precio = parseInt(producto.precio);

            // Búsqueda por nombre o categoría
            const coincideNombre = nombre.includes(termino) || categoria.includes(termino);

            // Búsqueda por rango de precio (ej: "100-500" o "100")
            const esBusquedaPrecio = /^\d+(-\d+)?$/.test(termino);
            let coincidePrecio = false;

            if (esBusquedaPrecio) {
                if (termino.includes("-")) {
                    const partes = termino.split("-");
                    const precioMin = parseInt(partes[0]);
                    const precioMax = parseInt(partes[1]);
                    coincidePrecio = precio >= precioMin && precio <= precioMax;
                } else {
                    const precioExacto = parseInt(termino);
                    // Búsqueda aproximada (dentro de ±25% del precio)
                    coincidePrecio = Math.abs(precio - precioExacto) <= precioExacto * 0.25;
                }
            }

            return coincideNombre || coincidePrecio;
        });

        mostrarResultados();
    }

    function mostrarTodosProductos() {
        // Filtrar por "más vendidos" si es necesario, o mostrar todos
        if (window.mostrarProductos) {
            window.mostrarProductos(todosLosProductos);
        }
        inputBuscador.val("");
    }

    function mostrarResultados() {
        if (productosFiltrados.length === 0) {
            $("#productos-container").html(
                '<div class="col-md-12"><p class="text-center"><i class="fas fa-search"></i> No se encontraron productos que coincidan con tu búsqueda.</p></div>'
            );
            $(".productos-seccion h2").text("Resultados de búsqueda");
            return;
        }

        if (window.mostrarProductos) {
            window.mostrarProductos(productosFiltrados);
            $(".productos-seccion h2").text(`Resultados de búsqueda (${productosFiltrados.length})`);
        }
    }

    // Iniciar verificación de productos
    verificarProductos();

    // Exponer función globalmente
    window.buscarProductos = buscarProductos;

}); // FIN $(document).ready()
