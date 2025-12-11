(function ($) {
  'use strict';

  var todosLosProductos = [];

  function cargarProductos() {
    $.getJSON('../../../json/diccionario.json')
      .done(function (data) {
        if (!data || !data.productos) {
          renderMensaje('No se encontraron productos.');
          return;
        }
        todosLosProductos = data.productos.filter(function (p) {
          return p.estado === 'activo';
        });
        renderProductos(todosLosProductos);
        $('#titulo-seccion').text('Nuestros Productos');
        actualizarContador(todosLosProductos.length);
      })
      .fail(function () {
        renderMensaje('Error al cargar los productos.');
      });
  }

  function actualizarContador(total) {
    $('#contador-resultados').text(total ? total + ' productos' : '');
  }

  function buildImagen(producto) {
    if (producto.imagen) return producto.imagen;
    var nombreImagen = (producto.nombre || '').trim() + '.png';
    return '../../../images/' + nombreImagen;
  }

  function renderProductos(lista) {
    var $c = $('#productos-container');
    $c.empty();

    if (!lista || lista.length === 0) {
      renderMensaje('No se encontraron productos en esta búsqueda.');
      actualizarContador(0);
      return;
    }

    lista.forEach(function (producto) {
      var imagenUrl = buildImagen(producto);
      var precio = parseFloat(producto.precio || 0).toFixed(2);
      var card = [
        '<div class="col-md-3 col-sm-4 col-xs-6">',
        '  <div class="product">',
        '    <div class="product-img">',
        '      <img src="' + imagenUrl + '" alt="' + (producto.nombre || '') + '" onerror="this.src=\'../../../images/producto-default.svg\'">',
        '    </div>',
        '    <div class="product-body">',
        '      <p class="product-category">' + (producto.categoria || 'Sin categoría') + '</p>',
        '      <h3 class="product-name">' + (producto.nombre || '') + '</h3>',
        '      <h4 class="product-price">L ' + precio + '</h4>',
        '      <p class="product-description">' + (producto.descripcion || '') + '</p>',
        '    </div>',
        '    <div class="product-btns">',
        '      <button class="quick-view" data-nombre="' + (producto.nombre || '') + '"><i class="fa fa-eye"></i> Ver detalles</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('');
      $c.append(card);
    });
    actualizarContador(lista.length);
  }

  function renderMensaje(msg) {
    $('#productos-container').html(
      '<div class="col-md-12"><p class="text-center">' + msg + '</p></div>'
    );
  }

  function buscar() {
    var termino = ($('#buscador-productos').val() || '').trim().toLowerCase();
    if (!termino) {
      renderProductos(todosLosProductos);
      $('#titulo-seccion').text('Nuestros Productos');
      return;
    }

    var resultados = todosLosProductos.filter(function (p) {
      var nombre = (p.nombre || '').toLowerCase();
      var categoria = (p.categoria || '').toLowerCase();
      var precio = parseFloat(p.precio || 0);

      var coincideTexto = nombre.includes(termino) || categoria.includes(termino);
      var esRango = /^\d+(-\d+)?$/.test(termino);
      var coincidePrecio = false;

      if (esRango) {
        if (termino.includes('-')) {
          var partes = termino.split('-');
          var min = parseFloat(partes[0] || 0);
          var max = parseFloat(partes[1] || 0);
          coincidePrecio = precio >= min && precio <= max;
        } else {
          var objetivo = parseFloat(termino);
          coincidePrecio = Math.abs(precio - objetivo) <= objetivo * 0.25;
        }
      }
      return coincideTexto || coincidePrecio;
    });

    $('#titulo-seccion').text('Resultados de búsqueda');
    renderProductos(resultados);
  }

  function mostrarDetalles(nombre) {
    var producto = todosLosProductos.find(function (p) { return p.nombre === nombre; });
    if (!producto) return;

    var imagenUrl = buildImagen(producto);
    $('#detalle-imagen').attr('src', imagenUrl).attr('alt', producto.nombre);
    $('#detalle-nombre').text(producto.nombre || '');
    $('#detalle-codigo').text('Código: ' + (producto.codigo || 'N/A'));
    $('#detalle-categoria').text(producto.categoria || 'Sin categoría');
    $('#detalle-precio').text('L ' + parseFloat(producto.precio || 0).toFixed(2));
    $('#detalle-descripcion').text(producto.descripcion || '');
    $('#modalDetalles').modal('show');
  }

  function bindEventos() {
    $('#btn-buscar').on('click', function (e) {
      e.preventDefault();
      buscar();
    });
    $('#buscador-productos').on('input', function () {
      buscar();
    });
    $(document).on('click', '.quick-view', function () {
      var nombre = $(this).data('nombre');
      mostrarDetalles(nombre);
    });
  }

  $(function () {
    bindEventos();
    cargarProductos();
  });

})(jQuery);
