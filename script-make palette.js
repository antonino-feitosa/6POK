
let colors =
`#A37D2F
#664E1E
#E3AD42
#F0B746
#EEB646
#6499A3
#3E5F66
#8AD4E3
#92E0F0
#80C5D3
#A3602F
#663C1E
#E38542
#F08C46
#C8753B
#67A341
#406629
#8FE35B
#97F060
#7EC850
#90A3A3
#5A6666
#C8E3E2
#D3F0EF
#E0FFFE
#A3A3A3
#636363
#E3E3E3
#F3F3F3
#232323
#A33415
#63200D
#E3481E
#F24D1F
#F04E1F
#A7A684
#63634F
#E3E1B3
#F0EEBD
#C9C89F
#859CA6
#505D63
#B6D5E3
#C0E1F0
#BDDEEC
#A6A621
#636314
#E3E32D
#F0F030
#FFFF33
#A6A69C
#63635D
#E3E3D5
#F0F0E1
#FFFFF0
#420000
#CF0000
#8F0000
#690000
#820000
#290045
#7D00D1
#570091
#40006B
#500085
#910155
#520130
#DE0282
#B8026C
#D1027B
#579162
#315237
#85DE95
#6EB87C
#7DD18C
#5C8291
#334952
#8CC7DE
#74A4B8
#83BBD1`;

let vet = colors.split('\n').map(x => x.substring(1));
console.log(vet);

let names = ['sand', 'water', 'rock', 'grass', 'air', 'dark', 'fire', 'normal', 'ice'
,'eletric', 'holy', 'profane', 'magic', 'psychic', 'ghost', 'metal'];

console.log('GIMP Palette');
console.log('Name:', '6POK Game Palette');
console.log('Columns: 5');
console.log('#');

function toValue(value){
    let str = '';
    if(value < 10){
        str = '  ' + value;
    } else if(value < 100){
        str = ' ' + value;
    } else {
        str = value.toString();
    }
    return str + ', ';
}

let suffix = ['shadow', 'dark', 'light', 'clear', 'normal'];
for(let i=0;i<vet.length;i++){
    let color = vet[i];
    let r = parseInt(color[0] + color[1], 16);
    let g = parseInt(color[2] + color[3], 16);
    let b = parseInt(color[4] + color[5], 16);
    console.log(toValue(r) + toValue(g) + toValue(b) + '\t' + names[Math.floor(i/5)] + ' ' + suffix[i%5]);
}