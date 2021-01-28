
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
  var data = "0x608060405260006006553480156200001657600080fd5b506040516200262538038062002625833981016040819052620000399162000071565b60018054336001600160a01b03199182161790915543600055600280549091166001600160a01b0392909216919091179055620000a1565b60006020828403121562000083578081fd5b81516001600160a01b03811681146200009a578182fd5b9392505050565b61257480620000b16000396000f3fe608060405234801561001057600080fd5b50600436106100be5760003560e01c8063711c2b94116100765780638677e7b91161005b5780638677e7b91461017f578063b3889bb314610192578063c70be146146101b2576100be565b8063711c2b94146101575780637cc1f8671461016a576100be565b80632556d8d0116100a75780632556d8d01461010257806352d026881461012257806365e47b8c14610142576100be565b8063095200ce146100c35780630f8f8244146100ec575b600080fd5b6100d66100d1366004611e75565b6101d2565b6040516100e391906123d0565b60405180910390f35b6100f4610281565b6040516100e392919061221a565b610115610110366004611cf8565b610488565b6040516100e3919061229b565b610135610130366004611b06565b610592565b6040516100e39190612189565b610155610150366004611b88565b61064c565b005b610155610165366004611c5b565b6107ef565b61017261087e565b6040516100e39190612207565b61015561018d366004611c5b565b6109e9565b6101a56101a0366004611c8a565b610b20565b6040516100e39190612290565b6101c56101c0366004611b88565b610c3a565b6040516100e391906123ab565b6002546040517f095200ce00000000000000000000000000000000000000000000000000000000815260009173ffffffffffffffffffffffffffffffffffffffff169063095200ce906102299085906004016123be565b60206040518083038186803b15801561024157600080fd5b505afa158015610255573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102799190611e91565b90505b919050565b60408051600780825261010082019092526060918291906020820160e08036833701905050915062350000826000815181106102b957fe5b60209081029190910101526001805473ffffffffffffffffffffffffffffffffffffffff16908390815181106102eb57fe5b602090810291909101015260648260028151811061030557fe5b6020908102919091010152600a8260038151811061031f57fe5b6020908102919091010152600a8260048151811061033957fe5b6020908102919091010152600582818151811061035257fe5b60209081029190910101526102588260068151811061036d57fe5b60209081029190910101526006548067ffffffffffffffff8111801561039257600080fd5b506040519080825280602002602001820160405280156103cc57816020015b6103b96114d6565b8152602001906001900390816103b15790505b5060045490925073ffffffffffffffffffffffffffffffffffffffff1660005b828110156104815760408051808201825273ffffffffffffffffffffffffffffffffffffffff84168082526000908152600560209081529290205491810191909152845185908390811061043c57fe5b60209081029190910181019190915273ffffffffffffffffffffffffffffffffffffffff928316600090815260059091526040902060019081015490921691016103ec565b5050509091565b600061049384610b20565b6104d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c990612331565b60405180910390fd5b6002546040517f2556d8d000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911690632556d8d09061052c90879087908790600401612368565b602060405180830381600087803b15801561054657600080fd5b505af115801561055a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061057e9190611c43565b905061058b848285610d2c565b9392505050565b60608167ffffffffffffffff811180156105ab57600080fd5b506040519080825280602002602001820160405280156105e557816020015b6105d26114ed565b8152602001906001900390816105ca5790505b50905060005b8281101561064457610625856007600087878681811061060757fe5b90506020020135815260200190815260200160002060000154610c3a565b82828151811061063157fe5b60209081029190910101526001016105eb565b509392505050565b60015473ffffffffffffffffffffffffffffffffffffffff16331461069d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c9906122d4565b73ffffffffffffffffffffffffffffffffffffffff821660009081526005602052604090206001015474010000000000000000000000000000000000000000900460ff16156107135773ffffffffffffffffffffffffffffffffffffffff821660009081526005602052604090208190556107eb565b600480546040805160608101825284815273ffffffffffffffffffffffffffffffffffffffff92831660208083019182526001838501818152898716600081815260059094529590922093518455915192820180549151151574010000000000000000000000000000000000000000027fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff949096167fffffffffffffffffffffffff00000000000000000000000000000000000000009283161793909316949094179091558354909216179091556006805490910190555b5050565b60015473ffffffffffffffffffffffffffffffffffffffff163314610840576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c9906122d4565b60009182526008602052604090912080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055565b606080600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637cc1f8676040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156108eb57600080fd5b505af11580156108ff573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526109459190810190611bb3565b905060028160008151811061095657fe5b6020908102919091010152623500008160018151811061097257fe5b602090810291909101015260025473ffffffffffffffffffffffffffffffffffffffff16816003815181106109a357fe5b6020908102919091010152600054816004815181106109be57fe5b6020908102919091010152600354816008815181106109d957fe5b6020908102919091010152905090565b6109f1611528565b6002546040517fee1f69eb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9091169063ee1f69eb90610a4790869060040161229b565b60006040518083038186803b158015610a5f57600080fd5b505afa158015610a73573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610ab99190810190611cc5565b9050806020015164ffffffffff1660001415610ad157fe5b610ada81610b20565b610b10576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c990612331565b610b1b818484610d2c565b505050565b60015460009073ffffffffffffffffffffffffffffffffffffffff16331415610b4b5750600161027c565b60e082015173ffffffffffffffffffffffffffffffffffffffff16600090815260056020526040902054610b815750600061027c565b6064610bb883610160015160ff16610bb285610140015160ff1686610120015160ff16610ff490919063ffffffff16565b90610ff4565b11158015610bcf5750600a82610120015160ff1610155b8015610be45750600a82610140015160ff1610155b8015610bf95750600582610160015160ff1610155b8015610c25575060015461018083015173ffffffffffffffffffffffffffffffffffffffff9081169116145b15610c325750600161027c565b506000919050565b610c426114ed565b6002546040517fc70be14600000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9091169063c70be14690610c9a9086908690600401612163565b60006040518083038186803b158015610cb257600080fd5b505afa158015610cc6573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610d0c9190810190611dbe565b6000928352600860205260409092205460ff161515608083015250919050565b6000610d3784611068565b6000818152600760205260409020805491925090610f7d5760015460009073ffffffffffffffffffffffffffffffffffffffff163314610d7b574261025801610d7e565b60005b6040805160608101825287815261012089015160ff908116602080840191825264ffffffffff86811685870190815260008b81526007909352959091209351845590516001938401805495517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0090961691909316177fffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000ff16931661010002929092179091555490915073ffffffffffffffffffffffffffffffffffffffff16331415610e7c57600085815260086020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00168515151790555b6000866080015160080260ff1687610100015160ff166001901b901b9050806003541660001415610eb05760038054821790555b606087015160009060041615610ecc5750610100870151610edc565b610ed988602001516112ca565b90505b876080015160ff1688610100015160ff168260ff166008610eff8560ff166113ba565b65ffffffffffff168c6020015164ffffffffff1681610f1a57fe5b0465ffffffffffff16901b0165ffffffffffff167f3d4b4c0dc42d96da48d02a2693392bfa4fdbfb0bec570e48f5186f9f75fe8ecb888c60200151888e60000151604051610f6b94939291906122a4565b60405180910390a45050505050610b1b565b600181015461012086015160ff9182169116118015610fab57506001810154610100900464ffffffffff1642105b15610fed578381556101208501516001820180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660ff9092169190911790555b5050505050565b60008282018381101561058b57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b6000606082600001516040516020018082805190602001908083835b602083106110c157805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09092019160209182019101611084565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040528051906020012083602001518460400151856060015186608001518760a001518860c001518961010001518a60e00151604051602001808a81526020018964ffffffffff1660d81b81526005018862ffffff1660e81b81526003018760ff1660f81b81526001018660ff1660f81b81526001018560ff1660f81b81526001018460000b60f81b81526001018360ff1660f81b81526001018273ffffffffffffffffffffffffffffffffffffffff1660601b815260140199505050505050505050506040516020818303038152906040529050600160048111156111d457fe5b83606001511660ff16600014156112bc5780836101c001516040516020018083805190602001908083835b6020831061123c57805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920191602091820191016111ff565b51815160209384036101000a7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01801990921691161790528551919093019285810192500280838360005b8381101561129f578181015183820152602001611287565b505050509050019250505060405160208183030381529060405290505b805160209091012092915050565b600080806112df64ffffffffff8516426113e8565b90506303c26700811061135357604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f746f6f2066617220696e20746865206675747572650000000000000000000000604482015290519081900360640190fd5b623b53808111156113685760015b91506113b3565b620a8c0081111561137a576003611361565b6201fa4081111561138c576004611361565b611c2081111561139d576005611361565b6103848111156113ae576006611361565b600791505b5092915050565b600060606040518060600160405280602a8152602001612515602a9139600184016006020151915050919050565b600061058b83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250600081848411156114ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b8381101561149357818101518382015260200161147b565b50505050905090810190601f1680156114c05780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b604080518082019091526000808252602082015290565b6040518060a00160405280611500611528565b815260200161150d6115a6565b81526000602082018190526040820181905260609091015290565b604080516101e08101825260608082526000602083018190529282018390528082018390526080820183905260a0820183905260c0820183905260e08201839052610100820183905261012082018390526101408201839052610160820183905261018082018390526101a08201929092526101c081019190915290565b604080516060810182526000808252602082018190529181019190915290565b803561027c81612490565b805161027c81612490565b600082601f8301126115ec578081fd5b81356115ff6115fa82612402565b6123de565b81815291506020808301908481018184028601820187101561162057600080fd5b60005b84811015611648578135611636816124c3565b84529282019290820190600101611623565b505050505092915050565b600082601f830112611663578081fd5b81516116716115fa82612402565b81815291506020808301908481018184028601820187101561169257600080fd5b60005b848110156116485781516116a8816124c3565b84529282019290820190600101611695565b805161027c816124b5565b80516003811061027c57600080fd5b803561027c816124d2565b805161027c816124d2565b600082601f8301126116fa578081fd5b81356117086115fa82612420565b915080825283602082850101111561171f57600080fd5b8060208401602084013760009082016020015292915050565b600082601f830112611748578081fd5b81516117566115fa82612420565b915080825283602082850101111561176d57600080fd5b6113b3816020840160208601612460565b60006101e0808385031215611791578182fd5b61179a816123de565b915050813567ffffffffffffffff808211156117b557600080fd5b6117c1858386016116ea565b83526117cf60208501611ada565b60208401526117e060408501611ac4565b60408401526117f160608501611af0565b606084015261180260808501611af0565b608084015261181360a08501611af0565b60a084015261182460c085016116d4565b60c084015261183560e085016115c6565b60e0840152610100915061184a828501611af0565b82840152610120915061185e828501611af0565b828401526101409150611872828501611af0565b828401526101609150611886828501611af0565b82840152610180915061189a8285016115c6565b828401526101a091506118ae8285016115c6565b828401526101c0915081840135818111156118c857600080fd5b6118d4868287016115dc565b8385015250505092915050565b60006101e08083850312156118f4578182fd5b6118fd816123de565b915050815167ffffffffffffffff8082111561191857600080fd5b61192485838601611738565b835261193260208501611ae5565b602084015261194360408501611acf565b604084015261195460608501611afb565b606084015261196560808501611afb565b608084015261197660a08501611afb565b60a084015261198760c085016116df565b60c084015261199860e085016115d1565b60e084015261010091506119ad828501611afb565b8284015261012091506119c1828501611afb565b8284015261014091506119d5828501611afb565b8284015261016091506119e9828501611afb565b8284015261018091506119fd8285016115d1565b828401526101a09150611a118285016115d1565b828401526101c091508184015181811115611a2b57600080fd5b6118d486828701611653565b600060608284031215611a48578081fd5b6040516060810181811067ffffffffffffffff82111715611a6557fe5b806040525080915082516fffffffffffffffffffffffffffffffff81168114611a8d57600080fd5b8152602083015161ffff81168114611aa457600080fd5b60208201526040830151611ab7816124b5565b6040919091015292915050565b803561027c816124e1565b805161027c816124e1565b803561027c816124f2565b805161027c816124f2565b803561027c81612505565b805161027c81612505565b600080600060408486031215611b1a578283fd5b8335611b2581612490565b9250602084013567ffffffffffffffff80821115611b41578384fd5b818601915086601f830112611b54578384fd5b813581811115611b62578485fd5b8760208083028501011115611b75578485fd5b6020830194508093505050509250925092565b60008060408385031215611b9a578182fd5b8235611ba581612490565b946020939093013593505050565b60006020808385031215611bc5578182fd5b825167ffffffffffffffff811115611bdb578283fd5b8301601f81018513611beb578283fd5b8051611bf96115fa82612402565b8181528381019083850185840285018601891015611c15578687fd5b8694505b83851015611c37578051835260019490940193918501918501611c19565b50979650505050505050565b600060208284031215611c54578081fd5b5051919050565b60008060408385031215611c6d578182fd5b823591506020830135611c7f816124b5565b809150509250929050565b600060208284031215611c9b578081fd5b813567ffffffffffffffff811115611cb1578182fd5b611cbd8482850161177e565b949350505050565b600060208284031215611cd6578081fd5b815167ffffffffffffffff811115611cec578182fd5b611cbd848285016118e1565b600080600083850360a0811215611d0d578182fd5b843567ffffffffffffffff80821115611d24578384fd5b611d308883890161177e565b955060208701359150611d42826124b5565b81945060607fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc084011215611d74578384fd5b60405192506060830191508282108183111715611d8d57fe5b506040908152850135611d9f81612505565b8152606085013560208201526080909401356040850152509093909250565b600060208284031215611dcf578081fd5b815167ffffffffffffffff80821115611de6578283fd5b9083019060e08286031215611df9578283fd5b60405160a081018181108382111715611e0e57fe5b604052825182811115611e1f578485fd5b611e2b878286016118e1565b825250611e3b8660208501611a37565b602082015260808301516040820152611e5660a084016116c5565b6060820152611e6760c084016116ba565b608082015295945050505050565b600060208284031215611e86578081fd5b813561058b816124f2565b600060208284031215611ea2578081fd5b815161058b81612505565b73ffffffffffffffffffffffffffffffffffffffff169052565b6000815180845260208085019450808401835b83811015611ef9578151600f0b87529582019590820190600101611eda565b509495945050505050565b6000815180845260208085019450808401835b83811015611ef957815187529582019590820190600101611f17565b15159052565b60000b9052565b60008151808452611f58816020860160208601612460565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60006101e08251818552611fa082860182611f40565b9150506020830151611fb56020860182612151565b506040830151611fc86040860182612148565b506060830151611fdb606086018261215c565b506080830151611fee608086018261215c565b5060a083015161200160a086018261215c565b5060c083015161201460c0860182611f39565b5060e083015161202760e0860182611ead565b506101008084015161203b8287018261215c565b5050610120808401516120508287018261215c565b5050610140808401516120658287018261215c565b50506101608084015161207a8287018261215c565b50506101808084015161208f82870182611ead565b50506101a0808401516120a482870182611ead565b50506101c080840151858303828701526120be8382611ec7565b9695505050505050565b6000815160e084526120dd60e0850182611f8a565b905060208301516fffffffffffffffffffffffffffffffff815116602086015261ffff6020820151166040860152604081015115156060860152506040830151608085015260608301516003811061213157fe5b60a0850152608083015161064460c0860182611f33565b62ffffff169052565b64ffffffffff169052565b60ff169052565b73ffffffffffffffffffffffffffffffffffffffff929092168252602082015260400190565b6000602080830181845280855180835260408601915060408482028701019250838701855b828110156121fa577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc08886030184526121e88583516120c8565b945092850192908501906001016121ae565b5092979650505050505050565b60006020825261058b6020830184611f04565b6000604080835261222d81840186611f04565b838103602085810191909152855180835286820192820190855b81811015612282578451805173ffffffffffffffffffffffffffffffffffffffff168452840151848401529383019391850191600101612247565b509098975050505050505050565b901515815260200190565b90815260200190565b600085825264ffffffffff8086166020840152808516604084015250608060608301526120be6080830184611f40565b60208082526022908201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f60408201527f6e2e000000000000000000000000000000000000000000000000000000000000606082015260800190565b60208082526015908201527f7265676973746572206e6f7420706f737369626c650000000000000000000000604082015260600190565b600060a0825261237b60a0830186611f8a565b9050831515602083015260ff83511660408301526020830151606083015260408301516080830152949350505050565b60006020825261058b60208301846120c8565b64ffffffffff91909116815260200190565b60ff91909116815260200190565b60405181810167ffffffffffffffff811182821017156123fa57fe5b604052919050565b600067ffffffffffffffff82111561241657fe5b5060209081020190565b600067ffffffffffffffff82111561243457fe5b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60005b8381101561247b578181015183820152602001612463565b8381111561248a576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff811681146124b257600080fd5b50565b80151581146124b257600080fd5b80600f0b81146124b257600080fd5b8060000b81146124b257600080fd5b62ffffff811681146124b257600080fd5b64ffffffffff811681146124b257600080fd5b60ff811681146124b257600080fdfe000000000000000000fa7d000000003b53800000000a8c0000000001fa40000000001c20000000000000a26469706673582212203d8798bd70d7166e6aa264b4a6fe06f0094cd485fc37e2e230aa9e5036fa545a64736f6c63430007040033";
  /* eslint-enable quotes */
  return function(){
    return data;
  };
});
