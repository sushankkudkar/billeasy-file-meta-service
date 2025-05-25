import { Readable } from 'stream';

export function webStreamToNodeStream(webStream: ReadableStream): Readable {
    const reader = webStream.getReader();

    return new Readable({
        async read() {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    this.push(null);
                    break;
                }
                this.push(Buffer.from(value));
            }
        },
    });
}
