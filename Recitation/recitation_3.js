function division_with_remainder(x,y)
{
    function division(numer,denom) {
        function iter(a, result) {
            if (a < denom) {
                return result;
            } else {
                return iter(a - denom, result + 1);
            }
        }
        return iter(numer, 0);
    }
    function remainder(numer, denom) {
        function iter(a, result) {
            if (a < denom) {
                return a;
            } else {
            return iter(a - denom, result + 1);
            }
        }
        return iter(numer, 0);
    }
    var q = division(x,y);
    var r = remainder(x,y);
    return function(selector){return selector(q,r);};
}

function first(collector){
    return collector(function(p,q){return p;});
}

function second(collector){
    return collector(function(p,q){return q;});
}
function is_even(e){
    return e%2===0;
}

function iter_fast_power(b,e){
    function iter(index,intermediate,multiplier){
        if(index===1){
            return intermediate * multiplier;
        }else if (is_even(index)){
            return iter(index/2,intermediate*intermediate,multiplier);
        }else
        {
            return iter(index-1,intermediate,multiplier*intermediate);
        }
    }
    return  e===0 ? 1 : iter(e,b,1);
}

function my_sum(n){//Recursive
    //Order of growth in time: Theta(n)
    //Order of growth in space: Theta(n)
    return n===1 ? 2 :n*(n+1)+my_sum(n-1);
}

function iter_my_sum(n){//Iterative
    //Order of growth in time: Theta(n)
    //Order of growth in space: Theta(1)
    function helper(index,intermediate){
        return index===0 ? intermediate : helper(index-1,intermediate + index * (index + 1));
    }
    return helper(n,0);
}

function sum(term, a, next, b){
    if(a > b){
        return 0;
    }else{
        return term(a) + sum(term, next(a), next, b);
    }
}

function another_my_sum(n){
    return sum(function(x){return x*(x+1);} ,1,function(x){return x+1;} ,n);
}

function iter_sum(term, a, next, b){
    function helper(index, intermediate)
    {
        return index>b ? intermediate : helper(next(index),intermediate + term(index));
    }
    return helper(a,0);
}
