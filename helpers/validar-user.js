const Role = require('../models/role');
const User = require('../models/users');

const validateRole =  async(role = '') => {

	const existRole = await Role.findOne({role})
	if (!existRole) {
		throw new Error(`El rol ${role} no existe en la base de datos!`)
	}

}

const validateExistMail = async (mail) => {
	const existMail = await User.findOne({mail})
    if (existMail) {
        throw new Error(`El mail ${mail} ya existe en la base de datos!`)
    }
}

const validateExistUserById = async (id) => {
	const existUser = await User.findById(id)
    if (!existUser) {
        throw new Error(`El id ${id} no existe!`)
    }
}

module.exports = {
	validateRole,
	validateExistMail,
	validateExistUserById
}