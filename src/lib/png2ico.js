class PngIcoConverter {
    constructor() {
        this.pngSignature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    }

    async convert(png) {
        if (!this.isPng(png)) {
            throw new Error("It's not a PNG file.");
        }

        const dataView = new DataView(png.buffer);
        const width = dataView.getUint32(16);
        const height = dataView.getUint32(20);

        if (width > 256 || height > 256) {
            throw new Error("The PNG file is too large.");
        }

        const ico = new Uint8Array(22 + png.length);
        const writer = new DataView(ico.buffer);

        writer.setUint16(0, 0, true);
        writer.setUint16(2, 1, true);
        writer.setUint16(4, 1, true);
        writer.setUint8(6, width === 256 ? 0 : width);
        writer.setUint8(7, height === 256 ? 0 : height);
        writer.setUint8(8, 0);
        writer.setUint8(9, 0);
        writer.setUint16(10, 0, true);
        writer.setUint16(12, 0, true);
        writer.setUint32(14, png.length, true);
        writer.setUint32(18, 22, true);

        ico.set(png, 22);

        return ico;
    }

    isPng(png) {
        if (png.length < this.pngSignature.length) {
            return false;
        }

        for (let i = 0; i < this.pngSignature.length; i++) {
            if (png[i] !== this.pngSignature[i]) {
                return false;
            }
        }

        return true;
    }
}

export { PngIcoConverter };