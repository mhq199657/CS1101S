function make_polynomial(c, d) {
    // your solution:
    return list(pair(c,d));
}

function get_coefficient(p, d) {
    // your solution:
    function op(item,a_applied_to_rest_lst){
        if(tail(item)===d){
            return head(item)+a_applied_to_rest_lst;
        }
        else{
            return a_applied_to_rest_lst;
        }
    }
    return accumulate(op,0,p);
}

function add_polynomials(p1, p2) {
    // your solution:
    return append(p1,p2);
}

function scale_polynomial(p, s) {
    // your solution:
    function op(item){
        return pair(s*head(item),tail(item));
    }
    return map(op ,p);
}


function negate_polynomial(p) {
    // your solution:
    function op(item){
        return pair(-1*(head(item)),tail(item));
    }
    return map(op,p);
}

//
function make_polynomial(c, d) {
    // your solution:
    return list(pair(c,d));
}

function get_coefficient(p, d) {
    // your solution:
    function op(item,a_applied_to_rest_lst){
        if(tail(item)===d){
            return head(item)+a_applied_to_rest_lst;
        }
        else{
            return a_applied_to_rest_lst;
        }
    }
    return accumulate(op,0,p);
}
    function max_power(p){
        function op(item,a_applied_to_rest_lst){
            return Math.max(tail(item),a_applied_to_rest_lst);
        }
        return accumulate(op,0,p);
    }
function add_polynomials(p1, p2) {
    // your solution:
    var raw = append(p1,p2);

    var max_power_raw=max_power(raw);
    function simplify_raw(p,max_pow){
        function helper(intermediate, remaining,this_max_pow){
            if(this_max_pow===0){
                return intermediate;
            }
            else{
                if(get_coefficient(remaining,this_max_pow)===0)
                {
                    return helper(intermediate,remaining,this_max_pow-1);
                }
                else
                {
                    return helper(append(list(pair(get_coefficient(remaining,this_max_pow),this_max_pow)),intermediate),remaining,this_max_pow-1);
                }
            }
        }
        return helper([],p,max_pow);
    }
    return simplify_raw(raw,max_power_raw);
}
         

function operate_on_polynomial(fn, p) {
    // your solution:
    function op(item){
        return pair(fn(head(item)),tail(item));
    }
    return map( op ,p);
    
}
