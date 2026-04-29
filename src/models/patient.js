const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Patient extends Model {
    static associate(models) {
      Patient.hasMany(models.Attendance, {
        foreignKey: 'patientId',
        as: 'attendances',
      });
    }
  }

  Patient.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Patient',
      tableName: 'patients',
    }
  );

  return Patient;
};
