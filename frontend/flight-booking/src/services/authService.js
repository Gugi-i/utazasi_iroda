export const signup = async (name, email, password) => {
    const url = 'https://localhost:8000/auth/signup/user';

    const userData = {
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Signup failed');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
};

export const login = async (email, password) => {
    const url = 'https://localhost:8000/auth/login';

    const credentials = {
        email: email,
        password: password
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
}
