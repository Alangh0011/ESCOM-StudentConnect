
import MaquinaEscribir from './Maquina_escribir'; // Importa el componente de la máquina de escribir

export default function Hero() {
    // Define la altura de la sección como una cadena de clase CSS
    const height = "h-[calc(100vh-8rem)]";

    return (
        // Renderiza la sección del héroe con clases de Tailwind CSS y estilos en línea
        <section className={`mt-4 flex flex-col items-center justify-center px-4 text-white md:mx-10 ${height}`} id="inicio">
            {/* Renderiza un video de fondo con un archivo mp4 */}
            <video autoPlay loop muted className="absolute h-full w-full rounded-3xl object-cover">
                <source src="https://docs.material-tailwind.com/demo.mp4" type="video/mp4"/>
                Tu navegador no soporta el elemento video
            </video>
            <div className="flex flex-col gap-3"/> {/* Elemento div vacío */}
            {/* Renderiza el título de bienvenida */}
            <h1 className="text-center text 4x1 font-bold mix-blend-difference md:text-8xl">WELCOME</h1>
            {/* Renderiza el componente de la máquina de escribir */}
            <MaquinaEscribir />
        </section>
    );
}

