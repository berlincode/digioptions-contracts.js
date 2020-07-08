
(function (global, factory) {
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function () { return factory(); } );

  } else if ( typeof module !== 'undefined' && module.exports ) {
    // Node and other environments that support module.exports
    module.exports = factory();

  } else {
    // Browser
    global.digioptions_meta_bin = factory();
  }
})(this, function(){

  /* eslint-disable quotes */
  var data = "0x608060405234801561001057600080fd5b50610d48806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063da571e0414610030575b600080fd5b61004361003e36600461080f565b610045565b005b60005b8251811015610118576100596101e0565b83828151811061006557fe5b60200260200101519050806000015173ffffffffffffffffffffffffffffffffffffffff16632556d8d08260200151836040015184606001516040518463ffffffff1660e01b81526004016100bc93929190610b12565b602060405180830381600087803b1580156100d657600080fd5b505af11580156100ea573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061010e9190610947565b5050600101610048565b5060005b81518110156101db5761012d610229565b82828151811061013957fe5b60200260200101519050806000015173ffffffffffffffffffffffffffffffffffffffff1663a1aa12b282602001518360400151846060015185608001518660a001516040518663ffffffff1660e01b815260040161019c959493929190610a63565b600060405180830381600087803b1580156101b657600080fd5b505af11580156101ca573d6000803e3d6000fd5b50506001909301925061011c915050565b505050565b6040518060800160405280600073ffffffffffffffffffffffffffffffffffffffff168152602001610210610263565b8152600060208201526040016102246102e1565b905290565b6040805160c081018252600080825260208201529081016102486102e1565b81526020016000815260200160608152602001606081525090565b604080516101e08101825260608082526000602083018190529282018390528082018390526080820183905260a0820183905260c0820183905260e08201839052610100820183905261012082018390526101408201839052610160820183905261018082018390526101a08201929092526101c081019190915290565b604080516060810182526000808252602082018190529181019190915290565b803561030c81610ced565b92915050565b600082601f830112610322578081fd5b813561033561033082610ccd565b610ca6565b81815291506020808301908481018184028601820187101561035657600080fd5b60005b8481101561037e57813561036c81610ced565b84529282019290820190600101610359565b505050505092915050565b600082601f830112610399578081fd5b81356103a761033082610ccd565b8181529150602080830190848101818402860182018710156103c857600080fd5b60005b8481101561037e578135845292820192908201906001016103cb565b600082601f8301126103f7578081fd5b813561040561033082610ccd565b81815291506020808301908481018184028601820187101561042657600080fd5b6000805b8581101561045457823580600f0b8114610442578283fd5b8552938301939183019160010161042a565b50505050505092915050565b600082601f830112610470578081fd5b813561047e61033082610ccd565b818152915060208083019084810160005b8481101561037e5781358701610100807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0838c030112156104cf57600080fd5b60c06104da81610ca6565b6104e68c888601610301565b81526040808501358883015260606105008e828801610793565b828401528386013581840152505060e0840135915067ffffffffffffffff8083111561052b57600080fd5b6105398d8985880101610312565b60808301528385013592508083111561055157600080fd5b506105608c8884870101610389565b60a08201528752505050928201929082019060010161048f565b8035801515811461030c57600080fd5b8035600081900b811461030c57600080fd5b600082601f8301126105ac578081fd5b813567ffffffffffffffff8111156105c2578182fd5b6105f360207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601610ca6565b915080825283602082850101111561060a57600080fd5b8060208401602084013760009082016020015292915050565b60006101e0808385031215610636578182fd5b61063f81610ca6565b915050813567ffffffffffffffff8082111561065a57600080fd5b6106668583860161059c565b835261067585602086016107e9565b602084015261068785604086016107d6565b604084015261069985606086016107fe565b60608401526106ab85608086016107fe565b60808401526106bd8560a086016107fe565b60a08401526106cf8560c0860161058a565b60c08401526106e18560e08601610301565b60e084015261010091506106f7858386016107fe565b82840152610120915061070c858386016107fe565b828401526101409150610721858386016107fe565b828401526101609150610736858386016107fe565b82840152610180915061074b85838601610301565b828401526101a0915061076085838601610301565b828401526101c09150818401358181111561077a57600080fd5b610786868287016103e7565b8385015250505092915050565b6000606082840312156107a4578081fd5b6107ae6060610ca6565b90506107ba83836107fe565b8152602082013560208201526040820135604082015292915050565b803562ffffff8116811461030c57600080fd5b803564ffffffffff8116811461030c57600080fd5b803560ff8116811461030c57600080fd5b60008060408385031215610821578182fd5b823567ffffffffffffffff80821115610838578384fd5b81850186601f820112610849578485fd5b8035925061085961033084610ccd565b83815260208082019190838101885b87811015610918578135860160c07fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0828f030112156108a5578a8bfd5b6108af6080610ca6565b6108bb8e868401610301565b81526040820135898111156108ce578c8dfd5b6108dc8f8783860101610623565b86830152506108ee8e6060840161057a565b60408201526109008e60808401610793565b60608201528652509382019390820190600101610868565b50919750880135945050505080821115610930578283fd5b5061093d85828601610460565b9150509250929050565b600060208284031215610958578081fd5b5051919050565b73ffffffffffffffffffffffffffffffffffffffff169052565b6000815180845260208085019450808401835b838110156109ab578151600f0b8752958201959082019060010161098c565b509495945050505050565b15159052565b60000b9052565b60008151808452815b818110156109e8576020818501810151868301820152016109cc565b818111156109f95782602083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b805160ff16825260208082015190830152604090810151910152565b62ffffff169052565b64ffffffffff169052565b60ff169052565b600060e082018783526020610a7a81850189610a2c565b6080840187905260e060a085015285519182905280860191610100850190845b81811015610acc57845173ffffffffffffffffffffffffffffffffffffffff1683529383019391830191600101610a9a565b505084810360c08601528551808252908201925081860190845b81811015610b0257825185529383019391830191600101610ae6565b50929a9950505050505050505050565b600060a0825284516101e08060a0850152610b316102808501836109c3565b60208801519250610b4560c0860184610a51565b60408801519250610b5960e0860184610a48565b60608801519250610100610b6f81870185610a5c565b60808901519350610120610b8581880186610a5c565b60a08a01519450610140610b9b81890187610a5c565b60c08b01519550610160610bb1818a01886109bc565b60e08c01519650610180610bc7818b018961095f565b938c015196506101a093610bdd8a860189610a5c565b928c015196506101c092610bf38a850189610a5c565b828d01519750610c05878b0189610a5c565b818d01519750610c196102008b0189610a5c565b8c01519650610c2f91505061022088018661095f565b818a01519450610c4361024088018661095f565b8901518683037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60016102608801529350610c7f90508184610979565b9350505050610c9160208301856109b6565b610c9e6040830184610a2c565b949350505050565b60405181810167ffffffffffffffff81118282101715610cc557600080fd5b604052919050565b600067ffffffffffffffff821115610ce3578081fd5b5060209081020190565b73ffffffffffffffffffffffffffffffffffffffff81168114610d0f57600080fd5b5056fea2646970667358221220a15d5f037f554ae8a31609df84fa668c5a0fe2d31f19979934550aa2c2b0061f64736f6c634300060b0033";
  /* eslint-enable quotes */
  return function(){
    return data;
  };
});
