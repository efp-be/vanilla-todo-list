// Clé utilisée pour enregistrer les tâches dans le stockage local.
const STORAGE_KEY = 'todos';

const input = document.getElementById('new-todo');
const addButton = document.getElementById('add-todo');
const list = document.getElementById('todo-list');

// État de l'application : un tableau d'objets { text, done }.
const todos = loadTodos();

/**
 * Vérifie qu'une valeur a bien la forme d'une tâche.
 */
function isValidTodo(todo) {
	return (
		todo !== null &&
		typeof todo === 'object' &&
		typeof todo.text === 'string' &&
		todo.text.trim() !== '' &&
		typeof todo.done === 'boolean'
	);
}

/**
 * Lit les tâches dans le stockage local.
 * Renvoie une liste vide si les données sont absentes ou invalides.
 */
function loadTodos() {
	try {
		const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
		if (!Array.isArray(data)) {
			return [];
		}
		return data.filter(isValidTodo);
	} catch {
		return [];
	}
}

function saveTodos() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/**
 * Crée l'élément <li> d'une tâche avec ses deux boutons.
 */
function createTodoElement(todo, index) {
	const item = document.createElement('li');
	item.classList.add('todo-item');
	item.classList.toggle('done', todo.done);

	const label = document.createElement('span');
	label.textContent = todo.text;

	const actions = document.createElement('div');
	actions.classList.add('todo-actions');

	const checkButton = document.createElement('button');
	checkButton.type = 'button';
	checkButton.classList.add('action-check');
	checkButton.textContent = todo.done ? 'À faire' : 'Terminée';
	checkButton.addEventListener('click', () => toggleTodo(index));

	const deleteButton = document.createElement('button');
	deleteButton.type = 'button';
	deleteButton.classList.add('action-delete');
	deleteButton.textContent = 'Supprimer';
	deleteButton.addEventListener('click', () => deleteTodo(index));

	actions.append(checkButton, deleteButton);
	item.append(label, actions);
	return item;
}

/**
 * Redessine toute la liste à partir de l'état.
 */
function render() {
	list.replaceChildren(...todos.map(createTodoElement));
}

/**
 * Enregistre puis affiche : appelé après chaque modification.
 */
function update() {
	saveTodos();
	render();
}

function addTodo() {
	const text = input.value.trim();
	if (text === '') {
		return;
	}
	todos.push({ text, done: false });
	input.value = '';
	update();
}

function toggleTodo(index) {
	todos[index].done = !todos[index].done;
	update();
}

function deleteTodo(index) {
	todos.splice(index, 1);
	update();
}

addButton.addEventListener('click', addTodo);

input.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		addTodo();
	}
});

render();
