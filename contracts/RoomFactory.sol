pragma solidity ^0.6.0;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Room.sol";


contract RoomFactory is Pausable, Ownable{
    event RoomCreated(
        address indexed _creator,
        address _room,
        uint256 _depositedValue
    );

    function pause() public whenNotPaused onlyOwner{
        _pause();
    }

    function unpause() public whenPaused onlyOwner{
        _unpause();
    }

    function createRoom() external payable whenNotPaused {
        address newRoom = address((new Room).value(msg.value)(msg.sender));
        emit RoomCreated(msg.sender, newRoom, msg.value);
    }
}
