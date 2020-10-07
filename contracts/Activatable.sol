pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Activatable is Ownable {
    event Deactivate(address indexed _sender);
    event Activate(address indexed _sender);

    bool public active = false;

    modifier whenActive() {
        require(active, "active must be true");
        _;
    }

    modifier whenNotActive() {
        require(!active, "active must be true");
        _;
    }

    function deactivate() public whenActive onlyOwner {
        active = false;
        emit Deactivate(msg.sender);
    }

    function activate() public whenNotActive onlyOwner {
        active = true;
        emit Activate(msg.sender);
    }
}
