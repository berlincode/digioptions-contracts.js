
(function (global, factory) {
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function () { return factory(); } );

  } else if ( typeof module !== 'undefined' && module.exports ) {
    // Node and other environments that support module.exports
    module.exports = factory();

  } else {
    // Browser
    global.digioptions_market_lister_bin = factory();
  }
})(this, function(){

  /* eslint-disable quotes */
  var data = "0x608060405260006006553480156200001657600080fd5b50604051620025d5380380620025d5833981016040819052620000399162000071565b6001805433600160a060020a0319918216179091554360005560028054909116600160a060020a0392909216919091179055620000a1565b60006020828403121562000083578081fd5b8151600160a060020a03811681146200009a578182fd5b9392505050565b61252480620000b16000396000f3fe608060405234801561001057600080fd5b50600436106100db576000357c010000000000000000000000000000000000000000000000000000000090048063711c2b94116100935780638677e7b9116100785780638677e7b91461019c578063b3889bb3146101af578063c70be146146101cf576100db565b8063711c2b94146101745780637cc1f86714610187576100db565b80632556d8d0116100c45780632556d8d01461011f57806352d026881461013f57806365e47b8c1461015f576100db565b8063095200ce146100e05780630f8f824414610109575b600080fd5b6100f36100ee366004611c4b565b6101ef565b6040516101009190612379565b60405180910390f35b61011161029e565b604051610100929190612142565b61013261012d366004611aef565b6104a5565b60405161010091906121c3565b61015261014d3660046118fd565b6105af565b60405161010091906120be565b61017261016d36600461197f565b610669565b005b610172610182366004611a52565b61080c565b61018f61089b565b604051610100919061212f565b6101726101aa366004611a52565b610a22565b6101c26101bd366004611a81565b610b59565b60405161010091906121b8565b6101e26101dd36600461197f565b610c73565b6040516101009190612354565b6002546040517f095200ce00000000000000000000000000000000000000000000000000000000815260009173ffffffffffffffffffffffffffffffffffffffff169063095200ce90610246908590600401612367565b60206040518083038186803b15801561025e57600080fd5b505afa158015610272573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102969190611c67565b90505b919050565b60408051600780825261010082019092526060918291906020820160e08036833701905050915062350000826000815181106102d657fe5b60209081029190910101526001805473ffffffffffffffffffffffffffffffffffffffff169083908151811061030857fe5b602090810291909101015260648260028151811061032257fe5b6020908102919091010152600a8260038151811061033c57fe5b6020908102919091010152600a8260048151811061035657fe5b6020908102919091010152600582818151811061036f57fe5b60209081029190910101526102588260068151811061038a57fe5b60209081029190910101526006548067ffffffffffffffff811180156103af57600080fd5b506040519080825280602002602001820160405280156103e957816020015b6103d66112ce565b8152602001906001900390816103ce5790505b5060045490925073ffffffffffffffffffffffffffffffffffffffff1660005b8281101561049e5760408051808201825273ffffffffffffffffffffffffffffffffffffffff84168082526000908152600560209081529290205491810191909152845185908390811061045957fe5b60209081029190910181019190915273ffffffffffffffffffffffffffffffffffffffff92831660009081526005909152604090206001908101549092169101610409565b5050509091565b60006104b084610b59565b6104ef576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104e6906122da565b60405180910390fd5b6002546040517f2556d8d000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911690632556d8d09061054990879087908790600401612311565b602060405180830381600087803b15801561056357600080fd5b505af1158015610577573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061059b9190611a3a565b90506105a8848285610d65565b9392505050565b60608167ffffffffffffffff811180156105c857600080fd5b5060405190808252806020026020018201604052801561060257816020015b6105ef6112e5565b8152602001906001900390816105e75790505b50905060005b8281101561066157610642856007600087878681811061062457fe5b90506020020135815260200190815260200160002060000154610c73565b82828151811061064e57fe5b6020908102919091010152600101610608565b509392505050565b60015473ffffffffffffffffffffffffffffffffffffffff1633146106ba576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104e69061220f565b73ffffffffffffffffffffffffffffffffffffffff821660009081526005602052604090206001015474010000000000000000000000000000000000000000900460ff16156107305773ffffffffffffffffffffffffffffffffffffffff82166000908152600560205260409020819055610808565b600480546040805160608101825284815273ffffffffffffffffffffffffffffffffffffffff92831660208083019182526001838501818152898716600081815260059094529590922093518455915192820180549151151574010000000000000000000000000000000000000000027fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff949096167fffffffffffffffffffffffff00000000000000000000000000000000000000009283161793909316949094179091558354909216179091556006805490910190555b5050565b60015473ffffffffffffffffffffffffffffffffffffffff16331461085d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104e69061220f565b60009182526008602052604090912080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055565b606080600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637cc1f8676040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b15801561092457600080fd5b505af1158015610938573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820160405261097e91908101906119aa565b905060028160008151811061098f57fe5b602090810291909101015262350000816001815181106109ab57fe5b602090810291909101015260025473ffffffffffffffffffffffffffffffffffffffff16816003815181106109dc57fe5b6020908102919091010152600054816004815181106109f757fe5b602090810291909101015260035481600881518110610a1257fe5b6020908102919091010152905090565b610a2a611320565b6002546040517fee1f69eb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9091169063ee1f69eb90610a809086906004016121c3565b60006040518083038186803b158015610a9857600080fd5b505afa158015610aac573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610af29190810190611abc565b9050806020015164ffffffffff1660001415610b0a57fe5b610b1381610b59565b610b49576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104e6906122da565b610b54818484610d65565b505050565b60015460009073ffffffffffffffffffffffffffffffffffffffff16331415610b8457506001610299565b60e082015173ffffffffffffffffffffffffffffffffffffffff16600090815260056020526040902054610bba57506000610299565b6064610bf183610160015160ff16610beb85610140015160ff1686610120015160ff1661103690919063ffffffff16565b90611036565b11158015610c085750600a82610120015160ff1610155b8015610c1d5750600a82610140015160ff1610155b8015610c325750600582610160015160ff1610155b8015610c5e575060015461018083015173ffffffffffffffffffffffffffffffffffffffff9081169116145b15610c6b57506001610299565b506000919050565b610c7b6112e5565b6002546040517fc70be14600000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9091169063c70be14690610cd39086908690600401612098565b60006040518083038186803b158015610ceb57600080fd5b505afa158015610cff573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610d459190810190611ba0565b6000928352600860205260409092205460ff161515608083015250919050565b6000610d708461107e565b6000818152600760205260409020805491925090610fbf5760015460009073ffffffffffffffffffffffffffffffffffffffff163314610db4574261025801610db7565b60005b6040805160608101825287815261012089015160ff908116602080840191825264ffffffffff86811685870190815260008b81526007909352959091209351845590516001938401805495517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0090961691909316177fffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000ff16931661010002929092179091555490915073ffffffffffffffffffffffffffffffffffffffff16331415610eb557600085815260086020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00168515151790555b6000866080015160080260ff1687610100015160ff1660019060020a029060020a029050806003541660001415610eef5760038054821790555b606087015160009060041615610f0b5750610100870151610f1b565b610f188860200151611162565b90505b876080015160ff1688610100015160ff168260ff166008610f3e8560ff1661121d565b65ffffffffffff168c6020015164ffffffffff1681610f5957fe5b0465ffffffffffff169060020a020165ffffffffffff167f3d4b4c0dc42d96da48d02a2693392bfa4fdbfb0bec570e48f5186f9f75fe8ecb888c60200151888e60000151604051610fad94939291906121cc565b60405180910390a45050505050610b54565b600181015461012086015160ff9182169116118015610fed57506001810154610100900464ffffffffff1642105b1561102f578381556101208501516001820180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660ff9092169190911790555b5050505050565b600082820183811015611075576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104e6906122a3565b90505b92915050565b600060608260000151604051602001611097919061207c565b6040516020818303038152906040528051906020012083602001518460400151856060015186608001518760a001518860c001518961010001518a60e001516040516020016110ee99989796959493929190611f61565b604080518083037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe00181529190526060840151909150600116611154576101c0830151604051611142918391602001612032565b60405160208183030381529060405290505b805160209091012092915050565b6000808061117764ffffffffff85164261124b565b90506303c2670081106111b6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104e69061226c565b623b53808111156111cb5760015b9150611216565b620a8c008111156111dd5760036111c4565b6201fa408111156111ef5760046111c4565b611c208111156112005760056111c4565b6103848111156112115760066111c4565b600791505b5092915050565b600060606040518060600160405280602a81526020016124c5602a9139600184016006020151915050919050565b600061107583836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250600081848411156112c6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104e691906121fc565b505050900390565b604080518082019091526000808252602082015290565b6040518060a001604052806112f8611320565b815260200161130561139e565b81526000602082018190526040820181905260609091015290565b604080516101e08101825260608082526000602083018190529282018390528082018390526080820183905260a0820183905260c0820183905260e08201839052610100820183905261012082018390526101408201839052610160820183905261018082018390526101a08201929092526101c081019190915290565b604080516060810182526000808252602082018190529181019190915290565b803561107881612440565b805161107881612440565b600082601f8301126113e4578081fd5b81356113f76113f2826123ae565b612387565b81815291506020808301908481018184028601820187101561141857600080fd5b60005b8481101561144057813561142e81612473565b8452928201929082019060010161141b565b505050505092915050565b600082601f83011261145b578081fd5b81516114696113f2826123ae565b81815291506020808301908481018184028601820187101561148a57600080fd5b60005b848110156114405781516114a081612473565b8452928201929082019060010161148d565b805161107881612465565b80516003811061107857600080fd5b803561107881612482565b805161107881612482565b600082601f8301126114f2578081fd5b81356115006113f2826123ce565b915080825283602082850101111561151757600080fd5b8060208401602084013760009082016020015292915050565b600082601f830112611540578081fd5b815161154e6113f2826123ce565b915080825283602082850101111561156557600080fd5b611216816020840160208601612410565b60006101e0808385031215611589578182fd5b61159281612387565b915050813567ffffffffffffffff808211156115ad57600080fd5b6115b9858386016114e2565b83526115c885602086016118d1565b60208401526115da85604086016118bb565b60408401526115ec85606086016118e7565b60608401526115fe85608086016118e7565b60808401526116108560a086016118e7565b60a08401526116228560c086016114cc565b60c08401526116348560e086016113be565b60e0840152610100915061164a858386016118e7565b82840152610120915061165f858386016118e7565b828401526101409150611674858386016118e7565b828401526101609150611689858386016118e7565b82840152610180915061169e858386016113be565b828401526101a091506116b3858386016113be565b828401526101c0915081840135818111156116cd57600080fd5b6116d9868287016113d4565b8385015250505092915050565b60006101e08083850312156116f9578182fd5b61170281612387565b915050815167ffffffffffffffff8082111561171d57600080fd5b61172985838601611530565b835261173885602086016118dc565b602084015261174a85604086016118c6565b604084015261175c85606086016118f2565b606084015261176e85608086016118f2565b60808401526117808560a086016118f2565b60a08401526117928560c086016114d7565b60c08401526117a48560e086016113c9565b60e084015261010091506117ba858386016118f2565b8284015261012091506117cf858386016118f2565b8284015261014091506117e4858386016118f2565b8284015261016091506117f9858386016118f2565b82840152610180915061180e858386016113c9565b828401526101a09150611823858386016113c9565b828401526101c09150818401518181111561183d57600080fd5b6116d98682870161144b565b60006060828403121561185a578081fd5b6118646060612387565b905081516fffffffffffffffffffffffffffffffff8116811461188657600080fd5b8152602082015161ffff8116811461189d57600080fd5b602082015260408201516118b081612465565b604082015292915050565b803561107881612491565b805161107881612491565b8035611078816124a2565b8051611078816124a2565b8035611078816124b5565b8051611078816124b5565b600080600060408486031215611911578283fd5b833561191c81612440565b9250602084013567ffffffffffffffff80821115611938578384fd5b818601915086601f83011261194b578384fd5b813581811115611959578485fd5b876020808302850101111561196c578485fd5b6020830194508093505050509250925092565b60008060408385031215611991578182fd5b823561199c81612440565b946020939093013593505050565b600060208083850312156119bc578182fd5b825167ffffffffffffffff8111156119d2578283fd5b8301601f810185136119e2578283fd5b80516119f06113f2826123ae565b8181528381019083850185840285018601891015611a0c578687fd5b8694505b83851015611a2e578051835260019490940193918501918501611a10565b50979650505050505050565b600060208284031215611a4b578081fd5b5051919050565b60008060408385031215611a64578182fd5b823591506020830135611a7681612465565b809150509250929050565b600060208284031215611a92578081fd5b813567ffffffffffffffff811115611aa8578182fd5b611ab484828501611576565b949350505050565b600060208284031215611acd578081fd5b815167ffffffffffffffff811115611ae3578182fd5b611ab4848285016116e6565b600080600083850360a0811215611b04578182fd5b843567ffffffffffffffff811115611b1a578283fd5b611b2687828801611576565b9450506020850135611b3781612465565b925060607fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc082011215611b68578182fd5b50611b736060612387565b6040850135611b81816124b5565b8152606085013560208201526080909401356040850152509093909250565b600060208284031215611bb1578081fd5b815167ffffffffffffffff80821115611bc8578283fd5b9083019060e08286031215611bdb578283fd5b611be560a0612387565b825182811115611bf3578485fd5b611bff878286016116e6565b825250611c0f8660208501611849565b602082015260808301516040820152611c2b8660a085016114bd565b6060820152611c3d8660c085016114b2565b608082015295945050505050565b600060208284031215611c5c578081fd5b8135611075816124a2565b600060208284031215611c78578081fd5b8151611075816124b5565b73ffffffffffffffffffffffffffffffffffffffff169052565b73ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000029052565b6000815180845260208085019450808401835b83811015611cf8578151600f0b87529582019590820190600101611cd9565b509495945050505050565b6000815180845260208085019450808401835b83811015611cf857815187529582019590820190600101611d16565b60000b9052565b60008151808452611d51816020860160208601612410565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60006101e08251818552611d9982860182611d39565b9150506020830151611dae6020860182611f4f565b506040830151611dc16040860182611f46565b506060830151611dd46060860182611f5a565b506080830151611de76080860182611f5a565b5060a0830151611dfa60a0860182611f5a565b5060c0830151611e0d60c0860182611d32565b5060e0830151611e2060e0860182611c83565b5061010080840151611e3482870182611f5a565b505061012080840151611e4982870182611f5a565b505061014080840151611e5e82870182611f5a565b505061016080840151611e7382870182611f5a565b505061018080840151611e8882870182611c83565b50506101a080840151611e9d82870182611c83565b50506101c08084015185830382870152611eb78382611cc6565b9695505050505050565b6000815160e08452611ed660e0850182611d83565b905060208301516fffffffffffffffffffffffffffffffff815116602086015261ffff60208201511660408601526040810151151560608601525060408301516080850152606083015160038110611f2a57fe5b60a085015260809290920151151560c090930192909252919050565b62ffffff169052565b64ffffffffff169052565b60ff169052565b60008a82527b0100000000000000000000000000000000000000000000000000000064ffffffffff8b160260208301527d01000000000000000000000000000000000000000000000000000000000062ffffff8a160260258301527f01000000000000000000000000000000000000000000000000000000000000008060ff8a160260288401528060ff89160260298401528060ff881602602a8401528086830b02602b8401528060ff861602602c84015250612021602d830184611c9d565b506041019998505050505050505050565b6000835160206120458285838901612410565b845191840191818601845b8281101561206f578151600f0b85529383019390830190600101612050565b5092979650505050505050565b6000825161208e818460208701612410565b9190910192915050565b73ffffffffffffffffffffffffffffffffffffffff929092168252602082015260400190565b6000602080830181845280855180835260408601915060408482028701019250838701855b8281101561206f577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc088860301845261211d858351611ec1565b945092850192908501906001016120e3565b6000602082526110756020830184611d03565b6000604080835261215581840186611d03565b838103602085810191909152855180835286820192820190855b818110156121aa578451805173ffffffffffffffffffffffffffffffffffffffff16845284015184840152938301939185019160010161216f565b509098975050505050505050565b901515815260200190565b90815260200190565b600085825264ffffffffff808616602084015280851660408401525060806060830152611eb76080830184611d39565b6000602082526110756020830184611d39565b60208082526022908201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f60408201527f6e2e000000000000000000000000000000000000000000000000000000000000606082015260800190565b60208082526015908201527f746f6f2066617220696e20746865206675747572650000000000000000000000604082015260600190565b6020808252601b908201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604082015260600190565b60208082526015908201527f7265676973746572206e6f7420706f737369626c650000000000000000000000604082015260600190565b600060a0825261232460a0830186611d83565b9050831515602083015260ff83511660408301526020830151606083015260408301516080830152949350505050565b6000602082526110756020830184611ec1565b64ffffffffff91909116815260200190565b60ff91909116815260200190565b60405181810167ffffffffffffffff811182821017156123a657600080fd5b604052919050565b600067ffffffffffffffff8211156123c4578081fd5b5060209081020190565b600067ffffffffffffffff8211156123e4578081fd5b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60005b8381101561242b578181015183820152602001612413565b8381111561243a576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff8116811461246257600080fd5b50565b801515811461246257600080fd5b80600f0b811461246257600080fd5b8060000b811461246257600080fd5b62ffffff8116811461246257600080fd5b64ffffffffff8116811461246257600080fd5b60ff8116811461246257600080fdfe000000000000000000fa7d000000003b53800000000a8c0000000001fa40000000001c20000000000000a26469706673582212201c308d08c0530a0c7b78d3b7310d167e45973bc2355d95fdf976b8c20f5ddc4264736f6c63430007000033";
  /* eslint-enable quotes */
  return function(){
    return data;
  };
});
