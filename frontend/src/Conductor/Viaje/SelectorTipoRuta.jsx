const SelectorTipoRuta = ({ tipoRuta, setTipoRuta }) => (
    <div className="mb-6">
        <div className="flex justify-center space-x-4">
            <button
                onClick={() => setTipoRuta('E')}
                className={`px-6 py-2 rounded-lg transition-all ${
                    tipoRuta === 'E' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                Escuela a Casa
            </button>
            <button
                onClick={() => setTipoRuta('C')}
                className={`px-6 py-2 rounded-lg transition-all ${
                    tipoRuta === 'C' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                Casa a Escuela
            </button>
        </div>
    </div>
);

export default SelectorTipoRuta;