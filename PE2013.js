function Bits(xs) {
	this.bits = xs;
}

Bits.prototype.retrieve_bits =
function() {
	return this.bits;
};

Bits.prototype.flip = function(pos){
	function helper(p,lst){
		if(p===0){
			set_head(lst, head(lst)===true?false:true);
		}else{
			return helper(p-1,tail(lst));
		}
	}
	helper(pos,this.bits);
};

function is_odd(n){
	return n%2===1;
}

function all_false(xs){
	return is_empty_list(member(true,xs));
}

function element_wise_and(xs,ys){
	if(is_empty_list(xs)){
		return [];
	}else{
		return pair(head(xs)===true&&head(ys)===true,element_wise_and(tail(xs),tail(ys)));
	}
}

function decrement(xs){
	var t = reverse(xs);
	function helper(remaining,intermediate){
		if(is_empty_list(remaining)){
			return reverse(intermediate);
		}else if(head(remaining)===true){
			return append(reverse(tail(remaining),pair(false,intermediate)));
		}else{
			return helper(tail(remaining),pair(true,intermediate));
		}
	}
}

function count_true(xs){
	count = 0;
	function c(){
		if(all_false(xs)){
			return count;
		}else{
			count = count +1;
			return count_true(element_wise_and(xs,decrement(xs)));
		}
	}
	return c();
}
function Bits(xs) {
	this.bits = xs;
}

Bits.prototype.retrieve_bits =
function() {
	return this.bits;
};

Bits.prototype.flip = function(pos){
	function helper(p,lst){
		if(p===0){
			set_head(lst, head(lst)===true?false:true);
		}else{
			return helper(p-1,tail(lst));
		}
	}
	helper(pos,this.bits);
};

function is_odd(n){
	return n%2===1;
}

function all_false(xs){
	return is_empty_list(member(true,xs));
}

function element_wise_and(xs,ys){
	if(is_empty_list(xs)){
		return [];
	}else{
		return pair(head(xs)===true&&head(ys)===true,element_wise_and(tail(xs),tail(ys)));
	}
}

function decrement(xs){
	var t = reverse(xs);
	function helper(remaining,intermediate){
		if(is_empty_list(remaining)){
			return reverse(intermediate);
		}else if(head(remaining)===true){
			return append(reverse(tail(remaining)),pair(false,intermediate));
		}else{
			return helper(tail(remaining),pair(true,intermediate));
		}
	}
	return helper(t,[]);
}

function count_true(xs){
	function c(lst,count){
		if(all_false(lst)){
			return count;
		}else{
			return c(element_wise_and(lst,decrement(lst)),count+1);
		}
	}
	return c(xs,0);
}

function compute_parity(xs){
	return is_odd(count_true(xs));
}

function check_parity(xs,p){
	return compute_parity(xs)===p;
}

function Bits_with_parity (xs) {
Bits.call(this,xs);
this.parity = compute_parity (xs);
}
Bits_with_parity .Inherits(Bits );

Bits_with_parity.prototype.retrieve_bits = function(){
	if(check_parity(this.bits,compute_parity(this.bits))){
		return this.bits;
	}else{
		return "DATA LOST";
	}
};

function encode(xs){
	return accumulate(function(a,b){return append(list(a,a,a),b);},[],xs);
}

function decode(xs){
	if(is_empty_list(xs)){
		return [];
	}else{
		var h1 = head(xs);
		var h2 = head(tail(xs));
		var h3 = head(tail(tail(xs)));
		var sum = h1 +0 +h2+h3;
		if(sum>=2){
			return pair(true,decode(tail(tail(tail(xs)))));
		}else{
			return pair(false,decode(tail(tail(tail(xs)))));
		}
	}
}

function Bits_encoded (xs) {
Bits.call(this, encode(xs));
}
Bits_encoded .Inherits(Bits );
Bits_encoded .prototype.retrieve_bits =
function() {
return decode(Bits.prototype. retrieve_bits .call(this));
};
var bs = new Bits_encoded (list(true ,false ,true ));
var cs = bs. retrieve_bits (); // cs is list(true,false,true);
bs.flip (3);
var ds = bs. retrieve_bits (); // ds is list(true,false,true);
bs.flip (4);
var es = bs. retrieve_bits (); // es is a corrupted list equal to
// list(true,true,true);

//Memo_stream
function stream_tail(s){
	var t = tail(s);
	if(is_list(t)){//memo straem 
		return head(t);
	}else{//function
		var result = t();
		set_tail(s,result);
		return result;
	}
}







function stream_tail(s){
	var t = tail(s);
	if(is_pair(t)){//memo straem 
		return t;
	}else{//function
		var result = t();
		set_tail(s,result);
		return result;
	}
}







function stream_map(f, xs) { // as in stream library
if ( is_empty_list (xs)) {
return [];
} else {
return pair(f(head(xs)),
function() {
return stream_map(f,stream_tail (xs ));
});
} }
function stream_ref(xs ,n) { // as in stream library
if (n === 0) {
return head(xs);
} else {
return stream_ref(stream_tail (xs),n - 1);
} }





var s = stream(1 ,2 ,3 ,4);
var s2 = stream_map(function(x) { alert (x); return x + 1; },
s);
var v = stream_ref(s2 ,2); // alert shows 1,2,3
var w = stream_ref(s2 ,3); // alert shows only 4

function apply(fun, args) {
    if (is_primitive_function(fun)) {
        return apply_primitive_function(fun, args);
    } else if (is_compound_function_value(fun)) {
        if (length(function_value_parameters(fun)) === length(args)) {
            var env = extend_environment(function_value_parameters(fun),
                                         args,
                                         function_value_environment(fun));
            var result = evaluate(function_value_body(fun), env);
            if (is_return_value(result)) {
                return return_value_content(result);
            } else {
                return undefined;
            }
        } else {
            var l = length(args);
            var env2 = extend_environment(first_n(function_value_parameters(fun),l),
                                          args,
                                          function_value_environment(fun));
            var result2 = make_function_value(rest_of_n(function_value_parameters(fun),l),
                                             function_value_body(fun),
                                             env2);
            return result2;
        }
    } else {
        error("Unknown function type -- apply: " + fun);
    }
}

