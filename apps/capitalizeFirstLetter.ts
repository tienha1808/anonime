export function capitalizeFirstLetter (arg: string): string {

    const words = arg.split(' ')
    const capitalWords = words.map(word => {
        return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
    })

    return capitalWords.join(' ')
}