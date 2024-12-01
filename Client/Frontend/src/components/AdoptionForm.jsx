import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Para obtener idpet de la URL
import "./css/adoption_form.css";

const AdoptionForm = ({ onClose }) => {
    const { id } = useParams(); // Obtener idpet de la URL

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        fullName: "",
        household: [],
        caretaker: "",
        caretakerTime: "",
        adoptionReason: "",
        hasYard: "",
        responsibility: "",
        allergy: "",
        login: localStorage.getItem("username"),
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData((prevData) => ({
                ...prevData,
                household: checked
                    ? [...prevData.household, value]
                    : prevData.household.filter((item) => item !== value),
            }));
        } else if (type === "radio") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const getFormattedDateWithTime = () => {
        const now = new Date();
        const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const time = now.toISOString().split("T")[1].split(".")[0]; // HH:mm:ss (sin milisegundos)
        return `${date} ${time}`; // Formato: YYYY-MM-DD HH:mm:ss
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id) {
            alert("No se pudo obtener el id de la mascota. Por favor, inténtalo de nuevo.");
            return;
        }

        try {
            // Paso 1: Crear el formulario y obtener el idform
            const formResponse = await fetch("http://localhost:4000/form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!formResponse.ok) {
                const errorDetails = await formResponse.json();
                throw new Error(errorDetails.message || "Error al guardar el formulario");
            }

            const formResponseData = await formResponse.json();
            const { idform } = formResponseData;

            console.log("Formulario guardado con éxito. ID del formulario:", idform);

            const collectionDate = getFormattedDateWithTime();

            const adoptionResponse = await fetch("http://localhost:4000/adoptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idpet: id,    // ID de la mascota desde la URL
                    idform,      // ID del formulario devuelto
                    state: "W",  // Estado inicial (Waiting)
                    collectionDate: collectionDate,
                }),
            });

            const adoptionData = {
                idpet: id,
                idform,
                state: "W", // Waiting
                collectionDate: new Date().toISOString().split("T")[0],
            };

            console.log("Datos de la adopción enviados:", adoptionData);

            if (!adoptionResponse.ok) {
                const errorDetails = await adoptionResponse.json();
                throw new Error(errorDetails.message || "Error al registrar la adopción");
            }

            const adoptionResponseData = await adoptionResponse.json();
            console.log("Adopción registrada con éxito:", adoptionResponseData);

            alert("Formulario enviado y adopción registrada con éxito.");

            onClose();
        } catch (error) {
            console.error("Error durante el proceso:", error);
            alert(`Hubo un error durante el proceso: ${error.message}`);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Formulario solicitud de adopción mascota</h2>
                <p className="form-description">
                    Estas preguntas serán tomadas en cuenta para la aceptación de su solicitud de adopción.
                    Al enviar este formulario, declaro que la información proporcionada es verdadera y completa.
                    Entiendo que la adopción de una mascota es una gran responsabilidad y me comprometo a
                    proporcionar a mi nueva mascota un hogar amoroso y seguro.
                </p>

                <form onSubmit={handleSubmit}>
                    <h3>Datos Generales</h3>
                    <div className="form-group">
                        <label>Ingrese un correo donde te podamos contactar</label>
                        <input type="email" name="email" placeholder="Correo" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Número para contacto</label>
                        <input type="tel" name="phone" placeholder="Teléfono" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" name="fullName" placeholder="Nombres y Apellidos" required onChange={handleChange} />
                    </div>

                    <h3>Información sobre tu estilo de vida</h3>
                    <div className="form-group">
                        <label>¿Quién más vive en el hogar?</label>
                        <div className="checkbox-group">
                            <label><input type="checkbox" value="Niños" onChange={handleChange} /> Niños</label>
                            <label><input type="checkbox" value="Adultos" onChange={handleChange} /> Adultos</label>
                            <label><input type="checkbox" value="Adultos mayores" onChange={handleChange} /> Adultos mayores</label>
                            <label><input type="checkbox" value="Vivo solo" onChange={handleChange} /> Vivo solo</label>
                            <label><input type="checkbox" value="Otra mascota" onChange={handleChange} /> Otra mascota</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>¿Quién será el responsable principal del cuidado de la mascota?</label>
                        <input type="text" name="caretaker" placeholder="Nombre del responsable" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>¿Cuánto tiempo pasa en casa el futuro responsable durante el día?</label>
                        <input type="text" name="caretakerTime" placeholder="Horas diarias" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>¿Por qué deseas adoptar una mascota? (Máximo 500 caracteres)</label>
                        <textarea name="adoptionReason" maxLength="500" placeholder="Comentario" required onChange={handleChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label>¿Tienes un patio o jardín cercado?</label>
                        <div className="radio-group">
                            <label><input type="radio" name="hasYard" value="Sí" onChange={handleChange} /> Sí</label>
                            <label><input type="radio" name="hasYard" value="No" onChange={handleChange} /> No</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>¿Estás dispuesto a proporcionar a la mascota una dieta adecuada, juguetes y un ambiente seguro?</label>
                        <div className="radio-group">
                            <label><input type="radio" name="responsibility" value="Sí" onChange={handleChange} /> Sí</label>
                            <label><input type="radio" name="responsibility" value="No" onChange={handleChange} /> No</label>
                            <label><input type="radio" name="responsibility" value="Tal vez" onChange={handleChange} /> Tal vez</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>¿Hay alguien en tu familia alérgico a los animales?</label>
                        <div className="radio-group">
                            <label><input type="radio" name="allergy" value="Sí" onChange={handleChange} /> Sí</label>
                            <label><input type="radio" name="allergy" value="No" onChange={handleChange} /> No</label>
                            <label><input type="radio" name="allergy" value="Tal vez" onChange={handleChange} /> Tal vez</label>
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="submit" className="submit-button">Enviar Formulario</button>
                        <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdoptionForm;