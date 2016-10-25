// Task 1.1
function integrate_series_tail(s) {
	// Your answer here
	function integrate_n(s,n){
	    return pair(head(s)/n,function(){return integrate_n(stream_tail(s),n+1);});
	}
	return  integrate_n(s,1);
}

// Task 1.2
var exp_series = pair(1, function() { return integrate_series_tail(exp_series); } );
// Your explanation here
/*
By doing this we are defining the series of exp(x) as the solution of integral equation 
                y = 1 +integrate(y)
where integrate(y) is the integral of y wrt x from 0 to x.
The definition expands as such where int_n is the integrate_n function 
exp_series = 1, int_1 exp_series
           = 1, 1/1, int_2  (int_1 exp_series)
           = 1, 1,   int_2  (1, int_1 exp series)
           = 1, 1,   1/2,   (int_3(int_2(int_1 exp_series)
           = 1, 1,   1/2   , 1/6
*/
function integrate_series(series, constant_term) {
    return pair(constant_term, function() { return integrate_series_tail(series); });
}
var joel_exp_series = integrate_series(joel_exp_series,1);

// Task 2
// Your explanation here
			// File: mission_21_3.js
/*
The integrate_series function is not a special form hence it is strict in all its arguments
When joel_exp_series is evaluated, itself(second argument of integrate_series) must be evalutaed
causing an infinite loop. In the first definition, exp_series is lazily evaluated.

*/
	        
// Task 3
function negate_series(s){
    return stream_map(function(x){return -x;},s);
}
var sine_series = pair(0,function(){return integrate_series_tail(cosine_series);});
var cosine_series = pair(1,function(){return negate_series(integrate_series_tail(sine_series));});
			// File: mission_21_4.js
	        
// Task 4
function derive_series(series) {
    function deriv(s,n){
        return pair(head(s)*n,function(){return deriv(stream_tail(s),n+1);});
    }
    return stream_tail(deriv(series,0));
}
	        
// Task 5
function fact(n){
    return n===0? 1: n*fact(n-1);
}
function integer_from(n){
    return pair(n,function(){return integer_from(n+1);});
}
var integers = integer_from(0);
var cosine_series_task_5 = stream_map(function(x){
                                        if(x%2===0){
                                            return (x%2===0?1:-1)*1/fact(x);
                                        }else{
                                            return 0;
                                        }},
                                        integers);

var sine_series_task_5 = derive_series(cosine_series_task_5);
// Task 6
function scale_stream(c, stream) {
	return stream_map(function(x){
							return c * x;
					  },
					  stream);
}
var scale_series = scale_stream;
function mul_series(s1,s2){
	return pair(head(s1)*head(s2),function(){return add_streams(scale_series(head(s1),stream_tail(s2)),mul_series(stream_tail(s1),s2));});
}

function inverse_unit_series(s){
	return pair(1,function(){return scale_series(-1,mul_series(stream_tail(s),inverse_unit_series(s)));});
}
function coeffs_to_series(list_of_coeffs) {
	var zeros = pair(0,
					 function(){
							return zeros;
					 });
	function iter(lst) {
		if (is_empty_list(lst)) {
			return zeros;
		} else {
			return pair(head(lst),
						function() {
							return iter(tail(lst));
						});
		}
	}
	return iter(list_of_coeffs);
}
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
var arctan = integrate_series_tail(inverse_unit_series(coeffs_to_series(list(1,0,1))));