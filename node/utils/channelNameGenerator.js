const nouns = [
  'tractor',
  'thing',
  'cat',
  'dog',
  'laptop',
  'bottle',
  'sticker',
  'chair',
  'glass',
  'table',
  'phone',
]

const colors = [
  'yellow',
  'red',
  'green',
  'blue',
  'purple',
  'orange',
  'cyan',
  'grey',
  'white',
  'black',
]

// Generate a channel name here
export default () => {
  const noun = nouns[Math.floor(Math.random() * (nouns.length - 1))]
  const color = colors[Math.floor(Math.random() * (colors.length - 1))]
  return `${color} ${noun}`
}
