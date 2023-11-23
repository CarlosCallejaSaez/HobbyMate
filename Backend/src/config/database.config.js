const mongoose =  require("mongoose");




mongoose.set("strictQuery", true);

const dbconnect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI,);
    
    console.log("connect successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports=dbconnect;