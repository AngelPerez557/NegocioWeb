/* ========================================
   MOSTRAR PRODUCTOS - FUNCIONALIDAD PRINCIPAL
   ========================================
   Archivo: MostrarProductos.js
   Descripción: Carga y muestra productos del diccionario JSON
   - Cargar productos desde JSON
   - Mostrar productos en tarjetas
   - Event listener para botón PRODUCTOS
   - Generar HTML dinámico para cada producto
   ======================================== */

$(document).ready(function() {
    
    // --- VARIABLES GLOBALES ---
    let todosLosProductos = [];
    
    // --- FUNCIÓN PARA CARGAR PRODUCTOS DESDE JSON ---
    /**
     * Carga los productos desde el archivo diccionario.json
     */
    function cargarProductosDelJSON() {
        console.log('Iniciando carga de productos...');
        
        $.getJSON("json/diccionario.json")
            .done(function(data) {
                console.log('Datos JSON cargados:', data);
                
                if (data && data.productos && Array.isArray(data.productos)) {
                    todosLosProductos = data.productos;
                    console.log(`${todosLosProductos.length} productos cargados correctamente`);
                } else {
                    console.error('Estructura de datos JSON inválida');
                    mostrarError('Error: Estructura de datos inválida');
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error('Error al cargar JSON:', textStatus, errorThrown);
                mostrarError('Error al cargar los productos. Verifique el archivo JSON.');
            });
    }
    
    // --- FUNCIÓN PARA MOSTRAR TODOS LOS PRODUCTOS ---
    /**
     * Muestra todos los productos en la página
     */
    function mostrarTodosLosProductos() {
        console.log('Mostrando todos los productos...');
        
        if (todosLosProductos.length === 0) {
            mostrarError('No hay productos disponibles para mostrar');
            return;
        }
        
        const container = $("#productos-container");
        container.empty(); // Limpiar contenido previo
        container.removeClass('row').addClass('productos-row'); // Usar clase personalizada
        
        // Generar HTML para cada producto
        todosLosProductos.forEach(function(producto, index) {
            const tarjetaHTML = generarTarjetaProducto(producto, index);
            container.append(tarjetaHTML);
        });
        
        // Actualizar título de la sección
        $(".productos-seccion h2").text(`Todos los Productos (${todosLosProductos.length})`);
        
        console.log(`${todosLosProductos.length} productos mostrados en pantalla`);
    }
    
    // --- FUNCIÓN PARA GENERAR HTML DE TARJETA ---
    /**
     * Genera el HTML para una tarjeta de producto
     * @param {Object} producto - Objeto producto del JSON
     * @param {number} index - Índice del producto
     * @returns {string} HTML de la tarjeta
     */
    function generarTarjetaProducto(producto, index) {
        // Procesar precio
        let precioFormateado = procesarPrecio(producto.precio);
        
        // Procesar imagen (usar imagen por defecto si no existe)
        let imagenSrc = producto.imagen || `images/${producto.nombre}.png`;
        
        // Generar badges/etiquetas
        let badges = '';
        if (producto.masvendidos === "True") {
            badges += '<span class="badge badge-success">Más Vendido</span> ';
        }
        if (producto.oferta === "True") {
            badges += '<span class="badge badge-danger">En Oferta</span>';
        }
        
        return `
            <div class="col-md-4 col-sm-6 col-xs-12">
                <div class="card producto-card" data-producto-index="${index}">
                    <!-- Imagen del producto -->
                    <div class="card-img-container">
                        <img src="${imagenSrc}" 
                             class="card-img-top" 
                             alt="${producto.nombre}"
                             style="width: 100%; height: 100%; object-fit: cover;"
                             onerror="this.src='images/default-product.png'">
                    </div>
                    
                    <!-- Cuerpo de la tarjeta -->
                    <div class="card-body">
                        <!-- Badges/Etiquetas -->
                        <div class="badges-container mb-2">
                            ${badges}
                        </div>
                        
                        <!-- Contenido principal (ocupa espacio disponible) -->
                        <div class="card-content flex-grow-1">
                            <!-- Título del producto -->
                            <h5 class="card-title">${producto.nombre}</h5>
                            
                            <!-- Descripción -->
                            <p class="card-text description text-muted small">${producto.descripcion}</p>
                            
                            <!-- Categoría -->
                            <p class="card-text">
                                <small class="text-info">
                                    <i class="fas fa-tag"></i> ${producto.categoria}
                                </small>
                            </p>
                        </div>
                        
                        <!-- Información de precio y código (siempre al final) -->
                        <div class="card-bottom mt-auto">
                            <!-- Precio -->
                            <p class="card-text precio">
                                <strong class="text-primary h5">${precioFormateado}</strong>
                            </p>
                            
                            <!-- Código del producto -->
                            <p class="card-text">
                                <small class="text-muted">Código: ${producto.codigo}</small>
                            </p>
                        </div>
                    </div>
                    
                    <!-- Pie de la tarjeta con botones -->
                    <div class="card-footer">
                        <div class="btn-group btn-group-justified" role="group">
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-primary btn-sm btn-detalles" data-producto-codigo="${producto.codigo}">
                                    <i class="fas fa-eye"></i> Detalles
                                </button>
                            </div>
                            <div class="btn-group" role="group">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // --- FUNCIÓN AUXILIAR PARA PROCESAR PRECIOS ---
    /**
     * Procesa y formatea el precio del producto
     * @param {string|number} precio - Precio del producto
     * @returns {string} Precio formateado
     */
    function procesarPrecio(precio) {
        if (!precio) return 'Precio no disponible';
        
        let precioStr = precio.toString();
        
        // Si ya tiene "lps" o "L", devolverlo tal como está
        if (precioStr.toLowerCase().includes('lps') || precioStr.toLowerCase().includes('l ')) {
            return precioStr;
        }
        
        // Si es solo un número, agregar formato
        let numeroLimpio = precioStr.replace(/[^0-9.]/g, '');
        if (numeroLimpio) {
            let numero = parseFloat(numeroLimpio);
            return `L ${numero.toFixed(2)}`;
        }
        
        return precioStr; // Devolver tal como está si no se puede procesar
    }
    
    // --- FUNCIÓN PARA MOSTRAR ERRORES ---
    /**
     * Muestra mensajes de error en el contenedor de productos
     * @param {string} mensaje - Mensaje de error a mostrar
     */
    function mostrarError(mensaje) {
        const container = $("#productos-container");
        container.html(`
            <div class="col-md-12">
                <div class="alert alert-danger text-center" role="alert">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Error:</strong> ${mensaje}
                </div>
            </div>
        `);
    }
    
    // --- EVENT LISTENER PARA BOTÓN PRODUCTOS ---
    /**
     * Event listener para el botón "PRODUCTOS" en la navegación
     */
    $("#btn-productos, #nav-productos a").on("click", function(e) {
        e.preventDefault();
        console.log('Botón PRODUCTOS clickeado');
        
        // Actualizar navegación activa
        $(".nav.navbar-nav li").removeClass("active");
        $("#nav-productos").addClass("active");
        
        // Mostrar todos los productos
        mostrarTodosLosProductos();
        
        // Hacer scroll suave hacia la sección de productos
        $('html, body').animate({
            scrollTop: $("#productos-seccion").offset().top - 70
        }, 800);
    });
    
    // --- INICIALIZACIÓN ---
    /**
     * Cargar productos al inicializar la página
     */
    console.log('Inicializando MostrarProductos.js...');
    cargarProductosDelJSON();
    
    // Exponer funciones globalmente para otros scripts
    window.mostrarTodosLosProductos = mostrarTodosLosProductos;
    window.todosLosProductos = todosLosProductos;
    
    console.log('MostrarProductos.js inicializado correctamente');

}); // FIN $(document).ready()

/* ========================================
   FIN DE MOSTRARPRODUCTOS.JS
   ======================================== */
