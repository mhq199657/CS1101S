//Task 1
function Window(size) {
    // Your answer here
    this.items = [];
    this.MAX_CAPACITY = size;
}
Window.prototype.add = function(x){
	this.items = append(this.items,list(x));
	if(length(this.items)>this.MAX_CAPACITY){
		this.items = tail(this.items);
	}else{;}
};
Window.prototype.get_size = function(){
	return length(this.items);
};
Window.prototype.get_window = function(){
	return this.items;
};
//Task 2


function FilteringWindow(size,filter){
	Window.call(this,size);
	this.filter = filter;
}
FilteringWindow.Inherits(Window);
FilteringWindow.prototype.set_filter= function(new_filter){
	this.filter = new_filter;
};
FilteringWindow.prototype.add= function(x){
	var b = (this.filter)(x);
	if(b){
		Window.prototype.add.call(this,x);
	}else{
		;
	}
};
//Any additional tests

//Task 3	        
var force_stream = list_to_stream(list(false, 1, 0, 1, 0, false, 1, 0, 1, 0,
    false, false, 1, 1, 0, 1, 1, false, false, false, 1, false, 0, 1, 1,
    1, 0, 1));

function is_same_item(a,b){
	if(is_pair(a)&&is_pair(b)){
		return is_same_list(a,b);
	}else{
		return equal(a,b);
	}
}
function is_same_list(lst1,lst2){
	if(is_empty_list(lst1)){
		return is_empty_list(lst2);
	}else if(is_empty_list(lst2)){
		return is_empty_list(lst1);
	}else{
		return equal(head(lst1),head(lst2))&&is_same_list(tail(lst1),tail(lst2)); 
	}
}

function scan(s,sig,d){
	var fw = new FilteringWindow(length(sig),function(x){return !equal(x,false);});
	function dist(lst){
		if(is_empty_list(lst)){
			return Infinity;
		}else{
			fw.add(head(lst));
			if(is_same_item(sig,fw.get_window())){
				return 1;
			}else{
				return 1 + dist(tail(lst));
			}
		}
	}
	var ans = dist(eval_stream(s,d));
	if(!equal(ans,Infinity)){
	    return ans;
	}else{
	    return false;
	}
}
