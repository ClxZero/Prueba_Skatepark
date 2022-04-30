const express = require('express');
const app = express();
const path = require('path');
const { engine } = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { nuevoSkater,
    participantes,
    actualizarDatos,
    actualizarEstado,
    getUsuarioEspecifico,
    validarUsuario,
    eliminarParticipante,
    getImg } = require('./model/SkateParkQuerys');




const PORT = 3000;

const EFU_PROPERTIES = {
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "El peso del archivo que intentas subir supera el límite permitido."
};

const permitFile = ['.png', '.jpg', '.gif'];

let fotoDB;

let secretKey = "paralelepipedo";

//handler

app.engine('hbs',
    engine({
        defaultLayout: '',
        partialsDir: __dirname + "/views/partials/",
        extname: '.hbs'
    })
);

app.set('view engine', 'hbs');

app.set('views', './views/layouts');

//middlew

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(expressFileUpload(EFU_PROPERTIES));

app.use(express.static("public"));




app.get("/", async (req, res) => {
    res.render("index")
});

app.get("/token", async (req, res) => {
    const { token } = req.query;
    let usuario;

    jwt.verify(token, secretKey, (err, data) => {
        usuario = data;
    });

    res.render("indexLogedIn")

    return usuario
});

app.get("/participantes", async (req, res) => {
    const respuesta = await participantes();
    res.status(200).send(respuesta);
});



app.put("/admin/estado", async (req, res, next) => {
    const id = req.body.id;
    const estado = req.body.estado;
    try {
        await actualizarEstado(id, estado);

    } catch (error) {
        throw error
    };

});

app.get("/admin", async (req, res) => {
    res.render("Admin");
});

app.get("/admin/list", async (req, res) => {
    const respuesta = await adminList();
    res.status(200).send(respuesta);
});


app.post("/nuevoParticipante", (req, res, next) => {
    const { foto } = req.files;
    const { name } = foto;
    fotoDB = `./uploads/${name}`;
    const extension = path.extname(foto.name);

    if (!req.files) {
        return res.status(400).send('No se han enviado imágenes');
    };

    if (!permitFile.includes(extension)) {
        return res.status(403).send('Formato inválido')
    };

    foto.mv(`${__dirname}/public/uploads/${name}`, (err) => {

        next();

        if (err) { console.log(err) }
    });

})

app.post("/nuevoParticipante", async (req, res) => {

    const email = req.body.NuevoEmail;
    const nombre = req.body.NuevoNombre;
    const nuevaPass = req.body.NuevaPass;
    const nuevaPassConfirma = req.body.NuevaPassConfirma;
    const nuevosAniosExp = req.body.NuevosAniosExp;
    const nuevaEspecialidad = req.body.NuevaEspecialidad;

    if (!nuevaPass === nuevaPassConfirma) {
        return res.status(403).send('Las contraseñas no coinciden')
    }

    let datosNuevoParticipante = [email, nombre, nuevaPass, nuevosAniosExp, nuevaEspecialidad, fotoDB, "false"];

    await nuevoSkater(datosNuevoParticipante);

    res.status(200).redirect("http://LocalHost:3000/");

});

app.get("/login", (req, res) => {
    res.render("Login");
});

app.post("/login", async (req, res) => {

    const { email } = req.body;
    const { password } = req.body;

    if (await validarUsuario(email, password)) {
        const user = await getUsuarioEspecifico(email, password);

        const token = jwt.sign(user[0], secretKey);

        res.send(token)

    } else {
        console.log("usuario o pass invalido");
    };

});
app.get("/datos", (req, res) => {
    const { token } = req.query;
    if (token) {
        let usuario;

        jwt.verify(token, secretKey, (err, data) => {
            usuario = data;
        });

        res.render("Datos", {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            password: usuario.password,
            anos_experiencia: usuario.anos_experiencia,
            especialidad: usuario.especialidad,
        })

        return usuario
    };

    res.render("Cargando");
});

app.put("/datos", async (req, res) => {
    const actualizacionBrutal = req.body;
    console.log(actualizacionBrutal)
    try {
        await actualizarDatos(actualizacionBrutal);
        res.sendStatus(200);

    } catch (error) {
        throw error
    };
});

app.post("/datos/eliminar", async (req, res) => {
    const deleteRequest = req.body.id;

    try {
        await eliminarParticipante(deleteRequest);

    } catch (error) {
        throw error
    };
});

app.get("/registro", (req, res) => {
    res.render("Registro");
});





app.listen(PORT, () => console.log(`Servidor funcionando en el puerto ${PORT}`));