function is_x_message(message) {
    return message.substring(0,3) === "is_";
}

function make_object() {
    function self(message) {
        var msg = head(message);
        if (equal(msg , "is_object")) {
            return true;
        } else if (is_x_message(msg)) {
            return false;
        } else {
            return list("No Method Found:", msg);
        }
    }
    return self;
}

function make_named_object(name) {
    function self(message) {
        var msg = head(message);
        if(equal(msg , "is_named_object")) {
            return true;
        } else if (equal(msg, "name")) {
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
    var parent = make_object();

    return self;
}

function make_person(name) {
     function self(message) {
        var msg = head(message);
        var name = parent(list("name"));
        if (equal(msg,"is_person")) {
            return true;
        } else if (equal(msg ,"talk")) {
            if (equal(partner, undefined)) {
                display(name + " says: Hi! I am " + name + "!");
            } else {
                display(name + " says: I am " + name + " and I am partnered with " + partner(list("name")) + "!");
            }
        } else if(equal (msg,  "join_partner")) {
            if(!equal(partner , undefined) ){
                display(name + " exclaims: I am already partnered!");
            } else {
                // check partner
                var proposed_partner = head(tail(message));
                if (!equal(proposed_partner(list("partner")), undefined)) {
                    display(name + " exclaims: " + proposed_partner(list("name")) + " is already partnered!");
                } else {
                    // assign partner
                    partner = proposed_partner;
                    partner(list("force_join_partner",self));
                }
            }
        } else if (equal(msg,  "force_join_partner")) {
            // Used to update partner.
            partner = head(tail(message));

        } else if (equal(msg,  "partner")) {
            return partner;
        } else {
            return parent(message);
        }
    }
    var parent = make_named_object(name);

    var partner = 1;
    partner = undefined;

    return self;
}

/*
// Sample Execution
var boba_fett = make_named_object("boba_fett");
var random_object = make_object();

display(boba_fett(list("is_named_object"))); // true
display(random_object(list("is_named_object"))); // false

display(boba_fett(list("name"))); // "boba_fett"

var palpatine = make_named_object("palpatine");
display(palpatine(list("name"))); // palpatine

palpatine(list("name", "darth sidious"));
display(palpatine(list("name"))); // darth sidious
*/
// Sample Execution

var boba_fett = make_person("Boba Fett");
var jango_fett = make_person("Jango Fett");
var hk_47 = make_person("HK 47");

display(boba_fett(list("is_person"))); // true

boba_fett(list("join_partner", jango_fett));

boba_fett(list("talk"));
// Boba Fett says: I am Boba Fett and I am partnered with Jango Fett!

jango_fett(list("join_partner", boba_fett));
// Jango Fett exclaims: I am already partnered!

boba_fett(list("join_partner", hk_47));
// Boba Fett exclaims: I am already partnered!

hk_47(list("talk"));
// HK 47 says: Hi! I am HK 47!

boba_fett(list("talk"));
// Boba Fett says: I am Boba Fett and I am partnered with Jango Fett!

(jango_fett(list("partner")))(list("talk"));
// Boba Fett says: I am Boba Fett and I am partnered with Jango Fett!

hk_47(list("join_partner", boba_fett));
// HK 47 exclaims: Boba Fett is already partnered!