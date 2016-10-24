function scale_stream(c, stream) {
	return stream_map(function(x) { return c * x; }, stream);
}
var A = pair(1, function() { return scale_stream(2, A); });
function mul_streams(a,b) {
	return pair(head(a) * head(b),
				function() {
					return mul_streams(stream_tail(a), stream_tail(b));
				});
}
function integer_from(n){
    return pair(n,function(){return integer_from(n+1);});
}
var integers = integer_from(1);
var B = pair(1, function() { return mul_streams(B, integers);});

eval_stream(A,10);//[1, [2, [4, [8, [16, [32, [64, [128, [256, [512, []]]]]]]]]]]
eval_stream(B,10);//[1, [1, [2, [6, [24, [120, [720, [5040, [40320, [362880, []]]]]]]]]]]

function stream_pairs(s) {
	if (is_empty_list(s)) {
		return [];
	} else {
		return stream_append(
					stream_map(
						function(sn){
							return list(head(s), sn);
						},
						stream_tail(s)
					),
			   		stream_pairs(stream_tail(s))
			   );
	}
}

var s1 = enum_stream(1,5);
eval_stream(stream_pairs(s1),10);// A finite stream of 10 elements: [[1, [2, []]], [[1, [3, []]], [[1, [4, []]], [[1, [5, []]], [[2, [3, []]], [[2, [4, []]], [[2, [5, []]], [[3, [4, []]], [[3, [5, []]], [[4, [5, []]], []]]]]]]]]]]
/* Explanation
First note that stream_append and stream_map are all LAZILY evaluated: meaning it will return a stream, whose tail will be evaluated only when forced
The first element of string(1) will be made pair with the rest of the string under the stream_map function; each pair that is returned in the form of list(pair(1,x)) x = 2,3,4,5 will be stream_appended
whose second stream is stream_pairs(stream_tails(s)), which continues the pairing (2,x) x = 3,4,5 as the recursion goes on
until the stream_tail() retrieves the empty list
*/
//stream_pairs(integers,10);//Maximum call stack size exceeded
//This is because the stream_pairs(stream_tail(s)) in line 31 is not wrapped in function so it is not lazily evaluated
/* for comparison
function stream_append(xs, ys) {
	if (is_empty_list(xs)) {
		return ys;
	} else {
		return pair(head(xs),
					function() {
						return stream_append(stream_tail(xs),
											 ys);
					});
	}
}
*/
function stream_append_pickle(xs, ys) {
	if (is_empty_list(xs)) {
		return ys();
	} else {
		return pair(head(xs),
					function() {
						return stream_append_pickle(stream_tail(xs),
													ys);
					});
	}
}

function stream_pairs2(s) {
	if (is_empty_list(s)) {
		return [];
	} else {
		return stream_append_pickle(
					stream_map(
						function(sn){
						return list(head(s), sn);
						},
						stream_tail(s)),
					function() {
					return stream_pairs2(stream_tail(s));
					});
					}
}
var s2 = stream_pairs2(integers);
eval_stream(s2,10);//[[1, [2, []]], [[1, [3, []]], [[1, [4, []]], [[1, [5, []]], [[1, [6, []]], [[1, [7, []]], [[1, [8, []]], [[1, [9, []]], [[1, [10, []]], [[1, [11, []]], []]]]]]]]]]]

//Let me finish the rest of the DG first
//Predefined functions supporting series
function add_streams(s1, s2) {
	if (is_empty_list(s1)) {
		return s2;
	} else if (is_empty_list(s2)) {
		return s1;
	} else {
		return pair(head(s1) + head(s2),
					function() {
						return add_streams(stream_tail(s1),
										   stream_tail(s2)
										  );
					}
				   );
	}
}
function scale_stream(c, stream) {
	return stream_map(function(x){
							return c * x;
					  },
					  stream);
}
var add_series = add_streams;
var scale_series = scale_stream;
function negate_series(s) {
	return scale_series(-1, s);
}
function subtract_series(s1, s2) {
	return add_series(s1, negate_series(s2));
}

function coeffs_to_series(list_of_coeffs) {
	var zeros = pair(0,
					 function(){
							return zeros;
					 });
	function iter(list) {
		if (is_empty_list(list)) {
			return zeros;
		} else {
			return pair(head(list),
						function() {
							return iter(stream_tail(list));
						});
		}
	}
	return iter(list_of_coeffs);
}


function fun_to_series(fun){
	var non_neg_integers = integer_from(0);
	return stream_map(fun,non_neg_integers);
}

//Testing
eval_stream(fun_to_series(function(x){return x*x*x;}),10);//[0, [1, [8, [27, [64, [125, [216, [343, [512, [729, []]]]]]]]]]]

var alt_ones = pair(1,function(){return pair(-1,function(){return alt_ones;});});

var zeros = add_streams(alt_ones, negate_series(alt_ones));

var s1 = pair(1,function(){return s1;});
var s2 = integer_from(1);

function mul_series(s1,s2){
	return pair(head(s1)*head(s2),function(){return add_streams(scale_series(head(s1),stream_tail(s2)),mul_series(stream_tail(s1),s2));});
}

function inverse_unit_series(s){
	return pair(1,scale_series(-1,mul_series(stream_tail(s),inverse_unit_series(s))));
}

function div_series(s1,s2){//s1 / s2 check divisibility before dividing
	var constant_term = head(s2);
	if(constant_term===0){
		return "Error: divided by 0";
	}else{
		return scale_stream(1/constant_term,mul_series(s1,inverse_unit_series(scale_series(1/constant_term,s2))));
	}
}
/*
Long division of (infinite) series
			 a0/b0
b0+b1x+... | a0    +    a1x    +    a2x^2   +...
			 a0    + a0(b1/b0)x+a0(b2/b0)x^2+....
			_____________________________________
			  0    + a1-a0(b1/b0)x + ....
			  and continues
*/