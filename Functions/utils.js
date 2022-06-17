const Canvas = require("canvas")
let background1 ="./fun.png" 
// ارفع الصورة العاوزها وسميها ب fun.png
module.exports = {
  setLongTimeout:(callback, timeout_ms) => {
    if(timeout_ms> 2147483647){setTimeout(function(){module.exports.setLongTimeout(callback,(timeout_ms- 2147483647))},2147483647)}else {setTimeout(callback,timeout_ms)}
  },
  createFunCanvas:async(word,question,time) => {
    time = `لديك ${time} ثانية`;
    const canvas = Canvas.createCanvas(400 , 200);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage(background1);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center"
    ctx.strokeStyle = '#36393f';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = "23px ahmed"
    ctx.fillStyle = 'black';
    ctx.fillText(word, canvas.width / 2, canvas.height / 1.8);
    ctx.font = "20px ahmed"
    ctx.fillText(time, canvas.width / 2.2, 170);
    ctx.font = "18px ahmed" 
    ctx.fillText(question, canvas.width / 2, 50);
    ctx.beginPath();
    ctx.arc(150, 150, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    return canvas.toBuffer()
  },
  splitMessage:(text, { maxLength = 60, char = '\n', prepend = '', append = '' } = {}) => {
    var _0xd747=["\x72\x65\x73\x6F\x6C\x76\x65\x53\x74\x72\x69\x6E\x67","\x65\x78\x70\x6F\x72\x74\x73","\x6C\x65\x6E\x67\x74\x68","\x73\x70\x6C\x69\x74","\x73\x6F\x6D\x65","\x53\x50\x4C\x49\x54\x5F\x4D\x41\x58\x5F\x4C\x45\x4E","","\x70\x75\x73\x68","\x66\x69\x6C\x74\x65\x72","\x63\x6F\x6E\x63\x61\x74"];text= module[_0xd747[1]][_0xd747[0]](text);if(text[_0xd747[2]]<= maxLength){return [text]};const splitText=text[_0xd747[3]](char);if(splitText[_0xd747[4]]((chunk)=>{return chunk[_0xd747[2]]> maxLength})){throw  new RangeError(_0xd747[5])};const messages=[];let msg=_0xd747[6];for(const chunk of splitText){if(msg&& (msg+ char+ chunk+ append)[_0xd747[2]]> maxLength){messages[_0xd747[7]](msg+ append);msg= prepend};msg+= (msg&& msg!== prepend?char:_0xd747[6])+ chunk};return messages[_0xd747[9]](msg)[_0xd747[8]]((_0x37ffx5)=>{return _0x37ffx5})
  },
  resolveString:(data) => {
    var _0x77c0=["\x73\x74\x72\x69\x6E\x67","\x69\x73\x41\x72\x72\x61\x79","\x0A","\x6A\x6F\x69\x6E"];if( typeof data=== _0x77c0[0]){return data};if(Array[_0x77c0[1]](data)){return data[_0x77c0[3]](_0x77c0[2])};return String(data)
  },
  tax:(number) => {
    var _0xf050=["\x74\x6F\x4C\x6F\x77\x65\x72\x43\x61\x73\x65","\x6B","\x69\x6E\x63\x6C\x75\x64\x65\x73","","\x72\x65\x70\x6C\x61\x63\x65","\x6D","\x62","\x63\x65\x69\x6C"];if(!number||  !parseFloat(number)){return false};let finalNumber=number[_0xf050[0]]();let result;if(finalNumber[_0xf050[2]](_0xf050[1])){result= finalNumber[_0xf050[4]](_0xf050[1],_0xf050[3])* 1000}else {if(finalNumber[_0xf050[2]](_0xf050[5])){result= finalNumber[_0xf050[4]](_0xf050[5],_0xf050[3])* 1000000}else {if(finalNumber[_0xf050[2]](_0xf050[6])){result= finalNumber[_0xf050[4]](_0xf050[6],_0xf050[3])* 1000000000}else {result= finalNumber}}};return result=== 1?1:Math[_0xf050[7]](result/ 0.95)
  },
    isEmoji: (str)=> {
    let emojis = []
    let regexpUnicodeModified = /\p{RI}\p{RI}|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(\u{200D}\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)+|\p{EPres}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})/gu
    str.match(regexpUnicodeModified)?.forEach(c => emojis.push(c))
    str.match(/\d+/g)?.filter(x => x.length >= 18)?.forEach(c => emojis.push(c))
    return emojis || []
  },
}
