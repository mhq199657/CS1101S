function shift_one_left(num){
	function len(num){
		if(num<10){
			return 1;
		}else{
			return 1+len(num/10);
		}
	}
	var l = len(num);
	var h = Math.floor(num/Math.pow(10,l-1));
	var t = num-h*Math.pow(10,l-1);
	return 10*t+h;
}

function shift_left(num,n){
	if(n===0){
		return num;
	}else{
		return shift_left(shift_one_left(num),n-1);
	}
}

function shift_right(num,n){//Iteratively
	function shift_one_right(num){
		var t = num%10;
		var h = (num-t)/10;
		return parseInt(t+""+h);
	}
	if(n===0){
		return num;
	}else{
		return shift_right(shift_one_right(num),n-1);
	}
}

function shift_right(num,n){//Recursively
	function repeated(f,n){
		if(n===1){
			return f;
		}else{
			return function(x){
				return f((repeated(f,n-1))(x));
			}
		}
	}
	function shift_one_right(num){
		var t = num%10;
		var h = (num-t)/10;
		return parseInt(t+""+h);
	}
	return n===0?num: (repeated(shift_one_right,n))(num);
}

function nth_digit(n,num){//nth digit from the rear
	return n===1? num%10 : nth_digit(n-1,Math.floor(num/10));
}

function nth_digit(n,num){//nth digit from the head
	var l = Math.floor(1+Math.log(num)/Math.log(10));
	if(n>l){
		return 0;
	}else{
		return Math.floor(num/Math.pow(10,l-n))%10;
	}
}

function divisible_by_11(num){
	function sum_of_odd_digits(num){
		if(num===0){
			return 0;
		}else{
			return num%10 + sum_of_odd_digits(Math.floor(num/100));
		}
	}
	var sum1 = sum_of_odd_digits(num);
	var sum2 = sum_of_odd_digits(Math.floor(num/10));
	return (sum1-sum2)%11===0;
}

function count_instances(num,lst){
	if(is_empty_list(lst)){
		return 0;
	}else{
		var t = tail(lst);
		return equal(head(lst),num)?1+count_instances(num,t):count_instances(num,t);
	}
}

function concat(n,m){
	if(n===0){
		return m;
	}else{
			return parseInt(n+""+m);
		}
}

function replace_digit(n,d,r){
	//Recursively
	return Math.floor(n/10)===0? n:concat(replace_digit(Math.floor(n/10),d,r),n%10===d?r:n%10);
}

//count_change...
function make_function_with_exception(parameter,output,f){
	return function(x){
		if(x===parameter){
			return output;
		}else{
			return f(x);
		}
	};
}
var usually_double = make_function_with_exception(4,0,
							make_function_with_exception(7,0,
								make_function_with_exception(11,0,
									function(x){return 2*x;}
															)
														)
												 );
/*
function make_multiplier(scaling_factor) {
	return function(x) {
		return x * scaling_factor;
	};
}
function expt(a, b) {
	return b === 0 ? 1 : a * expt(a, b-1);
}
function make_exponentiator(exponent) {
	return function(x) {
		return expt(x, exponent);
	};
}
*/
function make_generator(f){
	return function(x){
		return function(y){
			return f(x,y);
		};
	};
}

function deep_sum(lst){
	if(is_empty_list(lst)){
		return 0;
	}else if(is_list(head(lst))){
		return deep_sum(head(lst))+deep_sum(tail(lst));
	}else{
		return head(lst)+deep_sum(tail(lst));
	}
}

function deep_list_op(f,init){
	function helper(lst){
		if(is_empty_list(lst)){
			return init;
		}else if(is_list(head(lst))){
			return f(helper(tail(lst)),helper(head(lst)));
		}else{
			return f(helper(tail(lst)),head(lst));
		}
	}
	return helper;
}

function deep_reverse(lst){
	return (deep_list_op(function(a,b){return append(a,list(b));},[]))(lst);
}

function split(num,lst){
	function helper(l1,l2,remaining_lst){
		if(is_empty_list(remaining_lst)){
			return list(reverse(l1),reverse(l2));
		}else{
			var h = head(remaining_lst);
			if(h<=num){
				return helper(pair(h,l1),l2,tail(remaining_lst));
			}else{
				return helper(l1,pair(h,l2),tail(remaining_lst));
			}
		}
	}
	return helper([],[],lst);
}

function permutations(s){
	if(is_empty_list(s)){
		return list([]) ;
	} else {
		return accumulate(append,[],
					map(function(x){
						return map( function (p) {
										return pair (x,p);
									},
									permutations ( remove (x,s)));
						},
						s)
				);
	}
}

function power_set(s){
	if(is_empty_list(s)){
		return list([]);
	}else{
		var rest = power_set(tail(s));
		return append(rest,map(function(x){return pair(head(s),x);},rest));
	}
}

function check_power_set(lst){
	function check_identical(l1,l2){
		function helper(remaining_l1,remaining_l2){
			if(is_empty_list(remaining_l1)){
				if(is_empty_list(remaining_l2)){
					return true;
				}else{
					return false;
				}
			}else{
				if(is_empty_list(remaining_l2)){
					return false;
				}else{
					var h1 = head(remaining_l1);
					if(is_empty_list(member(h1,l2))){//h1 not found in l2
						return false;
					}else{
						return helper(tail(remaining_l1),remove(h1,remaining_l2));
					}
				}
			}
		}
		return helper(l1,l2);
	}
	var p = power_set(s);
	function helper(l1,l2){
		if(is_empty_list(remaining_l1)){
				if(is_empty_list(remaining_l2)){
					return true;
				}else{
					return false;
				}
			}else{
				if(is_empty_list(remaining_l2)){
					return false;
				}else{
					var h1 = head(remaining_l1);
					var l = map(function(x){return check_identical(x,h1);},l2);
					if(is_empty_list(member(true,l))){
						return false;
					}else{
						var index = length(l2)-length(member(true,l));
						return helper(tail(remaining_l1),remove(list_ref(l2,index),l2));
					}
	}
	return helper(lst,p);
}

//check_power_set

function make_number(num){
	return function(m){
		if(equal(m,"value")){
			return num;
		}else if(equal(m,"plus")){
			return function(obj){
				return obj("value")===undefined||num===undefined? make_number(undefined): num+obj("value");
			};
		}else if(equal(m,"minus")){
			return function(obj){
				return obj("value")===undefined||num===undefined? make_number(undefined): num-obj("value");
			};
		}else if(equal(m,"times")){
			return function(obj){
				return obj("value")===undefined||num===undefined? make_number(undefined): num*obj("value");
			};
		}else if(equal(m,"divide")){
			return function(obj){
				var dividend = obj("value");
				if(dividend===0){
					return make_number(undefined);
				}else{
					return obj("value")===undefined||num===undefined? make_number(undefined): num/dividend;
				}
			};
		}
		else{
			return "Unknown request";
		}
	};
}
