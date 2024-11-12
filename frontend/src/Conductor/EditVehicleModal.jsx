// EditVehicleModal.jsx
import React, { useState, useEffect } from 'react';

const EditVehicleModal = ({ userId, onClose, onSuccess, onError }) => {
    const [vehicleData, setVehicleData] = useState({
        placas: '',
        descripcion: '',
        modelo: '',
        color: ''
    });

    useEffect(() => {
        fetchVehicleData();
    }, []);

    const fetchVehicleData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/conductores/${userId}/vehiculo`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error al obtener datos del vehículo');
            const data = await response.json();
            setVehicleData(data);
        } catch (error) {
            onError("Error al cargar datos del vehículo");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/conductores/${userId}/vehiculo`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicleData)
            });
            if (!response.ok) throw new Error('Error al actualizar vehículo');
            onSuccess("Datos del vehículo actualizados exitosamente");
            onClose();
        } catch (error) {
            onError("Error al actualizar datos del vehículo");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
                <h3 className="text-2xl font-bold mb-6">Editar Datos del Vehículo</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Placas</label>
                        <input
                            type="text"
                            value={vehicleData.placas}
                            onChange={(e) => setVehicleData({...vehicleData, placas: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <input
                            type="text"
                            value={vehicleData.descripcion}
                            onChange={(e) => setVehicleData({...vehicleData, descripcion: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Modelo</label>
                        <input
                            type="text"
                            value={vehicleData.modelo}
                            onChange={(e) => setVehicleData({...vehicleData, modelo: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Color</label>
                        <input
                            type="text"
                            value={vehicleData.color}
                            onChange={(e) => setVehicleData({...vehicleData, color: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVehicleModal;