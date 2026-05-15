const API_URL = 'http://localhost:8080/api'

export async function compile(content) {
    const response = await fetch(`${API_URL}/compile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    })

    return response.json()
}