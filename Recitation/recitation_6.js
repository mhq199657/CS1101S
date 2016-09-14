function a(lst){
	return map(function(x){return x*x;},lst);
}
function b(lst){
	return filter(function(x){return x%2===1;},lst);

function c(lst){
	var sublst=filter(function(x){return x%2===0;},lst);
	//list(2,4,6);
	return accumulate(list,false,sublst);
}
function d(lst){
	return accumulate(function(x,y){return append(x%2===1?[]:x,y);},false,lst);
}
function e(lst){
	function helper(max_now, remaining){
		return is_empty_list(remaining)? max_now : max_now>=head(remaining)? helper(max_now,tail(remaining)): helper(head(remaining),tail(remaining));
	}
	return helper(head(lst),tail(lst));
}
function f(lst){
	return is_empty_list(tail(lst))? lst: f(tail(lst));
}

function set_difference(xs,ys){
	function pred(item){
		return equal(member(item,ys),[]);
		//returns true when it is not found
	}
	return filter(pred,xs);
}

function remove_duplicates(lst){
    if(is_empty_list(lst)){
        return [];
    }else{
        var h=head(lst);
        return pair(h,filter(function(item){
                        return item!==h;
                                    },
                      remove_duplicates(tail(lst))
                       )
                    );
    }
}
function set_union(xs,ys){
	return remove_duplicates(append(xs,ys));
}
function set_intersection(xs,ys){
	//being lazy here thanks to MATH POWER...the order of growth is bad
	//try writing using filter yourself

	return set_difference(xs,set_difference(xs,ys));
}
//basically when the DS is ordered, iteration is more efficient
function ordered_set_difference(xs,ys){
	function helper(intermediate, r_x,r_y){
		if(is_empty_list(r_x)){
				return intermediate;

		}else{
			if(is_empty_list(r_y)){
				return append(intermediate,r_x);
			}else{
				return head(r_x)<head(r_y) ? helper(append(list(head(r_x)),intermediate),tail(r_x),r_y):
											 head(r_x)===head(r_y)? helper(intermediate,tail(r_x),tail(r_y))
											 //here the only choice is head(r_x)>head(r_y)
																  : helper(intermediate,r_x,tail(r_y));
			}
		}
	}
	return reverse(helper([],xs,ys));
}


function ordered_set_union(xs,ys){
	function helper(intermediate, r_x,r_y){
		if(is_empty_list(r_x)){
			return append(r_y,intermediate);
		}else{
			if(is_empty_list(r_y))
			{
				return append(intermediate,r_x);
			}else{
				return head(r_x)<head(r_y) ? helper(append(list(head(r_x)),intermediate),tail(r_x),r_y):
											 head(r_x)===head(r_y)? helper(append(list(head(r_x)),intermediate),tail(r_x),tail(r_y))
											 					  : helper(append(list(head(r_y)),intermediate),r_x,tail(r_y));
			}
		}
	}
	return reverse(helper([],xs,ys));
}

function ordered_set_intersection(xs,ys){
	function helper(intermediate,r_x,r_y){
		if(is_empty_list(r_x)||is_empty_list(r_y)){
			return intermediate;
		}else{
			return head(r_x)===head(r_y) ? helper(append(list(head(r_x)),intermediate),tail(r_x),tail(r_y))
										 : head(r_x)<head(r_y) ? helper(intermediate, tail(r_x),r_y)
										 					   : helper(intermediate, r_x,tail(r_y));
		}
	}
	return reverse(helper([],xs,ys));
} 