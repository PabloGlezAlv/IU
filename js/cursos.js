"use strict"

import * as Cm from './cmapi.js'
import * as V from './vistas.js'
import * as E from './eventos.js'
import * as U from './util.js'

/**
 * Para las prácticas de IU, pon aquí (o en otros js externos incluidos desde tus .htmls) el código
 * necesario para añadir comportamientos a tus páginas.
 * 
 * Este fichero actúa como el pegamento que junta todo. En particular
 * - conecta con el backend (o bueno, al menos lo simular), a través de cmapi.js
 * - genera vistas (usando vistas.js)
 * - asocia comportamientos a las vistas (con ayuda de eventos.js)
 * 
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él:
 * lo que quieras siempre y cuando
 * - no digas que eres el autor original
 * - no me eches la culpa si algo no funciona como esperas
 *
 * @Author manuel.freire@fdi.ucm.es
 */

// Algunos emoticonos que puede resultar útiles: 🔍 ✏️ 🗑️ ➕ 🧑‍🏫 🧑‍🔧 👥 🎓

//
// Función que refresca toda la interfaz. Debería llamarse tras cada operación
//

//0 - admin, 1 - profesor, 2 - alumno
function update_rol(rol) {
    try {
        // vaciamos los contenedores
        U.clean("#users");
        U.clean("#courses");

        // y los volvemos a rellenar con su nuevo contenido
        U.add("#courses", V.createCoursesTable(Cm.getCourses()));
        U.add("#users", V.createUserTable(Cm.getUsers()));

        // y añadimos manejadores para los eventos de los elementos recién creados

        E.bindRmCourseRow("#courses button.rm-fila")
        E.bindRmUserRow("#users button.rm-fila")
        //E.rmCheckbox("#rm-checkbox");
        
        E.bindAddEditionToCourse(".add-edition", () => update_rol(rol))

        E.bindDetails("#courses .edition-link", "#details",
            (id) => V.createDetailsForEdition(Cm.resolve(id)),
            (id) => {
                const edition = Cm.resolve(id);
                E.bindRmEditionDetails(".rm-edition", update_rol);
                E.bindAddUserToEdition(".add-profesor-to-edition",
                    "#cmModal .modal-title", "#cmEditForm", "#cmAcceptModal", () => modalEdit,
                    () => `Añadiendo profesor a <i>${edition.name}</i>`,
                    () => V.prepareAddUserToEditionModal(edition, Cm.UserRole.TEACHER),
                    () => U.one(`#d${id}`).click());
                E.bindAddUserToEdition(".add-alumno-to-edition",
                    "#cmModal .modal-title", "#cmEditForm", "#cmAcceptModal", () => modalEdit,
                    () => `Añadiendo alumno a <i>${edition.name}</i>`,
                    () => V.prepareAddUserToEditionModal(edition, Cm.UserRole.STUDENT),
                    () => U.one(`#d${id}`).click());
                update_rol(rol);
            });
        E.bindDetails("#users .edition-link", '#details',
            (id) => V.createDetailsForUser(Cm.resolve(id)),
            (id) => {
                E.bindSetResults(".set-result", () => U.one(`#d${id}`).click());
                update_rol(rol);
            }
        )
        E.bindRmFromEdition(".rm-from-edition", () => update_rol(rol));

        E.bindAddOrEditUser(".add-user,.set-user",
            "#cmModal .modal-title", "#cmEditForm", "#cmAcceptModal", () => modalEdit,
            (user) => user ? `Editando <i>${user.name}</i>` : "Añadiendo usuario",
            (user) => V.prepareAddOrEditUserModal(user),
            () => update_rol(rol));
        E.bindAddOrEditCourse(".add-course,.set-course",
            "#cmModal .modal-title", "#cmEditForm", "#cmAcceptModal", () => modalEdit,
            (course) => course ? `Editando <i>${course.name}</i>` : "Añadiendo curso",
            (course) => V.prepareAddOrEditCourseModal(course),
            () => update_rol(rol));

        E.bindSearch("#search-in-users-input", ".user-table-row");
        E.bindSearch("#search-in-courses-input", ".course-table-row");
        E.bindSearch("#search-in-teachers-input", ".teacher-table-row");
        E.bindSearch("#search-in-students-input", ".student-table-row");
        E.bindSearch("#search-in-user-editions-input", ".user-edition-table-row");

        E.bindSortColumn("tr>th");

       

        E.alternaBusquedaAvanzadaUsuarios("#search-advanced-toggle-users", "#search-in-users-input", "#filter-in-users")
        E.alternaBusquedaAvanzadaUsuarios("#search-advanced-toggle-users", "#search-in-users-input", "#clean-filters")
        E.userFilter()

        E.alternaBusquedaAvanzadaUsuarios("#search-advanced-toggle-courses", "#search-in-courses-input", "#filter-in-courses")
        E.alternaBusquedaAvanzadaUsuarios("#search-advanced-toggle-courses", "#search-in-courses-input", "#clean-filters-courses")
        E.courseFilter()

        E.alternaBusquedaAvanzadaUsuarios("#search-advanced-toggle-teachers-on-edition", "#search-in-teachers-input", "#filter-in-oneedition2")
        E.alternaBusquedaAvanzadaUsuarios("#search-advanced-toggle-teachers-on-edition", "#search-in-teachers-input", "#clean-filters-oneedition2")
        E.teacherFromEditionFilter()

        E.alternaBusquedaAvanzadaUsuarios("#search-advanced-toggle-students-on-edition", "#search-in-students-input", "#filter-in-oneedition")
        E.alternaBusquedaAvanzadaUsuarios("#search-advanced-toggle-students-on-edition", "#search-in-students-input", "#clean-filters-oneedition")
        E.studentsFromEditionFilter()

        E.alternaBusquedaAvanzadaUsuarios("#search-advanced-toggle-editions", "#search-in-user-editions-input", "#filter-in-oneuser")
        E.alternaBusquedaAvanzadaUsuarios("#search-advanced-toggle-editions", "#search-in-user-editions-input", "#clean-filters-oneuser")
        E.editionsFromStudentsFilter()

        // asociamos botones de prueba para guardar y restaurar estado
        U.one("#save").addEventListener('click', () => Cm.saveState());
        U.one("#clean").addEventListener('click', () => localStorage.clear());
        U.one("#restore").addEventListener('click', () => {
            Cm.restoreState();
            update_rol(rol)
        });

       //U.one("#escapeHatch").addEventListener('click', () => update_rol(rol));

        E.bindCheckboxColumn("#users", "cambioSelUsuarios");

        U.one("#rm-checkbox").addEventListener('click', () => E.rmCheckboxPrueba("#users", () => update_rol(rol)));
        U.one("#mat-checkbox").addEventListener('click', () => E.matCheckbox("#users", () => update_rol(rol)));

        U.one("#adminButton").addEventListener('click', () => update_rol(0))
        U.one("#teacherButton").addEventListener('click', () => update_rol(1))
        U.one("#studentButton").addEventListener('click', () => update_rol(2))

    } catch (e) {
        console.log('Error actualizando', e);
    }
}

//
// Código que se ejecuta al lanzar la aplicación. 
// No pongas código de este tipo en ningún otro sitio
//
const modalEdit = new bootstrap.Modal(document.querySelector('#cmModal'));

Cm.init()
update_rol(0)

// cosas que exponemos para poder usarlas desde la consola
window.update_rol = update_rol;
window.Cm = Cm;
window.V = V;
window.E = E;
window.U = U;