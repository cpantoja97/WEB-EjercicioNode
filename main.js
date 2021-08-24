/*
    Camila Pantoja - 201711727
    Nota: No utilicé Express dados los requerimientos del ejercicio.
    Al exigirse el uso de http, me imaginé que entonces no debía utilizar express.
    Después de preguntar a los demás cómo lo habían hecho, me di cuenta de que tal vez sí se podía...
 */
const fs = require("fs");
const http = require("http");
const axios = require("axios");

const suppliersUrl = "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const clientsUrl = "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

http
    .createServer((req, res) => {
        const { url, method } = req;

        // Soportar solo GET
        if (method != "GET") res.writeHead(405).end();

        // Analizar path
        switch (url) {

            // CASO PROVEEDORES
            case "/api/proveedores":
                // Obtener JSON mediante promesas usando axios
                axios.get(suppliersUrl).then((json) => {
                    const suppliers = json.data;
                    // Transformar datos para html
                    const suppliersStr = suppliers.map(
                        (s) => `<tr> <td>${s.idproveedor}</td> <td>${s.nombrecompania}</td> <td>${s.nombrecontacto}</td> </tr>`
                    );

                    // Leer html usando el módulo fs
                    fs.readFile("suppliers.html", (err, data) => {
                        if (err) {
                            res.writeHead(500);
                            res.write(err);
                            res.end();
                        } else {
                            // Transformar html
                            const html = data.toString();
                            const position = html.indexOf("<tbody>") + 7;
                            const response = [
                                html.slice(0, position),
                                suppliersStr.join(" "),
                                html.slice(position),
                            ].join("");

                            // Enviar html
                            res.writeHead(200, { "Content-Type": "text/html" });
                            res.write(response);
                            res.end();
                        }
                    });
                }).catch((error) => {
                    res.writeHead(500);
                    res.write(err);
                    res.end();
                });

                break;

            // CASO PROVEEDORES
            case "/api/clientes":
                // Obtener JSON mediante promesas usando axios
                axios.get(clientsUrl).then((json) => {
                    const clients = json.data;
                    // Transformar datos para html
                    const clientsStr = clients.map(
                        (s) => `<tr> <td>${s.idCliente}</td> <td>${s.NombreCompania}</td> <td>${s.NombreContacto}</td> </tr>`
                    );

                    // Leer html usando el módulo fs
                    fs.readFile("clients.html", (err, data) => {
                        if (err) {
                            res.writeHead(500);
                            res.write(err);
                            res.end();
                        } else {
                            // Transformar html
                            const html = data.toString();
                            const position = html.indexOf("<tbody>") + 7;
                            const response = [
                                html.slice(0, position),
                                clientsStr.join(" "),
                                html.slice(position),
                            ].join("");

                            // Enviar html
                            res.writeHead(200, { "Content-Type": "text/html" });
                            res.write(response);
                            res.end();
                        }
                    });
                }).catch((error) => {
                    res.writeHead(500);
                    res.write(err);
                    res.end();
                });

                break;
            default:
                res.writeHead(404).end();
        }
    })
    .listen(8000);
