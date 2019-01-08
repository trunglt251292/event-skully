import Web3 from 'web3';
import globalConstant from '../../constants';
import {Q} from '../../Queue';
import configs from '../../config';
const socket = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/b3bb2420beaf42ba92bfd850ba3f1905'));
export const socket_contract = new socket.eth.Contract(configs.abiMainContract, configs.address_contract);

console.log('Connection Skully Main Contract successfully.');
console.log(socket_contract.events);
socket_contract.events.allEvents({fromBlock:0,toBlock:'latest'}, function (error,events) {
  if(error){
    console.log(error);
  }else {
    switch (events.event){
      case 'Mint':
        Q.create(globalConstant.jobName.MINT_WORKER,events.returnValues).removeOnComplete(true).save();
        break;
      case 'Transfer':
        console.log(events);
        Q.create(globalConstant.jobName.TRANFER_WORKER,events.returnValues).removeOnComplete(true).save();
        break;
      case 'Approval':
        Q.create(globalConstant.jobName.APPROVAL_WORKER,events.returnValues).removeOnComplete(true).save();
        break;
      default:
        break;
    }
  }
});
