/**
 * VerifyPhone.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "VerifyPhone",
  autoUpdatedAt: false,
  autoCreatedAt: false,
  autoPK: false,
  attributes: {
    PhoneNum: {
      primaryKey: true,
      type: 'integer'
    },
    VerifyCode: {
      type: 'integer'
    },
    ExpireAt: {
      type: 'integer'
    },
  }
};
