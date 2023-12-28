'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Registration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Registration.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
      Registration.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
      Registration.belongsTo(models.TrainingSchedule, { foreignKey: 'scheduleId', as: 'trainingSchedule' });
    }
  }
  Registration.init({
    studentId: DataTypes.UUID,
    courseId: DataTypes.UUID,
    scheduleId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Registration',
  });
  return Registration;
};