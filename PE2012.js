function compute_e(lst){
	var s = 0;
	for(var i =0; i<12;i++){
		s=s+ (i%2===0?1:3) * list_ref(lst,i);
	}
	return s%10;
}

function add_e(lst){
	return append(lst,list(compute_e(lst)));
}

function get_key(num){
	var l = [];
	for(var i =0;i<6;i++){
		l = pair(encoding_key[num][i],l);
	}
	return reverse(l);
}

function index_of_largest(is){
	return get_index_of_largest(is,0,-Infinity,NaN);
}
function get_index_of_largest(is,current_index,largest_so_far,index_of_largest_so_far){
	if(is_empty_list(is)){
		return index_of_largest_so_far;
	}else{
		if(head(is)>largest_so_far){
			return get_index_of_largest(tail(is),current_index+1,head(is),current_index);
		}else{
			return get_index_of_largest(tail(is),current_index+1,largest_so_far,index_of_largest_so_far);
		}
	}
}
function remove_specified_element_from_tail(xs,i){
	function remove(before,now,after,index){
		if(index>i){
			return append(before,after);
		}else{
			return remove(append(before,now),list(head(after)),tail(after),index+1);
		}
	}
	if(length(xs)<i+2){
		return NaN;
	}else{
		var t = tail(xs);
		return pair(head(xs),remove([],[],t,0));
	}
}



function Coordinates(x,y){
	this.x = x;
	this.y = y;
}
Coordinates.prototype.get_x = function(){
	return this.x;
};
Coordinates.prototype.get_y = function(){
	return this.y;
}; 

function Board(){
	this.reachable = [];
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
function equal_coordinate(c1,c2){
    if(c1.x===c2.x&&c1.y===c2.y){
        return true;
    }else{
        return false;
    }
}
function equal(a,b){
        return equal_coordinate(a,b);
}
function member(x,xs){
    if(is_empty_list(xs)){
        return [];
    }else if(equal(head(xs),x)){
        return xs;}
        else{
            return member(x,tail(xs));
        }
}
Board.prototype.get_reachables = function(){
	return this.reachable;
};
Board.prototype.set_reachable=function(c){
	var cx = c.get_x();
	var cy = c.get_y();
	if(cx<8&&cx>-1&&cy<8&&cy>-1){
		if(is_empty_list(member(c,this.reachable))){
			this.reachable = pair(c,this.reachable);
		}else{;}
	}else
	{
		;
	}
}; 
Board.prototype.set_reachable_by_knight_at = function(c){
	var cx = c.get_x();
	var cy = c.get_y();
	this.set_reachable(new Coordinates(cx+1,cy+2));
	this.set_reachable(new Coordinates(cx+1,cy-2));
	this.set_reachable(new Coordinates(cx-1,cy+2));
	this.set_reachable(new Coordinates(cx-1,cy-2));
	this.set_reachable(new Coordinates(cx+2,cy+1));
	this.set_reachable(new Coordinates(cx+2,cy-1));
	this.set_reachable(new Coordinates(cx-2,cy+1));
	this.set_reachable(new Coordinates(cx-2,cy-1));
};

function knight(c,n){
    var b = new Board();
	function helper(c,n,b){
	if(n===0){
		return c;
	}else{
		b.set_reachable_by_knight_at(c);
		var r = b.get_reachables();
		map(function(x){return helper(x,n-1,b);},r);
	}
}
	helper(c,n,b);
	return b.get_reachables();
}
//For debugging
function show_coordinate(lst){
    return map(function(c){return pair(c.x,c.y);},lst);
}
//Note this method is still inefficient

//Runtime O(2n)
function catch_me(x,a){
    var dimension = a.length;
    function helper(r,c){
        display(pair(r,c));
    	if(r===-1||c===dimension){
    		return false;
    	}else{
    		if(a[r][c]===x){
    			return true;
    		}else if(a[r][c]>x){
    			return helper(r-1,c);
    		}else{
    			return helper(r,c+1);
    		}
    	}
    }
    return helper(dimension-1,0);
}