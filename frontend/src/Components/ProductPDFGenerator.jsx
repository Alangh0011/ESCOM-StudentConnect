import jsPDF from 'jspdf';

const ProductPDFGenerator = ({ productos }) => {
  // Función para generar el archivo PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    let y = 15; // Posición inicial de escritura

    // Agregar título al documento
    doc.text('Lista de Productos', 10, y);
    y += 10;

    // Iterar sobre la lista de productos y agregarlos al documento
    productos.forEach((producto) => {
      doc.text(`ID: ${producto.id}, Nombre: ${producto.nombre}, Precio: $${producto.precio}`, 10, y);
      y += 10;
    });

    // Guardar el documento como un archivo PDF
    doc.save('productos.pdf');
  };

  return (
    <div>
      {/* Botón para generar el PDF */}
      <button onClick={generarPDF}>Generar PDF</button>
    </div>
  );
};

export default ProductPDFGenerator;

