function remove_duplicates(lst){
    if(is_empty_list(lst)){
        return [];
    }else{
        var h=head(lst);
        return pair(h,filter(function(item){
                        return item!==h;
                                    },
                      remove_duplicates(tail(lst))
                       )
                    );
    }
}

function remove_duplicates(lst){
    if(is_empty_list(lst)){
        return [];
    }else{
        var h = head(lst);
        return pair(h,accumulate(function(a,b){return a!==h?pair(a,b):b;},[],remove_duplicates(tail(lst))));
    }
}

//In general,
function filter(pred, xs) {
    return accumulate(function(a, b) {
                            return pred(a) ? pair(a, b) : b;
                                     },
                      [], xs);
}
function makeup_amount(x,l) {
    if (is_pair(l)) {
        return append(x<head(l)?[]  : map(function(item){return pair(head(l),item);}     ,makeup_amount(x-head(l),tail(l))),
                     makeup_amount(x, tail(l)));
    } else if (x === 0) {
        return list([]);
    } else {
        return [];
    }
}

function accumulate_n(op,init,seqs) {
   if (is_empty_list(head(seqs)))
      return [];
   else 
      return pair(accumulate(op,init,map(head,seqs)),
                  accumulate_n(op,init,map(tail,seqs)));
}
function accumulate_tree(op,init,tree){
  if(is_empty_list(tree)){
    return init;
  }else if(!is_list(head(tree))){
    return op(head(tree),accumulate_tree(op,init,tail(tree)));
  }else{
    return op(accumulate_tree(op,init,head(tree)),accumulate_tree(op,init,tail(tree)));
  }
}
function permutations_r(s,r) {
    if (r===0||is_empty_list(s)) {
        return list([]);
    } else {
        return accumulate(append, [],
                                    map(function(x) {
                                            return map(function(p) {
                                                            return pair(x, p);
                                                    },
                                        permutations_r(remove(x, s),r-1));
                                    }, s));
    }
}