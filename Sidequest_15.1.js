var grand_laser_angle = Math.PI / 12;
var grand_laser_reach = 10000;
function get_name(target){
    return list_ref(target,0);
}
function get_x(target){
    return list_ref(target,1);
}
function get_y(target){
    return list_ref(target,2);
}
function get_z(target){
    return list_ref(target,3);
}
function get_distance(target){
    function square(x){return x*x;};
    return Math.sqrt(square(get_x(target))+square(get_y(target))+square(get_z(target)));
}
function get_angle(target1,target2){
    var cos_value=(get_x(target1)*get_x(target2)+
                   get_y(target1)*get_y(target2)+
                   get_z(target1)*get_z(target2))/
                   (get_distance(target1)*get_distance(target2));

    return Math.abs(Math.acos(cos_value));//-1 - 1
}
function target_in_AoE(centre_target,splash_target){
    var d = get_distance(splash_target);
    var a = get_angle(centre_target,splash_target);
    return (d<=grand_laser_reach)&&(a<=grand_laser_angle);
}
function list_target_in_AoE(centre_target,lst){
    return filter(function(x){return target_in_AoE(centre_target,x);},lst);
}

function target_to_string(target){
    return "("+get_name(target)+","+get_x(target)+","+get_y(target)+","+get_z(target)+")";
}
function list_target_to_string(lst){
    return is_empty_list(lst)? "" : target_to_string(head(lst))+" "+list_target_to_string(tail(lst));
}
function print_dataset(dataset){
    display("Target: "+target_to_string(list_ref(dataset,0)));
    display("Hostiles in area of effect: "+list_target_to_string(list_ref(dataset,1)));
    display("Friends in area of effect: "+list_target_to_string(list_ref(dataset,2)));
}

function select_grand_laser_target(hostile_list, friendly_list) {
    // your solution here
    function generate_list_of_dataset(remaining_hostile_list,intermediate){
        if(is_empty_list(remaining_hostile_list)){
            return reverse(intermediate);
        }else{
            var this_hostile=head(remaining_hostile_list);
            var list_h_aoe=list_target_in_AoE(this_hostile,hostile_list);
            var list_f_aoe=list_target_in_AoE(this_hostile,friendly_list);
            var dataset=list(this_hostile,list_h_aoe,list_f_aoe);
            return generate_list_of_dataset(tail(remaining_hostile_list),pair(dataset,intermediate));
        }
    }
    var list_of_dataset=generate_list_of_dataset(hostile_list,[]);
    map(print_dataset,list_of_dataset);
    function choose_target(list_of_dataset){
        function get_dataset_name(dataset){
            return list_ref(dataset,0);
        }
        function count_friend(dataset){
            return length(list_ref(dataset,2));
        }
        function count_hostile(dataset){
            return length(list_ref(dataset,1));
        }
        
        var valid_list = filter(function(dataset){//valid_list is a list of dataset
                                    return count_friend(dataset)===0;
                                },list_of_dataset);

        function helper(remaining,intermediate,current_count){
            if(is_empty_list(remaining)){
                return reverse(intermediate);
            }else{
                var h = head(remaining);//h is a dataset
                var count = count_hostile(h);
                if(count<current_count||count===0){
                    return helper(tail(remaining),intermediate,current_count);
                }else if(count===current_count){
                    return helper(tail(remaining),pair(get_dataset_name(h),intermediate),current_count);
                }else{
                    return helper(tail(remaining),pair(get_dataset_name(h),[]),count);
                }
            }
        }
        return helper(valid_list,[],0);
    }

    function print_optimised_target(lst){
        if(is_empty_list(lst)){
            return "none";
    }else{
        return head(lst)+","+print_optimised_target(tail(lst));
        }
    }
    
    return print_optimised_target(choose_target(list_of_dataset));

}

// Test
select_grand_laser_target(
    list(list("TIE0001", 890, 700, 906),
         list("TIE0002", 895, 740, 912),
         list("TIE0003", -5634, -102, 8589)),
    list(list("XW0121", 862, 713, 999))
);
