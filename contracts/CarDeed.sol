// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract CarDeed {

    struct Car {
        uint id;
        string brand;
        uint price;
        string buyer;
        string seller;
    }

    modifier checkPrice(uint _price) {
        require(_price >= 5000, "Car price should be below 5000");
        _;
    }

    Car[] public cars;
    uint public nextId = 1;

    function addCarDetails(string memory _brand, uint _price, string memory _buyer, string memory _seller) public checkPrice(_price) {
        cars.push(Car(nextId,_brand, _price, _buyer, _seller));
        nextId++;
    }

    function getCarDetails(uint _id) public view returns(string memory, uint, string memory, string memory) {
        for (uint i = 0; i < cars.length; i++) {
            if (cars[i].id == _id) {
                return (cars[i].brand, cars[i].price, cars[i].buyer, cars[i].seller);
            }
            
        }
        revert("Car do not exist");
    }

    function deleteCarDeed(uint _id) public {
        for(uint i = 0; i < cars.length; i++) {
            if (cars[i].id == _id) {
                cars[i] = cars[cars.length - 1];

                cars.pop();
                return;
            }
            
        }
        revert("Car do not exist");
    }

    function getAllDeeds() public view returns(Car[] memory ) {
        return cars;
    }
}