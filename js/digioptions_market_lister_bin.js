
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
  var data = "0x6080604052600060065534801561001557600080fd5b506040516200258e3803806200258e8339810160408190526100369161006d565b60018054336001600160a01b03199182161790915543600055600280549091166001600160a01b039290921691909117905561009b565b60006020828403121561007e578081fd5b81516001600160a01b0381168114610094578182fd5b9392505050565b6124e380620000ab6000396000f3fe608060405234801561001057600080fd5b50600436106100be5760003560e01c8063711c2b94116100765780638677e7b91161005b5780638677e7b91461017f578063b3889bb314610192578063c70be146146101b2576100be565b8063711c2b94146101575780637cc1f8671461016a576100be565b80632556d8d0116100a75780632556d8d01461010257806352d026881461012257806365e47b8c14610142576100be565b8063095200ce146100c35780630f8f8244146100ec575b600080fd5b6100d66100d1366004611c09565b6101d2565b6040516100e39190612338565b60405180910390f35b6100f4610281565b6040516100e3929190612101565b610115610110366004611aad565b610488565b6040516100e39190612182565b6101356101303660046118bb565b610592565b6040516100e3919061207d565b61015561015036600461193d565b61064c565b005b610155610165366004611a10565b6107ef565b61017261087e565b6040516100e391906120ee565b61015561018d366004611a10565b6109e9565b6101a56101a0366004611a3f565b610b20565b6040516100e39190612177565b6101c56101c036600461193d565b610c3a565b6040516100e39190612313565b6002546040517f095200ce00000000000000000000000000000000000000000000000000000000815260009173ffffffffffffffffffffffffffffffffffffffff169063095200ce90610229908590600401612326565b60206040518083038186803b15801561024157600080fd5b505afa158015610255573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102799190611c25565b90505b919050565b60408051600780825261010082019092526060918291906020820160e08036833701905050915062350000826000815181106102b957fe5b60209081029190910101526001805473ffffffffffffffffffffffffffffffffffffffff16908390815181106102eb57fe5b602090810291909101015260648260028151811061030557fe5b6020908102919091010152600a8260038151811061031f57fe5b6020908102919091010152600a8260048151811061033957fe5b6020908102919091010152600582818151811061035257fe5b60209081029190910101526102588260068151811061036d57fe5b60209081029190910101526006548067ffffffffffffffff8111801561039257600080fd5b506040519080825280602002602001820160405280156103cc57816020015b6103b961128c565b8152602001906001900390816103b15790505b5060045490925073ffffffffffffffffffffffffffffffffffffffff1660005b828110156104815760408051808201825273ffffffffffffffffffffffffffffffffffffffff84168082526000908152600560209081529290205491810191909152845185908390811061043c57fe5b60209081029190910181019190915273ffffffffffffffffffffffffffffffffffffffff928316600090815260059091526040902060019081015490921691016103ec565b5050509091565b600061049384610b20565b6104d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c990612299565b60405180910390fd5b6002546040517f2556d8d000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911690632556d8d09061052c908790879087906004016122d0565b602060405180830381600087803b15801561054657600080fd5b505af115801561055a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061057e91906119f8565b905061058b848285610d2c565b9392505050565b60608167ffffffffffffffff811180156105ab57600080fd5b506040519080825280602002602001820160405280156105e557816020015b6105d26112a3565b8152602001906001900390816105ca5790505b50905060005b8281101561064457610625856007600087878681811061060757fe5b90506020020135815260200190815260200160002060000154610c3a565b82828151811061063157fe5b60209081029190910101526001016105eb565b509392505050565b60015473ffffffffffffffffffffffffffffffffffffffff16331461069d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c9906121ce565b73ffffffffffffffffffffffffffffffffffffffff821660009081526005602052604090206001015474010000000000000000000000000000000000000000900460ff16156107135773ffffffffffffffffffffffffffffffffffffffff821660009081526005602052604090208190556107eb565b600480546040805160608101825284815273ffffffffffffffffffffffffffffffffffffffff92831660208083019182526001838501818152898716600081815260059094529590922093518455915192820180549151151574010000000000000000000000000000000000000000027fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff949096167fffffffffffffffffffffffff00000000000000000000000000000000000000009283161793909316949094179091558354909216179091556006805490910190555b5050565b60015473ffffffffffffffffffffffffffffffffffffffff163314610840576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c9906121ce565b60009182526008602052604090912080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055565b606080600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637cc1f8676040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156108eb57600080fd5b505af11580156108ff573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526109459190810190611968565b905060028160008151811061095657fe5b6020908102919091010152623500008160018151811061097257fe5b602090810291909101015260025473ffffffffffffffffffffffffffffffffffffffff16816003815181106109a357fe5b6020908102919091010152600054816004815181106109be57fe5b6020908102919091010152600354816008815181106109d957fe5b6020908102919091010152905090565b6109f16112de565b6002546040517fee1f69eb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9091169063ee1f69eb90610a47908690600401612182565b60006040518083038186803b158015610a5f57600080fd5b505afa158015610a73573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610ab99190810190611a7a565b9050806020015164ffffffffff1660001415610ad157fe5b610ada81610b20565b610b10576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c990612299565b610b1b818484610d2c565b505050565b60015460009073ffffffffffffffffffffffffffffffffffffffff16331415610b4b5750600161027c565b60e082015173ffffffffffffffffffffffffffffffffffffffff16600090815260056020526040902054610b815750600061027c565b6064610bb883610160015160ff16610bb285610140015160ff1686610120015160ff16610ff490919063ffffffff16565b90610ff4565b11158015610bcf5750600a82610120015160ff1610155b8015610be45750600a82610140015160ff1610155b8015610bf95750600582610160015160ff1610155b8015610c25575060015461018083015173ffffffffffffffffffffffffffffffffffffffff9081169116145b15610c325750600161027c565b506000919050565b610c426112a3565b6002546040517fc70be14600000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9091169063c70be14690610c9a9086908690600401612057565b60006040518083038186803b158015610cb257600080fd5b505afa158015610cc6573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610d0c9190810190611b5e565b6000928352600860205260409092205460ff161515608083015250919050565b6000610d378461103c565b6000818152600760205260409020805491925090610f7d5760015460009073ffffffffffffffffffffffffffffffffffffffff163314610d7b574261025801610d7e565b60005b6040805160608101825287815261012089015160ff908116602080840191825264ffffffffff86811685870190815260008b81526007909352959091209351845590516001938401805495517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0090961691909316177fffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000ff16931661010002929092179091555490915073ffffffffffffffffffffffffffffffffffffffff16331415610e7c57600085815260086020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00168515151790555b6000866080015160080260ff1687610100015160ff166001901b901b9050806003541660001415610eb05760038054821790555b606087015160009060041615610ecc5750610100870151610edc565b610ed98860200151611120565b90505b876080015160ff1688610100015160ff168260ff166008610eff8560ff166111db565b65ffffffffffff168c6020015164ffffffffff1681610f1a57fe5b0465ffffffffffff16901b0165ffffffffffff167f3d4b4c0dc42d96da48d02a2693392bfa4fdbfb0bec570e48f5186f9f75fe8ecb888c60200151888e60000151604051610f6b949392919061218b565b60405180910390a45050505050610b1b565b600181015461012086015160ff9182169116118015610fab57506001810154610100900464ffffffffff1642105b15610fed578381556101208501516001820180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660ff9092169190911790555b5050505050565b600082820183811015611033576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c990612262565b90505b92915050565b600060608260000151604051602001611055919061203b565b6040516020818303038152906040528051906020012083602001518460400151856060015186608001518760a001518860c001518961010001518a60e001516040516020016110ac99989796959493929190611f1f565b604080518083037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe00181529190526060840151909150600116611112576101c0830151604051611100918391602001611ff1565b60405160208183030381529060405290505b805160209091012092915050565b6000808061113564ffffffffff851642611209565b90506303c267008110611174576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c99061222b565b623b53808111156111895760015b91506111d4565b620a8c0081111561119b576003611182565b6201fa408111156111ad576004611182565b611c208111156111be576005611182565b6103848111156111cf576006611182565b600791505b5092915050565b600060606040518060600160405280602a8152602001612484602a9139600184016006020151915050919050565b600061103383836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f77000081525060008184841115611284576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c991906121bb565b505050900390565b604080518082019091526000808252602082015290565b6040518060a001604052806112b66112de565b81526020016112c361135c565b81526000602082018190526040820181905260609091015290565b604080516101e08101825260608082526000602083018190529282018390528082018390526080820183905260a0820183905260c0820183905260e08201839052610100820183905261012082018390526101408201839052610160820183905261018082018390526101a08201929092526101c081019190915290565b604080516060810182526000808252602082018190529181019190915290565b8035611036816123ff565b8051611036816123ff565b600082601f8301126113a2578081fd5b81356113b56113b08261236d565b612346565b8181529150602080830190848101818402860182018710156113d657600080fd5b60005b848110156113fe5781356113ec81612432565b845292820192908201906001016113d9565b505050505092915050565b600082601f830112611419578081fd5b81516114276113b08261236d565b81815291506020808301908481018184028601820187101561144857600080fd5b60005b848110156113fe57815161145e81612432565b8452928201929082019060010161144b565b805161103681612424565b80516003811061103657600080fd5b803561103681612441565b805161103681612441565b600082601f8301126114b0578081fd5b81356114be6113b08261238d565b91508082528360208285010111156114d557600080fd5b8060208401602084013760009082016020015292915050565b600082601f8301126114fe578081fd5b815161150c6113b08261238d565b915080825283602082850101111561152357600080fd5b6111d48160208401602086016123cf565b60006101e0808385031215611547578182fd5b61155081612346565b915050813567ffffffffffffffff8082111561156b57600080fd5b611577858386016114a0565b8352611586856020860161188f565b60208401526115988560408601611879565b60408401526115aa85606086016118a5565b60608401526115bc85608086016118a5565b60808401526115ce8560a086016118a5565b60a08401526115e08560c0860161148a565b60c08401526115f28560e0860161137c565b60e08401526101009150611608858386016118a5565b82840152610120915061161d858386016118a5565b828401526101409150611632858386016118a5565b828401526101609150611647858386016118a5565b82840152610180915061165c8583860161137c565b828401526101a091506116718583860161137c565b828401526101c09150818401358181111561168b57600080fd5b61169786828701611392565b8385015250505092915050565b60006101e08083850312156116b7578182fd5b6116c081612346565b915050815167ffffffffffffffff808211156116db57600080fd5b6116e7858386016114ee565b83526116f6856020860161189a565b60208401526117088560408601611884565b604084015261171a85606086016118b0565b606084015261172c85608086016118b0565b608084015261173e8560a086016118b0565b60a08401526117508560c08601611495565b60c08401526117628560e08601611387565b60e08401526101009150611778858386016118b0565b82840152610120915061178d858386016118b0565b8284015261014091506117a2858386016118b0565b8284015261016091506117b7858386016118b0565b8284015261018091506117cc85838601611387565b828401526101a091506117e185838601611387565b828401526101c0915081840151818111156117fb57600080fd5b61169786828701611409565b600060608284031215611818578081fd5b6118226060612346565b905081516fffffffffffffffffffffffffffffffff8116811461184457600080fd5b8152602082015161ffff8116811461185b57600080fd5b6020820152604082015161186e81612424565b604082015292915050565b803561103681612450565b805161103681612450565b803561103681612461565b805161103681612461565b803561103681612474565b805161103681612474565b6000806000604084860312156118cf578283fd5b83356118da816123ff565b9250602084013567ffffffffffffffff808211156118f6578384fd5b818601915086601f830112611909578384fd5b813581811115611917578485fd5b876020808302850101111561192a578485fd5b6020830194508093505050509250925092565b6000806040838503121561194f578182fd5b823561195a816123ff565b946020939093013593505050565b6000602080838503121561197a578182fd5b825167ffffffffffffffff811115611990578283fd5b8301601f810185136119a0578283fd5b80516119ae6113b08261236d565b81815283810190838501858402850186018910156119ca578687fd5b8694505b838510156119ec5780518352600194909401939185019185016119ce565b50979650505050505050565b600060208284031215611a09578081fd5b5051919050565b60008060408385031215611a22578182fd5b823591506020830135611a3481612424565b809150509250929050565b600060208284031215611a50578081fd5b813567ffffffffffffffff811115611a66578182fd5b611a7284828501611534565b949350505050565b600060208284031215611a8b578081fd5b815167ffffffffffffffff811115611aa1578182fd5b611a72848285016116a4565b600080600083850360a0811215611ac2578182fd5b843567ffffffffffffffff811115611ad8578283fd5b611ae487828801611534565b9450506020850135611af581612424565b925060607fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc082011215611b26578182fd5b50611b316060612346565b6040850135611b3f81612474565b8152606085013560208201526080909401356040850152509093909250565b600060208284031215611b6f578081fd5b815167ffffffffffffffff80821115611b86578283fd5b9083019060e08286031215611b99578283fd5b611ba360a0612346565b825182811115611bb1578485fd5b611bbd878286016116a4565b825250611bcd8660208501611807565b602082015260808301516040820152611be98660a0850161147b565b6060820152611bfb8660c08501611470565b608082015295945050505050565b600060208284031215611c1a578081fd5b813561103381612461565b600060208284031215611c36578081fd5b815161103381612474565b73ffffffffffffffffffffffffffffffffffffffff169052565b60601b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000169052565b6000815180845260208085019450808401835b83811015611cb6578151600f0b87529582019590820190600101611c97565b509495945050505050565b6000815180845260208085019450808401835b83811015611cb657815187529582019590820190600101611cd4565b60000b9052565b60008151808452611d0f8160208601602086016123cf565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60006101e08251818552611d5782860182611cf7565b9150506020830151611d6c6020860182611f0d565b506040830151611d7f6040860182611f04565b506060830151611d926060860182611f18565b506080830151611da56080860182611f18565b5060a0830151611db860a0860182611f18565b5060c0830151611dcb60c0860182611cf0565b5060e0830151611dde60e0860182611c41565b5061010080840151611df282870182611f18565b505061012080840151611e0782870182611f18565b505061014080840151611e1c82870182611f18565b505061016080840151611e3182870182611f18565b505061018080840151611e4682870182611c41565b50506101a080840151611e5b82870182611c41565b50506101c08084015185830382870152611e758382611c84565b9695505050505050565b6000815160e08452611e9460e0850182611d41565b905060208301516fffffffffffffffffffffffffffffffff815116602086015261ffff60208201511660408601526040810151151560608601525060408301516080850152606083015160038110611ee857fe5b60a085015260809290920151151560c090930192909252919050565b62ffffff169052565b64ffffffffff169052565b60ff169052565b60008a82527fffffffffff0000000000000000000000000000000000000000000000000000008a60d81b1660208301527fffffff00000000000000000000000000000000000000000000000000000000008960e81b1660258301527fff00000000000000000000000000000000000000000000000000000000000000808960f81b166028840152808860f81b166029840152808760f81b16602a84015285820b60f81b602b840152808560f81b16602c84015250611fe0602d830184611c5b565b506041019998505050505050505050565b60008351602061200482858389016123cf565b845191840191818601845b8281101561202e578151600f0b8552938301939083019060010161200f565b5092979650505050505050565b6000825161204d8184602087016123cf565b9190910192915050565b73ffffffffffffffffffffffffffffffffffffffff929092168252602082015260400190565b6000602080830181845280855180835260408601915060408482028701019250838701855b8281101561202e577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc08886030184526120dc858351611e7f565b945092850192908501906001016120a2565b6000602082526110336020830184611cc1565b6000604080835261211481840186611cc1565b838103602085810191909152855180835286820192820190855b81811015612169578451805173ffffffffffffffffffffffffffffffffffffffff16845284015184840152938301939185019160010161212e565b509098975050505050505050565b901515815260200190565b90815260200190565b600085825264ffffffffff808616602084015280851660408401525060806060830152611e756080830184611cf7565b6000602082526110336020830184611cf7565b60208082526022908201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f60408201527f6e2e000000000000000000000000000000000000000000000000000000000000606082015260800190565b60208082526015908201527f746f6f2066617220696e20746865206675747572650000000000000000000000604082015260600190565b6020808252601b908201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604082015260600190565b60208082526015908201527f7265676973746572206e6f7420706f737369626c650000000000000000000000604082015260600190565b600060a082526122e360a0830186611d41565b9050831515602083015260ff83511660408301526020830151606083015260408301516080830152949350505050565b6000602082526110336020830184611e7f565b64ffffffffff91909116815260200190565b60ff91909116815260200190565b60405181810167ffffffffffffffff8111828210171561236557600080fd5b604052919050565b600067ffffffffffffffff821115612383578081fd5b5060209081020190565b600067ffffffffffffffff8211156123a3578081fd5b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60005b838110156123ea5781810151838201526020016123d2565b838111156123f9576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff8116811461242157600080fd5b50565b801515811461242157600080fd5b80600f0b811461242157600080fd5b8060000b811461242157600080fd5b62ffffff8116811461242157600080fd5b64ffffffffff8116811461242157600080fd5b60ff8116811461242157600080fdfe000000000000000000fa7d000000003b53800000000a8c0000000001fa40000000001c20000000000000a26469706673582212208c43e1883484b3c4702f55c2d8498715a6ee047125d668e611354d1815f763f564736f6c63430007000033";
  /* eslint-enable quotes */
  return function(){
    return data;
  };
});
