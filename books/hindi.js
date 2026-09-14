/* Book: मेरी हिंदी (Hindi, UKG). Content only — see books/_template.js
 * Children see and hear Hindi; the grown-up notes are in English. */
(function(){
const CS = window.CS;
const SWAR = [["अ","अनानास","🍍"],["आ","आम","🥭"],["इ","इमारत","🏢"],["ई","ईंट","🧱"],["उ","उल्लू","🦉"],["ऊ","ऊन","🧶"],["ऋ","ऋषि","🧘"],
  ["ए","एड़ी","🦶"],["ऐ","ऐनक","👓"],["ओ","ओस","💧"],["औ","औरत","👩"],["अं","अंगूर","🍇"],["अः","",""]];
const VY = [["क","कबूतर","🕊️"],["ख","खरगोश","🐰"],["ग","गमला","🪴"],["घ","घड़ी","⌚"],["ङ","",""],
  ["च","चम्मच","🥄"],["छ","छतरी","☂️"],["ज","जहाज़","🚢"],["झ","झंडा","🚩"],["ञ","",""],
  ["ट","टमाटर","🍅"],["ठ","ठेला","🛒"],["ड","डलिया","🧺"],["ढ","ढोलक","🥁"],["ण","बाण","🏹"],
  ["त","तरबूज़","🍉"],["थ","थाली","🍽️"],["द","दरवाज़ा","🚪"],["ध","धागा","🧵"],["न","नल","🚰"],
  ["प","पतंग","🪁"],["फ","फूल","🌸"],["ब","बतख","🦆"],["भ","भालू","🐻"],["म","मछली","🐟"],
  ["य","योग","🧘"],["र","रेल","🚂"],["ल","लकड़ी","🪵"],["व","वन","🌳"],["श","शेर","🦁"],["ष","षट्कोण","⬡"],
  ["स","सेब","🍎"],["ह","हाथी","🐘"],["क्ष","कक्षा","🏫"],["त्र","त्रिशूल","🔱"],["ज्ञ","यज्ञ","🔥"]];
/* ण, क्ष and ज्ञ do not begin their words, so the card says "बाण में ण" and quizzes skip them */
const INSIDE = {"ण":1, "क्ष":1, "ज्ञ":1};
const card = ([l, w, pic]) => !w ? {big:l, say:l} : INSIDE[l] ? {big:l, word:w, pic, sub:w + " में " + l, say:w + " में " + l} : {big:l, word:w, pic};
const cards = (list, a, b) => list.slice(a, b).map(card);
const pool = (list, a, b) => list.slice(a, b).filter(x => x[1] && !INSIDE[x[0]]).map(([f, w, pic]) => ({f, w, pic}));
const lettersOf = (list, a, b) => list.slice(a, b).map(x => x[0]);
const SW10 = ["अ","आ","इ","ई","उ","ऊ","ए","ऐ","ओ","औ"];
const VYALL = VY.map(x => x[0]);
const WORDS = [["घर","🏠"],["नल","🚰"],["जल","💧"],["बस","🚌"],["कप","☕"],["कलम","🖊️"],["नमक","🧂"],["मगर","🐊"],["बतख","🦆"],["शहद","🍯"],["महल","🏰"],["फल","🍎"]]
  .map(([w, pic]) => ({w, pic}));
const wordCards = list => list.map(({w, pic}) => ({big:w, pic, say:CS.graphemes(w).join(", ") + "। " + w}));
const DIG = ["०","१","२","३","४","५","६","७","८","९","१०","११"];
const NUMW = ["","एक","दो","तीन","चार","पाँच","छह","सात","आठ","नौ","दस"];
const NUMS = CS.range(1, 10).map(n => ({d:DIG[n], w:NUMW[n]}));
const PICS = ["🍎","🐥","🎈","🐟","⭐","🌸","🐞","🍪","🚗","🧁"];
const COLOURS = [["लाल","#e53935","🍎"],["नीला","#1e88e5","🐳"],["हरा","#43a047","🥦"],["पीला","#fdd835","🍌"],["नारंगी","#fb8c00","🥕"],
  ["बैंगनी","#8e24aa","🍇"],["गुलाबी","#f06292","🌸"],["भूरा","#8d5524","🐻"],["काला","#212121","🎩"],["सफ़ेद","#ffffff","☁️"]].map(([w, hex, pic]) => ({w, hex, pic}));
const FRUITS = [["सेब","🍎","स"],["आम","🥭","आ"],["केला","🍌","क"],["अंगूर","🍇","अं"],["संतरा","🍊","स"],["तरबूज़","🍉","त"],
  ["नारियल","🥥","न"],["नींबू","🍋","न"],["नाशपाती","🍐","न"],["अनानास","🍍","अ"]].map(([w, pic, f]) => ({w, pic, f}));
const ANIMALS = [["कुत्ता","🐶","क"],["बिल्ली","🐱","ब"],["गाय","🐄","ग"],["बकरी","🐐","ब"],["हाथी","🐘","ह"],["शेर","🦁","श"],
  ["बंदर","🐒","ब"],["मछली","🐟","म"],["घोड़ा","🐴","घ"],["चूहा","🐭","च"],["खरगोश","🐰","ख"],["मोर","🦚","म"]].map(([w, pic, f]) => ({w, pic, f}));
const ALLLET = SWAR.map(x => x[0]).concat(VYALL);

CS.addBook({
  id:"hindi", title:"मेरी हिंदी", short:"Hindi", lang:"hi",
  theme:{main:"#d62828", main2:"#ff5a4e", accent:"#ffd23f", soft:"#fff0e8", ink:"#6a1b0a", sky:"#8fd3ff"},
  cover:{title:"मेरी हिंदी", sub:"हिंदी", badge:"UKG", kids:["🧒🏽","👧🏽"], mascot:"🐘", floats:["अ","आ","क"], script:true, ribbon:"Early Years Hindi · UKG"},
  chapters:[
    {id:"swar", title:"स्वर", en:"Vowels", icon:"अ", sticker:"🪁",
     goals:["अ से अः तक स्वर पहचानना", "हर स्वर से एक शब्द बोलना", "स्वर लिखना"],
     note:"Say the letter and the word together: 'अ से अनानास'. If a Hindi voice is not installed, ask a grown-up to read the cards aloud.",
     home:"Point to things at home and ask which स्वर they start with: आम, ईंट, उल्लू.",
     pages:[
       {type:"learn", title:"अ से ऊ", cards:cards(SWAR, 0, 6)},
       {type:"learn", title:"ऋ से अः", cards:cards(SWAR, 6, 13)},
       {type:"trace", title:"लिखो: अ आ इ ई", glyphs:lettersOf(SWAR, 0, 4)},
       {type:"trace", title:"लिखो: उ ऊ ए ऐ", glyphs:["उ","ऊ","ए","ऐ"]},
       {type:"trace", title:"लिखो: ओ औ अं", glyphs:["ओ","औ","अं"]},
       {type:"mcq", title:"पहला अक्षर", gen:"firstLetter", args:{pool:pool(SWAR, 0, 13), letters:SW10.concat(["अं"])}},
       {type:"memory", title:"अक्षर और चित्र", pairs:pool(SWAR, 0, 13).map(p => [p.f, {pic:p.pic, say:p.w}])},
       {type:"dots", title:"अ से औ तक जोड़ो", seq:SW10, shape:"star", pic:"⭐"},
       {type:"quiz", title:"अपनी जाँच करो", gens:[["firstLetter",{pool:pool(SWAR, 0, 13), letters:SW10}],["letterPic",{pool:pool(SWAR, 0, 13)}],["seqGap",{seq:SW10}]], rounds:6}
     ]},
    {id:"v1", title:"व्यंजन: क से ञ", en:"Consonants 1", icon:"क", sticker:"🦚",
     goals:["क-वर्ग और च-वर्ग पहचानना", "हर अक्षर से एक शब्द बोलना", "क ख ग घ, च छ ज झ लिखना"],
     note:"Hindi consonants come in families of five (वर्ग). Say each family like a little song: क ख ग घ ङ.",
     home:"Find a कप, a घड़ी and a चम्मच at home and say their first letters.",
     pages:[
       {type:"learn", title:"क-वर्ग", cards:cards(VY, 0, 5)},
       {type:"learn", title:"च-वर्ग", cards:cards(VY, 5, 10)},
       {type:"trace", title:"लिखो: क ख ग घ", glyphs:lettersOf(VY, 0, 4)},
       {type:"trace", title:"लिखो: च छ ज झ", glyphs:lettersOf(VY, 5, 9)},
       {type:"mcq", title:"पहला अक्षर", gen:"firstLetter", args:{pool:pool(VY, 0, 10), letters:lettersOf(VY, 0, 10)}},
       {type:"match", title:"अक्षर और चित्र", pairs:pool(VY, 0, 10).map(p => [p.f, {pic:p.pic, say:p.w}])},
       {type:"pop", title:"ख वाले गुब्बारे", target:"ख", pool:["र","व","ग","ब"], tip:"ख is easy to confuse with र+व written together. Trace ख slowly and notice the loop joins."},
       {type:"quiz", title:"अपनी जाँच करो", gens:[["firstLetter",{pool:pool(VY, 0, 10), letters:lettersOf(VY, 0, 10)}],["letterPic",{pool:pool(VY, 0, 10)}],["seqGap",{seq:lettersOf(VY, 0, 10)}]], rounds:6}
     ]},
    {id:"v2", title:"व्यंजन: ट से म", en:"Consonants 2", icon:"ट", sticker:"🐒",
     goals:["ट-वर्ग, त-वर्ग और प-वर्ग पहचानना", "इन अक्षरों को लिखना"],
     note:"ट and त, ड and द sound close. Say them slowly and let your child feel where the tongue touches.",
     home:"Look at a newspaper headline together and circle every प and म you find.",
     pages:[
       {type:"learn", title:"ट-वर्ग", cards:cards(VY, 10, 15)},
       {type:"learn", title:"त-वर्ग", cards:cards(VY, 15, 20)},
       {type:"learn", title:"प-वर्ग", cards:cards(VY, 20, 25)},
       {type:"trace", title:"लिखो: ट ठ ड ढ", glyphs:lettersOf(VY, 10, 14)},
       {type:"trace", title:"लिखो: त थ द ध न", glyphs:lettersOf(VY, 15, 20)},
       {type:"trace", title:"लिखो: प फ ब भ म", glyphs:lettersOf(VY, 20, 25)},
       {type:"mcq", title:"पहला अक्षर", gen:"firstLetter", args:{pool:pool(VY, 10, 25), letters:lettersOf(VY, 10, 25)}},
       {type:"memory", title:"अक्षर और चित्र", pairs:pool(VY, 10, 25).map(p => [p.f, {pic:p.pic, say:p.w}])},
       {type:"pop", title:"भ वाले गुब्बारे", target:"भ", pool:["म","स","ब","ग"], tip:"भ and म look alike. भ has a little extra curl on the left."},
       {type:"quiz", title:"अपनी जाँच करो", gens:[["firstLetter",{pool:pool(VY, 10, 25), letters:lettersOf(VY, 10, 25)}],["letterPic",{pool:pool(VY, 10, 25)}],["seqGap",{seq:lettersOf(VY, 10, 25)}]], rounds:6}
     ]},
    {id:"v3", title:"व्यंजन: य से ज्ञ", en:"Consonants 3", icon:"य", sticker:"🐯",
     goals:["य से ज्ञ तक अक्षर पहचानना", "स्वर और व्यंजन में अंतर करना"],
     note:"क्ष, त्र and ज्ञ are joined letters. At this age, recognising them is enough.",
     home:"Say a letter; your child answers 'स्वर' or 'व्यंजन'.",
     pages:[
       {type:"learn", title:"य र ल व श ष", cards:cards(VY, 25, 31)},
       {type:"learn", title:"स ह क्ष त्र ज्ञ", cards:cards(VY, 31, 36)},
       {type:"trace", title:"लिखो: य र ल व", glyphs:lettersOf(VY, 25, 29)},
       {type:"trace", title:"लिखो: श स ह", glyphs:["श","स","ह"]},
       {type:"mcq", title:"बीच में क्या आएगा?", gen:"seqGap", args:{seq:VYALL}},
       {type:"mcq", title:"स्वर या व्यंजन?", gen:"binary", args:{ask:"यह स्वर है या व्यंजन?", a:{label:"स्वर", items:SW10}, b:{label:"व्यंजन", items:VYALL}}},
       {type:"quiz", title:"अपनी जाँच करो", gens:[["firstLetter",{pool:pool(VY, 25, 36), letters:lettersOf(VY, 25, 36)}],["seqGap",{seq:VYALL}],["binary",{ask:"यह स्वर है या व्यंजन?", a:{label:"स्वर", items:SW10}, b:{label:"व्यंजन", items:VYALL}}]], rounds:6}
     ]},
    {id:"shabd", title:"बिना मात्रा के शब्द", en:"First words", icon:"📖", sticker:"🌸",
     goals:["दो और तीन अक्षर वाले शब्द पढ़ना", "छूटा हुआ अक्षर पहचानना"],
     note:"These words have no मात्रा, so each letter is read with its own 'a' sound: घ-र, घर. The cards spell each word, then say it.",
     home:"Write घर, नल and जल on paper. Your child reads them and points to the real thing.",
     pages:[
       {type:"learn", title:"शब्द पढ़ो", cards:wordCards(WORDS.slice(0, 6))},
       {type:"learn", title:"और शब्द", cards:wordCards(WORDS.slice(6, 12))},
       {type:"mcq", title:"यह क्या है?", gen:"picWord", args:{pool:WORDS}},
       {type:"mcq", title:"छूटा अक्षर", gen:"missing", args:{pool:WORDS, letters:["क","घ","ज","न","ब","म","ल","र","स","ह","श","त","ख","प","फ","द"]}},
       {type:"match", title:"शब्द और चित्र", pairs:WORDS.map(x => [x.w, {pic:x.pic, say:x.w}])},
       {type:"quiz", title:"अपनी जाँच करो", gens:[["picWord",{pool:WORDS}],["wordPic",{pool:WORDS}],["missing",{pool:WORDS, letters:["क","घ","ज","न","ब","म","ल","र","स","ह"]}]], rounds:6}
     ]},
    {id:"ginti", title:"गिनती", en:"Numbers", icon:"१", sticker:"🎈",
     goals:["१ से १० तक गिनना", "संख्या के नाम बोलना", "हिंदी अंक लिखना"],
     note:"Hindi numerals (१, २, ३) are taught alongside 1, 2, 3. Children count objects first, then match the numeral.",
     home:"Count rotis at dinner in Hindi: एक, दो, तीन…",
     pages:[
       {type:"learn", title:"एक से पाँच", cards:CS.range(1, 5).map(n => ({big:DIG[n], pic:PICS[n - 1], n, word:NUMW[n], say:NUMW[n]}))},
       {type:"learn", title:"छह से दस", cards:CS.range(6, 10).map(n => ({big:DIG[n], pic:PICS[n - 1], n, word:NUMW[n], say:NUMW[n]}))},
       {type:"trace", title:"लिखो: १ २ ३ ४ ५", glyphs:DIG.slice(1, 6).map((g, i) => ({g, word:NUMW[i + 1], say:NUMW[i + 1]}))},
       {type:"trace", title:"लिखो: ६ ७ ८ ९", glyphs:DIG.slice(6, 10).map((g, i) => ({g, word:NUMW[i + 6], say:NUMW[i + 6]}))},
       {type:"mcq", title:"गिनो और चुनो", gen:"count", args:{max:10, labels:DIG}},
       {type:"mcq", title:"संख्या का नाम", gen:"numWord", args:{pool:NUMS}},
       {type:"memory", title:"अंक और नाम", pairs:NUMS.map(x => [x.d, x.w])},
       {type:"quiz", title:"अपनी जाँच करो", gens:[["count",{max:10, labels:DIG}],["numWord",{pool:NUMS}],["wordNum",{pool:NUMS}]], rounds:6}
     ]},
    {id:"rang", title:"रंग", en:"Colours", icon:"🎨", sticker:"🌈",
     goals:["दस रंगों के नाम बोलना", "सुनकर रंग पहचानना"],
     note:"Use Hindi colour names during the day: लाल टमाटर, हरा पत्ता.",
     home:"Ask your child to bring something लाल, then something पीला.",
     pages:[
       {type:"learn", title:"मेरे रंग", cards:COLOURS.map(c => ({sw:c.hex, pic:c.pic, word:c.w, say:c.w}))},
       {type:"colour", title:"फलों में रंग भरो", scene:"fruits", names:{apple:"सेब", leaf:"पत्ते", banana:"केले", grapes:"अंगूर", orange:"संतरे"},
        colours:{red:"लाल", green:"हरा", yellow:"पीला", purple:"बैंगनी", orange:"नारंगी", blue:"नीला", pink:"गुलाबी", brown:"भूरा"}},
       {type:"mcq", title:"कौन सा रंग?", gen:"swName", args:{pool:COLOURS}},
       {type:"mcq", title:"रंग ढूँढो", gen:"nameSw", args:{pool:COLOURS}},
       {type:"quiz", title:"अपनी जाँच करो", gens:[["swName",{pool:COLOURS}],["nameSw",{pool:COLOURS}]], rounds:6}
     ]},
    {id:"fj", title:"फल और जानवर", en:"Fruits & animals", icon:"🐘", sticker:"🥭",
     goals:["फलों के नाम बोलना", "जानवरों के नाम बोलना", "फल और जानवर अलग करना"],
     note:"Name the fruits you eat each day in Hindi, and the animals you see on the way to school.",
     home:"At the fruit stall, ask your child to name three fruits in Hindi.",
     pages:[
       {type:"learn", title:"फल", cards:FRUITS.map(f => ({pic:f.pic, word:f.w}))},
       {type:"learn", title:"जानवर", cards:ANIMALS.map(a => ({pic:a.pic, word:a.w}))},
       {type:"sort", title:"फल या जानवर?", bins:[{t:"फल", pic:"🧺"},{t:"जानवर", pic:"🐾"}],
        items:FRUITS.slice(0, 4).map(f => [f.pic, 0, f.w]).concat(ANIMALS.slice(0, 4).map(a => [a.pic, 1, a.w]))},
       {type:"mcq", title:"यह क्या है?", gen:"picWord", args:{pool:FRUITS.concat(ANIMALS)}},
       {type:"memory", title:"चित्र और नाम", pairs:ANIMALS.map(a => [{pic:a.pic, say:a.w}, a.w])},
       {type:"quiz", title:"अपनी जाँच करो", gens:[["picWord",{pool:FRUITS.concat(ANIMALS)}],["wordPic",{pool:FRUITS.concat(ANIMALS)}],["firstLetter",{pool:ANIMALS, letters:ALLLET}]], rounds:6}
     ]},
    {id:"kavita", title:"कविता", en:"Poems", icon:"🎵", sticker:"🐟",
     goals:["दो कविताएँ गाना", "कविता के शब्द पहचानना"],
     note:"These are traditional rhymes. Sing slowly, add hand actions (a swimming fish, a round moon) and let your child finish each line.",
     home:"Sing 'मछली जल की रानी है' at bath time.",
     pages:[
       {type:"rhyme", title:"मछली जल की रानी है", pics:"🐟💧👑", lines:["मछली जल की रानी है,", "जीवन उसका पानी है।", "हाथ लगाओ डर जाएगी,", "बाहर निकालो मर जाएगी।"]},
       {type:"rhyme", title:"चंदा मामा दूर के", pics:"🌙⭐🍽️", lines:["चंदा मामा दूर के,", "पुए पकाएँ बूर के।", "आप खाएँ थाली में,", "मुन्ने को दें प्याली में।"]},
       {type:"mcq", title:"कविता के शब्द", gen:"picWord", args:{pool:[{w:"मछली",pic:"🐟"},{w:"पानी",pic:"💧"},{w:"हाथ",pic:"✋"},{w:"चंदा",pic:"🌙"},{w:"थाली",pic:"🍽️"},{w:"रानी",pic:"👸"}]}},
       {type:"quiz", title:"अपनी जाँच करो", gens:[["picWord",{pool:[{w:"मछली",pic:"🐟"},{w:"पानी",pic:"💧"},{w:"हाथ",pic:"✋"},{w:"चंदा",pic:"🌙"},{w:"थाली",pic:"🍽️"},{w:"रानी",pic:"👸"}]}],["wordPic",{pool:[{w:"मछली",pic:"🐟"},{w:"पानी",pic:"💧"},{w:"चंदा",pic:"🌙"},{w:"थाली",pic:"🍽️"}]}]], rounds:6}
     ]}
  ]
});
})();
