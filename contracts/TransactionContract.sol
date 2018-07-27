pragma solidity ^0.4.23;

contract TransactionContract {

  address public _requestor;
  address public _acceptor;

  uint _value;

  // event Transfer(address indexed _from, address indexed _to, uint256 _value);

  constructor() public{
    _requestor = msg.sender;
    // _value = msg.value;
  }

  modifier onlyRequestor(){
    require(msg.sender == _requestor,"Only requestor can call this.");
    _;
  }

  modifier onlyAcceptor(){
    require(msg.sender == _acceptor,"Only acceptor can call this.");
    _;
  }

  function deposit() public payable{
    _value = msg.value;
  }

  function transferETH(address _to) payable public returns(bool){
    require(_to != msg.sender);
    _to.transfer(msg.value);
    return true;
  }

  function getRequestor() public returns(address){
    return _requestor;
  }

  function getAcceptor() public returns(address){
    return _acceptor;
  }

  function getContractBalance() public returns(uint){
    return _value;
  }

  function setAcceptor(address acceptor) public {
    _acceptor = acceptor;
  }

  /// 买家确认购买。
    /// 交易必须包含 `2 * value` 个以太币。
    /// 以太币会被锁定，直到 confirmReceived 被调用。
    function confirmPurchase()
        public onlyRequestor payable
    {
      // _requestor = msg.sender;
      _value = msg.value;
    }

    /// 确认你（买家）已经收到商品。
    /// 这会释放被锁定的以太币。
    function confirmReceived()
        public onlyRequestor
    {

        // 注意: 这实际上允许买方和卖方阻止退款 - 应该使用取回模式。
        // _requestor.transfer(_value);
        _acceptor.transfer(address(this).balance);
    }

}