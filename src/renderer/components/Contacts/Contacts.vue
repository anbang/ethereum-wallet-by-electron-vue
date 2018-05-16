<template>
  <div class="page-contacts">

      <div class="contacts-banner">
        <div class="contacts-center">
          <h1 class="contacts-tit">{{ $t('page_contacts.tit') }}</h1> 
        </div>
      </div>

      <div class="contacts-content">
          <div class="contacts-wrap b-flex">

              <template v-for="contact in database">
                  <div class="contacts-item ">
                      <div class="contacts-avatar">
                        <i class="iconfont ico-avatar">&#xe602;</i>
                      </div>
                      <i class="iconfont delete-contacts" @click="initDeleteInfo(contact)">&#xe613;</i>
                      <div class="contacts-cont">
                          <p class="contacts-remark">{{contact.tag}}</p>
                          <p class="contacts-address">{{contact.address}}</p>
                      </div>  
                  </div>
              </template>

              <!--  ADD  -->
              <div class="contacts-item add-contacts" @click="dialogSwitch.create = true">
                  <div class="contacts-cont">
                    <i class="iconfont icon-add-contacts">&#xe63b;</i>
                    <p class="add-contacts-des">{{ $t('page_contacts.add_dialog') }}</p>
                  </div>  
              </div>

          </div>
      </div>

      <!-- create dialog -->
      <el-dialog :title="$t('page_contacts.add_cont.tit')" 
      width="70%":visible.sync="dialogSwitch.create" @open="initCreateInfo" >

        <el-form :model="createInfo">

          <el-form-item :label="$t('page_contacts.add_cont.tag')" label-width="80px">
            <el-input v-model="createInfo.tag" :placeholder="$t('page_contacts.add_cont.tag_placeholder')" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item :label="$t('page_contacts.add_cont.address')" label-width="80px">
            <el-input v-model="createInfo.address" auto-complete="off" :placeholder="$t('page_contacts.add_cont.address_placeholder')" ></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSwitch.create = false">{{$t('cancel')}}</el-button>
          <el-button type="primary" @click="addContact">{{$t('confirm')}}</el-button>
        </div>
      </el-dialog>

      <!-- delete confirm dialog -->
      <el-dialog
        :title="$t('page_contacts.delete_dialog.title')"
        :visible.sync="dialogSwitch.delete"
        width="60%">
        <p>
          {{deleteInfo.tag}}
        </p>
        <p class="text-regular">{{deleteInfo.address}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogSwitch.delete = false">{{$t('cancel')}}</el-button>
          <el-button type="primary" @click="deleteContact">{{$t('confirm')}}</el-button>
        </span>
      </el-dialog>

</div>
</template>

<script>
export default {
  name: "Contacts",
  data() {
    return {
      dialogSwitch:{
        create:false,
        delete:false
      },
      database:[],
      createInfo: {},
      deleteInfo:{}
    };
  },
  created(){
    this.database=this.$db.get("czr_contacts.contact_ary").value();
    this.initCreateInfo()
  },
  methods: {
    initCreateInfo () {
      this.createInfo = {
        tag: "",
        address: ""
      }
    },
    initDeleteInfo (contact) {
      this.deleteInfo = contact
      this.dialogSwitch.delete = true;
    },


    addContact: function() {
      if (!this.createInfo.tag) {
        this.$message.error(this.$t('page_contacts.msg_info.no_tag'))
        return;
      }
      if (!this.createInfo.address) {
        this.$message.error(this.$t('page_contacts.msg_info.no_address'))
        return;
      }

      let tempCon = {
        tag: this.createInfo.tag,
        address: this.createInfo.address
      };
      if (!this.$db.read().has("czr_contacts.contact_ary").value()) {
        this.$db.read().set("czr_contacts.contact_ary", []).write();
      }
      this.initAddContact(tempCon)
    },

    initAddContact:function(params){
      let  self=this;
      let contact = this.$db.get('czr_contacts.contact_ary')
        .find({ address: params.address }).value()
      if(contact){
          this.$message.error(this.$t('page_contacts.msg_info.exist')+contact.tag)
          return
      }
      //TODO validate contacts address
      this.$db.get('czr_contacts.contact_ary').push(params).write();
      this.database=this.$db.get("czr_contacts.contact_ary").value();
      this.dialogSwitch.create = false;
    },
    deleteContact: function() {
      this.$db.get("czr_contacts.contact_ary").remove({ address: this.deleteInfo.address }).write();
      this.database = this.$db.read().get("czr_contacts.contact_ary").value();
      this.dialogSwitch.delete = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contacts-banner {
  height: 175px;
  background-color: #5a59a0;
  color: #fff;
  width: 100%;
  -webkit-user-select: none;
  position: relative;
}
.contacts-banner .contacts-tit {
  height: 175px;
  text-align: center;
  line-height: 175px;
  font-weight: 400;
  font-size: 30px;
}

/* contacts */
.contacts-wrap {
  /* padding-top: 64px; */
  margin-top: 40px;
  /* width: 100%; */
  /* background: #1E8FAA; */
  padding: 0 20px 40px 20px;
  margin-left: -20px;
  flex-wrap: wrap;
}
.contacts-item {
  width: 218px;
  text-align: center;
  border: 1px transparent;
  padding: 44px 10px 10px 10px;
  position: relative;
  margin: 40px 0 20px 20px;
  background-color: #fff;
  -webkit-user-select: none;
}
.contacts-item.add-contacts {
  border: 1px dashed #dddddd;
  padding-top: 20px;
  /* background: linear-gradient(white,white) padding-box,
    repeating-linear-gradient(-45deg,#ccc 0, #ccc 2px ,white 0,white 8px); */
}
.contacts-item .contacts-avatar {
  position: absolute;
  top: -32px;
  left: 88px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  text-align: center;
  background-color: #4d4d8f;
}

.contacts-item .contacts-avatar .ico-avatar {
  color: #fff;
  font-size: 34px;
  margin-top: 5px;
}
.contacts-item .delete-contacts {
  position: absolute;
  right: 10px;
  top: 10px;
  padding: 10px;
  cursor: pointer;
  text-align: center;
  color: rgb(204, 204, 204);
}
.contacts-item .delete-contacts:hover {
  color: #2d2b5d;
}
.contacts-item .contacts-address {
  max-width: 220px;
  margin-top: 12px;
  color: #9a9c9d;
  table-layout: fixed;
  word-break: break-all;
  overflow: hidden;
}
.add-contacts {
  cursor: pointer;
}
.contacts-item .icon-add-contacts {
  font-size: 32px;
  color: #9a9c9d;
}
.contacts-item .add-contacts-des {
  color: #9a9c9d;
}
.add-contacts:hover {
  border: 1px dashed #b6b3f8;
}
.add-contacts:hover .icon-add-contacts {
  color: #5a59a0;
}
.add-contacts:hover .add-contacts-des {
  color: #5a59a0;
}
</style>
