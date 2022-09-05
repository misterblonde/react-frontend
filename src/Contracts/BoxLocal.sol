// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BoxLocal is Ownable {
    address public myGlobalGov;
    address public governorHelper;
    address public myLocalGov;

    uint256 private value;

    mapping(address => bool) public adminMembers;

    event Log(uint256 gas);

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    constructor(address myGovernor, address myGovernorHelper) public payable {
        myGlobalGov = myGovernor;
        governorHelper = myGovernorHelper;
    }

    modifier onlyGovernor() {
         require((msg.sender == myGlobalGov) || (msg.sender == myLocalGov) || (msg.sender == owner()), "Only DAO can update.");
        _;
    }
    

    function setLocalGov(address localGov) public onlyGovernor {
        myLocalGov = localGov;
    }

    // Stores a new value in the contract
    function store(uint256 newValue) public onlyGovernor onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }

  // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }

    function isAdmin(address account) public view returns (bool) {
        return adminMembers[account];
    }
//daoOnly onlyOwner
    function setAdmin(address account) public onlyGovernor {
        adminMembers[account] = true;
    }


//daoOnly onlyOwner
    function removeAdmin(address account) public  {
        adminMembers[account] = false;
    }

    // function closeBox() public onlyOwner {
    //     // return remaining funds
    //     payable(myGlobalGov).transfer(address(this).balance);
    //     // release pausable nfts
    // }

    function withdraw(address _receiver) public onlyOwner {
        address payable receiver = payable(_receiver);
        receiver.transfer(address(this).balance);
    }
    // Fallback function must be external.
    fallback() external payable {
        emit Log(gasleft());
    }
}


