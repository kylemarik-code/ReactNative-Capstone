import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('databaseName');

export async function createTable() {
    await db.execAsync('create table if not exists menuitems (id integer primary key not null, uuid text, category text, title text, price text, description text, imageuri text);');
}

export async function saveMenuItems(menuItems) {
    await db.execAsync('delete from menuitems');
    let i = 0;
    const sqldata = menuItems.menu.map((item) => {
        i += 1;
        return `(${i}, "${item.category}", "${item.name}", "${item.price}", "${item.description}", "${item.image}")`;
    });
    await db.execAsync(`insert into menuitems (id, category, title, price, description, imageuri) values ${sqldata}`);
}

export async function removeTable() {
    await db.execAsync('drop table if exists menuitems');
}

export async function getMenuItems() {
    const menuItems = []
    for await (const row of db.getEachAsync('select * from menuitems')) {
        menuItems.push({
            id: row.id,
            category: row.category,
            title: row.title,
            price: row.price,
            description: row.description,
            uri: row.imageuri
        })
    }
    return menuItems;
}

export async function filterData(text, filters) {
    const sqlCats = `("${filters.join('", "')}")`;
    const sqlQuery = `"%${text}%"`;
    const menuItems = []
    for await (const row of db.getEachAsync(`select * from menuitems where category in ${sqlCats} and title like ${sqlQuery}`)) {
        menuItems.push({
            id: row.id,
            category: row.category,
            title: row.title,
            price: row.price,
            description: row.description,
            uri: row.imageuri
        })
    }
    return menuItems;
}