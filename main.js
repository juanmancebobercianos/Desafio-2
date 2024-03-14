const fs = require('fs');

class ProductManager {
    static ultId = 0;

    constructor() {
        this.products = [];
    }

    loadProductsFromFile(filename) {
        try {
            const fileData = fs.readFileSync(filename, 'utf8');
            const parsedData = JSON.parse(fileData);

            if (Array.isArray(parsedData)) {
                this.products = parsedData;
            } else {
                console.log("El archivo no contiene un formato de array válido.");
            }
        } catch (error) {
            console.error("Error al leer el archivo:", error.message);
        }
    }

    saveProductsToFile(filename) {
        try {
            fs.writeFileSync(filename, JSON.stringify(this.products, null, 2), 'utf8');
            console.log("Productos guardados en el archivo:", filename);
        } catch (error) {
            console.error("Error al guardar productos en el archivo:", error.message);
        }
    }

    getProducts() {
        return this.products;
    }

    addProduct(productData) {
        const { title, description, price, img, code, stock } = productData;

        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Llenar todos los campos.");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("El código debe ser único");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        };

        this.products.push(newProduct);
    }

    getProductById(id) {
        const product = this.products.find(item => item.id === id);

        if (!product) {
            console.log("Producto no encontrado.");
        } else {
            console.log("Producto encontrado.", product);
        }

        return product;
    }

    updateProduct(id, updatedData) {
        const index = this.products.findIndex(item => item.id === id);

        if (index === -1) {
            console.log("Producto no encontrado para actualizar.");
            return;
        }

        // Mantener el ID original
        updatedData.id = id;

        // Actualizar el producto
        this.products[index] = updatedData;
        console.log("Producto actualizado:", this.products[index]);
    }

    deleteProduct(id) {
        const index = this.products.findIndex(item => item.id === id);

        if (index === -1) {
            console.log("Producto no encontrado para eliminar.");
            return;
        }

        // Eliminar el producto
        const deletedProduct = this.products.splice(index, 1)[0];
        console.log("Producto eliminado:", deletedProduct);
    }
}

const manager = new ProductManager();

// Lee los productos desde un archivo (si existe)
manager.loadProductsFromFile('productos.json');

// Agrega productos
manager.addProduct({
    title: "producto prueba",
    description: "este es un producto prueba",
    price: 200,
    img: "sin imagen",
    code: "abc123",
    stock: 25
});

manager.addProduct({
    title: "fideos",
    description: "los mas sabrosos",
    price: 200,
    img: "sin imagen",
    code: "abc124",
    stock: 50
});

manager.addProduct({
    title: "arroz",
    description: "el que no se pegotea",
    price: 300,
    img: "sin imagen",
    code: "abc125",
    stock: 150
});

// Imprime la lista de productos
console.log(manager.getProducts());

// Busca un producto por ID y lo devuelve como objeto
const productById = manager.getProductById(2);
console.log(productById);

// Actualiza un producto por ID
manager.updateProduct(2, {
    title: "Fideos Actualizados",
    description: "Nueva descripción",
    price: 250,
    img: "nueva imagen",
    code: "abc124",
    stock: 75
});

// Elimina un producto por ID
manager.deleteProduct(2);

// Guarda los productos en el archivo al finalizar
manager.saveProductsToFile('productos.json');
