const res = require("express/lib/response");
const PoolSingleton = require("./Pooldb");
const pool = PoolSingleton.getInstance();


const nuevoSkater = async (datos) => {
    const query = {
        text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) values($1, $2, $3, $4, $5, $6, $7)",
        values: datos
    };
    try {
        const result = await pool.query(query);
        return result
    } catch (error) {
        throw error;
    }
};

const participantes = async () => {
    try {
        const id = await pool.query("SELECT (id) FROM skaters");
        const foto = await pool.query("SELECT (foto) FROM skaters");
        const nombre = await pool.query("SELECT (nombre) FROM skaters");
        const anios = await pool.query("SELECT (anos_experiencia) FROM skaters");
        const especialidad = await pool.query("SELECT (especialidad) FROM skaters");
        const estado = await pool.query("SELECT (estado) FROM skaters");

        let respuestaOrdenada = [];

        for (let index = 0; index < id.rows.length; index++) {
            let objetoRespuesta = {};
            objetoRespuesta.id = id.rows[index].id;
            objetoRespuesta.foto = foto.rows[index].foto;
            objetoRespuesta.nombre = nombre.rows[index].nombre;
            objetoRespuesta.anios_experiencia = anios.rows[index].anos_experiencia;
            objetoRespuesta.especialidad = especialidad.rows[index].especialidad;
            objetoRespuesta.estado = estado.rows[index].estado;
            respuestaOrdenada.push(objetoRespuesta);
        };

        return respuestaOrdenada;

    } catch (error) {
        throw error;
    };
};

const getImg = async (id) => {
    const query = {
        text: "SELECT (foto) FROM skaters WHERE id = $1",
        values: [id]
    };
    const foto = await pool.query(query);
    return foto.rows
};

const validarUsuario = async (email, pass) => {
    const passQuery = {
        text: "SELECT (password) FROM skaters WHERE email = $1",
        values: [email]
    };
    let passDB;
    try {
        passDB = await pool.query(passQuery);
    } catch (error) {
        console.log(error);
        return "invalidUser";
    };

    if (passDB.rows[0].password == pass) { return true }

    else { return false }

};

const actualizarEstado = async (id, estado) => {

    if (estado == 'Aprobade') {
        const aprobadeQuery = {
            text: `UPDATE skaters SET
                   estado = 'f'
                   WHERE id = $1 RETURNING *`,
            values: [id]
        };

        try {
            const result = await pool.query(aprobadeQuery);
            return result;
        } catch (error) {
            throw error;
        }

    }
    if (estado == 'Pendiente') {
        const pendienteQuery = {
            text: `UPDATE skaters SET
                   estado = 't'
                   WHERE id = $1 RETURNING *`,
            values: [id]
        };

        try {
            const result = await pool.query(pendienteQuery);
            return result;
        } catch (error) {
            throw error;
        }
    }
    else { console.log("error") };

};

const getUsuarioEspecifico = async (email, password) => {

    const userQuery = {
        text: "SELECT * FROM skaters WHERE email = $1 AND password =$2",
        values: [email, password]
    };

    try {
        const user = await pool.query(userQuery);
        return user.rows

    } catch (error) {
        throw error
    };

};

const actualizarDatos = async (bundle) => {
    const actualizarQuery = {
        text: `UPDATE skaters SET
               nombre = $2,
               password = $3,
               anos_experiencia = $4,
               especialidad = $5
               WHERE id = $1 RETURNING *`,
        values: [bundle.id, bundle.nombre, bundle.password, bundle.anios_experiencia, bundle.especialidad]
    };

    try {
        const result = await pool.query(actualizarQuery);
        return result;
    } catch (error) {
        throw error;
    }
};

const eliminarParticipante = async (id) => {
    console.log(id)
    const eliminar = {
        text: `                
                DELETE FROM skaters
                WHERE id = $1
                `,
        values: [id]
    };

    try {
        const result = await pool.query(eliminar);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    nuevoSkater,
    participantes,
    actualizarDatos,
    actualizarEstado,
    validarUsuario,
    getUsuarioEspecifico,
    eliminarParticipante,
    getImg
}