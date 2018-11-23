
<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" v-loading="listLoading" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.tradeAccountNo" placeholder="账户"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="()=>select(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>    
  <div>
    <tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource"></tree-grid>
  </div>
  </section>
</template>

<script>
import { buildOptions,formatters,getAgentOptions } from "../../utils/utils"
import { accountQuest, getDictionary } from "../../api/api"
import {TreeGrid} from '../../components/treeTable/vue'

export default {
  data () {
    return {
       filters:{//查询表单数据
          tradeAccountNo: "",
          name: "",
        },
        listLoading: false,//表格加载中标识
      columns: [
          {text: '姓名',dataIndex: 'name'},
          {text: '账号',dataIndex: 'tradeAccountNo'},
          {text: '账号类型',dataIndex: 'accountType'},          
          {text: '性别',dataIndex: 'sex'},
          {text: '手机号码',dataIndex: 'phoneNo'},
          {text: '邮箱',dataIndex: 'email'},
        ],
      dataSource: [],
    }
  },
  created(){
      
  },
  methods:{
      // 表格数据格式化 状态
      statusFormat(row, col, cellValue){
        return formatters("CommonStatus",cellValue)
      },
      typeFormat(row, col, cellValue){
        return formatters("ExchangeRateTypeEnu",cellValue)
      },    
      buildOption(type){
        return buildOptions(type)
      }, 
      // 获取列表
      select(){
        this.listLoading = true;
        accountQuest.agentTree({
          type: this.filters.tradeAccountNo,
          name: this.filters.name
        }).then(res => {
          this.dataSource = res.content;
          this.listLoading = false;
        }).catch(err=>{this.listLoading = false;});
      },
    },
  components: {
    TreeGrid
  }
}

</script>

 

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

</style>
