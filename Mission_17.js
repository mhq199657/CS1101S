
var engine = new DeathCubeEngine(STEP_MODE, LAYOUT17A);
var bot1_place = engine.__deathcube[0][2][1];
var bot2_place = engine.__deathcube[0][3][2];
var bot1 = MakeAndInstallBot("b1", bot1_place, 2);
var bot2 = MakeAndInstallBot("b2", bot2_place, 3);
engine.__start();
engine.__runRounds(10);
var l = bot1.getLocation();

/*
(a)Bot 1 is more restless.
(b) The programme generate a random number from 0 to 1*inertia.
When the number's integer part is 0, it moves to a random exit.
Hence, in every tick it will move with proabability 1/inertia.
Lower the inertia, more restless the robot.
(c) Theoretical probability: (1/2)*(1/3)=(1/6).
Yes. I observed simultaneous movement for 2 times out of ten,
so the odds 1/5 is close to the theory.
*/
//-------------------------------------------------------------------------
// Customization
//  - You can personalize your character by setting the following values
//-------------------------------------------------------------------------
var shortname   = "NAME";
//-------------------------------------------------------------------------
// [Fighter]



//-------------------------------------------------------------------------

function Fighter(name,initLoc){
    Player.call(this,name,initLoc);
}
Fighter.Inherits(Player);
Fighter.prototype.__act = function(){
    Player.prototype.__act.call(this);
    function random(lst){
        var l = length(lst);
        return list_ref(lst,Math.floor(Math.random()*l));
    }
    function do1(){
    var location = this.getLocation(); //Current place I am at
    var occupants = location.getOccupants(); //Current Living Thing I am with
    var service_bots = filter(function(occ){return is_instance_of(occ,ServiceBot);},occupants); //Current bots I am with
    
    var weapons = filter(function(th){return is_instance_of(th,Weapon);},this.getPossessions());//Weapons in possession
    var neighbours = location.getNeighbours(); //Neighbours room
    var protected_rooms = filter(function(nb){return is_instance_of(nb,ProtectedRoom);},neighbours);//List of neighbouring protected room
    var non_protected_rooms = filter(function(nb){return !is_instance_of(nb,ProtectedRoom);},neighbours);
    var usable_weapons = filter(function(w){return !w.isCharging();},weapons);
    if(!is_empty_list(usable_weapons)&&!is_empty_list(service_bots)){//If weapon is ready and got service bot
        this.use(random(usable_weapons),list(random(service_bots)));//Attack
    }else{;}
    var things = location.getThings();//Things in the room
    var cards = filter(function(th){return is_instance_of(th,Keycard);},things);//Cards in the room
    //display(cards);
    this.take(cards);//Pick up any card if the service bot is dead
    var owned_card = filter(function(th){return is_instance_of(th,Keycard);},this.getPossessions());
    if(!is_empty_list(protected_rooms)&&!is_empty_list(owned_card)){//
        this.moveTo(random(protected_rooms));
    }else{
        this.moveTo(random(non_protected_rooms));
    }
    }
    if(!is_instance_of(this.getLocation(),ProtectedRoom)){
        do1.call(this);
    }else{;}    
};
var newPlayer = new Fighter(shortname);
test_task2(newPlayer);
