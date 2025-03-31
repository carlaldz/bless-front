import { useState, useEffect } from "react";
import BlessApi from "../../services/api-service";
import EventCard from "../../components/event-card/event-card";
import "./event-list.css";
import React from 'react';

function EventList({ limit, page }) {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setLoading(true);
        BlessApi.listEvents({ limit, page })
            .then((response) => {
                console.log("Respuesta de la API:", response);

                const eventosTransformados = response.map(evento => ({
                    ...evento,
                    id: evento.id || evento._id
                }));

                setEventos(eventosTransformados); 
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener eventos:", error);
                setLoading(false);
            });
    }, [limit, page, reload]);

    if (loading) return <p>Cargando eventos...</p>;

    const handleEventDeletion = (id) => {
        BlessApi.deleteEvent(id)
            .then(() => {
                
                setEventos((prevEventos) => prevEventos.filter(evento => evento.id !== id));
                setReload(prev => !prev); 
            })
            .catch((error) => console.error("Error al eliminar el evento:", error));
    };

    return (
        <div className="event-list">
            {eventos.map((evento, index) => (
                <React.Fragment key={evento.id}>
                    <EventCard evento={evento} onDelete={handleEventDeletion} />
                    {index < eventos.length - 1 && <hr className="event-divider" />}
                </React.Fragment>
            ))}
        </div>
    );
}

export default EventList;