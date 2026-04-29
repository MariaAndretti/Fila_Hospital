const PatientController = require('../controllers/patient_controller');
const routes = express.Router();

function route(app) {
  app.get('/patients', (req, res) => {
    return PatientController.index(req, res);
  });


  app.get('/patients/:id', (req, res) => {
    return PatientController.show(req, res);
  });


  app.post('/patients', (req, res) => {
    return PatientController.create(req, res);

    app.post('/', (req, res) => {
    return PatientController.create(req, res);
  });

  });

  app.put('/patients/:id', (req, res) => {
    return PatientController.update(req, res);
  });


  app.delete('/patients/:id', (req, res) => {
    return PatientController.delete(req, res);
  });
}


module.exports = route;
