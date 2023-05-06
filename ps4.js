let express = require('express');
let router = express.Router();
const request = require('request');
const redis = require('redis');

const client = redis.createClient(6379);

router.get('/', (req, res) => {
    res.send('PS4 home page');
});

router.get('/hi', (req, res) => {
    res.send('PS4 games page');
});

router.get('/search', async (req, res) => {
    const { searchTerm } = req.query;

    // Check if the search term is in the Redis cache
    client.get(searchTerm, async (error, data) => {
        if (error) throw error;

        if (data !== null) {
            // If the data is in the cache, return it
            res.send(JSON.parse(data));
        } else {
            // If the data is not in the cache, fetch it from the API and cache it for 60 seconds
            const url = `https://api.weather.gov/alerts/active?area=${searchTerm}&limit=500`;
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(url);
                const data = await response.json();

                client.setex(searchTerm, 60, JSON.stringify(data));
                res.send(data);
            } catch (err) {
                console.error(err);
                res.status(500).send('Server error');
            }
        }
    });
});


router.get('/weather', async (req, res, next) => {
    try {
        const options = {
            url: 'https://api.weather.gov/alerts/active?area=CA&limit=500',
            headers: {
                'accept': 'application/geo+json',
                'User-Agent': '(billy, bro)'
            }
        };

        const promise = new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(body));
                }
            });
        });

        const { features: alerts } = await promise;

        res.render('weather', { alerts });
    } catch (error) {
        next(error);
    }
});

async function makeRequest() {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch('https://api.weather.gov/alerts/active?area=CA&limit=500', {
        headers: {
            'accept': 'application/geo+json',
            'User-Agent': 'my-app'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to retrieve weather alerts');
    }
    return await response.json();
}


router.get('/weather2', async (req, res, next) => {
    console.log('hi');
    try {
        const data = await makeRequest();
        res.render('weather', { alerts: data.features });
    } catch (error) {
        next(error);
    }
});

router.get('/weather3', (req, res, next) => {
    const state = req.query.state || 'CA';
    console.log('hi');
    const url = `https://api.weather.gov/alerts/active?area=${state}&limit=500`;
    request({
        uri: url,
        headers: {
            'accept': 'application/geo+json',
            'User-Agent': 'my-app'
        }
    }, (error, response, body) => {
        if (error) {
            next(error);
        } else if (response.statusCode !== 200) {
            next(new Error(`Failed to retrieve weather alerts. Status code: ${response.statusCode}`));
        } else {
            const data = JSON.parse(body);
            res.json({ alerts: data.features });

        }
    });
});

module.exports = router;