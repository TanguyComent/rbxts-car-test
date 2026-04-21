export namespace GenerateUUID {
    export function generateHexSegment(length = 32): string {
        let segment = ""

        for (let i = 0; i < length; i++) {
            if (i > 0 && i % 4 === 0) {
                segment += "-"
            }

            const randomHex = math.random(0, 15)
            segment += string.upper(string.format("%x", randomHex))
        }

        return segment
    }
}