/* Book: Number Fun (Maths, UKG). Content only — page types are explained in books/_template.js */
(function(){
const CS = window.CS;
const W = ["zero","one","two","three","four","five","six","seven","eight","nine","ten"];
const cap = s => s[0].toUpperCase() + s.slice(1);
const numCards = list => list.map(([n, pic, name]) => ({big:String(n), pic, n, word:W[n], say:cap(W[n]) + ". " + cap(W[n]) + " " + name + "."}));
const digits = (a, b) => CS.range(a, b).map(String);
const SHAPES = [
  {k:"circle", w:"circle", real:["⚽","🍪","🕐","🍩"]}, {k:"square", w:"square", real:["🎁","🧇"]},
  {k:"triangle", w:"triangle", real:["🍕","⛺","🔺"]}, {k:"rectangle", w:"rectangle", real:["📱","🚪","📘"]},
  {k:"oval", w:"oval", real:["🥚","🏉"]}, {k:"star", w:"star", real:["⭐","🌟"]}
];

CS.addBook({
  id:"maths", title:"Number Fun", short:"Maths", lang:"en",
  theme:{main:"#1f6fe0", main2:"#4f9bff", accent:"#ffb300", soft:"#e6f0ff", ink:"#0f2f66", sky:"#8fd3ff"},
  cover:{title:"Number Fun", sub:"Maths", badge:"UKG", kids:["🧒🏽","👧🏽"], mascot:"🦒", floats:["1","2","3"], ribbon:"Early Years Maths · UKG"},
  chapters:[
    {id:"n5", title:"Numbers 1 to 5", icon:"🖐️", sticker:"🐥",
     goals:["Count things up to 5", "Know the numbers 1, 2, 3, 4, 5", "Write 1 to 5"],
     note:"Children learn numbers by touching and moving real things. On counting pages your child can tap each picture — the book counts out loud with them.",
     home:"Put 5 spoons on a plate. Count them together, take one away, and count again.",
     pages:[
       {type:"learn", title:"Let's count 1 to 5", cards:numCards([[1,"🍎","apple"],[2,"🐥","chicks"],[3,"🎈","balloons"],[4,"🐟","fish"],[5,"⭐","stars"]])},
       {type:"trace", title:"Write 1 to 5", glyphs:[{g:"1",word:"one"},{g:"2",word:"two"},{g:"3",word:"three"},{g:"4",word:"four"},{g:"5",word:"five"}],
        tip:"Say the number name out loud while tracing. Start each number at the top."},
       {type:"mcq", title:"Count and tap", gen:"count", args:{max:5}},
       {type:"dots", title:"Join 1 to 5", seq:digits(1,5), shape:"house", pic:"🏠"},
       {type:"memory", title:"Number pairs", pairs:[["1",{pic:"🍓",n:1}],["2",{pic:"🍓",n:2}],["3",{pic:"🍓",n:3}],["4",{pic:"🍓",n:4}],["5",{pic:"🍓",n:5}]]},
       {type:"pop", title:"Pop the 3s", target:"3", pool:["1","2","4","5","8"]},
       {type:"quiz", title:"Check yourself", gens:[["count",{max:5}],["more",{max:5}]], rounds:6}
     ]},
    {id:"n10", title:"Numbers 6 to 10", icon:"🔟", sticker:"🐢",
     goals:["Count things up to 10", "Know the numbers 6 to 10", "Say which group has more"],
     note:"Pictures are laid out in rows of five, like a ten-frame, so children begin to 'see' 5 and a few more without counting one by one.",
     home:"Count 10 steps as you climb the stairs. Then count backwards coming down.",
     pages:[
       {type:"learn", title:"Let's count 6 to 10", cards:numCards([[6,"🌸","flowers"],[7,"🐞","ladybirds"],[8,"🍪","biscuits"],[9,"🚗","cars"],[10,"🧁","cupcakes"]])},
       {type:"trace", title:"Write 6 to 10", glyphs:[{g:"6",word:"six"},{g:"7",word:"seven"},{g:"8",word:"eight"},{g:"9",word:"nine"},{g:"10",word:"ten"}]},
       {type:"mcq", title:"Count and tap", gen:"count", args:{min:5, max:10}, tip:"If your child guesses, point to each picture and count together slowly."},
       {type:"dots", title:"Join 1 to 10", seq:digits(1,10), shape:"star", pic:"⭐"},
       {type:"match", title:"Match the number", pairs:[["6",{pic:"🌸",n:6}],["7",{pic:"🐞",n:7}],["8",{pic:"🍪",n:8}],["9",{pic:"🚗",n:9}],["10",{pic:"🧁",n:10}]]},
       {type:"mcq", title:"Which has more?", gen:"more", args:{max:10}},
       {type:"quiz", title:"Check yourself", gens:[["count",{max:10}],["after",{min:1, max:9}],["more",{max:10}]], rounds:6}
     ]},
    {id:"n100", title:"Numbers to 100", icon:"💯", sticker:"🐬",
     goals:["Read numbers up to 100", "Find missing numbers", "Tell 13 from 31"],
     note:"Look at the number chart together. Every number in a column ends with the same digit — children love spotting that pattern.",
     home:"Look for big numbers around you: house numbers, car plates, calendar dates. Read them aloud.",
     pages:[
       {type:"chart", title:"Numbers 1 to 50", from:1, to:50},
       {type:"chart", title:"Numbers 51 to 100", from:51, to:100},
       {type:"dots", title:"Join 11 to 20", seq:digits(11,20), shape:"fish", pic:"🐟"},
       {type:"mcq", title:"Missing numbers", gen:"gap", args:{min:10, max:100}},
       {type:"pop", title:"Pop 13, not 31!", target:"13", pool:["31","30","33","18","12"],
        tip:"13 and 31 are often mixed up. Say 'thir-teen: one ten and three' while pointing at the digits."},
       {type:"quiz", title:"Check yourself", gens:[["gap",{min:10, max:100}],["after",{min:10, max:99}],["before",{min:11, max:100}]], rounds:6}
     ]},
    {id:"bab", title:"Before, After, Between", icon:"↔️", sticker:"🐿️",
     goals:["Say the number that comes after", "Say the number that comes before", "Find the number in between"],
     note:"'After' means one more; 'before' means one less. Counting on and counting back out loud is the skill being built here.",
     home:"At bedtime, say a number and ask: what comes after it? What comes before it?",
     pages:[
       {type:"learn", title:"Before and after", cols:1, cards:[
         {big:"4 → 5", word:"after", say:"After 4 comes 5. After means one more."},
         {big:"3 ← 4", word:"before", say:"Before 4 comes 3. Before means one less."},
         {big:"4 _ 6", word:"between", say:"Between 4 and 6 comes 5."}]},
       {type:"mcq", title:"What comes after?", gen:"after", args:{max:50}},
       {type:"mcq", title:"What comes before?", gen:"before", args:{max:50}},
       {type:"mcq", title:"What comes between?", gen:"between", args:{max:50}},
       {type:"crate", title:"Crate challenge", subject:"maths", level:4, face:"__ , 7"},
       {type:"quiz", title:"Check yourself", gens:[["after",{max:100}],["before",{max:100}],["between",{max:100}]], rounds:6}
     ]},
    {id:"cmp", title:"More and Less", icon:"⚖️", sticker:"🐊",
     goals:["Say which group has more or less", "Find the bigger and smaller number", "Use >, < and ="],
     note:"The crocodile trick: its mouth always opens towards the bigger number, because it is hungry. Draw it together on paper.",
     home:"Make two piles of toys. Ask which pile has more, then check by counting.",
     pages:[
       {type:"learn", title:"Bigger, smaller, same", cards:[
         {big:">", word:"greater than", pic:"🐊", say:"Greater than. The crocodile eats the bigger number."},
         {big:"<", word:"less than", pic:"🐊", say:"Less than. The smaller number is on this side."},
         {big:"=", word:"equal to", pic:"⚖️", say:"Equal to. Both sides are the same."},
         {big:"🐘 🐜", word:"big and small", say:"An elephant is big. An ant is small."}]},
       {type:"mcq", title:"Which has more?", gen:"more", args:{max:10}},
       {type:"mcq", title:"Bigger or smaller?", gen:"compare", args:{max:50, mode:"mix"}},
       {type:"mcq", title:"Hungry crocodile", gen:"symbol", args:{max:10}, tip:"Draw the crocodile mouth on paper and let your child feed it the bigger number."},
       {type:"sort", title:"Small and big numbers", bins:[{t:"less than 10", pic:"🐜"},{t:"more than 10", pic:"🐘"}],
        items:[["3",0,"three"],["7",0,"seven"],["1",0,"one"],["9",0,"nine"],["14",1,"fourteen"],["25",1,"twenty five"],["18",1,"eighteen"],["40",1,"forty"]]},
       {type:"crate", title:"Crate challenge", subject:"maths", level:5, face:"12 or 21"},
       {type:"quiz", title:"Check yourself", gens:[["more",{max:10}],["compare",{max:100, mode:"mix"}],["symbol",{max:20}]], rounds:6}
     ]},
    {id:"shp", title:"Shapes", icon:"🔺", sticker:"🦋",
     goals:["Name circle, square, triangle, rectangle, oval and star", "Find shapes in things around us"],
     note:"Shapes are everywhere. Children remember a shape best when they find it in a real object — a plate, a door, a slice of pizza.",
     home:"Go on a shape hunt in the kitchen. Find 3 circles and 2 rectangles.",
     pages:[
       {type:"learn", title:"Meet the shapes", cards:[
         {shape:"circle", word:"circle", pic:"⚽", say:"Circle. A ball is round like a circle."},
         {shape:"square", word:"square", pic:"🎁", say:"Square. It has four equal sides."},
         {shape:"triangle", word:"triangle", pic:"🍕", say:"Triangle. It has three sides."},
         {shape:"rectangle", word:"rectangle", pic:"🚪", say:"Rectangle. A door is a rectangle."},
         {shape:"oval", word:"oval", pic:"🥚", say:"Oval. An egg is an oval."},
         {shape:"star", word:"star", pic:"⭐", say:"Star. It has five points."}]},
       {type:"mcq", title:"Name the shape", gen:"shapeName", args:{pool:SHAPES}},
       {type:"colour", title:"Colour the shapes", scene:"shapes", crayons:["red","blue","yellow","green","orange","purple"]},
       {type:"sort", title:"Round or pointy?", bins:[{t:"round", pic:"🔴"},{t:"pointy", pic:"🔺"}],
        items:[["⚽",0,"ball"],["🍩",0,"doughnut"],["🕐",0,"clock"],["🍪",0,"biscuit"],["🍕",1,"pizza slice"],["⛺",1,"tent"],["📐",1,"set square"],["🔺",1,"triangle"]]},
       {type:"memory", title:"Shape pairs", pairs:SHAPES.map(s => [{shape:s.k, size:54, say:s.w}, s.w])},
       {type:"quiz", title:"Check yourself", gens:[["shapeName",{pool:SHAPES}],["shapeReal",{pool:SHAPES}],["shapeFind",{pool:SHAPES}]], rounds:6}
     ]},
    {id:"pat", title:"Patterns", icon:"🔁", sticker:"🐝",
     goals:["See what repeats", "Say what comes next"],
     note:"Patterns are early algebra. Clap and stamp patterns too: clap, stamp, clap, stamp — what comes next?",
     home:"Make a pattern with spoons and forks on the table, then let your child continue it.",
     pages:[
       {type:"learn", title:"What is a pattern?", cols:1, cards:[
         {pic:"🍎🍌🍎🍌🍎🍌", word:"apple, banana, again and again", say:"Apple, banana, apple, banana. It repeats!"},
         {pic:"🔴🔵🔵🔴🔵🔵", word:"red, blue, blue", say:"Red, blue, blue. Red, blue, blue."},
         {pic:"⭐🌙☀️⭐🌙☀️", word:"star, moon, sun", say:"Star, moon, sun. Star, moon, sun."}]},
       {type:"mcq", title:"What comes next?", gen:"pattern", args:{len:5, sets:[["🍎","🍌"],["🔴","🔵"],["🐶","🐱"],["⭐","🌙"]]}},
       {type:"mcq", title:"Trickier patterns", gen:"pattern", args:{len:6, sets:[["🔴","🔵","🔵"],["⭐","🌙","☀️"],["🍎","🍎","🍌"],["🟢","🟡","🔴"]]}},
       {type:"dots", title:"Join 1 to 8", seq:digits(1,8), shape:"heart", pic:"❤️"},
       {type:"quiz", title:"Check yourself", gens:[["pattern",{len:5, sets:[["🍎","🍌"],["🔴","🔵"],["🐶","🐱"]]}],["pattern",{len:6, sets:[["🔴","🔵","🔵"],["⭐","🌙","☀️"],["🟢","🟡","🔴"]]}]], rounds:6}
     ]},
    {id:"add", title:"Adding", icon:"➕", sticker:"🦊",
     goals:["Put two groups together", "Add numbers up to 10"],
     note:"Start with pictures, then move to numbers. 'Adding' means putting together and counting all.",
     home:"Put 3 grapes and 2 grapes on a plate. How many altogether? Eat them to check!",
     pages:[
       {type:"learn", title:"Putting together", cards:[
         {big:"1 + 1 = 2", pic:"🐥🐥", say:"One plus one makes two."},
         {big:"2 + 1 = 3", pic:"🍎🍎🍎", say:"Two plus one makes three."},
         {big:"2 + 2 = 4", pic:"🎈🎈🎈🎈", say:"Two plus two makes four."},
         {big:"3 + 2 = 5", pic:"⭐⭐⭐⭐⭐", say:"Three plus two makes five."}]},
       {type:"mcq", title:"Add the pictures", gen:"add", args:{max:5}},
       {type:"mcq", title:"Add up to 10", gen:"add", args:{max:10}},
       {type:"mcq", title:"Add the numbers", gen:"addNum", args:{max:10}},
       {type:"pop", title:"Make 5", make:"5", makeSay:"five", targets:["2+3","4+1","1+4","3+2","5+0"], pool:["2+2","3+3","1+1","4+2","6+1"]},
       {type:"crate", title:"Crate challenge", subject:"maths", level:1, face:"4 + 3"},
       {type:"quiz", title:"Check yourself", gens:[["add",{max:10}],["addNum",{max:10}]], rounds:6}
     ]},
    {id:"sub", title:"Taking Away", icon:"➖", sticker:"🐼",
     goals:["Take away and count what is left", "Subtract numbers up to 10"],
     note:"Crossed-out pictures show 'taking away'. Let your child cover the crossed ones with a finger and count the rest.",
     home:"Put 6 biscuits on a plate. Eat 2. How many are left?",
     pages:[
       {type:"learn", title:"Taking away", cards:[
         {big:"3 − 1 = 2", pic:"🍎🍎🍎", say:"Three take away one leaves two."},
         {big:"4 − 2 = 2", pic:"🎈🎈🎈🎈", say:"Four take away two leaves two."},
         {big:"5 − 3 = 2", pic:"🐟🐟🐟🐟🐟", say:"Five take away three leaves two."},
         {big:"5 − 5 = 0", pic:"🍪", say:"Five take away five leaves zero. None left!"}]},
       {type:"mcq", title:"How many are left?", gen:"sub", args:{max:5}},
       {type:"mcq", title:"Take away up to 10", gen:"sub", args:{max:10}},
       {type:"mcq", title:"Subtract the numbers", gen:"subNum", args:{max:10}},
       {type:"crate", title:"Crate challenge", subject:"maths", level:2, face:"9 − 4"},
       {type:"quiz", title:"Check yourself", gens:[["sub",{max:10}],["subNum",{max:10}]], rounds:6}
     ]},
    {id:"tab", title:"Skip Counting & Tables", icon:"✖️", sticker:"🦁",
     goals:["Count in 2s, 5s and 10s", "Start the tables of 2 to 5"],
     note:"Skip counting is the doorway to tables. Say it like a song: 2, 4, 6, 8 — who do we appreciate?",
     home:"Count pairs of socks in 2s, and fingers on hands in 5s.",
     pages:[
       {type:"chart", title:"Count in 2s", from:1, to:50, step:2},
       {type:"chart", title:"Count in 5s", from:1, to:50, step:5},
       {type:"mcq", title:"Skip count", gen:"skip", args:{step:[2,5,10]}},
       {type:"learn", title:"Table of 2", cols:2, cards:CS.range(1, 10).map(n => ({big:"2 × " + n + " = " + (2 * n), say:"Two times " + n + " is " + (2 * n) + "."}))},
       {type:"mcq", title:"Tables 2 to 5", gen:"table", args:{min:2, max:5, upto:10}},
       {type:"crate", title:"Crate challenge", subject:"maths", level:6, face:"3 × 4"},
       {type:"quiz", title:"Check yourself", gens:[["skip",{step:[2,5,10]}],["table",{min:2, max:5, upto:10}]], rounds:6}
     ]}
  ]
});
})();
