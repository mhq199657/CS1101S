// your program here.
function is_x_message(message) {
    return message.substring(0,3) === "is_";
}

function mro(x,m,full_message){
    function helper(parents){
        if(is_empty_list(parents)){
            return x(full_message);
        }else{
            var immediate = map(head,parents);
            var immediate_method = map(function(x){return list(x,x(list("methods")));},immediate);
            var immediate_supports = map(function(x){return list(head(x),is_pair(member(m,head(tail(x)))));},immediate_method);
            var all_supports = filter(function(x){return head(tail(x));},immediate_supports); 
            if(is_pair(all_supports)){
                return (head(head(all_supports)))(full_message);
            }else{
                return helper(filter(is_pair,map(function(x){return head(tail(x));},parents)));
            }
        }
    }
    return helper(filter(is_pair,x(list("parents"))));
}





function make_object(child) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_object") {
            return true;
        } else if (is_x_message(msg)) {
            return false;
        }else if(msg==="parents"){
            return [];
        } else if(msg==="methods"){
            return list("is_object");
        }
        else {
            return list("No Method Found:", msg);
        }
    }
    var true_self = child === undefined ? self : child;
    return self;
}

function make_named_object(name, child) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_named_object") {
            return true;
        }else if(msg==="parents"){
            return list(parent,parent(list("parents")));
        }else if(msg==="methods"){
            return list("name");
        }else if (msg === "name") {
            // check if getter/setter
            if (is_empty_list(tail(message))) {
                return name;
            } else {
                name = head(tail(message));
            }
        } else {
            return parent(message);
        }
    }
    // define parent
    var true_self = child === undefined ? self : child;
    var parent = make_object(true_self);

    return self;
}

function make_person(name, child) {
     function self(message) {
        var msg = head(message);
        var name = parent(list("name"));
        if (msg === "is_person") {
            return true;
        }else if(msg==="parents"){
            return list(parent,parent(list("parents")));
        } else if(msg==="methods"){
            return list("talk","join_partner","partner");
        } else if (msg === "talk") {
            if (partner === undefined) {
                display(name + " says: Hi! I am " + name + "!");
            } else {
                display(name + " says: I am " + name + " and I am partnered with " + partner(list("name")) + "!");
            }
        } else if (msg === "join_partner") {
            if (partner !== undefined) {
                display(name + " exclaims: I am already partnered!");
            } else {
                // check partner
                var proposed_partner = head(tail(message));
                if (proposed_partner(list("partner")) !== undefined) {
                    display(name + " exclaims: " + proposed_partner(list("name")) + " is already partnered!");
                } else {
                    // assign partner
                    partner = proposed_partner;
                    partner(list("force_join_partner", true_self));
                }
            }
        } else if (msg === "force_join_partner") {
            // Used to update partner.
            partner = head(tail(message));
        } else if (msg === "partner") {
            return partner;
        } else {
            return parent(message);
        }
    }
    // define parent
    var true_self = child === undefined ? self : child;
    var parent = make_named_object(name, true_self);

    var partner = 1;
    partner = undefined;

    return self;
}
function make_source_warrior(name,child) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_source_warrior") {
            return true;
        }else if(msg==="parents"){
            return list(parent,parent(list("parents")));
        } else if(msg==="methods"){
            return list("is_source_warrior","swing");
        } else if (msg === "swing") {
            display(parent(list("name")) + " swings lightsaber!");
        } else {
            return parent(message);
        }
    }
    var true_self = child === undefined ? self : child;
    var parent = make_person(name, self);

    return self;
}

function make_sith_lord(name, sith_name, child) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_sith_lord") {
            return true;
        }else if(msg==="parents"){
            return list(parent, parent(list("parents")));
        } else if(msg==="methods"){
            return list("is_sith_lord","sith_name","talk");
        }


        else if (msg === "sith_name") {
            // check if getter/setter
            if (is_empty_list(tail(message))) {
                return sith_name;
            } else {
                sith_name = head(tail(message));
            }
        } else if (msg === "talk") {
            parent(message);
            display(true_self(list("name")) + " says: Make that Lord " + true_self(list("sith_name")) + ", muahahaha...");
        } else {
            return parent(message);
        }
    }
    var true_self = child === undefined ? self : child;
    var parent = make_person(name, true_self);

    return self;
}
function make_traitor(name, sith_name, child) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_traitor") {
            return true;
        }else if(msg==="parents"){
            return list(list(parent1,parent1(list("parents"))),list(parent2,parent2(list("parents"))));
        } else if(msg==="methods"){
            return list("is_traitor");
        }


        else if (is_x_message(msg)) {
            alert(parent2(message));
            return parent1(message) || parent2(message);
        } else {
            return mro(self,head(message),message);
        }
    }
    var true_self = child === undefined ? self : child;
    var parent1 = make_source_warrior(name, true_self);
    var parent2 = make_sith_lord(name, sith_name, true_self);

    return self;
}




// count dooku example
var dooku = make_traitor("Dooku", "Tyranus", undefined);

display(dooku(list("is_source_warrior")));
// true

display(dooku(list("is_sith_lord")));
// true

display(dooku(list("is_traitor")));
// true

dooku(list("swing"));
// Dooku swings lightsaber!

dooku(list("talk")); // error here - why didn't he mention that he is Lord Tyranus?
// Dooku says: Hi, I am Dooku!
