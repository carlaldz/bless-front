import "./whatsapp-button.css"
import { IonIcon } from 'ionicons/react';

const WhatsappButton = () => {
    return (
        <div className="whatsapp-button">
        <a aria-label="Chat de WhatsApp" href="https://wa.me/34622717711"><IonIcon name="logo-whatsapp"></IonIcon> </a>
        </div>
    )
}

export default WhatsappButton;
