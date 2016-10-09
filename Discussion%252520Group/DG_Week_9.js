function make_monitored(f){
	var count = 0;
	return function(x){
	    if(equal(x,"get_count")){
	        return count;
	    }else if(equal(x,"reset_count")){
	        count =0;
	    }else{
		count = count +1;
			return f(x);
	    }
	};
}

var count_pair= (function(seen){
	function fn(x){
	
		if(! is_pair(x)){
			return 0;
		}else if(!is_empty_list(member(x,seen))){
			return 0;
		}else{
		    //display(x); //For debugging
			seen = append(list(x),seen);
			//display("What is in seen is "+seen);
			return count_pair(head(x))+count_pair(tail(x))+1;
		}
	}
	return fn;
})([]);

//Constructor
function  make_node(d,p,n){
    return list(d,p,n);
}
//Accessor
function get_prev(n){
    return list_ref(n,1);
}

function get_next(n){
    return list_ref(n,2);
}

function get_data(n){
    return list_ref(n,0);
}
//Default constructor
function empty_node(){
    return [];
}

function is_empty_node(n){
    return is_empty_list(n);
}
//Mutators
function set_data(n,v){
    set_head(n,v);
}
function set_previous(n,v){
	set_head(tail(n),v);
}
function set_next(n,v){
	set_head(tail(tail(n)),v);
}
//Application of node
//Application of node
function insert_before(n1,n2){
	var before = get_prev(n1);
	if(is_empty_node(before)){
		set_previous(n1,n2);
		set_next(n2,n1);
		set_previous(n2,empty_node);
	}else{
		set_next(before,n2);
		set_previous(n2,before);
		set_next(n2,n1);
		set_previous(n1,n2);

	}
}

function insert_after(n1,n2){
    var after = get_next(n1);
    if(is_empty_node(after)){
        set_next(n1,n2);
        set_previous(n2,n1);
        set_next(n2,empty_node);
    }else{
        set_next(n1,n2);
        set_next(n2,after);
        set_previous(after,n2);
        set_previous(n2,n1);
    }
}

function remove(n){
    var before = get_prev(n);
    var after = get_next(n);
    set_previous(after,before);
    set_next(before,after);
}

function has_loop(dlist){
    function next(node){
        if(equal(node,false)||equal(node,empty_node)||equal(get_next(node),empty_node)){
            return false;
        }else{
            return get_next(node);
        }
    }
    function fn(p1,p2){
        if(equal(p1,false)|| equal(p2,false)){
            return false;
        }else{
            if(p1===p2){
                return true;
            } else{
                return fn(next(p1),next(next(p2)));
        }
    }
    }
    return fn(next(dlist),next(next(dlist)));
}

function dlist_to_list(dlist){
	if(is_empty_node(dlist)){
		return [];
	}else{
		return pair(get_data(dlist),dlist_to_list(get_next(dlist)));
	}
}


function reverse_dlist(dlist){
	function fn(pointer){
	var n = get_next(pointer);
	var p = get_prev(pointer);
	set_next(pointer,p);
	set_previous(pointer,n);
	if(is_empty_node(n)){
		console.log(pointer);
		return pointer;
	}else{
		reverse_dlist(n);
	}
	}
	return fn(dlist);
}

//Test case
function make_simple_dlist(v1,v2,v3){
	var n1 = make_node(v1,[],[]);
	var n2 = make_node(v2,[],[]);
	var n3 = make_node(v3,[],[]);
	set_next(n3,n1);
	set_next(n1,n2);
	set_previous(n2,n1);
	set_previous(n1,n3);
	//set_next(n2,n1);
	return n3;
}
var l = make_simple_dlist(2,3,1);

//Basically, use Ctrl + Shift + I to test the doubly linked list
//Execute an empty source Week 8 Source to get the relevant environement
//Then copy and paste your code in the console tab
//Use console.log(...) to display
//In this way one can check the configuration of array 