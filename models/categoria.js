const { Schema, model } = require('mongoose');


const CategoriaSchema = Schema({
	name:{
		type: String,
		required: [true, 'El nombre es obligatorio'],
		unique: true
	},
	status:{
		type: Boolean,
		required: [true, 'El estado es obligatorio'],
		default: true
	},
	by:{
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'El usuario creador es obligatorio!']
	}
	
})

CategoriaSchema.methods.toJSON = function() {
	const { __v, ...categoria  } = this.toObject()

	return categoria
}


module.exports = model('Categoria', CategoriaSchema)