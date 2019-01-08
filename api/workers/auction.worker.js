import {Q} from '../Queue';
import Constants from '../constants';
import Owner from '../models/owner.model';
import Auction from '../models/auction.model';

// Run Worker Here!!
Q.process(Constants.jobName.CLAIM_TOKEN_WORKER, 1 ,async (job,done)=>{
  try {
    console.log('Work yet.');
    return done(null);
  } catch (err) {
    console.log(err);
    return done(err);
  }
});

Q.process(Constants.jobName.AUCTION_CANCELLED_WORKER, 1 ,async (job,done)=>{
  try {
    let data = job.data;
    await Auction.remove({skullyid:data.tokenId});
    return done(null);
  } catch (err) {
    console.log(err);
    return done(err);
  }
});

Q.process(Constants.jobName.AUCTION_CREATED_WORKER, 1 ,async (job,done)=>{
  try {
    let data = job.data;
    console.log('Data : ',data);
    let owner = await Owner.findOne({skully:data.tokenId});
    await Auction.create({
      skullyid:data.tokenId,
      startingPrice:data.startingPrice,
      endingPrice:data.endingPrice,
      duration:data.duration,
      seller:owner.miner
    });
    return done(null);
  } catch (err) {
    console.log(err);
    return done(err);
  }
});

//Handling Error
Q.on( 'error', function( err ) {
  console.log( 'Oops... ', err );
});
