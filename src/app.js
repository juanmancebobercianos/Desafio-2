const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 3000;
const manager = new ProductManager();

// Función para cargar los productos al inicio del servidor
async function loadProducts() {
    try {
        await manager.loadProductsFromFile('productos.json');
        console.log('Productos cargados exitosamente.');
    } catch (error) {
        console.error('Error al cargar los productos:', error.message);
    }
}

// Función para iniciar el servidor
async function startServer() {
    await loadProducts();

    app.get('/products', async (req, res) => {
        const limit = req.query.limit;

        try {
            let productsToSend = await manager.getProducts();
            
            if (limit) {
                const parsedLimit = parseInt(limit);
                if (!isNaN(parsedLimit)) {
                    productsToSend = productsToSend.slice(0, parsedLimit);
                } else {
                    return res.status(400).json({ error: 'El límite debe ser un número válido.' });
                }
            }
            
            res.json(productsToSend);
        } catch (error) {
            console.error('Error al obtener los productos:', error.message);
            res.status(500).json({ error: 'Error al obtener los productos.' });
        }
    });

    app.get('/products/:pid', async (req, res) => {
        const productId = parseInt(req.params.pid);

        try {
            const product = await manager.getProductById(productId);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Producto no encontrado.' });
            }
        } catch (error) {
            console.error('Error al obtener el producto:', error.message);
            res.status(500).json({ error: 'Error al obtener el producto.' });
        }
    });

    // Inicia el servidor
    app.listen(PORT, () => {
        console.log(`Servidor Express escuchando en el puerto ${PORT}`);
    });
}

startServer();
