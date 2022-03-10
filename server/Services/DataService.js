

var fs = require('fs');
const csv = require('csv-parser');

class DataService {
    
    constructor(data_filename) {
        this.data_filename = data_filename;
    }

    async GetCryptoData() {
        var data_filename = this.data_filename;
        return new Promise(function(resolve) {
            var cryptoData = [];
            fs.createReadStream(data_filename)
            .pipe(csv())
            .on('data', function(row){
                try {
                    cryptoData.push(row);
                }
                catch(err) {
                    // error handler
                    throw new Error(err);
                }
            })
            .on('end',function(){
                resolve(cryptoData);
            }); 
        });
    }
}

module.exports = DataService;