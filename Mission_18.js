/*
Note: for this mission and mission 19, the path finding module I used does not invoke psychic power: which means I deem the searching of neighbours of an unvisited room forbidden (which is more realistic in a gameplay and in real life also)
The algorithm for path finding in involves two important methods in path
One is Path.get_unvisited(visited), which takes in a list of visited room and return an unvisited room that I know to be closest to me
Another one is Path.get_path(room), which takes in a room and get a path towards that room
Note that this implementation is not clever in finding the generator room as the Fighter's vision is only limited with the rooms he has explored and the neighbours of explored rooms
One consequence is that if the starting location is faraway and it happens that the Fighter kills a lot of bots, drones will be everywhere and basically it will be impossible for Fighter to win
But that is how cruel real life is( and because they did not ask me to redo attack module to prevent excessive killings XD)
The logic involving having keycard or not and knowing the generator room or not and what to do next is written at the end of the code(commented), so I did not inline comment my last part
*/
//Auxilliary function for list processing
function save_footsteps(lst){//If the path has cycles, eliminate
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
Fighter.prototype.__act = function(){

    Player.prototype.__act.call(this);
    function random(lst){//Takes in a list and return a random element
        var l = length(lst);
        return list_ref(lst,Math.floor(Math.random()*l));
    }
    var location = this.getLocation();
    if(!equal(this.path.get_current_location(),undefined)&&is_empty_list(member(location,this.path.get_current_location().get_neighbours()))){
        this.visited = [];
        this.path = new Path();
        this.has_keycard = false;
        this.path_to_follow = [];
    }else{;}
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
        var occupants = location.getOccupants(); //Current Living Thing I am with
        var service_bots = filter(function(occ){return is_instance_of(occ,ServiceBot);},occupants); //Current bots I am with
        var drones = filter(function(occ){return is_instance_of(occ,SecurityDrone);},occupants);
        //Weapons in possession
        var weapons = filter(function(th){return is_instance_of(th,Weapon);},this.getPossessions());//Weapons in possession
        var usable_weapons = filter(function(w){return !w.isCharging();},weapons);
        if(!is_empty_list(usable_weapons)){//If weapon is ready 
            if(!is_empty_list(service_bots)){//and got service bot
                this.use(random(usable_weapons),list(random(service_bots)));//Attack
            }else if(!is_empty_list(drones)){//and got security drones
                this.use(random(usable_weapons),list(random(drones))); //Attack
            }else{;}//Got nothing
        }else{;}//Weapon not ready
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

        //Begin of move module, the logic behind this is as below
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
            //alert("Found!");
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
    do1.call(this);
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
 test_task(newPlayer);
/*
Copy your class for the previous task here, and extend its functionality
*/

// Uncomment the following to test
// var newPlayer = new [your class name here](shortname);
// test_task(newPlayer);