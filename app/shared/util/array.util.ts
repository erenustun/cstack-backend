export const filterArrayByString = (array: [], match: string) => {
  const reg = new RegExp(match)

  return array.filter(function (item) {
    // @ts-ignore
    return typeof item === 'string' && item.match(reg)
  })
}

export const removeRedundantFromArray = (arr: any[]) => {
  return [...new Set(arr)]
}
