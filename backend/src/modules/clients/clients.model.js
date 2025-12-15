import { DataTypes } from 'sequelize';
import { sequelize } from '../../db/index.js';

export const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
  paranoid: true,
  tableName: 'clients'
});

export default Client;
