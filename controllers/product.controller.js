const fs = require('fs')

exports.addProductPage = (req, res) => {
    res.render('addproduct.ejs', {
        title: 'Welcome to Supermarket | Add a new product',
        message: ''
    })
}

exports.addProducts = (req, res) => {
    if (!req.files) {
        return res.status(400).send('No files were uploaded');
    }

    let message = '';
    let Name = req.body.name;
    let Category = req.body.category;
    let Price = req.body.price;
    let Stock = req.body.stock;
    let uploadedFile = req.files.image;
    let fileExtension = uploadedFile.mimetype.split('/')[1];
    let imageName = Date.now() + '.' + fileExtension;

    // Check if product name already exists
    let checkQuery = 'SELECT * FROM `products` WHERE `name` = ?';
    db.execute(checkQuery, [Name], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length > 0) {
            message = 'Product name already exists';
            return res.render('addproduct.ejs', {
                message,
                title: 'Welcome to Supermarket | Add a new product'
            });
        }

        // Check file type
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg') {
            uploadedFile.mv(`public/assets/img/${imageName}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                let query = 'INSERT INTO `products` (name, category, price, stock, image) VALUES (?, ?, ?, ?, ?)';
                db.execute(query, [Name, Category, Price, Stock, imageName], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        } else {
            message = 'Invalid file format. Only "jpeg" and "png" images are allowed.';
            res.render('addproduct.ejs', {
                message,
                title: 'Welcome to Supermarket | Add a new product'
            });
        }
    });
}

exports.editProductPage = (req, res) => {
    let productId = req.params.id;
    let query = 'SELECT * FROM products WHERE id = ?';

    db.execute(query, [productId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('editproduct.ejs', {
            title: 'Edit Product',
            products: result[0],
            message: ''
        });
    });
}

exports.editProduct = (req, res) => {
    let productId = req.params.id;
    let Name = req.body.name;
    let Category = req.body.category;
    let Price = req.body.price;
    let Stock = req.body.stock;
    let oldImage = req.body.old_image;
    let uploadedFile = req.files ? req.files.image : null;
    let imageName = oldImage;

    if (uploadedFile) {
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        imageName = Date.now() + '.' + fileExtension;

        if (
            uploadedFile.mimetype !== 'image/png' &&
            uploadedFile.mimetype !== 'image/jpeg' &&
            uploadedFile.mimetype !== 'image/gif'
        ) {
            return res.render('editproduct.ejs', {
                message: "Invalid file format. Only 'png', 'jpeg', 'gif' images are allowed.",
                title: 'Edit Product',
                products: { id: productId, name: Name, category: Category, price: Price, stock: Stock, image: oldImage },
            });
        }

        uploadedFile.mv(`public/assets/img/${imageName}`, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
        });
    }

    let query = 'UPDATE products SET name = ?, category = ?, price = ?, stock = ?, image = ? WHERE id = ?';
    db.execute(query, [Name, Category, Price, Stock, imageName, productId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/');
    });
}

exports.deleteProduct = (req, res) => {
    let productId = req.params.id;
    let getImageQuery = 'SELECT image FROM products WHERE id = ?';
    let deleteQuery = 'DELETE FROM products WHERE id = ?';

    db.execute(getImageQuery, [productId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        let image = result[0].image;

        fs.unlink(`public/assets/img/${image}`, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            db.execute(deleteQuery, [productId], (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/');
            });
        });
    });
}
