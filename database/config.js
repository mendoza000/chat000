const mongoose = require('mongoose');
require('colors');
const connectDB = async () =>{
	/*mongoose.Promise = global.Promise;*/
	try{

		mongoose.connect(process.env.MONGO,{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		})

		console.log(`Base de datos ${'conectada'.cyan}`);


	}catch(error){
		throw new Error('Error al inicializar la base de datos!'.red)
		console.log(error);
	}

}

module.exports = {
	connectDB
}











