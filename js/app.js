// Variables
const mascotaInpu = document.querySelector('#mascota');
const propietarioInpu = document.querySelector('#propietario');
const telefonoInpu = document.querySelector('#telefono');
const fechaInpu = document.querySelector('#fecha');
const horaInpu = document.querySelector('#hora');
const sintomasInpu = document.querySelector('#sintomas');

// Ui
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Cita {
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas,cita]
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id )
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita )
    }

}

class UI {
    imprimirAlerta(mensaje,tipo){
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.agregar-cita'));

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 5000);
    }

    imprimirCitas({citas}){
        this.limpiarHTML();

        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita','p-3')
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita 
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title','font-weight-bolder');
            mascotaParrafo.textContent = mascota 

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${sintomas}`;

            // Agregar un botón de eliminar...
            const btnEliminar = document.createElement('button');
            btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
  
             // Añade un botón de editar...
             const btnEditar = document.createElement('button');
             btnEditar.onclick = () => cargarEdicion(cita);
             btnEditar.classList.add('btn', 'btn-info');
             btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
 
        
            //Agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //Agregar las citas al html
            contenedorCitas.appendChild(divCita);
        } );
    }

     limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const ui = new UI();
const administrarCitas = new Cita();
// Eventos 
eventListeners()
function eventListeners(){
    mascotaInpu.addEventListener('input', datosCitas);
    propietarioInpu.addEventListener('input', datosCitas);
    telefonoInpu.addEventListener('input', datosCitas);
    fechaInpu.addEventListener('input', datosCitas);
    horaInpu.addEventListener('input', datosCitas);
    sintomasInpu.addEventListener('input', datosCitas);

    formulario.addEventListener('submit', nuevaCita);
}

// obejto con la informacion de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha:'',
    hora: '',
    sintomas: ''
}

// Agrega datos al objeto de cita
function datosCitas(e) {
    citaObj[e.target.name] = e.target.value

    // console.log(citaObj);
}

// Valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();

    const { mascota, propietario, telefono, fecha, hora, sintomas} = citaObj

    if (mascota === '' || propietario === '' || telefono ==='' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorio', 'error');

        return;
    }

    if (editando) {
        ui.imprimirAlerta('Editado correctamente');

        // Pasar el objeto de la cita a edicion
        administrarCitas.editarCita({...citaObj});

        // Regresar el texto del boton a su estado original 
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        //Quitar el modo editar
        editando = false;
    } else {
        // creando una nueva cita 
        citaObj.id = Date.now();

        // Creando una nueva cita.
        administrarCitas.agregarCita({...citaObj});

         // Mensaje de agregado correctamente
         ui.imprimirAlerta('Se agrego correctamente')
    }

    // Reinciar el objecto para la validacion
    reinciarObjeto()

    // Reincia el formulario
    formulario.reset();

    // Mostra el html de la citas.
    ui.imprimirCitas(administrarCitas)
}

function reinciarObjeto() {
    citaObj.mascota = ''
    citaObj.propietario = ''
    citaObj.telefono = ''
    citaObj.fecha = ''
    citaObj.hora = ''
    citaObj.sintomas = ''
}

function eliminarCita(id) {
    // Eliminar la cita
    administrarCitas.eliminarCita(id);

    // Muestre un mensaje
    ui.imprimirAlerta('La Cita se elimino correctamente');

    // refrescar las citas
    ui.imprimirCitas(administrarCitas)
}

// Carga los datos y el modo edicion
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita


    // Llenar los Inputs
    mascotaInpu.value = mascota
    propietarioInpu.value = propietario;
    telefonoInpu.value = telefono;
    fechaInpu.value = fecha;
    horaInpu.value = hora;
    sintomasInpu.value = sintomas;

    // Llnar los objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    cita.id = id;
    
    // cambiar el texto del boton 
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
   
}
