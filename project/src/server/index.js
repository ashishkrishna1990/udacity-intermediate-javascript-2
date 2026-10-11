require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// Rover mission metadata
const ROVER_METADATA = {
    curiosity: {
        name: 'Curiosity',
        launch_date: 'November 26, 2011',
        landing_date: 'August 6, 2012',
        status: 'Active',
    },
    opportunity: {
        name: 'Opportunity',
        launch_date: 'July 7, 2003',
        landing_date: 'January 25, 2004',
        status: 'Complete',
    },
    spirit: {
        name: 'Spirit',
        launch_date: 'June 10, 2003',
        landing_date: 'January 4, 2004',
        status: 'Complete',
    },
}

// Astronomy picture of the day
app.get('/apod', async (req, res) => {
    try {
        const response = await fetch(`https://science.nasa.gov/wp-json/wp/v2/apod-basic`)
        console.log(response)
        const data = await response.json()
        const image = Array.isArray(data) ? data[0] : (data.image ? (Array.isArray(data.image) ? data.image[0] : data.image) : data)
        res.json({ image })
    } catch (err) {
        console.log('error:', err);
        res.status(500).json({ error: 'Failed to fetch APOD' })
    }
})

// Pure helper functions
const formatRoverPhoto = (photo) => ({
    title: photo.data[0].title,
    description: photo.data[0].description,
    date_created: photo.data[0].date_created,
    img_src: photo.links[0].href
})

const getRecentPhotos = (items, limit = 9) => items.slice(0, limit).map(formatRoverPhoto)

// Mars rover photos
app.get('/rovers/:rover', async (req, res) => {
    const rover = req.params.rover.toLowerCase()
    console.log(req.params.rover)
    const meta = ROVER_METADATA[rover] || { name: req.params.rover, launch_date: 'N/A', landing_date: 'N/A', status: 'Unknown' }
    try {
        const response = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(req.params.rover)}%20rover&media_type=image`)
        const data = await response.json()
        const items = data.collection.items
        const photos = getRecentPhotos(data.collection.items)
        res.json({ meta, photos })
    } catch (err) {
        console.log('error:', err);
        res.status(500).json({ error: 'Failed to fetch rover photos' })
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))