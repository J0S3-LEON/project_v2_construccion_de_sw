import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Cart = db.define('Cart', {
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  data: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
});

export default Cart;
