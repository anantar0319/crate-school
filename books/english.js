/* Book: Word Garden (English, UKG). Content only — see books/_template.js */
(function(){
const CS = window.CS;
const ABC = [["A","Apple","🍎"],["B","Ball","⚽"],["C","Cat","🐱"],["D","Dog","🐶"],["E","Elephant","🐘"],["F","Fish","🐟"],["G","Grapes","🍇"],
  ["H","Hat","🎩"],["I","Ice cream","🍦"],["J","Juice","🧃"],["K","Kite","🪁"],["L","Lion","🦁"],["M","Mango","🥭"],["N","Nose","👃"],
  ["O","Orange","🍊"],["P","Parrot","🦜"],["Q","Queen","👸"],["R","Rabbit","🐰"],["S","Sun","☀️"],["T","Tiger","🐯"],["U","Umbrella","☂️"],
  ["V","Van","🚐"],["W","Watch","⌚"],["X","Box","📦"],["Y","Yo-yo","🪀"],["Z","Zebra","🦓"]];
const letterCards = (a, b) => ABC.slice(a, b).map(([l, w, pic]) => l === "X"
  ? {big:"X x", word:w, pic, sub:"x at the end", say:"X, as in box."}
  : {big:l + " " + l.toLowerCase(), word:w, pic, say:l + " for " + w.toLowerCase()});
const pool = (a, b) => ABC.slice(a, b).map(([l, w, pic]) => ({w, pic, f:l === "X" ? null : l}));
const letters = (a, b) => ABC.slice(a, b).map(x => x[0]);
const WORDS = [["cat","🐱"],["bat","🦇"],["hat","🎩"],["rat","🐀"],["van","🚐"],["bag","🎒"],["pen","🖊️"],["hen","🐔"],["bed","🛏️"],["ten","🔟"],
  ["pig","🐷"],["pin","📌"],["lip","👄"],["dog","🐶"],["box","📦"],["pot","🍲"],["log","🪵"],["sun","☀️"],["bus","🚌"],["cup","🥤"],["nut","🥜"]].map(([w, pic]) => ({w, pic}));
const cvcCards = list => list.map(w => { const it = WORDS.find(x => x.w === w); return {big:w, pic:it.pic, say:w.split("").join(", ") + ". " + w}; });
const COLOURS = [["red","#e53935","🍎"],["blue","#1e88e5","🐳"],["green","#43a047","🥦"],["yellow","#fdd835","🍌"],["orange","#fb8c00","🥕"],
  ["purple","#8e24aa","🍇"],["pink","#f06292","🌸"],["brown","#8d5524","🐻"],["black","#212121","🎩"],["white","#ffffff","☁️"]].map(([w, hex, pic]) => ({w, hex, pic}));
const FRUITS = [["Apple","🍎"],["Banana","🍌"],["Mango","🥭"],["Grapes","🍇"],["Orange","🍊"],["Watermelon","🍉"],["Strawberry","🍓"],["Pineapple","🍍"],["Cherry","🍒"]].map(([w, pic]) => ({w, pic}));
const VEG = [["Carrot","🥕"],["Potato","🥔"],["Tomato","🍅"],["Onion","🧅"],["Corn","🌽"],["Broccoli","🥦"],["Brinjal","🍆"],["Cucumber","🥒"],["Chilli","🌶️"]].map(([w, pic]) => ({w, pic}));
const ANIMALS = [["cow","🐄","moo"],["dog","🐶","woof"],["cat","🐱","meow"],["duck","🦆","quack"],["lion","🦁","roar"],["sheep","🐑","baa"],
  ["hen","🐔","cluck"],["horse","🐴","neigh"],["frog","🐸","croak"]].map(([w, pic, snd]) => ({w, pic, snd}));
const OPP = [["big","small","🐘","🐭"],["hot","cold","🔥","🧊"],["up","down","⬆️","⬇️"],["happy","sad","😀","😢"],["day","night","🌞","🌙"],
  ["fast","slow","🐇","🐢"],["tall","short","🦒","🐧"],["open","closed","📖","📕"]];
const RHYMES = [["cat","hat","bat","rat","mat"],["hen","pen","ten","men"],["pig","wig","dig","big"],["dog","log","fog","jog"],["sun","run","fun","bun"],["pot","hot","dot","cot"]];
const smallPairs = s => s.split("").map(l => [l, l.toLowerCase()]);

CS.addBook({
  id:"english", title:"Word Garden", short:"English", lang:"en",
  theme:{main:"#e0314b", main2:"#ff6b81", accent:"#ffcc00", soft:"#ffeef0", ink:"#6b0f22", sky:"#9fdcff"},
  cover:{title:"Word Garden", sub:"English", badge:"UKG", kids:["👧🏽","🧒🏽"], mascot:"🐝", floats:["A","b","C"], ribbon:"Early Years English · UKG"},
  chapters:[
    {id:"am", title:"Letters A to M", icon:"🔤", sticker:"🌷",
     goals:["Say the letters A to M", "Know a word for each letter", "Write capital A to M"],
     note:"Say the letter name and a word: 'A for apple'. Tracing builds the hand movement; saying it builds memory.",
     home:"Play I-spy with letters: 'I spy something that starts with B'.",
     pages:[
       {type:"learn", title:"A to F", cards:letterCards(0, 6)},
       {type:"learn", title:"G to M", cards:letterCards(6, 13)},
       {type:"trace", title:"Write A B C D", glyphs:letters(0, 4).map((g, i) => ({g, pic:ABC[i][2], word:ABC[i][1]}))},
       {type:"trace", title:"Write E F G H", glyphs:letters(4, 8).map((g, i) => ({g, pic:ABC[i + 4][2], word:ABC[i + 4][1]}))},
       {type:"trace", title:"Write I J K L M", glyphs:letters(8, 13).map((g, i) => ({g, pic:ABC[i + 8][2], word:ABC[i + 8][1]}))},
       {type:"mcq", title:"First letter", gen:"firstLetter", args:{pool:pool(0, 13), letters:letters(0, 13)}},
       {type:"memory", title:"Letter and picture", pairs:ABC.slice(0, 13).map(x => [x[0], {pic:x[2], say:x[1]}])},
       {type:"dots", title:"Join A to J", seq:letters(0, 10), shape:"fish", pic:"🐠"},
       {type:"quiz", title:"Check yourself", gens:[["firstLetter",{pool:pool(0, 13), letters:letters(0, 13)}],["letterPic",{pool:pool(0, 13)}],["seqGap",{seq:letters(0, 13)}]], rounds:6}
     ]},
    {id:"nz", title:"Letters N to Z", icon:"🔠", sticker:"🌻",
     goals:["Say the letters N to Z", "Know a word for each letter", "Say the whole alphabet in order"],
     note:"Sing the alphabet song, then stop at a letter and ask what comes next.",
     home:"Find letters on food packets and read them together.",
     pages:[
       {type:"learn", title:"N to S", cards:letterCards(13, 19)},
       {type:"learn", title:"T to Z", cards:letterCards(19, 26)},
       {type:"trace", title:"Write N O P Q", glyphs:letters(13, 17)},
       {type:"trace", title:"Write R S T U", glyphs:letters(17, 21)},
       {type:"trace", title:"Write V W X Y Z", glyphs:letters(21, 26)},
       {type:"mcq", title:"First letter", gen:"firstLetter", args:{pool:pool(13, 26), letters:letters(13, 26)}},
       {type:"match", title:"Letter and picture", pairs:ABC.slice(13, 26).filter(x => x[0] !== "X").map(x => [x[0], {pic:x[2], say:x[1]}])},
       {type:"pop", title:"Pop the W", target:"W", pool:["M","V","N","A"], tip:"W and M look alike upside down. Trace both in the air with a finger."},
       {type:"quiz", title:"Check yourself", gens:[["firstLetter",{pool:pool(13, 26), letters:letters(13, 26)}],["letterPic",{pool:pool(13, 26)}],["seqNext",{seq:letters(0, 26)}]], rounds:6}
     ]},
    {id:"small", title:"Small Letters", icon:"🔡", sticker:"🐞",
     goals:["Match capital and small letters", "Write small a to f", "Tell b, d, p and q apart"],
     note:"b and d are the most common mix-up. Trick: make a 'bed' with both fists — b is the left side, d is the right side.",
     home:"Write capital letters on paper and small letters on stickers. Your child sticks each small letter on its capital.",
     pages:[
       {type:"match", title:"Capital and small", n:5, pairs:smallPairs("ABDEGHMNQR")},
       {type:"trace", title:"Write a b c d e f", glyphs:["a","b","c","d","e","f"]},
       {type:"mcq", title:"Find the small letter", gen:"caseMatch", args:{letters:"ABDEFGHNQRT", confuse:{b:["d","p","q"], d:["b","p","q"], q:["p","g","d"], n:["m","h","u"]}}},
       {type:"memory", title:"Big and small pairs", pairs:smallPairs("ABDEFGHKLMNRT")},
       {type:"pop", title:"Pop the b", target:"b", pool:["d","p","q","h"], tip:"Use the 'bed' trick: b comes first, like the headboard."},
       {type:"quiz", title:"Check yourself", gens:[["caseMatch",{letters:"ABCDEFGHIJKLMNOPQRSTUVWXYZ"}]], rounds:6}
     ]},
    {id:"vow", title:"Vowels", icon:"🅰️", sticker:"🦜",
     goals:["Know the five vowels a e i o u", "Find the vowel in a word"],
     note:"Every word needs a vowel. Say words slowly and listen for the middle sound: c-a-t.",
     home:"Say a short word and ask your child for the middle sound.",
     pages:[
       {type:"learn", title:"The five vowels", cards:[
         {big:"a", word:"apple", pic:"🍎", say:"a for apple"}, {big:"e", word:"egg", pic:"🥚", say:"e for egg"},
         {big:"i", word:"insect", pic:"🐛", say:"i for insect"}, {big:"o", word:"octopus", pic:"🐙", say:"o for octopus"},
         {big:"u", word:"umbrella", pic:"☂️", say:"u for umbrella"}]},
       {type:"sort", title:"Vowel or not?", bins:[{t:"vowel", pic:"🅰️"},{t:"not a vowel", pic:"🔤"}],
        items:[["a",0],["e",0],["i",0],["o",0],["u",0],["b",1],["m",1],["s",1],["t",1],["k",1]]},
       {type:"mcq", title:"Is it a vowel?", gen:"binary", args:{ask:"Is it a vowel?", a:{label:"vowel", items:["a","e","i","o","u"]}, b:{label:"not a vowel", items:["b","c","d","f","g","h","m","n","p","s","t"]}}},
       {type:"mcq", title:"Missing vowel", gen:"missing", args:{pool:WORDS, letters:["a","e","i","o","u"], vowel:true}},
       {type:"quiz", title:"Check yourself", gens:[["missing",{pool:WORDS, letters:["a","e","i","o","u"], vowel:true}],["binary",{ask:"Is it a vowel?", a:{label:"vowel", items:["a","e","i","o","u"]}, b:{label:"not a vowel", items:["b","d","f","h","m","r","t"]}}]], rounds:6}
     ]},
    {id:"cvc", title:"Three-Letter Words", icon:"🐱", sticker:"🐸",
     goals:["Read short words like cat, pen and dog", "Sound out c-a-t", "Find words that rhyme"],
     note:"Each word card says the sounds and then blends them: c, a, t — cat. Ask your child to blend with you.",
     home:"Make words with fridge letters: change the first letter of 'cat' to make bat, hat, rat.",
     pages:[
       {type:"learn", title:"Words with a", cards:cvcCards(["cat","bat","hat","rat","van","bag"])},
       {type:"learn", title:"Words with e and i", cards:cvcCards(["pen","hen","bed","ten","pig","pin"])},
       {type:"learn", title:"Words with o and u", cards:cvcCards(["dog","box","pot","sun","bus","nut"])},
       {type:"mcq", title:"Read the word", gen:"picWord", args:{pool:WORDS, ask:"Which word matches the picture?"}},
       {type:"mcq", title:"Missing letter", gen:"missing", args:{pool:WORDS, letters:"abcdeghilnoprstu".split("")}},
       {type:"match", title:"Word and picture", pairs:WORDS.map(x => [x.w, {pic:x.pic, say:x.w}])},
       {type:"mcq", title:"Rhyming words", gen:"rhyme", args:{sets:RHYMES}},
       {type:"quiz", title:"Check yourself", gens:[["picWord",{pool:WORDS, ask:"Which word matches the picture?"}],["missing",{pool:WORDS, letters:["a","e","i","o","u"], vowel:true}],["rhyme",{sets:RHYMES}]], rounds:6}
     ]},
    {id:"col", title:"Colours", icon:"🎨", sticker:"🌈",
     goals:["Name ten colours", "Find a colour when you hear it"],
     note:"Name colours during the day: the red bus, the green leaf. Real-life naming sticks better than drills.",
     home:"Sort a handful of toys or clothes by colour.",
     pages:[
       {type:"learn", title:"My colours", cards:COLOURS.map(c => ({sw:c.hex, pic:c.pic, word:c.w, say:c.w}))},
       {type:"colour", title:"Colour the fruit", scene:"fruits"},
       {type:"mcq", title:"What colour?", gen:"swName", args:{pool:COLOURS}},
       {type:"mcq", title:"Find the colour", gen:"nameSw", args:{pool:COLOURS}},
       {type:"memory", title:"Colour pairs", pairs:COLOURS.map(c => [{sw:c.hex, say:c.w}, c.w])},
       {type:"quiz", title:"Check yourself", gens:[["swName",{pool:COLOURS}],["nameSw",{pool:COLOURS}]], rounds:6}
     ]},
    {id:"fv", title:"Fruits & Vegetables", icon:"🍎", sticker:"🍓",
     goals:["Name nine fruits", "Name nine vegetables", "Say if it is a fruit or a vegetable"],
     note:"Take this book to the kitchen or market. Touch, smell and name real fruits and vegetables.",
     home:"At the market, ask your child to find three fruits and three vegetables.",
     pages:[
       {type:"learn", title:"Fruits", cards:FRUITS.map(f => ({pic:f.pic, word:f.w}))},
       {type:"learn", title:"Vegetables", cards:VEG.map(f => ({pic:f.pic, word:f.w}))},
       {type:"sort", title:"Fruit or vegetable?", bins:[{t:"fruit", pic:"🧺"},{t:"vegetable", pic:"🥗"}],
        items:FRUITS.slice(0, 5).map(f => [f.pic, 0, f.w]).concat(VEG.slice(0, 5).map(v => [v.pic, 1, v.w])), n:8},
       {type:"mcq", title:"What is it?", gen:"picWord", args:{pool:FRUITS.concat(VEG)}},
       {type:"quiz", title:"Check yourself", gens:[["picWord",{pool:FRUITS.concat(VEG)}],["wordPic",{pool:FRUITS.concat(VEG)}]], rounds:6}
     ]},
    {id:"ani", title:"Animals", icon:"🐘", sticker:"🐯",
     goals:["Name animals", "Know animal sounds", "Tell farm animals from wild animals"],
     note:"Make the animal sounds together — children remember words better when they move and play.",
     home:"Play 'Who am I?': make an animal sound and your child names the animal.",
     pages:[
       {type:"learn", title:"Animals and their sounds", cards:ANIMALS.map(a => ({pic:a.pic, word:a.w, sub:"“" + a.snd + "”", say:"The " + a.w + " says " + a.snd + "."}))},
       {type:"mcq", title:"Who says it?", gen:"sound", args:{pool:ANIMALS}},
       {type:"sort", title:"Farm or wild?", bins:[{t:"farm", pic:"🏡"},{t:"wild", pic:"🌳"}],
        items:[["🐄",0,"cow"],["🐔",0,"hen"],["🐑",0,"sheep"],["🐴",0,"horse"],["🦁",1,"lion"],["🐯",1,"tiger"],["🐘",1,"elephant"],["🦓",1,"zebra"]]},
       {type:"memory", title:"Animal pairs", pairs:ANIMALS.map(a => [{pic:a.pic, say:a.w}, a.w])},
       {type:"quiz", title:"Check yourself", gens:[["sound",{pool:ANIMALS}],["picWord",{pool:ANIMALS}]], rounds:6}
     ]},
    {id:"opp", title:"Opposites", icon:"↕️", sticker:"🦒",
     goals:["Know opposite words", "Use big, small, hot, cold and more"],
     note:"Act out opposites: stand up tall, crouch down short; walk fast, walk slow.",
     home:"Find opposites at home: an open door and a closed door, a hot cup and a cold glass.",
     pages:[
       {type:"learn", title:"Opposites", cards:OPP.map(p => ({pic:p[2] + " " + p[3], word:p[0] + " · " + p[1], say:p[0] + " and " + p[1]}))},
       {type:"match", title:"Match the opposites", pairs:OPP.map(p => [p[0], p[1]])},
       {type:"mcq", title:"What is the opposite?", gen:"opposite", args:{pairs:OPP}},
       {type:"quiz", title:"Check yourself", gens:[["opposite",{pairs:OPP}]], rounds:6}
     ]},
    {id:"rhy", title:"Rhymes", icon:"🎵", sticker:"⭐",
     goals:["Sing two rhymes", "Hear words that rhyme"],
     note:"Sing slowly and point to each line. Pause before the rhyming word and let your child finish it.",
     home:"Sing a rhyme at bath time and leave out the last word of each line.",
     pages:[
       {type:"rhyme", title:"Twinkle, Twinkle, Little Star", pics:"⭐🌙✨", lines:["Twinkle, twinkle, little star,", "How I wonder what you are!",
         "Up above the world so high,", "Like a diamond in the sky.", "Twinkle, twinkle, little star,", "How I wonder what you are!"]},
       {type:"rhyme", title:"Rain, Rain, Go Away", pics:"🌧️☂️🌈", lines:["Rain, rain, go away,", "Come again another day.",
         "All the children want to play,", "Rain, rain, go away."]},
       {type:"mcq", title:"Rhyming words", gen:"rhyme", args:{sets:[["star","car","jar","far"],["high","sky","fly","my"],["day","play","say","way"]].concat(RHYMES)}},
       {type:"quiz", title:"Check yourself", gens:[["rhyme",{sets:RHYMES}]], rounds:6}
     ]}
  ]
});
})();
