// Task 1
function steps(r1, r2, r3, r4){
    // your answer here
    function make_layer(p1,p2,p3,p4){ //starting from top-right, going counterclockwise
	    return beside(stack(p2,p3),stack(p1,p4));
    }
    var b=blank_bb;
    var top_right=make_layer(rcross_bb,b,b,b);
    var top_left=make_layer(b,nova_bb,b,b);
    var bot_left=make_layer(b,b,corner_bb,b);
    var bot_right=make_layer(b,b,b,sail_bb);
    function overlay4(p1,p2,p3,p4){//starting from the least deep, going deepest
        return overlay(overlay(p1,p2),overlay(p3,p4));
    }
    return overlay4(top_left,bot_left,bot_right,top_right);

}

// Test
// show(steps(rcross_bb, sail_bb, corner_bb, nova_bb));

// Task 2

    
function tree(n, rune){

    return n === 1 ? rune : overlay_frac((n-1)/n, scale((n-1)/n,tree(n-1, rune)), rune);
}



// Test
// show(tree(4, circle_bb));