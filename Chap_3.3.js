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

var has_loop = (function(seen){
	function fn(x){
		if(is_empty_list(x)){
			return false;
		}else if(!is_empty_list(member(x,seen))){
			return true;
		}else{
			seen = append(list(x),seen);
			return has_loop(tail(x));
		}
	}
	return fn;
})([]);

function has_loop(lst){
    function next(xs){
        if(equal(xs,false)||is_empty_list(xs)||is_empty_list(tail(xs))){
            return false;
        }else{
            return tail(xs);
        }
    }
    function fn(p1,p2){
        display(p1);
        display(p2);
    	if(equal(p1,false)||equal(p2,false)){
    		return false;
    	}else{
    		if(p1===p2){
    			return true;
    		}else{
    			return fn(next(p1),next(next(p2)));
    		}
    	}
    }
    return fn(next(lst),next(next(lst)));
}
    



