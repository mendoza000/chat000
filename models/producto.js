
const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
	status:{
		type: Boolean,
		default: true,
		required: true
	},
	name:{
		type: String,
		required: [true, 'El nombre es requerido.'],
		unique: true
	},
	price:{
		type: Number,
		required: [true, 'El precio es requerido.'],
		default: 0
	},
	by:{
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'El usuario creador es requerido.']
	},
	categoria:{
		type: String,
		required: true
	},
	description:{
		type: String
	},
	stonks:{
		type: Boolean,
		default: true
	},
	img:{
		type: String
	}

})

module.exports = model('Product', ProductSchema)