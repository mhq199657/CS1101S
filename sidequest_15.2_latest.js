/*
Formation:

Suppose n targets are points P1,P2,...Pn in 3D Euclidean space.
Define a connector to be a point or a ordered set of line segments, whose next element share a common vertex with the last
Define length of connector to be the maximum distance of the line segment in it or 0 if it is a point
Define content of the connector to be points which the connector connects.
Define magnitude of set of connectors to be length of the connector of the maximum length.
A set of points is said to be connected by a set of connectors, if the union of the content of all connectors is the set of point.
The task is:
Given k connectors, make n points connected with magnitude minimised.

Approach:
To support matrix, define useful accessor and modifier of matrix and of list first
Construct a distance matrix whose ij entry is the distance between PiPj
Construct a connectedness matrix whose entry are either true(denoting connect)
                                                 or     false(denoting disconnect)
            This matrix is generated from distance matrix
                if distance ===-1 return false
                else              return true
At the beginning, eacy pair of points are connected.
Remove the connection between the two points whose distance is the largest(by quering the distance matrix)
            This is achieved by function disconnect
                disconnect changes the distance between the points to -1
Generate the connectedness matrix, and generate the list of connectors
if number of  connectors < k, continue to disconnect the next longest line segment
else return the list of connectors
We have our target already by taking the head of each connector
It is also not hard to find the magnitude given that the distance between each point of connector can be easily retrieved from the distance matrix
Thus we have our problem solved
*/

// Helper functions
function get_enemy_id(x) { return head(x); }
function get_enemy_x(x) { return head(tail(x)); }
function get_enemy_y(x) { return head(tail(tail(x))); }
function get_enemy_z(x) { return head(tail(tail(tail(x)))); }

function sum_of_squares(a, b, c) {
    function sq(x) { return x * x; }
    return sq(a) + sq(b) + sq(c);
}

function distance(e1, e2) {
    return Math.sqrt(sum_of_squares(
        get_enemy_x(e1) - get_enemy_x(e2),
        get_enemy_y(e1) - get_enemy_y(e2),
        get_enemy_z(e1) - get_enemy_z(e2)
    ));
}

// End of Helper Functions

function generate_distance_matrix(hostile_list){
    return map(function(target){
                    return map(function(target2){
                                    return distance(target,target2);
                    },hostile_list);
                },
        hostile_list);
}
function generate_connectedness_matrix(dimension){
    return build_list(dimension,function(x){return build_list(dimension,function(y){return true;});});
}
//useful list operations to facilitate matrix operation
function replace(lst,index,new_value){
    if(index===0){
        return pair(new_value,tail(lst));
    }else{
        return pair(head(lst),replace(tail(lst),index-1,new_value));
    }
}
function eliminate(lst,index){
    if(index===0){
        return tail(lst);
    }else{
        return pair(head(lst),eliminate(tail(lst),index-1));
    }
}
function remove_duplicate(lst){
    if(is_empty_list(lst)){
        return [];
    }else{
        if(is_empty_list(member(head(lst),tail(lst)))){
            return pair(head(lst),remove_duplicate(tail(lst)));
        }else{
            return remove_duplicate(tail(lst));
        }
    }
}
function union(lst1,lst2){
    return remove_duplicate(append(lst1,lst2));
}
function list_union(lst){
    if(is_empty_list(lst)){
        return [];
    }else{
        return union(head(lst),list_union(tail(lst)));
    }
}
function remove_list(lst1,lst2){
    function op(item){
        if(is_empty_list(member(item,lst1))){
            return true;
        }else{
            return false;
        }
    }
    return filter(op,lst2);
}
//matrix operations
function get_item(r,c,matrix){ //r,c : [0,n-1]
    //var dimension = length(matrix);
    var this_row=list_ref(matrix,r);
    var this_item=list_ref(this_row,c);
    return this_item;
}
function get_item_from_pair(p,matrix){
    var r = head(p);
    var c = tail(p);
    var this_row=list_ref(matrix,r);
    var this_item=list_ref(this_row,c);
    return this_item;
}
function modify_item(p,matrix,new_value){
    var r = head(p);
    var c = tail(p);
    var this_row=list_ref(matrix,r);
    var modified_row=replace(this_row,c,new_value);
    var modified_matrix=replace(matrix,r,modified_row);
    return modified_matrix;
}
function generate_pair(lst){
    var raw=map(function(x){return map(function(y){return pair(x,y);},lst);},lst);
    function op(x,y){
        if(head(x)===tail(x)){
            return y;
        }else{
            return pair(x,y);
        }
    }
    return map(function(lst){return accumulate(op,[],lst);},raw);
}/*
function submatrix(index,matrix){
    return map(function(lst){return eliminate(lst,index);},eliminate(matrix,index));
}
function sublistmatrix(list_of_index,matrix){
    var r_list=reverse(list_of_index);
    if(is_empty_list(list_of_index)){
        return matrix;
    }else{
        return sublistmatrix(reverse(tail(r_list)),submatrix(head(r_list),matrix));
    }
}
*/
function submatrix(index,connectedness_matrix){
    var DIMENSION = length(connectedness_matrix);
    var l = build_list(DIMENSION,function(x){return false;});
    var m1 = replace(connectedness_matrix,index,l);
    var m2 = map(function(lst){return replace(lst,index,false);},m1);
    return m2;
}
function sublist_matrix(list_of_index,matrix){
    if(is_empty_list(list_of_index)){
        return matrix;
    }else{
        return sublist_matrix(tail(list_of_index),submatrix(head(list_of_index),matrix));
    }
}
function generate_connectedness_matrix(distance_matrix){
    function f(lst){
        function g(item){
            if(item===-1){
                return false;
            }else{
                return true;
            }
        }
        return map(g,lst);
    }
    return map(f,distance_matrix);
}
function get_connector(index,connectedness_matrix){
    function is_fully_disconnected(index,matrix){
        var l = list_ref(matrix,index);
        return list_ref(l,index)&&length(filter(function(x){return x;},l))===1;
    }
    //in case it is not fully disconnected
    function get_true_index(lst){
        function helper(intermediate,remaining_list,index){
            if(is_empty_list(remaining_list)){
                return reverse(intermediate);
            }else{
                if(head(remaining_list)){
                    return helper(pair(index,intermediate),tail(remaining_list),index+1);
                }else{
                    return helper(intermediate,tail(remaining_list),index+1);
                }
            }
        }
        return helper([],lst,0);
    }
    //To prevent infinite loop of the recursive call
    function connected_elsewhere(index,matrix){
        var l = list_ref(matrix,index);
        var other = replace(l,index,false);
        return get_true_index(other);
    }
    //Till now
    if(is_fully_disconnected(index,connectedness_matrix)){
        return list(index);
    }else{
        var elsewhere = connected_elsewhere(index,connectedness_matrix);

        var temp = map(get_true_index,map(function(x){return list_ref(connectedness_matrix,x);},elsewhere));

        return union(list(index),list_union(temp));
    }
}
function get_connector_list(connectedness_matrix){
    var DIMENSION=length(connectedness_matrix);
    function helper(remaining_matrix,intermediate,this_index,l){
        if(this_index===-1){
            return intermediate;
        }else{
            var c = get_connector(this_index,remaining_matrix); //should return a list of index
            var processed_l=remove_list(c,l);
            var next_index=is_empty_list(processed_l)? -1 : head(processed_l);
            var m = sublist_matrix(c,connectedness_matrix);

            return helper(m,pair(c,intermediate),next_index,processed_l);
        }
    }
    return helper(connectedness_matrix,[],0,enum_list(0,DIMENSION-1));
}



function disconnect(coordinate_pair,distance_matrix){
    var reversed_pair = pair(tail(coordinate_pair),head(coordinate_pair));
    var m1=modify_item(coordinate_pair,distance_matrix,-1);
    var m2=modify_item(reversed_pair,m1,-1);
    return m2;
}


function get_longest_distance_coordinate(distance_matrix){
    var DIMENSION = length(distance_matrix);
    function helper(index_r,index_c,current_r,current_c,current_max){
        if(index_r===DIMENSION){
            return pair(current_r,current_c);
        }else{
            if(index_c===DIMENSION){
                return helper(index_r+1,0,current_r,current_c,current_max);
            }else{
                var this_item=get_item(index_r,index_c,distance_matrix);
                if(this_item>current_max){
                    return helper(index_r,index_c+1,index_r,index_c,this_item);
                }else{
                    return helper(index_r,index_c+1,current_r,current_c,current_max);
                }
            }
        }
    }
    return helper(0,0,0,0,get_item(0,0,distance_matrix));
}



function acquire_missile_targets(hostile_list, number_of_missiles) {
    // your solution here
    var m_distance=generate_distance_matrix(hostile_list);

    function generate_proper_connector_list(m_distance){
        function helper(distance_matrix,intermediate){
            var num_of_connector=length(intermediate);
            if(num_of_connector===number_of_missiles){
                return intermediate;
            }else{
                var p = get_longest_distance_coordinate(distance_matrix);
                var m = disconnect(p,distance_matrix);
                var l = get_connector_list(generate_connectedness_matrix(m));
                return helper(m,l);
            }
        }
        return helper(m_distance,get_connector_list(generate_connectedness_matrix(m_distance)));
    }
    
    var proper_list_of_connectors = generate_proper_connector_list(m_distance);

    function minimize_magnitude(proper_list_of_connectors){
        function maximum_length(connector){
            if(length(connector)===1){

                return 0;
            }else{
                var list_of_list_of_pairs= generate_pair(connector);
                var list_of_list_of_distance=map(function(list_of_pairs){
                                                    return map(function(p){
                                                                    return get_item_from_pair(p,m_distance);
                                                                },list_of_pairs);
                                                },list_of_list_of_pairs);
                var list_of_magnitude=map(function(list_of_distance){
                                            return accumulate(Math.min,2000000,list_of_distance);
                                        },list_of_list_of_distance);
                return accumulate(Math.max,0,list_of_magnitude);
            }
        }
        var list_of_maximum_magnitude=map(maximum_length,proper_list_of_connectors);
        return accumulate(Math.max,0,list_of_maximum_magnitude);
    }
    var magnitude = minimize_magnitude(proper_list_of_connectors);
    var target_to_hit = map(head,proper_list_of_connectors);

    var target_name_to_hit = map(function(index){return get_enemy_id(list_ref(hostile_list,index));},target_to_hit);
    return pair(magnitude,target_name_to_hit);

}

// Tester
acquire_missile_targets(
    list(
        list("TIE0001", 100, 200, -80),
        list("TIE0002", 100, 200, 0),
        list("TIE0003", 100, 200, 50),
        list("TIE0004", 100, 200, 120),
        list("TIE0005", 100, 200, 200),
        list("TIE0006", 100, 200, 250),
        list("TIE0007", 100, 200, 320),
        list("TIE0008", 100, 200, 500),
        list("TIE0009", 100, 200, 800),
        list("TIE0010", 100, 200, 820)
    ),3);
