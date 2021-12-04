
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
  var data = "0x608060405260006006553480156200001657600080fd5b506040516200285038038062002850833981016040819052620000399162000071565b60018054336001600160a01b03199182161790915543600055600280549091166001600160a01b0392909216919091179055620000a3565b6000602082840312156200008457600080fd5b81516001600160a01b03811681146200009c57600080fd5b9392505050565b61279d80620000b36000396000f3fe608060405234801561001057600080fd5b50600436106100be5760003560e01c8063711c2b94116100765780638677e7b91161005b5780638677e7b914610181578063b3889bb314610194578063c70be146146101b757600080fd5b8063711c2b94146101595780637cc1f8671461016c57600080fd5b80632556d8d0116100a75780632556d8d01461010357806352d026881461012457806365e47b8c1461014457600080fd5b8063095200ce146100c35780630f8f8244146100ed575b600080fd5b6100d66100d136600461151c565b6101d7565b60405160ff90911681526020015b60405180910390f35b6100f5610286565b6040516100e4929190611574565b610116610111366004611a03565b6104d4565b6040519081526020016100e4565b610137610132366004611ab5565b61060a565b6040516100e49190611ded565b610157610152366004611e6d565b610789565b005b610157610167366004611e99565b610984565b610174610a69565b6040516100e49190611ec9565b61015761018f366004611e99565b610bf3565b6101a76101a2366004611edc565b610d55565b60405190151581526020016100e4565b6101ca6101c5366004611e6d565b610e6f565b6040516100e49190611f19565b6002546040517f095200ce00000000000000000000000000000000000000000000000000000000815264ffffffffff8316600482015260009173ffffffffffffffffffffffffffffffffffffffff169063095200ce9060240160206040518083038186803b15801561024857600080fd5b505afa15801561025c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102809190611f37565b92915050565b60408051600780825261010082019092526060918291906020820160e08036833701905050915062350000826000815181106102c4576102c4611f54565b60209081029190910101526001805473ffffffffffffffffffffffffffffffffffffffff16908390815181106102fc576102fc611f54565b602090810291909101015260648260028151811061031c5761031c611f54565b6020908102919091010152600a8260038151811061033c5761033c611f54565b6020908102919091010152600a8260048151811061035c5761035c611f54565b6020908102919091010152600582818151811061037b5761037b611f54565b60209081029190910101526102588260068151811061039c5761039c611f54565b60209081029190910101526006548067ffffffffffffffff8111156103c3576103c36115eb565b60405190808252806020026020018201604052801561040857816020015b60408051808201909152600080825260208201528152602001906001900390816103e15790505b5060045490925073ffffffffffffffffffffffffffffffffffffffff1660005b828110156104cd5760408051808201825273ffffffffffffffffffffffffffffffffffffffff84168082526000908152600560209081529290205491810191909152845185908390811061047e5761047e611f54565b60209081029190910181019190915273ffffffffffffffffffffffffffffffffffffffff92831660009081526005909152604090206001015490911690806104c581611fb2565b915050610428565b5050509091565b60006104df84610d55565b61054a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f7265676973746572206e6f7420706f737369626c65000000000000000000000060448201526064015b60405180910390fd5b6002546040517f2556d8d000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911690632556d8d0906105a490879087908790600401611feb565b602060405180830381600087803b1580156105be57600080fd5b505af11580156105d2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105f6919061202e565b9050610603848285611010565b9392505050565b60608167ffffffffffffffff811115610625576106256115eb565b60405190808252806020026020018201604052801561070b57816020015b6040805161028081018252606060a08201818152600060c0840181905260e08401819052610100840181905261012084018190526101408401819052610160840181905261018084018190526101a084018190526101c084018190526101e084018190526102008401819052610220840181905261024084018190526102608401839052908352835180830185528181526020808201839052818601839052840152928201839052810182905260808101919091528152602001906001900390816106435790505b50905060005b8281101561078157610751856007600087878681811061073357610733611f54565b90506020020135815260200190815260200160002060000154610e6f565b82828151811061076357610763611f54565b6020026020010181905250808061077990611fb2565b915050610711565b509392505050565b60015473ffffffffffffffffffffffffffffffffffffffff163314610830576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f60448201527f6e2e0000000000000000000000000000000000000000000000000000000000006064820152608401610541565b73ffffffffffffffffffffffffffffffffffffffff821660009081526005602052604090206001015474010000000000000000000000000000000000000000900460ff16156108a35773ffffffffffffffffffffffffffffffffffffffff91909116600090815260056020526040902055565b600480546040805160608101825284815273ffffffffffffffffffffffffffffffffffffffff928316602080830182815260018486018181528a8816600081815260059095529690932094518555905193810180549251151574010000000000000000000000000000000000000000027fffffffffffffffffffffff00000000000000000000000000000000000000000090931694909616939093171790935583547fffffffffffffffffffffffff000000000000000000000000000000000000000016909117909255600654909161097c9190612047565b600655505050565b60015473ffffffffffffffffffffffffffffffffffffffff163314610a2b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f60448201527f6e2e0000000000000000000000000000000000000000000000000000000000006064820152608401610541565b60009182526008602052604090912080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055565b60606000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637cc1f8676040518163ffffffff1660e01b8152600401600060405180830381600087803b158015610ad757600080fd5b505af1158015610aeb573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610b31919081019061205f565b9050600281600081518110610b4857610b48611f54565b60209081029190910101526235000081600181518110610b6a57610b6a611f54565b602090810291909101015260025473ffffffffffffffffffffffffffffffffffffffff1681600381518110610ba157610ba1611f54565b602090810291909101015260005481600481518110610bc257610bc2611f54565b602090810291909101015260035481600881518110610be357610be3611f54565b6020908102919091010152919050565b6002546040517fee1f69eb0000000000000000000000000000000000000000000000000000000081526004810184905260009173ffffffffffffffffffffffffffffffffffffffff169063ee1f69eb9060240160006040518083038186803b158015610c5e57600080fd5b505afa158015610c72573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610cb89190810190612319565b9050806020015164ffffffffff1660001415610cd657610cd661234e565b610cdf81610d55565b610d45576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f7265676973746572206e6f7420706f737369626c6500000000000000000000006044820152606401610541565b610d50818484611010565b505050565b60015460009073ffffffffffffffffffffffffffffffffffffffff16331415610d8057506001919050565b60e082015173ffffffffffffffffffffffffffffffffffffffff16600090815260056020526040902054610db657506000919050565b6064610ded83610160015160ff16610de785610140015160ff1686610120015160ff166112cc90919063ffffffff16565b906112cc565b11158015610e045750600a82610120015160ff1610155b8015610e195750600a82610140015160ff1610155b8015610e2e5750600582610160015160ff1610155b8015610e5a575060015461018083015173ffffffffffffffffffffffffffffffffffffffff9081169116145b15610e6757506001919050565b506000919050565b6040805161028081018252606060a08201818152600060c0840181905260e08401819052610100840181905261012084018190526101408401819052610160840181905261018084018190526101a084018190526101c084018190526101e084018190526102008401819052610220840181905261024084018190526102608401839052908352835180830185528181526020808201839052818601839052840152928201839052810182905260808101919091526002546040517fc70be14600000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8581166004830152602482018590529091169063c70be1469060440160006040518083038186803b158015610f9657600080fd5b505afa158015610faa573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610ff09190810190612397565b6000928352600860205260409092205460ff161515608083015250919050565b600061101b846112d8565b60008181526007602052604090208054919250906112555760015460009073ffffffffffffffffffffffffffffffffffffffff1633146110665761106161025842612047565b611069565b60005b6040805160608101825287815261012089015160ff908116602080840191825264ffffffffff86811685870190815260008b8152600790935295909120935184559051600193840180549551919093167fffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000090951694909417931661010002929092179091555490915073ffffffffffffffffffffffffffffffffffffffff1633141561114857600085815260086020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00168515151790555b60008660800151600861115b91906124cc565b60ff1687610100015160ff166001901b901b90508060035416600014156111855760038054821790555b6060870151600090600416156111a157506101008701516111b1565b6111ae88602001516113bc565b90505b876080015160ff1688610100015160ff168260ff1660086111d48560ff166114a7565b8c6020015164ffffffffff166111ea91906124f5565b65ffffffffffff16901b6111fe9190612541565b65ffffffffffff167f3d4b4c0dc42d96da48d02a2693392bfa4fdbfb0bec570e48f5186f9f75fe8ecb888c60200151888e60000151604051611243949392919061256b565b60405180910390a45050505050505050565b600181015461012086015160ff918216911611801561128357506001810154610100900464ffffffffff1642105b156112c5578381556101208501516001820180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660ff9092169190911790555b5050505050565b60006106038284612047565b6000606082600001516040516020016112f1919061259b565b6040516020818303038152906040528051906020012083602001518460400151856060015186608001518760a001518860c001518961010001518a60e00151604051602001611348999897969594939291906125b7565b604080518083037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe001815291905260608401519091506001166113ae576101c083015160405161139c9183916020016126ab565b60405160208183030381529060405290505b805160209091012092915050565b600080806113d164ffffffffff8516426114ea565b90506303c267008110611440576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f746f6f2066617220696e207468652066757475726500000000000000000000006044820152606401610541565b623b53808111156114555760015b91506114a0565b620a8c0081111561146757600361144e565b6201fa4081111561147957600461144e565b611c2081111561148a57600561144e565b61038481111561149b57600661144e565b600791505b5092915050565b6000806040518060600160405280602a815260200161273e602a91399050600060066114d4856001612047565b6114de91906126e9565b91909101519392505050565b60006106038284612726565b64ffffffffff8116811461150957600080fd5b50565b8035611517816114f6565b919050565b60006020828403121561152e57600080fd5b8135610603816114f6565b600081518084526020808501945080840160005b838110156115695781518752958201959082019060010161154d565b509495945050505050565b6000604080835261158781840186611539565b83810360208581019190915285518083528682019282019060005b818110156115dd578451805173ffffffffffffffffffffffffffffffffffffffff1684528401518484015293830193918501916001016115a2565b509098975050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516101e0810167ffffffffffffffff8111828210171561163e5761163e6115eb565b60405290565b6040516060810167ffffffffffffffff8111828210171561163e5761163e6115eb565b60405160a0810167ffffffffffffffff8111828210171561163e5761163e6115eb565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff811182821017156116d1576116d16115eb565b604052919050565b600067ffffffffffffffff8211156116f3576116f36115eb565b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b600082601f83011261173057600080fd5b813561174361173e826116d9565b61168a565b81815284602083860101111561175857600080fd5b816020850160208301376000918101602001919091529392505050565b62ffffff8116811461150957600080fd5b803561151781611775565b60ff8116811461150957600080fd5b803561151781611791565b8060000b811461150957600080fd5b8035611517816117ab565b73ffffffffffffffffffffffffffffffffffffffff8116811461150957600080fd5b8035611517816117c5565b600067ffffffffffffffff82111561180c5761180c6115eb565b5060051b60200190565b80600f0b811461150957600080fd5b600082601f83011261183657600080fd5b8135602061184661173e836117f2565b82815260059290921b8401810191818101908684111561186557600080fd5b8286015b8481101561188957803561187c81611816565b8352918301918301611869565b509695505050505050565b60006101e082840312156118a757600080fd5b6118af61161a565b9050813567ffffffffffffffff808211156118c957600080fd5b6118d58583860161171f565b83526118e36020850161150c565b60208401526118f460408501611786565b6040840152611905606085016117a0565b6060840152611916608085016117a0565b608084015261192760a085016117a0565b60a084015261193860c085016117ba565b60c084015261194960e085016117e7565b60e0840152610100915061195e8285016117a0565b8284015261012091506119728285016117a0565b8284015261014091506119868285016117a0565b82840152610160915061199a8285016117a0565b8284015261018091506119ae8285016117e7565b828401526101a091506119c28285016117e7565b828401526101c0915081840135818111156119dc57600080fd5b6119e886828701611825565b8385015250505092915050565b801515811461150957600080fd5b600080600083850360a0811215611a1957600080fd5b843567ffffffffffffffff811115611a3057600080fd5b611a3c87828801611894565b9450506020850135611a4d816119f5565b925060607fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc082011215611a7f57600080fd5b50611a88611644565b6040850135611a9681611791565b8152606085013560208201526080909401356040850152509093909250565b600080600060408486031215611aca57600080fd5b8335611ad5816117c5565b9250602084013567ffffffffffffffff80821115611af257600080fd5b818601915086601f830112611b0657600080fd5b813581811115611b1557600080fd5b8760208260051b8501011115611b2a57600080fd5b6020830194508093505050509250925092565b60005b83811015611b58578181015183820152602001611b40565b83811115611b67576000848401525b50505050565b60008151808452611b85816020860160208601611b3d565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b600081518084526020808501945080840160005b83811015611569578151600f0b87529582019590820190600101611bcb565b60006101e08251818552611c0082860182611b6d565b9150506020830151611c1b602086018264ffffffffff169052565b506040830151611c32604086018262ffffff169052565b506060830151611c47606086018260ff169052565b506080830151611c5c608086018260ff169052565b5060a0830151611c7160a086018260ff169052565b5060c0830151611c8660c086018260000b9052565b5060e0830151611cae60e086018273ffffffffffffffffffffffffffffffffffffffff169052565b506101008381015160ff90811691860191909152610120808501518216908601526101408085015182169086015261016080850151909116908501526101808084015173ffffffffffffffffffffffffffffffffffffffff908116918601919091526101a080850151909116908501526101c08084015185830382870152611d368382611bb7565b9695505050505050565b6000815160e08452611d5560e0850182611bea565b905060208301516fffffffffffffffffffffffffffffffff815116602086015261ffff60208201511660408601526040810151151560608601525060408301516080850152606083015160038110611dd6577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60a0850152608083015180151560c0860152610781565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b82811015611e60577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0888603018452611e4e858351611d40565b94509285019290850190600101611e14565b5092979650505050505050565b60008060408385031215611e8057600080fd5b8235611e8b816117c5565b946020939093013593505050565b60008060408385031215611eac57600080fd5b823591506020830135611ebe816119f5565b809150509250929050565b6020815260006106036020830184611539565b600060208284031215611eee57600080fd5b813567ffffffffffffffff811115611f0557600080fd5b611f1184828501611894565b949350505050565b6020815260006106036020830184611d40565b805161151781611791565b600060208284031215611f4957600080fd5b815161060381611791565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611fe457611fe4611f83565b5060010190565b60a081526000611ffe60a0830186611bea565b9050831515602083015260ff83511660408301526020830151606083015260408301516080830152949350505050565b60006020828403121561204057600080fd5b5051919050565b6000821982111561205a5761205a611f83565b500190565b6000602080838503121561207257600080fd5b825167ffffffffffffffff81111561208957600080fd5b8301601f8101851361209a57600080fd5b80516120a861173e826117f2565b81815260059190911b820183019083810190878311156120c757600080fd5b928401925b828410156120e5578351825292840192908401906120cc565b979650505050505050565b600082601f83011261210157600080fd5b815161210f61173e826116d9565b81815284602083860101111561212457600080fd5b611f11826020830160208701611b3d565b8051611517816114f6565b805161151781611775565b8051611517816117ab565b8051611517816117c5565b600082601f83011261217257600080fd5b8151602061218261173e836117f2565b82815260059290921b840181019181810190868411156121a157600080fd5b8286015b848110156118895780516121b881611816565b83529183019183016121a5565b60006101e082840312156121d857600080fd5b6121e061161a565b9050815167ffffffffffffffff808211156121fa57600080fd5b612206858386016120f0565b835261221460208501612135565b602084015261222560408501612140565b604084015261223660608501611f2c565b606084015261224760808501611f2c565b608084015261225860a08501611f2c565b60a084015261226960c0850161214b565b60c084015261227a60e08501612156565b60e0840152610100915061228f828501611f2c565b8284015261012091506122a3828501611f2c565b8284015261014091506122b7828501611f2c565b8284015261016091506122cb828501611f2c565b8284015261018091506122df828501612156565b828401526101a091506122f3828501612156565b828401526101c09150818401518181111561230d57600080fd5b6119e886828701612161565b60006020828403121561232b57600080fd5b815167ffffffffffffffff81111561234257600080fd5b611f11848285016121c5565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b8051611517816119f5565b80516003811061151757600080fd5b6000602082840312156123a957600080fd5b815167ffffffffffffffff808211156123c157600080fd5b9083019081850360e08112156123d657600080fd5b6123de611667565b8351838111156123ed57600080fd5b6123f9888287016121c5565b82525060607fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08301121561242c57600080fd5b612434611644565b9250602084015191506fffffffffffffffffffffffffffffffff8216821461245b57600080fd5b90825260408301519061ffff8216821461247457600080fd5b8160208401526060840151915061248a826119f5565b816040840152826020820152608084015160408201526124ac60a08501612388565b60608201526124bd60c0850161237d565b60808201529695505050505050565b600060ff821660ff84168160ff04811182151516156124ed576124ed611f83565b029392505050565b600065ffffffffffff80841680612535577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b92169190910492915050565b600065ffffffffffff80831681851680830382111561256257612562611f83565b01949350505050565b848152600064ffffffffff808616602084015280851660408401525060806060830152611d366080830184611b6d565b600082516125ad818460208701611b3d565b9190910192915050565b8981527fffffffffff0000000000000000000000000000000000000000000000000000008960d81b1660208201527fffffff00000000000000000000000000000000000000000000000000000000008860e81b16602582015260007fff00000000000000000000000000000000000000000000000000000000000000808960f81b166028840152808860f81b166029840152808760f81b16602a8401528560f81b602b840152808560f81b16602c8401525061269a602d83018460601b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000169052565b506041019998505050505050505050565b6000835160206126be8285838901611b3d565b84519184019181860160005b82811015611e60578151600f0b855293830193908301906001016126ca565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561272157612721611f83565b500290565b60008282101561273857612738611f83565b50039056fe000000000000000000fa7d000000003b53800000000a8c0000000001fa40000000001c20000000000000a2646970667358221220aa739223cedd21c025b102fe220a91ebe3e0e3cc743d9fde02c05271a9f6322564736f6c63430008090033";
  /* eslint-enable quotes */
  return function(){
    return data;
  };
});
