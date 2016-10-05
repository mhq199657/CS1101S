function make_stack() {
    var stack = pair("stack", []);
    return stack;
}
function get_stack(stack){
    return tail(stack);
}

function is_empty(stack){
    return is_empty_list(get_stack(stack));
}

function clean(stack){
    return set_tail(stack,[]);
}

function peek(stack){
    if(is_empty(stack)){
        return "Stack underflow";
    }else{
        return head(get_stack(stack));
    }
}

function push(stack,x){
    set_tail(stack,pair(x,get_stack(stack)));
}

function pop(stack){
    if(is_empty(stack)){
        return "Stack underflow."
    }else{
        var s = get_stack(stack);
        set_tail(stack,tail(s));
        return head(s);
    }
}

function push_all(stack,lst){
    if(is_empty_list(lst)){
        return stack;
    }else{
        push(stack,head(lst));
        return push_all(stack,tail(lst));
    }
}

function pop_all(stack){
    if(is_empty(stack)){
        return [];
    }else{
        return pair(pop(stack),pop_all(stack));
    }
}

function reverse(lst){
    var s = make_stack();
    return pop_all(push_all(s,lst));

}
//During Recitation,
var x = 3;
var y = 5;
function global(){
    var z = 6;
    var x = 7;
}

//Only function application will create new frame
