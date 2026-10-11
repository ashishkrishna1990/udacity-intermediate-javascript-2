/* let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
} */

let store = Immutable.Map({
    user: Immutable.Map({ name: "Student" }),
    apod: Immutable.Map(),
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
})

// add our markup to the page
const root = document.getElementById('root')

/* const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
} */

const updateStore = (state, newState) => {
    store = state.merge(newState)
    render(root, store)
}

const render = (rootElement, state) => {
    rootElement.innerHTML = App(state)
}

// create content
const App = (state) => {
    const user = state.get('user')
    const rovers = state.get('rovers')
    const apod = state.get('apod')

    return `
        <header>
            ${Greeting(user.get('name'))}
        </header>
        <main>
            <section>
                <h3>Mars Rovers</h3>
                <div>
                    <p>These are the list of the rovers that have landed on Mars.</p>
                    ${RoversList(rovers)}
                </div>
            </section>
            <section>
                <h3>Astronomy picture of the day</h3>
                <div>
                    <p>
                        One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                        the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                        This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                        applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                        explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                        but generally help with discoverability of relevant imagery.
                    </p>
                    ${ImageOfTheDay(apod)}
                </div>
            </section>
        </main>
        <footer>
            <p>Built by Ashish Krishna using NASA APIs.
            </p>
        </footer>
    `
}

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Pure function that renders list of rovers
const RoversList = (rovers) => {
    return `
        <ul>
            ${rovers.map(rover => `<li onclick="getRoverData('${rover}')">${rover}</li>`).join('')}
        </ul>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    const image = apod.get('image')

    if (image === null || image.isEmpty()) {
        return `<p>Loading Astronomy Picture of the Day...</p>`
    }

    // check if the photo of the day is actually type video!
    if (image.get('media_type') === "video") {
        return (`
            <p>See today's featured video <a href="${image.get('url')}">here</a></p>
            <p>${image.get('title')}</p>
            <p>${image.get('explanation')}</p>
        `)
    } else {
        return (`
            <h3>${image.get('title')}</h3>
            <img src="${image.get('hdurl')}" height="350px" width="100%" />
            <p>${image.get('explanation')}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// API call to get image of the day
const getImageOfTheDay = async () => {
    try {
        const response = await fetch(`http://localhost:3000/apod`)
        const data = await response.json()
        updateStore(store, Immutable.Map({ apod: Immutable.fromJS(data) }))
        console.log(store)
    } catch (error) {
        console.error("Error fetching image of the day:", error)
    }
}

// API call to get rover data
const getRoverData = (rover) => {

}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    getImageOfTheDay(store)
    render(root, store)
})