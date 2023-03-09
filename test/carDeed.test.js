const CarDeed = artifacts.require('CarDeed') 

contract('CarDeed', () => {
    let carDeed = null
    before(async() => {
        carDeed = await CarDeed.deployed()
    })

    it ('Should add a car details', async () => {
            await carDeed.addCarDetails('Toyota', 6000, "Fred", "James") 
            const car = await carDeed.getCarDetails(1)
            assert(car[0] === 'Toyota')
    })

    it ('Should get a car Detail', async () => {
        try {
            await carDeed.addCarDetails('Honda', 7000, "Jacky", "John") 
            const car = await carDeed.getCarDetails(2)
            assert(car[0] === 'Honda')
        }catch(e) {
            assert(e.message.includes("Car do not exist"))
            return
        }
    })

    it('Should delete a car deed', async () => {
        await carDeed.deleteCarDeed(2);
        try {
            const car = await carDeed.getCarDetails(2);
        } catch (error) {
            assert(error.message.includes("Car do not exist"))
            return
        }
        assert(false)
    });

    it ('Should get all the car deeds', async () => {
        await carDeed.addCarDetails('Benz', 8000, "Bill", "Jones") 
        const cars = await carDeed.getAllDeeds() 
        const [firstCar, secondCar] = cars
        
        assert(firstCar.brand === "Toyota")
        assert(parseInt(firstCar.price) === 6000)
        assert(firstCar.buyer === "Fred")
        assert(firstCar.seller === "James")

         assert(secondCar.brand === "Benz")
         assert(parseInt(secondCar.price) === 8000)
         assert(secondCar.buyer === "Bill")
         assert(secondCar.seller === "Jones")
    })
})