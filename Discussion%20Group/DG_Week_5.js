function reverse(lst){
    function helper(lst, intermediate){
        if(is_empty_list(lst)){
            return intermediate;
        }else{
            return helper(tail(lst),pair(head(lst),intermediate));
        }
    }
    return helper(lst,[]);
}
var rev_list = reverse(list(1,2,3,4));

var h= head;
var t = tail;

function every_second(items){

    function helper(lst, intermediate, index){
        if (is_empty_list(lst)){
            return intermediate;
        }else if (index%2===0){
            return helper(tail(lst),pair(head(lst),intermediate),index+1);
        }else{
            return helper(tail(lst),intermediate,index+1);
        }
    }
    return reverse(helper(items,[],1));
}

function sums(lst){
    var odd_list=every_second(pair([],lst));
    var even_list=every_second(lst);
    function consecutive_sum(lst){
        return is_empty_list(lst) ? 0 : head(lst) + consecutive_sum(tail(lst));
    }
    return list(consecutive_sum(odd_list),consecutive_sum(even_list));
}

function empty_queue(){
    return [];
}
var qhead = head;
function enqueue(x, q){
    return !is_empty_list(q) ? pair(head(q),enqueue(x,tail(q))) : pair(x,[]);
}
function dequeue(q){
    return tail(q);
}

function alter_enqueue(x,q){
    return pair(q,x);
}
function alter_dequeue(q){
    return is_empty_list(head(q))? empty_queue() : pair(alter_dequeue(head(q)),tail(q));
}

function alter_qhead(q){
    return is_empty_list(head(q))? tail(q) : alter_qhead(head(q));
}