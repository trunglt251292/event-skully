import Web3 from 'web3';
import globalConstant from '../../constants';
import {Q} from '../../Queue';
import configs from '../../config';
const socket = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/b3bb2420beaf42ba92bfd850ba3f1905'));
export const socket_contract = new socket.eth.Contract(configs.abiAuctionContract, configs.address_auction);

console.log('Connection Skully Auction Contract Successfully.');
console.log(socket_contract.events);
socket_contract.events.allEvents({fromBlock:0,toBlock:'latest'}, function (error,events) {
  if(error){
    console.log(error);
  }else {
    console.log(events);
    switch (events.event){
      case 'ClaimToken':
        Q.create(globalConstant.jobName.CLAIM_TOKEN_WORKER,events.returnValues).removeOnComplete(true).save();
        break;
      case 'AuctionCreated':
        Q.create(globalConstant.jobName.AUCTION_CREATED_WORKER,events.returnValues).removeOnComplete(true).save();
        break;
      case 'AuctionCancelled':
        Q.create(globalConstant.jobName.AUCTION_CANCELLED_WORKER,events.returnValues).removeOnComplete(true).save();
        break;
      default:
        break;
    }
  }
});
