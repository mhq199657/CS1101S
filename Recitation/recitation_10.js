//Predefined stream environment
function add_streams(s1, s2) {
if (is_empty_list(s1)) {
return s2;
} else if (is_empty_list(s2)) {
return s1;
} else {
return pair(head(s1) + head(s2),
function() {
return add_streams(stream_tail(s1), stream_tail(s2));
});
}
}

function partial_sum(s){
    return pair(head(s),function(){return add_streams(stream_tail(s),partial_sum(s));});
}

var a = enum_stream(1,10000);
var b = partial_sum(a);

function list_to_inf_stream(lst){
	function fn(remaining_lst){
		if(is_empty_list(remaining_lst)){
			return pair(head(lst),function(){return fn(tail(lst));});
		}else{
			return pair(head(remaining_lst),function(){return fn(tail(remaining_lst));};
		}
	}
	return fn(lst);
}

//Attempt to create an integer stream
function one_stream(){
    return pair(1,one_stream);
}
var integer_stream = partial_sum(one_stream());
//Bad attempt indede
//Another attempt
function another_integer_stream(){
	var index = 1;
	function fn(){
		index = index +1;
		return pair(index-1,fn);
	}
	return fn();
}
//This one is more efficient by using an internal counter