const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  agent: { type: String, required: true,unique:true },
  
  phone: {
    type: String,
    validate: {
        validator: function (v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
},
  
  address:{type: String, required: true},
  role: { type: String, enum: ['customer', 'admin'], required: true },
});

module.exports = mongoose.model('User', userSchema);
