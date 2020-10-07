pragma solidity ^0.6.0;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "./Activatable.sol";

contract Room is Pausable, Activatable {
    mapping(uint256 => bool) public rewardSent;

    event Deposited(address indexed _depositor, uint256 _depositedValue);

    event RewardSent(address indexed _dest, uint256 _reward, uint256 _id);

    event RefundedToOwner(
        address indexed _dest,
        uint256 _refundedBalance
    );

    address payable owners;

    constructor(address payable _creator) public payable{
        owners = _creator;
    }

    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "value must be greater than to 0");
        emit Deposited(msg.sender, msg.value);
    }

    function sendReward(
        uint256 _reward,
        address payable _dest,
        uint256 _id
    ) external onlyOwner {
        require(!rewardSent[_id], "rewardSent must be false");
        require(_reward > 0, "reward must be greater than to 0");
        require(
            address(this).balance >= _reward,
            "balance must be greater than to reward"
        );
        require(_dest != owners, "dest must be non-owner");

        rewardSent[_id] = true;
        _dest.transfer(_reward);
        emit RewardSent(_dest, _reward, _id);
    }

    function refundToOwner() external whenNotActive onlyOwner {
        require(address(this).balance > 0, "balance must be greater than to 0");

        uint256 refundedBalance = address(this).balance;
        owners.transfer(refundedBalance);
        emit RefundedToOwner(msg.sender, refundedBalance);
    }
}
