class Message {
  constructor(type, sender = null, message = null) {
    this.type = type;
    this.sender = sender;
    this.message = message;
  }
}

export default Message;
