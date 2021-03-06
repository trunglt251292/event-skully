import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const miner = new Schema({
  username:{type:String, required:true},
  email:{type:String, required:true},
  address_eth:{type:String, required:true},
  value_po8:{type:Number, default:0}
});

export default mongoose.model("miner", miner);
