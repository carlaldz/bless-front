import { useState, useEffect } from "react";
import BlessApi from "../../services/api-service";
import EventCard from "../../components/event-card/event-card";
import "./event-list.css";
import React from 'react';

function EventList() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Llamada simplificada sin parámetros de paginación
                const eventos = await BlessApi.listEvents();
                
                if (!Array.isArray(eventos)) {
                    throw new Error('Formato de respuesta inválido');
                }

                const eventosTransformados = eventos.map(evento => ({
                    ...evento,
                    id: evento.id || evento._id?.toString()
                }));

                setEventos(eventosTransformados);
            } catch (error) {
                console.error("Error al obtener eventos:", error);
                setError(error.message || "Error cargando eventos");
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []); // Eliminadas dependencias de paginación

    const handleEventDeletion = async (id) => {
        try {
            await BlessApi.deleteEvent(id);
            // Actualización optimista del estado
            setEventos(prev => prev.filter(evento => evento.id !== id));
        } catch (error) {
            console.error("Error al eliminar evento:", error);
            setError("No se pudo eliminar el evento");
        }
    };

    if (loading) return <div className="loading-container">Cargando eventos...</div>;
    
    if (error) return (
        <div className="error-container">
            <p>❌ Error: {error}</p>
            <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
    );

    if (eventos.length === 0) return <p>No hay eventos disponibles</p>;

    return (
        <div className="event-list">
            {eventos.map((evento, index) => (
                <React.Fragment key={evento.id}>
                    <EventCard 
                        evento={evento} 
                        onDelete={handleEventDeletion} 
                    />
                    {index < eventos.length - 1 && <hr className="event-divider" />}
                </React.Fragment>
            ))}
        </div>
    );
}

export default EventList;