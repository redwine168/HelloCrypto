

var fs = require('fs');
const csv = require('csv-parser');


// Class for parsing the crypto data (in this case contained in a local csv file)
class DataService {
    
    constructor(data_filename) {
        this.data_filename = data_filename;
    }

    // Parse the crypto data from the csv and return it
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