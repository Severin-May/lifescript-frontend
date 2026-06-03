export async function compile(content) {
    try {
        const response = await fetch('/api/compile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        })
        
        if (!response.ok) {
            return {
                valid: false,
                errors: [`Server error (HTTP ${response.status})`]
            }
        }
        
        return response.json()
    } catch (error) {
        return {
            valid: false,
            errors: [`Network error: ${error.message}`]
        }
    }
}