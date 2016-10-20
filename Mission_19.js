//Auxilliary function for list processing
function save_footsteps(lst){
    //GABCBADEDF->GADF
    if(is_empty_list(lst)){
        return [];
    }else{
    var h = head(lst);
    var t = member(h,tail(lst));
    if(is_empty_list(t)){
        return pair(h,save_footsteps(tail(lst)));
    }else{
        return save_footsteps(t);
    }
    }
}
function remove_duplicate(lst){
    if(is_empty_list(lst)){
        return [];
    }else{
        if(is_empty_list(member(head(lst),tail(lst)))){
            return pair(head(lst),remove_duplicate(tail(lst)));
        }else{
            return remove_duplicate(tail(lst));
        }
    }
}
function subtract(lstA,lstB){//B-A
    function helper(remaining_lstA,intermediate){
        if(is_empty_list(remaining_lstA)){
            return intermediate;
        }else if(is_empty_list(intermediate)){
            return intermediate;
        }else{
            var h = head(remaining_lstA);
            return helper(tail(remaining_lstA),remove_all(h,intermediate));
        }
    }
    return helper(lstA,lstB);
}
function Node(current_location,neighbours,previous){
    this.c = current_location;
    this.n = neighbours;
    this.p = previous;
}
Node.prototype.get_previous = function(){
    return this.p;
};
Node.prototype.get_neighbours = function(){
    return this.n;
};
Node.prototype.get_location = function(){
    return this.c;
};

Node.prototype.set_previous = function(n){
    this.p = n;
} ;

function Path(){
    this.pointer = undefined;
}
Path.prototype.get_current_location = function(){
    return this.pointer;
};
Path.prototype.add_node = function(n){
    if(this.pointer===undefined){
        n.set_previous(undefined);
        this.pointer = n;
    }else{
        n.set_previous(this.pointer);
        this.pointer = n;
    }
};
Path.prototype.get_unvisited = function(visited){
    function check_neighbour(n){
        var nb = n.get_neighbours();
        function helper(intermediate,remaining){
            if(!equal(intermediate,undefined)){
                return intermediate;
            }else if(is_empty_list(remaining)){
                return intermediate;
            }else{
                var h = head(remaining);
                return helper(is_empty_list(member(h,visited))?h:intermediate,tail(remaining));
            }
        }
        return helper(undefined, nb);//will return the univisited if found or undefined(which should never happen, written down only as precaution)
    }
    function helper(current_node){
            var unvisited = check_neighbour(current_node);//either undefined or found
            if(!equal(unvisited,undefined)){//found
                return pair(current_node,unvisited);//Should be a Room
            }else{
                return helper(current_node.get_previous());
            }
    }
    if(length(visited)>62){//No unvisited room except possibly the generator room
        return random(this.get_current_location().get_neighbours());
    }else{//must be some unvisited room
        return helper(this.pointer);//return a pair (closest node it neighbours, Room)
    }
};
Path.prototype.get_unvisited_unprotected = function(visited){
    function check_neighbour(n){
        var nb = n.get_neighbours();
        var unprotected_nb = filter(function(nb){return !is_instance_of(nb,ProtectedRoom);},nb);
        function helper(intermediate,remaining){
            if(!equal(intermediate,undefined)){
                return intermediate;
            }else if(is_empty_list(remaining)){
                return intermediate;
            }else{
                var h = head(remaining);
                return helper(is_empty_list(member(h,visited))?h:intermediate,tail(remaining));
            }
        }
        return helper(undefined, unprotected_nb);//will return the univisited if found or undefined(which should never happen, written down only as precaution)
    }
    function helper(current_node){
            var unvisited = check_neighbour(current_node);//either undefined or found
            if(!equal(unvisited,undefined)){//found
                return pair(current_node,unvisited);//Should be a Room
            }else{
                return helper(current_node.get_previous());
            }
    }
    if(length(visited)>62){//No unvisited room except possibly the generator room
    //Buggy
        return random(this.pointer.get_current_location().get_neighbours());
    }else{//must be some unvisited room
        return helper(this.pointer);//return a pair (closest node it neighbours, Room)
    }
};
/*
var c = list(456);
var d = list(123);
var a = list(d);
var b = list(c);
var n1 = new Node(1,2,3);
var n2 = new Node(4,a,6);
var n3 = new Node(7,b,9);
var p = new Path();
p.add_node(n1);
p.add_node(n2);
p.add_node(n3);
var visited = list(c);
var t =p.get_unvisited(visited);
*/



Path.prototype.get_path = function(r){//Should return a path(in terms of a list of rooms) from current location to the Room r
    function helper(n){
        var nb = n.get_neighbours();
        if(is_empty_list(member(r,nb))){//Not in this node
            return append(list(n.get_location()),helper(n.get_previous()));
        }else{
            var t = head(member(r,nb));
            return list(n.get_location(),t);
        }
    }
    return tail(helper(this.pointer));
};

Path.prototype.within_range = function(range){
    var origin = this.pointer;
    var here = origin.get_location();
    function op(rm,b){
            var nb = is_empty_list(rm)? [] :rm.getNeighbours();//list of neighbours
            return append(nb,b);
    }
    function helper(list_of_rooms,remaining_range){
        if(remaining_range === 0){
            return list_of_rooms;
        }else{
            var list_of_neighbours = accumulate(op,[],list_of_rooms);
            return append(list_of_rooms,helper(list_of_neighbours,remaining_range-1));
        }
    }
    return remove_duplicate(helper(list(here),range));
};

var shortname   = "NAME";

function Fighter(name,initLoc){
    Player.call(this,name,initLoc);
    this.visited = [];// M18 T1: created visited property and accessor and mutator 
    this.path = new Path();
    Fighter.prototype.set_visited = function(rm){//No repeated Rooms
        if(is_empty_list(member(rm,this.visited))){
            this.visited =append(list(rm),this.visited);
        }else{;}
    };
    Fighter.prototype.get_visited = function(){
        return this.visited;
    };
    Fighter.prototype.update_path = function(node){
        this.path.add_node(node);
    };
    this.generator_room_coordinate = undefined;
    this.has_keycard = false;
    Fighter.prototype.set_generator_room_coordinate = function (obj){
      this.generator_room_coordinate = obj;
    };
    Fighter.prototype.set_has_keycard = function(){
        this.has_keycard = true;
    };
    this.path_to_follow = [];
}
Fighter.Inherits(Player);
function d(list_of_rooms){
    return map(function(rm){return rm.getName();},list_of_rooms);
}
Fighter.prototype.__act = function(){

    Player.prototype.__act.call(this);
    function random(lst){//Takes in a list and return a random element
        var l = length(lst);
        return list_ref(lst,Math.floor(Math.random()*l));
    }
    var location = this.getLocation();
    function get_room_in_direction_within_range(dir,range){
        function helper(this_room,intermediate,remaining_range){
            if(remaining_range===-1){
                return intermediate;
            }else if(equal(this_room,false)){
                return intermediate;
            }else{
                return helper(this_room.getExit(dir),append(list(this_room),intermediate),remaining_range-1);
            }
        }
    }
     function do1(){ //Move randomly and do the following
                    //Record footsteps, attack, take cards, search for neighbouring generator room and go next room 
        //Record footsteps
        this.set_visited(location);
        //Get neighbours
        var neighbours = location.getNeighbours(); //Neighbours: list of Rooms
        //Update this.path
        var n = new Node(location,neighbours,undefined);
        this.path.add_node(n);
        //Beginning of attack module
        var weapons = filter(function(th){return is_instance_of(th,Weapon);},this.getPossessions());//Weapons in possession
        var usable_weapons = filter(function(w){return !w.isCharging();},weapons);
        var melee_weapons = filter(function(w){return is_instance_of(w,MeleeWeapon);},usable_weapons);
        var ranged_weapons = filter(function(w){return is_instance_of(w,RangedWeapon);},usable_weapons);
        var spell_weapons = filter(function(w){return is_instance_of(w,SpellWeapon);},usable_weapons);
        if(!is_empty_list(melee_weapons)){//Melee weapon is ready
            var occupants = location.getOccupants();
            var service_bots = filter(function(occ){return is_instance_of(occ,ServiceBot);},occupants); //Current bots I am with
            var drones = filter(function(occ){return is_instance_of(occ,SecurityDrone);},occupants);
             if(!is_empty_list(service_bots)){//and got service bot
                this.use(random(melee_weapons),list(random(service_bots)));//Attack
            }else if(!is_empty_list(drones)){//and got security drones
                this.use(random(melee_weapons),list(random(drones))); //Attack
            }else{;}//Got nothing
        }else {;}
        if(!is_empty_list(ranged_weapons)){//has ranged also
            var weapon_at_disposal= head(ranged_weapons);
            var max_range = weapon_at_disposal.getRange();
            var list_of_rooms_to_check = this.path.within_range(max_range);
            var list_of_occupants_to_check = accumulate(function(rm,b){
                var occ = rm.getOccupants();
                return append(occ,b);
            },[],list_of_rooms_to_check);
            var list_of_service_bot = filter(function(occ){return is_instance_of(occ,ServiceBot);},list_of_occupants_to_check);
            var list_of_drone = filter(function(occ){return is_instance_of(occ,SecurityDrone);},list_of_occupants_to_check);
             if(!is_empty_list(list_of_service_bot)){//and got service bot
                this.use(weapon_at_disposal,list(random(list_of_service_bot)));//Attack
            }else if(!is_empty_list(list_of_drones)){//and got security drones
                this.use(weapon_at_disposal,list(random(list_of_drone))); //Attack
            }else{;}//Got nothing
        }else{;}
        if(!is_empty_list(spell_weapons)){
            alert(spell_weapons);
            var weapon_at_disposal2= head(spell_weapons);
            var max_range2 = weapon_at_disposal2.getRange(); 
            var north = get_room_in_direction_within_range("north",max_range2);
            var south = get_room_in_direction_within_range("south",max_range2);
            var east = get_room_in_direction_within_range("east",max_range2);
            var west = get_room_in_direction_within_range("west",max_range2);
            if(!is_empty_list(north)){
                this.use(weapon_at_disposal2,"north");
            }else if(!is_empty_list(south)){
                this.use(weapon_at_disposal2,"south");
            }else if(!is_empty_list(east)){
                this.use(weapon_at_disposal2,"east");
            }else if(!is_empty_list(west)){
                this.use(weapon_at_disposal2,"west");
            }else{
                ;//No target in range
            }
        } else{
            ;}//no weapon at all
        
        //End of attack module

        //Begin of pickup card module
        var things = location.getThings();//Things in the room
        var cards = filter(function(th){return is_instance_of(th,Keycard);},things);//Cards in the room
        this.take(cards);//Pick up any card if the service bot is dead
        var owned_card = filter(function(th){return is_instance_of(th,Keycard);},this.getPossessions()); //Update owned cards
        if(!is_empty_list(owned_card)&&this.has_keycard===false){//previously dont have card but now have
            this.set_has_keycard();//tell control now have card alr
        }else{;}
        //End of pickup card module

        //Begin of move module
        var visited = this.get_visited();

        var unvisited_rooms = filter(function(nb){return is_empty_list(member(nb,visited));},neighbours);
        var protected_rooms = filter(function(nb){return is_instance_of(nb,ProtectedRoom);},neighbours);//List of neighbouring protected room
        var generator_rooms = filter(function(pr){//List of neighbouring GeneratorRoom
            var th = pr.getThings();
            var has_generator = !is_empty_list(filter(function(things){return is_instance_of(things,Generator);},th));
            return has_generator;
        },protected_rooms);
        if(!is_empty_list(generator_rooms)){
            this.set_generator_room_coordinate(head(generator_rooms));
        }else{;}
        var non_protected_rooms = filter(function(nb){return !is_instance_of(nb,ProtectedRoom);},neighbours);
        var non_visited_non_protected_rooms = filter(function(rm){return !is_empty_list(member(rm,unvisited_rooms));},non_protected_rooms);
        if(this.has_keycard){
            if(!is_empty_list(this.path_to_follow)){
                var h = head(this.path_to_follow);
                this.path_to_follow = tail(this.path_to_follow);
                this.moveTo(h);
            }else{
                if(!equal(this.generator_room_coordinate,undefined)){
                    this.path_to_follow = save_footsteps(this.path.get_path(this.generator_room_coordinate));
                    var h1 = head(this.path_to_follow);
                    this.path_to_follow = tail(this.path_to_follow);
                    this.moveTo(h1);
                }else{
                    var unvisited_room = tail(this.path.get_unvisited(visited));
                    this.path_to_follow = save_footsteps(this.path.get_path(unvisited_room));
                    var h2 = head(this.path_to_follow);
                    this.path_to_follow = tail(this.path_to_follow);
                    this.moveTo(h2);
                }
            }
        }else{
            if(!is_empty_list(this.path_to_follow)){
                var h3 = head(this.path_to_follow);
                this.path_to_follow = tail(this.path_to_follow);
                this.moveTo(h3);
            }else{
                var unvisited_unprotected_room = tail(this.path.get_unvisited_unprotected(visited));
                    this.path_to_follow = save_footsteps(this.path.get_path(unvisited_unprotected_room));
                    var h4 = head(this.path_to_follow);
                    this.path_to_follow = tail(this.path_to_follow);
                    this.moveTo(h4);
            }
        }
    }
    function do2(){//After entering the generator room
        var bomb = filter(function(th){return is_instance_of(th,Bomb);},this.getPossessions());
        var valid_bomb = filter(function(b){return b.canBeUsed();},bomb);
        if(!is_empty_list(valid_bomb)){
            if(is_empty_list(this.path_to_follow)){//If set the bomb, there is a path to follow(that is to evacuate)
            head(valid_bomb).arm();
            var room_of_range_3 = this.path.within_range(3);
            var room_of_range_2 = this.path.within_range(2);
            var destinations = subtract(room_of_range_2,room_of_range_3);
            var valid_destinations = filter(function(rm){return !is_empty_list(member(rm,this.visited));},destinations);
            var my_destination = head(valid_destintions);//Wont be [] as there is at least one room(just reverse the path)
            this.path_to_follow = save_footsteps(this.path.get_path(my_destination));
            var h = head(this.path_to_follow);
            this.path_to_follow = tail(this_path_to_follow);
            this.moveTo(h);
            }
            else{
                var hh = head(this.path_to_follow);
                this.path_to_follow = tail(this_path_to_follow);
                this.moveTo(hh);
            }
        }else{
            ;
        }
    }
    if(is_empty_list(filter(function(th){return is_instance_of(th,Generator);},location.getThings()))||!is_empty_list(this.path_to_follow)){
        //If this is not a generator room do1(go to the generator room)
        //Else if this is a generator room, but I have a path to follow(meaning I have set the bomb and set the evacuated route in do2)
        do1.call(this);
    }else{
        //In the generator room but do not have a path to follow...So first time arriving! set the bomb
        do2.call(this);
    }
};




        /*
        has keycard
        Yes:
            has path to go?
            Yes: Follow path
            No: found generator room?
                Yes: find path to generator room
                     Follow path
                No: find path to unvisited room
                    Follow path



        No;
            has path to go?
            Yes: Follow path //Note that path will be automatically abrupted once keycard is found
            No: find path to unvisited room
                Follow path
        */
        //To do
        //Need to delete all loops in path to go

// Uncomment the following to test
 var newPlayer = new Fighter(shortname);
 test_task2(newPlayer);
/*
Copy your class for the previous task here, and extend its functionality
*/

// Uncomment the following to test
// var newPlayer = new [your class name here](shortname);
// test_task(newPlayer);
// Uncomment the following to test
// var newPlayer = new [your class name here](shortname);
// test_task2(newPlayer);