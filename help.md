## 生成环境下无法使用复制粘贴的问题

//解决生产环境无法使用复制粘贴

const createMenu = () => {
    if (process.env.NODE_ENV !== 'development') {
      const template = [{
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
          {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click () {
              app.quit()
            }
          }
        ]
      }]
      menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
    }
  }

  ### CSS设置虚线的密度

  ### vuejs  18国语言的实际构建

  https://github.com/zhubangbang/translation-by-gulp


  ###   Computed property "defaultGas" was assigned to but it has no setter.

  https://github.com/ElemeFE/mint-ui/issues/1000

  ###  Invalid prop: type check failed for prop "value". Expected Number, Array, got String.

vue的model 通过computed来设置的了

            <el-form-item label="手续费">
              <div class="block">
                <el-slider
                  v-model="defaultGas"
                  :min='0.00001'
                  :max='0.01'
                  show-input
                  :step="0.001"
                  input-size	= 'mini'
                  show-stops>
                </el-slider>
              </div>
            <span class='speculate-wrap'>预估手续费：<strong>{{ defaultGas }}</strong> CZR</span>
          </el-form-item>