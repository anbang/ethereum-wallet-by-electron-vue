<template>
  <header class="header b-flex">
      <ul class="header-nav">
          <li><router-link to="/" class="active">{{ $t('model_header.home') }}</router-link></li>
          <li><router-link to="/transfer">{{ $t('model_header.transfer') }}</router-link></li>
          <li><router-link to="/contacts">{{ $t('model_header.contacts') }}</router-link></li>
          <li><router-link to="/setting">{{ $t('model_header.setting') }}</router-link></li>
      </ul>
      <div class="has-assets-czr">
          {{ $t('model_header.total') }}
          <strong>{{totalBalance}}</strong>
          {{ $t('unit.czr') }}
      </div>
  </header>

</template>

<script>
import web3 from "@/global/web3.js";
var fs = require("fs");
var path = require("path");

export default {
  name: "Header",
  data() {
    return {};
  },
  computed: {
    totalBalance: function() {
      var self = this;
      //Read file according to file path, return to file list；
      //This is DEMO path
      var filePath = "/Users/broszhu/Library/Ethereum/keystore";
      var files = fs.readdirSync(filePath);

      //Traversing the list of read files and accounts
      var fileAddress = []; //Save the local file's address
      files.forEach(function(filename) {
        //Get the absolute path to the current file
        var filedir = path.join(filePath, filename);
        //Get file information based on file path, return an fs.Stats object
        var stats = fs.statSync(filedir);
        var isFile = stats.isFile();
        // var isDir = stats.isDirectory();
        if (isFile) {
          var tempFile = fs.readFileSync(filedir).toString();
          try {
            var tempAcc = JSON.parse(tempFile).address;
            fileAddress.push(tempAcc);
          } catch (err) {
            // console.log('err', err)
          }
        }
        // if(isDir){
        //     fileDisplay(filedir);//Recursive
        // }
      });

      console.log("fileAddress ", fileAddress);
      for (var k = 0; k < fileAddress.length; k++) {
        var balance = web3.eth.getBalance(fileAddress[k]);
        temoObj = {
          tag: "Account" + (k + 1),
          address: fileAddress[k],
          balance: balance,
          tx_list: []
        };

        //If there is no address added
        if (
          !self.$db
            .read()
            .get("czr_accounts")
            .filter({ address: fileAddress[k] })
            .value().length
        ) {
          self.$db
            .get("czr_accounts")
            .push(temoObj)
            .write();
        }

        //TODO   Judgment of balance change Update correspondence
        total += balance.toNumber();
      }

      //Create a local file and get the amount
      var total = 0;
      var temoObj = null;
      var dbAddress = self.$db
        .read()
        .get("czr_accounts")
        .value();

      console.log("dbAddress:", dbAddress);

      for (var i = 0; i < dbAddress.length; i++) {
        var isExist = false;
        for (var j = 0; j < fileAddress.length; j++) {
          if (dbAddress[i].address == fileAddress[j]) {
            isExist = true;
            break;
          }
        }

        //If it does not exist, delete
        if (!isExist) {
          self.$db
            .read()
            .get("czr_accounts")
            .remove({ address: dbAddress[i].address })
            .write();
        }
      }
      console.log(total);

      return web3.fromWei(total, "ether");
    }
  }
};
</script>

<style scoped>
.header {
  padding: 12px 20px;
  -webkit-user-select: none;
  /* background-color: #f4f4f4; */
}
.header-nav {
  width: 70%;
  text-align: left;
}
.has-assets-czr {
  width: 30%;
  text-align: right;
  font-size: 16px;
}
.header-nav > li {
  display: inline-block;
  font-size: 16px;
  margin-right: 30px;
  color: #34495e;
}
.header-nav a {
  color: #34495e;
  text-decoration: none;
  display: inline-block;
}
.header-nav a:hover {
  color: #2d2b5d;
}
.header-nav a.router-link-exact-active {
  border-bottom: 3px solid #2d2b5d;
}
</style>

