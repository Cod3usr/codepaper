// Crear una función que cargue un archivo JavaScript desde una URL
function loadScript(url) {
    // Crear un elemento script
    var script = document.createElement('script');
    // Asignar la URL al atributo src del elemento script
    script.src = url;
    // Añadir el elemento script al documento
    document.head.appendChild(script);
  }
  
  // Cargar el archivo dat.gui.min.js usando la función loadScript()
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.min.js');
  
  // Crear una variable para guardar el objeto GUI
  var gui;
  
  // Crear una variable para guardar los parámetros
  var params;
  
  // Crear una variable para guardar la imagen rasterizada
  var raster;
  
  // Crear una variable para guardar el objeto Path
  var path;
  
  // Usar la función onFrame() de paper.js para ejecutar el código cuando se cargue el archivo dat.gui.min.js
  function onFrame(event) {
    // Comprobar si el objeto dat.GUI existe
    if (dat && dat.GUI) {
      // Si existe, crear el objeto GUI si no se ha creado antes
      if (!gui) {
        gui = new dat.GUI();
        // Crear un objeto que contenga los parámetros
        params = {
          calibre: 1,
          lineas: 10,
          ancho: 10,
          alto: 10,
          angulo: 0
        };
        // Añadir los parámetros al objeto GUI
        gui.add(params, 'calibre', 0.1, 10);
        gui.add(params, 'lineas', 1, 20);
        gui.add(params, 'ancho', 1, 20);
        gui.add(params, 'alto', 1, 20);
        gui.add(params, 'angulo', -180, 180);
      }
      // Si se ha creado el objeto GUI, cargar la imagen rasterizada si no se ha cargado antes
      if (!raster) {
        raster = new Raster('http://assets.paperjs.org/images/marilyn.jpg');
        // Ocultar la imagen hasta que esté cargada
        raster.visible = false;
        // Centrar la imagen en la vista
        raster.position = view.center;
      }
      // Si se ha cargado la imagen rasterizada, crear el objeto Path si no se ha creado antes
      if (!path) {
        path = createLines(view.center, params.lineas, params.lineas);
      }
      // Si se ha creado el objeto Path, asignar un color a cada segmento de las líneas según la imagen
      for (var i = 0; i < path.segments.length; i++) {
        var segment = path.segments[i];
        // Calcular el punto medio del segmento
        var point = segment.point.add(segment.handleIn).divide(2);
        // Calcular el ancho y el alto del rectángulo
        var width = view.size.width / params.lineas;
        var height = view.size.height;
        // Calcular la posición del rectángulo
        var x = point.x - width / 2;
        var y = 0;
        // Crear el rectángulo que define la zona de la imagen
        var rect = new Rectangle(x, y, width, height);
        // Obtener el color promedio de la zona de la imagen
        var color = raster.getAverageColor(rect);
        // Asignar el color al segmento
        segment.setColor(color);
      }
    }
  }
  
  // Crear una función que dibuje bloques de líneas con un centro, un número de columnas y un número de filas
  function createLines(center, columns, rows) {
      // Crear un objeto Path vacío
      var path = new Path();
      // Calcular la distancia entre columnas y filas
      var columnDistance = view.size.width / columns;
      var rowDistance = view.size.height / rows;
      // Añadir los segmentos al objeto Path con el método add()
      for (var i = 0; i < columns; i++) {
        for (var j = 0; j < rows; j++) {
          // Calcular la posición del segmento
          var x = i * columnDistance;
          var y = j * rowDistance;
          // Añadir el segmento al objeto Path
          path.add(new Point(x, y));