import {Q} from '../Queue';
import Constants from '../constants';
import Owner from '../models/owner.model';
import Skully from '../models/skullies.model';

// Run Worker Here!!
Q.process(Constants.jobName.MINT_WORKER, 1 ,async (job,done)=>{
  try {
    let miner = job.data._to;
    let skully = job.data._tokenId;

    await Owner.update({
      skully
    },{
      skully,
      miner
    },{
      upsert:true
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
