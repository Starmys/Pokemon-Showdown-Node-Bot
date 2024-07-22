exports.commands = {
    r: 'recital',
    poetry: 'recital',
    recital: function (arg, by, room) {
        if (toId(by) !== 'starmind' && toId(by)!=='pschinadraft' &&toId(by)!=='zerodragon123') return false;
        const delay = (parseInt(arg)) || 250;
        fs.readFileSync("./tmp.txt").toString().split("\n").forEach((line, i) => setTimeout(() => Bot.say(room, line), i * delay));
    }
};
