import Eos from 'eosjs'

const EOS_CONFIG = {
  clientConfig: {
/*    httpEndpoint: 'https://mainnet.genereos.io', // EOS http endpoint
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'*/

    httpEndpoint:'https://junglenodes.eosmetal.io:443', // ( or null if endorsed chainId )
    chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca", // Or null to fetch automatically ( takes longer )
  }
}

export default function EosClient() {
  return Eos(EOS_CONFIG.clientConfig);
}
