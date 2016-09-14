
function hanoi(size,from,to,extra){

    if(size===1){
        return list(list(from,to));
    }else{
        return append(hanoi(size-1,from,extra,to),append(list(list(from,to)),hanoi(size-1,extra,to,from)));
    }
}