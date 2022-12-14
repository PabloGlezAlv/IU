"use strict"

import * as Cm from './cmapi.js'
import * as U from './util.js'

/**
 * Para las prácticas de IU, pon aquí (o en otros js externos incluidos desde tus .htmls) el código
 * necesario para añadir comportamientos a tus páginas.
 *
 * Este fichero, `eventos.js`, contiene código para asociar comportamientos a acciones.
 *
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él:
 * lo que quieras siempre y cuando
 * - no digas que eres el autor original
 * - no me eches la culpa si algo no funciona como esperas
 *
 * @Author manuel.freire@fdi.ucm.es
 */

export function bindDetails(clickSelector, detailsSelector, htmlGenerationFn, listenersFn) {
    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const id = e.target.dataset.id || e.target.closest("tr").dataset.id;
        console.log(e, id);
        U.one(detailsSelector).innerHTML = htmlGenerationFn(id);
        listenersFn(id);
    }))
}


export function bindRmFromEdition(clickSelector, callback) {

    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Una vez borrado no podrás recuperar la información del estudiante sobre esta edición!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              const userId = e.target.closest('tr').dataset.userId;
              const editionId = e.target.closest('tr').dataset.editionId;
              console.log(e, userId, editionId);
              const edition = Cm.resolve(editionId);
              edition.students = edition.students.filter(o => o != userId);
              edition.teachers = edition.students.filter(o => o != userId);
              Cm.setEdition(edition);
              e.target.closest("tr").remove();
              callback();

              Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'success',
                title: 'Se ha borrado correctamente',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
              })
            }
          });
    }));

    /*
    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        var opcion = confirm("¿Estás seguro de que quieres borrar al usuario de esta edición?");
        if (opcon == true){
            const userId = e.target.closest('tr').dataset.userId;
            const editionId = e.target.closest('tr').dataset.editionId;
            console.log(e, userId, editionId);
            const edition = Cm.resolve(editionId);
            edition.students = edition.students.filter(o => o != userId);
            edition.teachers = edition.students.filter(o => o != userId);
            Cm.setEdition(edition);
            e.target.closest("tr").remove();
            callback();
        }
    }));
    */
}

export function bindRmEditionDetails(clickSelector, callback) {
    U.one(clickSelector).addEventListener('click', e => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Una vez borrado no podrás recuperar la información sobre esta edición!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                const id = e.target.dataset.id;
                console.log(e, id);
                Cm.rmEdition(id);
                callback();
            
                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'success',
                    title: 'Se ha borrado la información del usuario correctamente',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                  })}
          });
    });
}

export function bindAddEditionToCourse(clickSelector, callback) {
    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const id = e.target.closest("tr").dataset.id;
        const year = e.target.dataset.year;
        console.log(e, id, year);
        Cm.addEdition(Cm.resolve(id), year);
        callback();
    }));
}

export function bindRmCourseRow(clickSelector) {
    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Una vez borrado no podrás recuperar la información sobre este curso!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                const row = e.target.closest("tr");
                const id = row.dataset.id;
                console.log(e, id);
                Cm.rmCourse(id);
                row.remove();

                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'success',
                    title: 'Se ha borrado el curso correctamente',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                  })
            }
          });
    }));
}

export function bindRmUserRow(clickSelector) { 
    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez borrado el usuario no se podrá recuperar la información!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
           // swal("El estudiante ha sido borrado con éxito!", {
           // icon: "success",
          //});
          const row = e.target.closest("tr");
          const id = row.dataset.id;
          console.log(e, id);
          Cm.rmUser(id);
          row.remove();

          Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            title: 'Se ha borrado el usuario correctamente',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          })
          
        } 
        /*else {
          swal("El estudiante no se ha borrado!");
        }*/
      });
    }));
}

export function bindAddUserToEdition(clickSelector, formTitleSelector, formSelector, formAcceptSelector,
    modalFn, formTitleFn, formContentsFn, callback) {

    U.one(clickSelector).addEventListener('click', e => {
        const id = e.target.dataset.id;
        console.log(e, id);
        const edition = Cm.resolve(id);

        modalFn().show();
        const form = U.one(formSelector);
        U.one(formTitleSelector).innerHTML = formTitleFn(edition);
        form.innerHTML = formContentsFn(edition);
        const acceptButton = U.one(formAcceptSelector);
        const acceptListener = ae => {
            const dniInput = form.querySelector("select[name=dni]");
            console.log(dniInput, dniInput.value);
            const dni = dniInput.value;
            const candidates = Cm.getUsers({ dni });
            if (candidates.length == 1) {
                candidates[0].role == Cm.UserRole.STUDENT ?
                    edition.students.push(candidates[0].id) :
                    edition.teachers.push(candidates[0].id);
                Cm.setEdition(edition);
                modalFn().hide();
                acceptButton.removeEventListener('click', acceptListener);
                callback();
            } else {
                // show errors by clicking hidden submit button only if there *are* errors
                dniInput.setCustomValidity("No hay nadie con ese DNI");
                form.querySelector("button[type=submit]").click()
            }
        }
        acceptButton.addEventListener('click', acceptListener);
    });
};

export function bindAddOrEditUser(clickSelector, formTitleSelector, formSelector, formAcceptSelector,
    modalFn, formTitleFn, formContentsFn, callback) {

    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const id = e.target.closest("tr") ?
            e.target.closest("tr").dataset.id :
            undefined;
        const user = id ? Cm.resolve(id) : undefined;

        console.log(e, user);
        modalFn().show();
        const form = U.one(formSelector);
        U.one(formTitleSelector).innerHTML = formTitleFn(user);
        form.innerHTML = formContentsFn(user);
        const acceptButton = U.one(formAcceptSelector);
        const acceptListener = ae => {
            const dniInput = form.querySelector("input[name=dni]");

            dniInput.setCustomValidity((U.isValidDni(dniInput.value)) ?
                "" : "DNI inválido");

            //dniInput.setCustomValidity(dniNotRepeted(Cm.getUsers({ dni }), dniInput) ?
            //    "" : "DNI inválido");

            console.log(dniInput, dniInput.value, U.generateDni(dniInput.value.substring(0, 8)));
            if (form.checkValidity()) {
                const u = new Cm.User(id || -1,
                    form.querySelector("input[name=dni]").value,
                    form.querySelector("input[name=name]").value,
                    form.querySelector("input[name=email]").value,
                    form.querySelector("input[name=role]:checked").value, // sin ':checked' falla
                )
                if (id) { Cm.setUser(u); } else { Cm.addUser(u); }
                modalFn().hide();
                acceptButton.removeEventListener('click', acceptListener);
                callback();
            } else {
                // show errors by clicking hidden submit button only if there *are* errors
                form.querySelector("button[type=submit]").click()
            }
        };
        acceptButton.addEventListener('click', acceptListener);
    }));
};

export function bindAddOrEditCourse(clickSelector, formTitleSelector, formSelector, formAcceptSelector,
    modalFn, formTitleFn, formContentsFn, callback) {

    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const id = e.target.closest("tr") ?
            e.target.closest("tr").dataset.id :
            undefined;
        const course = id ? Cm.resolve(id) : undefined;

        console.log(e, course);
        modalFn().show();
        const form = U.one(formSelector);
        U.one(formTitleSelector).innerHTML = formTitleFn(course);
        form.innerHTML = formContentsFn(course);
        const acceptButton = U.one(formAcceptSelector);
        const acceptListener = ae => {
            if (form.checkValidity()) {
                const c = new Cm.Course(id || -1,
                    form.querySelector("input[name=name]").value,
                    form.querySelector("select[name=area]").value,
                    form.querySelector("select[name=level]").value
                )
                if (id) { Cm.setCourse(c); } else { Cm.addCourse(c); }
                modalFn().hide();
                acceptButton.removeEventListener('click', acceptListener);
                callback();
            } else {
                // show errors by clicking hidden submit button only if there *are* errors
                form.querySelector("button[type=submit]").click()
            }
        };
        acceptButton.addEventListener('click', acceptListener);
    }));
};

export function bindSearch(inputSelector, rowSelector) {
    const input = U.one(inputSelector);
    if (input == null) {
        return;
    }
    input.addEventListener("input", e => {
        const v = e.target.value.toLowerCase();
        if (!v) {
            U.all(rowSelector).forEach(row => row.style.display = '');
        } else {
            U.all(rowSelector).forEach(row => {
                const o = row.innerText.toLowerCase();
                row.style.display = o.indexOf(v) != -1 ? '' : 'none';
            });
        }
    })
}

function stopEditingPreviousResults(callback) {
    const gradeInput = U.one("#grade-input");
    const ratingInput = U.one("#rating-select");
    if (gradeInput && ratingInput) {
        gradeInput.parentElement.innerText = gradeInput.value || '?';
        ratingInput.parentElement.innerText = ratingInput.value || '?';
        callback();
    }
}

/**
 * Añade manejo de columna de selección a una tabla.
 * 
 * La tabla debe tener un checkbox de cabecera, y otro por fila, con el siguiente formato:
 *         <th><input type="checkbox" name="toggle"/></td>
 * 
 *         <td><input type="checkbox" value="${user.id}" name="users"/></td>
 *
 * Cada vez que se cambie un checkbox, se enviará un evento de tipo evtName, capturable via
 *       table.addEventListener(evtName, e => console.log(e.detail))
 * También se podrá consultar la lista de seleccionados en table.dataset.selected
 * 
 * @param {*} selTabla 
 * @param {*} evtName 
 */
 export function bindCheckboxColumn(selTabla, evtName) {
    const table = U.one(selTabla);
    const toggle = table.querySelector("input[name=toggle]");
    const rows = table.querySelectorAll('tr:nth-child(n+2)');

    const visibleAndSelected = () => {
        const visibleRows = [...rows].filter(r => r.style.display != 'none');
        const checkedRows = visibleRows
            .map(o => o.querySelector('input[type=checkbox]'))
            .filter(r => r.checked);
        table.dataset.selected = checkedRows.map(o => o.value);
        if (evtName) table.dispatchEvent(new CustomEvent(evtName, { detail: table.dataset.selected }));
        // lanza un evento que se puede capturar a partir de la tabla, escuchando por evtName
        // ver https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events        
        return [visibleRows, checkedRows];
    }

    const updateToggleState = () => {
        const [visibleRows, checkedRows] = visibleAndSelected()
            // ver https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
        if (checkedRows.length == 0) {
            toggle.checked = false;
            toggle.indeterminate = false;
        } else if (checkedRows.length == visibleRows.length) {
            toggle.checked = true;
            toggle.indeterminate = true;
        } else {
            toggle.checked = false;
            toggle.indeterminate = true;
        }
    }

    toggle.addEventListener('click', (e) => {
        rows.forEach(row => {
            if (row.style.display != 'none') {
                row.querySelector('input[type=checkbox]').checked = toggle.checked;
            }
        })
        visibleAndSelected()
    });

    rows.forEach(o => o
        .querySelector('input[type=checkbox]')
        .addEventListener('change', o => {
            updateToggleState()
        }))


    // EJEMPLO DE CAPTURA DE EVENTO DE CAMBIO DE SELECCION - usalo en tu código
    if (evtName) table.addEventListener(evtName, e => console.log(e.detail));
}

export function bindSetResults(clickSelector, option, callback) {
    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const row = e.target.closest("tr");

        if (option == 1){
            const ratingCell = row.querySelector(".ed-rating");
            let ratingValue = ratingCell.innerText;
            ratingCell.innerHTML = `
            <select class="form-select" id='rating-select'>
                <option value="1" ${ratingValue == 1 ? "selected" : ""}>⭐</option>
                <option value="2" ${ratingValue == 2 ? "selected" : ""}>⭐⭐</option>
                <option value="3" ${ratingValue == 3 ? "selected" : ""}>⭐⭐⭐</option>
                <option value="4" ${ratingValue == 4 ? "selected" : ""}>⭐⭐⭐⭐</option>
                <option value="5" ${ratingValue == 5 ? "selected" : ""}>⭐⭐⭐⭐⭐</option>
            </select>
            `;

            // handle lost focus
            row.querySelectorAll("select,input").forEach(e => e.addEventListener("blur",
                () => stopEditingPreviousResults(callback)));

            // handle a change
            row.querySelectorAll("select,input").forEach(e => e.addEventListener("input", ae => {
                const rating = U.one("#rating-select").value || null;
                const result = new Cm.Result(-1,
                    row.dataset.editionId,
                    row.dataset.studentId,
                    row.dataset.grade,
                    rating
                )
                Cm.setResult(result);
            }));
        }else if (option == 2){
            const gradeCell = row.querySelector(".ed-grade");
            let gradeValue = gradeCell.innerText;
            gradeCell.innerHTML = `
            <input class="form-input" id='grade-input' 
                size="3" type="number" value="${gradeValue == '?' ? "" : gradeValue}"/>
            `;

            // handle lost focus
            row.querySelectorAll("select,input").forEach(e => e.addEventListener("blur",
                () => stopEditingPreviousResults(callback)));

            // handle a change
            row.querySelectorAll("select,input").forEach(e => e.addEventListener("input", ae => {
                const grade = U.one("#grade-input").value || null;
                const result = new Cm.Result(-1,
                    row.dataset.editionId,
                    row.dataset.studentId,
                    grade,
                    row.dataset.rating
                )
                Cm.setResult(result);
            }));
        }else{
            const ratingCell = row.querySelector(".ed-rating");
            let ratingValue = ratingCell.innerText;
            ratingCell.innerHTML = `
            <select class="form-select" id='rating-select'>
                <option value="1" ${ratingValue == 1 ? "selected" : ""}>⭐</option>
                <option value="2" ${ratingValue == 2 ? "selected" : ""}>⭐⭐</option>
                <option value="3" ${ratingValue == 3 ? "selected" : ""}>⭐⭐⭐</option>
                <option value="4" ${ratingValue == 4 ? "selected" : ""}>⭐⭐⭐⭐</option>
                <option value="5" ${ratingValue == 5 ? "selected" : ""}>⭐⭐⭐⭐⭐</option>
            </select>
            `;

            const gradeCell = row.querySelector(".ed-grade");
            let gradeValue = gradeCell.innerText;
            gradeCell.innerHTML = `
            <input class="form-input" id='grade-input' 
                size="3" type="number" value="${gradeValue == '?' ? "" : gradeValue}"/>
            `;

            // handle lost focus
            row.querySelectorAll("select,input").forEach(e => e.addEventListener("blur",
                () => stopEditingPreviousResults(callback)));

            // handle a change
            row.querySelectorAll("select,input").forEach(e => e.addEventListener("input", ae => {
                const grade = U.one("#grade-input").value || null;
                const rating = U.one("#rating-select").value || null;
                const result = new Cm.Result(-1,
                    row.dataset.editionId,
                    row.dataset.studentId,
                    grade,
                    rating
                )
                Cm.setResult(result);
            }));
        }
    }));
}

export function bindSortColumn(clickSelector) {
    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const th = e.target;
        const table = th.closest('tbody');

        // devuelve el valor en la columna i-esima
        // ver https://stackoverflow.com/a/49041392/15472
        const valueAt = (row, i) => row.children[i].innerText || row.children[i].textContent;

        // devuelve una función de comparación para 2 elementos, sobre col. idx, creciente o no (asc)
        const comparador = (idx, asc) => (a, b) => ((v1, v2) =>
            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ?
            v1 - v2 :
            v1.toString().localeCompare(v2)
        )(valueAt(asc ? a : b, idx), valueAt(asc ? b : a, idx));

        // comprueba y actualiza asc (ascendente)
        let asc = th.dataset.asc || 0;
        th.setAttribute("data-asc", asc == 0 ? 1 : 0)

        // reordena las filas y almacena la ordenación para la siguiente iteración
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparador(Array.from(th.parentNode.children).indexOf(th), asc == 1))
            .forEach(tr => table.appendChild(tr));

    }));
}

export function alternaBusquedaAvanzadaUsuarios(selBoton, selNormal, selAvanzada) {
    const avanzado = document.querySelector(selAvanzada);
    let normal = document.querySelector(selNormal);
    if (! normal) return;
    normal = normal.parentElement;
    document.querySelector(selBoton)
        .addEventListener('click', e => {
            const visible = avanzado.style.display != 'none';
            avanzado.style.display = visible ? 'none' : '';
            normal.style.display = visible ? '' : 'none';
        });
    avanzado.style.display = 'none';
}

export function advancedUserFilter(filterSel, rowSel) {
    const filterDiv = document.querySelector(filterSel);
    const name = filterDiv.querySelector("input[name=name]").value.toLowerCase();
    const dni = filterDiv.querySelector("input[name=dni]").value.toLowerCase();
    const email = filterDiv.querySelector("input[name=email]").value.toLowerCase();
    const role = filterDiv.querySelector("select[name=role]").value.toLowerCase();

    const valueAt = (row, i) => row.children[i].innerText || row.children[i].textContent;

    for (let r of document.querySelectorAll(rowSel)) {
        let ok = true;
        for (let [f, col] of 
            [[name, 0], [role, 1], [email, 2], [dni, 3]]) {
                if (f == '' || ! ok) continue;
                const v = valueAt(r, col).toLowerCase();
                console.log(v, f, col, v.indexOf(f));
                if (v.indexOf(f) == -1) ok = false;
        }
        r.style.display = ok ? '' : 'none';
    }
}

export function userFilter(){
    document.querySelectorAll("#filter-in-users input, #filter-in-users select").forEach(o =>
        o.addEventListener('input', e => {
            console.log("filtrando");
            advancedUserFilter("#filter-in-users", ".user-table-row");
        }));
}

function advancedCourseFilter(filterSel, rowSel) {
    const filterDiv = document.querySelector(filterSel);
    const name = filterDiv.querySelector("input[name=name]").value.toLowerCase();
    const edicion = filterDiv.querySelector("input[name=edicion]").value.toLowerCase();
    const area = filterDiv.querySelector("select[name=area]").value.toLowerCase();
    const nivel = filterDiv.querySelector("select[name=nivel]").value.toLowerCase();

    const valueAt = (row, i) => row.children[i].innerText || row.children[i].textContent;

    for (let r of document.querySelectorAll(rowSel)) {
        let ok = true;
        for (let [f, col] of 
            [[name, 0], [edicion, 3], [area, 1], [nivel, 2]]) {
                if (f == '' || ! ok) continue;
                const v = valueAt(r, col).toLowerCase();
                console.log(v, f, col, v.indexOf(f));
                if (v.indexOf(f) == -1) ok = false;
        }
        r.style.display = ok ? '' : 'none';
    }
}


export function courseFilter(){
    document.querySelectorAll("#filter-in-courses input, #filter-in-courses select").forEach(o =>
        o.addEventListener('input', e => {
            console.log("filtrando cursos");
            advancedCourseFilter("#filter-in-courses", ".course-table-row");
        }));
}

function advancedTeacherFromEditionFilter(filterSel, rowSel) {
    const filterDiv = document.querySelector(filterSel);
    const name = filterDiv.querySelector("input[name=Nombre]").value.toLowerCase();
    const email = filterDiv.querySelector("input[name=Correo]").value.toLowerCase();
    const dni = filterDiv.querySelector("input[name=DNI]").value.toLowerCase();
        
    const valueAt = (row, i) => row.children[i].innerText || row.children[i].textContent;
        
    for (let r of document.querySelectorAll(rowSel)) {
        let ok = true;
        for (let [f, col] of 
            [[name, 0], [email, 1], [dni, 2]]) {
                if (f == '' || ! ok) continue;
                const v = valueAt(r, col).toLowerCase();
                console.log(v, f, col, v.indexOf(f));
                if (v.indexOf(f) == -1) ok = false;
        }
        r.style.display = ok ? '' : 'none';
    }
}
        
export function teacherFromEditionFilter(){
    document.querySelectorAll("#filter-in-oneedition2 input, #filter-in-oneedition2 select").forEach(o =>
    o.addEventListener('input', e => {
        console.log("filtrando one edition2");
        advancedTeacherFromEditionFilter("#filter-in-oneedition2", ".teacher-table-row");
    }));
}

function advancedStudentsFromEditionFilter(filterSel, rowSel) {
    const filterDiv = document.querySelector(filterSel);
    const name = filterDiv.querySelector("input[name=Nombre]").value.toLowerCase();
    const email = filterDiv.querySelector("input[name=Correo]").value.toLowerCase();
    const dni = filterDiv.querySelector("input[name=DNI]").value.toLowerCase();
    const note = filterDiv.querySelector("input[name=Nota]").value.toLowerCase();
        
    const valueAt = (row, i) => row.children[i].innerText || row.children[i].textContent;
        
    for (let r of document.querySelectorAll(rowSel)) {
        let ok = true;
        for (let [f, col] of 
            [[name, 0], [email, 1], [dni, 2], [note, 3]]) {
                if (f == '' || ! ok) continue;
                const v = valueAt(r, col).toLowerCase();
                console.log(v, f, col, v.indexOf(f));
                if (v.indexOf(f) == -1) ok = false;
        }
        r.style.display = ok ? '' : 'none';
    }
}
        
export function studentsFromEditionFilter(){
    document.querySelectorAll("#filter-in-oneedition input, #filter-in-oneedition select").forEach(o =>
    o.addEventListener('input', e => {
        console.log("filtrando one edition");
        advancedStudentsFromEditionFilter("#filter-in-oneedition", ".student-table-row");
    }));
}

function advancedEditionsFromStudentsFilter(filterSel, rowSel) {
    const filterDiv = document.querySelector(filterSel);
    const edicion = filterDiv.querySelector("input[name=edicion]").value.toLowerCase();
    const global = filterDiv.querySelector("input[name=global]").value.toLowerCase();
    const propia = filterDiv.querySelector("input[name=propia]").value.toLowerCase();
    const nota = filterDiv.querySelector("input[name=nota]").value.toLowerCase();

    const valueAt = (row, i) => row.children[i].innerText || row.children[i].textContent;

    for (let r of document.querySelectorAll(rowSel)) {
        let ok = true;
        for (let [f, col] of 
            [[edicion, 0], [global, 1], [propia, 2], [nota, 3]]) {
                if (f == '' || ! ok) continue;
                const v = valueAt(r, col).toLowerCase();
                console.log(v, f, col, v.indexOf(f));
                if (v.indexOf(f) == -1) ok = false;
        }
        r.style.display = ok ? '' : 'none';
    }
}

export function editionsFromStudentsFilter(){
    document.querySelectorAll("#filter-in-oneuser input, #filter-in-oneuser select").forEach(o =>
    o.addEventListener('input', e => {
        console.log("filtrando one user");
        advancedEditionsFromStudentsFilter("#filter-in-oneuser", ".user-edition-table-row");
    }));
}

function alerta()
    {
    var mensaje;
    var opcion = confirm("Clicka en Aceptar o Cancelar");
    if (opcion == true) {
        mensaje = "Has clickado OK";
	} else {
	    mensaje = "Has clickado Cancelar";
	}
	document.getElementById("ejemplo").innerHTML = mensaje;
}

/*Función antigua, pero la de abajo debería funcionar del todo
export function rmCheckbox(sel){
    const boton = document.querySelector(sel);

    boton.addEventListener('click', e=> {
    const seleccionadas = document.querySelector("#users").dataset.selected.split(",");
    console.log(seleccionadas);
    seleccionadas.forEach(s => {
        Cm.rmUser(+s);
        
    });
    })
}
*/

export function rmCheckboxPrueba(sel, callback){
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez borrado no podrás recuperar la información del estudiante sobre esta edición!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            const seleccionadas = document.querySelector(sel).dataset.selected.split(",");
            console.log(seleccionadas);
            seleccionadas.forEach(s => {
                Cm.rmUser(+s);
                
            });
            callback();

            Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'success',
                title: 'Se ha borrado correctamente',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            })
        }
    });
}

export function matCheckbox(sel, callback){
    const seleccionadas = document.querySelector(sel).dataset.selected.split(",");
    console.log(seleccionadas);
    seleccionadas.forEach(s => {
        //matricular a s en la edición
        
    });
    callback();
}

function dniNotRepeted(listaDni, dniNuevo){
    var noRepetido = new Boolean(true);
    for (let r in listaDni){
        if (r == dniNuevo){
            repetido = false;
        }
    }
    
    if (noRepetido == true){
        return generateDni(dni.substring(0, 8)) == dniNuevo;
    }
    else{
        return false;
    }
}