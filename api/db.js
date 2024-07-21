import { BACKEND_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '@env';

const CLIENT_ID = GITHUB_CLIENT_ID;
const CLIENT_SECRET = GITHUB_CLIENT_SECRET;

const BACKEND = BACKEND_URL;

const api = {
  users: {
    async login(user, password) {
      try {
        const response = await fetch(BACKEND + '/api/Acceso/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            correo: user.email,
            clave: password,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          console.log('User login:', result);
          return result
        } else {
          console.error('Login failed:', result);
          return { isSuccess: false }
        }
      } catch (error) {
        console.error('Error logging user:', error);
        return { isSuccess: false }
      }
    },
    async register(user) {
      try {
        const response = await fetch(BACKEND + '/api/Acceso/Register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            usuario: user.username,
            correo: user.email,
            clave: user.password,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          console.log('User registered:', result);
          return result
        } else {
          console.error('Registration failed:', result);
          return { isSuccess: false }
        }
      } catch (error) {
        console.error('Error registering user:', error);
        return { isSuccess: false }
      }
    },
    async authenticate(code) {
      try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
          }),
        });

        const tokenData = await tokenResponse.json();

        const userResponse = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `token ${tokenData.access_token}`
          }
        });

        const userData = await userResponse.json();
        if (!userData.email) {
          const emailsResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
              Authorization: `token ${tokenData.access_token}`
            }
          });

          const emailsData = await emailsResponse.json();
          const primaryEmail = emailsData?.find(email => email.primary && email.verified);
          if (primaryEmail) {
            userData.email = primaryEmail.email;
          }
        }
        // console.log(userData)
        // const userExists = await api.users.exists(userData)

        return { user: userData, token: tokenData.access_token }
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    },
    async exists(user) {
      try {
        const response = await fetch(BACKEND + '/api/Acceso/loginDirecto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            correo: user.email,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          return data;
        } else {
          console.error('Check user failed:', data);
          return data
        }
      } catch (error) {
        console.error('Error checking user:', error);

        return { isSuccess: false }
      }
    }
  },
  recipes: {
    async uploadRecipe(recipe) {
      try {
        const response = await fetch(BACKEND + '/api/Recetas/Crear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            titulo: recipe.title,
            descripcion: recipe.description,
            instrucciones: recipe.instructions,
            foto_receta: recipe.photo,
            usuario_id: recipe.userId,
            fecha_creacion: new Date().toISOString(),
            recetas_Ingredientes: recipe.ingredients.map(ingredient => ({
              id_ingrediente: ingredient.id,
              ingrediente: ingredient.name,
            })),
          }),
        });

        const result = await response.json();
        if (response.ok) {
          console.log('Recipe uploaded:', result);
          return { isSuccess: true, data: result };
        } else {
          console.error('Upload recipe failed:', result);
          return { isSuccess: false };
        }
      } catch (error) {
        console.error('Error uploading recipe:', error);
        return { isSuccess: false };
      }
    },
  }
}

export default api;