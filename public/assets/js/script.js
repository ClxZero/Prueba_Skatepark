const url = "http://localhost:3000/";

let participantes = [];

let newToken = async (email, password) => {

    let loginbody = { email: email, password: password };

    try {
        const response = await axios.post(`${url}login`, loginbody);

        const token = response.data;

        localStorage.setItem('jwt-token', token);

        return token

    } catch (error) {
        console.log(`Error en login: ${error}`);
    };
};

let getData = async () => {
    await axios.get(url + "participantes").then((data) => {
        let tbody = document.getElementById("cuerpo");
        participantes = data.data;
        tbody.innerHTML = "";
        participantes.sort((p1, p2) => (p1[0] > p2[0] ? 1 : -1)).forEach((p, i) => {

            if (p.estado == false) {
                tbody.innerHTML += `
            <tr>
            <th scope="row">${i + 1}</th>
            <td><img src="${p.foto}" class="fotolista"></img></td>
            <td>${p.nombre}</td>
            <td>${p.anios_experiencia}</td>
            <td>${p.especialidad}</td>
            <td class="text-dark font-weight-bold">Pendiente</td>
            </tr>
             `;
            } else {
                tbody.innerHTML += `
            <tr>
            <th scope="row">${i + 1}</th>
            <td><img src="${p.foto}" class="fotolista"></img></td>
            <td>${p.nombre}</td>
            <td>${p.anios_experiencia}</td>
            <td>${p.especialidad}</td>
            <td class="text-success font-weight-bold">Aprobado</td>
            </tr>
             `;
            }

        });
    });
};

let getDataAdmin = async () => {
    await axios.get(url + "participantes").then((data) => {
        let tbody = document.getElementById("cuerpo");
        participantes = data.data;
        tbody.innerHTML = "";
        participantes.sort((p1, p2) => (p1[0] > p2[0] ? 1 : -1)).forEach((p, i) => {
            console.log(p);

            let estadoP;

            if (p.estado) {
                estadoP = 'Aprobade';
                tbody.innerHTML += `
                <tr>
                <th scope="row" id="idParticipante${p.id}">${p.id}</th>
                <td><img src="${p.foto}" class="fotolista"></img></td>
                <td>${p.nombre}</td>
                <td>${p.anios_experiencia}</td>
                <td>${p.especialidad}</td>
                <td><button class="btn btn-success" id="estado${p.id}" onclick="cambioestado(${p.id}, '${estadoP}')">${estadoP}</button></td>
                </tr>
                 `;
            } else {
                estadoP = 'Pendiente';
                tbody.innerHTML += `
                <tr>
                <th scope="row" id="idParticipante${p.id}">${p.id}</th>
                <td><img src="${p.foto}" class="fotolista"></img></td>
                <td>${p.nombre}</td>
                <td>${p.anios_experiencia}</td>
                <td>${p.especialidad}</td>
                <td><button class="btn btn-warning" id="estado${p.id}" onclick="cambioestado(${p.id}, '${estadoP}')">${estadoP}</button></td>
                </tr>
                 `;
            };
        });
    });
};

window.cambioestado = async (id, estado) => {
    let datosCambioEstado = {
        id: id,
        estado: estado
    };
    await axios.put(url + "admin/estado", datosCambioEstado).then(window.location.reload());
};

window.loginR = async () => {

    const email = document.getElementById('form-email').value;
    const password = document.getElementById('form-pass').value;

    await newToken(email, password);

    window.location.replace(`./`);

};

window.modificarUsuario = async () => {

    try {
        const userId = document.getElementById("HiddenID").value;
        const actualizarEmail = document.getElementById("actualizarEmail").value;
        const actualizarNombre = document.getElementById("actualizarNombre").value;
        const actualizarPass = document.getElementById("actualizarPass").value;
        const actualizarAnos = document.getElementById("actualizarAnos").value;
        const actualizarEspecialidad = document.getElementById("actualizarEspecialidad").value;

        let actualizacionBrutal = {
            id: userId,
            nombre: actualizarNombre,
            password: actualizarPass,
            anios_experiencia: actualizarAnos,
            especialidad: actualizarEspecialidad
        };

        console.log(actualizacionBrutal)

        await axios.put(`${url}datos`, actualizacionBrutal);

        await newToken(actualizarEmail, actualizarPass).then(window.location.assign(`http://localhost:3000/`));

    } catch {
        alert("error al actualizar los datos")
    }


};

window.eliminarUsuario = async () => {

    const userId = { id: document.getElementById("HiddenID").value };

    await axios.post(`${url}datos/eliminar`, userId).then(localStorage.clear()).then(window.location.assign(`http://localhost:3000/`));

};


window.cerrarSesion = () => {
    localStorage.clear();
    window.location.replace(`./`);
};

window.onload = async () => {
    const token = localStorage.getItem('jwt-token');

    if (token && window.location.href == 'http://localhost:3000/') {
        window.location.replace(`./token?token=${token}`);
    };

    let mainpage = document.getElementById("mainpage");
    if (mainpage) { await getData(); }

    let adminpage = document.getElementById("adminpage");
    if (adminpage) { await getDataAdmin(); }

    if (window.location.href == 'http://localhost:3000/Datos') {
        window.location.replace(`./Datos?token=${token}`);
    };

};