declare module '@meting/core' {
  export default class Meting {
    constructor(platform: string)
    format(format: boolean): void
    playlist(id: string): Promise<string>
    url(id: number | string, bitrate: number): Promise<string>
    pic(id: string | number, size?: number): Promise<string>
  }
}
