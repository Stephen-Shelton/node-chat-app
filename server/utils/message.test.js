var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message.js');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Tester';
    var text = 'Test Message';
    var message = generateMessage(from, text);
    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from,text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'Tester';
    var latitude = 15;
    var longitude = 19;
    var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    //from prop correct, createdAt a number, url prop is what you expect
    var locationMessage = generateLocationMessage(from, latitude, longitude);
    expect(locationMessage.createdAt).toBeA('number');
    expect(locationMessage).toInclude({from,url});
  });
});
