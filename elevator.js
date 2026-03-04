export default class Elevator {
  constructor() {
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.requests = []
    this.riders= []
  }

  dispatch(){
    this.requests.forEach(request => {
      if(this.riders.length || this.requests.length){
        this.goToFloor(request)
      }
    })
  }

  goToFloor(person){  
    // Move to pickup floor 
    const alreadyPickedUp = this.riders.includes(person);

    if(!alreadyPickedUp) {
      this.elevatorDispatch(person.currentFloor);
    }
    
    // Move to dropOff floor
    this.elevatorDispatch(person.dropOffFloor);
     
    if (this.checkReturnToLoby()) this.returnToLoby(); 
  }

  moveUp(){
    this.currentFloor++
    this.floorsTraversed++
    if(this.hasStop()){
      this.stops++
    }    
  }

  moveDown(){
    if(this.currentFloor > 0){      
      this.currentFloor--
      this.floorsTraversed++
      if(this.hasStop()){
        this.stops++
      }
    }
  }

  hasStop(){
    const pickup = this.hasPickup();
    const dropoff = this.hasDropoff();
    return pickup || dropoff;
  }

  hasPickup(){  
    // Find the first rider on the current floor
    const rider = this.requests.find(r => r.currentFloor === this.currentFloor);

    if (rider) {
      // Remove rider from requests and add to elevator
      this.requests = this.requests.filter(r => r !== rider);
      this.riders.push(rider);
      return true;
    }

    return false;
  }

  hasDropoff() {
    // Find the first rider whose dropOffFloor matches the current floor
    const rider = this.riders.find(r => r.dropOffFloor === this.currentFloor);

    if (rider) {
      // Remove rider from elevator
      this.riders = this.riders.filter(r => r !== rider);
      return true;
    }

    return false;
  }

  checkReturnToLoby(){ 
    return (
        this.currentFloor === 0 || 
        (
          this.currentFloor > 0 &&
          this.riders.length === 0 &&
          this.requests.length === 0 &&
          new Date().getHours() < 12
        )
    );
  }

  returnToLoby(){
    while(this.currentFloor > 0){
      this.moveDown()
    }
  }

  reset(){
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.riders = []
  }

  elevatorDispatch(targetFloor) {
      while (this.currentFloor !== targetFloor) {
        if (this.currentFloor < targetFloor)
          this.currentFloor++;
        else
          this.currentFloor--;

        // Process stop if needed
        if (this.hasPickup() || this.hasDropoff()) {
          this.stops++;
        }

        this.floorsTraversed++;
      }
    }
}
