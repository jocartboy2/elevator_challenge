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
      while(this.currentFloor !== person.currentFloor) {
        if(this.currentFloor < person.currentFloor) 
          this.currentFloor++;
        else 
          this.currentFloor--;

        // Process stop if needed
        if(this.hasPickup() || this.hasDropoff()){
          this.stops++;
        }

        this.floorsTraversed++;
      }
    }
    
    // Ensure pickup happens at floor (in case already there)
    while(this.hasPickup() || this.hasDropoff()){
      this.stops++;
    }

    // Move to dropOff floor
    while(this.currentFloor !== person.dropOffFloor) {
      if(this.currentFloor < person.dropOffFloor) 
        this.currentFloor++;
      else 
        this.currentFloor--;

      // Process stop if needed
      if(this.hasPickup() || this.hasDropoff()){
        this.stops++;
      }

      this.floorsTraversed++;
    }

    // Ensure dropoff happens at floor (in case already there)
    while(this.hasPickup() || this.hasDropoff()){
      this.stops++;
    }

    // Return to lobby if required
    if(this.checkReturnToLoby()) this.returnToLoby();
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
    const index = this.riders.findIndex(rider => rider.dropOffFloor === this.currentFloor);

    if (index !== -1) {
      // Remove the rider from the elevator (in-place)
      this.riders.splice(index, 1);
      return true;
    }

    return false;
  }

  checkReturnToLoby(){ 
    return (
      this.currentFloor > 0 &&
      this.riders.length === 0 &&
      this.requests.length === 0 &&
      new Date().getHours() < 12
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
}
