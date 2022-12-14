const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');
const fileUpload = require('express-fileupload');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth:           '/api/auth',
      categories:     '/api/categories',
      products:       '/api/products',
      search:         '/api/search',
      uploads:        '/api/uploads',
      users:          '/api/users',
    }

    //Connect DB
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Parse and read body
    this.app.use(express.json());

    // Public Folder
    this.app.use(express.static('public'));

    // File Upload
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath : true, // <-- If the folder doesn't exist, with this atribute will be created.
  }));
  }

  routes() {
    this.app.use(this.paths.auth,         require('../routes/auth.routes'));
    this.app.use(this.paths.categories,   require('../routes/categories.routes'));
    this.app.use(this.paths.products,     require('../routes/products.routes'));
    this.app.use(this.paths.search,       require('../routes/search.routes'));
    this.app.use(this.paths.uploads,      require('../routes/uploads.routes'));
    this.app.use(this.paths.users,        require('../routes/users.routes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
