import groupNamesArr from '../assets/groupNames'

// Generate a channel name here
export default () => {
  const color =
    groupNamesArr[Math.floor(Math.random() * (groupNamesArr.length - 1))]
  return `${color}`
}
