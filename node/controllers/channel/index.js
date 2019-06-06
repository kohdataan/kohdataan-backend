import axios from 'axios'

const mattermostUrl =
  process.env.MATTERMOST_URL || 'http://mattermost:8000/api/v4'

export const sendImageToChannel = (req, res) => {
  res.status(501).send('send image to channel')
}

export const sendAudioToChannel = (req, res) => {
  res.status(501).send('send audio to channel')
}

export const leaveChannel = (req, res) => {
  res.status(501).send('leave channel')
}

export const getChannelUsers = async (req, res) => {
  const { id } = req.params
  try {
    axios.defaults.headers.common.Authorization = `Bearer ${
      process.env.MASTER_TOKEN
    }`
    const userIds = await axios.get(`${mattermostUrl}/channels/${id}/members`)
    const { data } = userIds
    const ids = data.map(user => user.user_id)
    const usersResponse = await axios.post(`${mattermostUrl}/users/ids`, ids)
    const users = usersResponse.data
    const userDetails = users.map(user => {
      const { id, username, email, nickname } = user
      return { id, username, email, nickname }
    })
    return res.status(200).send({
      success: true,
      message: 'Channel users fetched',
      userDetails,
    })
  } catch (e) {
    console.log(e)
    return res.status(500).send({
      success: false,
      message: 'Error while fetching channel users',
    })
  }
}
