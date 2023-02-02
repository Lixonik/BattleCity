let recordTable = document.getElementById('recordTable');

const getTable = () => {
    if (localStorage.getItem('table') === null)
        localStorage.setItem('table', JSON.stringify({}));

    raw = localStorage.getItem('table')
    return JSON.parse(raw);
}

const updateTable = (key, value) => {
    let table = getTable();
    if (key in table && table[key] > value) return;

    table[key] = value;

    localStorage.setItem('table', JSON.stringify(table));
}

const viewTable = () => {
    let table = getTable();
    console.log(table);
    recordTable.innerHTML = "<tr><th>Псевдоним</th><th>Рекорд</th></tr>";
    for (let element in table) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');

        td.innerHTML = element;
        tr.appendChild(td);

        td = document.createElement('td');
        td.innerHTML = table[element];
        tr.appendChild(td);

        recordTable.appendChild(tr);
    }
}

viewTable();