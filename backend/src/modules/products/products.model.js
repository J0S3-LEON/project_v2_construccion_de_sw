import { DataTypes } from 'sequelize';
import { sequelize } from '../../db/index.js';

export const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    defaultValue: 0.0,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true,
  paranoid: true,
  tableName: 'products'
});

export default Product;
