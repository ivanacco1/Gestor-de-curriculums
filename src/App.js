import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function Currículo({ currículo, index, onCurrículoSeleccionado, onEliminarCurrículo }) {
  const handleCurrículoClick = () => {
    onCurrículoSeleccionado(index);
  };

  const handleEliminarClick = (event) => {
    event.stopPropagation(); 
    onEliminarCurrículo(index);
  };

  return (
    <div className="currículo" onClick={handleCurrículoClick}>
      <h2>{currículo.nombre}</h2>
      <p>{currículo.correo}</p>
      {currículo.selected && (
        <div className="detalles-currículo">
          <h3>Detalles del Currículo</h3>
          <p><strong>Nombre:</strong> {currículo.nombre}</p>
          <p><strong>Correo:</strong> {currículo.correo}</p>
          <p><strong>Teléfono:</strong> {currículo.telefono}</p>
          <p><strong>Educación:</strong> {currículo.educacion.titulo}, {currículo.educacion.institucion}, {currículo.educacion.añoGraduacion}</p>
          <p><strong>Experiencia Laboral:</strong></p>
          <ul>
            {currículo.experienciaLaboral.map((exp, index) => (
              <li key={index}>
                <strong>{exp.cargo}</strong> en {exp.empleador} ({exp.fechaInicio} - {exp.fechaFin})
                <p>{exp.responsabilidades}</p>
              </li>
            ))}
          </ul>
          <img src={currículo.foto} alt="Foto" />
          <button onClick={handleEliminarClick}>Eliminar Currículo</button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [currículos, setCurrículos] = useState(() => {
    const storedCurrículos = localStorage.getItem('currículos');
    return storedCurrículos ? JSON.parse(storedCurrículos) : [];
  });
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [educacion, setEducacion] = useState({ titulo: '', institucion: '', añoGraduacion: '' });
  const [cargo, setCargo] = useState('');
  const [empleador, setEmpleador] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [responsabilidades, setResponsabilidades] = useState('');
  const [foto, setFoto] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef();

  useEffect(() => {
    localStorage.setItem('currículos', JSON.stringify(currículos));
  }, [currículos]);

  const resetForm = () => {
    setNombre('');
    setApellido('');
    setCorreo('');
    setTelefono('');
    setEducacion({ titulo: '', institucion: '', añoGraduacion: '' });
   
    setCargo('');
    setEmpleador('');
    setFechaInicio('');
    setFechaFin('');
    setResponsabilidades('');
    setFoto('');
    setError('');
  };

  const handleAgregarCurrículo = () => {
    if (
      !nombre ||
      !apellido ||
      !correo ||
      !foto ||
      !educacion.titulo ||
      !educacion.institucion ||
      !educacion.añoGraduacion ||
      !empleador ||
      !cargo ||
      !fechaInicio ||
      !fechaFin ||
      !responsabilidades
    ) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    const nuevaExperienciaLaboral = {
      empleador,
      cargo,
      fechaInicio,
      fechaFin,
      responsabilidades,
    };

    const reader = new FileReader();
    reader.onloadend = function() {
      const base64String = reader.result;

      const nuevoCurrículo = {
        nombre: `${nombre} ${apellido}`,
        correo,
        telefono,
        educacion,
        experienciaLaboral: [nuevaExperienciaLaboral],
        foto: base64String,
        selected: false,
      };

      setCurrículos([...currículos, nuevoCurrículo]);
      resetForm();

      if (formRef.current) {
        formRef.current.reset();
      }
    };
    reader.readAsDataURL(foto);
  };

  const handleEliminarCurrículo = (index) => {
    const newCurrículos = currículos.filter((_, i) => i !== index);
    setCurrículos(newCurrículos);
  };

  const handleCurrículoSeleccionado = (index) => {
    setCurrículos(currículos.map((currículo, i) => ({
      ...currículo,
      selected: i === index ? !currículo.selected : false
    })));
  };

  return (
    <div className="App">
    <div class="topbar">
  <h1>Gestión de Currículos</h1>
</div>
      
      <form ref={formRef} className="formulario">
        <h2>Información Personal</h2>
        <div className="campo">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        <div className="campo">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Número de teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <h2>Educación</h2>
        <div className="campo">
          <input
            type="text"
            placeholder="Título obtenido"
            value={educacion.titulo}
            onChange={(e) => setEducacion({ ...educacion, titulo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Institución educativa"
            value={educacion.institucion}
            onChange={(e) => setEducacion({ ...educacion, institucion: e.target.value })}
          />
          <input
            type="text"
            placeholder="Año de graduación"
            value={educacion.añoGraduacion}
            onChange={(e) => setEducacion({ ...educacion, añoGraduacion: e.target.value })}
          />
        </div>
        <h2>Experiencia Laboral</h2>
        <div className="campo">
          <input
            type="text"
            placeholder="Empleador"
            value={empleador}
            onChange={(e) => setEmpleador(e.target.value)}
          />
          <input
            type="text"
            placeholder="Cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
          <div className="fechas">
            <input
              type="text"
              placeholder="Fecha de inicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <input
              type="text"
              placeholder="Fecha de fin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <textarea
            placeholder="Responsabilidades"
            value={responsabilidades}
            onChange={(e) => setResponsabilidades(e.target.value)}
          />
        </div>
        <div className="form-section">
 
  <div className="Boton-carga">
    <label htmlFor="foto">Agregar fotografía</label>
    <input type="file" id="foto" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />
  </div>
</div>
        {error && <p className="error">{error}</p>}
        <button type="button" onClick={handleAgregarCurrículo}>Agregar Currículo</button>
      </form>
      <div className="lista-currículos">
        {currículos.map((currículo, index) => (
          <Currículo
            key={index} 
            currículo={currículo}
            index={index}
            onCurrículoSeleccionado={handleCurrículoSeleccionado}
            onEliminarCurrículo={handleEliminarCurrículo}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
