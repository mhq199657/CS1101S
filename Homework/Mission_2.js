// Task 1
function mosaic(p1, p2, p3, p4){
    return beside(stack(p4,p3),stack(p1,p2));
}

// Test
// show(mosaic(rcross_bb, sail_bb, corner_bb, nova_bb));

// Task 2
function simple_fractal(pic) {
    return beside(pic,stack(pic,pic));
}

// Test
// show(simple_fractal(make_cross(rcross_bb)));

// Task 3
function fractal(pic, n) {
    if(n===1)
    {
        return pic;
    }
    else
    {
        return beside(pic,stackn(2,fractal(pic,n-1)));
    }
}

// Test
 //show(fractal(make_cross(rcross_bb), 7));

//Sidequest 2.1
function persian(rune, count) {
    // your answer here
    function besiden(n, pic){
        return quarter_turn_right(stackn(n,quarter_turn_left(pic)));
    }

    function centre(pic){
        return beside(stack(quarter_turn_right(pic),pic),stack(turn_upside_down(pic),quarter_turn_left(pic)));
    }
    function beside_frac(proportion, left, right){
        return quarter_turn_left(stack_frac(proportion,quarter_turn_right(left),quarter_turn_right(right)));
    }
    var horizontal_edge=besiden(count, rune);
    var vertical_edge=stackn(count - 2, rune);
    var middle=beside_frac(1 / count,vertical_edge,beside_frac((count - 2)/(count - 1),centre(rune),vertical_edge));
    return stack_frac(1 / count,horizontal_edge,stack_frac((count - 2)/(count - 1),middle,horizontal_edge));


}