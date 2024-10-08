const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const connect = await mongoose.connect('mongodb+srv://nestresidency:nestcltcybozom24@nestcluster.6q9gd.mongodb.net/Nest')
        console.log("Database Connected", connect.connection.host, connect.connection.name);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB