export class UtilService {
    public static getRandomRecords<T>(array: T[], count: number): T[] {
        const shuffled = array.sort(() => 0.5 - Math.random())
        return shuffled.slice(0, count)
    }

    public static async splitLongString(longString: string, maxLength: number) {
        const result = []
        let startIndex = 0

        while (startIndex < longString.length) {
            const slice = longString.slice(startIndex, startIndex + maxLength)
            result.push(slice)
            startIndex += slice.length
        }
        
        return result
    }
}