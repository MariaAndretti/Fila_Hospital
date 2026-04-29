const { Attendance, Patient, sequelize } = require('../models');

module.exports = {
  async create(req, res) {
    try {
      const { patientId, priorityLevel } = req.body;

      if (!patientId) {
        return res.status(400).json({
          error: 'patientId é obrigatório',
        });
      }

      if (!priorityLevel) {
        return res.status(400).json({
          error: 'priorityLevel é obrigatório',
        });
      }

      if (priorityLevel < 1 || priorityLevel > 5) {
        return res.status(400).json({
          error: 'priorityLevel deve estar entre 1 e 5',
        });
      }

      const patient = await Patient.findByPk(patientId);

      if (!patient) {
        return res.status(404).json({
          error: 'Paciente não encontrado',
        });
      }

      const attendance = await Attendance.create({
        patientId,
        priorityLevel,
        status: 'WAITING',
        enteredAt: new Date(),
      });

      return res.status(201).json(attendance);
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao criar triagem',
        details: error.message,
      });
    }
  },

  async queue(req, res) {
    try {
      const queue = await Attendance.findAll({
        where: { status: 'WAITING' },
        include: [
          {
            model: Patient,
            as: 'patient',
          },
        ],
        order: [
          ['priorityLevel', 'ASC'],
          ['enteredAt', 'ASC'],
        ],
      });

      return res.status(200).json(queue);
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao listar fila',
        details: error.message,
      });
    }
  },

  async next(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const nextAttendance = await Attendance.findOne({
        where: { status: 'WAITING' },
        include: [
          {
            model: Patient,
            as: 'patient',
          },
        ],
        order: [
          ['priorityLevel', 'ASC'],
          ['enteredAt', 'ASC'],
        ],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!nextAttendance) {
        await transaction.rollback();
        return res.status(404).json({
          error: 'Fila vazia',
        });
      }

      await nextAttendance.update(
        {
          status: 'IN_ATTENDANCE',
          calledAt: new Date(),
        },
        { transaction }
      );

      await transaction.commit();

      return res.status(200).json({
        message: 'Paciente chamado com sucesso',
        data: nextAttendance,
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        error: 'Erro ao chamar próximo paciente',
        details: error.message,
      });
    }
  },

  async history(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          error: 'Informe a data no formato YYYY-MM-DD',
        });
      }

      const startDate = new Date(`${date}T00:00:00.000Z`);
      const endDate = new Date(`${date}T23:59:59.999Z`);

      const history = await Attendance.findAll({
        where: {
          calledAt: {
            [sequelize.Sequelize.Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: Patient,
            as: 'patient',
          },
        ],
        order: [['calledAt', 'ASC']],
      });

      return res.status(200).json(history);
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao listar histórico',
        details: error.message,
      });
    }
  },
};
