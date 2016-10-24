// your program here.
function is_x_message(message) {
    return message.substring(0,3) === "is_";
}

function make_object(child) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_object") {
            return true;
        } else if (is_x_message(msg)) {
            return false;
        } else {
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
        } else if (msg === "name") {
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
function make_source_warrior(name) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_source_warrior") {
            return true;
        } else if (msg === "swing") {
            display(parent(list("name")) + " swings lightsaber!");
        } else {
            return parent(message);
        }
    }
    var parent = make_person(name, self);

    return self;
}

function make_source_initiate(name) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_source_initiate") {
            return true;
        } else if (msg === "talk") {
            parent(message);
            display("I am only an initiate.");
        } else {
            return parent(message);
        }
    }
    var parent = make_person(name,self);

    return self;
}

// Testing program Derek used.
var windu = make_source_warrior("Jules Windu");
var atton = make_source_initiate("Paul Atton");
atton(list("join_partner", windu));

atton(list("talk"));
// Paul Atton says: Hi, I am Paul Atton and I am partnered with Jules Windu!
// Paul Atton says: I am only an initiate.

(atton(list("partner")))(list("swing"));
// Jules Windu swings lightsaber!

(windu(list("partner")))(list("talk")); // Error here
// Paul Atton says: Hi, I am Paul Atton and I am partnered with Jules Windu!


var fisto = make_source_warrior("Def Fisto");
var shayaak = make_source_initiate("Mos Shayaak");
fisto(list("join_partner", shayaak));

fisto(list("swing"));
// Def Fisto swings lightsaber!


(fisto(list("partner")))(list("talk"));
// Mos Shayaak says: Hi, I am Mos Shayaak and I am partnered with Def Fisto!
// Mos Shayaak says: I am only an initiate.
(shayaak(list("partner")))(list("swing")); // Error here
// list("No Method Found:", "swing");