const database = require('../config/database')
const Patient = require('../models/patient')

class PatientController{

    static async index(req, res){

        let patients = await Patient.findAll();
        res.send(JSON.stringify(patients));

    }

    static async show(req, res){

        const {id} = req.params;
        let patient = await Patient.findByPk(id);

        res.send(JSON.stringify(patient))
  
    }

    static async create(req, res) {

        const {name, cpf, birthDate, priority, phone} = req.body;
        let patient = await Patient.create({
        name: name,
        birthDate: birthDate,
        priority: priority,
        cpf: cpf,
        phone: phone

       });
       patient.save();

       res.send(JSON.stringify(patient));
    }

       static async update(req, res) {
        const { id } = req.params;
        const {name, cpf, birthDate, priority, phone} = req.body;

       let patient = await Patient.findByPk(id);
       if (name !== undefined) patient.name = name;
       if (cpf !== undefined) patient.cpf = cpf;
       if (birthDate !== undefined) patient.birthDate = birthDate;
       if (priority !== undefined) patient.priority = priority;
       if (phone !== undefined) patient.phone =phone;

       await patient.save();

       res.send(JSON.stringify({ sucess: true }));
 }
      static async delete(req,res) {

        const { id } = req.params;
        let patient = await Patient.findByPk(id);
        patient.destroy();

        res.send(JSON.stringify({ sucess: true }));

}
}


module.exports = PatientController