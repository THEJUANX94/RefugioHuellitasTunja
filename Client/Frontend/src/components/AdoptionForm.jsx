import React from "react";
import "./css/adoption_form.css";

const AdoptionForm = ({ onClose }) => {
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

                <form>
                    <h3>Datos Generales</h3>
                    <div className="form-group">
                        <label>Ingrese un correo donde te podamos contactar</label>
                        <input type="email" placeholder="Correo" required />
                    </div>
                    <div className="form-group">
                        <label>Número para contacto</label>
                        <input type="tel" placeholder="Teléfono" required />
                    </div>
                    <div className="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" placeholder="Nombres y Apellidos" required />
                    </div>

                    <h3>Información sobre tu estilo de vida</h3>
                    <div className="form-group">
                        <label>¿Quién más vive en el hogar?</label>
                        <div className="checkbox-group">
                            <label><input type="checkbox" /> Niños</label>
                            <label><input type="checkbox" /> Adultos</label>
                            <label><input type="checkbox" /> Adultos mayores</label>
                            <label><input type="checkbox" /> Vivo solo</label>
                            <label><input type="checkbox" /> Otra mascota</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>¿Quién será el responsable principal del cuidado de la mascota?</label>
                        <input type="text" placeholder="Nombre del responsable" required />
                    </div>
                    <div className="form-group">
                        <label>¿Cuánto tiempo pasa en casa el futuro responsable durante el día?</label>
                        <input type="text" placeholder="Horas diarias" required />
                    </div>
                    <div className="form-group">
                        <label>¿Por qué deseas adoptar una mascota? (Máximo 500 caracteres)</label>
                        <textarea maxLength="500" placeholder="Comentario" required />
                    </div>

                    <div className="form-group">
                        <label>¿Tienes un patio o jardín cercado?</label>
                        <div className="radio-group">
                            <label><input type="radio" name="patio" /> Sí</label>
                            <label><input type="radio" name="patio" /> No</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>¿Estás dispuesto a proporcionar a la mascota una dieta adecuada, juguetes y un ambiente seguro?</label>
                        <div className="radio-group">
                            <label><input type="radio" name="responsabilidad" /> Sí</label>
                            <label><input type="radio" name="responsabilidad" /> No</label>
                            <label><input type="radio" name="responsabilidad" /> Tal vez</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>¿Hay alguien en tu familia alérgico a los animales?</label>
                        <div className="radio-group">
                            <label><input type="radio" name="alergia" /> Sí</label>
                            <label><input type="radio" name="alergia" /> No</label>
                            <label><input type="radio" name="alergia" /> Tal vez</label>
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
