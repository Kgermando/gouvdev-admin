class Key {
  constructor(
    public auth: string,
    public p256dh: string
  ) { }
}


export class Device {
  constructor(
    public endpoint: string,
    public keys: Key,
  ) { }
}
