import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

/* Exported so we can use it in the controller */
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsaPerPage: RES_PER_PAGE
    },
    bookmarks: []
};
/* The state contains all the data that we need in order to build our application */


/* Exported so we can use it in the controller 
 * Responsable for fetching the recipe data from the Forkify API.
*/
const createRecipeObject = function(data) {
    const {recipe} = data.data;
        return {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key && { key: recipe.key }),// AND operator to shortcircuiting
        };
}

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        
        state.recipe = createRecipeObject(data);

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

        console.log(state.recipe);
    } catch (err) {
        console.error(`☢ ${err}`); // TODO: Remove log error for production
        throw err;
    }
};

export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        
        //data.data.recipes <- array of all objects
        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key: recipe.key }),
            }
        });
        state.search.page = 1;
    } catch (err) {
        console.error(`☢ ${err}`); // TODO: Remove log error for production
        throw err;
    }
};

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsaPerPage;
    const end = (page * state.search.resultsaPerPage);
    // slice() will not include the last value that we pass at the end.
    return state.search.results.slice(start, end)
};

export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ingredient => {
        // newQt = oldQt * newServs / oldServs
        ingredient.quantity = ingredient.quantity * newServings / state.recipe.servings;
    });
    state.recipe.servings = newServings; 
};

/* Persisting data in local storage */
const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);
    // Mark current recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
}

export const deleteBookmark = function(id) {
    // Delete bookmark
    const index = state.bookmarks.findIndex(element => element.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
}

/* Taking data out from local storage */
const init = function() {
    const storageBookmarks = localStorage.getItem('bookmarks');
    if (storageBookmarks) state.bookmarks = JSON.parse(storageBookmarks);
}

init();


/* Just for debbugging */
const clearBookmarks = function() {
    localStorage.clear('bookmarks');
}

export const uploadRecipe = async function(newRecipe) {
    const ingredients = Object.entries(newRecipe).filter(
        entry => entry[0].startsWith('ingredient') && entry[1] !== ''
    ).map(ingredientArray => {
        const ingredient = ingredientArray[1].split(',').map(element => element.trim());
        if(ingredient.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format 😅');
        const [quantity, unit, description] = ingredient;
        return { 
            quantity: quantity ? +quantity : null, 
            unit, 
            description };
    });
    
    const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients,
    };

    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
}