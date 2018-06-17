import r from 'rethinkdb';
import { Switch } from 'react-router-dom';
import swal from 'sweetalert2';

const dbConfig = {
    db: 'database',
    host: '18.219.37.66',
    port: 28015
}

const errorToast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  customClass: 'unclickable',
  allowEscapeKey: false
});

const connectToDbSetupChanges = (stores) => {
    return new Promise((resolve, reject) => {
        r.connect({ db: dbConfig.db, host: dbConfig.host, port: dbConfig.port }, (err, conn) => {
            if (err) {
              reject(err);
              errorToast({
                type: 'error',
                title: 'Database Not Connected!'
              });
              throw err;
            }
            resolve(conn);
            stores.forEach(store => {
                let arr = [];
                r.table(store.table).changes({ includeInitial: true, includeStates: true, includeTypes: true }).run(conn, (err, cursor) => {
                    if (err) throw err;
                    cursor.each((err, row) => {
                        console.log(row);
                        if (err) throw err;
                        switch (row.type) {
                            case 'initial':
                                arr.push(row.new_val)
                                break;
                            case 'remove':
                                console.log("removing");
                                store.removeById(row.old_val.id);
                                break;
                            case 'change':
                                store.update(row.new_val)
                                break;
                            case 'add':
                                store.insert(row.new_val)
                                break;
                        }
                        if (row.state === 'ready') {
                            store.setInitialData(arr);
                        }
                    })
                });
            });
        });
    })
}

export default connectToDbSetupChanges;
