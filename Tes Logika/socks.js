const countPairs = (socks) => {
    let sockCount = {}

    for (let sock of socks) {
        if (sockCount[sock]) 
            sockCount[sock] += 1
        else 
            sockCount[sock] = 1
    }

    let totalPairs = 0
    for (let count in sockCount)
        totalPairs += Math.floor(sockCount[count] / 2)

    return totalPairs
}

const input_data = [5, 7, 7, 9, 10, 4, 5, 10, 6, 5]
// const input_data = [6, 5, 2, 3, 5, 2, 2, 1, 1, 5, 1, 3, 3, 3, 5]
// const input_data = [1, 1, 3, 1, 2, 1, 3, 3, 3, 3]

console.log(countPairs(input_data))