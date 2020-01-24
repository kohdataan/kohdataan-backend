import groupNamesArr from '../assets/groupNames'

// Generate a channel name here
export default (allChannels, newChannelNames) => {
  try {
    // Used old names are channel names where channel is not deleted
    const oldChannelNames =
      allChannels &&
      allChannels.data &&
      allChannels.data
        .filter(channel => channel.delete_at === 0)
        .map(channel => channel.display_name)
    // Mark already generated channels as well as to be generated channel names as used
    const usedNames = oldChannelNames.concat(newChannelNames)
    // Available names are not in the used list
    const available = groupNamesArr.filter(item => !usedNames.includes(item))
    console.log('AVAILABLE LEN', available.length)
    let color
    if (available && available.length > 0) {
      // Take random available color
      color = available[Math.floor(Math.random() * (available.length - 1))]
    } else {
      // What if there are no more available colors?
      while (usedNames.includes(color)) {
        console.log('generating random number to the string')
        // generate random number at the end of the color
        color =
          groupNamesArr[Math.floor(Math.random() * (groupNamesArr.length - 1))]
        console.log('COLOR', color)
        color += `${Math.random()}`
      }
    }
    console.log('COLOR GENERATED', color)
    return `${color}`
  } catch (e) {
    console.log(e)
    return 'Nimetön ryhmä'
  }
}
