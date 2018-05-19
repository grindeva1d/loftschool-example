/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

let timeout;

filterNameInput.addEventListener('keyup', function () {

    if (timeout) {
        window.clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
        fillCookies(filterNameInput.value);
    }, 1000);
});

addButton.addEventListener('click', () => {
    let cookieName = addNameInput.value;
    addNameInput.value = '';
    let cookieValue = addValueInput.value;
    addValueInput.value = '';

    addCookie({ table: listTable, name: cookieName, value: cookieValue, callback: addRow });
});

function fillCookies(filter) {
    listTable.innerHTML = '';
    let cookies = parseCookies(filter);

    for (const cookie in cookies) {
        addRow(listTable, cookie, cookies[cookie]);
    }
}

fillCookies();

function parseCookies(filter) {
    return document.cookie.split('; ').reduce((prev, curr) => {
        let [name, value] = curr.split('=');
        if (name && value && (!filter || isMatching(name, filter))) {
            prev[name] = decodeURIComponent(value);
        }
        return prev;
    }, {});
}

function addCookie({ table, name, value, expires, callback }) {
    if (name && value) {
        let cookie = `${name}=${encodeURIComponent(value)}`;
        document.cookie = cookie;
        if (callback) {
            callback(table, name, value);
        }
    }
}

function deleteCookie({ table, name, callback }) {
    if (name) {
        document.cookie = `${name}=; expires=${new Date(Date.now() - 1).toGMTString()}`;
        if (callback) {
            callback(table, name);
        }
    }
}

function addRow(table, name, value) {

    let row = findRow(table, name);

    if (row) {
        row.cells[1].textContent = value;
    } else {
        let row = table.insertRow();
        let nameCell = row.insertCell();
        let valueCell = row.insertCell();
        let deleteCell = row.insertCell();
        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', () => {
            deleteCookie({ table: table, name: name, callback: deleteRow });
        });
        nameCell.textContent = name;
        valueCell.textContent = value;
        deleteCell.appendChild(deleteBtn);
    }
}

function deleteRow(table, name) {
    let row = findRow(table, name);
    if (row) {
        table.deleteRow(row);
    }
}

function findRow(table, name) {
    return [...table.rows].find((row) => row.cells[0].textContent == name);
}

function isMatching(full, chunk) {
    return !!~full.toLowerCase().indexOf(chunk.toLowerCase());
}