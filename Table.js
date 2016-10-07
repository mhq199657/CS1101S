function make_table(){
	return pair("table",[]);
}

function is_empty_table(table){
	if(is_empty_list(tail(table))){
		return true;
	}else{
		return false;
	}
}
function has_key(key,table){ 
	if(is_empty_table(table)){
		return false;
	}else{
		var this_entry = head(tail(table));
		if(head(this_entry)===key){
			return true;
		}else{
			return has_key(key,pair("table",tail(tail(table))));
		}
	}
}

function lookup(key,table){
	function lookup2(key,table){
		var this_entry = head(tail(table));
		if(head(this_entry)===key){
			return tail(this_entry);
		}else{
			return lookup2(key,pair("table",tail(tail(table))));
		}
	}
	if(has_key(key,table)){
		var this_entry = head(tail(table));
		if(head(this_entry)===key){
			return tail(this_entry);
		}else{
			return lookup2(key,pair("table",tail(tail(table))));
		}
	}else{
		return undefined;
	}
}
function insert(key,value,table){
	var t = tail(table);
	var new_pair = pair(key,value);
	var new_entry = pair(new_pair,[]);
	set_tail(new_entry,t);
	set_tail(table,new_entry);
}

var table = pair("table",list(pair("a",1),pair("b",2),pair("c",3)));

function memoize(f) {
	var table = make_table();
	return function(x) {
		if (has_key(x, table)) {
			return lookup(x, table);
		} else {
			var result = f(x);
			insert(x, result, table);
			return result;
		}
	}
}

var memo_fib = memoize(
	function(n) {
		if (n === 0 || n === 1) {
			return n;
		} else {
			return memo_fib(n-1) + memo_fib(n-2);
	}
});

