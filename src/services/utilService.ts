export class UtilService {
    public static getRandomRecords<T>(array: T[], count: number): T[] {
        const shuffled = array.sort(() => 0.5 - Math.random())
        return shuffled.slice(0, count)
    }
}