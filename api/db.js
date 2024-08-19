import { BACKEND_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "@env";

const CLIENT_ID = GITHUB_CLIENT_ID;
const CLIENT_SECRET = GITHUB_CLIENT_SECRET;

const BACKEND = BACKEND_URL;

const api = {
	users: {
		// Funciones relacionadas con usuarios...
		async login(user, password) {
			try {
				const response = await fetch(BACKEND + "/api/Acceso/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						correo: user.email,
						clave: password,
					}),
				});

				const result = await response.json();
				if (response.ok) {
					return result;
				} else {
					console.error("Login failed");
					return { isSuccess: false };
				}
			} catch (error) {
				console.error("Error logging user:", error);
				return { isSuccess: false };
			}
		},
		// Otras funciones relacionadas con usuarios...
	},
	recipes: {
		async uploadRecipe(recipe, token) {
			try {
				const response = await fetch(BACKEND + "/api/Recetas/Ingresar", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						titulo: recipe.title,
						descripcion: recipe.description,
						instrucciones: recipe.instructions,
						foto_receta: recipe.photo,
						usuario_id: recipe.userId,
						fecha_creacion: recipe.fecha_creacion,
						porciones: recipe.porciones,
						likes: 0,
					}),
				});

				const text = await response.text();

				const result = JSON.parse(text);
				if (response.ok) {
					return { isSuccess: true, data: result };
				} else {
					console.error("Upload recipe failed:", result);
					return { isSuccess: false };
				}
			} catch (error) {
				console.error("Error uploading recipe:", error);
				return { isSuccess: false };
			}
		},

		async uploadIngredient(ingredient, token) {
			try {
				const response = await fetch(`${BACKEND}/api/Ingredientes/Ingresar`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(ingredient),
				});

				const result = await response.json();
				if (response.ok) {
					return { isSuccess: true, data: result };
				} else {
					console.error("Upload ingredient failed:", result);
					return { isSuccess: false };
				}
			} catch (error) {
				console.error("Error uploading ingredient:", error);
				return { isSuccess: false };
			}
		},

		async relateIngredientsToRecipe(recipeId, ingredientsWithQuantities, token) {
			try {
				const results = [];
				for (const { ingredientId, quantity } of ingredientsWithQuantities) {
					const response = await fetch(
						`${BACKEND}/api/RecetasIngredientes/Ingresar`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
							body: JSON.stringify({
								id_receta: recipeId,
								id_ingrediente: ingredientId,
								cantidad: quantity,  // Aquí se agrega la cantidad del ingrediente
							}),
						}
					);
		
					const result = await response.text();
					if (response.ok) {
						try {
							results.push(JSON.parse(result));
						} catch (e) {
							console.error("Error parsing JSON response:", e);
							console.error("Response text:", result);
							return { isSuccess: false };
						}
					} else {
						console.error("Relate ingredient to recipe failed:", result);
						console.error("Response text:", result);
						return { isSuccess: false, data: results };
					}
				}
				console.log("Ingredients related to recipe:", results);
				return { isSuccess: true, data: results };
			} catch (error) {
				console.error("Error relating ingredients to recipe:", error);
				return { isSuccess: false };
			}
		},		
		
		async relateTagsToRecipe(recipeId, tagIds, token) {
			try {
				const results = [];
				for (const tagId of tagIds) {
					const response = await fetch(
						`${BACKEND}/api/RecetasTags/Ingresar`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
							body: JSON.stringify({
								id_receta: recipeId,
								id_tag: tagId,
							}),
						}
					);

					const result = await response.text();
					if (response.ok) {
						try {
							results.push(JSON.parse(result));
						} catch (e) {
							console.error("Error parsing JSON response:", e);
							console.error("Response text:", result);
							return { isSuccess: false };
						}
					} else {
						console.error("Relate tag to recipe failed:", result);
						console.error("Response text:", result);
						return { isSuccess: false, data: results };
					}
				}
				console.log("Tags related to recipe:", results);
				return { isSuccess: true, data: results };
			} catch (error) {
				console.error("Error relating tags to recipe:", error);
				return { isSuccess: false };
			}
		},

		async uploadImage(imageUri, token) {
			const url = BACKEND + "/api/Imagen/subirimagen";

			// Extraer el nombre original de la imagen del URI
			const filename = imageUri.split("/").pop();
			const match = /\.(\w+)$/.exec(filename);
			const type = match ? `image/${match[1]}` : `image`;

			const formData = new FormData();
			formData.append("image", {
				uri: imageUri,
				name: filename, // Utilizar el nombre original de la imagen
				type: type, // Definir el tipo basado en la extensión
			});

			try {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				});

				const result = await response.json();

				if (response.ok) {
					return { isSuccess: true, url: result.url };
				} else {
					console.error("Upload image failed:", result);
					return { isSuccess: false };
				}
			} catch (error) {
				console.error("Error uploading image:", error);
				return { isSuccess: false };
			}
		},

		// Otras funciones para búsqueda de recetas...
	},
	ingredients: {
		async list(token) {
			const URL = BACKEND + "/api/Ingredientes/Listar";
			const options = {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				const response = await fetch(URL, options);
				const result = await response.json();

				if (!response.ok) {
					console.error(
						`List ingredients failed: ${result.message || "Unknown error"}`,
					);
					return {
						isSuccess: false,
						message: result.message || "Search failed",
					};
				}

				return {
					isSuccess: true,
					ingredients: formatIngredients(result),
				};
			} catch (error) {
				console.error("Error searching ingredients:", error);
				return { isSuccess: false, message: error.message };
			}
		},
	},
	tags: {
		async list(token) {
			const URL = `${BACKEND}/api/Tags/Listar`;
			const options = {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				const response = await fetch(URL, options);
				const result = await response.json();

				if (!response.ok) {
					console.error(
						`List tags failed: ${result.message || "Unknown error"}`,
					);
					return {
						isSuccess: false,
						message: result.message || "Search failed",
					};
				}

				return {
					isSuccess: true,
					tags: formatTags(result),
				};
			} catch (error) {
				console.error("Error listing tags:", error);
				return { isSuccess: false, message: error.message };
			}
		},
	},
	pantry: {
		// Funciones para manejar la despensa...
		async list(token) {
			const URL = `${BACKEND}/api/Despensa/ListarDespensa`;
			const options = {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				const response = await fetch(URL, options);
				const result = await response.json();

				if (!response.ok || !result.isSuccess) {
					console.error(
						`List pantry items failed: ${result.message || "Unknown error"}`,
					);
					return {
						isSuccess: false,
						message: result.message || "No se encontraron registros.",
					};
				}

				return {
					isSuccess: true,
					pantryItems: result.despensa.map((item) => ({
						id_ingrediente: item.id_ingrediente,
						nombre: item.nombre,
						cantidad: item.cantidad,
						fecha_agregado: item.fecha_agregado,
					})),
				};
			} catch (error) {
				console.error("Error searching pantry items:", error);
				return { isSuccess: false, message: error.message };
			}
		},

		async addOrUpdateItem(item, token) {
			const URL = `${BACKEND}/api/Despensa/agregarActualizarDespensa`;
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(item),
			};

			try {
				const response = await fetch(URL, options);
				const result = await response.json();

				if (response.ok) {
					console.log("Response from API:", result); // Debugging line
					return { isSuccess: true, data: result };
				} else {
					console.error("Add or update pantry item failed:", result);
					return { isSuccess: false, message: result.message };
				}
			} catch (error) {
				console.error("Error adding/updating pantry item:", error);
				return { isSuccess: false, message: error.message };
			}
		},

		// Otras funciones para actualizar, eliminar...
	},
};

function formatRecipes(array) {
	if (!array?.length) {
		return [];
	}

	return array.map((recipe) => ({
		id: recipe.id_receta,
		title: recipe.titulo ?? "Moro con Carne",
		description: recipe.descripcion ?? "Nutritiva llena en grasas",
		createdAt: recipe.fecha_creacion ?? "",
		image: isValidURL(recipe.foto_receta) ? recipe.foto_receta : "",
		ingredients: formatIngredients(recipe.ingredientes), // Assuming no change in ingredients structure
		instructions: recipe.instrucciones ?? [],
		likes: recipe.likes ?? 100,
		servings: recipe.porciones ?? 1,
		userId: recipe.usuario_id,
		username: recipe.usuario_nombre ?? "",
	}));
}

export function formatIngredients(array) {
	if (!array?.length) {
		return [];
	}

	return array.map((i) => ({
		id: i.id_ingrediente,
		name: i.nombre ?? "Desconocido",
		quantity: i.cantidad ?? 0,
	}));
}

function formatTags(array) {
	if (!array?.length) {
		return [];
	}

	return array.map((i) => ({ id: i.id_tag, name: i.nombre }));
}

function isValidURL(url) {
	try {
		new URL(url);
		return true;
	} catch (error) {
		return false;
	}
}

export default api;
