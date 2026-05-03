exports.getHomePage = (req, res) => {
    let query = 'SELECT * FROM products ORDER BY id ASC';
    db.execute(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('index.ejs', {
            title: 'Welcome to Supermarket | View Products',
            products: result
        });
    });
}
