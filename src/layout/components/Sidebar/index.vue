<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" v-if="checkAuth(route)" :key="route.path" :item="route" :platformType="platformType" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data(){
    return {
      notMenu:[],
      platformType:0
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      // const route = this.$router.options.routes
      // // const { meta, path } = route
      // console.log(route)
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    let userInfo=JSON.parse(Cookies.get('userInfo'))
    this.notMenu=userInfo.platform.not_menu
    this.platformType=userInfo.platform.type
  },
  methods:{
    checkAuth(route){
      // console.log(route)
      if(route.meta){
        // console.log(route.meta)
        if(this.notMenu.indexOf(route.meta.title)==-1){
          return true
        }else{
          return false
        }
      }else if(route.children){
        let title=route.children[0].meta.title
        if(this.notMenu.indexOf(title)==-1){
          return true
        }else{
          return false
        }
      }
      return true;
    }
  }
}
</script>
